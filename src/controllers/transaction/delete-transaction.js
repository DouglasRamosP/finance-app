import { forbidden, ok, serverError } from '../helpers/http.js'
import {
    generateInvalidIdResponse,
    transactionNotFoundResponse,
} from '../helpers/response.js'
import { checkedIfIdIsValid } from '../helpers/validation.js'
import {
    TransactionNotFoundError,
    UnauthorizedTransactionAccessError,
} from '../../errors/transaction.js'
import { serializeTransaction } from '../../utils/serialize-transaction.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId

            const idIsValid = checkedIfIdIsValid(transactionId)
            const userIdIsValid = checkedIfIdIsValid(httpRequest.params.userId)

            if (!userIdIsValid) {
                return generateInvalidIdResponse()
            }

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

            return ok(serializeTransaction(deleteTransaction))
        } catch (error) {
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }

            if (error instanceof UnauthorizedTransactionAccessError) {
                return forbidden({
                    message: error.message,
                })
            }

            console.error(error)
            return serverError()
        }
    }
}
