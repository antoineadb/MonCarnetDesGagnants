const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

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
            password_hash,
            firstname,
            lastname,
            role
        FROM users
        WHERE username = ?
    `).get(username);

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {

        if (user) {

            db.prepare(`
                INSERT INTO login_history
                (user_id, ip, user_agent, success)
                VALUES (?, ?, ?, ?)
            `).run(

                user.id,
                req.ip,
                req.get("User-Agent"),
                0

            );

        }

        return res.status(401).json({

            success: false,
            message: "Utilisateur ou mot de passe incorrect."

        });

    }

    db.prepare(`
        INSERT INTO login_history
        (user_id, ip, user_agent, success)
        VALUES (?, ?, ?, ?)
    `).run(

        user.id,
        req.ip,
        req.get("User-Agent"),
        1

    );

    req.session.user = {

        id: user.id,

        username: user.username,

        firstname: user.firstname,

        lastname: user.lastname,

        role: user.role

    };

    delete user.password_hash;

    res.json({

        success: true,
        user

    });

});


router.get("/login-history", (req, res) => {

    const history = db.prepare(`
        SELECT

            l.id,
            u.username,
            l.login_at,
            l.ip,
            l.success

        FROM login_history l

        JOIN users u
            ON u.id = l.user_id

        ORDER BY l.login_at DESC

        LIMIT 100

    `).all();

    res.json(history);

});

router.get("/me", (req, res) => {

    if (!req.session.user) {

        return res.status(401).json({

            success: false,
            message: "Aucun utilisateur connecté."

        });

    }

    res.json(req.session.user);

});

module.exports = router;