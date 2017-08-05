'use strict'

const Q = require('q')
const gulpUtil = require('gulp-util')
const childProcess = require('child_process')
const jetpack = require('fs-jetpack')
const asar = require('asar')
const utils = require('../utils')

let projectDir
let tmpDir
let releasesDir
let readyAppDir
let manifest

let init = function () {
  projectDir = jetpack
  tmpDir = projectDir.dir('./tmp', { empty: true })
  releasesDir = projectDir.dir('./releases')
  manifest = projectDir.read('src/package.json', 'json')
  readyAppDir = tmpDir.cwd(manifest.name)

  return Q()
}

let copyRuntime = function () {
  return projectDir.copyAsync('node_modules/electron/dist', readyAppDir.path(), { overwrite: true })
}

let cleanupRuntime = function () {
  return readyAppDir.removeAsync('resources/default_app')
}

let packageBuiltApp = function () {
  let deferred = Q.defer()

  asar.createPackageWithOptions(projectDir.path('build'), readyAppDir.path('resources/app.asar'), {
    dot: true
  }, function () {
    deferred.resolve()
  })

  return deferred.promise
}

let finalize = function () {
  let deferred = Q.defer()

  projectDir.copy('resources/windows/icon.ico', readyAppDir.path('icon.ico'))

    // Replace Electron icon for your own.
  let rcedit = require('rcedit')
  rcedit(readyAppDir.path('electron.exe'), {
    'icon': projectDir.path('resources/windows/icon.ico'),
    'version-string': {
      'ProductName': manifest.productName,
      'FileDescription': manifest.description,
      'ProductVersion': manifest.version,
      'CompanyName': manifest.author, // it might be better to add another field to package.json for this
      'LegalCopyright': manifest.copyright,
      'OriginalFilename': manifest.productName + '.exe'
    }
  }, function (err) {
    if (!err) {
      deferred.resolve()
    }
  })

  return deferred.promise
}

let renameApp = function () {
  return readyAppDir.renameAsync('electron.exe', manifest.productName + '.exe')
}

let createInstaller = function () {
  let deferred = Q.defer()

  let finalPackageName = manifest.name + '_' + manifest.version + '.exe'
  let installScript = projectDir.read('resources/windows/installer.nsi')

  installScript = utils.replace(installScript, {
    name: manifest.name,
    productName: manifest.productName,
    author: manifest.author,
    version: manifest.version,
    src: readyAppDir.path(),
    dest: releasesDir.path(finalPackageName),
    icon: readyAppDir.path('icon.ico'),
    setupIcon: projectDir.path('resources/windows/setup-icon.ico'),
    banner: projectDir.path('resources/windows/setup-banner.bmp')
  })
  tmpDir.write('installer.nsi', installScript)

  gulpUtil.log('Building installer with NSIS...')

    // Remove destination file if already exists.
  releasesDir.remove(finalPackageName)

    // Note: NSIS has to be added to PATH (environment variables).
  let nsis = childProcess.spawn('makensis', [
    tmpDir.path('installer.nsi')
  ], {
    stdio: 'inherit'
  })
  nsis.on('error', function (err) {
    if (err.message === 'spawn makensis ENOENT') {
      throw new Error('Can\'t find NSIS. Are you sure you\'ve installed it and added to PATH environment variable?')
    } else {
      throw err
    }
  })
  nsis.on('close', function () {
    gulpUtil.log('Installer ready!', releasesDir.path(finalPackageName))
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
        .then(createInstaller)
        .then(cleanClutter)
        .catch(console.error)
}
