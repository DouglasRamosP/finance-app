import { UserNotFoundError } from '../../errors/user.js'
import { ok, serverError } from '../helpers/http.js'
import {
    generateInvalidIdResponse,
    requiredFildIsMissingResponse,
    userNotFoundResponse,
} from '../helpers/response.js'

import { checkedIfIdIsValid } from '../helpers/validation.js'

export class GetTransactionByUserIdController {
    constructor(getTransactionByUserIdUseCase) {
        this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            // Verificar se o userId foi passado como parametro
            const userId = httpRequest.query.userId
            if (!userId) {
                return requiredFildIsMissingResponse(userId)
            }
            // Verificar se o userId é um ID válido
            const userIdIsValid = checkedIfIdIsValid(userId)
            if (!userIdIsValid) {
                return generateInvalidIdResponse()
            }
            // Chamar Use Case
            const getTransaction =
                await this.getTransactionByUserIdUseCase.execute(userId)

            return ok(getTransaction)
            // retomar resposta http
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError()
        }
    }
}
