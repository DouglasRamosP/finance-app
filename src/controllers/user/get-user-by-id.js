import { serverError, ok, notFound } from '../helpers/http.js'
import { generateInvalidIdResponse } from '../helpers/user.js'
import { checkedIfIdIsValid } from '../helpers/user.js'

export class GetUserByIdController {
    constructor(getUserByIdUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase
    }
    async execute(httpRequest) {
        try {
            const isIdValid = checkedIfIdIsValid(httpRequest.params.userId)

            if (!isIdValid) {
                return generateInvalidIdResponse()
            }

            const user = await this.getUserByIdUseCase.execute(
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
