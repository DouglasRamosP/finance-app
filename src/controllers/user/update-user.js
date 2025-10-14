import { badRequest, ok, serverError } from '../helpers/http.js'
import {
    generateInvalidPasswordResponse,
    generateEmailAlreadyUseResponse,
    generateInvalidIdResponse,
    checkPassworIsValid,
    checkIfEmailIsValid,
    checkedIfIdIsValid,
} from '../helpers/user.js'

import { EmailAlreadyInUseError } from '../../errors/user.js'

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }
    async execute(httpsRequest) {
        try {
            const params = httpsRequest.body

            const userId = httpsRequest.params.userId
            const isIdValid = checkedIfIdIsValid(userId)

            if (!isIdValid) {
                return generateInvalidIdResponse()
            }

            const allowedFields = ['firstName', 'lastName', 'email', 'password']

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed.',
                })
            }

            if (params.password) {
                const passworIsValid = checkPassworIsValid(params.password)

                if (!passworIsValid) {
                    return generateInvalidPasswordResponse()
                }
            }

            if (params.email) {
                const emailIsValid = checkIfEmailIsValid(params.email)

                if (!emailIsValid) {
                    return generateEmailAlreadyUseResponse()
                }
            }

            const updateUser = await this.updateUserUseCase.execute(
                userId,
                params,
            )

            return ok(updateUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error(error)
            return serverError()
        }
    }
}
