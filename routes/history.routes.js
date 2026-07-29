const express = require("express");

const router = express.Router();

const db = require("../database/history.db");

// ==========================================
// ENREGISTRER UNE ACTION
// ==========================================

function logHistory(req, {

    action,

    details = ""
    

}) {
    console.log(">>> logHistory appelé :", action, details);
    try {

        const user = req.session.user;

        db.prepare(`
            INSERT INTO history (
                created_at,
                user_id,
                username,
                action,
                details,
                ip
            )
            VALUES (
                datetime('now','localtime'),
                ?, ?, ?, ?, ?
            )
        `).run(

            user?.id ?? null,

            user?.username ?? "Système",

            action,

            details,

            req.ip

        );

    }

    catch (err) {

        console.error("Erreur historique :", err);

    }

}

// ==========================================
// LISTE DE L'HISTORIQUE
// ==========================================

router.get("/", (req, res) => {

    try {

        const history = db.prepare(`

            SELECT *

            FROM history

            ORDER BY created_at DESC

        `).all();

        res.json({

            success: true,

            history

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// ==========================================
// VIDER L'HISTORIQUE
// ==========================================

router.delete("/", (req, res) => {

    try {

        db.prepare("DELETE FROM history").run();

        res.json({

            success: true,

            message: "Historique vidé."

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

module.exports = {

    router,

    logHistory

};