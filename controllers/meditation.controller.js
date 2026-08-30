/*=========================================================

    LE CARNET DES GAGNANTS
    MEDITATION CONTROLLER

    Module Méditations & Bien-être

=========================================================*/

const MeditationModel =
    require("../models/MeditationModel");


/*=========================================================
    TOUTES LES PRATIQUES
=========================================================*/

exports.getAll = (req, res) => {

    const userId =
        req.session.user.id;

    const meditations =
        MeditationModel.getAll(userId);

    res.json(meditations);

};


/*=========================================================
    UNE PRATIQUE
=========================================================*/

exports.getOne = (req, res) => {

    const { id } = req.params;

    const userId =
        req.session.user.id;

    const meditation =
        MeditationModel.getById(
            id,
            userId
        );

    if (!meditation) {

        return res.status(404).json({

            error:
                "Pratique introuvable."

        });

    }

    res.json(meditation);

};


/*=========================================================
    TYPES DE PRATIQUES
=========================================================*/

exports.getTypes = (req, res) => {

    const types =
        MeditationModel.getTypes();

    res.json(types);

};


/*=========================================================
    CREATION
=========================================================*/

exports.create = (req, res) => {

    const userId =
        req.session.user.id;

    const {

        meditation_date,
        meditation_time,
        type_id,
        duration,
        notes

    } = req.body;


    /*-----------------------------------------------------
        VALIDATION
    -----------------------------------------------------*/

    if (!meditation_date) {

        return res.status(400).json({

            error:
                "La date est obligatoire."

        });

    }


    if (!type_id) {

        return res.status(400).json({

            error:
                "Le type de pratique est obligatoire."

        });

    }


    const meditation =
        MeditationModel.create(

            {

                meditation_date,

                meditation_time,

                type_id,

                duration,

                notes

            },

            userId

        );


    res.status(201).json(meditation);

};


/*=========================================================
    MODIFICATION
=========================================================*/

exports.update = (req, res) => {

    const { id } =
        req.params;

    const userId =
        req.session.user.id;

    const data = {
        ...req.body
    };


    const meditation =
        MeditationModel.update(

            id,

            data,

            userId

        );


    if (!meditation) {

        return res.status(404).json({

            error:
                "Pratique introuvable."

        });

    }


    res.json(meditation);

};


/*=========================================================
    SUPPRESSION
=========================================================*/

exports.remove = (req, res) => {

    const { id } =
        req.params;

    const userId =
        req.session.user.id;


    const deleted =
        MeditationModel.delete(

            id,

            userId

        );


    if (!deleted) {

        return res.status(404).json({

            error:
                "Pratique introuvable."

        });

    }


    res.json({

        message:
            "Pratique supprimée."

    });

};