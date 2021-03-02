import { Injectable } from '@angular/core'
import { Platform } from '@ionic/angular'
import { environment } from '../environments/environment'
import { ElectronService } from './electron.service'
import { EventService } from './events.service'
import * as PouchDB from 'pouchdb/dist/pouchdb'
import SecurePouch from 'polyonic-secure-pouch'
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public db: any
  public dbInfo: any

  constructor(
    public electron: ElectronService,
    private events: EventService,
    private platform: Platform
  ) {}

  public setup() {
    const ctx = this
    console.log('Setting up the application database')

    if (ctx.platform.is('mobile')) {
      return ctx.mobileDB()
    } else {
      return ctx.webDB()
    }
  }

  private mobileDB() {
    const ctx = this
    console.log('This app is running on a mobile device')
    return new Promise<void>((resolve, reject) => {
      ctx.platform.ready()
      .then(() => {
        // Go for either an encrypted db or encrypted data
        // There is a greater performance hit on the encrypted data option
        PouchDB.plugin(cordovaSqlitePlugin)
        return ctx.db = new PouchDB('app.db', {
          adapter: 'cordova-sqlite',
          key: 'secret', // <<<<<<<<<<<<< Replace with your secret key
          iosDatabaseLocation: 'Documents'
        })
        // PouchDB.plugin(SecurePouch)
        // ctx.db = new PouchDB('app.db')
        // ctx.db.securePouch('secret') // <<<<<<<<<<<<< Replace with your secret key
      })
      .then(res => {
        return ctx.db.info()
      })
      .then(info => {
        ctx.events.publish('database:available', info)
        resolve()
      })
      .catch(error => {
        console.log('Error waiting for platform to load', error)
        reject(error)
      })
    })
  }

  private webDB() {
    const ctx = this
    console.log('This app is running in a web browser')
    return new Promise<void>((resolve, reject) => {
      ctx.platform.ready()
      .then(() => {
        PouchDB.plugin(SecurePouch)
        return ctx.db = new PouchDB('app.db')

      })
      .then(res => {
        ctx.db.encrypt('password') // <<<<<<<<<<<<< Replace with your secret key
        return ctx.db.info()
      })
      .then(info => {
        ctx.events.publish('database:available', info)
        resolve()
      })
      .catch(error => {
        console.log('Error waiting for platform to load', error)
        reject(error)
      })
    })
  }
}
