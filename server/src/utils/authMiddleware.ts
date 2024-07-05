import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { UserJWTPayload } from '../services/userService';



export function authMiddleware( req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new Error('Access denied');
    }
    jwt.verify(token, process.env.ACCESS_SECRET as Secret, (err, payload) => {
        if(err) {
            throw new Error('Invalid bearer')
        }

        const userPayload = payload as UserJWTPayload;

        req.user = {
            id: userPayload.id,
            email: userPayload.id
        }

        next();
    })
};