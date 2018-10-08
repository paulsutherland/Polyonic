import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor(private electron: ElectronService) {
    if (this.electron.isElectronApp) {
      console.log('Running Electron:', this.electron);
    } else {
      console.log('Mode web');
    }
  }

}
