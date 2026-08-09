const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        const uploadDir = "/var/data/profile";

        fs.mkdirSync(
            uploadDir,
            {
                recursive: true
            }
        );

        cb(null, uploadDir);

    },

    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname).toLowerCase();

        const name =
            `profile-${req.session.user.id}${extension}`;

        cb(null, name);

    }

});


const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Format d'image non autorisé. Utilisez JPG, PNG ou WebP."
            )
        );

    }

};


const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});


module.exports = upload;