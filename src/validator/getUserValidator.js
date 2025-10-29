const { body } = require('express-validator');

const emailValidator = body('email')
    .trim()
    .normalizeEmail()
    .notEmpty()
    .isEmail()
    .withMessage('Must be a valid email address');

module.exports = emailValidator;