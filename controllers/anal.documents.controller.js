const db = require("../database/database");

exports.upload = (req, res) => {

    const { id } = req.params;
    const userId = req.session.user.id;

    if (!req.file) {

        return res.status(400).json({
            error: "Aucun document reçu."
        });

    }

    // Vérifie que l'affaire appartient bien à l'utilisateur
    const anal = db.prepare(`
        SELECT id
        FROM anals
        WHERE id = ?
        AND user_id = ?
    `).get(id, userId);

    if (!anal) {

        return res.status(404).json({
            error: "Affaire introuvable."
        });

    }

    const result = db.prepare(`
        INSERT INTO anal_documents
        (
            anal_id,
            user_id,
            original_name,
            stored_name,
            mime_type,
            size
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(
        id,
        userId,
        req.file.originalname,
        req.file.filename,
        req.file.mimetype,
        req.file.size
    );

    res.status(201).json({

        id: result.lastInsertRowid,

        message: "Document enregistré.",

        document: {
            id: result.lastInsertRowid,
            original_name: req.file.originalname,
            mime_type: req.file.mimetype,
            size: req.file.size
        }

    });

};

/* =====================================================
   RÉCUPÉRER LES DOCUMENTS D'UNE AFFAIRE
===================================================== */

exports.getAll = (req, res) => {

    const { id } = req.params;
    const userId = req.session.user.id;

    // Vérifie que l'affaire appartient bien à l'utilisateur
    const anal = db.prepare(`
        SELECT id
        FROM anals
        WHERE id = ?
        AND user_id = ?
    `).get(id, userId);

    if (!anal) {

        return res.status(404).json({
            error: "Affaire introuvable."
        });

    }

    const documents = db.prepare(`
        SELECT
            id,
            original_name,
            stored_name,
            mime_type,
            size,
            created_at
        FROM anal_documents
        WHERE anal_id = ?
        AND user_id = ?
        ORDER BY created_at DESC
    `).all(id, userId);

    res.json(documents);

};