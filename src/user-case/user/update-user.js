import { EmailAlreadyInUseError } from '../../errors/user.js'

export class UpdateUserUseCase {
    constructor(
        postgresUpdateUserRepository,
        postgresGetUserByEmailRepository,
        passwordHasherAdapter,
    ) {
        this.postgresUpdateUserRepository = postgresUpdateUserRepository
        this.postgresGetUserByEmailRepository = postgresGetUserByEmailRepository
        this.passwordHasherAdapter = passwordHasherAdapter
    }
    async execute(userId, updateParams) {
        // se o e-mail estiver sendo atualizado, verificar se o email não está sendo utilizado por outro user
        if (updateParams.email) {
            const userAlreadyExists =
                await this.postgresGetUserByEmailRepository.execute(
                    updateParams.email,
                )

            if (userAlreadyExists && userAlreadyExists.id !== userId) {
                throw new EmailAlreadyInUseError(updateParams.email)
            }
        }

        const user = {
            ...updateParams,
        }

        // se a senhas estiver sendo atualizada, criptografar.
        if (updateParams.password) {
            const hashedPassword = await this.passwordHasherAdapter.execute(
                updateParams.password,
            )

            user.password = hashedPassword
        }

        // chamar o repositório para atualizar o usuário

        const updatedUser = await this.postgresUpdateUserRepository.execute(
            userId,
            user,
        )

        return updatedUser
    }
}
