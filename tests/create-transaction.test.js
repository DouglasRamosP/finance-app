import { date } from 'zod'
import { CreateTransactionController } from '../src/controllers/transaction/create-transaction'
import { faker } from '@faker-js/faker'

describe('Create Transaction Controller', () => {
    class CreateTransactionuseCaseStub {
        execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionuseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)

        return { createTransactionUseCase, sut }
    }

    const httpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: 'EXPENSES',
        },
    }

    it('should return 201 when creating transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute(httpRequest)
        // assert
        expect(test.statusCode).toBe(201)
    })

    it('should return 400 when missing', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({
            body: {
                ...httpRequest.body,
                user_id: 'invalid_id',
            },
        })
        // assert
        expect(test.statusCode).toBe(400)
    })

    it('should return 400 when name missing', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({
            body: {
                ...httpRequest.body,
                name: undefined,
            },
        })
        // assert
        expect(test.statusCode).toBe(400)
    })

    it('should return 400 when date missing', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({
            body: {
                ...httpRequest.body,
                date: undefined,
            },
        })
        // assert
        expect(test.statusCode).toBe(400)
    })
})
