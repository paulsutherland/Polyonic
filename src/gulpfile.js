const gulp = require('gulp')
const electron = require('electron-connect').server.create()
const env = require('gulp-env')
const config = require('@ionic/app-scripts/dist/util/config')
const ionic = require('@ionic/app-scripts')

gulp.task('electron-live', function () {
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

gulp.task('dev', function () {
  ionic.watch(config.generateContext())
  .then(function () {
    gulp.start('electron-live')
  })
  .catch(function (err) {
    console.log('Error starting watch: ', err)
  })
})
