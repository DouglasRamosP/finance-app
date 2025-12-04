import { ZodError } from 'zod'
import { updateTransactionSchema } from '../../schemas/transaction.js'
import { badRequest, ok, serverError } from '../helpers/http.js'
import { generateInvalidIdResponse } from '../helpers/response.js'
import { checkedIfIdIsValid } from '../helpers/validation.js'
import {
    TransactionNotFoundError,
    UnauthorizedTransactionAccessError,
} from '../../errors/transaction.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            // 1) Validar o ID da transaction
            const transactionId = httpRequest.params.transactionId

            const idIsValid = checkedIfIdIsValid(transactionId)
            if (!idIsValid) {
                return generateInvalidIdResponse()
            }

            // 2) Validar apenas os campos editáveis do body
            const body = await updateTransactionSchema.parseAsync(
                httpRequest.body,
            )

            // 3) Montar os parâmetros para o use case,
            //    injetando o user_id vindo do token
            const updateTransactionParams = {
                ...body,
                user_id: httpRequest.userId,
            }

            // 4) Chamar use case
            const updateTransaction =
                await this.updateTransactionUseCase.execute(
                    transactionId,
                    updateTransactionParams,
                )

            return ok(updateTransaction)
        } catch (error) {
            if (error instanceof TransactionNotFoundError) {
                return badRequest({
                    message: error.message,
                })
            }

            if (error instanceof UnauthorizedTransactionAccessError) {
                return badRequest({
                    message: error.message,
                })
            }

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
