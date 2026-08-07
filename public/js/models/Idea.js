/*=========================================================

    LE CARNET DES GAGNANTS
    IDEA

    Idée retenue d'un livre

=========================================================*/

export default class Idea {

    constructor(data = {}) {

        /*=====================================================
            IDENTITÉ
        =====================================================*/

        this.id = data.id ?? null;

        this.bookId = data.bookId ?? null;

        /*=====================================================
            CONTENU
        =====================================================*/

        this.title = data.title ?? "";

        this.description = data.description ?? "";

        this.category = data.category ?? "";

        /*=====================================================
            APPLICATION
        =====================================================*/

        this.importance = data.importance ?? 3;

        this.applied = data.applied ?? false;

        this.applicationDate = data.applicationDate ?? "";

        this.result = data.result ?? "";

        /*=====================================================
            DATES
        =====================================================*/

        this.createdAt = data.createdAt ?? "";

        this.updatedAt = data.updatedAt ?? "";

    }

    /*=========================================================
        FABRICATION
    =========================================================*/

    static fromJSON(data = {}) {

        return new Idea(data);

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

        return new Idea(this.toJSON());

    }

    /*=========================================================
        ÉTAT
    =========================================================*/

    isApplied() {

        return this.applied;

    }

    /*=========================================================
        IMPORTANCE
    =========================================================*/

    isImportant() {

        return this.importance >= 4;

    }

}