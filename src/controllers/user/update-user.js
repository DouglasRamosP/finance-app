import { badRequest, ok, serverError } from '../helpers/http.js'
import { generateInvalidIdResponse } from '../helpers/response.js'
import { checkedIfIdIsValid } from '../helpers/validation.js'

import { EmailAlreadyInUseError } from '../../errors/user.js'
import { updateUserSchema } from '../../schemas/user.js'
import { ZodError } from 'zod'

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

            await updateUserSchema.parseAsync(params)

            const updateUser = await this.updateUserUseCase.execute(
                userId,
                params,
            )

            return ok(updateUser)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error(error)
            return serverError()
        }
    }
}
