import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionByUserIdUseCase {
    constructor(
        postgresGetTransactionByUserIdRepository,
        postgresGetUserRepository,
    ) {
        this.postgresGetTransactionByUserIdRepository =
            postgresGetTransactionByUserIdRepository
        this.postgresGetUserRepository = postgresGetUserRepository
    }
    async execute(userId, from, to) {
        const user = await this.postgresGetUserRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const getTransaction =
            await this.postgresGetTransactionByUserIdRepository.execute(
                userId,
                from,
                to,
            )

        return getTransaction
    }
}
