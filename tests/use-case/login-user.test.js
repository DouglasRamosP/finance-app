import { InvalidPasswordError, UserNotFoundError } from '../../src/errors/user'
import { LoginUserUseCase } from '../../src/user-case/user/login-user.js'
import { user } from '../fixtures/user.js'
import { jest } from '@jest/globals'

describe('LoginUserUseCase', () => {
    class TokensGeneratorAdapterStub {
        async execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    class PasswordComparatorAdapterStub {
        async execute() {
            return true
        }
    }

    class PostgresGetUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()
        const passwordComparatorAdapter = new PasswordComparatorAdapterStub()
        const postgresGetUserByEmailRepositoryStub =
            new PostgresGetUserByEmailRepositoryStub()
        const sut = new LoginUserUseCase(
            postgresGetUserByEmailRepositoryStub,
            passwordComparatorAdapter,
            tokensGeneratorAdapter,
        )

        return {
            sut,
            postgresGetUserByEmailRepositoryStub,
            passwordComparatorAdapter,
        }
    }

    it('Should throw UserNotFoundError if user is not found', async () => {
        const { sut, postgresGetUserByEmailRepositoryStub } = makeSut()
        jest.spyOn(
            postgresGetUserByEmailRepositoryStub,
            'execute',
        ).mockResolvedValueOnce(null)
        const promise = sut.execute('any_email', 'any_password')

        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    it('Should throw InvalidPasswordError if password is not valid', async () => {
        const { sut, passwordComparatorAdapter } = makeSut()
        jest.spyOn(passwordComparatorAdapter, 'execute').mockReturnValueOnce(
            false,
        )
        const promise = sut.execute('any_email', 'any_password')

        await expect(promise).rejects.toThrow(new InvalidPasswordError())
    })

    it('should return user with tokens', async () => {
        const { sut } = makeSut()
        const result = await sut.execute('any_email', 'any_password')
        expect(result.tokens.accessToken).toBeDefined()
    })
})
