import { body } from "express-validator";

export const registrationValidation = [
    body('email').isEmail().withMessage('Entered invalid email'),
    body('username').isLength({min: 3, max: 24}).withMessage('Username must contain at least 3 and maximum 24 symbols'),
    body('password').isLength({min: 8, max: 64}).withMessage('Password must contain at least 8 and maximum 64 symbols'),
];

export const updateUserValidation = [
    body('username').isLength({min: 3, max: 24}).withMessage('Username must contain at least 3 and maximum 24 symbols'),
];

export const setAvatarValidation = [
    body('avatarUrl').isURL().withMessage('Entered invalid URL'),
];