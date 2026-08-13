
/* =========================================================
   GESTION DES CATÉGORIES D'OBJECTIFS
   Version interface - sans SQLite pour le moment
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    console.log("🏺 Test API catégories...");

    fetch("/api/categories-objectifs")
        .then(response => {

            console.log(
                "📡 Statut API catégories :",
                response.status
            );

            return response.json();

        })
        .then(data => {

            console.log(
                "📜 Catégories reçues :",
                data
            );

        })
        .catch(error => {

            console.error(
                "❌ Erreur API catégories :",
                error
            );

        });


    const collection = document.querySelector(".categories-collection");

    if (!collection) {
        console.error("❌ .categories-collection introuvable");
        return;
    }


    /* =====================================================
       DONNÉES DES CATÉGORIES
       ===================================================== */

    let categories = [];


    /* =====================================================
       RÉCUPÉRATION DES CATÉGORIES PRÉSENTES DANS LE HTML
       ===================================================== */

  function chargerCategoriesDepuisHTML() {

        categories = [];

        const papyrus = collection.querySelectorAll(
            ".category-papyrus"
        );

        papyrus.forEach((element, index) => {

            const symbole =
                element.querySelector(
                    ".category-symbol"
                )?.textContent.trim() || "";

            const egyptien =
                element.querySelector(
                    ".category-egyptian"
                )?.textContent.trim() || "";

            const nom =
                element.querySelector(
                    "h2"
                )?.textContent.trim() || "";

            const id = Date.now() + index;

            // Très important :
            // on associe l'ID à l'élément HTML
            element.dataset.id = String(id);

            categories.push({

                id: id,

                nom: nom,

                egyptien: egyptien,

                symbole: symbole

            });

        });
}
    /* =====================================================
       AFFICHAGE
       ===================================================== */

    function afficherCategories() {

        const boutonAjouter =
            collection.querySelector(".new-category-papyrus");

        // On supprime uniquement les anciennes cartes
        collection
            .querySelectorAll(".category-papyrus")
            .forEach(element => element.remove());


        categories.forEach(category => {

            const papyrus =
                document.createElement("article");

            papyrus.className = "category-papyrus";

            papyrus.dataset.id = category.id;

            papyrus.innerHTML = `


                <div class="category-symbol">
                    ${category.symbole}
                </div>
                <div class="category-egyptian">
                    ${category.egyptien}
                </div>

                <h2>
                    ${category.nom}
                </h2>

                <div class="category-actions">

                    <button
                        type="button"
                        class="category-action edit"
                        title="Modifier"
                    >
                        ✎
                    </button>

                    <button
                        type="button"
                        class="category-action delete"
                        title="Supprimer"
                    >
                        🗑
                    </button>

                </div>
            `;

                // Insérer avant le bouton Nouvelle catégorie
                collection.insertBefore(
                    papyrus,
                    boutonAjouter
                );
            });


        ajouterEvenements();
    }


    /* =====================================================
       MODAL
       ===================================================== */

    function creerModal() {

        if (document.querySelector(".category-modal-overlay")) {
            return;
        }

        const overlay =
            document.createElement("div");

        overlay.className =
            "category-modal-overlay";

        overlay.innerHTML = `

            <div class="category-modal">

                <button
                    type="button"
                    class="category-modal-close"
                    aria-label="Fermer"
                >
                    ×
                </button>

                <div class="category-modal-symbol">
                    📜
                </div>

                <h2 class="category-modal-title">
                    Nouvelle catégorie
                </h2>

                <p class="category-modal-subtitle">
                    Écris un nouveau domaine dans ton carnet.
                </p>

                <form class="category-form">

                    <div class="category-form-group">

                        <label for="category-name">
                            Nom de la catégorie
                        </label>

                        <input
                            type="text"
                            id="category-name"
                            name="nom"
                            placeholder="Ex. Relations"
                            required
                        >

                    </div>


                    <div class="category-form-group">

                        <label for="category-egyptian">
                            Nom égyptologique
                        </label>

                        <input
                            type="text"
                            id="category-egyptian"
                            name="egyptien"
                            placeholder="Ex. MRW.T"
                        >

                    </div>


                    <div class="category-form-group">

                        <label for="category-symbol">
                            Hiéroglyphes
                        </label>

                        <input
                            type="text"
                            id="category-symbol"
                            name="symbole"
                            placeholder="Ex. 𓌸𓂋𓅱𓏏𓀁"
                        >

                    </div>


                    <div class="category-modal-buttons">

                        <button
                            type="button"
                            class="category-cancel"
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            class="category-save"
                        >
                            Écrire dans le carnet
                        </button>

                    </div>

                </form>

            </div>
        `;

        document.body.appendChild(overlay);


        /* Fermeture */

        overlay
            .querySelector(".category-modal-close")
            .addEventListener("click", fermerModal);


        overlay
            .querySelector(".category-cancel")
            .addEventListener("click", fermerModal);


        // Cliquer sur le fond ferme également
        overlay.addEventListener("click", event => {

            if (event.target === overlay) {
                fermerModal();
            }

        });
    }


    /* =====================================================
       OUVRIR LE MODAL
       ===================================================== */

    function ouvrirModal(category = null) {

        creerModal();

        const overlay =
            document.querySelector(
                ".category-modal-overlay"
            );

        const title =
            overlay.querySelector(
                ".category-modal-title"
            );

        const form =
            overlay.querySelector(
                ".category-form"
            );

        const nameInput =
            overlay.querySelector(
                "#category-name"
            );

        const egyptianInput =
            overlay.querySelector(
                "#category-egyptian"
            );

        const symbolInput =
            overlay.querySelector(
                "#category-symbol"
            );


        /* Mode modification */

        if (category) {

            title.textContent =
                "Modifier la catégorie";

            nameInput.value =
                category.nom;

            egyptianInput.value =
                category.egyptien;

            symbolInput.value =
                category.symbole;

            form.dataset.editId =
                category.id;

        }

        /* Mode création */

        else {

            title.textContent =
                "Nouvelle catégorie";

            form.reset();

            delete form.dataset.editId;
        }


        overlay.classList.add("visible");

        setTimeout(() => {
            nameInput.focus();
        }, 100);
    }


    /* =====================================================
       FERMER LE MODAL
       ===================================================== */

    function fermerModal() {

        const overlay =
            document.querySelector(
                ".category-modal-overlay"
            );

        if (!overlay) {
            return;
        }

        overlay.classList.remove("visible");
    }


    /* =====================================================
       ENREGISTREMENT
       ===================================================== */

    function enregistrerCategorie(event) {

        event.preventDefault();

        const form = event.currentTarget;

        const nom =
            form.querySelector("#category-name")
                .value.trim();

        const egyptien =
            form.querySelector("#category-egyptian")
                .value.trim();

        const symbole =
            form.querySelector("#category-symbol")
                .value.trim();


        if (!nom) {

            alert(
                "Veuillez saisir un nom de catégorie."
            );

            return;
        }


        /* Modification */

        if (form.dataset.editId) {

            const id =
                Number(form.dataset.editId);

            const category =
                categories.find(
                    item => item.id === id
                );

            if (category) {

                category.nom = nom;
                category.egyptien = egyptien;
                category.symbole =
                    symbole || "𓂀";
            }

        }

        /* Nouvelle catégorie */

        else {

            categories.push({

                id: Date.now(),

                nom: nom,

                egyptien:
                    egyptien || "",

                symbole:
                    symbole || "𓂀"

            });
        }


        afficherCategories();

        fermerModal();
    }


    /* =====================================================
       SUPPRESSION
       ===================================================== */

    async function supprimerCategorie(id) {

        console.log("🗑️ Suppression demandée :", id);

        const category = categories.find(
            item => item.id === id
        );

        if (!category) {
            console.log("❌ Catégorie introuvable");
            return;
        }

        console.log("📜 Catégorie :", category);

        const ok = await Confirm.show({

            title: "Supprimer la catégorie",

            message:
                `Voulez-vous vraiment supprimer la catégorie « ${category.nom} » ?`,

            confirmText: "Supprimer",

            cancelText: "Annuler"

        });

        console.log("✅ Réponse Confirm :", ok);

        if (!ok) {
            return;
        }

        categories = categories.filter(
            item => item.id !== id
        );

        afficherCategories();

    }

    function deplacerCategorie(id, direction) {

        const index = categories.findIndex(
            category => category.id === id
        );

        if (index === -1) {
            return;
        }


        const nouvellePosition = index + direction;


        // Déjà tout en haut ou tout en bas
        if (
            nouvellePosition < 0 ||
            nouvellePosition >= categories.length
        ) {
            return;
        }


        // Échange des deux catégories
        const temp = categories[index];

        categories[index] =
            categories[nouvellePosition];

        categories[nouvellePosition] =
            temp;


        // Réaffichage
        afficherCategories();

    }
    /* =====================================================
       ÉVÉNEMENTS DES CARTES
       ===================================================== */

    function ajouterEvenements() {

        const cartes = collection.querySelectorAll(
            ".category-papyrus"
        );

        cartes.forEach(card => {

            const id = Number(card.dataset.id);

            if (Number.isNaN(id)) {
                console.error(
                    "❌ ID invalide pour cette catégorie :",
                    card
                );
                return;
            }


            /* =================================================
            MODIFIER
            ================================================= */

            const editButton = card.querySelector(".edit");

            editButton.addEventListener("click", event => {

                event.stopPropagation();

                const category = categories.find(
                    item => item.id === id
                );

                if (category) {
                    ouvrirModal(category);
                }

            });


            /* =================================================
            SUPPRIMER
            ================================================= */

            const deleteButton = card.querySelector(".delete");

            deleteButton.addEventListener("click", event => {

                event.stopPropagation();

                supprimerCategorie(id);

            });


            /* =================================================
            BOUTON MONTER
            ================================================= */

            const upButton = document.createElement("button");

            upButton.type = "button";
            upButton.className = "category-action move-up";
            upButton.title = "Monter";
            upButton.textContent = "↑";


            /* =================================================
            BOUTON DESCENDRE
            ================================================= */

            const downButton = document.createElement("button");

            downButton.type = "button";
            downButton.className = "category-action move-down";
            downButton.title = "Descendre";
            downButton.textContent = "↓";


            /* =================================================
            AJOUT DES BOUTONS
            ================================================= */

            const actions = card.querySelector(
                ".category-actions"
            );

            actions.insertBefore(
                upButton,
                actions.firstChild
            );

            actions.insertBefore(
                downButton,
                actions.children[1]
            );


            /* =================================================
            MONTER
            ================================================= */

            upButton.addEventListener("click", event => {

                event.stopPropagation();

                deplacerCategorie(id, -1);

            });


            /* =================================================
            DESCENDRE
            ================================================= */

            downButton.addEventListener("click", event => {

                event.stopPropagation();

                deplacerCategorie(id, 1);

            });

        });

    }


    /* =====================================================
       NOUVELLE CATÉGORIE
       ===================================================== */

    const boutonAjouter =
        collection.querySelector(
            ".new-category-papyrus"
        );


    if (boutonAjouter) {

        boutonAjouter.addEventListener(
            "click",
            () => ouvrirModal()
        );

    }


    /* =====================================================
       INITIALISATION DU MODAL
       ===================================================== */

    creerModal();


    const form =
        document.querySelector(
            ".category-form"
        );


    form.addEventListener(
        "submit",
        enregistrerCategorie
    );


    /* =====================================================
       INITIALISATION
       ===================================================== */

    chargerCategoriesDepuisHTML();
        ajouterEvenements();

});