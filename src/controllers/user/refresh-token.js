import { ZodError } from 'zod'
import { UnauthorizedError } from '../../errors/user.js'
import { refreshTokenSchema } from '../../schemas/user.js'
import { ok, badRequest, serverError, unauthorized } from '../helpers/http.js'

export class RefreshTokenController {
    constructor(refreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase
    }

    async execute(httpRequest) {
        try {
            const { refreshToken } = httpRequest.body ?? {}
            await refreshTokenSchema.parseAsync(httpRequest.body)

            // validação pra bater com o teste:
            // - se não existir
            // - ou não for string
            if (!refreshToken || typeof refreshToken !== 'string') {
                return badRequest({ message: 'Invalid refresh token' })
            }

            const tokens = this.refreshTokenUseCase.execute(refreshToken)

            return ok(tokens)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest(error)
            }

            if (error instanceof UnauthorizedError) {
                return unauthorized({ message: error.message })
            }

            console.error(error)
            return serverError()
        }
    }
}
