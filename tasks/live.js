const gulp = require('gulp')
const electron = require('electron-connect').server.create()
const env = require('gulp-env')
const ionic = require('@ionic/app-scripts')

const ionicContext = {
  rootDir: './src/',
  tmpDir: './src/.tmp',
  srcDir: './src/src',
  wwwDir: './src/www'
}

gulp.task('electron-live', function () {
  env.set({
    NODE_ENV: 'development'
  })
  // Start browser process
  electron.start()

  gulp.watch('src/app.js', electron.restart)

  // Reload renderer process
  gulp.watch([
    'src/www/js/app.js',
    'src/www/**/*.html',
    'src/www/**/*.css',
    'src/www/**/*.js'], electron.reload)
})

gulp.task('dev', function () {
  ionic.watch(ionicContext).then(function () {
    gulp.start('electron-live')
  })
})
