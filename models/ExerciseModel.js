/*=========================================================

    LE CARNET DES GAGNANTS
    EXERCISE MODEL

    Accès aux exercices physiques dans SQLite

=========================================================*/

const db = require("../database/database");


class ExerciseModel {

    /*=========================================================
        TOUS LES EXERCICES D'UN UTILISATEUR
    =========================================================*/

    static getAll(userId) {

        return db.prepare(`

            SELECT *

            FROM exercises

            WHERE user_id = ?

            ORDER BY
                exercise_date DESC,
                exercise_time DESC,
                id DESC

        `).all(userId);

    }


    /*=========================================================
        UN EXERCICE
    =========================================================*/

    static getById(id, userId) {

        return db.prepare(`

            SELECT *

            FROM exercises

            WHERE id = ?

            AND user_id = ?

        `).get(id, userId);

    }


    /*=========================================================
        CREER UN EXERCICE
    =========================================================*/

    static create(data, userId) {

        const statement = db.prepare(`

            INSERT INTO exercises (

                user_id,
                exercise_date,
                exercise_time,
                exercise_type,
                duration,
                distance,
                notes

            )

            VALUES (

                ?,
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

            data.exercise_date ?? "",

            data.exercise_time ?? "",

            data.exercise_type ?? "",

            data.duration ?? 0,

            data.distance ?? 0,

            data.notes ?? ""

        );


        return this.getById(

            result.lastInsertRowid,

            userId

        );

    }


    /*=========================================================
        MODIFIER UN EXERCICE
    =========================================================*/

    static update(id, data, userId) {

        const existing = this.getById(id, userId);

        if (!existing) {

            return null;

        }


        db.prepare(`

            UPDATE exercises

            SET

                exercise_date = ?,
                exercise_time = ?,
                exercise_type = ?,
                duration = ?,
                distance = ?,
                notes = ?,

                updated_at = CURRENT_TIMESTAMP

            WHERE id = ?

            AND user_id = ?

        `).run(

            data.exercise_date ?? existing.exercise_date,

            data.exercise_time ?? existing.exercise_time,

            data.exercise_type ?? existing.exercise_type,

            data.duration ?? existing.duration,

            data.distance ?? existing.distance,

            data.notes ?? existing.notes,

            id,

            userId

        );


        return this.getById(id, userId);

    }


    /*=========================================================
        SUPPRIMER UN EXERCICE
    =========================================================*/

    static delete(id, userId) {

        const result = db.prepare(`

            DELETE FROM exercises

            WHERE id = ?

            AND user_id = ?

        `).run(

            id,

            userId

        );


        return result.changes > 0;

    }

}


module.exports = ExerciseModel;