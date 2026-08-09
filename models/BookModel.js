/*=========================================================

    LE CARNET DES GAGNANTS
    BOOK MODEL

    Accès aux livres dans SQLite

=========================================================*/

const db = require("../database/database");


class BookModel {

    /*=========================================================
        RECUPERER TOUS LES LIVRES D'UN UTILISATEUR
    =========================================================*/

    static getAll(userId) {

        return db.prepare(`

            SELECT *

            FROM books

            WHERE user_id = ?

            ORDER BY created_at DESC

        `).all(userId);

    }


    /*=========================================================
        RECUPERER UN LIVRE
    =========================================================*/

    static getById(id, userId) {

        return db.prepare(`

            SELECT *

            FROM books

            WHERE id = ?

            AND user_id = ?

        `).get(id, userId);

    }


    /*=========================================================
        CREER UN LIVRE
    =========================================================*/

    static create(data, userId) {

        const statement = db.prepare(`

            INSERT INTO books (

                user_id,

                title,
                subtitle,
                author,
                publisher,
                isbn,
                language,
                cover,
                category,

                start_date,
                end_date,
                purchase_date,

                pages,
                status,
                format,
                read_count,

                rating,
                life_impact,
                life_book,

                summary,
                what_i_liked,
                what_i_did_not_like,
                what_i_learned,
                before_reading,
                after_reading,
                why_this_book,
                reread

            )

            VALUES (

                ?,

                ?, ?, ?, ?, ?, ?, ?, ?,

                ?, ?, ?,

                ?, ?, ?, ?,

                ?, ?, ?,

                ?, ?, ?, ?, ?, ?, ?, ?

            )

        `);


        const result = statement.run(

            userId,

            data.title ?? "",
            data.subtitle ?? "",
            data.author ?? "",
            data.publisher ?? "",
            data.isbn ?? "",
            data.language ?? "fr",
            data.cover ?? "",
            data.category ?? "",

            data.start_date ?? "",
            data.end_date ?? "",
            data.purchase_date ?? "",

            data.pages ?? 0,
            data.status ?? "to-read",
            data.format ?? "paper",
            data.read_count ?? 1,

            data.rating ?? 0,
            data.life_impact ?? 0,
            data.life_book ? 1 : 0,

            data.summary ?? "",
            data.what_i_liked ?? "",
            data.what_i_did_not_like ?? "",
            data.what_i_learned ?? "",
            data.before_reading ?? "",
            data.after_reading ?? "",
            data.why_this_book ?? "",
            data.reread ?? ""

        );


        return this.getById(
            result.lastInsertRowid,
            userId
        );

    }


    /*=========================================================
        MODIFIER UN LIVRE
    =========================================================*/

    static update(id, data, userId) {

        const existing = this.getById(id, userId);

        if (!existing) {

            return null;

        }


        db.prepare(`

            UPDATE books

            SET

                title = ?,
                subtitle = ?,
                author = ?,
                publisher = ?,
                isbn = ?,
                language = ?,
                cover = ?,
                category = ?,

                start_date = ?,
                end_date = ?,
                purchase_date = ?,

                pages = ?,
                status = ?,
                format = ?,
                read_count = ?,

                rating = ?,
                life_impact = ?,
                life_book = ?,

                summary = ?,
                what_i_liked = ?,
                what_i_did_not_like = ?,
                what_i_learned = ?,
                before_reading = ?,
                after_reading = ?,
                why_this_book = ?,
                reread = ?,

                updated_at = CURRENT_TIMESTAMP

            WHERE id = ?

            AND user_id = ?

        `).run(

            data.title ?? existing.title,
            data.subtitle ?? existing.subtitle,
            data.author ?? existing.author,
            data.publisher ?? existing.publisher,
            data.isbn ?? existing.isbn,
            data.language ?? existing.language,
            data.cover ?? existing.cover,
            data.category ?? existing.category,

            data.start_date ?? existing.start_date,
            data.end_date ?? existing.end_date,
            data.purchase_date ?? existing.purchase_date,

            data.pages ?? existing.pages,
            data.status ?? existing.status,
            data.format ?? existing.format,
            data.read_count ?? existing.read_count,

            data.rating ?? existing.rating,
            data.life_impact ?? existing.life_impact,
            data.life_book !== undefined
                ? (data.life_book ? 1 : 0)
                : existing.life_book,

            data.summary ?? existing.summary,
            data.what_i_liked ?? existing.what_i_liked,
            data.what_i_did_not_like ?? existing.what_i_did_not_like,
            data.what_i_learned ?? existing.what_i_learned,
            data.before_reading ?? existing.before_reading,
            data.after_reading ?? existing.after_reading,
            data.why_this_book ?? existing.why_this_book,
            data.reread ?? existing.reread,

            id,
            userId

        );


        return this.getById(id, userId);

    }


    /*=========================================================
        SUPPRIMER UN LIVRE
    =========================================================*/

    static delete(id, userId) {

        const result = db.prepare(`

            DELETE FROM books

            WHERE id = ?

            AND user_id = ?

        `).run(id, userId);


        return result.changes > 0;

    }

}


module.exports = BookModel;