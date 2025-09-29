import { CreateUserUseCase } from "../user-case/create-user.js";

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body;
            // validar a requisição ( camkpos obrigatórios, tamanho de senha e email)
            const requiredFields = ['first_name', 'last_name', 'email', 'password'];

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return {
                        statusCode: 400,
                        body: { error: `Field ${field} is required.` },
                    }
                }
            }

            const createUserUseCase = new CreateUserUseCase();

            const createdUser = await createUserUseCase.execute(params);

            return {
                statusCode: 201,
                body: createdUser,
            }
        } catch (error) {
            console.error(error)
            return {
                statusCode: 500,
                body: { error: 'Internal server error.' },
            }  
        }
    }
}