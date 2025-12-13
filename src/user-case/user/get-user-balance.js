import { UserNotFoundError } from '../../errors/user.js'

export class GetUserBalanceUseCase {
    constructor(postgresGetUserBalanceRepository, getUserByIdUseCase) {
        this.postgresGetUserBalanceRepository = postgresGetUserBalanceRepository
        this.getUserByIdUseCase = getUserByIdUseCase
    }
    async execute(userId, from, to) {
        const userIdIsValid = await this.getUserByIdUseCase.execute(userId)

        if (!userIdIsValid) {
            throw new UserNotFoundError(userId)
        }

        const userBalance = await this.postgresGetUserBalanceRepository.execute(
            userId,
            from,
            to,
        )

        return userBalance
    }
}
