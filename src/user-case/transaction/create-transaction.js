import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionUseCase {
    constructor(
        createTrasactionRepository,
        getUserByIdRepository,
        idGeneratorAdapter,
    ) {
        this.createTrasactionRepository = createTrasactionRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.idGeneratorAdapter = idGeneratorAdapter
    }
    async execute(createTransactionParams) {
        const userId = createTransactionParams.user_id

        const user = this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = await this.idGeneratorAdapter.execute()

        const transaction = await this.createTrasactionRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        })

        return transaction
    }
}
