const express = require("express");

const router = express.Router();

const {
    requireLogin
} = require("../middlewares/auth.middleware");

const categories =
    require("../controllers/categories-objectifs.controller");
console.log("🔥 ROUTES CATEGORIES OBJECTIFS CHARGÉES");

router.use(requireLogin);


/* ======================================================
   RÉCUPÉRER LES CATÉGORIES
   ====================================================== */

router.get(
    "/",
    categories.getAll
);


/* ======================================================
   CRÉER
   ====================================================== */

router.post(
    "/",
    categories.create
);


/* ======================================================
   MODIFIER L'ORDRE
   ====================================================== */
router.put(
    "/reorder",
    categories.reorder
);

/* ======================================================
   MODIFIER
   ====================================================== */
router.put(
    "/:id",
    categories.update
);


/* ======================================================
   SUPPRIMER
   ====================================================== */

router.delete(
    "/:id",
    categories.remove
);


/* Modifier l'ordre */




module.exports = router;