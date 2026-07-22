document.addEventListener("DOMContentLoaded", init);

let entries = [];

let selectedEntry = null;

async function init() {

    document
        .getElementById("btnRetour")
        .addEventListener("click", () => {

            window.location.href = "journal.html";

        });

    document
        .getElementById("searchInput")
        .addEventListener("input", displayEntries);

    document
        .getElementById("sortOrder")
        .addEventListener("change", displayEntries);

    await loadEntries();

    bindModal();

}

async function loadEntries() {

    try {

        const response = await fetch("/api/journal/history");

        entries = await response.json();

        document.getElementById("journalStats").textContent =
            `${entries.length} note(s) enregistrée(s)`;

        displayEntries();

    }

    catch (error) {

        document.getElementById("historyContainer").innerHTML =
            "<p>Impossible de charger les notes.</p>";

    }

}

function displayEntries() {

    const container = document.getElementById("historyContainer");

    container.innerHTML = "";

    const search = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const order = document
        .getElementById("sortOrder")
        .value;

    let list = [...entries];

    list = list.filter(entry =>

        entry.title.toLowerCase().includes(search) ||

        entry.content.toLowerCase().includes(search)

    );

    list.sort((a, b) => {

        if (order === "desc") {

            return new Date(b.created_at) - new Date(a.created_at);

        }

        return new Date(a.created_at) - new Date(b.created_at);

    });

    list.forEach(entry => {

        const card = document.createElement("article");

        card.className = "history-card";

        const preview =

            entry.content.length > 150

                ? entry.content.substring(0,150) + "..."

                : entry.content;

        card.innerHTML = `

            <h3>${entry.mood || ""} ${entry.title}</h3>

            <small>

                <i class="bi bi-calendar3"></i>

                ${new Date(entry.created_at).toLocaleDateString("fr-FR")}

            </small>

            <p>

                ${preview}

            </p>

            <div class="history-actions">

                <button
                    class="read-button"
                    data-id="${entry.id}">

                    <i class="bi bi-book"></i>

                    Lire

                </button>

            </div>

        `;

        container.appendChild(card);

        card
        .querySelector(".read-button")
        .addEventListener("click", () => {

            openModal(entry);

        });

    });


    function openModal(entry) {

        selectedEntry = entry;

        document.getElementById("modalTitle").textContent =
            `${entry.mood || ""} ${entry.title}`;

        document.getElementById("modalDate").innerHTML =
            `<i class="bi bi-calendar3"></i>
            ${new Date(entry.created_at).toLocaleDateString("fr-FR")}`;

        document.getElementById("modalContent").textContent =
            entry.content;

        document.getElementById("noteModal").style.display = "flex";

    }

        document.getElementById("closeModal").addEventListener("click", () => {

        document.getElementById("noteModal").style.display = "none";

    });
}

function bindModal() {

    document
        .getElementById("closeModal")
        .addEventListener("click", closeModal);

    window.addEventListener("click", (event) => {

        if (event.target.id === "noteModal") {

            closeModal();

        }

    });
    document
    .getElementById("deleteNote")
    .addEventListener("click", deleteSelectedEntry);

    document
    .getElementById("editNote")
    .addEventListener("click", editSelectedEntry);

}

function editSelectedEntry() {

    if (!selectedEntry) {

        return;

    }

    localStorage.setItem(
        "journalToEdit",
        selectedEntry.id
    );

    window.location.href = "journal.html";

}

async function deleteSelectedEntry() {

    if (!selectedEntry) {
        return;
    }

    if (!confirm("Voulez-vous vraiment supprimer ce journal ?")) {
        return;
    }

    try {

        const response = await fetch(`/api/journal/${selectedEntry.id}`, {

            method: "DELETE"

        });

        if (!response.ok) {

            throw new Error();

        }

        closeModal();

        await loadEntries();

    }

    catch (error) {

        alert("Impossible de supprimer le journal.");

    }

}

function closeModal() {

    document.getElementById("noteModal").style.display = "none";

    selectedEntry = null;

}

function openModal(entry) {

    selectedEntry = entry;

    document.getElementById("modalTitle").textContent =
        `${entry.mood || ""} ${entry.title}`;

    document.getElementById("modalDate").innerHTML =
        `<i class="bi bi-calendar3"></i>
        ${new Date(entry.created_at).toLocaleDateString("fr-FR")}`;

    document.getElementById("modalContent").textContent =
        entry.content;

    document.getElementById("noteModal").style.display = "flex";

}

