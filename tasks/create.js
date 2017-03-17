'use strict'

const gulp = require('gulp')
const fs = require('fs-extra')

gulp.task('create', function () {
  console.log('Creating new project');

  try {
    fs.copySync('./templates/app.template.js', './src/app.js');
  } catch(e) {
    console.error('Could not copy the app.js file. You may have to manually copy and rename templates/app.template.js to src/app.js');
    console.error(e);
  }

  try {
    fs.copySync('./templates/gulpfile.template.js', './src/gulpfile.js');
  } catch(e) {
    console.error('Could not copy the gulpfile.js file. You may have to manually copy and rename templates/gulpfile.template.js to src/gulpfile.js');
    console.error(e);
  }

  try {
    var packageContents = fs.readJsonSync('./src/package.json');

    if(packageContents.main === undefined) {
      packageContents.main = "app.js";
    }else{
      console.error('Could not add "main" to your src/package.json as it already exists');
    }

    fs.writeJsonSync('./src/package.json', packageContents);
  } catch(e) {
    console.error('Could not add a "main" node to your src/package.json, you may need to add "main": "app.js" to your src/package.json');
    console.error(e);
  }
})
