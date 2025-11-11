import { JSONSchemaGenerator } from 'zod/v4/core'
import { DeleteTransactionController } from '../src/controllers/transaction/delete-transaction'

import { faker } from '@faker-js/faker'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.commerce.productName(),
                amount: Number(faker.finance.amount()),
                type: 'EXPENSES',
            }
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
            params: { transactionId: faker.string.uuid() },
        })
        // assert
        expect(test.statusCode).toBe(200)
    })

    it('should return 400 when id is invalid', async () => {
        // aarange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({
            params: { transactionId: 'invalid_id' },
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
            params: { transactionId: faker.string.uuid() },
        })
        // assert
        expect(test.statusCode).toBe(404)
    })
})
