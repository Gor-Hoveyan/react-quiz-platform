import { body } from "express-validator";

export const createCommentValidation = [
    body('comment').isLength({min: 3, max: 1000}).withMessage('Comment must contain at least 3 and maximum 1000 symbols'),
];

export const updateCommentValidation = [
    body('newComment').isLength({min: 3, max: 1000}).withMessage('Comment must contain at least 3 and maximum 1000 symbols'),
];

export const createAnswerValidation = [
    body('answer').isLength({min: 3, max: 1000}).withMessage('Answer must contain at least 3 and maximum 1000 symbols'),
];

export const updateAnswerValidation = [
    body('newAnswer').isLength({min: 3, max: 1000}).withMessage('Answer must contain at least 3 and maximum 1000 symbols'),
];