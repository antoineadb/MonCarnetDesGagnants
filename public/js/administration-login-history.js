// ==========================================
// HISTORIQUE DES CONNEXIONS
// ==========================================

const tbody = document.getElementById("historyBody");
const searchInput = document.getElementById("searchInput");
const btnRefresh = document.getElementById("btnRefresh");
const btnClear = document.getElementById("btnClear");
const btnRetour = document.getElementById("btnRetour");

let historique = [];

// ==========================================
// CHARGER
// ==========================================

async function chargerHistorique() {

    try {

        const response = await fetch("/api/login-history");

        historique = await response.json();

        afficherHistorique();

    }

    catch (err) {

        console.error(err);

        Toast.error("Impossible de charger l'historique.");

    }

}

// ==========================================
// FORMAT DATE
// ==========================================

function formaterDate(date) {

    if (!date) return "—";

    return new Date(date).toLocaleString("fr-FR");

}

// ==========================================
// CALCUL DURÉE
// ==========================================

function calculerDuree(debut, fin) {

    if (!debut)
        return "";

    const start = new Date(debut);

    const end = fin
        ? new Date(fin)
        : new Date();

    let secondes = Math.floor((end - start) / 1000);

    const jours = Math.floor(secondes / 86400);
    secondes %= 86400;

    const heures = Math.floor(secondes / 3600);
    secondes %= 3600;

    const minutes = Math.floor(secondes / 60);

    if (jours > 0)
        return `${jours} j ${heures} h`;

    if (heures > 0)
        return `${heures} h ${minutes} min`;

    return `${minutes} min`;

}

// ==========================================
// BADGE
// ==========================================

function badgeConnexion(item) {

    if (item.success === 0) {

        return `
            <span class="badge failed">
                🔴 Échec
            </span>
        `;

    }

    if (!item.logout_at) {

        return `
            <span class="badge connected">
                🔵 Connecté
            </span>
        `;

    }

    return `
        <span class="badge disconnected">
            🟢 Déconnecté
        </span>
    `;

}

// ==========================================
// AFFICHAGE
// ==========================================

function afficherHistorique() {

    tbody.innerHTML = "";

    const filtre = searchInput.value.toLowerCase();

    const liste = historique.filter(item => {

        const nom = `${item.firstname ?? ""} ${item.lastname ?? ""} ${item.username ?? ""}`
            .toLowerCase();

        return (

            nom.includes(filtre)

            ||

            (item.ip ?? "").toLowerCase().includes(filtre)

        );

    });

    for (const item of liste) {

        const nomUtilisateur =
            item.username === "admin"
                ? "Administrateur root"
                : `${item.firstname ?? ""} ${item.lastname ?? ""}`;

        const utilisateur = `
            <strong>${nomUtilisateur}</strong><br>
            <small>${item.username}</small>
        `;

        const duree =

            item.success === 0

                ? "—"

                : calculerDuree(
                    item.login_at,
                    item.logout_at
                );

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${utilisateur}</td>

            <td>${formaterDate(item.login_at)}</td>

            <td>${formaterDate(item.logout_at)}</td>

            <td>${duree}</td>

            <td>${item.ip ?? ""}</td>

            <td>${badgeConnexion(item)}</td>

        `;

        tbody.appendChild(tr);

    }
    document.getElementById("historyCount").textContent =

        `${liste.length} connexion${liste.length > 1 ? "s" : ""}`;

}

// ==========================================
// RECHERCHE
// ==========================================

searchInput.addEventListener("input", afficherHistorique);

// ==========================================
// ACTUALISER
// ==========================================

btnRefresh.addEventListener("click", chargerHistorique);

// ==========================================
// VIDER L'HISTORIQUE
// ==========================================

btnClear.addEventListener("click", async () => {

    const ok = await Confirm.show({

        title: "Historique des connexions",

        message: "Voulez-vous vraiment supprimer tout l'historique des connexions ?",

        confirmText: "Supprimer",

        cancelText: "Annuler"

    });

    if (!ok) return;

    try {

        const response = await fetch("/api/login-history", {

            method: "DELETE"

        });

        const data = await response.json();

        if (data.success) {

            Toast.success("Historique supprimé.");

            chargerHistorique();

        }

        else {

            Toast.error(data.message);

        }

    }

    catch (err) {

        console.error(err);

        Toast.error("Erreur serveur.");

    }

});

// ==========================================
// RETOUR
// ==========================================

btnRetour.addEventListener("click", () => {

    window.location.href = "administration.html";

});

// ==========================================
// INITIALISATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    chargerHistorique();

});