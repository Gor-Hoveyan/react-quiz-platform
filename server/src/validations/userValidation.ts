import { body } from "express-validator";

export const registrationValidation = [
    body('email').isEmail(),
    body('username').isLength({min: 3, max: 24}),
    body('password').isLength({min: 8, max: 64}),
];

export const updateUserValidation = [
    body('username').isLength({min: 3, max: 24}),
];

export const setAvatarValidation = [
    body('avatarUrl').isURL(),
];