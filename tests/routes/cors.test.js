import request from 'supertest'
import { jest } from '@jest/globals'
import { app } from '../../src/app.js'
import { PasswordComparatorAdapter } from '../../src/adapters/password-comparator.js'
import { PostgresGetUserByEmailRepository } from '../../src/repositories/postgres/user/get-user-by-email.js'

describe('CORS middleware', () => {
    const originalAllowedOrigins = process.env.CORS_ALLOWED_ORIGINS
    const originalAllowVercelPreviews = process.env.CORS_ALLOW_VERCEL_PREVIEWS
    const originalPreviewProjects = process.env.CORS_VERCEL_PREVIEW_PROJECTS
    const restoreEnv = (key, value) => {
        if (value === undefined) {
            delete process.env[key]
            return
        }

        process.env[key] = value
    }

    const user = {
        id: '4d9243a6-4f39-4f17-a5b2-2c4b6f4f2a10',
        firstName: 'Maria',
        lastName: 'Silva',
        email: 'maria.silva@example.com',
        password: 'hashed-password',
    }

    afterEach(() => {
        jest.restoreAllMocks()

        restoreEnv('CORS_ALLOWED_ORIGINS', originalAllowedOrigins)
        restoreEnv('CORS_ALLOW_VERCEL_PREVIEWS', originalAllowVercelPreviews)
        restoreEnv('CORS_VERCEL_PREVIEW_PROJECTS', originalPreviewProjects)
    })

    it('should allow the published frontend origin on login', async () => {
        const origin = 'https://dashboard-financeira-three.vercel.app'

        jest.spyOn(
            PostgresGetUserByEmailRepository.prototype,
            'execute',
        ).mockResolvedValue(user)

        jest.spyOn(
            PasswordComparatorAdapter.prototype,
            'execute',
        ).mockResolvedValue(true)

        const response = await request(app)
            .post('/api/users/login')
            .set('Origin', origin)
            .send({
                email: user.email,
                password: 'valid-password',
            })

        expect(response.status).toBe(200)
        expect(response.headers['access-control-allow-origin']).toBe(origin)
        expect(response.headers['access-control-allow-credentials']).toBe(
            'true',
        )
        expect(response.headers.vary).toContain('Origin')
    })

    it('should allow configured Vercel preview origins on preflight', async () => {
        const origin =
            'https://dashboard-financeira-three-git-feature-login.vercel.app'

        const response = await request(app)
            .options('/api/users/refresh-token')
            .set('Origin', origin)
            .set('Access-Control-Request-Method', 'POST')
            .set(
                'Access-Control-Request-Headers',
                'content-type, authorization',
            )

        expect(response.status).toBe(204)
        expect(response.headers['access-control-allow-origin']).toBe(origin)
        expect(response.headers['access-control-allow-credentials']).toBe(
            'true',
        )
        expect(response.headers['access-control-allow-methods']).toContain(
            'POST',
        )
        expect(response.headers['access-control-allow-headers']).toContain(
            'authorization',
        )
    })

    it('should allow additional origins configured by environment variable', async () => {
        const origin = 'https://finance.example.com'

        process.env.CORS_ALLOWED_ORIGINS = origin

        const response = await request(app)
            .options('/api/transactions/me')
            .set('Origin', origin)
            .set('Access-Control-Request-Method', 'GET')

        expect(response.status).toBe(204)
        expect(response.headers['access-control-allow-origin']).toBe(origin)
    })

    it('should block unknown origins', async () => {
        const response = await request(app)
            .options('/api/transactions/me')
            .set('Origin', 'https://evil.example.com')
            .set('Access-Control-Request-Method', 'GET')

        expect(response.status).toBe(403)
        expect(response.headers['access-control-allow-origin']).toBeUndefined()
        expect(response.body).toEqual({ message: 'Not allowed by CORS' })
    })
})
