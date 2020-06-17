import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

interface RequestDTO {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    public async execute({ name, email, password }: RequestDTO): Promise<User> {
        const userRepository = getRepository(User);

        const checkUserExistis = await userRepository.findOne({
            where: { email }
        });

        if (checkUserExistis) {
            throw new AppError('E-mail address already used.');
        }

        const hashedPwd = await hash(password, 8);

        const user = userRepository.create({
            name,
            email,
            password: hashedPwd
        });

        await userRepository.save(user);

        return user;
    }
}

export default CreateUserService;
