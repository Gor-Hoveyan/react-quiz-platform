import { userService } from "../services/userService";
import { Request, Response, NextFunction } from 'express';

async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, email, password } = req.body;
        const newUser = await userService.registerUser(username, email, password);
        return res.status(200).json('Success');
    } catch (err) {
        next(err);
    }
}

async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const { refreshToken, accessToken, user } = await userService.login(email, password);

        res.cookie('refreshToken', String(await refreshToken), {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ accessToken, user });
    } catch (err) {
        next(err);
    }
}

async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await userService.logout(refreshToken);
        res.cookie('refreshToken', refreshToken, { maxAge: 0 });

        return res.status(200).json({ message: 'Success' });
    } catch (err) {
        next(err);
    }
}

async function refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const { newRefreshToken, newAccessToken, user } = await userService.refreshToken(refreshToken) as { newRefreshToken: string, newAccessToken: string, user: unknown };
        res.cookie('refreshToken', await newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ accessToken: newAccessToken, user });
    } catch (err) {
        next(err);
    }
}

export const authController = {
    register,
    login,
    logout,
    refreshToken
};