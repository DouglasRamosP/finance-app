import { createuserSchema } from '../../schemas/user.js'
import { badRequest, created, serverError } from '../helpers/http.js'
import { ZodError } from 'zod'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }

    async execute(httpRequest) {
        try {
            const body = httpRequest.body || {}

            // 🔥 NORMALIZAÇÃO: camelCase → snake_case
            const params = {
                first_name: body.first_name ?? body.firstName,
                last_name: body.last_name ?? body.lastName,
                email: body.email,
                password: body.password,
            }

            // 🔍 ZOD valida snake_case
            await createuserSchema.parseAsync(params)

            // 🚀 useCase só recebe snake_case
            const createdUser = await this.createUserUseCase.execute(params)

            return created(createdUser)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error.name === 'EmailAlreadyInUseError') {
                return badRequest({ message: error.message })
            }
            console.error(error)
            return serverError()
        }
    }
}
