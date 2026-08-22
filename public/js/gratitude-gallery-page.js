import EventBus from "/js/core/EventBus.js";

import GratitudeViewer
    from "/components/gratitude-viewer/gratitude-viewer.js";


class GratitudeGalleryPage {

    constructor() {

        this.viewer = null;

        this.cards = [];

        this.filteredCards = [];

        this.currentPage = 1;

        // 3 cartes par page
        this.cardsPerPage = 3;

    }


    // ==========================================================
    // INITIALISATION
    // ==========================================================

    async init() {

        // ==============================================
        // Viewer
        // ==============================================

        this.viewer = new GratitudeViewer(

            document.getElementById(
                "gratitudeViewerContainer"
            )

        );

        await this.viewer.init();


        // ==============================================
        // Ouverture d'une carte
        // ==============================================

        EventBus.on(

            "gratitude.view",

            card => {

                this.viewer.showCard(card);

            }

        );

                // ==============================================
        // Modifier une carte
        // ==============================================
        EventBus.on(

            "postcard.edit",

            card => {

                this.viewer.postcard.fill(card);

                this.viewer.postcard.setMode("edit");

                // Le formulaire est au verso
                this.viewer.postcard.card.classList.add("flip");

                // Taille normale de la carte
                this.viewer.postcard.card.classList.remove("expand");

            }

        );
       
        // ==============================================
        // Sauvegarder une modificPostcard.show()ation
        // ==============================================

        EventBus.on(

            "postcard.save",

            async data => {

                if (!data?.id) return;

                try {

                    const response =
                        await fetch(
                            `/api/gratitude/${data.id}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify(
                                    data
                                )

                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Erreur lors de la modification"
                        );

                    }
                    await response.json();


                    // Recharger les cartes depuis la base
                    // pour récupérer la carte complète

                    await this.loadCards();


                    // Fermer le viewer

                    this.viewer.hide();


                    // Réafficher la galerie

                    this.render();

                    
                }
                catch (error) {

                    console.error(
                        "Erreur modification carte :",
                        error
                    );

                }

            }

        );
        // ==============================================
        // Supprimer une carte
        // ==============================================

        EventBus.on(

            "postcard.delete",

            async card => {

                if (!card?.id) return;

                try {

                    const response =
                        await fetch(
                            `/api/gratitude/${card.id}`,
                            {
                                method: "DELETE"
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Erreur lors de la suppression"
                        );

                    }


                    // Fermer le viewer

                    this.viewer.hide();


                    // Retirer la carte des données

                    this.cards =
                        this.cards.filter(
                            item =>
                                item.id !== card.id
                        );


                    this.filteredCards =
                        this.filteredCards.filter(
                            item =>
                                item.id !== card.id
                        );


                    // Éviter de rester sur
                    // une page devenue inexistante

                    const totalPages =
                        Math.max(
                            1,
                            Math.ceil(
                                this.filteredCards.length /
                                this.cardsPerPage
                            )
                        );


                    if (
                        this.currentPage >
                        totalPages
                    ) {

                        this.currentPage =
                            totalPages;

                    }


                    this.render();

                }
                catch (error) {

                    console.error(
                        "Erreur suppression carte :",
                        error
                    );

                }

            }

        );


        // ==============================================
        // Favori
        // ==============================================

        EventBus.on(

            "postcard.favorite",

            async card => {

                if (!card?.id) return;

                try {

                    const response =
                        await fetch(
                            `/api/gratitude/${card.id}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify(
                                    card
                                )

                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Erreur lors de la sauvegarde du favori"
                        );

                    }


                    // Mettre à jour la carte
                    // dans les données de la galerie

                    this.cards =
                        this.cards.map(
                            item =>
                                item.id === card.id
                                    ? { ...item, ...card }
                                    : item
                        );


                    this.filteredCards =
                        this.filteredCards.map(
                            item =>
                                item.id === card.id
                                    ? { ...item, ...card }
                                    : item
                        );
                    
                        this.viewer.hide();

                    
                        this.render();
                }
                catch (error) {

                    console.error(
                        "Erreur favori :",
                        error
                    );

                }

            }

        );

