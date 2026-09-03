/* =========================================================
   LE CARNET DES GAGNANTS
   ARCHIVES INTERDITES
   Gestion de l'interface
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const newAnalButton = document.getElementById("newAnalButton");
    const searchArchivesButton = document.getElementById("searchArchivesButton");

    const newAnalPanel = document.getElementById("newAnalPanel");
    const archivesSearch = document.getElementById("archivesSearch");

    const cancelAnalButton = document.getElementById("cancelAnalButton");
    const saveAnalButton = document.getElementById("saveAnalButton");



    /* =====================================================
       OUVERTURE D'UN PANNEAU
    ===================================================== */

    function closeAllPanels() {

        newAnalPanel?.classList.add("hidden");
        archivesSearch?.classList.add("hidden");

    }


    function openPanel(panel) {

        closeAllPanels();

        if (panel) {
            panel.classList.remove("hidden");

            panel.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    }


    /* =====================================================
       NOUVELLE AFFAIRE
    ===================================================== */

    newAnalButton?.addEventListener("click", () => {

        openPanel(newAnalPanel);

    });

    /* =====================================================
       RECHERCHER DANS LES ARCHIVES
    ===================================================== */

    searchArchivesButton?.addEventListener("click", () => {

        openPanel(archivesSearch);

        document.getElementById("archivesSearchInput")?.focus();

    });


    /* =====================================================
       ANNULER UNE NOUVELLE AFFAIRE
    ===================================================== */

    cancelAnalButton?.addEventListener("click", () => {

        newAnalPanel?.classList.add("hidden");

    });


    /* =====================================================
       ENREGISTRER UNE AFFAIRE
    ===================================================== */

    saveAnalButton?.addEventListener("click", async () => {

        const title = document.getElementById("analTitle")?.value.trim();
        const category = document.getElementById("analCategory")?.value;
        const date = document.getElementById("analDate")?.value;
        const content = document.getElementById("analContent")?.value.trim();
        const sensitive = document.getElementById("analSensitive")?.checked;

        if (!title || !content) {

            showMessage("Le titre et le contenu sont obligatoires.");
            return;

        }

        try {

            const response = await fetch("/api/anals", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title,
                    category,
                    date,
                    content,
                    sensitive
                })

            });


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error || "Impossible d'enregistrer l'affaire."
                );

            }


            console.log("Affaire enregistrée :", data);

            showMessage("Affaire enregistrée avec succès.");
            loadAnals();

            // Réinitialisation du formulaire
            document.getElementById("analTitle").value = "";
            document.getElementById("analCategory").value = "";
            document.getElementById("analDate").value = "";
            document.getElementById("analContent").value = "";
            document.getElementById("analSensitive").checked = false;

            newAnalPanel?.classList.add("hidden");

        } catch (error) {

            console.error("Erreur enregistrement affaire :", error);

            showMessage(
                error.message ||
                "Une erreur est survenue lors de l'enregistrement."
            );

        }

    });

});

function showMessage(message, type = "success") {

    if (typeof window.Toast === "undefined") {

        console.error("Toast.js n'est pas chargé :", message);
        return;

    }

    if (type === "error") {

        window.Toast.error(message);

    } else if (type === "warning") {

        window.Toast.warning(message);

    } else if (type === "info") {

        window.Toast.info(message);

    } else {

        window.Toast.success(message);

    }

}
   /* =====================================================
   CHARGER LES AFFAIRES ARCHIVÉES
===================================================== */

let allAnals = [];
let currentPage = 1;

const ANALS_PER_PAGE = 5;

