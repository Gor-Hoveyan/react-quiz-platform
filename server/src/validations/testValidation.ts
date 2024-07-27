import { body } from "express-validator";

export const createTestValidation = [
    body('name').isLength({min: 5, max: 60}),
    body('description').isLength({min: 10, max: 300}),
    body('score').isInt({min: 6}),
    body('questions').isArray({min: 2}),
    body('questions.*.question').isLength({min: 10, max: 200}),
    body('questions.*.answers').isArray({min: 4, max: 4}),
    body('questions.*.answers.*.answer').isLength({min: 2, max: 200}),
    body('questions.*.answers.*.points').isInt({min: 0, max: 3}),
    body('results').isArray({min: 2}),
    body('results.*.result').isLength({min: 10, max: 500}),
];