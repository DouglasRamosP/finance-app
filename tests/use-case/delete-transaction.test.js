import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from '../../src/user-case/transaction/delete-transaction'
import {
    TransactionNotFoundError,
    UnauthorizedTransactionAccessError,
} from '../../src/errors/transaction.js'
import { transaction } from '../fixtures/transaction'

describe('DeleteTransactionUseCase', () => {
    const user_id = faker.string.uuid()
    class DeleteTransactionRepositoryStub {
        async execute() {
            return { ...transaction, user_id }
        }
    }

    class GetTransactionByIdRepositoryStub {
        async execute() {
            return { ...transaction, user_id }
        }
    }

    const makeSut = () => {
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionUseCase(
            deleteTransactionRepository,
            getTransactionByIdRepository,
        )

        return {
            sut,
            deleteTransactionRepository,
            getTransactionByIdRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()
        const id = faker.string.uuid()

        // act
        const result = await sut.execute(id, user_id)

        // expect
        expect(result).toEqual({ ...transaction, user_id })
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut()
        const deleteTransactionRepositorySpy = jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )
        const id = faker.string.uuid()

        // act
        await sut.execute(id, user_id)

        // expect
        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(id)
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut()
        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())
        const id = faker.string.uuid()

        // act
        const promise = sut.execute(id, user_id)

        // expect
        await expect(promise).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError when transaction does not exist', async () => {
        const { sut, getTransactionByIdRepository } = makeSut()
        const id = faker.string.uuid()

        jest.spyOn(
            getTransactionByIdRepository,
            'execute',
        ).mockResolvedValueOnce(null)

        await expect(sut.execute(id, user_id)).rejects.toThrow(
            new TransactionNotFoundError(id),
        )
    })

    it('should throw UnauthorizedTransactionAccessError when transaction belongs to another user', async () => {
        const { sut, getTransactionByIdRepository } = makeSut()
        const id = faker.string.uuid()

        jest.spyOn(
            getTransactionByIdRepository,
            'execute',
        ).mockResolvedValueOnce({
            ...transaction,
            user_id: faker.string.uuid(),
        })

        await expect(sut.execute(id, user_id)).rejects.toThrow(
            new UnauthorizedTransactionAccessError(),
        )
    })
})
