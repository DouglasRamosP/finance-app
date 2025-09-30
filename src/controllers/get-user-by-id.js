import { badRequest, serverError, ok } from './helpers.js'
import { GetUserByIdUseCase } from '../user-case/get-user-by-id.js'
import validator from 'validator'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return badRequest({ message: 'The userId is not valid.' })
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()

            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            )

            if (!user) {
                return badRequest({ message: 'User not found.' })
            }

            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
