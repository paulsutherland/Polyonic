import { Component } from '@angular/core';
import { Device } from 'ionic-native';
import { NavController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  public version: any = '';
  public dplatform: any = '';
  public deviceModel: any = '';

  constructor(public navCtrl: NavController, public platform: Platform) {
    this.platform.ready().then(() => {
      this.version = Device.version;
      this.deviceModel = Device.model;
      this.dplatform = Device.platform;
    });
  }

}
