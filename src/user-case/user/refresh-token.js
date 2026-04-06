import { UnauthorizedError } from '../../errors/user.js'

export class RefreshTokenUseCase {
    constructor(tokenGeneratorAdapter, tokenVerifierAdapter) {
        this.tokenGeneratorAdapter = tokenGeneratorAdapter
        this.tokenVerifierAdapter = tokenVerifierAdapter
    }

    execute(refreshToken) {
        // verificar o token de refresh (se é válido, expirado, etc)
        try {
            const decodedToken = this.tokenVerifierAdapter.execute(
                refreshToken,
                process.env.JWT_REFRESH_TOKEN_SECRET,
            )

            if (
                !decodedToken?.userId ||
                typeof decodedToken.userId !== 'string'
            ) {
                throw new UnauthorizedError()
            }

            return this.tokenGeneratorAdapter.execute(decodedToken.userId)
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                throw error
            }

            throw new UnauthorizedError()
        }
    }
}
