/*=========================================================

    LE CARNET DES GAGNANTS
    Carnet de Lecture

=========================================================*/

import Book from "./models/Book.js";

import Bookshelf from "../components/Bookshelf/Bookshelf.js";

class Lecture {

    constructor() {

        this.books = [];

        this.bookshelf = null;

        this.lifeBookshelf = null;

    }

    /*=========================================================
        INITIALISATION
    =========================================================*/

    init() {

        this.cacheElements();

        this.createBookshelves();

        this.loadDemoBooks();

        this.render();

    }

    /*=========================================================
        ELEMENTS
    =========================================================*/

    cacheElements() {

        this.bookshelfContainer =
            document.getElementById("bookshelf");

        this.lifeBooksContainer =
            document.getElementById("lifeBooks");

    }

    /*=========================================================
        COMPOSANTS
    =========================================================*/

    createBookshelves() {

        this.bookshelf =
            new Bookshelf(this.bookshelfContainer);

        this.lifeBookshelf =
            new Bookshelf(this.lifeBooksContainer);

    }

    /*=========================================================
        DEMO
    =========================================================*/

    loadDemoBooks() {

        this.books = [

            new Book({

                id:1,

                title:"Atomic Habits",

                author:"James Clear",

                cover:"/assets/images/books/atomic-habits.jpg",

                rating:5,

                lifeBook:true,

                status:"finished",

                pages:320

            }),

            new Book({

                id:2,

                title:"Le Pouvoir du Moment Présent",

                author:"Eckhart Tolle",

                cover:"/assets/images/books/pouvoir-present.jpg",

                rating:5,

                lifeBook:true,

                status:"finished",

                pages:256

            }),

            new Book({

                id:3,

                title:"Les Quatre Accords Toltèques",

                author:"Don Miguel Ruiz",

                cover:"/assets/images/books/quatre-accords.jpg",

                rating:4,

                lifeBook:false,

                status:"finished",

                pages:160

            })

        ];

    }

    /*=========================================================
        AFFICHAGE
    =========================================================*/

    render() {

        this.bookshelf.setBooks(this.books);

        this.lifeBookshelf.setBooks(

            this.books.filter(

                book => book.isLifeBook()

            )

        );

    }

}

/*=========================================================
    DEMARRAGE
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        const lecture = new Lecture();

        lecture.init();

    }

);
