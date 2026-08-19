const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Brevo = require("@getbrevo/brevo");
const db = require("../database/database");
const profileUpload =
    require("../middlewares/profile-upload.middleware");

const brevo = new Brevo.BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});

// =========================================
// CONNEXION
// =========================================

router.post("/login", (req, res) => {
console.log("🔥 ROUTE LOGIN APPELÉE 🔥");

    const { username, password } = req.body || {};
    
    console.log( "🔐 Login reçu :", JSON.stringify(username) );

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
        email,
        profile_image,
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
        email: user.email,
        profile_image: user.profile_image,
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


// =========================================
// MODIFICATION DU COMPTE
// =========================================

router.put("/me", (req, res) => {

    if (!req.session.user) {

        return res.status(401).json({

            success: false,
            message: "Aucun utilisateur connecté."

        });

    }

    const {
        firstname,
        lastname,
        email
    } = req.body || {};


    // =========================================
    // VALIDATION
    // =========================================

    if (!firstname || !firstname.trim()) {

        return res.status(400).json({

            success: false,
            message: "Le prénom est obligatoire."

        });

    }

    if (!lastname || !lastname.trim()) {

        return res.status(400).json({

            success: false,
            message: "Le nom est obligatoire."

        });

    }


    // =========================================
    // MISE À JOUR DATABASE
    // =========================================

    db.prepare(`
        UPDATE users
        SET
            firstname = ?,
            lastname = ?,
            email = ?
        WHERE id = ?
    `).run(

        firstname.trim(),
        lastname.trim(),
        email?.trim() || null,
        req.session.user.id

    );


    // =========================================
    // MISE À JOUR SESSION
    // =========================================

    req.session.user.firstname =
        firstname.trim();

    req.session.user.lastname =
        lastname.trim();

    req.session.user.email =
        email?.trim() || null;


    req.session.save(err => {

        if (err) {

            console.error(
                "Erreur sauvegarde session :",
                err
            );

            return res.status(500).json({

                success: false,
                message: "Erreur lors de la sauvegarde."

            });

        }


        res.json({

            success: true,

            user: req.session.user

        });

    });

});
// =========================================
// MOT DE PASSE OUBLIÉ
// =========================================


router.post("/forgot-password", async (req, res) => {

    const { email } = req.body || {};

    // =========================================
    // RÉPONSE GÉNÉRIQUE
    // =========================================

    const genericResponse = {

        success: true,

        message:
            "Si cette adresse e-mail correspond à un compte, un lien de réinitialisation va être envoyé."

    };


    // =========================================
    // VALIDATION
    // =========================================

    if (!email || !email.trim()) {

        return res.status(400).json({

            success: false,

            message:
                "Veuillez saisir votre adresse e-mail."

        });

    }


    const normalizedEmail =
        email.trim().toLowerCase();


    // =========================================
    // RECHERCHE UTILISATEUR
    // =========================================

    const user = db.prepare(`
        SELECT
            id,
            email
        FROM users
        WHERE LOWER(email) = ?
    `).get(normalizedEmail);


    // =========================================
    // AUCUN COMPTE
    // =========================================

    if (!user) {

        return res.json(genericResponse);

    }


    // =========================================
    // GÉNÉRATION DU TOKEN
    // =========================================

    const token =
        crypto.randomBytes(32).toString("hex");


    const tokenHash =
        crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");


    // =========================================
    // EXPIRATION
    // 30 MINUTES
    // =========================================

    const expiresAt =
        new Date(
            Date.now() + 30 * 60 * 1000
        ).toISOString();


    // =========================================
    // SUPPRESSION DES ANCIENS TOKENS
    // =========================================

    db.prepare(`
        DELETE FROM password_reset_tokens
        WHERE user_id = ?
    `).run(user.id);


    // =========================================
    // ENREGISTREMENT DU TOKEN
    // =========================================

    db.prepare(`
        INSERT INTO password_reset_tokens (
            user_id,
            token_hash,
            expires_at
        )
        VALUES (?, ?, ?)
    `).run(

        user.id,
        tokenHash,
        expiresAt

    );

    // =========================================
// ENVOI DE L'EMAIL DE RÉINITIALISATION
// =========================================

const resetUrl =
    `${process.env.APP_URL}/pages/reinitialiser-mot-de-passe.html?token=${token}`;


    try {

        await brevo.transactionalEmails.sendTransacEmail({

            sender: {
                name: "Le Carnet des Gagnants",
                email: process.env.MAIL_FROM
            },

            to: [
                {
                    email: normalizedEmail
                }
            ],

            subject:
                "Réinitialisation de votre mot de passe",

            htmlContent: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                    background: #f7f1e3;
                    color: #3b2a1f;
                ">

                    <h2>
                        Le Carnet des Gagnants
                    </h2>

                    <p>
                        Vous avez demandé la réinitialisation
                        de votre mot de passe.
                    </p>

                    <p>
                        Cliquez sur le bouton ci-dessous
                        pour choisir un nouveau mot de passe.
                    </p>

                    <p style="text-align:center; margin:30px 0;">

                        <a
                            href="${resetUrl}"
                            style="
                                display:inline-block;
                                padding:14px 24px;
                                background:#5a3825;
                                color:#ffffff;
                                text-decoration:none;
                                border-radius:6px;
                            "
                        >
                            Réinitialiser mon mot de passe
                        </a>

                    </p>

                    <p>
                        Ce lien est valable pendant
                        <strong>30 minutes</strong>.
                    </p>

                    <p>
                        Si vous n'êtes pas à l'origine de cette
                        demande, vous pouvez ignorer cet e-mail.
                    </p>

                </div>
            `

        });

        console.log(
            "📧 E-mail de réinitialisation envoyé"
        );

    }
    catch (error) {

        console.error(
            "❌ Erreur envoi e-mail Brevo :",
            error
        );

    }
    // =========================================
    // RÉPONSE
    // =========================================

    return res.json(genericResponse);

});
// =========================================
// VÉRIFICATION TOKEN RÉINITIALISATION
// =========================================


router.get("/verify-reset-token", (req, res) => {

    const { token } = req.query;

    if (!token) {

        return res.status(400).json({

            success: false,

            message: "Token de réinitialisation manquant."

        });

    }


    // =========================================
    // HASH DU TOKEN REÇU
    // =========================================

    const tokenHash =
        crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");


    // =========================================
    // RECHERCHE DU TOKEN
    // =========================================

    const resetToken = db.prepare(`
        SELECT
            id,
            user_id,
            expires_at,
            used_at
        FROM password_reset_tokens
        WHERE token_hash = ?
    `).get(tokenHash);


    // =========================================
    // TOKEN INCONNU
    // =========================================

    if (!resetToken) {

        return res.status(400).json({

            success: false,

            message:
                "Ce lien de réinitialisation est invalide."

        });

    }


    // =========================================
    // TOKEN DÉJÀ UTILISÉ
    // =========================================

    if (resetToken.used_at) {

        return res.status(400).json({

            success: false,

            message:
                "Ce lien de réinitialisation a déjà été utilisé."

        });

    }


    // =========================================
    // TOKEN EXPIRÉ
    // =========================================

    if (
        new Date(resetToken.expires_at) <= new Date()
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Ce lien de réinitialisation a expiré."

        });

    }


    // =========================================
    // TOKEN VALIDE
    // =========================================

    return res.json({

        success: true,

        message:
            "Le lien de réinitialisation est valide."

    });

});

// =========================================
// RÉINITIALISATION DU MOT DE PASSE
// =========================================

router.post("/reset-password", (req, res) => {

    const {
        token,
        password,
        confirmPassword
    } = req.body || {};


    // =========================================
    // VALIDATION
    // =========================================

    if (!token) {

        return res.status(400).json({

            success: false,
            message: "Token de réinitialisation manquant."

        });

    }

    if (!password || !confirmPassword) {

        return res.status(400).json({

            success: false,
            message: "Veuillez renseigner les deux mots de passe."

        });

    }

    if (password !== confirmPassword) {

        return res.status(400).json({

            success: false,
            message:
                "Les deux mots de passe ne correspondent pas."

        });

    }

    if (password.length < 8) {

        return res.status(400).json({

            success: false,
            message:
                "Le mot de passe doit contenir au moins 8 caractères."

        });

    }


    // =========================================
    // HASH DU TOKEN
    // =========================================

    const tokenHash =
        crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");


    // =========================================
    // RECHERCHE DU TOKEN
    // =========================================

    const resetToken = db.prepare(`
        SELECT
            id,
            user_id,
            expires_at,
            used_at
        FROM password_reset_tokens
        WHERE token_hash = ?
    `).get(tokenHash);


    if (!resetToken) {

        return res.status(400).json({

            success: false,

            message:
                "Ce lien de réinitialisation est invalide."

        });

    }


    // =========================================
    // TOKEN DÉJÀ UTILISÉ
    // =========================================

    if (resetToken.used_at) {

        return res.status(400).json({

            success: false,

            message:
                "Ce lien de réinitialisation a déjà été utilisé."

        });

    }


    // =========================================
    // TOKEN EXPIRÉ
    // =========================================

    if (
        new Date(resetToken.expires_at) <= new Date()
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Ce lien de réinitialisation a expiré."

        });

    }


    // =========================================
    // HASH DU NOUVEAU MOT DE PASSE
    // =========================================

    const passwordHash =
        bcrypt.hashSync(password, 10);


    // =========================================
    // MISE À JOUR DU MOT DE PASSE
    // =========================================

    db.prepare(`
        UPDATE users
        SET password_hash = ?
        WHERE id = ?
    `).run(

        passwordHash,
        resetToken.user_id

    );


    // =========================================
    // TOKEN UTILISÉ
    // =========================================

    db.prepare(`
        UPDATE password_reset_tokens
        SET used_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(resetToken.id);


    console.log(
        "🔐 Mot de passe réinitialisé pour l'utilisateur :",
        resetToken.user_id
    );


    return res.json({

        success: true,

        message:
            "Votre mot de passe a été modifié avec succès."

    });

});

module.exports = router;