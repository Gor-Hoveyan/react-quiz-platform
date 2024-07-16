import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    status: number
}

export const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);
    console.log(err)

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({message: err.message, status: err.status});
}