        // ==============================================
        // Retour à la bibliothèque
        // ==============================================

        const backButton =
            document.getElementById(
                "btnRetourBibliotheque"
            );

        if (backButton) {

            backButton.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "/pages/gratitude.html";

                }
            );

        }


        // ==============================================
        // Recherche
        // ==============================================

        const searchInput =
            document.getElementById(
                "gallerySearch"
            );

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                () => {

                    this.search(
                        searchInput.value
                    );

                }
            );

        }
        const searchButton =
            document.getElementById(
                "gallerySearchButton"
            );

        if (searchButton) {

            searchButton.addEventListener(
                "click",
                () => {

                    this.search(
                        searchInput.value
                    );

                }
            );

        }


        // ==============================================
        // Chargement des cartes
        // ==============================================

        await this.loadCards();


        // ==============================================
        // Affichage initial
        // ==============================================

        this.render();

    }


    // ==========================================================
    // CHARGEMENT
    // ==========================================================

    async loadCards() {

        try {

            const response =
                await fetch("/api/gratitude");


            if (!response.ok) {

                throw new Error(
                    "Impossible de charger les cartes."
                );

            }


            this.cards =
                await response.json();


            // Plus récentes en premier

            this.cards.sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            );


            this.filteredCards =
                [...this.cards];


            console.log(
                "Cartes reçues :",
                this.cards
            );

        }
        catch (error) {

            console.error(
                "Erreur chargement cartes :",
                error
            );


            const grid =
                document.getElementById(
                    "allCardsGrid"
                );


            if (grid) {

                grid.innerHTML = `
                    <p class="gallery-error">
                        Impossible de charger les souvenirs.
                    </p>
                `;

            }

        }

    }


    // ==========================================================
    // RECHERCHE
    // ==========================================================

    search(value) {

        const query =
            value
                .trim()
                .toLowerCase();


        this.filteredCards =
            this.cards.filter(
                card => {

                    const title =
                        card.title || "";


                    const message =
                        card.message || "";


                    const date =
                        this.formatDate(
                            card.created_at
                        );


                    return (

                        title
                            .toLowerCase()
                            .includes(query)

                        ||

                        message
                            .toLowerCase()
                            .includes(query)

                        ||

                        date
                            .toLowerCase()
                            .includes(query)

                    );

                }
            );


        // Une nouvelle recherche revient
        // toujours à la première page.

        this.currentPage = 1;

        this.render();

    }


    // ==========================================================
    // AFFICHAGE GLOBAL
    // ==========================================================

    render() {

        this.renderCount();

        this.renderCards();

        this.renderPagination();

    }


    // ==========================================================
    // COMPTEUR
    // ==========================================================

    renderCount() {

        const count =
            document.getElementById(
                "galleryCount"
            );


        if (!count) return;


        const number =
            this.filteredCards.length;


        count.textContent =
            `${number} souvenir${number > 1 ? "s" : ""} conservé${number > 1 ? "s" : ""}`;

    }


    // ==========================================================
    // CARTES
    // ==========================================================

    renderCards() {

        const grid =
            document.getElementById(
                "allCardsGrid"
            );


        if (!grid) return;


        grid.innerHTML = "";


        if (this.filteredCards.length === 0) {

            grid.innerHTML = `
                <div class="gallery-empty">

                    <div class="gallery-empty-icon">
                        📖
                    </div>

                    <p>
                        Aucun souvenir trouvé.
                    </p>

                </div>
            `;

            return;

        }


        const start =
            (this.currentPage - 1) *
            this.cardsPerPage;


        const end =
            start +
            this.cardsPerPage;


        const pageCards =
            this.filteredCards.slice(
                start,
                end
            );


        pageCards.forEach(
            card => {

                const element =
                    this.createCard(card);


                grid.appendChild(
                    element
                );

            }
        );

    }


    // ==========================================================
    // CRÉATION D'UNE CARTE
    // ==========================================================

    createCard(card) {

        const element =
            document.createElement(
                "article"
            );


        element.className =
            "gallery-card";

        const favoriteIcon =
            card.favorite
                ? "❤️"
                : "♡";    
        
        const preview =
            card.message
                ? card.message.length > 150
                    ? card.message.substring(
                        0,
                        150
                    ) + "…"
                    : card.message
                : "";


        element.innerHTML = `
    
            <div class="gallery-card-favorite">
                ${favoriteIcon}
            </div>        
            <div class="gallery-card-image">

                ${
                    card.image
                        ? `
                            <img
                                src="${card.image}"
                                alt=""
                            >
                        `
                        : `
                            <div class="gallery-card-no-image"></div>
                        `
                }

            </div>


            <div class="gallery-card-content">

                <h2>
                    ${this.escapeHtml(
                        card.title || "Sans titre"
                    )}
                </h2>


                <p>
                    ${this.escapeHtml(
                        preview
                    )}
                </p>


                <small>
                    ${this.formatDate(
                        card.created_at
                    )}
                </small>

            </div>

        `;


        // Clic sur la carte

        element.addEventListener(
            "click",
            () => {

                EventBus.emit(
                    "gratitude.view",
                    card
                );

            }
        );


        return element;

    }


    // ==========================================================
    // PAGINATION
    // ==========================================================

    renderPagination() {

        const pagination =
            document.getElementById(
                "galleryPagination"
            );


        if (!pagination) return;


        pagination.innerHTML = "";


        const totalPages =
            Math.ceil(
                this.filteredCards.length /
                this.cardsPerPage
            );


        if (totalPages <= 1) {

            return;

        }


        // Précédent

        const previous =
            this.createPaginationButton(
                "‹",
                this.currentPage - 1
            );


        previous.disabled =
            this.currentPage === 1;


        pagination.appendChild(
            previous
        );


        // Pages

        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {

            const button =
                this.createPaginationButton(
                    page,
                    page
                );


            if (
                page ===
                this.currentPage
            ) {

                button.classList.add(
                    "active"
                );

            }


            pagination.appendChild(
                button
            );

        }


        // Suivant

        const next =
            this.createPaginationButton(
                "›",
                this.currentPage + 1
            );


        next.disabled =
            this.currentPage === totalPages;


        pagination.appendChild(
            next
        );

    }


    // ==========================================================
    // BOUTON PAGINATION
    // ==========================================================

    createPaginationButton(
        label,
        page
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type = "button";


        button.className =
            "gallery-pagination-button";


        button.textContent =
            label;


        button.addEventListener(
            "click",
            () => {

                const totalPages =
                    Math.ceil(
                        this.filteredCards.length /
                        this.cardsPerPage
                    );


                if (
                    page < 1 ||
                    page > totalPages
                ) {

                    return;

                }


                this.currentPage =
                    page;


                this.render();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        return button;

    }


    // ==========================================================
    // DATE
    // ==========================================================

    formatDate(date) {

        return new Date(date)
            .toLocaleDateString(
                "fr-FR",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

    }


    // ==========================================================
    // SÉCURITÉ HTML
    // ==========================================================

    escapeHtml(value) {

        return String(value)

            .replaceAll(
                "&",
                "&amp;"
            )

            .replaceAll(
                "<",
                "&lt;"
            )

            .replaceAll(
                ">",
                "&gt;"
            )

            .replaceAll(
                '"',
                "&quot;"
            )

            .replaceAll(
                "'",
                "&#039;"
            );

    }

}


const page =
    new GratitudeGalleryPage();


page.init();