const express = require("express");

const router = express.Router();

const {
    requireLogin
} = require("../middlewares/auth.middleware");

const categories =
    require("../controllers/categories-objectifs.controller");


router.use(requireLogin);


/* Récupérer toutes les catégories */

router.get(
    "/",
    categories.getAll
);


/* Créer */

router.post(
    "/",
    categories.create
);


/* Modifier */

router.put(
    "/:id",
    categories.update
);


/* Supprimer */

router.delete(
    "/:id",
    categories.remove
);


/* Modifier l'ordre */

router.put(
    "/reorder",
    categories.reorder
);


module.exports = router;