import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ElectronService } from 'ngx-electron';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import SimpleCryptor from 'simple-cryptor-pouch';
PouchDB.plugin(SimpleCryptor);
// import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  public db: any;
  public dbInfo: any;

  constructor(public electron: ElectronService, private platform: Platform) {
    this.setupDatabase()
    .then(() => {
      return this.db.info();
    })
    .then(info => {
      this.dbInfo = info;
    })
    .catch(error => console.log('Error connecting to Database: ', error));
  }

  setupDatabase() {
    console.log('Setting up local database');
    const ctx = this;

    if (ctx.electron.isElectronApp) {
      return ctx.desktopDB();
    }
    if (ctx.platform.is('mobile')) {
      return ctx.mobileDB();
    } else {
      return ctx.webDB();
    }
  }

  desktopDB() {
    const ctx = this;
    return new Promise((resolve, reject) => {
      console.log('This app is running on the desktop');
      console.log('Running Electron:', ctx.electron);
      try {
        const ElectronPouchDB = ctx.electron.remote.require('PouchDB');
        const ElectronSimpleCryptor = ctx.electron.remote.require('simple-cryptor-pouch');
        ElectronPouchDB.plugin(ElectronSimpleCryptor);
        ctx.db = new ElectronPouchDB('./database/app.db');
        ctx.db.simplecryptor('secret'); // <<<<<<<<<<<<< Replace with your secret key
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  mobileDB() {
    const ctx = this;
    return new Promise((resolve, reject) => {
      console.log('This app is running on a mobile device');
      ctx.platform.ready()
      .then(() => {
        // ////////////////////////////////////////////////////////////
        // The cordova Sqllite plugin does not work in Ionic4/Angular6
        // Once resolved, we will revert to sqllite
        // ////////////////////////////////////////////////////////////

        // PouchDB.plugin(cordovaSqlitePlugin);
        // ctx.db = new PouchDB('db',{
        //   adapter: 'cordova-sqlite',
        //   key: 'secret', // <<<<<<<<<<<<< Replace with your secret key
        //   iosDatabaseLocation: 'Library'
        // });
        ctx.db = new PouchDB('app.db');
        ctx.db.simplecryptor('secret'); // <<<<<<<<<<<<< Replace with your secret key
        resolve();
      })
      .catch(error => {
        console.log('Error waiting for platform to load', error);
        reject(error);
      });
    });
  }

  webDB() {
    const ctx = this;
    return new Promise((resolve, reject) => {
      console.log('This app is running in a web browser');
      ctx.platform.ready()
      .then(() => {
        ctx.db = new PouchDB('app.db');
        ctx.db.simplecryptor('password'); // <<<<<<<<<<<<< Replace with your secret key
        resolve();
      })
      .catch(error => {
        console.log('Error waiting for platform to load', error);
        reject(error);
      });
    });
  }
}
