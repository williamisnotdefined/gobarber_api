import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import isAuthenticated from '@modules/users/infra/http/middlewares/isAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request: Request, response: Response) => {
    const { name, email, password } = request.body;

    const usersRepository = new UsersRepository();
    const createUser = new CreateUserService(usersRepository);
    const user = await createUser.execute({ name, email, password });

    delete user.password;

    return response.json(user);
});

usersRouter.patch(
    '/avatar',
    isAuthenticated,
    upload.single('avatar'),
    async (request: Request, response: Response) => {
        const usersRepository = new UsersRepository();
        const avatarService = new UpdateUserAvatarService(usersRepository);
        const user = await avatarService.execute({
            userId: request.userId,
            avatarFilename: request.file.filename
        });

        return response.json(user);
    }
);

export default usersRouter;
