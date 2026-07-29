const db = require("./database");

// ==========================================
// TABLE HISTORY
// ==========================================

db.prepare(`
    CREATE TABLE IF NOT EXISTS history (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        created_at TEXT NOT NULL,

        user_id INTEGER,

        username TEXT NOT NULL,

        action TEXT NOT NULL,

        details TEXT,

        ip TEXT

    )
`).run();

console.log("✔ Table history prête.");

db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_history_created_at
    ON history(created_at)
`).run();

db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_history_action
    ON history(action)
`).run();

db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_history_username
    ON history(username)
`).run();

module.exports = db;