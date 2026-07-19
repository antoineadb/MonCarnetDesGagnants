const cors = require("cors");
const db = require("./database/database");
const express = require("express");
const app = express();
const PORT = 3000;

const authRoutes = require("./routes/auth.routes");
const journalRoutes = require("./routes/journal.routes");
const progressionRoutes = require("./routes/progression.routes");

app.use(cors());
app.use(express.json());

// Sert les fichiers du dossier public
app.use(express.static("public"));

// Route principale
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/progression", progressionRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log("🚀 Le Carnet des Gagnants est lancé !");
    console.log(`👉 http://localhost:${PORT}`);
});