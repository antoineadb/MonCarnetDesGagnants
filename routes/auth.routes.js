const express = require("express");
const router = express.Router();

const db = require("../database/database");

// =========================================
// CONNEXION
// =========================================

router.post("/login", (req, res) => {

    const { username, password } = req.body || {};

    if (!username || !password) {

        return res.status(400).json({

            success: false,
            message: "Utilisateur ou mot de passe manquant."

        });

    }

    const user = db.prepare(`
        SELECT
            id,
            username,
            firstname,
            lastname,
            role
        FROM users
        WHERE username = ?
          AND password = ?
    `).get(username, password);

    if (!user) {

        return res.status(401).json({

            success: false,
            message: "Utilisateur ou mot de passe incorrect."

        });

    }

    res.json({

        success: true,
        user

    });

});

module.exports = router;