const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
    win = new BrowserWindow(
        {
            show: false, 
            fullscreen: true,
            autoHideMenuBar: true,
            resizable: false
        }
    );

    win.loadURL(path.join(__dirname, 'main.html'));

    // win.webContents.openDevTools();

    win.once('ready-to-show', () => {
        win.show();
    })
}

function quit() {
    if (process.platform != 'darwin') {
        app.quit();
    }
}

app.on('ready', createWindow);
app.on('window-all-closed', quit);