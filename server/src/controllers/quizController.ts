import { Request, Response, NextFunction } from 'express';
import { quizService } from '../services/quizService';

async function createQuiz(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description, questions } = req.body;

        const quiz = await quizService.create(name, description, req.user.id, questions);
        return res.status(200).json({ id: quiz._id });
    } catch (err) {
        next(err);
    }
}

async function deleteQuiz(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        await quizService.remove(id, req.user.id);
        return res.status(200).json({ message: 'Success' });
    } catch (err) {
        next(err);
    }
}

async function updateQuiz(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description, author, questions } = req.body;
        const { id } = req.params;
        if (author !== req.user.id) {
            res.status(403);
            throw new Error('Access denied');
        }
        if (!questions.length) {
            return res.status(404).json({ message: 'Questions can\'t be empty' })
        }
        const quiz = await quizService.update(req.user.id, id, name, description, author, questions);
        return res.status(200).json({ quiz });
    } catch (err) {
        next(err);
    }
}

async function getQuiz(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const quiz = await quizService.getOne(id);
        return res.status(200).json({ quiz });
    } catch (err) {
        next(err);
    }
}

async function getTen(req: Request, res: Response, next: NextFunction) {
    try {
        const quizzes = await quizService.getTen();
        return res.status(200).json({ quizzes });
    } catch (err) {
        next(err);
    }
}

async function getUserQuizzes(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        if (id !== req.user.id) {
            res.status(403);
            throw new Error('Access denied');
        }
        const quizzes = await quizService.getUserQuizzes(id);
        return res.status(200).json({ quizzes });
    } catch (err) {
        next(err);
    }
}

async function search(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body;
        const quizzes = await quizService.searchQuizzes(name);
        return res.status(200).json({ quizzes });
    } catch (err) {
        next(err);
    }
}

async function pagination(req: Request, res: Response, next: NextFunction) {
    try {
        const { page, limit } = req.query;

        if (!Number(page) || !Number(limit)) {
            throw new Error('Invalid request');
        }
        const { quizzes, totalPages } = await quizService.pagination(Number(page), Number(limit));
        return res.status(200).json({ quizzes, totalPages });
    } catch (err) {
        next(err);
    }
}

async function likeQuiz(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        return await quizService.likeQuiz(userId, id).then(() => {
            return res.status(200).json({ message: 'Success' });
        });
    } catch (err) {
        next(err);
    }
}

async function saveQuiz(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        return await quizService.saveQuiz(userId, id).then(() => {
            return res.status(200).json({ message: 'Success' });
        });
    } catch (err) {
        next(err);
    }
}

async function submitQuiz(req: Request, res: Response, next: NextFunction) {
    try {
        const { quizId, rightAnswers } = req.body;
        const userId = req.user.id;
        const result = await quizService.submitQuiz(userId, quizId, rightAnswers);
        return res.status(200).json({ result });
    } catch (err) {
        next(err);
    }
}

export const quizController = {
    createQuiz,
    deleteQuiz,
    updateQuiz,
    getQuiz,
    getTen,
    getUserQuizzes,
    search,
    pagination,
    likeQuiz,
    saveQuiz,
    submitQuiz
}