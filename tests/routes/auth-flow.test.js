import jwt from 'jsonwebtoken'
import request from 'supertest'
import { jest } from '@jest/globals'
import { app } from '../../src/app.js'
import { PasswordComparatorAdapter } from '../../src/adapters/password-comparator.js'
import { PostgresGetUserRepository } from '../../src/repositories/postgres/user/get-user-by-id.js'
import { PostgresGetUserByEmailRepository } from '../../src/repositories/postgres/user/get-user-by-email.js'

describe('Auth flow routes', () => {
    const user = {
        id: '4d9243a6-4f39-4f17-a5b2-2c4b6f4f2a10',
        firstName: 'Maria',
        lastName: 'Silva',
        email: 'maria.silva@example.com',
        password: 'hashed-password',
    }

    beforeAll(() => {
        process.env.JWT_ACCESS_TOKEN_SECRET = 'test-access-secret'
        process.env.JWT_REFRESH_TOKEN_SECRET = 'test-refresh-secret'
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should generate login token with userId in payload', async () => {
        jest.spyOn(
            PostgresGetUserByEmailRepository.prototype,
            'execute',
        ).mockResolvedValue(user)

        jest.spyOn(
            PasswordComparatorAdapter.prototype,
            'execute',
        ).mockResolvedValue(true)

        const response = await request(app).post('/api/users/login').send({
            email: user.email,
            password: 'valid-password',
        })

        expect(response.status).toBe(200)

        const decodedAccessToken = jwt.verify(
            response.body.tokens.accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET,
        )

        expect(decodedAccessToken.userId).toBe(user.id)
    })

    it('should generate refreshed tokens with userId and allow access to /api/users/me', async () => {
        jest.spyOn(
            PostgresGetUserByEmailRepository.prototype,
            'execute',
        ).mockResolvedValue(user)

        jest.spyOn(
            PasswordComparatorAdapter.prototype,
            'execute',
        ).mockResolvedValue(true)

        jest.spyOn(
            PostgresGetUserRepository.prototype,
            'execute',
        ).mockResolvedValue(user)

        const loginResponse = await request(app).post('/api/users/login').send({
            email: user.email,
            password: 'valid-password',
        })

        const refreshResponse = await request(app)
            .post('/api/users/refresh-token')
            .send({
                refreshToken: loginResponse.body.tokens.refreshToken,
            })

        expect(refreshResponse.status).toBe(200)

        const decodedAccessToken = jwt.verify(
            refreshResponse.body.accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET,
        )
        const decodedRefreshToken = jwt.verify(
            refreshResponse.body.refreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET,
        )

        expect(decodedAccessToken.userId).toBe(user.id)
        expect(decodedRefreshToken.userId).toBe(user.id)

        const meResponse = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${refreshResponse.body.accessToken}`)

        expect(meResponse.status).toBe(200)
        expect(meResponse.body.id).toBe(user.id)
        expect(
            PostgresGetUserRepository.prototype.execute,
        ).toHaveBeenCalledWith(user.id)
    })

    it('should return 401 when access token payload does not contain userId', async () => {
        const invalidAccessToken = jwt.sign(
            {},
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' },
        )

        const response = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${invalidAccessToken}`)

        expect(response.status).toBe(401)
        expect(response.body).toEqual({ error: 'Unauthorized' })
    })
})
