const express = require("express");

const router = express.Router();

const {
    requireLogin
} = require("../middlewares/auth.middleware");

const objectifs =
    require("../controllers/objectifs.controller");


router.use(requireLogin);


/* ======================================================
   RÉCUPÉRER LES OBJECTIFS
   ====================================================== */

router.get(
    "/",
    objectifs.getAll
);


/* ======================================================
   CRÉER
   ====================================================== */

router.post(
    "/",
    objectifs.create
);


/* ======================================================
   MODIFIER L'ORDRE
   ====================================================== */

router.put(
    "/reorder",
    objectifs.reorder
);


/* ======================================================
   MODIFIER
   ====================================================== */

router.put(
    "/:id",
    objectifs.update
);


/* ======================================================
   SUPPRIMER
   ====================================================== */

router.delete(
    "/:id",
    objectifs.remove
);


module.exports = router;