/*=========================================================

    LE CARNET DES GAGNANTS
    MEDITATION ROUTES

    Module Méditations & Bien-être

=========================================================*/

const express = require("express");

const router = express.Router();

const {
    requireLogin
} = require("../middlewares/auth.middleware");

const meditation =
    require("../controllers/meditation.controller");


/*=========================================================
    AUTHENTIFICATION
=========================================================*/

router.use(requireLogin);


/*=========================================================
    TYPES DE PRATIQUES
=========================================================*/

// Liste des types actifs
router.get(
    "/types",
    meditation.getTypes
);


/*=========================================================
    PRATIQUES
=========================================================*/

// Toutes les pratiques
router.get(
    "/",
    meditation.getAll
);


// Une pratique
router.get(
    "/:id",
    meditation.getOne
);


// Créer une pratique
router.post(
    "/",
    meditation.create
);


// Modifier une pratique
router.put(
    "/:id",
    meditation.update
);


// Supprimer une pratique
router.delete(
    "/:id",
    meditation.remove
);


module.exports = router;
