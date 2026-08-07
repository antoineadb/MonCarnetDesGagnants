/*=========================================================

    BOOK
    Modèle métier du Carnet de Lecture

=========================================================*/

export default class Book {

    constructor(data = {}) {

        /*=====================================================
            IDENTITÉ
        =====================================================*/

        this.id = data.id ?? null;

        this.title = data.title ?? "";

        this.subtitle = data.subtitle ?? "";

        this.author = data.author ?? "";

        this.publisher = data.publisher ?? "";

        this.isbn = data.isbn ?? "";

        this.language = data.language ?? "fr";

        this.cover = data.cover ?? "";

        this.category = data.category ?? "";

        /*=====================================================
            LECTURE
        =====================================================*/

        this.startDate = data.startDate ?? "";

        this.endDate = data.endDate ?? "";

        this.purchaseDate = data.purchaseDate ?? "";

        this.pages = data.pages ?? 0;

        this.status = data.status ?? "to-read";

        this.format = data.format ?? "paper";

        this.readCount = data.readCount ?? 1;

                /*=====================================================
            ÉVALUATION
        =====================================================*/

        this.rating = data.rating ?? 0;

        this.lifeImpact = data.lifeImpact ?? 0;

        this.lifeBook = data.lifeBook ?? false;

        /*=====================================================
            RÉFLEXIONS
        =====================================================*/

        this.summary = data.summary ?? "";

        this.whatILiked = data.whatILiked ?? "";

        this.whatIDidNotLike = data.whatIDidNotLike ?? "";

        this.whatILearned = data.whatILearned ?? "";

        this.beforeReading = data.beforeReading ?? "";

        this.afterReading = data.afterReading ?? "";

        this.whyThisBook = data.whyThisBook ?? "";

        /*=====================================================
            RELECTURE
        =====================================================*/

        this.reread = data.reread ?? "";
        /*=====================================================
            DATES TECHNIQUES
        =====================================================*/

        this.createdAt = data.createdAt ?? "";

        this.updatedAt = data.updatedAt ?? "";

    }

    /*=========================================================
        FABRICATION
    =========================================================*/

    static fromJSON(data = {}) {

        return new Book(data);

    }

    /*=========================================================
        EXPORT
    =========================================================*/

    toJSON() {

        return {

            ...this

        };

    }

        /*=========================================================
        COPIE
    =========================================================*/

    clone() {

        return new Book(this.toJSON());

    }

    /*=========================================================
        ÉTAT
    =========================================================*/

    isToRead() {

        return this.status === "to-read";

    }

    isReading() {

        return this.status === "reading";

    }

    isFinished() {

        return this.status === "finished";

    }

    isAbandoned() {

        return this.status === "abandoned";

    }

    /*=========================================================
        LIVRE DE VIE
    =========================================================*/

    isLifeBook() {

        return this.lifeBook;

    }
    /*=========================================================
        AFFICHAGE
    =========================================================*/

    getDisplayTitle() {

        if (this.subtitle) {

            return `${this.title} — ${this.subtitle}`;

        }

        return this.title;

    }

    getDisplayAuthor() {

        return this.author || "Auteur inconnu";

    }

    getDisplayPages() {

        if (!this.pages) {

            return "-";

        }

        return `${this.pages} pages`;

    }

    /*=========================================================
        LECTURE
    =========================================================*/

    getReadingDuration() {

        if (!this.startDate || !this.endDate) {

            return null;

        }

        const start = new Date(this.startDate);
        const end = new Date(this.endDate);

        const days = Math.ceil(
            (end - start) / (1000 * 60 * 60 * 24)
        );

        return days > 0 ? days : 1;

    }

}