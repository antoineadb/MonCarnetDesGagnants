const express = require("express");
const router = express.Router();
const db = require("../database/database");
const { requireAdmin } = require("../middlewares/auth.middleware");
const bcrypt = require("bcrypt");
console.log("🔥 admin.routes chargé");
// ======================================================
// HISTORIQUE DES CONNEXIONS
// ======================================================

router.get("/login-history", requireAdmin, (req, res) => {

    const history = db.prepare(`
        SELECT
            l.id,
            u.username,
            l.login_at,
            l.ip,
            l.user_agent,
            l.success
        FROM login_history l
        JOIN users u
            ON u.id = l.user_id
        ORDER BY l.login_at DESC
    `).all();

    res.json(history);

});

router.get("/users", requireAdmin, (req, res) => {

    const users = db.prepare(`
        SELECT
            id,
            username,
            firstname,
            lastname,
            role
        FROM users
    `).all();

    res.json({
        success: true,
        users
    });

});
// =========================================
// AJOUTER UN UTILISATEUR
// =========================================
console.log("✅ Déclaration de la route POST /users");
router.post("/users", requireAdmin, (req, res) => {
 console.log("🔥 POST /users exécuté");
    const {
        username,
        password,
        firstname,
        lastname,
        role
    } = req.body;

    if (!username || !password || !firstname || !lastname) {

        return res.status(400).json({

            success: false,
            message: "Tous les champs sont obligatoires."

        });

    }

    const existe = db.prepare(`
        SELECT id
        FROM users
        WHERE username = ?
    `).get(username);

    if (existe) {

        return res.json({

            success: false,
            message: "Ce nom d'utilisateur existe déjà."

        });

    }

    const hash = bcrypt.hashSync(password, 10);

    const result = db.prepare(`
        INSERT INTO users
        (
            username,
            password_hash,
            firstname,
            lastname,
            role
        )
        VALUES (?, ?, ?, ?, ?)
    `).run(

        username,
        hash,
        firstname,
        lastname,
        role

    );

    res.json({

        success: true,
        id: result.lastInsertRowid

    });

});
console.log("✅ Route POST /users enregistrée");
module.exports = router;