import { DeleteUserUseCase } from '../user-case/delete-user.js'

import {
    checkedIfIdIsValid,
    generateInvalidIdResponse,
} from '../controllers/helpers/user.js'
import { ok, serverError } from './helpers/http.js'

export class DeleteUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isValidId = checkedIfIdIsValid(userId)

            if (!isValidId) {
                return generateInvalidIdResponse()
            }

            const deleteUserUseCase = new DeleteUserUseCase()

            const deletedUser = await deleteUserUseCase.execute(userId)

            return ok(deletedUser)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
