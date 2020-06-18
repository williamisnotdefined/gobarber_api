import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface IRequestDTO {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUserRepository
    ) {}

    public async execute({
        name,
        email,
        password
    }: IRequestDTO): Promise<User> {
        const checkUserExistis = await this.userRepository.findByEmail(email);

        if (checkUserExistis) {
            throw new AppError('E-mail address already used.');
        }

        const hashedPwd = await hash(password, 8);

        const user = await this.userRepository.create({
            name,
            email,
            password: hashedPwd
        });

        return user;
    }
}

export default CreateUserService;
