import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user.js'
import { getUserBalanceSchema } from '../../schemas/user.js'
import { badRequest, ok, serverError } from '../helpers/http.js'
import { userNotFoundResponse } from '../helpers/response.js'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserbalanceUseCase = getUserBalanceUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            if (!userId) {
                return userNotFoundResponse()
            }

            await getUserBalanceSchema.parseAsync({
                user_id: userId,
                from,
                to,
            })

            const userBalance = await this.getUserbalanceUseCase.execute(
                userId,
                from,
                to,
            )

            return ok(userBalance)
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            if (error instanceof ZodError) {
                return badRequest({ message: error.issues[0].message })
            }

            return serverError()
        }
    }
}
