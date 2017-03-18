if(!window.cordova) {
  var platform = require('electron').remote.require('platform');

  window.device = {
    version: platform.version,
    platform: platform.os.family,
    cordova: false,
    model: platform.product,
    uuid: null,
    manufacturer: platform.manufacturer,
    isVirtual: null,
    serial: null
  };

  console.log(window.device);
}else{
  console.log(window.device);
}