'use strict'

const Q = require('q')
const gulpUtil = require('gulp-util')
const childProcess = require('child_process')
const jetpack = require('fs-jetpack')
const asar = require('asar')
const utils = require('../utils')

let projectDir
let releasesDir
let packName
let packDir
let tmpDir
let readyAppDir
let manifest

const init = function () {
  projectDir = jetpack
  tmpDir = projectDir.dir('./tmp', { empty: true })
  releasesDir = projectDir.dir('./releases')
  manifest = projectDir.read('src/package.json', 'json')
  packName = manifest.name + '_' + manifest.version
  packDir = tmpDir.dir(packName)
  readyAppDir = packDir.cwd('opt', manifest.name)

  return Q()
}

let copyRuntime = function () {
  return projectDir.copyAsync('node_modules/electron/dist', readyAppDir.path(), { overwrite: true })
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
    // Create .desktop file from the template
  let desktop = projectDir.read('resources/linux/app.desktop')
  desktop = utils.replace(desktop, {
    name: manifest.name,
    productName: manifest.productName,
    description: manifest.description,
    version: manifest.version,
    author: manifest.author
  })
  packDir.write('usr/share/applications/' + manifest.name + '.desktop', desktop)

    // Copy icon
  projectDir.copy('resources/polyonic.png', readyAppDir.path('icon.png'))

  return Q()
}

let renameApp = function () {
  return readyAppDir.renameAsync('electron', manifest.name)
}

let packToDebFile = function () {
  let deferred = Q.defer()

  let debFileName = packName + '_amd64.deb'
  let debPath = releasesDir.path(debFileName)

  gulpUtil.log('Creating DEB package...')

    // Counting size of the app in KiB
  let appSize = Math.round(readyAppDir.inspectTree('.').size / 1024)

    // Preparing debian control file
  let control = projectDir.read('resources/linux/DEBIAN/control')
  control = utils.replace(control, {
    name: manifest.name,
    description: manifest.description,
    version: manifest.version,
    author: manifest.author,
    size: appSize
  })
  packDir.write('DEBIAN/control', control)

    // Build the package...
  childProcess.exec('fakeroot dpkg-deb -Zxz --build ' + packDir.path().replace(/\s/g, '\\ ') + ' ' + debPath.replace(/\s/g, '\\ '),
        function (error, stdout, stderr) {
          if (error || stderr) {
            console.log('ERROR while building DEB package:')
            console.log(error)
            console.log(stderr)
          } else {
            gulpUtil.log('DEB package ready!', debPath)
          }
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
        .then(packageBuiltApp)
        .then(finalize)
        .then(renameApp)
        .then(packToDebFile)
        .then(cleanClutter)
        .catch(console.error)
}
