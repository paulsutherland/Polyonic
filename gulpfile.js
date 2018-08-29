const gulp = require('gulp')
const electron = require('electron-connect').server.create()
const env = require('gulp-env')
const config = require('@ionic/app-scripts/dist/util/config')
const ionic = require('@ionic/app-scripts')

gulp.task('dev', function () {
  env.set({
    NODE_ENV: 'development'
  })

  ionic.watch(config.generateContext())
    .then(function () {
      electron.start(() => {
        gulp.watch('src/main.js', restart)
        gulp.watch([
          'www/js/app.js',
          'www/**/*.html',
          'www/**/*.css',
          'www/**/*.js'], reload)
      })
    })
    .catch(function (err) {
      console.log('Error starting watch: ', err)
    })
})

function restart (done) {
  electron.restart('--enable-logging', function (state) {
    if (state === 'restarted' || state === 'restarting') {
      done(null)
    } else {
      done('Unexpected state while restarting electron-connect server. State ' + state)
    }
  })
}

function reload (done) {
  electron.reload()
  done(null)
}
