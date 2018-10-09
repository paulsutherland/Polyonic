// Allow angular using electron module (native node modules)
const fs = require('fs')
const angular = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js'

fs.readFile(angular, 'utf8', function (err, data) {
  if (err) {
    return console.log(err)
  }
  var result = data.replace(/target: "electron-renderer",/g, '')
  result = result.replace(/target: "web",/g, '')
  result = result.replace(/return \{/g, 'return {target: "web",')

  fs.writeFile(angular, result, 'utf8', function (err) {
    if (err) return console.log(err)
  })
})
