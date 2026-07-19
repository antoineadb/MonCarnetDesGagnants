const express = require("express");
const router = express.Router();
const db = require("../database/database");

// ======================================================
// Récupération d'un parcours
// ======================================================

router.get("/:id", (req, res) => {

    const pathId = req.params.id;

    // Parcours

    const path = db.prepare(`
        SELECT *
        FROM progression_paths
        WHERE id = ?
    `).get(pathId);

    if (!path) {

        return res.status(404).json({

            error: "Parcours introuvable"

        });

    }

    // Jalons

    const milestones = db.prepare(`
        SELECT *
        FROM progression_milestones
        WHERE path_id = ?
        ORDER BY step_order
    `).all(pathId);

    // Etat

    const state = db.prepare(`
        SELECT *
        FROM progression_state
        WHERE path_id = ?
    `).get(pathId);

    res.json({

        path,

        milestones,

        state

    });

});

module.exports = router;