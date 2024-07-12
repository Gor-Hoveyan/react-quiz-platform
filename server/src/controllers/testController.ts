import { Request, Response, NextFunction } from 'express';
import { testService } from '../services/testService';


async function createTest(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description, questions, results, score } = req.body;

        if (!req.user) {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (!questions.length) {
            return res.status(404).json({ message: 'Questions can\'t be empty' })
        }
        if (!results.length) {
            return res.status(404).json({ message: 'Results can\'t be empty' })
        }
        const test = await testService.create(name, description, req.user.id, questions, results, score);
        return res.status(200).json({ id: test._id });
    } catch (err) {
        next(err);
    }
}

async function deleteTest(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        await testService.remove(id, req.user.id);
        return res.status(200).json({ message: 'Success' });
    } catch (err) {
        next(err);
    }
}

async function updateTest(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description, author, questions, results } = req.body;
        const { id } = req.params;
        if (author !== req.user.id) {
            res.status(403);
            throw new Error('Access denied');
        }
        if (!questions.length) {
            return res.status(404).json({ message: 'Questions can\'t be empty' })
        }
        if (!results.length) {
            return res.status(404).json({ message: 'Results can\'t be empty' })
        }
        const test = await testService.update(req.user.id, id, name, description, author, questions, results);
        return res.status(200).json({ test });
    } catch (err) {
        next(err);
    }
}

async function getTest(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const test = await testService.getOne(id);
        return res.status(200).json({ test });
    } catch (err) {
        next(err);
    }
}

async function getTen(req: Request, res: Response, next: NextFunction) {
    try {
        const tests = await testService.getTen();
        return res.status(200).json({ tests });
    } catch (err) {
        next(err);
    }
}

async function getUserTests(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        if (id !== req.user.id) {
            res.status(403);
            throw new Error('Access denied');
        }
        const tests = await testService.getUserTests(id);
        return res.status(200).json({ tests });
    } catch (err) {
        next(err);
    }
}

async function search(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body;
        const tests = await testService.searchTests(name);
        return res.status(200).json({ tests });
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
        const { tests, totalPages } = await testService.pagination(Number(page), Number(limit));
        return res.status(200).json({ tests, totalPages });
    } catch (err) {
        next(err);
    }
}

async function submit(req: Request, res: Response, next: NextFunction) {
    try {
        const { testId, score } = req.body;
        const userId = req.user.id;
        const result = await testService.submit(userId, testId, score);
        return res.status(200).json({ result });
    } catch (err) {
        next(err);
    }
}

export const testController = {
    createTest,
    deleteTest,
    updateTest,
    getTest,
    getTen,
    getUserTests,
    search,
    pagination,
    submit
};