import { ZodError } from 'zod'
import { badRequest } from '../helpers/http.js'
import { serverError } from '../helpers/http.js'
import { ok } from '../helpers/http.js'
import { loginUserSchema } from '../../schemas/user.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'

export class LoginUserController {
    constructor(loginUserUseCase) {
        this.loginUserUseCase = loginUserUseCase
    }

    async execute(httpRequest) {
        try {
            const { email, password } = httpRequest.body
            await loginUserSchema.parseAsync({ email, password })
            const userWithTokens = await this.loginUserUseCase.execute(
                email,
                password,
            )
            return ok(userWithTokens)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof InvalidPasswordError) {
                return {
                    statusCode: 401,
                    body: {
                        message: 'Invalid password',
                    },
                }
            }

            if (error instanceof UserNotFoundError) {
                return {
                    statusCode: 404,
                    body: {
                        message: 'User not found',
                    },
                }
            }

            return serverError(error)
        }
    }
}
