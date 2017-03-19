(function() {
  if(!window.isCordovaApp) {
    //var app = require('electron').remote.require('app');

    try {
      var app = require('electron').remote.app;

      console.log('Cordova?', window.cordova);

      /*console.log('Cordova?', window.cordova);*/

      window.cordova.getAppVersion = {
        getAppName: function(success, fail) {
          success(app.getAppName());
        },
        getPackageName: function(success, fail) {
          success(app.getName());
        },
        getVersionCode: function(success, fail) {
          success(null);
        },
        getVersionNumber: function(success, fail) {
          success(app.getVersion());
        }
      };
    } catch(e) {
      console.error('Failed to initialize App Version shim, unknown error: ', e);
    }
  }
})();