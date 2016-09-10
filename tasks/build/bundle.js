'use strict'

const pathUtil = require('path')
const jetpack = require('fs-jetpack')
const rollup = require('rollup')
const Q = require('q')

const nodeBuiltInModules = ['assert', 'buffer', 'child_process', 'cluster',
    'console', 'constants', 'crypto', 'dgram', 'dns', 'domain', 'events',
    'fs', 'http', 'https', 'module', 'net', 'os', 'path', 'process', 'punycode',
    'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'timers',
    'tls', 'tty', 'url', 'util', 'v8', 'vm', 'zlib']

const electronBuiltInModules = ['electron']

let npmModulesUsedInApp = function () {
  let appManifest = require('../../src/package.json')
  return Object.keys(appManifest.dependencies)
}

let generateExternalModulesList = function () {
  return [].concat(nodeBuiltInModules, electronBuiltInModules, npmModulesUsedInApp())
}

module.exports = function (src, dest) {
  let deferred = Q.defer()

  rollup.rollup({
    entry: src,
    external: generateExternalModulesList()
  }).then(function (bundle) {
    let jsFile = pathUtil.basename(dest)
    let result = bundle.generate({
      format: 'cjs',
      sourceMap: true,
      sourceMapFile: jsFile
    })
        // Wrap code in self invoking function so the letiables don't
        // pollute the global namespace.
    let isolatedCode = '(function () {' + result.code + '\n}())'
    return Q.all([
      jetpack.writeAsync(dest, isolatedCode + '\n//# sourceMappingURL=' + jsFile + '.map'),
      jetpack.writeAsync(dest + '.map', result.map.toString()),
    ])
  }).then(function () {
    deferred.resolve()
  }).catch(function (err) {
    deferred.reject(err)
  })
  return deferred.promise
}
