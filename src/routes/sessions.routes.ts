import { Router, Request, Response } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const authUser = new AuthenticateUserService();
    const { user, token } = await authUser.execute({ email, password });

    delete user.password;

    return response.json({ user, token });
});

export default sessionsRouter;
