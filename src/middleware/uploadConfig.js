const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { id } = req.params;
        const uploadDir = path.join("uploads", "notes", id);

        fs.mkdir(uploadDir, { recursive: true });

        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const timestamp = Date.now();

        cb(null, `${timestamp}.pdf`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF allowed"));
        }
        cb(null, true);
    }
});

module.exports = upload;