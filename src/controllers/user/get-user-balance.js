import { UserNotFoundError } from '../../errors/user'
import { ok, serverError } from '../helpers/http'
import {
    generateInvalidIdResponse,
    userNotFoundResponse,
} from '../helpers/response'
import { checkedIfIdIsValid } from '../helpers/validation'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserbalanceUseCase = getUserBalanceUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.param.userId

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