async function loadDocuments(analId, documentsList) {
    try {
        const response = await fetch(`/api/anals/${analId}/documents`);

        if (!response.ok) {
            throw new Error("Impossible de charger les documents.");
        }

        const documents = await response.json();

        if (!documents.length) {
            documentsList.innerHTML = `
                <p class="documents-empty">
                    Aucun document associé à cette affaire.
                </p>
            `;
            return;
        }

        documentsList.innerHTML = documents.map(doc => `
            <div class="document-item">
                <span class="document-icon">📎</span>
                <div class="document-info">
                    <strong>${escapeHtml(doc.original_name)}</strong>
                    <small>${Math.round(doc.size / 1024)} Ko</small>
                </div>
                <div class="document-actions">

                    <a
                        href="/uploads/anals/${encodeURIComponent(doc.stored_name)}"
                        target="_blank"
                        rel="noopener"
                        class="document-open-button"
                    >
                        👁️ Ouvrir
                    </a>

                    <button
                        type="button"
                        class="document-delete-button"
                        data-document-id="${doc.id}"
                        data-document-name="${escapeHtml(doc.original_name)}"
                        title="Supprimer ce document"
                    >
                        🗑️
                    </button>

                </div>                
            </div>
        `).join("");
documentsList
    .querySelectorAll(".document-delete-button")
    .forEach(button => {

        button.addEventListener("click", async () => {

            const documentId = button.dataset.documentId;
            const documentName = button.dataset.documentName;

            const confirmed = await Confirm.show({

                icon: "🗑️",

                title: "Supprimer ce document ?",

                message: `Voulez-vous vraiment supprimer « ${documentName} » ?`,

                confirmText: "Supprimer",

                cancelText: "Annuler"

            });

            if (!confirmed) return;

            try {

                const response = await fetch(
                    `/api/anals/${analId}/documents/${documentId}`,
                    {
                        method: "DELETE"
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "Impossible de supprimer le document."
                    );
                }

                showMessage(
                    "Document supprimé.",
                    "success"
                );

                await loadDocuments(
                    analId,
                    documentsList
                );

            } catch (error) {

                console.error(
                    "Erreur suppression document :",
                    error
                );

                showMessage(
                    error.message ||
                    "Impossible de supprimer le document.",
                    "error"
                );

            }

        });

    });
    } catch (error) {
        console.error(error);

        documentsList.innerHTML = `
            <p class="documents-error">
                Impossible de charger les documents.
            </p>
        `;
    }
}

async function loadAnals() {

    const archivesList = document.getElementById("archivesList");

    if (!archivesList) return;

    try {

        const response = await fetch("/api/anals");

        if (!response.ok) {
            throw new Error("Impossible de récupérer les archives.");
        }

        allAnals = await response.json();

        currentPage = 1;

        renderAnals();

    } catch (error) {

        console.error("Erreur chargement archives :", error);

        showMessage(
            "Impossible de charger les archives.",
            "error"
        );

    }

}


/* =====================================================
   AFFICHER LES AFFAIRES
===================================================== */

