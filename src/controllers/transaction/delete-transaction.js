import { ok, serverError } from '../helpers/http.js'
import {
    generateInvalidIdResponse,
    transactionNotFoundResponse,
} from '../helpers/response.js'
import { checkedIfIdIsValid } from '../helpers/validation.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId

            const idIsValid = checkedIfIdIsValid(transactionId)

            if (!idIsValid) {
                return generateInvalidIdResponse()
            }

            const deleteTransaction =
                await this.deleteTransactionUseCase.execute(
                    transactionId,
                    httpRequest.params.userId,
                )

            if (!deleteTransaction) {
                return transactionNotFoundResponse()
            }

            return ok(deleteTransaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
