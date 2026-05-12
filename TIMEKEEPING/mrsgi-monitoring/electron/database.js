const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const { app } = require("electron");

const isDev = !app.isPackaged;

// Always use EXE directory in production
const basePath = isDev
  ? process.cwd()
  : path.dirname(app.getPath("exe"));

// DB folder inside app directory
const dbFolder = path.join(basePath, "db");

// Ensure folder exists
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
}

// SQLite DB file inside production folder
const dbPath = path.join(dbFolder, "mrsgi.db");

console.log("Database Path:", dbPath);

// Connect database
const db = new Database(dbPath);



// Enable foreign keys
db.exec(`PRAGMA foreign_keys = ON;`);

// Example table
db.prepare(`
  CREATE TABLE IF NOT EXISTS Connection (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    IP_ADDRESS TEXT,
    PORT TEXT,
    STORE_NAME TEXT
  )
`).run();

const insertConnection = (ipAddress, port, storeName) => {
  const stmt = db.prepare(`
    INSERT INTO Connection (IP_ADDRESS, PORT,STORE_NAME) VALUES (?, ?, ?)
  `);
  stmt.run(ipAddress, port, storeName);
}

const getConnections =  () => {
  const stmt = db.prepare(`
    SELECT * FROM Connection
  `);
  return stmt.all();
}

const InsertIPPort = (ipAddress, port, storeName) => {
  // console.log("Inserting IP and Port into database:", ipAddress, port);
  const stmt = db.prepare(`
    INSERT INTO Connection (IP_ADDRESS, PORT, STORE_NAME) VALUES (?, ?, ?)
  `);
  stmt.run(ipAddress, port, storeName);
}


module.exports = {
  insertConnection,getConnections,InsertIPPort
};