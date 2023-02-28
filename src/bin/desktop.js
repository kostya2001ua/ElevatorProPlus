var { app, BrowserWindow } = require('electron');

var window;

function createWindow() {
    window = new BrowserWindow({ width: 800, height: 600 });
    window.loadURL('http://localhost:3000');
    window.on('closed', function () {
        window = null;
    });
}

app.on('ready', createWindow);
