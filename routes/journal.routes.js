const express = require("express");

const router = express.Router();

const { requireLogin } = require("../middlewares/auth.middleware");

const journal = require("../controllers/journal.controller");

router.use(requireLogin);

router.get("/history", journal.getHistory);

router.get("/", journal.getAll);

router.get("/:id", journal.getOne);

router.post("/", journal.create);

router.put("/:id", journal.update);

router.delete("/:id", journal.remove);

module.exports = router;