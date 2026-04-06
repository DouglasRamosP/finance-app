import { UnauthorizedError } from '../../src/errors/user.js'
import { RefreshTokenUseCase } from '../../src/user-case/user/refresh-token.js'

describe('Refresh Token Use Case', () => {
    class TokenVerifierAdapterStub {
        execute() {
            return {
                userId: '4d9243a6-4f39-4f17-a5b2-2c4b6f4f2a10',
            }
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

    test('it should generate new tokens using the userId from refresh token payload', () => {
        const { sut, tokenGeneratorAdapterStub } = makeSut()

        const executeSpy = jest.spyOn(tokenGeneratorAdapterStub, 'execute')

        sut.execute('refresh_token')

        expect(executeSpy).toHaveBeenCalledWith(
            '4d9243a6-4f39-4f17-a5b2-2c4b6f4f2a10',
        )
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

    test('it should throw UnauthorizedError if refresh token payload has no userId', () => {
        const { sut, tokenVerifierAdapterStub } = makeSut()

        jest.spyOn(tokenVerifierAdapterStub, 'execute').mockReturnValueOnce({})

        expect(() => sut.execute('refresh_token')).toThrow(
            new UnauthorizedError(),
        )
    })
})
