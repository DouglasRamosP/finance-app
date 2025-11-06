import { faker } from '@faker-js/faker'
import { UpdateUserController } from '../src/controllers/user/update-user'

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
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
        const updateUserUseCase = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCase)

        return { sut, updateUserUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },

        body: {
            first_name: faker.person.firstName(),
        },
    }

    it('should return 200 when updating a user successfully', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute(httpRequest)
        // assert
        expect(test.statusCode).toBe(200)
    })

    it('should return 400 when userId invalid', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({
            ...httpRequest,
            params: { userId: 'invalid_id' },
        })
        // assert
        expect(test.statusCode).toBe(400)
    })

    it('should return 400 when email invalid', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        })
        // assert
        expect(test.statusCode).toBe(400)
    })
})
