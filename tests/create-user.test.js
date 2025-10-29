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
        const createUserController = new CreateUserController(CreateUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'Teste',
                last_name: 'Testando',
                email: 'teste@email.com',
                password: '123456',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                last_name: 'Testando',
                email: 'teste@email.com',
                password: '123456',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                first_name: 'Teste',
                email: 'teste@email.com',
                password: '123456',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                first_name: 'Teste',
                last_name: 'Testando',
                password: '123456',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                first_name: 'Teste',
                last_name: 'Testando',
                email: 'teste@email.com',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

     it('should return 400 if email is not valid', async () => {
        //arrange
        const CreateUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(CreateUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'Teste',
                last_name: 'Testando',
                email: 'teste.com',
                password: '123456',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not valid', async () => {
        //arrange
        const CreateUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(CreateUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'Teste',
                last_name: 'Testando',
                email: 'teste@email.com',
                password: '123',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })
})
