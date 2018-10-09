import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  public db: any;
  public dbInfo: Object;

  constructor(public electron: ElectronService, private data: DataService) {
    this.db = this.data.db

    this.data.db.info()
    .then(info => {
      this.dbInfo = info;
    })
    .catch(error => console.log('Error connecting to Database: ', error));
  }
}
