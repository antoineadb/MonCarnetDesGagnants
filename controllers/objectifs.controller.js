const db = require("../database/database");


/* ======================================================
   RÉCUPÉRER LES OBJECTIFS DE L'UTILISATEUR
   ====================================================== */

function getAll(req, res) {

    const userId = req.session.user.id;

    try {

        const objectifs = db.prepare(`
            SELECT
                id,
                categorie_id,
                titre,
                description,
                progression,
                statut,
                ordre,
                created_at,
                updated_at
            FROM objectifs
            WHERE user_id = ?
            ORDER BY categorie_id ASC, ordre ASC, id ASC
        `).all(userId);


        res.json(objectifs);

    } catch (error) {

        console.error(
            "❌ Erreur récupération objectifs :",
            error
        );

        res.status(500).json({
            error: "Impossible de récupérer les objectifs."
        });

    }
}


/* ======================================================
   CRÉER UN OBJECTIF
   ====================================================== */

function create(req, res) {

    const userId = req.session.user.id;

    const {
        categorie_id,
        titre,
        description
    } = req.body;


    const categorieId =
        Number(categorie_id);


    if (!Number.isInteger(categorieId)) {

        return res.status(400).json({
            error: "Identifiant de catégorie invalide."
        });

    }


    if (!titre || !titre.trim()) {

        return res.status(400).json({
            error: "Le titre de l'objectif est obligatoire."
        });

    }


    try {

        // Vérifier que la catégorie appartient bien à l'utilisateur

        const categorie =
            db.prepare(`
                SELECT id
                FROM categories_objectifs
                WHERE
                    id = ?
                    AND user_id = ?
            `).get(
                categorieId,
                userId
            );


        if (!categorie) {

            return res.status(404).json({
                error: "Catégorie introuvable."
            });

        }


        // Récupérer la dernière position
        // dans cette catégorie

        const dernier =
            db.prepare(`
                SELECT MAX(ordre) AS ordre
                FROM objectifs
                WHERE
                    user_id = ?
                    AND categorie_id = ?
            `).get(
                userId,
                categorieId
            );


        const ordre =
            dernier.ordre === null
                ? 0
                : dernier.ordre + 1;


        const result =
            db.prepare(`
                INSERT INTO objectifs
                (
                    user_id,
                    categorie_id,
                    titre,
                    description,
                    progression,
                    statut,
                    ordre
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(
                userId,
                categorieId,
                titre.trim(),
                description?.trim() || "",
                0,
                "a_commencer",
                ordre
            );


        const objectif =
            db.prepare(`
                SELECT
                    id,
                    categorie_id,
                    titre,
                    description,
                    progression,
                    statut,
                    ordre,
                    created_at,
                    updated_at
                FROM objectifs
                WHERE
                    id = ?
                    AND user_id = ?
            `).get(
                result.lastInsertRowid,
                userId
            );


        res.status(201).json(objectif);

    } catch (error) {

        console.error(
            "❌ Erreur création objectif :",
            error
        );

        res.status(500).json({
            error: "Impossible de créer l'objectif."
        });

    }
}


/* ======================================================
   MODIFIER UN OBJECTIF
   ====================================================== */

function update(req, res) {

    const userId = req.session.user.id;

    const objectifId =
        Number(req.params.id);


    const {
        categorie_id,
        titre,
        description,
        progression,
        statut
    } = req.body;


    const categorieId =
        Number(categorie_id);


    if (!Number.isInteger(objectifId)) {

        return res.status(400).json({
            error: "Identifiant d'objectif invalide."
        });

    }


    if (!Number.isInteger(categorieId)) {

        return res.status(400).json({
            error: "Identifiant de catégorie invalide."
        });

    }


    if (!titre || !titre.trim()) {

        return res.status(400).json({
            error: "Le titre de l'objectif est obligatoire."
        });

    }


    const progressionValue =
        Number(progression);


    if (
        !Number.isInteger(progressionValue) ||
        progressionValue < 0 ||
        progressionValue > 100
    ) {

        return res.status(400).json({
            error: "La progression doit être comprise entre 0 et 100."
        });

    }


    const statutsAutorises = [
        "a_commencer",
        "en_cours",
        "atteint",
        "abandonne"
    ];


    if (!statutsAutorises.includes(statut)) {

        return res.status(400).json({
            error: "Statut d'objectif invalide."
        });

    }


    try {

        // Vérifier que la catégorie appartient
        // bien à l'utilisateur

        const categorie =
            db.prepare(`
                SELECT id
                FROM categories_objectifs
                WHERE
                    id = ?
                    AND user_id = ?
            `).get(
                categorieId,
                userId
            );


        if (!categorie) {

            return res.status(404).json({
                error: "Catégorie introuvable."
            });

        }


        const result =
            db.prepare(`
                UPDATE objectifs

                SET
                    categorie_id = ?,
                    titre = ?,
                    description = ?,
                    progression = ?,
                    statut = ?,
                    updated_at = CURRENT_TIMESTAMP

                WHERE
                    id = ?
                    AND user_id = ?
            `).run(
                categorieId,
                titre.trim(),
                description?.trim() || "",
                progressionValue,
                statut,
                objectifId,
                userId
            );


        if (result.changes === 0) {

            return res.status(404).json({
                error: "Objectif introuvable."
            });

        }


        const objectif =
            db.prepare(`
                SELECT
                    id,
                    categorie_id,
                    titre,
                    description,
                    progression,
                    statut,
                    ordre,
                    created_at,
                    updated_at
                FROM objectifs
                WHERE
                    id = ?
                    AND user_id = ?
            `).get(
                objectifId,
                userId
            );


        res.json(objectif);

    } catch (error) {

        console.error(
            "❌ Erreur modification objectif :",
            error
        );

        res.status(500).json({
            error: "Impossible de modifier l'objectif."
        });

    }
}


/* ======================================================
   SUPPRIMER UN OBJECTIF
   ====================================================== */

function remove(req, res) {

    const userId = req.session.user.id;

    const objectifId =
        Number(req.params.id);


    if (!Number.isInteger(objectifId)) {

        return res.status(400).json({
            error: "Identifiant d'objectif invalide."
        });

    }


    try {

        const result =
            db.prepare(`
                DELETE FROM objectifs

                WHERE
                    id = ?
                    AND user_id = ?
            `).run(
                objectifId,
                userId
            );


        if (result.changes === 0) {

            return res.status(404).json({
                error: "Objectif introuvable."
            });

        }


        res.json({
            success: true
        });

    } catch (error) {

        console.error(
            "❌ Erreur suppression objectif :",
            error
        );

        res.status(500).json({
            error: "Impossible de supprimer l'objectif."
        });

    }
}


/* ======================================================
   MODIFIER L'ORDRE DES OBJECTIFS
   ====================================================== */

function reorder(req, res) {

    const userId = req.session.user.id;

    const {
        objectifs
    } = req.body;


    if (!Array.isArray(objectifs)) {

        return res.status(400).json({
            error: "Liste d'objectifs invalide."
        });

    }


    try {

        const update =
            db.prepare(`
                UPDATE objectifs

                SET
                    ordre = ?,
                    updated_at = CURRENT_TIMESTAMP

                WHERE
                    id = ?
                    AND user_id = ?
            `);


        const transaction =
            db.transaction(() => {

                objectifs.forEach(
                    (objectif, index) => {

                        update.run(
                            index,
                            objectif.id,
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
            "❌ Erreur réorganisation objectifs :",
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