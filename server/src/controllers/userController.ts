import { userService } from "../services/userService";
import { Request, Response, NextFunction } from 'express';

async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user.id;
        const user = await userService.getUser(userId);
        return res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
}

async function follow(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const subscriberId = req.user.id;
        return await userService.follow(id, subscriberId).then(() => {
            return res.status(200).json({ message: 'Success' });
        });
    } catch (err) {
        next(err);
    }
}

async function unfollow(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const subscriberId = req.user.id;
        return await userService.unfollow(id, subscriberId).then(() => {
            return res.status(200).json({ message: 'Success' });
        });
    } catch (err) {
        next(err);
    }
}

async function getUserPage(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const user = await userService.getUserPage(id);
        return res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { bio, username, showLikedPosts, showPassedTests } = req.body;
        const userId = req.user.id
        await userService.updateUser(userId, username, bio, showLikedPosts, showPassedTests);
        return res.status(200).json({ message: 'Success' });
    } catch (err) {
        next(err);
    }
}

async function setAvatar(req: Request, res: Response, next: NextFunction) {
    try {
        const { avatarUrl } = req.body;
        const userId = req.user.id
        await userService.setAvatar(userId, avatarUrl);
        return res.status(200).json({ message: 'Success' });
    } catch (err) {
        next(err);
    }
}

async function getLikedPosts(req: Request, res: Response, next: NextFunction) {
    try {
        let id = req.params.id || req.user.id;
        const tests = await userService.getLikedPosts(id);
        return res.status(200).json({ tests });
    } catch (err) {
        next(err);
    }
}

async function getSavedPosts(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user.id
        const tests = await userService.getSavedPosts(userId);
        return res.status(200).json({ tests });
    } catch (err) {
        next(err);
    }
}

async function getPassedTests(req: Request, res: Response, next: NextFunction) {
    try {
        let id = req.params.id || req.user.id;
        const tests = await userService.getPassedTests(id);
        return res.status(200).json({ tests });
    } catch (err) {
        next(err);
    }
}

async function getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
        let id = req.params.id || req.user.id;
        const followers = await userService.getFollowers(id);
        return res.status(200).json({ followers });
    } catch (err) {
        next(err);
    }
}

async function getFollowings(req: Request, res: Response, next: NextFunction) {
    try {
        let id = req.params.id || req.user.id;
        const followings = await userService.getFollowings(id);
        return res.status(200).json({ followings });
    } catch (err) {
        next(err);
    }
}

export const userController = {
    getUser,
    follow,
    unfollow,
    getUserPage,
    updateUser,
    setAvatar,
    getLikedPosts,
    getSavedPosts,
    getFollowers,
    getFollowings,
    getPassedTests
}