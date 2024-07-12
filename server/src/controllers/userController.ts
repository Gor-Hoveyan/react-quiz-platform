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

async function likeTest(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        return await userService.likeTest(userId, id).then(() => {
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
        return await userService.saveTest(userId, id).then(() => {
            return res.status(200).json({ message: 'Success' });
        });
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
        const { bio, username } = req.body;
        const userId = req.user.id
        const isError = await userService.updateUser(userId, username, bio);
        if(isError) {
            return res.status(403).json({message: isError})
        }
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

export const userController = {
    getUser,
    likeTest,
    saveTest,
    follow,
    unfollow,
    getUserPage,
    updateUser,
    setAvatar,
}