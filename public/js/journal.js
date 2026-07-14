/**
 * ==========================================================
 * Le Carnet des Gagnants
 * journal.js
 * Version 2.0
 * ==========================================================
 */

document.addEventListener("DOMContentLoaded", init);

//==========================================================
// VARIABLES
//==========================================================

let selectedMood = "";
let editingId = null;

//==========================================================
// INITIALISATION
//==========================================================

function init() {

    displayDate();

    initMoodSelector();

    bindButtons();

    loadHistory();

}

//==========================================================
// BOUTONS
//==========================================================

function bindButtons() {

    document
        .getElementById("btnRetour")
        .addEventListener("click", goBack);

    document
        .getElementById("saveEntry")
        .addEventListener("click", saveEntry);

}

//==========================================================
// DATE
//==========================================================

function displayDate() {

    const element = document.getElementById("journalDate");

    element.textContent = new Date().toLocaleDateString("fr-FR", {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"

    });

}

//==========================================================
// RETOUR
//==========================================================

function goBack() {

    window.location.href = "app.html";

}

//==========================================================
// NOTIFICATION
//==========================================================

function showMessage(message) {

    let toast = document.getElementById("toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toast";

        document.body.appendChild(toast);

    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}
/* ==========================================================
   DATE
========================================================== */

function displayDate() {

    const element = document.getElementById("journalDate");

    const today = new Date();

    element.textContent = today.toLocaleDateString("fr-FR", {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"

    });

}

/* ==========================================================
   RETOUR
========================================================== */

function goBack() {

    window.location.href = "app.html";

}

/* ==========================================================
   HUMEURS
========================================================== */

function initMoodSelector() {

    const moods = document.querySelectorAll(".mood");

    moods.forEach(button => {

        button.addEventListener("click", () => {

            moods.forEach(m => m.classList.remove("selected"));

            button.classList.add("selected");

            selectedMood = button.textContent;

        });

    });

}

/* ==========================================================
   SAUVEGARDE
========================================================== */

//==========================================================
// HISTORIQUE
//==========================================================

async function loadHistory() {

    const container = document.getElementById("journalHistory");

    container.innerHTML = "";

    const response = await fetch("/api/journal");

    if (!response.ok) {

        container.innerHTML = "<p>Erreur lors du chargement.</p>";

        return;

    }

    const entries = await response.json();

    if (entries.length === 0) {

        container.innerHTML = "<p>Aucune note enregistrée.</p>";

        return;

    }

    entries.forEach(entry => {

        const article = document.createElement("article");

        article.className = "history-item";

        // -----------------------
        // Titre
        // -----------------------

        const title = document.createElement("h3");

        title.textContent = `${entry.mood || ""} ${entry.title}`;

        article.appendChild(title);

        // -----------------------
        // Date
        // -----------------------

        const date = document.createElement("small");

        date.textContent = new Date(entry.created_at)
            .toLocaleDateString("fr-FR");

        article.appendChild(date);

        // -----------------------
        // Contenu
        // -----------------------

        const text = document.createElement("p");

        text.textContent = entry.content;

        article.appendChild(text);

        // -----------------------
        // Actions
        // -----------------------

        const actions = document.createElement("div");

        actions.className = "history-actions";

        // Modifier

        const editButton = document.createElement("button");

        editButton.className = "edit-button";

        editButton.innerHTML = "✏ Modifier";

        editButton.addEventListener("click", () => {

            editEntry(entry);

        });

        actions.appendChild(editButton);

        // Supprimer

        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-button";

        deleteButton.innerHTML = "🗑 Supprimer";

        deleteButton.addEventListener("click", () => {

            deleteEntry(entry.id);

        });

        actions.appendChild(deleteButton);

        article.appendChild(actions);

        container.appendChild(article);

    });

}
//==========================================================
// EDITION
//==========================================================

function editEntry(entry) {

    editingId = entry.id;

    document.getElementById("journalTitle").value = entry.title;

    document.getElementById("journalContent").value = entry.content;

    selectedMood = entry.mood || "";

    document
        .querySelectorAll(".mood")
        .forEach(button => {

            button.classList.remove("selected");

            if (button.textContent === selectedMood) {

                button.classList.add("selected");

            }

        });

    document.getElementById("saveEntry").innerHTML = `

        <i class="bi bi-pencil-square"></i>

        Mettre à jour

    `;

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}
//==========================================================
// SUPPRESSION
//==========================================================

async function deleteEntry(id) {

    if (!confirm("Supprimer cette note ?")) {

        return;

    }

    const response = await fetch(`/api/journal/${id}`, {

        method: "DELETE"

    });

    if (!response.ok) {

        showMessage("Erreur lors de la suppression.");

        return;

    }

    showMessage("Journal supprimé.");

    loadHistory();

}


