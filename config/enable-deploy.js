// Allow angular using electron module (native node modules)
const fs = require('fs')
const config = 'config.xml'

fs.readFile(config, 'utf8', function (err, data) {
  if (err) {
    return console.log(err)
  }
  var result = data.replace(`<preference name="DisableDeploy" value="true" />`, `<preference name="DisableDeploy" value="false" />`)

  fs.writeFile(config, result, 'utf8', function (err) {
    if (err) return console.log(err)
  })
})
