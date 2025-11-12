import { UpdateTransactionController } from '../src/controllers/transaction/update-transaction'
import { faker } from '@faker-js/faker'

describe('UpdateTransactionController', () => {
    class UpdateTransactionUseCaseStub {
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

    // verificar necessidade destas declarações
    const httpRequest = {
        params: { transactionId: faker.string.uuid() },
        body: {
            name: faker.person.firstName(),
        },
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)

        return { sut, updateTransactionUseCase }
    }

    it('should return 400 when the transaction Id is invalid', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({
            ...httpRequest,
            params: { transactionId: 'invalid_transactionId' },
        })
        // assert
        expect(test.statusCode).toBe(400)
    })

    it('should return 200 when the update succesffuly', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute(httpRequest)
        // assert
        expect(test.statusCode).toBe(200)
    })

    it('should return 400 when unallowed fields is provided', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({
            ...httpRequest,
            body: { unallowed_field: 'invalid_field' },
        })
        // assert
        expect(test.statusCode).toBe(400)
    })

    it('should return 400 when amount is invalid', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({
            ...httpRequest,
            body: { amount: 'invalid_amount' },
        })
        // assert
        expect(test.statusCode).toBe(400)
    })

    it('should return 400 when amount is invalid', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({
            ...httpRequest,
            body: { type: 'invalid_type' },
        })
        // assert
        expect(test.statusCode).toBe(400)
    })

    it('should return 500 when UpdateTransactionUseCase throws', async () => {
        // arrange
        const { sut, updateTransactionUseCase } = makeSut()
        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(new Error())
        // act
        const test = await sut.execute(httpRequest)
        // assert
        expect(test.statusCode).toBe(500)
    })
})
