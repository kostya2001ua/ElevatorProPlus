var { app, BrowserWindow } = require('electron');

var window;

function createWindow() {
    window = new BrowserWindow({ 
        width: 1200, 
        height: 900,
        icon: __dirname + '/../public/images/icon.ico'
    });
    console.log()
    window.setMenu(null);
    window.loadURL('http://elevator-pro-plus.herokuapp.com');
    window.on('closed', function () {
        window = null;
    });
}

app.on('ready', createWindow);
