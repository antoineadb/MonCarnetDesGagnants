const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Création du dossier si nécessaire
const dbFolder = __dirname;

if (!fs.existsSync(dbFolder)) {

    fs.mkdirSync(dbFolder, {

        recursive: true

    });

}

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

db.exec(`

CREATE TABLE IF NOT EXISTS progression_paths (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    description TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP

);

`);

// ======================================================
// TABLE USERS
// ======================================================

db.exec(`

CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT NOT NULL UNIQUE,

    password TEXT NOT NULL,

    firstname TEXT,

    lastname TEXT,

    role TEXT DEFAULT 'user',

    created_at TEXT DEFAULT CURRENT_TIMESTAMP

);

`);

// ======================================================
// TABLE JALONS
// ======================================================

db.exec(`

CREATE TABLE IF NOT EXISTS progression_milestones (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    path_id INTEGER NOT NULL,

    step_order INTEGER NOT NULL,

    title TEXT NOT NULL,

    icon TEXT,

    description TEXT,

    color TEXT,

    curve_position REAL NOT NULL,

    is_visible INTEGER DEFAULT 1,

    editable INTEGER DEFAULT 1,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(path_id)

        REFERENCES progression_paths(id)

);

`);

// ======================================================
// TABLE PROGRESSION
// ======================================================

db.exec(`

CREATE TABLE IF NOT EXISTS progression_state (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    path_id INTEGER NOT NULL,

    progress REAL DEFAULT 0,

    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(path_id)

        REFERENCES progression_paths(id)

);

`);
console.log("✔ Base SQLite ouverte");
console.log("✔ Table journal prête");
console.log("✔ Tables progression prêtes");

// ======================================================
// DONNÉES PAR DÉFAUT
// ======================================================

const pathCount = db.prepare(`
    SELECT COUNT(*) AS total
    FROM progression_paths
`).get();

if (pathCount.total === 0) {

    console.log("🌱 Initialisation du parcours par défaut...");

    // Création du parcours

    const insertPath = db.prepare(`
        INSERT INTO progression_paths
        (name, description)
        VALUES (?, ?)
    `);

    const result = insertPath.run(

        "Le Carnet des Gagnants",

        "Parcours de développement personnel"

    );

    const pathId = result.lastInsertRowid;

    // Préparation de l'insertion des jalons

    const insertMilestone = db.prepare(`

        INSERT INTO progression_milestones (

            path_id,

            step_order,

            title,

            icon,

            description,

            color,

            curve_position

        )

        VALUES (?, ?, ?, ?, ?, ?, ?)

    `);
        insertMilestone.run(

        pathId,

        1,

        "Santé",

        "🍎",

        "Prendre soin de son corps.",

        "#4CAF50",

        0.08

    );

    insertMilestone.run(

        pathId,

        2,

        "Sommeil",

        "😴",

        "Retrouver une énergie durable.",

        "#4A90E2",

        0.22

    );

    insertMilestone.run(

        pathId,

        3,

        "Miracle Morning",

        "🌅",

        "Créer une routine puissante.",

        "#F5A623",

        0.40

    );

    insertMilestone.run(

        pathId,

        4,

        "Action Massive",

        "🚀",

        "Passer massivement à l'action.",

        "#E74C3C",

        0.72

    );

    insertMilestone.run(

        pathId,

        5,

        "Potentiel",

        "⭐",

        "Devenir la meilleure version de soi.",

        "#D4AF37",

        0.95

    );

        db.prepare(`

        INSERT INTO progression_state (

            path_id,

            progress

        )

        VALUES (?, ?)

    `).run(

        pathId,

        0.30

    );

    console.log("✔ Parcours créé");

}
// ======================================================
// UTILISATEUR ADMIN PAR DÉFAUT
// ======================================================

const admin = db.prepare(`
    SELECT id
    FROM users
    WHERE username = ?
`).get("admin");

if (!admin) {

    db.prepare(`
        INSERT INTO users (

            username,
            password,
            firstname,
            lastname,
            role

        )

        VALUES (?, ?, ?, ?, ?)
    `).run(

        "admin",
        "carnet",
        "Antonio",
        "Di Bartoloméo",
        "admin"

    );

    console.log("✔ Utilisateur admin créé");

}
module.exports = db;