import { Component, OnInit } from '@angular/core'
import { Platform, Events } from '@ionic/angular'
import { ElectronService } from 'ngx-electron'
import { DataService } from '../data.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  public db: any
  public dbInfo: Object
  public electron: any

  constructor(public electronService: ElectronService, private data: DataService, private platform: Platform, private events: Events) {

  }

  ngOnInit () {
    const ctx = this
    ctx.electron = ctx.electronService

    ctx.events.subscribe('database:available', (info) => {
      console.log('Database is now available')
      ctx.db = ctx.data.db
      ctx.dbInfo = info
    })
  }

}
