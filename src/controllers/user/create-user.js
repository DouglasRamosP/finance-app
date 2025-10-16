import { badRequest, created, serverError } from '../helpers/http.js'
import {
    generateInvalidPasswordResponse,
    generateEmailAlreadyUseResponse,
    requiredFildIsMissingResponse,
} from '../helpers/user.js'
import {
    checkPassworIsValid,
    checkIfEmailIsValid,
    checkedRequiredFields,
} from '../helpers/validation.js'

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

            const requiredFieldValidation = checkedRequiredFields(
                params,
                requiredFields,
            )

            if (!requiredFieldValidation.ok) {
                return requiredFildIsMissingResponse(requiredFieldValidation)
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
