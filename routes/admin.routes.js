const express = require("express");
const router = express.Router();
const db = require("../database/database");
const { requireAdmin } = require("../middlewares/auth.middleware");


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

    res.json(users);

});
// ======================================================
// Modifier le rôle d'un utilisateur
// ======================================================
/*
router.get("/set-role/:username/:role", (req, res) => {

    const { username, role } = req.params;

    db.prepare(`
        UPDATE users
        SET role = ?
        WHERE username = ?
    `).run(role, username);

    res.json({
        success: true,
        username,
        role
    });

});*/
module.exports = router;