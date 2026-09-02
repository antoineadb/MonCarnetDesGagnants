const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        const uploadDir =
            process.env.ANAL_UPLOAD_DIR ||
            path.join(process.cwd(), "public/uploads/anals");

        fs.mkdirSync(uploadDir, {
            recursive: true
        });

        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname).toLowerCase();

        const name =
            `anal-${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

        cb(null, name);
    }

});


const upload = multer({

    storage,

    limits: {
        fileSize: 20 * 1024 * 1024
    }

});

module.exports = upload;
