export class GetUserByIdUseCase {
    constructor(postgresGetUserRepository) {
        this.postgresGetUserRepository = postgresGetUserRepository
    }
    async execute(userId) {
        const user = await this.postgresGetUserRepository.execute(userId)

        return user
    }
}
