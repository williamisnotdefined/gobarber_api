import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

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
            throw Error('Invalid credentials.');
        }

        const passwordMatched = await compare(String(password), user.password);

        if (!passwordMatched) {
            throw Error('Invalid credentials.');
        }

        const token = sign({}, 'secret_5396145c2cae8984c8ed2cc26417dbc2_key', {
            subject: user.id,
            expiresIn: '1d'
        });

        return { user, token };
    }
}

export default AuthenticateUserService;
