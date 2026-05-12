const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = !app.isPackaged;
const {
  insertConnection,
  getConnections,
  InsertIPPort,
} = require("./database");
// const CreateTable = require("./dbCreateTable");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, "assets", "metro.ico"),
    kiosk: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(
      path.join(__dirname, "../build/index.html")
    );
  }

  //mainWindow.webContents.openDevTools(); // 👈 important for debugging
}

// app.whenReady().then(createWindow);
app.whenReady().then(() => {
  //start app with windows
   if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: true
    });
  }
  // AUTO START WITH WINDOWS
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: false,
  });
  //   CreateTable();
  createWindow();
});
// ipcMain.handle("get-products", () => {
//   return getProducts();
// });

ipcMain.handle("insert-product", (event, ipAddress, port, storeName) => {
  return insertConnection(ipAddress, port, storeName);
});

ipcMain.handle("get-connections", () => {
  return getConnections();
});

ipcMain.handle("insert-ip-port", (event, ipAddress, port, storeName) => {
  return InsertIPPort(ipAddress, port, storeName);
});
