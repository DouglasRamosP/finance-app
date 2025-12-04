import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from '../../src/user-case/transaction/update-transaction'
import { transaction } from '../fixtures/transaction'

describe('UpdateTransactionUseCase', () => {
    class GetTransactionByIdRepositoryStub {
        async execute() {
            // simula uma transaction encontrada no banco
            return transaction
        }
    }

    class UpdateTransactionRepositoryStub {
        async execute() {
            // simula a transaction atualizada retornada pelo banco
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()

        const sut = new UpdateTransactionUseCase(
            updateTransactionRepository,
            getTransactionByIdRepository,
        )

        return {
            sut,
            updateTransactionRepository,
            getTransactionByIdRepository,
        }
    }

    it('should create a transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        const params = {
            amount: Number(faker.finance.amount()),
            user_id: transaction.user_id, // precisa bater com o fixture
        }

        // act
        const result = await sut.execute(transaction.id, params)

        // assert
        expect(result).toEqual(transaction)
    })

    it('should call UpdateTransactionRepository with correct params', async () => {
        // arrange
        const { sut, updateTransactionRepository } = makeSut()
        const updateTransactionRepositorySpy = jest.spyOn(
            updateTransactionRepository,
            'execute',
        )

        const params = {
            amount: transaction.amount,
            user_id: transaction.user_id, // mesmo user do fixture
        }

        // act
        await sut.execute(transaction.id, params)

        // assert
        expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
            params,
        )
    })

    it('should throw if UpdateTransactionRepository throws', async () => {
        // arrange
        const { sut, updateTransactionRepository } = makeSut()
        jest.spyOn(
            updateTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const params = {
            amount: transaction.amount,
            user_id: transaction.user_id,
        }

        // act
        const promise = sut.execute(transaction.id, params)

        // assert
        await expect(promise).rejects.toThrow()
    })
})
