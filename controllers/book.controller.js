/*=========================================================

    LE CARNET DES GAGNANTS
    BOOK CONTROLLER

=========================================================*/

const BookModel = require("../models/BookModel");


/*=========================================================
    TOUS LES LIVRES
=========================================================*/

exports.getAll = (req, res) => {

    const userId = req.session.user.id;

    const books = BookModel.getAll(userId);

    res.json(books);

};


/*=========================================================
    UN LIVRE
=========================================================*/

exports.getOne = (req, res) => {

    const { id } = req.params;

    const userId = req.session.user.id;

    const book = BookModel.getById(id, userId);

    if (!book) {

        return res.status(404).json({

            error: "Livre introuvable."

        });

    }

    res.json(book);

};


/*=========================================================
    CREATION
=========================================================*/

exports.create = (req, res) => {

    const userId = req.session.user.id;
    const cover =
    req.file
        ? `/assets/images/books/${req.file.filename}`
        : null;

    const {

        title,
        subtitle,
        author,
        publisher,
        isbn,
        language,
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

    } = req.body;


    /*-----------------------------------------------------
        VALIDATION
    -----------------------------------------------------*/

    if (!title || !title.trim()) {

        return res.status(400).json({

            error: "Le titre du livre est obligatoire."

        });

    }


    const book = BookModel.create(

        {

            title: title.trim(),

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

        },

        userId

    );


    res.status(201).json(book);

};


/*=========================================================
    MODIFICATION
=========================================================*/

exports.update = (req, res) => {

    const { id } = req.params;

    const userId = req.session.user.id;

    const data = {
        ...req.body
    };

    if (req.file) {

    data.cover =
        `/assets/images/books/${req.file.filename}`;

    }

    const book = BookModel.update(
        id,
        data,
        userId
    );


    if (!book) {

        return res.status(404).json({

            error: "Livre introuvable."

        });

    }


    res.json(book);

};


/*=========================================================
    SUPPRESSION
=========================================================*/

exports.remove = (req, res) => {

    const { id } = req.params;

    const userId = req.session.user.id;


    const deleted = BookModel.delete(

        id,

        userId

    );


    if (!deleted) {

        return res.status(404).json({

            error: "Livre introuvable."

        });

    }


    res.json({

        message: "Livre supprimé."

    });

};