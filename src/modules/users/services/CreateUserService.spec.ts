import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('Create User', () => {
    const fakeUser = {
        name: 'William',
        email: 'email@william.com',
        password: '123456'
    };

    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const createUser = new CreateUserService(fakeUsersRepository);

        const newUser = await createUser.execute(fakeUser);

        expect(newUser).toHaveProperty('id');
        expect(newUser.email).toBe(fakeUser.email);
    });

    it('should not be able to create two users with same email', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const createUser = new CreateUserService(fakeUsersRepository);

        await createUser.execute(fakeUser);

        expect(createUser.execute(fakeUser)).rejects.toBeInstanceOf(AppError);
    });
});
