declare function require(name:string);
declare var window;
declare var process;

export class CordovaPluginDeviceElectron {
  public os: any = require('node.os');

  constructor() {
    console.log('Hello CordovaPluginDeviceShim Provider');
    console.log(this.os.os);

    window.device = {
      version: this.os.release(),
      platform: this.os.platform
    };
  }

}
