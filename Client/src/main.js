const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var config = require('../package.json');

const path = require('path');
const url = require('url');

require('electron-reload')(__dirname, {
  electron: require('${__dirname}/../../node_modules/electron')
});

process.on('uncaughtException', function (error) {
  console.error(error);
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow(
    {
      title: config.name,
      width: 350, 
      height: 700,
      webPreferences: {
        // レンダラープロセスで Node.js 使えないようにする (XSS対策)
        nodeIntegration: true, // しかし，これをtrueにしておかないとjqueryが使えない
        // preloadスクリプトを, app.htmlとは別のJavaScriptコンテキストで実行するかどうか
        // false にしないと、window object を共有できない
        contextIsolation: false,
        // process や Electron を windowオブジェクト に保存する処理。フルパスの指定が必要
        //preload: path.join(__dirname, '/preload.js'),
      },
    });

  mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '/pages/index.html'),
      protocol: 'file:',
      slashes: true
  }));

  //mainWindow.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});