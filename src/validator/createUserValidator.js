const { body } = require('express-validator');

const emailValidator = body('email')
    .trim()
    .normalizeEmail()
    .notEmpty()
    .isEmail()
    .withMessage('Must be a valid email address');

const passwordValidator = body('password')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long');

const nrpValidator = body('nrp')
    .notEmpty()
    .isInt()
    .withMessage('NRP must be a number')
    .isLength({ min: 10, max: 10 })
    .withMessage('NRP must be exactly 10 characters long');

const createUserValidator = [
    emailValidator,
    passwordValidator,
    nrpValidator
];

module.exports = { createUserValidator };