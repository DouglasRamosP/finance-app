import { badRequest, created, serverError } from '../helpers/http.js'
import { generateInvalidIdResponse } from '../helpers/user.js'
import { checkedIfIdIsValid } from '../helpers/validation.js'

import validator from 'validator'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            for (const field of requiredFields) {
                if (
                    !params[field] ||
                    params[field].toString().trim().length === 0
                ) {
                    return badRequest({
                        message: `The field ${field} is required.`,
                    })
                }
            }
            // validar o ID
            const userIdIsValid = checkedIfIdIsValid(params.user_id)

            if (!userIdIsValid) {
                return generateInvalidIdResponse()
            }

            // validar o amount (utilizando BIB validaator) & validar amount <= 0
            const amount = params.amount.toString()

            if (amount <= 0) {
                return badRequest({
                    message: 'The amount must be greater than 0.',
                })
            }

            const amountIsValid = validator.isCurrency(amount, {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.',
            })

            if (!amountIsValid) {
                return badRequest({
                    message: 'The amount must be a valid currency.',
                })
            }
            // validar type (ESRNING, EXPENSE, INVESTMENT)
            const type = params.type.trim().toUpperCase()

            const typeIsValid = [
                'EARNINGS',
                'EXPENSES',
                'INVESTMENTS',
            ].includes(type)

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
