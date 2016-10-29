'use strict'

const Q = require('q')
const gulpUtil = require('gulp-util')
const jetpack = require('fs-jetpack')
const asar = require('asar')
const utils = require('../utils')
const childProcess = require('child_process')
let projectDir
let releasesDir
let tmpDir
let finalAppDir
let manifest

let init = function () {
  projectDir = jetpack
  tmpDir = projectDir.dir('./tmp', { empty: true })
  releasesDir = projectDir.dir('./releases')
  manifest = projectDir.read('src/package.json', 'json')
  finalAppDir = tmpDir.cwd(manifest.productName + '.app')

  return new Q()
}

let copyRuntime = function () {
  return projectDir.copyAsync('node_modules/electron/dist/Electron.app', finalAppDir.path())
}

let cleanupRuntime = function () {
  finalAppDir.remove('Contents/Resources/default_app')
  finalAppDir.remove('Contents/Resources/atom.icns')
  return new Q()
}

let packageBuiltApp = function () {
  let deferred = Q.defer()

  asar.createPackageWithOptions(projectDir.path('build'), finalAppDir.path('Contents/Resources/app.asar'), {
    dot: true
  }, function () {
    deferred.resolve()
  })

  return deferred.promise
}

let finalize = function () {
    // Prepare main Info.plist
  let info = projectDir.read('resources/osx/Info.plist')
  info = utils.replace(info, {
    productName: manifest.productName,
    identifier: manifest.osx.identifier,
    version: manifest.version,
    build: manifest.osx.build,
    copyright: manifest.copyright,
    LSApplicationCategoryType: manifest.osx.LSApplicationCategoryType
  })

  finalAppDir.write('Contents/Info.plist', info);

    // Prepare Info.plist of Helper apps
  [' EH', ' NP', ''].forEach(function (helperSuffix) {
    info = projectDir.read('resources/osx/helper_apps/Info' + helperSuffix + '.plist')
    info = utils.replace(info, {
      productName: manifest.productName,
      identifier: manifest.identifier
    })
    finalAppDir.write('Contents/Frameworks/Electron Helper' + helperSuffix + '.app/Contents/Info.plist', info)
  })

    // Copy icon
  projectDir.copy('resources/osx/icon.icns', finalAppDir.path('Contents/Resources/icon.icns'))

  return new Q()
}

let renameApp = function () {
    // Rename helpers
  [' Helper EH', ' Helper NP', ' Helper'].forEach(function (helperSuffix) {
    finalAppDir.rename('Contents/Frameworks/Electron' + helperSuffix + '.app/Contents/MacOS/Electron' + helperSuffix, manifest.productName + helperSuffix)
    finalAppDir.rename('Contents/Frameworks/Electron' + helperSuffix + '.app', manifest.productName + helperSuffix + '.app')
  })
    // Rename application
  finalAppDir.rename('Contents/MacOS/Electron', manifest.productName)
  return new Q()
}

