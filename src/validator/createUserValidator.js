const { body } = require('express-validator');

const emailValidator = body('email')
    .trim()
    .normalizeEmail()
    .notEmpty()
    .isEmail()
    .withMessage('Must be a valid email address');

const passwordValidator = body('password')
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number')

const nrpValidator = body('nrp')
    .notEmpty()
    .isInt()
    .withMessage('NRP must be a number')
    .matches(/^5053/)
    .withMessage('NRP must start with 5053')
    .isLength({ min: 10, max: 10 })
    .withMessage('NRP must be exactly 10 characters long');

const createUserValidator = [
    emailValidator,
    passwordValidator,
    nrpValidator
];

module.exports = { createUserValidator };