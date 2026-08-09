/*=========================================================

    LE CARNET DES GAGNANTS
    CARNET DE LECTURE

=========================================================*/

import Book from "./models/Book.js";

import Bookshelf from "../components/Bookshelf/Bookshelf.js";

import EventBus from "./core/EventBus.js";

class Lecture {

    constructor() {

        this.books = [];

        this.bookshelf = null;

        this.lifeBookshelf = null;

    }


    /*=========================================================
        INITIALISATION
    =========================================================*/

    async init() {

        this.cacheElements();

        this.bindEvents();

        this.createBookshelves();

        await this.loadBooks();

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

        this.newBookButton =
            document.getElementById("newBookButton");
        
        this.newBookForm =
            document.getElementById("newBookForm");
        
        this.bookFormTitle =
            document.getElementById("bookFormTitle");

        this.bookDetailModal =
            document.getElementById("bookDetailModal");

        this.closeBookDetail =
            document.getElementById("closeBookDetail");

        this.bookDetailCover =
            document.getElementById("bookDetailCover");

        this.bookDetailTitle =
            document.getElementById("bookDetailTitle");

        this.bookDetailAuthor =
            document.getElementById("bookDetailAuthor");

        this.bookDetailStatus =
            document.getElementById("bookDetailStatus");

        this.bookDetailPages =
            document.getElementById("bookDetailPages");

        this.bookDetailRating =
            document.getElementById("bookDetailRating");

        this.bookDetailLifeBook =
            document.getElementById("bookDetailLifeBook");

        this.editBookButton =
            document.getElementById("editBookButton");

        this.deleteBookButton =
            document.getElementById("deleteBookButton");

        this.cancelNewBook =
            document.getElementById("cancelNewBook");

        this.saveNewBook =
            document.getElementById("saveNewBook");

    }


    /*=========================================================
        EVENEMENTS
    =========================================================*/

    bindEvents() {

        this.newBookButton.addEventListener(
            "click",
            () => {

                this.currentBook = null;

                this.newBookForm.hidden = false;

                this.newBookButton.hidden = true;

                this.bookFormTitle.textContent =
                    "📖 Ajouter un livre";

                this.saveNewBook.textContent =
                    "📖 Ajouter le livre";

                this.newBookForm.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

        EventBus.on(
                "book.open",
                (book) => {

                    this.openBookDetail(book);

                }
            );


            this.closeBookDetail.addEventListener(
                "click",
                () => {

                    this.closeBookDetailModal();

                }
            );

            this.editBookButton.addEventListener(
                "click",
                () => {

                    this.editCurrentBook();

                }
            );

            this.deleteBookButton.addEventListener(
                "click",
                () => {

                    this.deleteCurrentBook();

                }
            );

            this.bookDetailModal.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target ===
                        this.bookDetailModal
                    ) {

                        this.closeBookDetailModal();

                    }

                }
            );

        this.cancelNewBook.addEventListener(
            "click",
            () => {

                this.closeNewBookForm();

            }
        );