let signApp = function () {
  let identity = utils.getSigningId(manifest)
  let MASIdentity = utils.getMASSigningId(manifest)
  let MASInstallerIdentity = utils.getMASInstallerSigningId(manifest)

  if (utils.releaseForMAS()) {
    if (!MASIdentity || !MASInstallerIdentity) {
      gulpUtil.log('--mas-sign and --mas-installer-sign are required to release for Mac App Store!')
      process.exit(0)
    }
    let cmds = [
      'codesign --deep -f -s "' + MASIdentity + '" --entitlements resources/osx/child.plist -v "' + finalAppDir.path() + '/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib"',
      'codesign --deep -f -s "' + MASIdentity + '" --entitlements resources/osx/child.plist -v "' + finalAppDir.path() + '/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libnode.dylib"',
      'codesign --deep -f -s "' + MASIdentity + '" --entitlements resources/osx/child.plist -v "' + finalAppDir.path() + '/Contents/Frameworks/Electron Framework.framework/Versions/A"',
      'codesign --deep -f -s "' + MASIdentity + '" --entitlements resources/osx/child.plist -v "' + finalAppDir.path() + '/Contents/Frameworks/' + manifest.productName + ' Helper.app/"',
      'codesign --deep -f -s "' + MASIdentity + '" --entitlements resources/osx/child.plist -v "' + finalAppDir.path() + '/Contents/Frameworks/' + manifest.productName + ' Helper EH.app/"',
      'codesign --deep -f -s "' + MASIdentity + '" --entitlements resources/osx/child.plist -v "' + finalAppDir.path() + '/Contents/Frameworks/' + manifest.productName + ' Helper NP.app/"'
    ]

    if (finalAppDir.exists('Contents/Frameworks/Squirrel.framework/Versions/A')) {
            // # Signing a non-MAS build.
      cmds.push('codesign --deep -f -s "' + MASIdentity + '" --entitlements resources/osx/child.plist "' + finalAppDir.path() + '/Contents/Frameworks/Mantle.framework/Versions/A"')
      cmds.push('codesign --deep -f -s "' + MASIdentity + '" --entitlements resources/osx/child.plist "' + finalAppDir.path() + '/Contents/Frameworks/ReactiveCocoa.framework/Versions/A"')
      cmds.push('codesign --deep -f -s "' + MASIdentity + '" --entitlements resources/osx/child.plist "' + finalAppDir.path() + '/Contents/Frameworks/Squirrel.framework/Versions/A"')
    }

    cmds.push('codesign -f -s "' + MASIdentity + '" --entitlements resources/osx/parent.plist -v "' + finalAppDir.path() + '"')

    cmds.push('productbuild --component "' + finalAppDir.path() + '" /Applications --sign "' + MASInstallerIdentity + '" "' + releasesDir.path(manifest.productName + '.pkg') + '"')

    let result = new Q()
    cmds.forEach(function (cmd) {
      result = result.then(function (result) {
        gulpUtil.log('Signing with:', cmd)
        return Q.nfcall(childProcess.exec, cmd)
      })
    })
    result = result.then(function (result) {
      return new Q()
    })
    return result
  } else if (identity) {
    let cmd = 'codesign --deep --force --sign "' + identity + '" "' + finalAppDir.path() + '"'
    gulpUtil.log('Signing with:', cmd)
    return Q.nfcall(childProcess.exec, cmd)
  } else {
    return new Q()
  }
}

let packToDmgFile = function () {
  if (utils.releaseForMAS()) {
    return new Q()
  }

  let deferred = Q.defer()

  let appdmg = require('appdmg')
  let dmgName = manifest.name + '_' + manifest.version + '.dmg'

    // Prepare appdmg config
  let dmgManifest = projectDir.read('resources/osx/appdmg.json')
  dmgManifest = utils.replace(dmgManifest, {
    productName: manifest.productName,
    appPath: finalAppDir.path(),
    icon: projectDir.path('resources/osx/dmg-icon.icns'),
    background: projectDir.path('resources/osx/dmg-background.png')
  })
  tmpDir.write('appdmg.json', dmgManifest)

    // Delete DMG file with this name if already exists
  releasesDir.remove(dmgName)

  gulpUtil.log('Packaging to DMG file...')

  let readyDmgPath = releasesDir.path(dmgName)
  appdmg({
    source: tmpDir.path('appdmg.json'),
    target: readyDmgPath
  })
    .on('error', function (err) {
      console.error(err)
    })
    .on('finish', function () {
      gulpUtil.log('DMG file ready!', readyDmgPath)
      deferred.resolve()
    })

  return deferred.promise
}

let cleanClutter = function () {
  return tmpDir.removeAsync('.')
}

module.exports = function () {
  return init()
        .then(copyRuntime)
        .then(cleanupRuntime)
        .then(packageBuiltApp)
        .then(finalize)
        .then(renameApp)
        .then(signApp)
        .then(packToDmgFile)
        .then(cleanClutter)
        .catch(console.error)
}
