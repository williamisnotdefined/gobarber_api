import { uuid } from 'uuidv4';

import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUserRepository from '@modules/users/repositories/IUserRepository';

class UsersRepository implements IUserRepository {
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        const findedUser = this.users.find(user => user.id === id);
        return findedUser || undefined;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findedUser = this.users.find(user => user.email === email);
        return findedUser || undefined;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: uuid(), ...userData });
        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        const userIndex = this.users.findIndex(
            currentUser => currentUser.id === user.id
        );

        if (userIndex) {
            this.users[userIndex] = user;
        }

        return user;
    }
}

export default UsersRepository;
