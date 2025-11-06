import { faker } from '@faker-js/faker'
import { GetUserByIdController } from '../src/controllers/user/get-user-by-id'

describe('GetUserByIdController', () => {
    class getUserByIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 6 }),
            }
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new getUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return { getUserByIdUseCase, sut }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when the operation is successful', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute(httpRequest)
        // assert
        expect(test.statusCode).toBe(200)
    })

    it('should return 400 when a invalid userId reported ', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({ params: { userId: 'invalid_id' } })
        // assert
        expect(test.statusCode).toBe(400)
    })

    it('should return 404 when a userId not found', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockReturnValueOnce(null)
        // act
        const test = await sut.execute(httpRequest)
        // assert
        expect(test.statusCode).toBe(404)
    })

    it('should return 500 when get by id failed', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        // act
        const test = await sut.execute(httpRequest)
        // assert
        expect(test.statusCode).toBe(500)
    })
})
