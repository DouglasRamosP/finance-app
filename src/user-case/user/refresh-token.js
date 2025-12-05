import { UnauthorizedError } from '../../errors/user.js'

export class RefreshTokenUseCase {
    constructor(tokenGeneratorAdapter, tokenVerifierAdapter) {
        this.tokenGeneratorAdapter = tokenGeneratorAdapter
        this.tokenVerifierAdapter = tokenVerifierAdapter
    }

    execute(refreshToken) {
        // verificar o tokken de refresh (se é valido, expirado, etc)
        try {
            const decodedToken = this.tokenVerifierAdapter.execute(
                refreshToken,
                process.env.JWT_REFRESH_TOKEN_SECRET,
            )

            return this.tokenGeneratorAdapter.execute(decodedToken.userId)
        } catch (error) {
            console.error(error)
            throw new UnauthorizedError()
        }
    }
}
