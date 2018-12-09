import { Injectable } from '@angular/core'
import { Platform, Events } from '@ionic/angular'
import { environment } from '../environments/environment';
import { ElectronService } from 'ngx-electron'
import * as PouchDB from 'pouchdb/dist/pouchdb'
import SimpleCryptor from 'simple-cryptor-pouch'
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public db: any
  public dbInfo: any

  constructor(public electron: ElectronService, private platform: Platform, private events: Events) {}

  public setup() {
    const ctx = this
    console.log('Setting up the application database')

    if (ctx.electron.isElectronApp) {
      return ctx.desktopDB()
    }
    if (ctx.platform.is('mobile')) {
      return ctx.mobileDB()
    } else {
      return ctx.webDB()
    }
  }

  private desktopDB() {
    const ctx = this
    console.log('This app is running on the desktop')
    return new Promise((resolve, reject) => {
      console.log('Running Electron:', ctx.electron)
      try {

        const ElectronPouchDB = ctx.electron.remote.require('pouchdb')
        const ElectronSimpleCryptor = ctx.electron.remote.require('simple-cryptor-pouch')
        ElectronPouchDB.plugin(ElectronSimpleCryptor)

        let userDataPath = '.'
        if (environment.production) {
          userDataPath = (ctx.electron.remote.app).getPath('userData')
          console.log(`Application database is located in the application user path: ${userDataPath}`)
        }

        ctx.db = new ElectronPouchDB(userDataPath + '/app.db')
        ctx.db.simplecryptor('secret') // <<<<<<<<<<<<< Replace with your secret key

        // The app database won't be created until the api is called
        // This can cause issues on a fresh production build
        // Therefore, call db.info and then resolve to ensure the
        // database exists
        ctx.db.info()
        .then(res => {
          console.log(JSON.stringify(res, null, 2))
          resolve()
        })
        .catch(error => reject(error))

      } catch (error) {
        reject(error)
      }
    })
  }

  private mobileDB() {
    const ctx = this
    console.log('This app is running on a mobile device')
    return new Promise((resolve, reject) => {
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
        // PouchDB.plugin(SimpleCryptor)
        // ctx.db = new PouchDB('app.db')
        // ctx.db.simplecryptor('secret') // <<<<<<<<<<<<< Replace with your secret key
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
    return new Promise((resolve, reject) => {
      ctx.platform.ready()
      .then(() => {
        PouchDB.plugin(SimpleCryptor)
        return ctx.db = new PouchDB('app.db')

      })
      .then(res => {
        ctx.db.simplecryptor('password') // <<<<<<<<<<<<< Replace with your secret key
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
