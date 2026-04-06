import jwt from 'jsonwebtoken'
import request from 'supertest'
import { jest } from '@jest/globals'
import { app } from '../../src/app.js'
import { PostgresGetUserRepository } from '../../src/repositories/postgres/user/get-user-by-id.js'
import { PostgresGetUserBalanceRepository } from '../../src/repositories/postgres/user/get-user-balance.js'

describe('User balance route', () => {
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

    it('should return the authenticated user balance for the informed period', async () => {
        jest.spyOn(
            PostgresGetUserRepository.prototype,
            'execute',
        ).mockResolvedValue(user)

        jest.spyOn(
            PostgresGetUserBalanceRepository.prototype,
            'execute',
        ).mockResolvedValue({
            balance: 1000,
            earnings: 1800,
            expenses: 500,
            investments: 300,
            earningsPercentage: 69.23,
            expensesPercentage: 19.23,
            investmentsPercentage: 11.54,
        })

        const response = await request(app)
            .get('/api/users/me/balance?from=2024-01-01&to=2024-01-31')
            .set('Authorization', `Bearer ${accessToken()}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            balance: 1000,
            earnings: 1800,
            expenses: 500,
            investments: 300,
            earningsPercentage: 69.23,
            expensesPercentage: 19.23,
            investmentsPercentage: 11.54,
        })

        expect(
            PostgresGetUserBalanceRepository.prototype.execute,
        ).toHaveBeenCalledWith(user.id, '2024-01-01', '2024-01-31')
    })
})
