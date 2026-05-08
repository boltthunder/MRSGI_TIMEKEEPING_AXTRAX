const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const { app } = require("electron");

const isDev = !app.isPackaged;

// Base folder
const basePath = isDev
  ? process.cwd()
  : path.dirname(app.getPath("exe"));

// Create sqlite-db folder
const dbFolder = path.join(basePath, "db");

if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
}

// Database path
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
    PORT TEXT
  )
`).run();

const insertConnection = (ipAddress, port) => {
  const stmt = db.prepare(`
    INSERT INTO Connection (IP_ADDRESS, PORT) VALUES (?, ?)
  `);
  stmt.run(ipAddress, port);
}

const getConnections = () => {
  const stmt = db.prepare(`
    SELECT * FROM Connection
  `);
  return stmt.all();
}

const InsertIPPort = (ipAddress, port) => {
  console.log("Inserting IP and Port into database:", ipAddress, port);
  const stmt = db.prepare(`
    INSERT INTO Connection (IP_ADDRESS, PORT) VALUES (?, ?)
  `);
  stmt.run(ipAddress, port);
}


module.exports = {
  insertConnection,getConnections,InsertIPPort
};