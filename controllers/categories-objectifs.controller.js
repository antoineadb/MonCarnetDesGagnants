const db = require("../database/database");


/* ======================================================
   RÉCUPÉRER LES CATÉGORIES DE L'UTILISATEUR
   ====================================================== */

function getAll(req, res) {

    const userId = req.session.user.id;

    try {

        const categories = db.prepare(`
            SELECT
                id,
                nom,
                egyptien,
                symbole,
                ordre,
                created_at,
                updated_at
            FROM categories_objectifs
            WHERE user_id = ?
            ORDER BY ordre ASC, id ASC
        `).all(userId);


        res.json(categories);

    } catch (error) {

        console.error(
            "❌ Erreur récupération catégories :",
            error
        );

        res.status(500).json({
            error: "Impossible de récupérer les catégories."
        });

    }
}


/* ======================================================
   CRÉER UNE CATÉGORIE
   ====================================================== */

function create(req, res) {

    const userId = req.session.user.id;

    const {
        nom,
        egyptien,
        symbole
    } = req.body;


    if (!nom || !nom.trim()) {

        return res.status(400).json({
            error: "Le nom de la catégorie est obligatoire."
        });

    }


    try {

        // On récupère la dernière position
        const derniere =
            db.prepare(`
                SELECT MAX(ordre) AS ordre
                FROM categories_objectifs
                WHERE user_id = ?
            `).get(userId);


        const ordre =
            derniere.ordre === null
                ? 0
                : derniere.ordre + 1;


        const result =
            db.prepare(`
                INSERT INTO categories_objectifs
                (
                    user_id,
                    nom,
                    egyptien,
                    symbole,
                    ordre
                )
                VALUES (?, ?, ?, ?, ?)
            `).run(
                userId,
                nom.trim(),
                egyptien?.trim() || "",
                symbole?.trim() || "𓂀",
                ordre
            );


        const categorie =
            db.prepare(`
                SELECT
                    id,
                    nom,
                    egyptien,
                    symbole,
                    ordre,
                    created_at,
                    updated_at
                FROM categories_objectifs
                WHERE id = ?
            `).get(result.lastInsertRowid);


        res.status(201).json(categorie);

    } catch (error) {

        console.error(
            "❌ Erreur création catégorie :",
            error
        );

        res.status(500).json({
            error: "Impossible de créer la catégorie."
        });

    }
}


/* ======================================================
   MODIFIER UNE CATÉGORIE
   ====================================================== */

function update(req, res) {

    const userId = req.session.user.id;

    const categoryId =
        Number(req.params.id);

    const {
        nom,
        egyptien,
        symbole
    } = req.body;


    if (!Number.isInteger(categoryId)) {

        return res.status(400).json({
            error: "Identifiant de catégorie invalide."
        });

    }


    if (!nom || !nom.trim()) {

        return res.status(400).json({
            error: "Le nom de la catégorie est obligatoire."
        });

    }


    try {

        const result =
            db.prepare(`
                UPDATE categories_objectifs

                SET
                    nom = ?,
                    egyptien = ?,
                    symbole = ?,
                    updated_at = CURRENT_TIMESTAMP

                WHERE
                    id = ?
                    AND user_id = ?
            `).run(
                nom.trim(),
                egyptien?.trim() || "",
                symbole?.trim() || "𓂀",
                categoryId,
                userId
            );


        if (result.changes === 0) {

            return res.status(404).json({
                error: "Catégorie introuvable."
            });

        }


        const categorie =
            db.prepare(`
                SELECT
                    id,
                    nom,
                    egyptien,
                    symbole,
                    ordre,
                    created_at,
                    updated_at
                FROM categories_objectifs
                WHERE
                    id = ?
                    AND user_id = ?
            `).get(
                categoryId,
                userId
            );


        res.json(categorie);

    } catch (error) {

        console.error(
            "❌ Erreur modification catégorie :",
            error
        );

        res.status(500).json({
            error: "Impossible de modifier la catégorie."
        });

    }
}


/* ======================================================
   SUPPRIMER UNE CATÉGORIE
   ====================================================== */

function remove(req, res) {

    const userId = req.session.user.id;

    const categoryId =
        Number(req.params.id);


    if (!Number.isInteger(categoryId)) {

        return res.status(400).json({
            error: "Identifiant de catégorie invalide."
        });

    }


    try {

        const result =
            db.prepare(`
                DELETE FROM categories_objectifs

                WHERE
                    id = ?
                    AND user_id = ?
            `).run(
                categoryId,
                userId
            );


        if (result.changes === 0) {

            return res.status(404).json({
                error: "Catégorie introuvable."
            });

        }


        res.json({
            success: true
        });

    } catch (error) {

        console.error(
            "❌ Erreur suppression catégorie :",
            error
        );

        res.status(500).json({
            error: "Impossible de supprimer la catégorie."
        });

    }
}


/* ======================================================
   MODIFIER L'ORDRE DES CATÉGORIES
   ====================================================== */

function reorder(req, res) {

    const userId = req.session.user.id;

    const {
        categories
    } = req.body;


    if (!Array.isArray(categories)) {

        return res.status(400).json({
            error: "Liste de catégories invalide."
        });

    }


    try {

        const update =
            db.prepare(`
                UPDATE categories_objectifs

                SET
                    ordre = ?,
                    updated_at = CURRENT_TIMESTAMP

                WHERE
                    id = ?
                    AND user_id = ?
            `);


        const transaction =
            db.transaction(() => {

                categories.forEach(
                    (category, index) => {

                        update.run(
                            index,
                            category.id,
                            userId
                        );

                    }
                );

            });


        transaction();


        res.json({
            success: true
        });

    } catch (error) {

        console.error(
            "❌ Erreur réorganisation catégories :",
            error
        );

        res.status(500).json({
            error: "Impossible de modifier l'ordre."
        });

    }
}


/* ======================================================
   EXPORT
   ====================================================== */

module.exports = {

    getAll,
    create,
    update,
    remove,
    reorder

};