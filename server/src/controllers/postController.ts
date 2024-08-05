import { Request, Response, NextFunction } from 'express';
import { postService } from '../services/postService';

async function getUserPosts(req: Request, res: Response, next: NextFunction) {
    try {
        const { page, limit } = req.query;
        if (!Number(page) || !Number(limit)) {
            throw ({ status: 400, message: 'Invalid request' });
        }
        const id = req.params.id || req.user.id;
        const { posts, totalPosts } = await postService.getUserPosts(id, Number(page), Number(limit));
        return res.status(200).json({ posts, totalPosts });
    } catch (err) {
        next(err);
    }
}

async function searchPosts(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, filter, page, limit } = req.query;
        if (!Number(page) || !Number(limit)) {
            throw ({ status: 400, message: 'Invalid request' });
        }
        console.log(String(name))
        const { posts, totalPosts } = await postService.searchPosts(name, String(filter), Number(page), Number(limit));
        return res.status(200).json({ posts, totalPosts });
    } catch (err) {
        next(err);
    }
}

async function pagination(req: Request, res: Response, next: NextFunction) {
    try {
        const { page, limit } = req.query;
        if (!Number(page) || !Number(limit)) {
            throw ({ status: 400, message: 'Invalid request' });
        }
        const { posts, totalPages } = await postService.pagination(Number(page), Number(limit));
        return res.status(200).json({ posts, totalPages });
    } catch (err) {
        next(err);
    }
}

async function getLikedPosts(req: Request, res: Response, next: NextFunction) {
    try {
        const { page, limit } = req.query;
        if (!Number(page) || !Number(limit)) {
            throw ({ status: 400, message: 'Invalid request' });
        }
        let id = req.params?.id || req.user.id;
        const { posts, totalPosts } = await postService.getLikedPosts(id, Number(page), Number(limit));
        return res.status(200).json({ posts, totalPosts });
    } catch (err) {
        next(err);
    }
}

async function getSavedPosts(req: Request, res: Response, next: NextFunction) {
    try {
        const { page, limit } = req.query;
        if (!Number(page) || !Number(limit)) {
            throw ({ status: 400, message: 'Invalid request' });
        }
        const userId = req.user.id
        const { posts, totalPosts } = await postService.getSavedPosts(userId, Number(page), Number(limit));
        return res.status(200).json({ posts, totalPosts });
    } catch (err) {
        next(err);
    }
}

async function getPassedPosts(req: Request, res: Response, next: NextFunction) {
    try {
        const { page, limit } = req.query;
        if (!Number(page) || !Number(limit)) {
            throw ({ status: 400, message: 'Invalid request' });
        }
        let id = req.params?.id || req.user?.id;
        const { posts, totalPosts } = await postService.getPassedPosts(id, Number(page), Number(limit));
        return res.status(200).json({ posts, totalPosts });
    } catch (err) {
        next(err);
    }
}

export const postController = {
    getUserPosts,
    searchPosts,
    pagination,
    getLikedPosts,
    getSavedPosts,
    getPassedPosts
}