import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user.js'
import { getTransactionByUserIdSchema } from '../../schemas/transaction.js'
import { badRequest, ok, serverError } from '../helpers/http.js'
import { userNotFoundResponse } from '../helpers/response.js'

export class GetTransactionByUserIdController {
    constructor(getTransactionByUserIdUseCase) {
        this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            // Verificar se o userId foi passado como parametro
            const userId = httpRequest.query.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            await getTransactionByUserIdSchema.parseAsync({
                user_id: userId,
                from,
                to,
            })
            // Chamar Use Case
            const getTransaction =
                await this.getTransactionByUserIdUseCase.execute(userId)

            return ok(getTransaction)
            // retomar resposta http
        } catch (error) {
            console.error(error)

            if (error instanceof ZodError) {
                return badRequest(error)
            }

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return serverError()
        }
    }
}
