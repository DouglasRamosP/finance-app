import { DeleteTransactionController } from '../../src/controllers/transaction/delete-transaction'

import { faker } from '@faker-js/faker'
import { transaction } from '../fixtures/transaction'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deletetransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deletetransactionUseCase)

        return { sut, deletetransactionUseCase }
    }

    it('should return 200 when deleting a transaction successfully', async () => {
        // aarange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
                userId: faker.string.uuid(),
            },
        })
        // assert
        expect(test.statusCode).toBe(200)
    })

    it('should return 400 when id is invalid', async () => {
        // aarange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({
            params: { transactionId: 'invalid_id', userId: 'invalid_id' },
        })
        // assert
        expect(test.statusCode).toBe(400)
    })

    it('should return 404 when transaction is not found', async () => {
        // aarange
        const { sut, deletetransactionUseCase } = makeSut()
        jest.spyOn(deletetransactionUseCase, 'execute').mockResolvedValueOnce(
            null,
        )
        // act
        const test = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
                userId: faker.string.uuid(),
            },
        })
        // assert
        expect(test.statusCode).toBe(404)
    })

    it('should return 500 when DeleteTransactionUseCase throws', async () => {
        // aarange
        const { sut, deletetransactionUseCase } = makeSut()
        jest.spyOn(deletetransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        // act
        const test = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
                userId: faker.string.uuid(),
            },
        })
        // assert
        expect(test.statusCode).toBe(500)
    })

    it('should call DeleteTransTransactionUseCse with correct params', async () => {
        // arrange
        const { sut, deletetransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(deletetransactionUseCase, 'execute')

        const transactionId = faker.string.uuid()
        const userId = faker.string.uuid()
        // act
        await sut.execute({
            params: {
                transactionId,
                userId,
            },
        })
        // assert
        expect(executeSpy).toHaveBeenCalledWith(transactionId, userId)
    })
})
