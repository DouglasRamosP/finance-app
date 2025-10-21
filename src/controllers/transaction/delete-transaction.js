import { ok, serverError } from '../helpers/http'
import {
    generateInvalidIdResponse,
    userNotFoundResponse,
} from '../helpers/response'
import { checkedIfIdIsValid } from '../helpers/validation'

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
                await this.deleteTransactionUseCase.execute(transactionId)

            if (!deleteTransaction) {
                return userNotFoundResponse()
            }

            return ok(deleteTransaction)
        } catch (error) {
            console.error(error)
            return serverError
        }
    }
}
