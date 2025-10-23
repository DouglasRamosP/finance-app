import { badRequest, created, serverError } from '../helpers/http.js'
import { z, ZodError } from 'zod'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }

    async execute(httpRequest) {
        try {
            const createuserSchema = z.object({
                first_name: z.string().trim().min(1),
                last_name: z.string().trim().min(1),
                email: z.string().email().trim().min(1),
                password: z.string().trim().min(6),
            })

            const params = httpRequest.body

            await createuserSchema.parseAsync(params)

            /* ----- SEM O ZOD --------

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
            */

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
