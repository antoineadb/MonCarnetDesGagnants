/*=========================================================

    BOOK CARD
    Affichage d'un livre dans la bibliothèque

=========================================================*/
import EventBus from "/js/core/EventBus.js";

export default class BookCard {

    constructor(book) {

        this.book = book;

        this.element = null;

    }

    /*=========================================================
        RENDU
    =========================================================*/

    render() {

        this.element = document.createElement("article");

        this.element.className = "book-card";

        this.element.dataset.id = this.book.id;
        
        this.element.innerHTML = this.getTemplate();

        this.bindEvents();

        return this.element;

    }
        /*=========================================================
        TEMPLATE
    =========================================================*/

    getTemplate() {

        return `

            <div class="book-card-cover">

                <img
                    src="${this.book.cover || "/assets/images/books/default-cover.svg"}"
                    alt="${this.book.getDisplayTitle()}">
            </div>

            <div class="book-card-content">

                <h3 class="book-card-title">

                    ${this.book.getDisplayTitle()}

                </h3>

                <p class="book-card-author">

                    ${this.book.getDisplayAuthor()}

                </p>

                <div class="book-card-footer">

                    <span class="book-card-rating">

                        ${"⭐".repeat(this.book.rating)}

                    </span>

                    ${this.book.isLifeBook() ? `

                        <span class="book-life-book">

                            ❤️ Livre de Vie

                        </span>

                    ` : ""}

                </div>

            </div>

        `;

    }
        /*=========================================================
        ÉVÉNEMENTS
    =========================================================*/

    bindEvents() {

        this.element.addEventListener(
            "click",
            () => this.open()
        );

    }

    /*=========================================================
        OUVERTURE
    =========================================================*/

    open() {

        EventBus.emit(
            "book.open",
            this.book
        );

    }
    /*=========================================================
        MISE À JOUR
    =========================================================*/

    setBook(book) {

        this.book = book;

        this.refresh();

    }

    refresh() {

        if (!this.element) {

            return;

        }

        this.element.innerHTML = this.getTemplate();

        this.bindEvents();

    }

    /*=========================================================
        DESTRUCTION
    =========================================================*/

    destroy() {

        if (!this.element) {

            return;

        }

        this.element.remove();

        this.element = null;

    }

}