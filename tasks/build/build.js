'use strict'

const Q = require('q')
const gulp = require('gulp')
const watch = require('gulp-watch')
const batch = require('gulp-batch')
const jetpack = require('fs-jetpack')

const bundle = require('./bundle')
const generateSpecImportsFile = require('./generate_spec_imports')
const utils = require('../utils')

const projectDir = jetpack
const srcDir = projectDir.cwd('./src')
const destDir = projectDir.cwd('./build')

let paths = {
  copyFromAppDir: [
    './node_modules/**',
    './www/**',
    './routes/**',
    './**/*.+(jpg|png|svg)',
    './icon.ico',
    './icon.icns',
    './background.png'
  ]
}

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function (callback) {
  return destDir.dirAsync('.', { empty: true })
})

let copyTask = function () {
  return projectDir.copyAsync('src', destDir.path(), {
    overwrite: true,
    matching: paths.copyFromAppDir
  })
}

gulp.task('copy', ['clean'], copyTask)
gulp.task('copy-watch', copyTask)

let bundleApplication = function () {
  return Q.all([
    bundle(srcDir.path('app.js'), destDir.path('app.js'))
            // bundle(srcDir.path('app.js'), destDir.path('app.js')),
  ])
}

let bundleSpecs = function () {
  return generateSpecImportsFile().then(function (specEntryPointPath) {
    return bundle(specEntryPointPath, destDir.path('spec.js'))
  })
}

let bundleTask = function () {
  if (utils.getEnvName() === 'test') {
    return bundleSpecs()
  }
  return bundleApplication()
}
gulp.task('bundle', ['clean'], bundleTask)
gulp.task('bundle-watch', bundleTask)

gulp.task('finalize', ['clean'], function () {
  let manifest = srcDir.read('package.json', 'json')

    // Add "dev" or "test" suffix to name, so Electron will write all data
    // like cookies and localStorage in separate places for each environment.
  switch (utils.getEnvName()) {
    case 'development':
      manifest.name += '-dev'
      manifest.productName += ' Dev'
      break
    case 'test':
      manifest.name += '-test'
      manifest.productName += ' Test'
      break
  }

    // Copy environment letiables to package.json file for easy use
    // in the running application. This is not official way of doing
    // things, but also isn't prohibited ;)
  manifest.env = projectDir.read('config/env_' + utils.getEnvName() + '.json', 'json')

  destDir.write('package.json', manifest)
})

gulp.task('watch', function () {
  watch('src/**/*.js', batch(function (events, done) {
    gulp.start('bundle-watch', done)
  }))
  watch(paths.copyFromAppDir, { cwd: 'app' }, batch(function (events, done) {
    gulp.start('copy-watch', done)
  }))
})

gulp.task('build', ['bundle', 'copy', 'finalize'])
