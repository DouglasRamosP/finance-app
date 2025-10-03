import bcrypt from 'bcrypt'

import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user.js'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserUseCase {
    async execute(userId, updateParams) {
        // se o e-mail estiver sendo atualizado, verificar se o email não está sendo utilizado por outro user
        if (updateParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()

            const userAlreadyExists =
                await postgresGetUserByEmailRepository.execute(
                    updateParams.email,
                )

            if (userAlreadyExists) {
                throw new EmailAlreadyInUseError(updateParams.email)
            }
        }

        const user = {
            ...updateParams,
        }

        // se a senhas estiver sendo atualizada, criptografar.
        if (updateParams.password) {
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(
                updateParams.password,
                saltRounds,
            )

            user.password = hashedPassword
        }

        // chamar o repositório para atualizar o usuário
        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()

        const updatedUser = await postgresUpdateUserRepository.execute(
            userId,
            user,
        )

        return updatedUser[0]
    }
}
