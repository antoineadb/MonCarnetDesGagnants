 const express = require('express');

const app = express();
const PORT = 3000;

// Sert les fichiers du dossier public
app.use(express.static('public'));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log('🚀 Le Carnet des Gagnants est lancé !');
    console.log(`👉 http://localhost:${PORT}`);
});