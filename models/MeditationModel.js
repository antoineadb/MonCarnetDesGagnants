/*=========================================================

    LE CARNET DES GAGNANTS
    MEDITATION MODEL

    Accès aux pratiques de méditation et bien-être
    dans SQLite

=========================================================*/

const db = require("../database/database");


class MeditationModel {

    /*=========================================================
        TOUTES LES PRATIQUES D'UN UTILISATEUR
    =========================================================*/

    static getAll(userId) {

        return db.prepare(`

            SELECT
                m.*,
                t.name AS type_name,
                t.icon AS type_icon

            FROM meditations m

            JOIN meditation_types t
                ON m.type_id = t.id

            WHERE m.user_id = ?

            ORDER BY
                m.meditation_date DESC,
                m.meditation_time DESC,
                m.id DESC

        `).all(userId);

    }


    /*=========================================================
        UNE PRATIQUE
    =========================================================*/

    static getById(id, userId) {

        return db.prepare(`

            SELECT
                m.*,
                t.name AS type_name,
                t.icon AS type_icon

            FROM meditations m

            JOIN meditation_types t
                ON m.type_id = t.id

            WHERE m.id = ?

            AND m.user_id = ?

        `).get(id, userId);

    }


    /*=========================================================
        TYPES DE PRATIQUES ACTIFS
    =========================================================*/

    static getTypes() {

        return db.prepare(`

            SELECT
                id,
                name,
                icon

            FROM meditation_types

            WHERE active = 1

            ORDER BY name ASC

        `).all();

    }


    /*=========================================================
        CREER UNE PRATIQUE
    =========================================================*/

    static create(data, userId) {

        const statement = db.prepare(`

            INSERT INTO meditations (

                user_id,
                meditation_date,
                meditation_time,
                type_id,
                duration,
                notes

            )

            VALUES (

                ?,
                ?,
                ?,
                ?,
                ?,
                ?

            )

        `);


        const result = statement.run(

            userId,

            data.meditation_date ?? "",

            data.meditation_time ?? "",

            data.type_id,

            data.duration ?? 0,

            data.notes ?? ""

        );


        return this.getById(

            result.lastInsertRowid,

            userId

        );

    }


    /*=========================================================
        MODIFIER UNE PRATIQUE
    =========================================================*/

    static update(id, data, userId) {

        const existing =
            this.getById(id, userId);

        if (!existing) {

            return null;

        }


        db.prepare(`

            UPDATE meditations

            SET

                meditation_date = ?,
                meditation_time = ?,
                type_id = ?,
                duration = ?,
                notes = ?,

                updated_at = CURRENT_TIMESTAMP

            WHERE id = ?

            AND user_id = ?

        `).run(

            data.meditation_date ??
                existing.meditation_date,

            data.meditation_time ??
                existing.meditation_time,

            data.type_id ??
                existing.type_id,

            data.duration ??
                existing.duration,

            data.notes ??
                existing.notes,

            id,

            userId

        );


        return this.getById(

            id,

            userId

        );

    }


    /*=========================================================
        SUPPRIMER UNE PRATIQUE
    =========================================================*/

    static delete(id, userId) {

        const result = db.prepare(`

            DELETE FROM meditations

            WHERE id = ?

            AND user_id = ?

        `).run(

            id,

            userId

        );


        return result.changes > 0;

    }

}


module.exports = MeditationModel;