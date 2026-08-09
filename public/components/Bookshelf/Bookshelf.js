/*=========================================================

    BOOKSHELF
    Bibliothèque du Carnet de Lecture

=========================================================*/

import BookCard from "../BookCard/BookCard.js";


export default class Bookshelf {


    constructor(container) {

        this.container = container;

        this.books = [];

        // Pagination
        this.currentPage = 1;

        this.booksPerPage = 5;

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

        // Quand la liste change,
        // on revient à la première page.

        this.currentPage = 1;

        this.render();

    }


    /*=========================================================
        AFFICHAGE
    =========================================================*/

    render() {

        this.container.innerHTML = "";


        /*-----------------------------------------------------
            BIBLIOTHÈQUE VIDE
        -----------------------------------------------------*/

        if (this.books.length === 0) {

            this.renderEmpty();

            return;

        }


        /*-----------------------------------------------------
            CONTENEUR DES CARTES
        -----------------------------------------------------*/

        const grid =
            document.createElement("div");

        grid.className = "bookshelf-grid";


        /*-----------------------------------------------------
            CALCUL DE LA PAGE
        -----------------------------------------------------*/

        const start =
            (this.currentPage - 1)
            * this.booksPerPage;


        const end =
            start + this.booksPerPage;


        const pageBooks =
            this.books.slice(start, end);


        /*-----------------------------------------------------
            AFFICHER LES LIVRES DE LA PAGE
        -----------------------------------------------------*/

        pageBooks.forEach(book => {

            const card =
                new BookCard(book);


            grid.appendChild(
                card.render()
            );

        });


        this.container.appendChild(grid);


        /*-----------------------------------------------------
            PAGINATION
        -----------------------------------------------------*/

        this.renderPagination();

    }


    /*=========================================================
        PAGINATION
    =========================================================*/

    renderPagination() {

        const totalPages =
            Math.ceil(
                this.books.length
                / this.booksPerPage
            );


        // Pas de pagination s'il n'y a
        // qu'une seule page.

        if (totalPages <= 1) {

            return;

        }


        const pagination =
            document.createElement("div");

        pagination.className =
            "bookshelf-pagination";


        /*-----------------------------------------------------
            BOUTON PRÉCÉDENT
        -----------------------------------------------------*/

        const previous =
            document.createElement("button");

        previous.type = "button";

        previous.className =
            "bookshelf-pagination-button";


        previous.textContent = "‹";


        previous.disabled =
            this.currentPage === 1;


        previous.addEventListener(
            "click",
            () => {

                if (this.currentPage > 1) {

                    this.currentPage--;

                    this.render();

                }

            }
        );


        pagination.appendChild(previous);


        /*-----------------------------------------------------
            NUMÉROS DES PAGES
        -----------------------------------------------------*/

        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {

            const button =
                document.createElement("button");


            button.type = "button";


            button.className =
                "bookshelf-pagination-button";


            if (page === this.currentPage) {

                button.classList.add("active");

            }


            button.textContent = page;


            button.addEventListener(
                "click",
                () => {

                    this.currentPage = page;

                    this.render();

                }
            );


            pagination.appendChild(button);

        }


        /*-----------------------------------------------------
            BOUTON SUIVANT
        -----------------------------------------------------*/

        const next =
            document.createElement("button");


        next.type = "button";


        next.className =
            "bookshelf-pagination-button";


        next.textContent = "›";


        next.disabled =
            this.currentPage === totalPages;


        next.addEventListener(
            "click",
            () => {

                if (
                    this.currentPage
                    < totalPages
                ) {

                    this.currentPage++;

                    this.render();

                }

            }
        );


        pagination.appendChild(next);


        this.container.appendChild(
            pagination
        );

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

        // Aller sur la dernière page
        // pour voir immédiatement le nouveau livre.

        this.currentPage =
            Math.ceil(
                this.books.length
                / this.booksPerPage
            );

        this.render();

    }


    /*=========================================================
        SUPPRESSION
    =========================================================*/

    removeBook(bookId) {

        this.books =
            this.books.filter(
                book => book.id !== bookId
            );


        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    this.books.length
                    / this.booksPerPage
                )
            );


        if (
            this.currentPage
            > totalPages
        ) {

            this.currentPage =
                totalPages;

        }


        this.render();

    }


    /*=========================================================
        MISE À JOUR
    =========================================================*/

    updateBook(updatedBook) {

        const index =
            this.books.findIndex(
                book => book.id === updatedBook.id
            );


        if (index === -1) {

            return;

        }


        this.books[index] =
            updatedBook;


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

        this.books.sort(
            compareFunction
        );

        this.currentPage = 1;

        this.render();

    }


    /*=========================================================
        FILTRE
    =========================================================*/

    filter(predicate) {

        return this.books.filter(
            predicate
        );

    }


    /*=========================================================
        RÉINITIALISATION
    =========================================================*/

    clear() {

        this.books = [];

        this.currentPage = 1;

        this.render();

    }


    /*=========================================================
        DESTRUCTION
    =========================================================*/

    destroy() {

        this.books = [];

        this.container.innerHTML = "";

    }

}