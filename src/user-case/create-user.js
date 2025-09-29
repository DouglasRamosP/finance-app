import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js';

export class CreateUserUseCase {
    async execute(createUserParams) {
        // todo: verificar se o email já existe

        // gerar ID do usuário
        const ID = uuidv4();

        // criptografar a senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserParams.password, saltRounds);

        // inserir usuário no banco de dados
        const user = {
            ...createUserParams,
            id: ID,
            password: hashedPassword,
        }

        // salvar no banco de dados
        const CreateUserRepository = new PostgresCreateUserRepository();

        const createdUser = await CreateUserRepository.execute(user);

        return createdUser
    }
}