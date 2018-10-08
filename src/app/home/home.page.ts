import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import PouchDB from 'pouchdb-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  public db: any;
  public dbInfo: any;

  constructor(public electron: ElectronService) {
    if (this.electron.isElectronApp) {
      console.log('Running Electron:', this.electron);
    } else {
      console.log('Mode web');
    }
    const db = new PouchDB('mydb');
    db.info().then(info => this.dbInfo = info);
  }

}
