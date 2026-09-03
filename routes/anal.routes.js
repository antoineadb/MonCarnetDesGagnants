const express = require("express");
const router = express.Router();

const { requireLogin } = require("../middlewares/auth.middleware");
const anal = require("../controllers/anal.controller");
const analDocuments = require("../controllers/anal.documents.controller");
const uploadAnal = require("../middlewares/upload-anal.middleware");

// Toutes les routes nécessitent une connexion
router.use(requireLogin);

// Récupérer toutes les affaires
router.get("/", anal.getAll);

// Récupérer une affaire
router.get("/:id", anal.getOne);

// Créer une affaire
router.post("/", anal.create);

// Modifier une affaire
router.put("/:id", anal.update);

// Supprimer une affaire
router.delete("/:id", anal.remove);

// Upload d'un document pour une affaire
router.post( "/:id/documents",uploadAnal.single("file"),analDocuments.upload
);

router.delete("/:id/documents/:documentId", analDocuments.remove);

// Récupérer les documents d'une affaire
router.get("/:id/documents",analDocuments.getAll);


module.exports = router;