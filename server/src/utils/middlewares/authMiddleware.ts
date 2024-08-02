import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { UserJWTPayload } from './../../services/authService';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw({status: 403, message: 'Access denied'});
    }
    jwt.verify(token, process.env.ACCESS_SECRET as Secret, (err, payload) => {
        if (err) {
            throw({status: 400, message: 'Invalid bearer'});
        }

        const userPayload = payload as UserJWTPayload;

        req.user = {
            id: userPayload.id,
            email: userPayload.id
        }
        next();
    })
};