// const electron = require('electron');
const { app, dialog, Menu, BrowserWindow } = require('electron')
const isMac = process.platform === 'darwin'
// const BrowserWindow = electron.BrowserWindow;
let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
            width: 1000, 
            height: 768,
            webPreferences:{
                nodeIntegration:true
            }
        });
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function () {
            mainWindow = null
        });
    buildMenu();
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});

function buildMenu() {
    var template = []
    var fileMenu = {label: 'File', submenu: [{role: 'toggleDevTools'}, isMac ? { role: 'close' } : { role: 'quit' }]}  
    template.push(fileMenu)
    Menu.setApplicationMenu(Menu.buildFromTemplate(template)); 
}