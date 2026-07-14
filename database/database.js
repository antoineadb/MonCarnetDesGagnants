const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Création du dossier si nécessaire
const dbFolder = __dirname;

if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
}

// Ouverture de la base
const db = new Database(path.join(dbFolder, "carnet.db"));

// Performances SQLite
db.pragma("journal_mode = WAL");

// ======================================================
// TABLE JOURNAL
// ======================================================

db.exec(`

CREATE TABLE IF NOT EXISTS journal (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    title TEXT NOT NULL,

    content TEXT NOT NULL,

    mood TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT DEFAULT CURRENT_TIMESTAMP

);

`);

console.log("✔ Base SQLite ouverte");
console.log("✔ Table journal prête");

module.exports = db;