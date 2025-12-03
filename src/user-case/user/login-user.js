import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'

export class LoginUserUseCase {
    constructor(
        postgresGetUserByEmailRepository,
        passwordComparatorAdapter,
        tokensGeneratorAdapter,
    ) {
        this.postgresGetUserByEmailRepository = postgresGetUserByEmailRepository
        this.passwordComparatorAdapter = passwordComparatorAdapter
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
    }
    async execute(email, password) {
        // verificar se existe usuário com o email passado
        const user = await this.postgresGetUserByEmailRepository.execute(email)
        if (!user) {
            throw new UserNotFoundError()
        }
        // verificar se a senha informada corresponde com com a senha atrelada ao usuário dono do email informado.
        const passwordIsValid = await this.passwordComparatorAdapter.execute(
            password,
            user.password,
        )
        if (!passwordIsValid) {
            throw new InvalidPasswordError()
        }
        // gerar token de autenticação
        const tokens = await this.tokensGeneratorAdapter.execute(user.id)

        return { ...user, tokens }
    }
}
