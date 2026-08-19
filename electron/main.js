const {app, BrowserWindow} = require("electron");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
  });

  mainWindow.loadURL("http://127.0.0.1:8000");
}

app.whenReady().then(() => {
  createWindow();
});