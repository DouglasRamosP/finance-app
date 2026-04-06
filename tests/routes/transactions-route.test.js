import jwt from 'jsonwebtoken'
import request from 'supertest'
import { jest } from '@jest/globals'
import { app } from '../../src/app.js'
import { PostgresGetUserRepository } from '../../src/repositories/postgres/user/get-user-by-id.js'
import { PostgresGetTransactionByUserIdRepository } from '../../src/repositories/postgres/transaction/get-transaction-by-user-id.js'

describe('Transactions route', () => {
    const user = {
        id: '4d9243a6-4f39-4f17-a5b2-2c4b6f4f2a10',
        first_name: 'Maria',
        last_name: 'Silva',
        email: 'maria.silva@example.com',
        password: 'hashed-password',
    }

    const accessToken = () =>
        jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: '15m',
        })

    beforeAll(() => {
        process.env.JWT_ACCESS_TOKEN_SECRET = 'test-access-secret'
        process.env.JWT_REFRESH_TOKEN_SECRET = 'test-refresh-secret'
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should return transactions from the plural authenticated route', async () => {
        jest.spyOn(
            PostgresGetUserRepository.prototype,
            'execute',
        ).mockResolvedValue(user)

        jest.spyOn(
            PostgresGetTransactionByUserIdRepository.prototype,
            'execute',
        ).mockResolvedValue([
            {
                id: 'c1a96d41-d34d-48d1-a1ba-4efe748ce9d8',
                user_id: user.id,
                name: 'Salary',
                date: new Date('2024-01-15T12:00:00.000Z').toISOString(),
                amount: 3500.5,
                type: 'EARNINGS',
            },
        ])

        const response = await request(app)
            .get('/api/transactions/me?from=2024-01-01&to=2024-01-31')
            .set('Authorization', `Bearer ${accessToken()}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual([
            {
                id: 'c1a96d41-d34d-48d1-a1ba-4efe748ce9d8',
                user_id: user.id,
                name: 'Salary',
                date: '2024-01-15T12:00:00.000Z',
                amount: 3500.5,
                type: 'EARNINGS',
            },
        ])

        expect(
            PostgresGetTransactionByUserIdRepository.prototype.execute,
        ).toHaveBeenCalledWith(user.id, '2024-01-01', '2024-01-31')
    })
})
