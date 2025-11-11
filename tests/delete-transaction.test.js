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
})
