// ==========================================
// HISTORIQUE DES ACTIVITÉS
// ==========================================

const tbody = document.getElementById("historyBody");
const searchInput = document.getElementById("searchInput");
const btnRefresh = document.getElementById("btnRefresh");
const btnClear = document.getElementById("btnClear");
const btnRetour = document.getElementById("btnRetour");

let historique = [];

// ==========================================
// AFFICHAGE DES ACTIONS
// ==========================================

const ACTIONS = {

    LOGIN: {
        icon: "🔐",
        label: "Connexion",
        className: "info"
    },

    LOGOUT: {
        icon: "🚪",
        label: "Déconnexion",
        className: "info"
    },

    CREATE_USER: {
        icon: "➕",
        label: "Création utilisateur",
        className: "success"
    },

    UPDATE_USER: {
        icon: "✏️",
        label: "Modification utilisateur",
        className: "warning"
    },

    DELETE_USER: {
        icon: "🗑️",
        label: "Suppression utilisateur",
        className: "danger"
    },

    CREATE_JOURNAL: {
        icon: "📖",
        label: "Création journal",
        className: "success"
    },

    UPDATE_JOURNAL: {
        icon: "📝",
        label: "Modification journal",
        className: "warning"
    },

    DELETE_JOURNAL: {
        icon: "❌",
        label: "Suppression journal",
        className: "danger"
    }

};

// ==========================================
// CHARGER L'HISTORIQUE
// ==========================================

async function chargerHistorique() {

    try {

        const response = await fetch("/api/history");

        const data = await response.json();

        if (!data.success) {

            Toast.error("Impossible de charger l'historique.");

            return;

        }

        historique = data.history;

        afficherHistorique();

    }

    catch (err) {

        console.error(err);

        Toast.error("Erreur de connexion.");

    }

}

// ==========================================
// FORMATAGE DATE
// ==========================================

function formaterDate(date) {

    if (!date) return "";

    return new Date(date).toLocaleString("fr-FR");

}

// ==========================================
// AFFICHAGE
// ==========================================

function afficherHistorique() {

    tbody.innerHTML = "";

    const filtre = searchInput.value.toLowerCase();

    const liste = historique.filter(item => {

        return (

            item.username.toLowerCase().includes(filtre)

            ||

            item.action.toLowerCase().includes(filtre)

            ||

            (item.details || "").toLowerCase().includes(filtre)

        );

    });

    for (const item of liste) {

        const action = ACTIONS[item.action] || {

            icon: "❓",

            label: item.action,

            className: "info"

        };

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${formaterDate(item.created_at)}</td>

            <td>${item.username}</td>

            <td>

                <span class="badge ${action.className}">

                    ${action.icon} ${action.label}

                </span>

            </td>

            <td>${item.details ?? ""}</td>

        `;

        tbody.appendChild(tr);

    }
    document.getElementById("historyCount").textContent =
    `${liste.length} événement${liste.length > 1 ? "s" : ""}`;

}

// ==========================================
// RECHERCHE
// ==========================================

searchInput.addEventListener("input", () => {

    afficherHistorique();

});

// ==========================================
// ACTUALISER
// ==========================================

btnRefresh.addEventListener("click", () => {

    chargerHistorique();

});

// ==========================================
// VIDER L'HISTORIQUE
// ==========================================

btnClear.addEventListener("click", async () => {

    const ok = await Confirm.show({

        title: "Vider l'historique",

        message: "Voulez-vous vraiment supprimer tout l'historique des activités ?",

        confirmText: "Oui",

        cancelText: "Annuler"

    });

    if (!ok) return;

    try {

        const response = await fetch("/api/history", {

            method: "DELETE"

        });

        const data = await response.json();

        if (data.success) {

            Toast.success("Historique supprimé.");

            chargerHistorique();

        } else {

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

