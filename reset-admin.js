const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");

const db = new Database("./database/carnet.db");

const nouveauMotDePasse = "carnet";

const hash = bcrypt.hashSync(nouveauMotDePasse, 10);

db.prepare(`
    UPDATE users
    SET password_hash = ?
    WHERE username = ?
`).run(hash, "admin");

console.log("✅ Mot de passe administrateur réinitialisé.");
console.log("Utilisateur : admin");
console.log("Mot de passe : carnet");

db.close();