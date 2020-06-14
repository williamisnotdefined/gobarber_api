import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import isAuthenticated from '../middlewares/isAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

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
    upload.single('avatar'),
    async (request: Request, response: Response) => {
        try {
            const avatarService = new UpdateUserAvatarService();
            const user = await avatarService.execute({
                userId: request.userId,
                avatarFilename: request.file.filename
            });

            return response.json(user);
        } catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
);

export default usersRouter;
