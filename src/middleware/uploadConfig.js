const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { noteId } = req.body;
        const uploadDir = path.join(__dirname, "../uploads/notes", noteId.toString());

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || ".pdf";
        const filename = `${Date.now()}${ext}`;

        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = [
        'application/pdf',
        'application/octet-stream'
    ]

    if (!allowed.includes(file.mimetype)) {
        return cb(new Error('Only PDF files are allowed'), false);
    }
    cb(null, true);
};

const limits = {
    fileSize: 10 * 1024 * 1024 // 10 MB
};

const upload = multer({
    storage,
    fileFilter,
    limits
});

module.exports = upload;