import { badRequest, created, serverError } from './helpers/http.js'
import {
    generateInvalidPasswordResponse,
    generateEmailAlreadyUseResponse,
    checkPassworIsValid,
    checkIfEmailIsValid,
} from './helpers/user.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }

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

            const passworIsValid = checkPassworIsValid(params.password)

            if (!passworIsValid) {
                return generateInvalidPasswordResponse()
            }

            const emailIsValid = checkIfEmailIsValid(params.email)

            if (!emailIsValid) {
                return generateEmailAlreadyUseResponse()
            }

            const createdUser = await this.createUserUseCase.execute(params)

            return created(createdUser)
        } catch (error) {
            if (error.name === 'EmailAlreadyInUseError') {
                return badRequest({ message: error.message })
            }
            console.error(error)
            return serverError()
        }
    }
}
