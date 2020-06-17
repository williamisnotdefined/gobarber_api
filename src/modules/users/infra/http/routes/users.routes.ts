import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import isAuthenticated from '@modules/users/infra/http/middlewares/isAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request: Request, response: Response) => {
    const { name, email, password } = request.body;
    const createUser = new CreateUserService();
    const user = await createUser.execute({ name, email, password });

    delete user.password;

    return response.json(user);
});

usersRouter.patch(
    '/avatar',
    isAuthenticated,
    upload.single('avatar'),
    async (request: Request, response: Response) => {
        const avatarService = new UpdateUserAvatarService();
        const user = await avatarService.execute({
            userId: request.userId,
            avatarFilename: request.file.filename
        });

        return response.json(user);
    }
);

export default usersRouter;
