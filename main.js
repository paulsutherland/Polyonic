const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

let mainWindow

// Tip use the debugger keyword when debugging the main process
// electron --inspect-brk=5858 .
// or npm run debug-main

function createWindow () {
  // debugger
  mainWindow = new BrowserWindow({
    width: 1800,
    height: 1200,
    icon: path.join(__dirname, './resources/electron/icons/64x64.png')
  })
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'www/index.html'),
    protocol: 'file:',
    slashes: true,
    nodeIntegration: false
  }))

  if (process.env.NODE_ENV === 'development') {
    const client = require('electron-connect').client
    client.create(mainWindow)
    mainWindow.toggleDevTools()
  }
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
