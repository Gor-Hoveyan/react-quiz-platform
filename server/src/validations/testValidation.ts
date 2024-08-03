import { body } from "express-validator";

export const createTestValidation = [
    body('name').isLength({ min: 5, max: 60 }).withMessage('Name must contain at least 5 and maximum 60 symbols'),
    body('description').isLength({ min: 10, max: 300 }).withMessage('Description must contain at least 10 and maximum 300 symbols'),
    body('score').isInt({ min: 6 }).withMessage('Total score must be 6 or higher'),
    body('questions').isArray({ min: 2 }).withMessage('Test must contain at least 2 questions'),
    body('questions.*.question').isLength({ min: 10, max: 200 }).withMessage('Question must contain at least 10 and maximum 200 symbols'),
    body('questions.*.answers').isArray({ min: 4, max: 4 }).withMessage('Question must contain at least 4 answers'),
    body('questions.*.answers.*.answer').isLength({ min: 2, max: 200 }).withMessage('Answer must contain at least 2 and maximum 200 symbols'),
    body('questions.*.answers.*.points').isInt({ min: 0, max: 3 }).withMessage('Number of points for an answer must be from 0 to 3'),
    body('results').isArray({ min: 2 }).withMessage('Test must contain at least 2 results'),
    body('results.*.result').isLength({ min: 10, max: 500 }).withMessage('Answer must contain at least 10 and maximum 500 symbols'),
];