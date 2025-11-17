export class DeleteUserUseCase {
    constructor(postgresDeleteUserRepository) {
        this.postgresDeleteUserRepository = postgresDeleteUserRepository
    }
    async execute(userId) {
        const deletedUser = await this.deleteUserRepository.execute(userId)

        return deletedUser
    }
}
