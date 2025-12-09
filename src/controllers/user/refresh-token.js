import { UnauthorizedError } from '../../errors/user.js'
import { ok, badRequest, serverError, unauthorized } from '../helpers/http.js'

export class RefreshTokenController {
    constructor(refreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase
    }

    execute(httpRequest) {
        try {
            const { refreshToken } = httpRequest.body ?? {}

            // validação pra bater com o teste:
            // - se não existir
            // - ou não for string
            if (!refreshToken || typeof refreshToken !== 'string') {
                return badRequest({ message: 'Invalid refresh token' })
            }

            const tokens = this.refreshTokenUseCase.execute(refreshToken)

            return ok(tokens)
        } catch (error) {
            console.error(error)

            if (error instanceof UnauthorizedError) {
                return unauthorized({ message: 'Unauthorized' })
            }

            return serverError()
        }
    }
}