function renderAnals() {

    const archivesList = document.getElementById("archivesList");

    if (!archivesList) return;

    archivesList.innerHTML = "";

    if (allAnals.length === 0) {

        archivesList.innerHTML = `
            <p class="archives-empty">
                Aucune affaire archivée pour le moment.
            </p>
        `;

        return;

    }


    const start = (currentPage - 1) * ANALS_PER_PAGE;

    const end = start + ANALS_PER_PAGE;

    const pageAnals = allAnals.slice(start, end);


    const table = document.createElement("table");

    table.className = "archives-table";


    table.innerHTML = `
        <thead>
            <tr>
                <th>Date</th>
                <th>Affaire</th>
                <th>Catégorie</th>
                <th>Résumé</th>
                <th>Actions</th>
            </tr>
        </thead>

        <tbody></tbody>
    `;


    const tbody = table.querySelector("tbody");


    pageAnals.forEach(anal => {

        const row = document.createElement("tr");

        const summary = anal.content
            ? anal.content.substring(0, 100)
            : "";

        row.innerHTML = `
            <td>
                ${escapeHtml(anal.date || "")}
            </td>

            <td class="archive-title">
                ${escapeHtml(anal.title)}
            </td>

            <td>
                ${escapeHtml(anal.category || "—")}
            </td>

            <td class="archive-summary">
                ${escapeHtml(summary)}
                ${anal.content && anal.content.length > 100 ? "…" : ""}
            </td>

            <td class="archive-actions">

                <button
                    type="button"
                    class="archive-action-button view-anal"
                    data-id="${anal.id}"
                    title="Ouvrir"
                >
                    👁️
                </button>

                <button
                    type="button"
                    class="archive-action-button delete-anal"
                    data-id="${anal.id}"
                    title="Supprimer"
                >
                    🗑️
                </button>

            </td>

            </td>
        `;
        tbody.appendChild(row);

    });


    archivesList.appendChild(table);
    /* =================================================
       OUVRIR UNE AFFAIRE
    ================================================= */

    archivesList
        .querySelectorAll(".view-anal")
        .forEach(button => {

            button.addEventListener("click", async () => {

                const id = button.dataset.id;

                try {

                    const response = await fetch(
                        `/api/anals/${id}`
                    );

                    if (!response.ok) {
                        throw new Error(
                            "Impossible de récupérer cette affaire."
                        );
                    }

                    const anal = await response.json();

                    openAnalModal(anal);

                } catch (error) {

                    console.error(
                        "Erreur ouverture affaire :",
                        error
                    );

                    showMessage(
                        error.message ||
                        "Impossible d'ouvrir cette affaire.",
                        "error"
                    );

                }

            });

        });


    /* =================================================
       MODALE — AFFAIRE
    ================================================= */

    function openAnalModal(anal) {

        window.currentAnalId = anal.id;

        const oldModal = document.querySelector(".anal-modal-overlay");

        if (oldModal) {
            oldModal.remove();
        }

        const overlay = document.createElement("div");

        overlay.className = "anal-modal-overlay";

        overlay.innerHTML = `
            <div class="anal-modal">

                <button
                    type="button"
                    class="anal-modal-close"
                    title="Fermer"
                >
                    ×
                </button>

                <div class="anal-modal-header">

                    <h2>
                        ${escapeHtml(anal.title)}
                    </h2>

                    <div class="anal-modal-meta">

                        <span>
                            🏷️ ${escapeHtml(anal.category || "Sans catégorie")}
                        </span>

                        <span>
                            📅 ${escapeHtml(anal.date || "Date inconnue")}
                        </span>

                        ${
                            anal.sensitive
                                ? `<span>🔒 Affaire sensible</span>`
                                : ""
                        }

                    </div>

                </div>

                <div class="anal-modal-content">
                    ${escapeHtml(anal.content)}
                </div>

                <div class="anal-modal-actions">
                
                    <section class="anal-modal-documents">

                        <div class="anal-modal-documents-header">

                            <h3>📎 Documents associés</h3>

                            <label
                                class="anal-document-add-button"
                                title="Ajouter un document"
                            >
                                ➕ Ajouter
                                <input
                                    type="file"
                                    class="anal-document-input"
                                    hidden
                                >
                            </label>
                                <button
                                    type="button"
                                    class="anal-edit-button"
                                    id="editAnalButton"
                                >
                                    ✏️ Modifier
                                </button>
                        </div>

                        <div class="documents-list">
                            <p class="documents-loading">
                                Chargement des documents…
                            </p>
                        </div>

                    </section>

                </div>

            </div>
        `;

        document.body.appendChild(overlay);

        const documentsList = overlay.querySelector(".documents-list");

        if (documentsList) {
            loadDocuments(anal.id, documentsList);
        }

        const documentInput = overlay.querySelector(".anal-document-input");

        documentInput?.addEventListener("change", async () => {
            const file = documentInput.files[0];

            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            try {
                showMessage("📎 Envoi du document…", "info");

                const response = await fetch(`/api/anals/${anal.id}/documents`, {
                    method: "POST",
                    body: formData
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de l'envoi du document.");
                }

                showMessage("✅ Document ajouté.", "success");

                documentInput.value = "";

                await loadDocuments(anal.id, documentsList);

            } catch (error) {
                console.error(error);
                showMessage("❌ Impossible d'ajouter le document.", "error");
            }
        });

        requestAnimationFrame(() => {
            overlay.classList.add("show");
        });


        const closeModal = () => {

            overlay.classList.remove("show");

            setTimeout(() => {
                overlay.remove();
            }, 250);

        };


        overlay
            .querySelector(".anal-modal-close")
            .addEventListener("click", closeModal);

        overlay
            .querySelector("#editAnalButton")
            .addEventListener("click", () => {

                showEditAnalModal(anal, overlay, closeModal);

            });

  

        overlay.addEventListener("click", event => {

            if (event.target === overlay) {
                closeModal();
            }

        });


        document.addEventListener("keydown", function escapeHandler(event) {

            if (event.key === "Escape") {

                document.removeEventListener(
                    "keydown",
                    escapeHandler
                );

                closeModal();

            }

        });

    }

/* =====================================================
   MODIFIER UNE AFFAIRE
===================================================== */

function showEditAnalModal(anal, overlay, closeModal) {

    const modal = overlay.querySelector(".anal-modal");

    modal.innerHTML = `

        <button
            type="button"
            class="anal-modal-close"
            title="Fermer"
        >
            ×
        </button>

        <div class="anal-modal-header">

            <h2>✏️ Modifier l'affaire</h2>

        </div>

        <div class="anal-edit-form">

            <label>
                Titre
                <input
                    type="text"
                    id="editAnalTitle"
                    value="${escapeHtml(anal.title)}"
                >
            </label>

            <label>
                Catégorie
                <input
                    type="text"
                    id="editAnalCategory"
                    value="${escapeHtml(anal.category || "")}"
                >
            </label>

            <label>
                Date
                <input
                    type="date"
                    id="editAnalDate"
                    value="${escapeHtml(anal.date || "")}"
                >
            </label>

            <label>
                Contenu
                <textarea
                    id="editAnalContent"
                    rows="12"
                >${escapeHtml(anal.content)}</textarea>
            </label>

            <label class="anal-sensitive-check">

                <input
                    type="checkbox"
                    id="editAnalSensitive"
                    ${anal.sensitive ? "checked" : ""}
                >

                🔒 Affaire sensible

            </label>

            <div class="anal-edit-actions">

                <button
                    type="button"
                    class="anal-cancel-edit"
                >
                    Annuler
                </button>

                <button
                    type="button"
                    class="anal-save-edit"
                >
                    💾 Enregistrer
                </button>

            </div>

        </div>
    `;


    /* =================================================
       FERMER
    ================================================= */

    modal
        .querySelector(".anal-modal-close")
        .addEventListener("click", closeModal);


    /* =================================================
       ANNULER
    ================================================= */

    modal
        .querySelector(".anal-cancel-edit")
        .addEventListener("click", () => {

            closeModal();

            // Réouvrir la version originale
            setTimeout(() => {

                openAnalModal(anal);

            }, 250);

        });


    /* =================================================
       ENREGISTRER
    ================================================= */

    modal
        .querySelector(".anal-save-edit")
        .addEventListener("click", async () => {

            const title = document
                .getElementById("editAnalTitle")
                .value
                .trim();

            const category = document
                .getElementById("editAnalCategory")
                .value
                .trim();

            const date = document
                .getElementById("editAnalDate")
                .value;

            const content = document
                .getElementById("editAnalContent")
                .value
                .trim();

            const sensitive = document
                .getElementById("editAnalSensitive")
                .checked;


            if (!title || !content) {

                showMessage(
                    "Le titre et le contenu sont obligatoires.",
                    "error"
                );

                return;

            }


            try {

                const response = await fetch(
                    `/api/anals/${anal.id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            title,
                            category,
                            date,
                            content,
                            sensitive
                        })
                    }
                );


                const updatedAnal = await response.json();


                if (!response.ok) {

                    throw new Error(
                        updatedAnal.error ||
                        "Impossible de modifier l'affaire."
                    );

                }


                showMessage(
                    "Affaire modifiée avec succès."
                );


                // Mise à jour locale
                const index = allAnals.findIndex(
                    item => item.id === anal.id
                );

                if (index !== -1) {
                    allAnals[index] = updatedAnal;
                }


                closeModal();

                renderAnals();

            } catch (error) {

                console.error(
                    "Erreur modification affaire :",
                    error
                );

                showMessage(
                    error.message ||
                    "Impossible de modifier l'affaire.",
                    "error"
                );

            }

        });

}

    /* =================================================
       SUPPRIMER UNE AFFAIRE
    ================================================= */

    archivesList
        .querySelectorAll(".delete-anal")
        .forEach(button => {

            button.addEventListener("click", async () => {

                const id = button.dataset.id;

                const anal = allAnals.find(
                    item => String(item.id) === String(id)
                );

                if (!anal) return;

                const confirmed = await Confirm.show({

                    icon: "🗑️",

                    title: "Supprimer cette affaire ?",

                    message: `Voulez-vous vraiment supprimer « ${escapeHtml(anal.title)} » ?`,

                    confirmText: "Supprimer",

                    cancelText: "Annuler"

                });

                if (!confirmed) return;


                try {

                    const response = await fetch(
                        `/api/anals/${id}`,
                        {
                            method: "DELETE"
                        }
                    );

                    const data = await response.json();

                    if (!response.ok) {

                        throw new Error(
                            data.error || "Impossible de supprimer l'affaire."
                        );

                    }

                    showMessage("Affaire supprimée.");

                    await loadAnals();

                } catch (error) {

                    console.error(
                        "Erreur suppression affaire :",
                        error
                    );

                    showMessage(
                        error.message ||
                        "Impossible de supprimer l'affaire.",
                        "error"
                    );

                }

            });

        });
    /* =================================================
       PAGINATION
    ================================================= */

    const totalPages = Math.ceil(
        allAnals.length / ANALS_PER_PAGE
    );


    if (totalPages > 1) {

        const pagination = document.createElement("div");

        pagination.className = "archives-pagination";


        pagination.innerHTML = `
            <button
                type="button"
                class="archives-page-button"
                id="previousAnalPage"
                ${currentPage === 1 ? "disabled" : ""}
            >
                ← Précédent
            </button>

            <span>
                Page ${currentPage} / ${totalPages}
            </span>

            <button
                type="button"
                class="archives-page-button"
                id="nextAnalPage"
                ${currentPage === totalPages ? "disabled" : ""}
            >
                Suivant →
            </button>
        `;


        archivesList.appendChild(pagination);


        document
            .getElementById("previousAnalPage")
            ?.addEventListener("click", () => {

                if (currentPage > 1) {

                    currentPage--;

                    renderAnals();

                }

            });


        document
            .getElementById("nextAnalPage")
            ?.addEventListener("click", () => {

                if (currentPage < totalPages) {

                    currentPage++;

                    renderAnals();

                }

            });

    }

}

    /* =====================================================
       PROTECTION DU HTML
    ===================================================== */

    function escapeHtml(value) {

        const div = document.createElement("div");

        div.textContent = value || "";

        return div.innerHTML;

    }


    /* =====================================================
       CHARGEMENT INITIAL
    ===================================================== */

    loadAnals();