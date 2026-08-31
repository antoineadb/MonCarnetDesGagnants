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
    CREER UN TYPE DE PRATIQUE
=========================================================*/

exports.createType = (req, res) => {

    const {
        name,
        icon
    } = req.body;

    if (!name || !name.trim()) {

        return res.status(400).json({
            error: "Le nom de la pratique est obligatoire."
        });

    }

    try {

        const result =
            MeditationModel.createType(
                name,
                icon || "🌿"
            );

        res.status(201).json({
            id: result.lastInsertRowid,
            name: name.trim(),
            icon: icon || "🌿"
        });

    } catch (error) {

        console.error(
            "Erreur création type :",
            error
        );

        if (
            error.code ===
            "SQLITE_CONSTRAINT_UNIQUE"
        ) {

            return res.status(409).json({
                error:
                    "Cette pratique existe déjà."
            });

        }

        res.status(500).json({
            error:
                "Impossible de créer la pratique."
        });

    }

};

/*=========================================================
    MODIFIER UN TYPE DE PRATIQUE
=========================================================*/

exports.updateType = (req, res) => {

    const { id } = req.params;

    const {
        name,
        icon
    } = req.body;

    if (!name || !name.trim()) {

        return res.status(400).json({
            error:
                "Le nom de la pratique est obligatoire."
        });

    }

    try {

        const result =
            MeditationModel.updateType(
                id,
                name,
                icon || "🌿"
            );

        if (result.changes === 0) {

            return res.status(404).json({
                error:
                    "Pratique introuvable."
            });

        }

        res.json({
            id: Number(id),
            name: name.trim(),
            icon: icon || "🌿"
        });

    } catch (error) {

        console.error(
            "Erreur modification type :",
            error
        );

        if (
            error.code ===
            "SQLITE_CONSTRAINT_UNIQUE"
        ) {

            return res.status(409).json({
                error:
                    "Cette pratique existe déjà."
            });

        }

        res.status(500).json({
            error:
                "Impossible de modifier la pratique."
        });

    }

};


/*=========================================================
    SUPPRIMER UN TYPE DE PRATIQUE
=========================================================*/

exports.deleteType = (req, res) => {

    const { id } = req.params;

    try {

        const result =
            MeditationModel.deleteType(id);

        if (result.changes === 0) {

            return res.status(404).json({
                error:
                    "Pratique introuvable."
            });

        }

        res.json({
            message:
                "Pratique supprimée."
        });

    } catch (error) {

        console.error(
            "Erreur suppression type :",
            error
        );

        res.status(500).json({
            error:
                "Impossible de supprimer la pratique."
        });

    }

};

/*=========================================================
    MODIFIER UN TYPE DE PRATIQUE
=========================================================*/

exports.updateType = (req, res) => {

    const { id } = req.params;

    const {
        name,
        icon
    } = req.body;

    if (!name || !name.trim()) {

        return res.status(400).json({
            error:
                "Le nom de la pratique est obligatoire."
        });

    }

    try {

        const result =
            MeditationModel.updateType(
                id,
                name,
                icon || "🌿"
            );

        if (result.changes === 0) {

            return res.status(404).json({
                error:
                    "Pratique introuvable."
            });

        }

        res.json({
            id: Number(id),
            name: name.trim(),
            icon: icon || "🌿"
        });

    } catch (error) {

        console.error(
            "Erreur modification type :",
            error
        );

        if (
            error.code ===
            "SQLITE_CONSTRAINT_UNIQUE"
        ) {

            return res.status(409).json({
                error:
                    "Cette pratique existe déjà."
            });

        }

        res.status(500).json({
            error:
                "Impossible de modifier la pratique."
        });

    }

};


/*=========================================================
    SUPPRIMER UN TYPE DE PRATIQUE
=========================================================*/

exports.deleteType = (req, res) => {

    const { id } = req.params;

    try {

        const result =
            MeditationModel.deleteType(id);

        if (result.changes === 0) {

            return res.status(404).json({
                error:
                    "Pratique introuvable."
            });

        }

        res.json({
            success: true
        });

    } catch (error) {

        console.error(
            "Erreur suppression type :",
            error
        );

        res.status(500).json({
            error:
                "Impossible de supprimer la pratique."
        });

    }

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