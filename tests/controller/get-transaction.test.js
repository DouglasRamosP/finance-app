import { faker } from '@faker-js/faker'
import { GetTransactionByUserIdController } from '../../src/controllers/transaction/get-transaction-by-user-id'
import { UserNotFoundError } from '../../src/errors/user'
import { transaction } from '../fixtures/transaction'

describe('GetTransactionController', () => {
    class GetTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const getTransactionUseCase = new GetTransactionUseCaseStub()
        const sut = new GetTransactionByUserIdController(getTransactionUseCase)

        return { sut, getTransactionUseCase }
    }

    const httpRequest = {
        query: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when get transaction is successfully', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute(httpRequest)
        // assert
        expect(test.statusCode).toBe(200)
    })

    it('should return 400 when user id is missing', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({
            query: {
                ...httpRequest.query,
                userId: null,
            },
        })
        // assert
        expect(test.statusCode).toBe(400)
    })

    it('should return 400 when User id is invalid', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({
            query: {
                ...httpRequest.query,
                userId: 'invalid_userId',
            },
        })
        // assert
        expect(test.statusCode).toBe(400)
    })

    it('should return 404 when user not found', async () => {
        // arrange
        const { sut, getTransactionUseCase } = makeSut()
        jest.spyOn(getTransactionUseCase, 'execute').mockImplementationOnce(
            () => {
                throw new UserNotFoundError()
            },
        )
        // act
        const test = await sut.execute(httpRequest)
        // assert
        expect(test.statusCode).toBe(404)
    })

    it('should return 500 GetTransactionUseCase failed', async () => {
        // arrange
        const { sut, getTransactionUseCase } = makeSut()
        jest.spyOn(getTransactionUseCase, 'execute').mockRejectedValueOnce()
        // act
        const test = await sut.execute(httpRequest)
        // assert
        expect(test.statusCode).toBe(500)
    })

    it('should call GetTransTransactionByUserIdUseCse with correct params', async () => {
        // arrange
        const { sut, getTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(getTransactionUseCase, 'execute')

        const userId = faker.string.uuid()
        // act
        await sut.execute({
            query: {
                userId,
            },
        })
        // assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})
