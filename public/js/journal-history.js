document.addEventListener("DOMContentLoaded", init);

let entries = [];

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

}

async function loadEntries() {

    try {

        const response = await fetch("/api/journal");

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

    });

}