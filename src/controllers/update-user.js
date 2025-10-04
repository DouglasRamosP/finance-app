import { badRequest, ok, serverError } from './helpers.js'
import { UpdateUserUseCase } from '../user-case/update-user.js'

import validator from 'validator'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserController {
    async execute(httpsRequest) {
        try {
            const updateParams = httpsRequest.body

            const userId = httpsRequest.params.userId
            const isIdValid = validator.isUUID(userId)

            if (!isIdValid) {
                return badRequest({
                    massage: 'The provided ID is not valid',
                })
            }

            const allowedFields = ['firstName', 'lastName', 'email', 'password']

            const someFieldIsNotAllowed = Object.keys(updateParams).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed.',
                })
            }

            if (updateParams.password) {
                const passworIsValid = updateParams.password.length >= 6

                if (!passworIsValid) {
                    return badRequest({
                        message:
                            'The password must be at least 6 characters long.',
                    })
                }
            }

            if (updateParams.email) {
                const emailIsValid = validator.isEmail(updateParams.email)

                if (!emailIsValid) {
                    return badRequest({ message: 'The email is not valid.' })
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()

            const updateUser = await updateUserUseCase.execute(
                userId,
                updateParams,
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
