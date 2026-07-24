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

// ======================================================
// Historique des progressions
// ======================================================

router.get("/history/:id", (req, res) => {

    const pathId = req.params.id;

    try {

        const history = db.prepare(`
            SELECT

                h.id,
                h.path_id,
                h.milestone_id,
                h.old_score,
                h.new_score,
                h.variation,
                h.note,
                h.created_at,

                m.code,
                m.title,
                m.icon,
                m.color

            FROM progression_history h

            INNER JOIN progression_milestones m

                ON m.id = h.milestone_id

            WHERE h.path_id = ?

            ORDER BY h.created_at DESC

        `).all(pathId);

        res.json(history);

    }
    catch (error) {

        console.error(error);

        res.status(500).json({

            error: error.message

        });

    }

});

   // ======================================================
// Enregistrer une progression
// ======================================================

router.post("/save", (req, res) => {

    const {

        pathId,
        milestoneId,
        ancienScore,
        nouveauScore,
        variation

    } = req.body;

    try {

        const transaction = db.transaction(() => {

            // Historique

            db.prepare(`
                INSERT INTO progression_history (

                    path_id,
                    milestone_id,
                    old_score,
                    new_score,
                    variation

                )
                VALUES (?, ?, ?, ?, ?)
            `).run(

                pathId,
                milestoneId,
                ancienScore,
                nouveauScore,
                variation

            );

            // Progression actuelle

            db.prepare(`
                UPDATE progression_state
                SET progress = ?
                WHERE path_id = ?
            `).run(

                nouveauScore / 100,
                pathId

            );

        });

        transaction();

        res.json({

            success: true

        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            error: error.message

        });

    }

});

module.exports = router;