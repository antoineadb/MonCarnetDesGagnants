const cors = require("cors");
const db = require("./database/database");
const express = require("express");
const app = express();
console.log("🔥🔥🔥 SERVER VERSION 2026-07-28 🔥🔥🔥");
const PORT = 3000;
const session = require("express-session");

const authRoutes = require("./routes/auth.routes");
const journalRoutes = require("./routes/journal.routes");
const progressionRoutes = require("./routes/progression.routes");
const gratitudeRoutes = require("./routes/gratitude.routes")(db);
const adminRoutes = require("./routes/admin.routes");
const { router: historyRoutes } = require("./routes/history.routes");
const loginHistoryRoutes = require("./routes/login-history.routes");
const booksRoutes = require("./routes/books.routes");

// Route principale
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.use(cors());

app.use(express.json());

app.use(session({

    secret: "LeCarnetDesGagnants2026",

    resave: false,

    saveUninitialized: false,

    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }

}));

app.use((req, res, next) => {

    console.log("=================================");
    console.log(req.method, req.url);
    console.log("Session user :", req.session && req.session.user);
    console.log("=================================");

    next();

});

// Ensuite seulement
app.use(express.static("public"));

// Images des livres stockées sur le disque persistant Render
app.use(
    "/uploads/books",
    express.static("/var/data/books")
);

// Photos de profil stockées sur le disque persistant
app.use(
    "/uploads/profile",
    express.static("/var/data/profile")
);


// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/progression", progressionRoutes);
app.use("/api/gratitude", gratitudeRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/login-history", loginHistoryRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/admin", (req, res, next) => {

    console.log("➡️ ADMIN :", req.method, req.url);

    next();

}, adminRoutes);
// Démarrage du serveur
app.listen(PORT, () => {
    console.log("🚀 Le Carnet des Gagnants est lancé !");
    console.log(`👉 http://localhost:${PORT}`);
});