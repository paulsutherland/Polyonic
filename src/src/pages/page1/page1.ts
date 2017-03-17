import { Component } from '@angular/core';
import { Device } from 'ionic-native';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  public version: any = '';

  constructor(public navCtrl: NavController) {
    this.version = Device.version;
  }

}
