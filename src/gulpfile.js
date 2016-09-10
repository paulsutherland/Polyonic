'use strict'

const gulp = require('gulp')
const gulpWatch = require('gulp-watch')
const del = require('del')
const runSequence = require('run-sequence')
const argv = process.argv
const electron = require('electron-connect').server.create()
const env = require('gulp-env')

/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */

gulp.task('serve:before', ['watch'])
gulp.task('emulate:before', ['build'])
gulp.task('deploy:before', ['build'])
gulp.task('build:before', ['build'])

// we want to 'watch' when livereloading
let shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1
gulp.task('run:before', [shouldWatch ? 'watch' : 'build'])

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
let buildBrowserify = require('ionic-gulp-browserify-typescript')
let buildSass = require('ionic-gulp-sass-build')
let copyHTML = require('ionic-gulp-html-copy')
let copyFonts = require('ionic-gulp-fonts-copy')
let copyScripts = require('ionic-gulp-scripts-copy')

let isRelease = argv.indexOf('--release') > -1

gulp.task('watch', ['clean'], function (done) {
  runSequence(
    ['sass', 'html', 'fonts', 'scripts'],
    function () {
      gulpWatch('app/**/*.scss', function () { gulp.start('sass') })
      gulpWatch('app/**/*.html', function () { gulp.start('html') })
      buildBrowserify({ watch: true }).on('end', done)
    }
  )
})

gulp.task('serve', ['watch'], function () {
  env.set({
    NODE_ENV: 'development'
  })
  // Start browser process
  electron.start()

  gulp.watch('src/app.js', electron.restart)

  // Reload renderer process
  gulp.watch([
    'www/js/app.js',
    'www/**/*.html',
    'www/**/*.css',
    'www/**/*.js'], electron.reload)
})

gulp.task('reload:browser', function () {
  // Restart main process
  electron.restart()
})

gulp.task('build', ['clean'], function (done) {
  runSequence(
    ['sass', 'html', 'fonts', 'scripts'],
    function () {
      buildBrowserify({
        minify: isRelease,
        browserifyOptions: {
          debug: !isRelease
        },
        uglifyOptions: {
          mangle: false
        }
      }).on('end', done)
    }
  )
})

gulp.task('sass', buildSass)
gulp.task('html', copyHTML)
gulp.task('fonts', copyFonts)
gulp.task('scripts', copyScripts)
gulp.task('clean', function () {
  return del('www/build')
})
