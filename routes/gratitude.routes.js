const express = require("express");
const router = express.Router();
const send_date = new Date().toISOString();

module.exports = (db) => {

    // ==========================
    // Toutes les cartes
    // ==========================
    router.get("/", (req, res) => {

        console.log("SESSION =", req.session);
        console.log("USER =", req.session?.user);

        try {

            const cards = db.prepare(`
                SELECT *
                FROM gratitude_cards
                WHERE user_id = ?
                ORDER BY created_at DESC
            `).all(req.session.user.id);

            res.json(cards);

        } catch (error) {

            console.error(error);
            res.status(500).json({
                error: error.message
            });

        }

    });

    // ==========================
    // Une carte
    // ==========================
    router.get("/:id", (req, res) => {

        try {

            const card = db.prepare(`
                SELECT *
                FROM gratitude_cards
                WHERE id = ?
                AND user_id = ?
            `).get(req.params.id, req.session.user.id);

            if (!card) {

                return res.status(404).json({
                    error: "Carte introuvable"
                });

            }

            res.json(card);

        } catch (error) {

            console.error(error);
            res.status(500).json({
                error: error.message
            });

        }

    });

    // ==========================
    // Création
    // ==========================
    router.post("/", (req, res) => {        
        try {

            const {
                title,
                message,
                image,
                image_type,
                location,
                theme,
                emotion,
                favorite                
            } = req.body;
        if (!title?.trim()) {

            return res.status(400).json({
                success:false,
                message:"Titre obligatoire."
            });

            }

            if (!message?.trim()) {

                return res.status(400).json({
                    success:false,
                    message:"Message obligatoire."
                });

            }
            const result = db.prepare(`
                INSERT INTO gratitude_cards
                (
                    user_id,
                    title,
                    message,
                    image,
                    image_type,
                    location,
                    theme,
                    emotion,
                    favorite,
                    send_date
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
                req.session.user.id,
                title,
                message,
                image,
                image_type || "photo",
                location,
                theme,
                emotion,
                favorite ? 1 : 0,
                send_date
            );

            res.json({
                success: true,
                id: result.lastInsertRowid
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: error.message
            });

        }

    });

    // ==========================
    // Suppression
    // ==========================
    router.delete("/:id", (req, res) => {

        try {

            db.prepare(`
                DELETE FROM gratitude_cards
                WHERE id = ?
                AND user_id = ?
            `).run(req.params.id, req.session.user.id);

            res.json({
                success: true
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: error.message
            });

        }

    });

    return router;

};