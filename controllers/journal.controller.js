const db = require("../database/database");

/**
 * Retourne tous les journaux
 */
exports.getAll = (req, res) => {
    
    const userId = req.session.user.id;
    
    const rows = db.prepare(`
        SELECT *
        FROM journal
        WHERE user_id = ?
        ORDER BY updated_at DESC
        LIMIT 3
    `).all(userId);

    res.json(rows);

};

exports.getHistory = (req, res) => {

    const userId = req.session.user.id;

    const rows = db.prepare(`
        SELECT *
        FROM journal
        WHERE user_id = ?
        ORDER BY  updated_at DESC
    `).all();

    res.json(rows);

};

/**
 * Création d'une entrée
 */
exports.create = (req, res) => {

    const { title, content, mood } = req.body;

    const userId = req.session.user.id;

    if (!title || !content) {

        return res.status(400).json({
            error: "Le titre et le contenu sont obligatoires."
        });

    }
    
    const stmt = db.prepare(`
        INSERT INTO journal
        (
            user_id,
            title,
            content,
            mood
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?
        )
    `);

    const result = stmt.run(
        userId,
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

    const userId = req.session.user.id;

    const result = db.prepare(`
        UPDATE journal
        SET
            title = ?,
            content = ?,
            mood = ?,
            updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            AND user_id = ?
    `).run(
        title,
        content,
        mood,
        id,
        userId
    );

if (result.changes === 0) {

    return res.status(404).json({
        error: "Journal introuvable."
    });

}

res.json({
    message: "Journal modifié."
});

};

/**
 * Suppression
 */
exports.remove = (req, res) => {
   
    const { id } = req.params;
    const userId = req.session.user.id;

    const result = db.prepare(`
        DELETE FROM journal
        WHERE id = ?
        AND user_id = ?
    `).run(id,userId);

    if (result.changes === 0) {

        return res.status(404).json({
            error: "Journal introuvable."
        });

    }

    res.json({
        message: "Journal supprimé."
    });

};

exports.getOne = (req, res) => {

    const { id } = req.params;
    const userId = req.session.user.id;

    const row = db.prepare(`
        SELECT *
        FROM journal
        WHERE id = ? AND user_id = ?
    `).get(id,userId);

    if (!row) {

        return res.status(404).json({
            error: "Journal introuvable."
        });

    }

    res.json(row);

};