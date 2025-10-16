import {
    generateInvalidIdResponse,
    userNotFoundResponse,
} from '../helpers/response.js'
import { checkedIfIdIsValid } from '../helpers/validation.js'
import { ok, serverError } from '../helpers/http.js'

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isValidId = checkedIfIdIsValid(userId)

            if (!isValidId) {
                return generateInvalidIdResponse()
            }

            const deletedUser = await this.deleteUserUseCase.execute(userId)

            if (!deletedUser) {
                return userNotFoundResponse()
            }

            return ok(deletedUser)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
