import { UserNotFoundError } from '../../errors/user'

export class updateTransactionUsecase {
    constructor(
        postgresUpdateTransactionRepository,
        postgresGetUserRepository,
    ) {
        this.postgresUpdateTransactionRepository =
            postgresUpdateTransactionRepository
        this.postgresGetUserRepository = postgresGetUserRepository
    }
    async execute(updateTransactionParams) {
        const userAlreadyExists = await this.postgresGetUserRepository.execute(
            updateTransactionParams.userId,
        )

        if (!userAlreadyExists) {
            throw new UserNotFoundError()
        }

        const updateTransaction =
            this.postgresUpdateTransactionRepository.execute(
                updateTransactionParams,
            )

        return updateTransaction
    }
}
