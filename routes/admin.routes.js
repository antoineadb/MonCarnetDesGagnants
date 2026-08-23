const express = require("express");
const router = express.Router();
const db = require("../database/database");
const { requireAdmin } = require("../middlewares/auth.middleware");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");


// Historique
const { logHistory } = require("./history.routes");

console.log("🔥 admin.routes chargé");
// ======================================================
// HISTORIQUE DES CONNEXIONS
// ======================================================

router.get("/login-history", requireAdmin, (req, res) => {

    const history = db.prepare(`
        SELECT
            l.id,
            u.username,
            l.login_at,
            l.ip,
            l.user_agent,
            l.success
        FROM login_history l
        JOIN users u
            ON u.id = l.user_id
        ORDER BY l.login_at DESC
    `).all();

    res.json(history);

});

router.get("/users", requireAdmin, (req, res) => {

    const users = db.prepare(`
        SELECT
            id,
            username,
            firstname,
            lastname,
            role
        FROM users
    `).all();

    res.json({
        success: true,
        users
    });

});

// =========================================
// SUPPRIMER UN UTILISATEUR
// =========================================

router.delete("/users/:id", requireAdmin, (req, res) => {

    const id = req.params.id;

    // Empêche la suppression de l'administrateur principal
    if (Number(id) === 1) {
        return res.json({
            success: false,
            message: "Impossible de supprimer l'administrateur principal."
        });
    }

    // Récupération du nom AVANT suppression
    const utilisateur = db.prepare(`
        SELECT username
        FROM users
        WHERE id = ?
    `).get(id);

    if (!utilisateur) {
        return res.json({
            success: false,
            message: "Utilisateur introuvable."
        });
    }

    // Suppression
    const result = db.prepare(`
        DELETE FROM users
        WHERE id = ?
    `).run(id);

    if (result.changes === 0) {
        return res.json({
            success: false,
            message: "Utilisateur introuvable."
        });
    }

    // Historique
    logHistory(req, {
        action: "DELETE_USER",
        details: `Utilisateur "${utilisateur.username}" supprimé`
    });

    // Réponse
    res.json({
        success: true
    });

});

// =========================================
// AJOUTER UN UTILISATEUR
// =========================================
console.log("✅ Déclaration de la route POST /users");
router.post("/users", requireAdmin, (req, res) => {
 console.log("🔥 POST /users exécuté");
    const {
        username,
        password,
        firstname,
        lastname,
        role
    } = req.body;

    if (!username || !password || !firstname || !lastname) {

        return res.status(400).json({

            success: false,
            message: "Tous les champs sont obligatoires."

        });

    }

    const existe = db.prepare(`
        SELECT id
        FROM users
        WHERE username = ?
    `).get(username);

    if (existe) {

        return res.json({

            success: false,
            message: "Ce nom d'utilisateur existe déjà."

        });

    }

    const hash = bcrypt.hashSync(password, 10);

    const result = db.prepare(`
        INSERT INTO users
        (
            username,
            password_hash,
            firstname,
            lastname,
            role
        )
        VALUES (?, ?, ?, ?, ?)
    `).run(

        username,
        hash,
        firstname,
        lastname,
        role

    );

    logHistory(req, {
        action: "CREATE_USER",
        details: `Utilisateur "${username}" créé`

    });

    res.json({

        success: true,
        id: result.lastInsertRowid

    });  
    
});

console.log("✅ Route POST /users enregistrée");

// =========================================
// MODIFIER UN UTILISATEUR
// =========================================

