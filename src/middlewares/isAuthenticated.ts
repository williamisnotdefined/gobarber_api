import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '../errors/AppError';
import authConfig from '../config/auth';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function isAuthenticated(
    req: Request,
    resp: Response,
    next: NextFunction
): NextFunction | void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError('Missing auth credentials.', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const { sub } = verify(token, authConfig.jwt.secret) as TokenPayload; // or <TokenPayload>verify(token, authConfig.jwt.secret)
        req.userId = sub;

        return next();
    } catch {
        throw new AppError('Invalid JWT token.', 401);
    }
}
