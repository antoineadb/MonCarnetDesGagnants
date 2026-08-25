/*=========================================================

    LE CARNET DES GAGNANTS
    EXERCISE ROUTES

    Le Stade des Gagnants

=========================================================*/

const express = require("express");

const router = express.Router();

const {
    requireLogin
} = require("../middlewares/auth.middleware");

const exercise =
    require("../controllers/exercise.controller");


/*=========================================================
    AUTHENTIFICATION
=========================================================*/

router.use(requireLogin);


/*=========================================================
    EXERCICES
=========================================================*/

// Tous les exercices
router.get(
    "/",
    exercise.getAll
);


// Un exercice
router.get(
    "/:id",
    exercise.getOne
);


// Créer un exercice
router.post(
    "/",
    exercise.create
);


// Modifier un exercice
router.put(
    "/:id",
    exercise.update
);


// Supprimer un exercice
router.delete(
    "/:id",
    exercise.remove
);


module.exports = router;