router.put("/users/:id", requireAdmin, (req, res) => {

    const id = req.params.id;

    const {
        username,
        password,
        firstname,
        lastname,
        role
    } = req.body;

    if (!username || !firstname || !lastname || !role) {

        return res.json({

            success: false,
            message: "Tous les champs sont obligatoires."

        });

    }

    // Vérifie qu'un autre utilisateur n'utilise pas déjà ce nom
    const existe = db.prepare(`
        SELECT id
        FROM users
        WHERE username = ?
          AND id <> ?
    `).get(username, id);

    if (existe) {

        return res.json({

            success: false,
            message: "Ce nom d'utilisateur existe déjà."

        });

    }

    if (password && password.trim() !== "") {

        const hash = bcrypt.hashSync(password, 10);

        db.prepare(`
            UPDATE users
            SET
                username = ?,
                password_hash = ?,
                firstname = ?,
                lastname = ?,
                role = ?
            WHERE id = ?
        `).run(

            username,
            hash,
            firstname,
            lastname,
            role,
            id

        );

    } else {

        db.prepare(`
            UPDATE users
            SET
                username = ?,
                firstname = ?,
                lastname = ?,
                role = ?
            WHERE id = ?
        `).run(

            username,
            firstname,
            lastname,
            role,
            id

        );

    }

    res.json({

        success: true

    });

    logHistory(req, {
        action: "UPDATE_USER",
        details: `Utilisateur "${username}" modifié`
    });
});



// =========================================
// LIRE UN UTILISATEUR
// =========================================

router.get("/users/:id", requireAdmin, (req, res) => {

    const id = req.params.id;

    const user = db.prepare(`
        SELECT
            id,
            username,
            firstname,
            lastname,
            role
        FROM users
        WHERE id = ?
    `).get(id);

    if (!user) {

        return res.json({

            success: false,
            message: "Utilisateur introuvable."

        });

    }

    res.json({

        success: true,
        user

    });

});


// ======================================================
// STATISTIQUES GÉNÉRALES
// ======================================================

router.get("/statistics", requireAdmin, (req, res) => {

    try {

        const books =
            db.prepare(`
                SELECT COUNT(*) AS count
                FROM books
            `).get().count;


        const gratitude =
            db.prepare(`
                SELECT COUNT(*) AS count
                FROM gratitude_cards
                WHERE deleted = 0
            `).get().count;


        const journal =
            db.prepare(`
                SELECT COUNT(*) AS count
                FROM journal
            `).get().count;


        const users =
            db.prepare(`
                SELECT COUNT(*) AS count
                FROM users
            `).get().count;

        const finished =
            db.prepare(`
                SELECT COUNT(*) AS count
                FROM books
                WHERE status = 'finished'
            `).get().count;

        const reading =
            db.prepare(`
                SELECT COUNT(*) AS count
                FROM books
                WHERE status = 'reading'
            `).get().count;

        const toRead =
            db.prepare(`
                SELECT COUNT(*) AS count
                FROM books
                WHERE status = 'to-read'
            `).get().count;

        const lifeBooks =
            db.prepare(`
                SELECT COUNT(*) AS count
                FROM books
                WHERE life_book = 1
            `).get().count;

        res.json({

            success: true,

            statistics: {

                books,
                gratitude,
                journal,
                users,

                finished,
                reading,
                toRead,
                lifeBooks

            }

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur statistiques :",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Impossible de récupérer les statistiques."

        });

    }

});

router.get("/chronicle", requireAdmin, (req, res) => {

    try {

        const activities = [

            ...db.prepare(`
                SELECT
                    'book' AS type,
                    title AS title,
                     cover AS cover,
                    created_at AS date
                FROM books
                ORDER BY created_at DESC
                LIMIT 8
            `).all(),

            ...db.prepare(`
                SELECT
                    'gratitude' AS type,
                    title AS title,
                    created_at AS date
                FROM gratitude_cards
                WHERE deleted = 0
                ORDER BY created_at DESC
                LIMIT 8
            `).all(),

            ...db.prepare(`
                SELECT
                    'journal' AS type,
                    title AS title,
                    created_at AS date
                FROM journal
                ORDER BY created_at DESC
                LIMIT 8
            `).all()

        ];

        activities.sort(
            (a, b) =>
                new Date(b.date) - new Date(a.date)
        );

        res.json({

            success: true,

            activities:
                activities.slice(0, 8)

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur chronique :",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Impossible de récupérer la chronique."

        });

    }

});

// ======================================================
// ÉVOLUTION DU CARNET
// ======================================================

