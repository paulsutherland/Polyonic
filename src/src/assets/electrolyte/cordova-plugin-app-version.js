(function() {
  if(!window.isCordovaApp) {
    //var app = require('electron').remote.require('app');

    try {
      var app = require('electron').app;

      console.log('Cordova?', window.cordova);

      /*console.log('Cordova?', window.cordova);*/

      window.cordova.getAppVersion = {
        getAppName: function(success, fail) {
          console.log('App name?');
          success('TEST');
        },
        getPackageName: function(success, fail) {
          console.log('package name?');

          success('TEST.PACKAGE.NAME');
        },
        getVersionCode: function(success, fail) {

          console.log('version code?');
          
          success('1234');
        },
        getVersionNumber: function(success, fail) {

          console.log('version number?');

          success('0.0.1');
        }
      };
    } catch(e) {
      console.error('Failed to initialize App Version shim, unknown error: ', e);
    }
  }
})();