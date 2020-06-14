import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import AppError from '../errors/AppError';
import User from '../models/User';
import authConfig from '../config/auth';

interface RequestDTO {
    email: string;
    password: string;
}

interface ResponseDTO {
    user: User;
    token: string;
}

class AuthenticateUserService {
    public async execute({
        email,
        password
    }: RequestDTO): Promise<ResponseDTO> {
        const userRepository = getRepository(User);

        const user = await userRepository.findOne({
            where: { email }
        });

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
