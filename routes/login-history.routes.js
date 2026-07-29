const express = require("express");
const router = express.Router();

const db = require("../database/database");
const { requireAdmin } = require("../middlewares/auth.middleware");

// =========================================
// LISTE DE L'HISTORIQUE DES CONNEXIONS
// =========================================

router.get("/", requireAdmin, (req, res) => {

    const history = db.prepare(`
        SELECT

            l.id,
            u.username,
            u.firstname,
            u.lastname,

            l.login_at,
            l.logout_at,

            l.ip,
            l.user_agent,

            l.success,
            l.session_id

        FROM login_history l

        LEFT JOIN users u
            ON u.id = l.user_id

        ORDER BY l.login_at DESC

    `).all();

    res.json(history);

});


// =========================================
// VIDER L'HISTORIQUE
// =========================================

router.delete("/", requireAdmin, (req, res) => {

    db.prepare(`
        DELETE FROM login_history
    `).run();

    res.json({

        success: true,
        message: "Historique des connexions supprimé."

    });

});


module.exports = router;