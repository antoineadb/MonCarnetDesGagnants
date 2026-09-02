const db = require("../database/database");

// ===============================
// GET — Toutes les affaires
// ===============================
exports.getAll = (req, res) => {
    try {
        const rows = db.prepare(`
            SELECT *
            FROM anals
            WHERE user_id = ?
            ORDER BY created_at DESC
        `).all(req.session.user.id);

        res.json(rows);

    } catch (error) {
        console.error("Erreur récupération des archives :", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des archives"
        });
    }
};


// ===============================
// GET — Une affaire
// ===============================
exports.getOne = (req, res) => {
    try {
        const row = db.prepare(`
            SELECT *
            FROM anals
            WHERE id = ?
            AND user_id = ?
        `).get(
            req.params.id,
            req.session.user.id
        );

        if (!row) {
            return res.status(404).json({
                error: "Affaire introuvable"
            });
        }

        res.json(row);

    } catch (error) {
        console.error("Erreur récupération de l'affaire :", error);
        res.status(500).json({
            error: "Erreur lors de la récupération de l'affaire"
        });
    }
};


// ===============================
// POST — Nouvelle affaire
// ===============================
exports.create = (req, res) => {
    try {
        const {
            title,
            category,
            date,
            content,
            sensitive
        } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                error: "Le titre et le contenu sont obligatoires"
            });
        }

        const result = db.prepare(`
            INSERT INTO anals (
                user_id,
                title,
                category,
                date,
                content,
                sensitive
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            req.session.user.id,
            title,
            category || null,
            date || null,
            content,
            sensitive ? 1 : 0
        );

        const newAnal = db.prepare(`
            SELECT *
            FROM anals
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json(newAnal);

    } catch (error) {
        console.error("Erreur création archive :", error);
        res.status(500).json({
            error: "Erreur lors de la création de l'affaire"
        });
    }
};


// ===============================
// PUT — Modifier une affaire
// ===============================
exports.update = (req, res) => {
    try {
        const {
            title,
            category,
            date,
            content,
            sensitive
        } = req.body;

        const result = db.prepare(`
            UPDATE anals
            SET
                title = ?,
                category = ?,
                date = ?,
                content = ?,
                sensitive = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            AND user_id = ?
        `).run(
            title,
            category || null,
            date || null,
            content,
            sensitive ? 1 : 0,
            req.params.id,
            req.session.user.id
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Affaire introuvable"
            });
        }

        const updatedAnal = db.prepare(`
            SELECT *
            FROM anals
            WHERE id = ?
            AND user_id = ?
        `).get(
            req.params.id,
            req.session.user.id
        );

        res.json(updatedAnal);

    } catch (error) {
        console.error("Erreur modification archive :", error);
        res.status(500).json({
            error: "Erreur lors de la modification de l'affaire"
        });
    }
};


// ===============================
// DELETE — Supprimer une affaire
// ===============================
exports.remove = (req, res) => {
    try {
        const result = db.prepare(`
            DELETE FROM anals
            WHERE id = ?
            AND user_id = ?
        `).run(
            req.params.id,
            req.session.user.id
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Affaire introuvable"
            });
        }

        res.json({
            success: true
        });

    } catch (error) {
        console.error("Erreur suppression archive :", error);
        res.status(500).json({
            error: "Erreur lors de la suppression de l'affaire"
        });
    }
};