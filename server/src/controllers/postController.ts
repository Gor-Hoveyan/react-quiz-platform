import { Request, Response, NextFunction } from 'express';
import { postService } from '../services/postService';

async function getUserPosts(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id || req.user.id;
        const posts = await postService.getUserPosts(id);
        return res.status(200).json({ posts });
    } catch (err) {
        next(err);
    }
}

async function searchPosts(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, filter } = req.query;
        console.log(String(name))
        const posts = await postService.searchPosts(name, String(filter));
        return res.status(200).json({ posts });
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
        let id = req.params?.id || req.user.id;
        const posts = await postService.getLikedPosts(id);
        return res.status(200).json({ posts });
    } catch (err) {
        next(err);
    }
}

async function getSavedPosts(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user.id
        const posts = await postService.getSavedPosts(userId);
        return res.status(200).json({ posts });
    } catch (err) {
        next(err);
    }
}

async function getPassedPosts(req: Request, res: Response, next: NextFunction) {
    try {
        let id = req.params?.id || req.user?.id;
        const posts = await postService.getPassedPosts(id);
        return res.status(200).json({ posts });
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