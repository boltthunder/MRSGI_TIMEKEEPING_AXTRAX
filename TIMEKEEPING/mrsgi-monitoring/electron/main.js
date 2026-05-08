const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { insertConnection, getConnections, InsertIPPort } = require("./database");
// const CreateTable = require("./dbCreateTable");


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, "assets", "metro.ico"),
    // kiosk: true,
    // fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
//   mainWindow.on("close", (e) => {
//     // run your cleanup
//     wipeUserTable();
//   });
  mainWindow.webContents.openDevTools();
  mainWindow.loadURL("http://localhost:3000");
}

// app.whenReady().then(createWindow);
app.whenReady().then(() => {
//   CreateTable();
  createWindow();
});
// ipcMain.handle("get-products", () => {
//   return getProducts();
// });

ipcMain.handle("insert-product", (event, ipAddress, port) => {
  return insertConnection(ipAddress, port);
});

ipcMain.handle("get-connections", () => {
  return getConnections();
});

ipcMain.handle("insert-ip-port", (event, ipAddress, port) => {
  return InsertIPPort(ipAddress, port);
});
