import { userService } from "../services/userService";
import { Request, Response, NextFunction } from 'express';

async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.cookies;
        const user = await userService.getUser(token);
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


export const userController = {
    getUser,
    likeTest,
    saveTest
}