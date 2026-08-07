/*=========================================================

    LE CARNET DES GAGNANTS
    BOOK VIEWER

    Affichage d'un livre

=========================================================*/

export default class BookViewer {

    constructor() {

        this.book = null;

        this.element = null;

    }

    /*=========================================================
        INITIALISATION
    =========================================================*/

    init() {

        this.create();

        this.bindEvents();

    }

    /*=========================================================
        CREATION
    =========================================================*/

    create() {

        this.element = document.createElement("div");

        this.element.className = "book-viewer hidden";

        this.element.innerHTML = this.template();

        document.body.appendChild(this.element);

    }

    /*=========================================================
        TEMPLATE
    =========================================================*/

    template() {

        return `

<div class="book-viewer-overlay">

    <div class="book-viewer-window">

        <button
            class="book-viewer-close">

            ✕

        </button>

        <div class="book-viewer-cover">

            <img
                id="viewerCover"
                src=""
                alt="">

        </div>

        <div class="book-viewer-content">

            <h2 id="viewerTitle"></h2>

            <p
                id="viewerAuthor"
                class="viewer-author">

            </p>

            <div
                id="viewerRating"
                class="viewer-rating">

            </div>

            <hr>

            <h3>Résumé</h3>

            <p id="viewerSummary"></p>

            <h3>Pourquoi ce livre est important</h3>

            <p id="viewerComment"></p>

            <h3>Citations</h3>

            <div id="viewerQuotes"></div>

            <h3>Idées retenues</h3>

            <div id="viewerIdeas"></div>

        </div>

    </div>

</div>

        `;

    }

    /*=========================================================
        EVENEMENTS
    =========================================================*/

    bindEvents() {

        this.element
            .querySelector(".book-viewer-close")
            .addEventListener(
                "click",
                () => this.close()
            );

        this.element
            .querySelector(".book-viewer-overlay")
            .addEventListener(
                "click",
                (event) => {

                    if(event.target.classList.contains("book-viewer-overlay")){

                        this.close();

                    }

                }
            );

    }

    /*=========================================================
        OUVERTURE
    =========================================================*/

    open(book) {

        this.book = book;

        this.fill();

        this.element.classList.remove("hidden");

    }

    /*=========================================================
        FERMETURE
    =========================================================*/

    close() {

        this.element.classList.add("hidden");

    }

    /*=========================================================
        REMPLISSAGE
    =========================================================*/

    fill() {

        this.element.querySelector("#viewerCover").src =
            this.book.cover;

        this.element.querySelector("#viewerCover").alt =
            this.book.title;

        this.element.querySelector("#viewerTitle").textContent =
            this.book.title;

        this.element.querySelector("#viewerAuthor").textContent =
            this.book.author;

        this.element.querySelector("#viewerRating").textContent =
            "⭐".repeat(this.book.rating);

        this.element.querySelector("#viewerSummary").textContent =
            this.book.summary || "";

        this.element.querySelector("#viewerComment").textContent =
            this.book.comment || "";

        this.fillQuotes();

        this.fillIdeas();

    }

    /*=========================================================
        CITATIONS
    =========================================================*/

    fillQuotes() {

        const container =
            this.element.querySelector("#viewerQuotes");

        container.innerHTML = "";

        (this.book.quotes || []).forEach(quote => {

            const p = document.createElement("p");

            p.textContent = "❝ " + quote;

            container.appendChild(p);

        });

    }

    /*=========================================================
        IDEES
    =========================================================*/

    fillIdeas() {

        const container =
            this.element.querySelector("#viewerIdeas");

        container.innerHTML = "";

        (this.book.ideas || []).forEach(idea => {

            const p = document.createElement("p");

            p.textContent = "• " + idea;

            container.appendChild(p);

        });

    }

}