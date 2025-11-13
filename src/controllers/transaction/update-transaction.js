import { ZodError } from 'zod'
import { updateTransactionSchema } from '../../schemas/transaction.js'
import { badRequest, ok, serverError } from '../helpers/http.js'
import { generateInvalidIdResponse } from '../helpers/response.js'
import { checkedIfIdIsValid } from '../helpers/validation.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }
    async execute(httpsRequest) {
        try {
            // validar o ID da transaction
            const transactionId = httpsRequest.params.transactionId

            const idIsValid = checkedIfIdIsValid(transactionId)
            if (!idIsValid) {
                return generateInvalidIdResponse()
            }

            const params = httpsRequest.body

            await updateTransactionSchema.parseAsync(params)

            // chamar usecase
            const updateTransaction =
                await this.updateTransactionUseCase.execute(
                    transactionId,
                    params,
                )

            return ok(updateTransaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            console.error(error)
            return serverError()
        }
    }
}
