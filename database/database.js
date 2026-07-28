const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

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

    password_hash TEXT NOT NULL,

    firstname TEXT,

    lastname TEXT,

    role TEXT DEFAULT 'user',

    created_at TEXT DEFAULT CURRENT_TIMESTAMP

);

`);

// ======================================================
// TABLE HISTORIQUE DES CONNEXIONS
// ======================================================

db.exec(`

CREATE TABLE IF NOT EXISTS login_history (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    login_at TEXT DEFAULT CURRENT_TIMESTAMP,

    ip TEXT,

    user_agent TEXT,

    success INTEGER NOT NULL,

    FOREIGN KEY(user_id)
        REFERENCES users(id)

);

`);

console.log("✔ Table login_history prête");
// ======================================================
// TABLE JALONS
// ======================================================

db.exec(`

    CREATE TABLE IF NOT EXISTS progression_milestones (

        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path_id INTEGER NOT NULL,
        step_order INTEGER NOT NULL,
        code TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        icon TEXT,        
        description TEXT,
        citation TEXT,
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
// TABLE PROGRESSION HISTORY
// ======================================================

db.prepare(`
    CREATE TABLE IF NOT EXISTS progression_history (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    path_id INTEGER NOT NULL,

    milestone_id INTEGER NOT NULL,

    old_score INTEGER NOT NULL,

    new_score INTEGER NOT NULL,

    variation INTEGER NOT NULL,

    note TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(path_id)
        REFERENCES progression_paths(id),

    FOREIGN KEY(milestone_id)
        REFERENCES progression_milestones(id)
    );
`).run();

// ======================================================
// TABLE GRATITUDE
// ======================================================
    db.prepare(`
        CREATE TABLE IF NOT EXISTS gratitude_cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            title TEXT NOT NULL,
            message TEXT NOT NULL,

            image TEXT,
            
            image_type TEXT DEFAULT 'photo',

            location TEXT,

            theme TEXT DEFAULT 'Nature',

            emotion TEXT,

            favorite INTEGER DEFAULT 0,

            send_date TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `).run();

        console.log("✔ Table gratitude_cards prête");

// ======================================================
// TABLE GRATITUDE_CARDS
// ======================================================
    db.prepare(`   
        CREATE TABLE IF NOT EXISTS gratitude_cards (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        title TEXT NOT NULL,

        message TEXT NOT NULL,

        image TEXT,

        image_type TEXT DEFAULT 'photo',

        location TEXT,

        theme TEXT DEFAULT 'Nature',

        emotion TEXT,

        favorite INTEGER DEFAULT 0,

        send_date TEXT,

        deleted INTEGER DEFAULT 0,

        created_at TEXT DEFAULT CURRENT_TIMESTAMP,

        updated_at TEXT DEFAULT CURRENT_TIMESTAMP

    );
    `).run();     
// ======================================================
// DONNÉES PAR DÉFAUT
// ======================================================


const pathCount = db.prepare(`
    SELECT COUNT(*) AS total
    FROM progression_paths
`).get();

console.log("=== Initialisation progression ===");

console.log("pathCount =", pathCount);

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
            code,
            title,
            icon,
            description,
            citation,
            color,
            curve_position
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)

    `);
        insertMilestone.run(

        pathId,

        1,

        "sante",

        "Santé",

        "🍎",

        "Prendre soin de son corps.",

        "Votre santé est le premier capital de votre réussite.",

        "#4CAF50",

        0.08

    );

    insertMilestone.run(

        pathId,

        2,

        "sommeil",

        "Sommeil",

        "😴",

        "Retrouver une énergie durable.",

        "Chaque nuit de qualité prépare les victoires de demain.",

        "#4A90E2",

        0.22

    );

    insertMilestone.run(

        pathId,

        3,

        "miracleMorning",

         "Miracle Morning",


        "🌅",

        "Créer une routine puissante.",

        "Chaque matin est une nouvelle occasion de devenir meilleur.",

        "#F5A623",

        0.40

    );

    insertMilestone.run(

        pathId,

        4,

        "actionMassive",

        "Action Massive",

        "🚀",

        "Passer massivement à l'action.",

        "Les résultats viennent de l'action, jamais de l'intention.",

        "#E74C3C",

        0.72

    );

    insertMilestone.run(

        pathId,

        5,

        "potentiel",

        "Potentiel",

        "⭐",
        "Devenir la meilleure version de soi.",

        "Ton potentiel est bien plus grand que tes limites d'aujourd'hui.",

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

const adminPasswordHash = bcrypt.hashSync("carnet", 10);
const lydiePasswordHash = bcrypt.hashSync("la_bella_Ragazza", 10);

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
            password_hash,
            firstname,
            lastname,
            role

        )

        VALUES (?, ?, ?, ?, ?)
    `).run(

        "admin",
        adminPasswordHash,       
        "Antonio",
        "Di Bartoloméo",
        "admin"

    );

    console.log("✔ Utilisateur admin créé");

}

const lydie = db.prepare(`
    SELECT id
    FROM users
    WHERE username = ?
`).get("lydie");

if (!lydie) {

    db.prepare(`
        INSERT INTO users (

            username,
            password_hash,
            firstname,
            lastname,
            role

        )

        VALUES (?, ?, ?, ?, ?)
    `).run(

        "lydie",
        lydiePasswordHash,
        "Lydie",
        "Stragapede",
        "user"

    );

    console.log("✔ Utilisateur Lydie créé");

}
module.exports = db;