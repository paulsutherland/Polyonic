// Rebuilds native node modules for Electron.
// More: https://github.com/atom/electron/blob/master/docs/tutorial/using-native-node-modules.md

'use strict'

const path = require('path')
const electron = require('electron')
const electronPackage = require('electron/package.json')
const rebuild = require('electron-rebuild')

let pathToElectronNativeModules = path.join(__dirname, '../build/node_modules')

rebuild.shouldRebuildNativeModules(electron)
.then(function (shouldBuild) {
  if (!shouldBuild) {
    return true
  }

  console.log('Rebuilding native modules for Electron...')

  return rebuild.installNodeHeaders(electronPackage.version)
    .then(function () {
      return rebuild.rebuildNativeModules(electronPackage.version, pathToElectronNativeModules)
    })
})
.then(function () {
  console.log('Rebuilding complete.')
})
.catch(function (err) {
  console.error('Rebuilding error!')
  console.error(err)
})
