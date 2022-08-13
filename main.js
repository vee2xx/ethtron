'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    useContentSize: true,
    width: 800,
    height: 600,
    resizable: true,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('closed', () => { mainWindow = null; });
  mainWindow.webContents.openDevTools();
});
