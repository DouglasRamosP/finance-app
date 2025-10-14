import { v4 as uuidv4 } from 'uuid'

import { UserNotFoundError } from '../../errors/user'

export class CreateTransactionUseCase {
    constructor(createTrasactionRepository, getUserByIdRepository) {
        this.createTrasactionRepository = createTrasactionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(createTransactionParams) {
        const userId = createTransactionParams.userId

        const user = this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = uuidv4

        const transaction = await this.createTrasactionRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        })

        return transaction
    }
}
