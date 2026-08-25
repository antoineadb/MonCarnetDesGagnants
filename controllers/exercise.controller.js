/*=========================================================

    LE CARNET DES GAGNANTS
    EXERCISE CONTROLLER

    Le Stade des Gagnants

=========================================================*/

const ExerciseModel =
    require("../models/ExerciseModel");


/*=========================================================
    TOUS LES EXERCICES
=========================================================*/

exports.getAll = (req, res) => {

    const userId =
        req.session.user.id;

    const exercises =
        ExerciseModel.getAll(userId);

    res.json(exercises);

};


/*=========================================================
    UN EXERCICE
=========================================================*/

exports.getOne = (req, res) => {

    const { id } = req.params;

    const userId =
        req.session.user.id;

    const exercise =
        ExerciseModel.getById(
            id,
            userId
        );

    if (!exercise) {

        return res.status(404).json({

            error: "Exercice introuvable."

        });

    }

    res.json(exercise);

};


/*=========================================================
    CREATION
=========================================================*/

exports.create = (req, res) => {

    const userId =
        req.session.user.id;

    const {

        exercise_date,
        exercise_time,
        exercise_type,
        duration,
        distance,
        notes

    } = req.body;


    /*-----------------------------------------------------
        VALIDATION
    -----------------------------------------------------*/

    if (
        !exercise_date ||
        !exercise_type ||
        !exercise_type.trim()
    ) {

        return res.status(400).json({

            error:
                "La date et le type d'exercice sont obligatoires."

        });

    }


    const exercise =
        ExerciseModel.create(

            {

                exercise_date,

                exercise_time,

                exercise_type:
                    exercise_type.trim(),

                duration,

                distance,

                notes

            },

            userId

        );


    res.status(201).json(exercise);

};


/*=========================================================
    MODIFICATION
=========================================================*/

exports.update = (req, res) => {

    const { id } = req.params;

    const userId =
        req.session.user.id;

    const data = {
        ...req.body
    };


    const exercise =
        ExerciseModel.update(

            id,

            data,

            userId

        );


    if (!exercise) {

        return res.status(404).json({

            error:
                "Exercice introuvable."

        });

    }


    res.json(exercise);

};


/*=========================================================
    SUPPRESSION
=========================================================*/

exports.remove = (req, res) => {

    const { id } = req.params;

    const userId =
        req.session.user.id;


    const deleted =
        ExerciseModel.delete(

            id,

            userId

        );


    if (!deleted) {

        return res.status(404).json({

            error:
                "Exercice introuvable."

        });

    }


    res.json({

        message:
            "Exercice supprimé."

    });

};