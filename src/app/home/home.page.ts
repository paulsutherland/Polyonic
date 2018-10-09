import { Component } from '@angular/core'
import { Platform } from '@ionic/angular'
import { ElectronService } from 'ngx-electron'
import { DataService } from '../data.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  public db: any
  public dbInfo: Object
  public electron: any

  constructor(public electronService: ElectronService, private data: DataService, private platform: Platform) {

    this.platform.ready()
    .then(() => {
      this.electron = electronService
    })
    .catch(error => {
      console.log('Error waiting for platform to load', error)
    })

    this.db = this.data.db

    this.data.db.info()
    .then(info => {
      this.dbInfo = info
    })
    .catch(error => console.log('Error connecting to data service: ', error))
  }
}
