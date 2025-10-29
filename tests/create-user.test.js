import { CreateUserController } from '../src/controllers/user/create-user.js'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    it('should return 201 when creating a user successfully', async () => {
        //arrange
        const CreateUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            CreateUserUseCase,
        )

        const httpRequest = {
            body: {
                first_name: 'Teste',
                last_name: 'Testando',
                email: 'teste@email.com',
                password: '123456',
            }
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
    })
})
