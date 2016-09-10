'use strict'

const childProcess = require('child_process')
const electron = require('electron-prebuilt')
const gulp = require('gulp')

gulp.task('start', ['build', 'watch'], function () {
  childProcess.spawn(electron, ['./build'], {
    stdio: 'inherit'
  })
    .on('close', function () {
        // User closed the app. Kill the host process.
      process.exit()
    })
})
