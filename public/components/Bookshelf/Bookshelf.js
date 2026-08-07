/*=========================================================

    BOOKSHELF
    Bibliothèque du Carnet de Lecture

=========================================================*/

import BookCard from "../BookCard/BookCard.js";


export default class Bookshelf {

    constructor(container) {

        this.container = container;

        this.books = [];

    }

    /*=========================================================
        INITIALISATION
    =========================================================*/

    init() {

        this.render();

    }

    /*=========================================================
        LIVRES
    =========================================================*/

    setBooks(books = []) {

        this.books = books;

        this.render();

    }

        /*=========================================================
        AFFICHAGE
    =========================================================*/

    render() {

        this.container.innerHTML = "";

        if (this.books.length === 0) {

            this.renderEmpty();

            return;

        }
        
        console.log(this.books);

        this.books.forEach(book => {

            const card = new BookCard(book);

            this.container.appendChild(
                card.render()
            );

            const div = document.createElement("div");

        });

    }

    /*=========================================================
        BIBLIOTHÈQUE VIDE
    =========================================================*/

    renderEmpty() {

        this.container.innerHTML = `

            <div class="bookshelf-empty">

                <div class="bookshelf-empty-icon">

                    📚

                </div>

                <h3>

                    Votre bibliothèque vous attend.

                </h3>

                <p>

                    Chaque livre que vous ajouterez écrira
                    un nouveau chapitre de votre histoire.

                </p>

            </div>

        `;

    }
        /*=========================================================
        AJOUT
    =========================================================*/

    addBook(book) {

        this.books.push(book);

        this.render();

    }

    /*=========================================================
        SUPPRESSION
    =========================================================*/

    removeBook(bookId) {

        this.books = this.books.filter(
            book => book.id !== bookId
        );

        this.render();

    }

    /*=========================================================
        MISE À JOUR
    =========================================================*/

    updateBook(updatedBook) {

        const index = this.books.findIndex(
            book => book.id === updatedBook.id
        );

        if (index === -1) {

            return;

        }

        this.books[index] = updatedBook;

        this.render();

    }
        /*=========================================================
        ACCÈS
    =========================================================*/

    getBooks() {

        return [...this.books];

    }

    getBook(bookId) {

        return this.books.find(
            book => book.id === bookId
        );

    }

    /*=========================================================
        TRI
    =========================================================*/

    sort(compareFunction) {

        this.books.sort(compareFunction);

        this.render();

    }

    /*=========================================================
        FILTRE
    =========================================================*/

    filter(predicate) {

        return this.books.filter(predicate);

    }

    /*=========================================================
        RÉINITIALISATION
    =========================================================*/

    clear() {

        this.books = [];

        this.render();

    }
        /*=========================================================
        CARTES
    =========================================================*/

    getCards() {

        return [...this.cards];

    }

    destroy() {

        this.cards.forEach(card => card.destroy());

        this.cards = [];

        this.books = [];

        this.container.innerHTML = "";

    }

}