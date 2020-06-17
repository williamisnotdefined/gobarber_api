import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface IRequestDTO {
    email: string;
    password: string;
}

interface IResponseDTO {
    user: User;
    token: string;
}

class AuthenticateUserService {
    constructor(private userRepository: IUserRepository) {}

    public async execute({
        email,
        password
    }: IRequestDTO): Promise<IResponseDTO> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Invalid credentials.', 401);
        }

        const passwordMatched = await compare(String(password), user.password);

        if (!passwordMatched) {
            throw new AppError('Invalid credentials.', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn
        });

        return { user, token };
    }
}

export default AuthenticateUserService;
