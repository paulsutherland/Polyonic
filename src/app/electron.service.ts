import { Injectable } from '@angular/core'
import { ipcRenderer, webFrame, remote } from 'electron'
import * as childProcess from 'child_process'
import * as fs from 'fs'

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer
  webFrame: typeof webFrame
  remote: typeof remote
  childProcess: typeof childProcess
  fs: typeof fs
  
  get isElectron(): boolean {
    return !!(typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0)
  }

  get isElectronApp(): boolean {
    // For compatibility with anyone who used the ngx-electron package
    return this.isElectron
  }

  constructor() {
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer
      this.webFrame = window.require('electron').webFrame
      this.remote = window.require('electron').remote
      this.childProcess = window.require('child_process')
      this.fs = window.require('fs')
    }
  }
}