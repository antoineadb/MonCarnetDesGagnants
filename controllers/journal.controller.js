const db = require("../database/database");

/**
 * Retourne tous les journaux
 */
exports.getAll = (req, res) => {

    const rows = db.prepare(`
        SELECT *
        FROM journal
        ORDER BY created_at DESC
    `).all();

    res.json(rows);

};

/**
 * Création d'une entrée
 */
exports.create = (req, res) => {

    const { title, content, mood } = req.body;

    if (!title || !content) {

        return res.status(400).json({
            error: "Le titre et le contenu sont obligatoires."
        });

    }

    const stmt = db.prepare(`
        INSERT INTO journal
        (
            title,
            content,
            mood
        )
        VALUES
        (
            ?,
            ?,
            ?
        )
    `);

    const result = stmt.run(
        title,
        content,
        mood
    );

    res.status(201).json({

        id: result.lastInsertRowid,
        message: "Journal enregistré."

    });

};

/**
 * Modification
 */
exports.update = (req, res) => {

    const { id } = req.params;

    const { title, content, mood } = req.body;

    db.prepare(`
        UPDATE journal
        SET
            title = ?,
            content = ?,
            mood = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(

        title,
        content,
        mood,
        id

    );

    res.json({

        message: "Journal modifié."

    });

};

/**
 * Suppression
 */
exports.remove = (req, res) => {

    const { id } = req.params;

    db.prepare(`
        DELETE FROM journal
        WHERE id = ?
    `).run(id);

    res.json({

        message: "Journal supprimé."

    });

};