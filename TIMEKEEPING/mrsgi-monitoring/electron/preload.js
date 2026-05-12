const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("appEnv", {
  isElectron: true
});

contextBridge.exposeInMainWorld("api", {
  insertProduct: (ipAddress, port, storeName) => ipcRenderer.invoke("insert-product", ipAddress, port, storeName),
  getConnections: () => ipcRenderer.invoke("get-connections"),
  insertIPPort: (ipAddress, port, storeName) => ipcRenderer.invoke("insert-ip-port", ipAddress, port, storeName),
//   getProducts: () => ipcRenderer.invoke("get-products"),
//   insertUser: (data) => ipcRenderer.invoke("insert-User", data),
//   getUsers: () => ipcRenderer.invoke("get-User"),
});