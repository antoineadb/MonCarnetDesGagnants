/* =========================================================
   GESTION DES CATÉGORIES D'OBJECTIFS
   Version SQLite / API
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    console.log("🏺 Initialisation des catégories d'objectifs...");

    const collection = document.querySelector(".categories-collection");

    if (!collection) {
        console.error("❌ .categories-collection introuvable");
        return;
    }


    /* =====================================================
       DONNÉES
       ===================================================== */

    let categories = [];


    /* =====================================================
       CHARGER LES CATÉGORIES DEPUIS SQLITE
       ===================================================== */

    async function chargerCategories() {

        try {

            console.log("📡 Chargement des catégories...");

            const response =
                await fetch("/api/categories-objectifs");

            console.log(
                "📡 Statut API :",
                response.status
            );

            const data = await response.json();

            if (!response.ok) {

                console.error(
                    "❌ Erreur API :",
                    data
                );

                return;
            }


            /*
             * L'API renvoie directement le tableau
             * des catégories.
             */

            if (!Array.isArray(data)) {

                console.error(
                    "❌ Format inattendu reçu de l'API :",
                    data
                );

                return;
            }


            categories = data.map(category => ({

                id: Number(category.id),

                nom: category.nom || "",

                egyptien: category.egyptien || "",

                symbole:
                    category.symbole || "𓂀",

                ordre:
                    Number(category.ordre) || 0

            }));


            console.log(
                "📜 Catégories chargées :",
                categories
            );


            afficherCategories();

        } catch (error) {

            console.error(
                "❌ Erreur chargement catégories :",
                error
            );

        }

    }


    /* =====================================================
       AFFICHAGE
       ===================================================== */

    function afficherCategories() {

        const boutonAjouter =
            collection.querySelector(
                ".new-category-papyrus"
            );


        /*
         * Supprimer uniquement les anciennes cartes
         */

        collection
            .querySelectorAll(".category-papyrus")
            .forEach(element => element.remove());


        /*
         * Créer les cartes
         */

        categories.forEach(category => {

            const papyrus =
                document.createElement("article");

            papyrus.className =
                "category-papyrus";

            papyrus.dataset.id =
                String(category.id);


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
                        class="category-action move-up"
                        title="Monter"
                    >
                        ↑
                    </button>

                    <button
                        type="button"
                        class="category-action move-down"
                        title="Descendre"
                    >
                        ↓
                    </button>

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

        if (
            document.querySelector(
                ".category-modal-overlay"
            )
        ) {
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
            .addEventListener(
                "click",
                fermerModal
            );


        overlay
            .querySelector(".category-cancel")
            .addEventListener(
                "click",
                fermerModal
            );


        overlay.addEventListener(
            "click",
            event => {

                if (event.target === overlay) {
                    fermerModal();
                }

            }
        );

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


        if (category) {

            /* ================================
               MODE MODIFICATION
               ================================ */

            title.textContent =
                "Modifier la catégorie";


            nameInput.value =
                category.nom;


            egyptianInput.value =
                category.egyptien;


            symbolInput.value =
                category.symbole;


            form.dataset.editId =
                String(category.id);

        } else {

            /* ================================
               MODE CRÉATION
               ================================ */

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


        overlay.classList.remove(
            "visible"
        );

    }


    /* =====================================================
       ENREGISTRER UNE CATÉGORIE
       ===================================================== */

    async function enregistrerCategorie(event) {

        event.preventDefault();


        const form =
            event.currentTarget;


        const nom =
            form
                .querySelector("#category-name")
                .value
                .trim();


        const egyptien =
            form
                .querySelector("#category-egyptian")
                .value
                .trim();


        const symbole =
            form
                .querySelector("#category-symbol")
                .value
                .trim();


        if (!nom) {

            alert(
                "Veuillez saisir un nom de catégorie."
            );

            return;

        }


        const editId =
            form.dataset.editId;


        try {

            let response;


            /* =================================================
               MODIFICATION
               ================================================= */

            if (editId) {

                console.log(
                    "✏️ Modification catégorie :",
                    editId
                );


                response =
                    await fetch(
                        `/api/categories-objectifs/${editId}`,
                        {

                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                nom,
                                egyptien,
                                symbole:
                                    symbole || "𓂀"

                            })

                        }
                    );

            }


            /* =================================================
               CRÉATION
               ================================================= */

            else {

                console.log(
                    "➕ Création catégorie :",
                    nom
                );


                response =
                    await fetch(
                        "/api/categories-objectifs",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                nom,
                                egyptien,
                                symbole:
                                    symbole || "𓂀"

                            })

                        }
                    );

            }


            const data =
                await response.json();


            if (!response.ok) {

                console.error(
                    "❌ Erreur enregistrement :",
                    data
                );

                alert(
                    data.error ||
                    "Impossible d'enregistrer la catégorie."
                );

                return;

            }


            console.log(
                "✅ Catégorie enregistrée :",
                data
            );


            /*
             * On recharge depuis SQLite.
             * Cela garantit que l'interface correspond
             * réellement à la base.
             */

            await chargerCategories();


            fermerModal();


        } catch (error) {

            console.error(
                "❌ Erreur réseau :",
                error
            );

            alert(
                "Impossible de communiquer avec le serveur."
            );

        }

    }


    /* =====================================================
       SUPPRESSION
       ===================================================== */

    async function supprimerCategorie(id) {

        console.log(
            "🗑️ Suppression demandée :",
            id
        );


        const category =
            categories.find(
                item => item.id === id
            );


        if (!category) {

            console.error(
                "❌ Catégorie introuvable :",
                id
            );

            return;

        }


        const ok =
            await Confirm.show({

                title:
                    "Supprimer la catégorie",

                message:
                    `Voulez-vous vraiment supprimer la catégorie « ${category.nom} » ?`,

                confirmText:
                    "Supprimer",

                cancelText:
                    "Annuler"

            });


        console.log(
            "✅ Réponse Confirm :",
            ok
        );


        if (!ok) {
            return;
        }


        try {

            const response =
                await fetch(
                    `/api/categories-objectifs/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                console.error(
                    "❌ Erreur suppression :",
                    data
                );

                alert(
                    data.error ||
                    "Impossible de supprimer la catégorie."
                );

                return;

            }


            console.log(
                "✅ Catégorie supprimée"
            );


            await chargerCategories();


        } catch (error) {

            console.error(
                "❌ Erreur réseau suppression :",
                error
            );

        }

    }


    /* =====================================================
       DÉPLACER UNE CATÉGORIE
       ===================================================== */

    async function deplacerCategorie(
        id,
        direction
    ) {

        const index =
            categories.findIndex(
                category =>
                    category.id === id
            );


        if (index === -1) {
            return;
        }


        const nouvellePosition =
            index + direction;


        if (
            nouvellePosition < 0 ||
            nouvellePosition >= categories.length
        ) {

            return;

        }


        /*
         * On échange localement les deux éléments
         */

        const temp =
            categories[index];


        categories[index] =
            categories[nouvellePosition];


        categories[nouvellePosition] =
            temp;


        /*
         * On envoie le nouvel ordre à SQLite
         */

        try {

           const response =
            await fetch(
                "/api/categories-objectifs/reorder",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        categories: categories.map(category => ({
                            id: category.id
                        }))
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                console.error(
                    "❌ Erreur réorganisation :",
                    data
                );

                /*
                 * En cas d'erreur,
                 * on recharge l'ordre réel
                 * depuis SQLite.
                 */

                await chargerCategories();

                return;

            }


            console.log(
                "✅ Nouvel ordre enregistré"
            );


            /*
             * Réaffichage
             */

            afficherCategories();


        } catch (error) {

            console.error(
                "❌ Erreur réseau réorganisation :",
                error
            );


            /*
             * On revient à l'état réel de SQLite
             */

            await chargerCategories();

        }

    }


    /* =====================================================
       ÉVÉNEMENTS DES CARTES
       ===================================================== */

    function ajouterEvenements() {

        const cartes =
            collection.querySelectorAll(
                ".category-papyrus"
            );


        cartes.forEach(card => {

            const id =
                Number(card.dataset.id);


            if (Number.isNaN(id)) {

                console.error(
                    "❌ ID invalide :",
                    card
                );

                return;

            }


            /* =================================================
               MODIFIER
               ================================================= */

            const editButton =
                card.querySelector(".edit");


            if (editButton) {

                editButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        const category =
                            categories.find(
                                item =>
                                    item.id === id
                            );


                        if (category) {
                            ouvrirModal(category);
                        }

                    }
                );

            }


            /* =================================================
               SUPPRIMER
               ================================================= */

            const deleteButton =
                card.querySelector(".delete");


            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        supprimerCategorie(id);

                    }
                );

            }


            /* =================================================
               MONTER
               ================================================= */

            const upButton =
                card.querySelector(".move-up");


            if (upButton) {

                upButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        deplacerCategorie(
                            id,
                            -1
                        );

                    }
                );

            }


            /* =================================================
               DESCENDRE
               ================================================= */

            const downButton =
                card.querySelector(".move-down");


            if (downButton) {

                downButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        deplacerCategorie(
                            id,
                            1
                        );

                    }
                );

            }

        });

    }


    /* =====================================================
       BOUTON NOUVELLE CATÉGORIE
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


    if (form) {

        form.addEventListener(
            "submit",
            enregistrerCategorie
        );

    }


    /* =====================================================
       CHARGEMENT INITIAL
       ===================================================== */

    await chargerCategories();


    console.log(
        "🚀 Gestion des catégories prête."
    );

});