import { Request, Response, NextFunction } from 'express';
import { testService } from '../services/testService';


async function createTest(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description, questions, results, score } = req.body;

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

async function likeTest(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        return await testService.likeTest(userId, id).then(() => {
            return res.status(200).json({ message: 'Success' });
        });
    } catch (err) {
        next(err);
    }
}

async function saveTest(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        return await testService.saveTest(userId, id).then(() => {
            return res.status(200).json({ message: 'Success' });
        });
    } catch (err) {
        next(err);
    }
}

async function submitTest(req: Request, res: Response, next: NextFunction) {
    try {
        const { testId, score } = req.body;
        const userId = req.user.id;
        const result = await testService.submitTest(userId, testId, score);
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
    likeTest,
    saveTest,
    submitTest
};