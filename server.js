const cors = require("cors");
const db = require("./database/database");
const express = require("express");
const app = express();
const PORT = 3000;
const session = require("express-session");

const authRoutes = require("./routes/auth.routes");
const journalRoutes = require("./routes/journal.routes");
const progressionRoutes = require("./routes/progression.routes");
const gratitudeRoutes = require("./routes/gratitude.routes")(db);
const adminRoutes = require("./routes/admin.routes");

app.use(cors());
app.use(express.json());

// Sert les fichiers du dossier public
app.use(express.static("public"));

// Route principale
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.use(session({

    secret: "LeCarnetDesGagnants2026",

    resave: false,

    saveUninitialized: false,

    cookie: {

        maxAge: 1000 * 60 * 60 * 24 // 24 heures

    }

}));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/progression", progressionRoutes);
app.use("/api/gratitude", gratitudeRoutes);
app.use("/api/admin", adminRoutes);
// Démarrage du serveur
app.listen(PORT, () => {
    console.log("🚀 Le Carnet des Gagnants est lancé !");
    console.log(`👉 http://localhost:${PORT}`);
});