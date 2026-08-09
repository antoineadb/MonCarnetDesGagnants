const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const db = require("../database/database");

const profileUpload =
    require("../middlewares/profile-upload.middleware");

// =========================================
// CONNEXION
// =========================================

router.post("/login", (req, res) => {
console.log("🔥 ROUTE LOGIN APPELÉE 🔥");

    const { username, password } = req.body || {};

    if (!username || !password) {

        return res.status(400).json({

            success: false,
            message: "Utilisateur ou mot de passe manquant."

        });

    }

    const user = db.prepare(`
        SELECT
            id,
            username,
            password_hash,
            firstname,
            lastname,
            role
        FROM users
        WHERE username = ?
    `).get(username);
    console.log("Utilisateur trouvé :", user);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {

        if (user) {

           const loginResult = db.prepare(`
                INSERT INTO login_history
                (
                    user_id,
                    ip,
                    user_agent,
                    success
                )
                VALUES (?, ?, ?, ?)
            `).run(

                user.id,
                req.ip,
                req.get("User-Agent"),
                0               

            );
        }

        return res.status(401).json({

            success: false,
            message: "Utilisateur ou mot de passe incorrect."

        });

    }

    const loginResult = db.prepare(`
        INSERT INTO login_history
        (
            user_id,
            ip,
            user_agent,
            success,
            session_id
        )
        VALUES (?, ?, ?, ?, ?)
    `).run(

        user.id,
        req.ip,
        req.get("User-Agent"),
        1,
        req.sessionID

    );
    req.session.user = {

        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role

    };
    
    req.session.loginHistoryId = loginResult.lastInsertRowid;

    console.log("Avant save :", req.session.user);


    req.session.save(err => {

        if (err) {
            console.error("Erreur session :", err);

            return res.status(500).json({
                success: false,
                message: "Erreur de session"
            });
        }

        delete user.password_hash;

        res.json({
            success: true,
            user
        });
        console.log("Session sauvegardée :", req.session.user);

    });

});


router.get("/login-history", (req, res) => {

    const history = db.prepare(`
        SELECT

            l.id,
            u.username,
            l.login_at,
            l.ip,
            l.success

        FROM login_history l

        JOIN users u
            ON u.id = l.user_id

        ORDER BY l.login_at DESC

        LIMIT 100

    `).all();

    res.json(history);

});

router.get("/me", (req, res) => {

    if (!req.session.user) {

        return res.status(401).json({

            success: false,
            message: "Aucun utilisateur connecté."

        });

    }

    res.json(req.session.user);

});

// =========================================
// PHOTO DE PROFIL
// =========================================

router.post(
    "/profile-photo",
    profileUpload.single("profilePhoto"),
    (req, res) => {

        if (!req.session.user) {

            return res.status(401).json({

                success: false,
                message: "Aucun utilisateur connecté."

            });

        }

        if (!req.file) {

            return res.status(400).json({

                success: false,
                message: "Aucune photo reçue."

            });

        }

        const imagePath =
            `/uploads/profile/${req.file.filename}`;

        db.prepare(`
            UPDATE users
            SET profile_image = ?
            WHERE id = ?
        `).run(
            imagePath,
            req.session.user.id
        );

        req.session.user.profile_image =
            imagePath;

        req.session.save(err => {

            if (err) {

                console.error(
                    "Erreur sauvegarde session :",
                    err
                );

                return res.status(500).json({

                    success: false,
                    message: "Erreur de session."

                });

            }

            res.json({

                success: true,
                profile_image: imagePath

            });

        });

    }
);

// =========================================
// DÉCONNEXION
// =========================================

router.post("/logout", (req, res) => {

     console.log("🔥 ROUTE LOGOUT APPELÉE 🔥");

    if (req.session.loginHistoryId) {

        db.prepare(`
            UPDATE login_history
            SET logout_at = datetime('now','localtime')
            WHERE id = ?
        `).run(req.session.loginHistoryId);

    }

    req.session.destroy(err => {

        if (err) {

            return res.status(500).json({

                success: false,
                message: "Erreur lors de la déconnexion."

            });

        }

        res.json({

            success: true

        });

    });

});

module.exports = router;