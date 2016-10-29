const gulp = require('gulp')
const electron = require('electron-connect').server.create()
const env = require('gulp-env')

gulp.task('serve', ['watch'], function () {
  env.set({
    NODE_ENV: 'development'
  })
  // Start browser process
  electron.start()

  gulp.watch('src/electron.js', electron.restart)

  // Reload renderer process
  gulp.watch([
    'src/www/js/app.js',
    'src/www/**/*.html',
    'src/www/**/*.css',
    'src/www/**/*.js'], electron.reload)
})
