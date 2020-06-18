import fs from 'fs';
import path from 'path';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import IUserRepository from '../repositories/IUserRepository';

interface IAvatarFilename {
    userId: string;
    avatarFilename: string;
}

@injectable()
export default class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUserRepository
    ) {}

    public async execute({
        userId,
        avatarFilename
    }: IAvatarFilename): Promise<User> {
        const user = await this.userRepository.findById(userId);

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
        await this.userRepository.save(user);

        return user;
    }
}
