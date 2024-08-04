import { body } from "express-validator";

export const createQuizValidation = [
    body('name').isLength({min: 5, max: 60}).withMessage('Name must contain at least 5 and maximum 60 symbols'),
    body('description').isLength({min: 10, max: 300}).withMessage('Description must contain at least 10 and maximum 300 symbols'),
    body('questions').isArray({min: 2}).withMessage('Quiz must contain at least 2 questions'),
    body('questions.*.question').isLength({min: 10, max: 200}).withMessage('Question must contain at least 10 and maximum 200 symbols'),
    body('questions.*.answers').isArray({min: 4, max: 4}).withMessage('Question must contain 4 answers'),
    body('questions.*.answers.*.answer').isLength({min: 2, max: 200}).withMessage('Answer must contain at least 2 and maximum 200 symbols'),
    body('questions.*.rightAnswer.answer').isInt({min: 0, max: 3}).withMessage('Selected invalid right answer'),
];