router.get("/evolution", requireAdmin, (req, res) => {

    try {

        const activities = [

            ...db.prepare(`
                SELECT
                    'book' AS type,
                    created_at AS date
                FROM books
            `).all(),

            ...db.prepare(`
                SELECT
                    'gratitude' AS type,
                    created_at AS date
                FROM gratitude_cards
                WHERE deleted = 0
            `).all(),

            ...db.prepare(`
                SELECT
                    'journal' AS type,
                    created_at AS date
                FROM journal
            `).all()

        ];


        const days = {};


        activities.forEach(activity => {

            const day =
                activity.date.substring(0, 10);

            if (!days[day]) {

                days[day] = {
                    books: 0,
                    gratitude: 0,
                    journal: 0
                };

            }

            if (activity.type === "book") {
                days[day].books++;
            }

            if (activity.type === "gratitude") {
                days[day].gratitude++;
            }

            if (activity.type === "journal") {
                days[day].journal++;
            }

        });


        const dates =
            Object.keys(days).sort();


        let books = 0;
        let gratitude = 0;
        let journal = 0;


        const evolution =
            dates.map(date => {

                books += days[date].books;
                gratitude += days[date].gratitude;
                journal += days[date].journal;

                return {

                    date,

                    books,

                    gratitude,

                    journal

                };

            });


        res.json({

            success: true,

            evolution

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur évolution :",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Impossible de récupérer l'évolution."

        });

    }

});

// ======================================================
// HISTORIQUE DES SAUVEGARDES
// ======================================================

router.get("/backup-history", requireAdmin, (req, res) => {

    try {

        const backups = db.prepare(`
            SELECT
                id,
                created_at,
                filename,
                size,
                status,
                error_message
            FROM backup_history
            ORDER BY created_at DESC
        `).all();

        res.json({

            success: true,

            backups

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur historique sauvegardes :",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Impossible de récupérer l'historique des sauvegardes."

        });

    }

});

// ======================================================
// SAUVEGARDE DE LA BASE SQLITE
// ======================================================

router.get("/backup", requireAdmin, async (req, res) => {

    let filename = null;
    let backupPath = null;

    try {

        const maintenant = new Date();

        const date =
            maintenant.getFullYear() +
            "-" +
            String(maintenant.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(maintenant.getDate()).padStart(2, "0");

        const heure =
            String(maintenant.getHours()).padStart(2, "0") +
            "-" +
            String(maintenant.getMinutes()).padStart(2, "0");

        filename =
            `carnet-sauvegarde-${date}-${heure}.db`;

        backupPath =
            path.join(
                require("os").tmpdir(),
                filename
            );

        console.log(
            "💾 Création de la sauvegarde :",
            filename
        );

        // --------------------------------------------------
        // Création de la sauvegarde SQLite
        // --------------------------------------------------

        await db.backup(backupPath);

        // --------------------------------------------------
        // Récupération de la taille du fichier
        // --------------------------------------------------

        const stats =
            fs.statSync(backupPath);

        const size =
            stats.size;

        console.log(
            "✔ Sauvegarde créée :",
            backupPath
        );

        console.log(
            "📦 Taille :",
            size,
            "octets"
        );

        // --------------------------------------------------
        // Enregistrement de la sauvegarde réussie
        // --------------------------------------------------

        db.prepare(`
            INSERT INTO backup_history
            (
                filename,
                size,
                status
            )
            VALUES (?, ?, ?)
        `).run(
            filename,
            size,
            "OK"
        );

        // --------------------------------------------------
        // Téléchargement
        // --------------------------------------------------

        res.download(
            backupPath,
            filename,
            (error) => {

                // Suppression du fichier temporaire

                fs.unlink(
                    backupPath,
                    () => {}
                );

                if (error) {

                    console.error(
                        "❌ Erreur téléchargement sauvegarde :",
                        error
                    );

                }

            }
        );

    }

    catch (error) {

        console.error(
            "❌ Erreur sauvegarde SQLite :",
            error
        );

        // --------------------------------------------------
        // Enregistrement de l'échec
        // --------------------------------------------------

        try {

            db.prepare(`
                INSERT INTO backup_history
                (
                    filename,
                    size,
                    status,
                    error_message
                )
                VALUES (?, ?, ?, ?)
            `).run(
                filename,
                null,
                "KO",
                error.message
            );

        }

        catch (historyError) {

            console.error(
                "❌ Impossible d'enregistrer l'échec :",
                historyError
            );

        }

        res.status(500).json({

            success: false,

            message:
                "Impossible de créer la sauvegarde."

        });

    }

});

module.exports = router;