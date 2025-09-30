import { CreateUserUseCase } from '../user-case/create-user.js'
import { badRequest, created, serverError } from './helpers.js'
import validator from 'validator'

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({
                        message: `The field ${field} is required.`,
                    })
                }
            }

            const passworIsValis = params.password.length >= 6

            if (!passworIsValis) {
                return badRequest({
                    message: 'The password must be at least 6 characters long.',
                })
            }

            const emailIsValid = validator.isEmail(params.email)

            if (!emailIsValid) {
                return badRequest({ message: 'The email is not valid.' })
            }

            const createUserUseCase = new CreateUserUseCase()

            const createdUser = await createUserUseCase.execute(params)

            return created(createdUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
