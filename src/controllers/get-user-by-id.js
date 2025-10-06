import { serverError, ok, notFound } from './helpers/http.js'
import { GetUserByIdUseCase } from '../user-case/get-user-by-id.js'
import { generateInvalidIdResponse } from './helpers/user.js'
import { checkedIfIdIsValid } from './helpers/user.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = checkedIfIdIsValid(httpRequest.params.userId)

            if (!isIdValid) {
                return generateInvalidIdResponse()
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()

            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            )

            if (!user) {
                return notFound({ message: 'User not found.' })
            }

            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
