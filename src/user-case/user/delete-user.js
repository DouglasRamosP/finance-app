export class DeleteUserUseCase {
    constructor(postgresDeleteUserRepository) {
        this.postgresDeleteUserRepository = postgresDeleteUserRepository
    }
    async execute(userId) {
        const deletedUser = this.postgresDeleteUserRepository.execute(userId)

        return deletedUser
    }
}
