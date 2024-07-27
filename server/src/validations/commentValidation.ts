import { body } from "express-validator";

export const createCommentValidation = [
    body('comment').isLength({min: 3, max: 1000}),
];

export const updateCommentValidation = [
    body('newComment').isLength({min: 3, max: 1000}),
];

export const createAnswerValidation = [
    body('answer').isLength({min: 3, max: 1000}),
];

export const updateAnswerValidation = [
    body('newAnswer').isLength({min: 3, max: 1000}),
];