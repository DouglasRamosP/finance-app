import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
    constructor(postgresGetUserByEmailRepository, createUserRepository) {
        this.postgresGetUserByEmailRepository = postgresGetUserByEmailRepository
        this.createUserRepository = createUserRepository
    }
    async execute(createUserParams) {
        // todo: verificar se o email já existe

        const userAlreadyExists =
            await this.postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            )

        if (userAlreadyExists) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        // gerar ID do usuário
        const ID = uuidv4()

        // criptografar a senha
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(
            createUserParams.password,
            saltRounds,
        )

        // inserir usuário no banco de dados
        const user = {
            ...createUserParams,
            id: ID,
            password: hashedPassword,
        }

        // salvar no banco de dados

        const createdUser = await this.createUserRepository.execute(user)

        return createdUser
    }
}
