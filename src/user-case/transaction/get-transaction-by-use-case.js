import { UserNotFoundError } from "../../errors/user.js"

export class GetTransactionByUserIdUseCase {
    constructor(postgresGetTransactionByUserIdRepository, postgresGetUserRepository) {
        this.postgresGetTransactionByUserIdRepository = postgresGetTransactionByUserIdRepository
        this.postgresGetUserRepository = postgresGetUserRepository
    }
    async execute(userId) {
        // Checar se o usuário existe
        const user = await this.postgresGetUserRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)        
        }
        // Chamar Repository
        const getTransaction = this.postgresGetTransactionByUserIdRepository.execute(userId)

        return getTransaction
    }
}