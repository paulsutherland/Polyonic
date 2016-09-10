'use strict'

const gulp = require('gulp')
const utils = require('../utils')

const releaseForOs = {
  osx: require('./osx'),
  linux: require('./linux'),
  windows: require('./windows')
}

gulp.task('release', ['build'], function () {
  return releaseForOs[utils.os()]()
})
