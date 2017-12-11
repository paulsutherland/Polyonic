var gulp = require('gulp')
var sass = require('gulp-sass')
var cleanCss = require('gulp-clean-css')
var rename = require('gulp-rename')
const electron = require('electron-connect').server.create()
const env = require('gulp-env')

var paths = {
  sass: ['./scss/**/*.scss']
}

gulp.task('default', ['sass'])

gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(cleanCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done)
})

gulp.task('watch', ['sass'], function () {
  gulp.watch(paths.sass, ['sass'])
})

gulp.task('electron-live', function () {
  env.set({
    NODE_ENV: 'development'
  })
  // Start browser process
  electron.start()

  gulp.watch('src/main.js', electron.restart)

  // Reload renderer process
  gulp.watch([
    'www/js/app.js',
    'www/**/*.html',
    'www/**/*.css',
    'www/**/*.js'], electron.reload)
})

gulp.task('dev', function () {
  gulp.start('electron-live')
})
