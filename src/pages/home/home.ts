import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private electron: ElectronService) {
    if (this.electron.isElectronApp) {
      console.log('Running Electron:', this.electron);
    } else {
      console.log('Mode web');
    }
  }

}
