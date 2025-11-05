import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from '../src/controllers/user/get-user-balance'

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        async execute() {
            return faker.number.int()
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
        const sut = new GetUserBalanceController(getUserBalanceUseCase)

        return { sut, getUserBalanceUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when getting user balance', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute(httpRequest)
        // assert
        expect(test.statusCode).toBe(200)
    })

    it('should return 400 when userId is invalid', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const test = await sut.execute({ params: { userId: 'invalid_id' } })
        // assert
        expect(test.statusCode).toBe(400)
    })

    it('should return 404 when getting user balance failed', async () => {
        // arrange
        const { sut, getUserBalanceUseCase } = makeSut()
        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        // act
        const test = await sut.execute(httpRequest)
        // assert
        expect(test.statusCode).toBe(500)
    })
})
