const db = require("../database/database");

// ======================================================
// Charger un parcours
// ======================================================

exports.load = (req, res) => {

    const pathId = req.params.id;

    try {

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

        // État
        if (!req.session.user) {
            return res.status(401).json({
                error: "Utilisateur non connecté"
            });
        }
        const userId = req.session.user.id;

        const state = db.prepare(`
            SELECT *
            FROM progression_state
            WHERE path_id = ?
            AND user_id = ?
        `).get(pathId, userId);

        res.json({

            path,

            milestones,

            state

        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({

            error: error.message

        });

    }
  };
    
// ======================================================
// Historique des progressions
// ======================================================

    exports.history = (req, res) => {

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

  

};

// ======================================================
// Enregistrer une progression
// ======================================================

exports.save = (req, res) => {

    const userId = req.session.user.id;
    
    const {

        pathId,
        milestoneId,
        ancienScore,
        nouveauScore,
        variation

    } = req.body;

    const state = db.prepare(`
        SELECT *
        FROM progression_state
        WHERE path_id = ?
        AND user_id = ?
    `).get(pathId, userId);

    try {

        const transaction = db.transaction(() => {

            // Historique

           db.prepare(`
                INSERT INTO progression_history (

                    user_id,
                    path_id,
                    milestone_id,
                    old_score,
                    new_score,
                    variation,
                    note

                )

                VALUES (?, ?, ?, ?, ?, ?, ?)

            `).run(

                userId,
                pathId,
                milestoneId,
                ancienScore,
                nouveauScore,
                variation,
                ""

            );
        if (state) {

            db.prepare(`
                UPDATE progression_state
                SET progress = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE path_id = ?
                AND user_id = ?
            `).run(

                nouveauScore / 100,
                pathId,
                userId

            );

        } else {

            db.prepare(`
                INSERT INTO progression_state (

                    path_id,
                    progress,
                    user_id

                )
                VALUES (?, ?, ?)
            `).run(

                pathId,
                nouveauScore / 100,
                userId

            );

        }

        // Progression actuelle

        db.prepare(`
            UPDATE progression_state
            SET progress = ?
            WHERE path_id = ?
            AND user_id = ?
        `).run(

            nouveauScore / 100,
            pathId,
            userId

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

};