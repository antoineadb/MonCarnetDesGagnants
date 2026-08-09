/*=========================================================

    LE CARNET DES GAGNANTS
    BOOK ROUTES

=========================================================*/

const express = require("express");

const router = express.Router();

const { requireLogin } =
    require("../middlewares/auth.middleware");

const book =
    require("../controllers/book.controller");


/*=========================================================
    AUTHENTIFICATION
=========================================================*/

router.use(requireLogin);


/*=========================================================
    LIVRES
=========================================================*/

// Tous les livres
router.get(
    "/",
    book.getAll
);


// Un livre
router.get(
    "/:id",
    book.getOne
);


// Créer un livre
router.post(
    "/",
    book.create
);


// Modifier un livre
router.put(
    "/:id",
    book.update
);


// Supprimer un livre
router.delete(
    "/:id",
    book.remove
);


module.exports = router;