        this.saveNewBook.addEventListener(
            "click",
            () => {

                this.createBook();

            }
        );

    }

    editCurrentBook() {

         const book = this.currentBook;

        if (!book) {
            return;
        }


        // Fermer la fenêtre de détail
        this.bookDetailModal.hidden = true;


        // Ouvrir le formulaire
        this.newBookForm.hidden = false;

        this.newBookButton.hidden = true;

        this.newBookForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        // Mode modification
        this.bookFormTitle.textContent =
            "✏️ Modifier le livre";

        this.saveNewBook.textContent =
            "💾 Enregistrer les modifications";

        // Fermer la fenêtre de détail
        this.bookDetailModal.hidden = true;

        // Remplir le formulaire
        document.getElementById("bookTitle").value =
            book.title || "";

        document.getElementById("bookAuthor").value =
            book.author || "";

        document.getElementById("bookCategory").value =
            book.category || "";

        document.getElementById("bookFormat").value =
            book.format || "paper";

        document.getElementById("bookStartDate").value =
            book.start_date || "";

        document.getElementById("bookEndDate").value =
            book.end_date || "";

        document.getElementById("bookPages").value =
            book.pages || 0;

        document.getElementById("bookStatus").value =
            book.status || "to-read";

        document.getElementById("bookRating").value =
            book.rating || 0;

        document.getElementById("bookLifeBook").checked =
            Number(book.life_book) === 1;

        document.getElementById("bookReadCount").value =
            book.read_count || 0;

        document.getElementById("bookLifeImpact").value =
            book.life_impact || 0;

    }

    async deleteCurrentBook() {

        const book = this.currentBook;

        if (!book) {
            return;
        }


        const ok = await Confirm.show({
            icon: "⚠️",
            title: "Supprimer ce livre",
            message: `Voulez-vous vraiment supprimer « ${book.getDisplayTitle()} » ?`,
            confirmText: "Supprimer",
            cancelText: "Annuler"
        });


        if (!ok) {
            return;
        }


        try {

            const response = await fetch(
                `/api/books/${book.id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    `Erreur API : ${response.status}`
                );

            }


            console.log(
                "🗑️ Livre supprimé :",
                data
            );


            // Recharger les livres depuis SQLite
            await this.loadBooks();

            // Réafficher la bibliothèque
            this.render();

            // Fermer la fenêtre de détail
            this.closeBookDetailModal();

        }

        catch (error) {

            console.error(
                "❌ Impossible de supprimer le livre :",
                error
            );

            alert(
                `Impossible de supprimer le livre.\n\n${error.message}`
            );

        }

    }

    openBookDetail(book) {

        this.currentBook = book;

        this.bookDetailCover.src =
            book.cover ||
            "/assets/images/books/default-cover.svg";

        this.bookDetailCover.alt =
            book.getDisplayTitle();

        this.bookDetailTitle.textContent =
            book.getDisplayTitle();

        this.bookDetailAuthor.textContent =
            book.getDisplayAuthor();

        this.bookDetailStatus.textContent =
            this.getStatusLabel(book.status);

        this.bookDetailPages.textContent =
            book.pages || 0;

        this.bookDetailRating.textContent =
            book.rating > 0
                ? "⭐".repeat(book.rating)
                : "Aucune note";

        this.bookDetailLifeBook.textContent =
            book.isLifeBook()
                ? "Oui ❤️"
                : "Non";

        this.bookDetailModal.hidden = false;
    }

    closeBookDetailModal() {

        this.bookDetailModal.hidden = true;

        this.currentBook = null;

    }

    getStatusLabel(status) {

        const labels = {

            "to-read": "À lire",

            "reading": "En cours de lecture",

            "finished": "Terminé",

            "abandoned": "Abandonné"

        };

        return labels[status] || status || "—";

    }
    /*=========================================================
        FERMER LE FORMULAIRE
    =========================================================*/

    closeNewBookForm() {

        this.newBookForm.hidden = true;

        this.newBookButton.hidden = false;

    }


    /*=========================================================
        CREER UN LIVRE
    =========================================================*/

    async createBook() {

        const title =
            document.getElementById("bookTitle").value.trim();

        const author =
            document.getElementById("bookAuthor").value.trim();
                
        const coverInput =
            document.getElementById("bookCover");

        const pages =
            Number( document.getElementById("bookPages").value ) || 0;

        const readCount =
            Number( document.getElementById("bookReadCount").value ) || 0;
    
        const lifeImpact =
            Number( document.getElementById("bookLifeImpact").value ) || 0;

        const status =
            document.getElementById("bookStatus").value;

        const rating =
            Number( document.getElementById("bookRating").value ) || 0;

        const lifeBook =
            document.getElementById("bookLifeBook").checked;

        const category =
            document.getElementById("bookCategory").value.trim();
        
        const format =
            document.getElementById("bookFormat").value;

        const startDate =
            document.getElementById("bookStartDate").value;

        const endDate =
            document.getElementById("bookEndDate").value;
        
        const summary =
            document.getElementById("bookSummary").value.trim();

        const whatILiked =
            document.getElementById("bookWhatILiked").value.trim();

        const whatIDidNotLike =
            document.getElementById("bookWhatIDidNotLike").value.trim();
        
        const whatILearned =
            document.getElementById("bookWhatILearned").value.trim();

        const beforeReading =
            document.getElementById("bookBeforeReading").value.trim();

        const afterReading =
            document.getElementById("bookAfterReading").value.trim();
        
        const whyThisBook =
            document.getElementById("bookWhyThisBook").value.trim();

        const reread =
            document.getElementById("bookReread").value;
            
        /*-----------------------------------------------------
            VALIDATION
        -----------------------------------------------------*/

        if (!title) {

            alert("Le titre du livre est obligatoire.");

            return;

        }


        /*-----------------------------------------------------
            DONNEES
        -----------------------------------------------------*/

       const bookData = {

            title,

            author,

            category,

            pages,

            read_count: readCount,

            format,

            start_date: startDate,

            end_date: endDate,

            status,

            rating,

            life_impact: lifeImpact,

            life_book: lifeBook,

            summary: summary,

            what_i_liked: whatILiked,

            what_i_did_not_like: whatIDidNotLike,
            
            what_i_learned: whatILearned,
           
            before_reading: beforeReading,

            after_reading: afterReading,

            why_this_book: whyThisBook,

            reread: reread

        };

        const formData = new FormData();

        Object.entries(bookData).forEach(
            ([key, value]) => {

                formData.append(
                    key,
                    value ?? ""
                );

            }
        );
 
        if (coverInput.files.length > 0) {

            formData.append(
                "cover",
                coverInput.files[0]
            );

        }

        try {

        const isEditing = !!this.currentBook;

        const url = isEditing
            ? `/api/books/${this.currentBook.id}`
            : "/api/books";

        const method = isEditing
            ? "PUT"
            : "POST";


        const response = await fetch(
            url,
            {

                method: method,

                credentials: "include",

                body:
                    formData
            }
        );


            const data =
                await response.json();


            /*-------------------------------------------------
                ERREUR API
            -------------------------------------------------*/

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    `Erreur API : ${response.status}`
                );

            }


            console.log(
                "📚 Livre créé :",
                data
            );


            /*-------------------------------------------------
                RECHARGER LES LIVRES
            -------------------------------------------------*/

            await this.loadBooks();

            this.render();


            /*-------------------------------------------------
                FERMER LE FORMULAIRE
            -------------------------------------------------*/

            this.resetNewBookForm();

            this.currentBook = null;

            this.bookFormTitle.textContent =
                "📖 Ajouter un livre";

            this.saveNewBook.textContent =
                "📖 Ajouter le livre";

            this.closeNewBookForm();


        }

        catch (error) {

            console.error(
                "❌ Impossible de créer le livre :",
                error
            );

            alert(
                `Impossible d'ajouter le livre.\n\n${error.message}`
            );

        }

    }


    /*=========================================================
        RESET FORMULAIRE
    =========================================================*/

    resetNewBookForm() {

        document.getElementById("bookTitle").value = "";

        document.getElementById("bookAuthor").value = "";

        document.getElementById("bookCover").value = "";

        document.getElementById("bookPages").value = "";

        document.getElementById("bookReadCount").value = "0";

        document.getElementById("bookStatus").value = "to-read";

        document.getElementById("bookRating").value = "0";

        document.getElementById("bookLifeBook").checked = false;
            
        document.getElementById("bookCategory").value = "";

        document.getElementById("bookFormat").value = "paper";

        document.getElementById("bookStartDate").value = "";

        document.getElementById("bookEndDate").value = "";

        document.getElementById("bookLifeImpact").value = "0";

        document.getElementById("bookSummary").value = "";

        document.getElementById("bookWhatILiked").value = "";

        document.getElementById("bookWhatIDidNotLike").value = "";

        document.getElementById("bookWhatILearned").value = "";

        document.getElementById("bookBeforeReading").value = "";

        document.getElementById("bookAfterReading").value = "";

        document.getElementById("bookWhyThisBook").value = "";

        document.getElementById("bookReread").value = "";

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
        CHARGEMENT DES LIVRES
    =========================================================*/

    async loadBooks() {

        try {

            const response = await fetch(
                "/api/books",
                {
                    method: "GET",
                    credentials: "include"
                }
            );


            if (!response.ok) {

                throw new Error(
                    `Erreur API : ${response.status}`
                );

            }


            const data =
                await response.json();


            /*-------------------------------------------------
                CONVERSION SQLite → Book.js
            -------------------------------------------------*/

            this.books = data.map(
                row => this.mapDatabaseBook(row)
            );


            console.log(
                "📚 Livres chargés depuis SQLite :",
                this.books
            );

        }

        catch (error) {

            console.error(
                "❌ Impossible de charger les livres :",
                error
            );

            this.books = [];

        }

    }


    /*=========================================================
        CONVERSION SQLITE → BOOK
    =========================================================*/

    mapDatabaseBook(row) {

        return new Book({

            id: row.id,

            title: row.title,

            subtitle: row.subtitle,

            author: row.author,

            publisher: row.publisher,

            isbn: row.isbn,

            language: row.language,

            cover: row.cover,

            category: row.category,


            /*-----------------------------------------------
                LECTURE
            -----------------------------------------------*/

            startDate: row.start_date,

            endDate: row.end_date,

            purchaseDate: row.purchase_date,

            pages: row.pages,

            status: row.status,

            format: row.format,

            readCount: row.read_count,


            /*-----------------------------------------------
                EVALUATION
            -----------------------------------------------*/

            rating: row.rating,

            lifeImpact: row.life_impact,

            lifeBook: Boolean(row.life_book),


            /*-----------------------------------------------
                REFLEXIONS
            -----------------------------------------------*/

            summary: row.summary,

            whatILiked: row.what_i_liked,

            whatIDidNotLike: row.what_i_did_not_like,

            whatILearned: row.what_i_learned,

            beforeReading: row.before_reading,

            afterReading: row.after_reading,

            whyThisBook: row.why_this_book,


            /*-----------------------------------------------
                RELECTURE
            -----------------------------------------------*/

            reread: row.reread,


            /*-----------------------------------------------
                DATES TECHNIQUES
            -----------------------------------------------*/

            createdAt: row.created_at,

            updatedAt: row.updated_at

        });

    }


    /*=========================================================
        AFFICHAGE
    =========================================================*/

    render() {

        this.bookshelf.setBooks(
            this.books
        );


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

    async () => {

        const lecture = new Lecture();

        await lecture.init();

    }

);