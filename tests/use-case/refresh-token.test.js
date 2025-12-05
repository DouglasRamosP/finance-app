import { UnauthorizedError } from '../../src/errors/user.js'
import { RefreshTokenUseCase } from '../../src/user-case/user/refresh-token.js'

describe('Refresh Token Use Case', () => {
    class TokenVerifierAdapterStub {
        execute() {
            return true
        }
    }

    class TokenGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
            }
        }
    }

    const makeSut = () => {
        const tokenVerifierAdapterStub = new TokenVerifierAdapterStub()
        const tokenGeneratorAdapterStub = new TokenGeneratorAdapterStub()
        const sut = new RefreshTokenUseCase(
            tokenGeneratorAdapterStub,
            tokenVerifierAdapterStub,
        )

        return { sut, tokenVerifierAdapterStub, tokenGeneratorAdapterStub }
    }

    test('it should return new tokens', () => {
        const { sut } = makeSut()
        const refreshToken = 'refresh_token'
        const result = sut.execute(refreshToken)

        expect(result).toEqual({
            accessToken: 'access_token',
            refreshToken: 'refresh_token',
        })
    })

    test('it should throws if tokenVerifierAdapter throws', () => {
        const { sut, tokenVerifierAdapterStub } = makeSut()
        jest.spyOn(tokenVerifierAdapterStub, 'execute').mockImplementationOnce(
            () => {
                throw new Error()
            },
        )

        expect(() => sut.execute('refresh_token')).toThrow(
            new UnauthorizedError(),
        )
    })
})
