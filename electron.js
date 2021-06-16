const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')

// process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

let win
const args = process.argv.slice(1)
const serve = args.some(val => val === '--serve')

function createWindow () {
  debugger
  win = new BrowserWindow({
    width: 1800,
    height: 1200,
    center: true,
    icon: path.join(__dirname, './resources/electron/icons/64x64.png'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })

  if (serve) {
    win.loadURL('http://localhost:4200')
  } else {
    win.loadURL(`file://${__dirname}/www/index.html`)
  }

  win.webContents.on('did-fail-load', () => {
    win.loadURL(`file://${__dirname}/www/index.html`)
  })

  console.log(`Node Environment: ${process.env.NODE_ENV}`)
  if (process.env.NODE_ENV === 'development') {
    win.toggleDevTools()
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}
try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })
} catch (e) {
  // Catch Error
  // throw e;
}
