import { commentService } from '../services/commentService';
import { Request, Response, NextFunction } from 'express';

async function createComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { comment, testId } = req.body;
        const userId = req.user.id;
        const newComment = await commentService.createComment(comment, userId, testId);
        return res.status(200).json({ newComment });
    } catch (err) {
        next(err);
    }
}

async function updateComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { comment, testId, newComment } = req.body;
        const userId = req.user.id;

        const updatedComment = await commentService.updateComment(comment, testId, userId, newComment);
        return res.status(200).json({ updatedComment });
    } catch (err) {
        next(err);
    }
}

async function removeComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { commentId, testId } = req.body;
        const userId = req.user.id;
        await commentService.removeComment(commentId, userId, testId);
        return res.status(200).json({ message: 'Success' });
    } catch (err) {
        next(err);
    }
}

async function likeComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await commentService.likeComment(id, userId);
        return res.status(200).json({ message: 'Success' });
    } catch (err) {
        next(err);
    }
}

async function getComments(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        if (!id || typeof id !== 'string') {
            res.status(404);
            throw new Error('Test not found');
        }
        const comments = await commentService.getComments(id);
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
}

async function createAnswer(req: Request, res: Response, next: NextFunction) {
    try {
        const { answer, testId, parentId } = req.body;

        const userId = req.user.id;
        const newAnswer = await commentService.createAnswer(answer, userId, testId, parentId);
        return res.status(200).json({ newAnswer });
    } catch (err) {
        next(err);
    }
}

async function updateAnswer(req: Request, res: Response, next: NextFunction) {
    try {
        const { answerId, newAnswer } = req.body;
        const userId = req.user.id;

        const updatedAnswer = await commentService.updateAnswer(answerId, userId, newAnswer);
        return res.status(200).json({ updatedAnswer });
    } catch (err) {
        next(err);
    }
}

async function removeAnswer(req: Request, res: Response, next: NextFunction) {
    try {
        const { parentId, answerId } = req.body;
        const userId = req.user.id;
        await commentService.removeAnswer(parentId, answerId, userId);
        return res.status(200).json({ message: 'Success' });
    } catch (err) {
        next(err);
    }
}

async function likeAnswer(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await commentService.likeAnswer(id, userId);
        return res.status(200).json({ message: 'Success' });
    } catch (err) {
        next(err);
    }
}

async function getAnswers(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const comments = await commentService.getAnswers(id);
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
}

export const commentController = {
    createComment,
    updateComment,
    removeComment,
    likeComment,
    getComments,
    createAnswer,
    updateAnswer,
    removeAnswer,
    likeAnswer,
    getAnswers,
};