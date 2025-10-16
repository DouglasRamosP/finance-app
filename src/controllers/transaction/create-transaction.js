import { badRequest, created, serverError } from '../helpers/http.js'
import {
    checkIfAmountIsValid,
    checkIfTypeIsValid,
} from '../helpers/validation.js'
import {
    generateInvalidIdResponse,
    invalidAmountResponse,
    requiredFildIsMissingResponse,
} from '../helpers/response.js'
import {
    checkedIfIdIsValid,
    checkedRequiredFields,
} from '../helpers/validation.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            const requiredFieldValidation = checkedRequiredFields(
                params,
                requiredFields,
            )

            if (!requiredFieldValidation.ok) {
                return requiredFildIsMissingResponse(requiredFieldValidation)
            }

            // validar o ID
            const userIdIsValid = checkedIfIdIsValid(params.user_id)

            if (!userIdIsValid) {
                return generateInvalidIdResponse()
            }

            // validar o amount (utilizando BIB validaator) & validar amount <= 0
            const amount = params.amount.toString()

            const amountIsValid = checkIfAmountIsValid(amount)

            if (!amountIsValid) {
                return invalidAmountResponse()
            }
            // validar type (ESRNING, EXPENSE, INVESTMENT)
            const type = params.type.trim().toUpperCase()

            const typeIsValid = checkIfTypeIsValid(type)

            if (!typeIsValid) {
                return badRequest({
                    message:
                        'The type must be EARNINGS, EXPENSES or INVESTMENTS',
                })
            }
            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            })

            return created(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
