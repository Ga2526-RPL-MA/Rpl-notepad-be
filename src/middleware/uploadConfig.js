const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.memoryStorage();

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