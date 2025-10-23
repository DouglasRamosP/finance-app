import { UserNotFoundError } from '../../errors/user.js'
import { ok, serverError } from '../helpers/http.js'
import {
    generateInvalidIdResponse,
    userNotFoundResponse,
} from '../helpers/response.js'
import { checkedIfIdIsValid } from '../helpers/validation.js'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserbalanceUseCase = getUserBalanceUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            if (!userId) {
                return userNotFoundResponse()
            }

            const userIdIsValid = checkedIfIdIsValid(userId)

            if (!userIdIsValid) {
                return generateInvalidIdResponse()
            }

            const userBalance = await this.getUserbalanceUseCase.execute(userId)

            return ok(userBalance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            console.error(error)
            return serverError()
        }
    }
}
