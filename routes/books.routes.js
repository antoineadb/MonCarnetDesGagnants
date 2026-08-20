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

const upload =
    require("../middlewares/upload.middleware");


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
    upload.single("cover"),
    book.create
);

// Modifier un livre
router.put(
    "/:id",
    upload.single("cover"),
    book.update
);

// Supprimer un livre
router.delete(
    "/:id",
    book.remove
);


module.exports = router;