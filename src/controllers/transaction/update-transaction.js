import { badRequest, ok, serverError } from '../helpers/http.js'
import {
    generateInvalidIdResponse,
    invalidAmountResponse,
} from '../helpers/response.js'
import {
    checkedIfIdIsValid,
    checkIfAmountIsValid,
    checkIfTypeIsValid,
} from '../helpers/validation.js'

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

            const allowedFields = ['name', 'date', 'amount', 'type']

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed.',
                })
            }
            // validar amount > 0 & 2 casas decimais
            const amount = params.amount
            if (amount) {
                const amountIsValid = checkIfAmountIsValid(amount)
                if (!amountIsValid) {
                    return invalidAmountResponse()
                }
            }
            // validar type
            const type = params.type
            if (type) {
                const typeIsValid = checkIfTypeIsValid(type)
                if (!typeIsValid) {
                    return badRequest({
                        message:
                            'The type must be EARNINGS, EXPENSES or INVESTMENTS',
                    })
                }
            }
            // chamar usecase
            const updateTransaction = await this.updateTransactionUseCase.execute(transactionId, params)

            return ok(updateTransaction)
        } catch (error) {
            console.error(error)
            return serverError
        }
    }
}
