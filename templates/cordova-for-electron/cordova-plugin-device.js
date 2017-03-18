var os = require('os');

window.device = {
  version: os.release(),
  platform: os.platform(),
  cordova: null,
  model: os.hostname(),
  uuid: null,
  manufacturer: null,
  isVirtual: null,
  serial: null
};