const express = require("express");
const router = express.Router();

module.exports = (db) => {

    // ==========================
    // Toutes les cartes
    // ==========================
    router.get("/", (req, res) => {

        try {

            const cards = db.prepare(`
                SELECT *
                FROM gratitude_cards
                ORDER BY created_at DESC
            `).all();

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
            `).get(req.params.id);

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
                favorite,
                send_date
            } = req.body;

            const result = db.prepare(`
                INSERT INTO gratitude_cards
                (
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
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
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
            `).run(req.params.id);

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