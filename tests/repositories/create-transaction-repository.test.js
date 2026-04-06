import { jest } from '@jest/globals'
import { faker } from '@faker-js/faker'
import { prisma } from '../../prisma/prisma.js'
import { PostgresCreateTransactionRepository } from '../../src/repositories/postgres/transaction/create-transaction.js'

describe('PostgresCreateTransactionRepository', () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should create a transaction using user relation connect', async () => {
        const repository = new PostgresCreateTransactionRepository()
        const params = {
            id: faker.string.uuid(),
            user_id: faker.string.uuid(),
            name: 'Teste Front Int',
            date: new Date('2026-04-06T00:00:00.000Z'),
            amount: 123,
            type: 'EARNINGS',
        }

        const createSpy = jest
            .spyOn(prisma.transactions, 'create')
            .mockResolvedValue(params)

        await repository.execute(params)

        expect(createSpy).toHaveBeenCalledWith({
            data: {
                id: params.id,
                name: params.name,
                date: params.date,
                amount: params.amount,
                type: params.type,
                user: {
                    connect: {
                        id: params.user_id,
                    },
                },
            },
        })
    })
})
