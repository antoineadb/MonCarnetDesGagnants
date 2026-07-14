const cors = require("cors");
const db = require("./database/database");
const express = require('express');
const app = express();
const PORT = 3000;
const journalRoutes = require("./routes/journal.routes");
app.use(cors());

app.use(express.json());

// Sert les fichiers du dossier public
app.use(express.static('public'));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use("/api/journal", journalRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log('🚀 Le Carnet des Gagnants est lancé !');
    console.log(`👉 http://localhost:${PORT}`);
});