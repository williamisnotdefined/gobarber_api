import fs from 'fs';
import path from 'path';
import { getRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';

interface avatarFilename {
    userId?: string;
    avatarFilename: string;
}

export default class UpdateUserAvatarService {
    public async execute({
        userId,
        avatarFilename
    }: avatarFilename): Promise<User> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(userId);

        if (!user) {
            throw new AppError(
                'Only authenticated users can change avatar.',
                401
            );
        }

        if (user.avatar) {
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar
            );

            const userFileExists = await fs.promises.stat(userAvatarFilePath);

            if (userFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;
        await usersRepository.save(user);

        return user;
    }
}
