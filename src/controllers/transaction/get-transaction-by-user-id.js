import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user.js'
import { getTransactionByUserIdSchema } from '../../schemas/transaction.js'
import { badRequest, ok, serverError } from '../helpers/http.js'
import { userNotFoundResponse } from '../helpers/response.js'
import { serializeTransactions } from '../../utils/serialize-transaction.js'

export class GetTransactionByUserIdController {
    constructor(getTransactionByUserIdUseCase) {
        this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            await getTransactionByUserIdSchema.parseAsync({
                user_id: userId,
                from,
                to,
            })

            const getTransaction =
                await this.getTransactionByUserIdUseCase.execute(
                    userId,
                    from,
                    to,
                )

            return ok(serializeTransactions(getTransaction))
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            console.error(error)
            return serverError()
        }
    }
}
