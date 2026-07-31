const express = require("express");
const router = express.Router();
const progression = require("../controllers/progression.controller");

// ======================================================
// Récupération d'un parcours
// ======================================================

router.get("/:id", progression.load);

// ======================================================
// Historique des progressions
// ======================================================

router.get("/history/:id", progression.history);

// ======================================================
// Enregistrer une progression
// ======================================================
router.post("/save", progression.save);

module.exports = router;