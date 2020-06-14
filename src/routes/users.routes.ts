import { Router, Request, Response } from 'express';

import CreateUserService from '../services/CreateUserService';
import isAuthenticated from '../middlewares/isAuthenticated';

const usersRouter = Router();

usersRouter.post('/', async (request: Request, response: Response) => {
    try {
        const { name, email, password } = request.body;
        const createUser = new CreateUserService();
        const user = await createUser.execute({ name, email, password });

        delete user.password;

        return response.json(user);
    } catch (error) {
        return response.status(400).json({ message: error.message });
    }
});

usersRouter.patch(
    '/avatar',
    isAuthenticated,
    async (request: Request, response: Response) => {
        return response.json();
    }
);

export default usersRouter;
