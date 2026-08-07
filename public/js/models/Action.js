/*=========================================================

    LE CARNET DES GAGNANTS
    ACTION

    Action à mettre en pratique après une lecture

=========================================================*/

export default class Action {

    constructor(data = {}) {

        /*=====================================================
            IDENTITÉ
        =====================================================*/

        this.id = data.id ?? null;

        this.bookId = data.bookId ?? null;

        /*=====================================================
            ACTION
        =====================================================*/

        this.title = data.title ?? "";

        this.description = data.description ?? "";

        this.priority = data.priority ?? 3;

        /*=====================================================
            SUIVI
        =====================================================*/

        this.completed = data.completed ?? false;

        this.completedAt = data.completedAt ?? "";

        this.deadline = data.deadline ?? "";

        this.notes = data.notes ?? "";

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

        return new Action(data);

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

        return new Action(this.toJSON());

    }

    /*=========================================================
        ÉTAT
    =========================================================*/

    isCompleted() {

        return this.completed;

    }

    /*=========================================================
        PRIORITÉ
    =========================================================*/

    isHighPriority() {

        return this.priority >= 4;

    }

    /*=========================================================
        ACTION EN RETARD
    =========================================================*/

    isOverdue() {

        if (!this.deadline || this.completed) {

            return false;

        }

        return new Date(this.deadline) < new Date();

    }

}