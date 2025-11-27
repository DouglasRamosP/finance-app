import { CreateUserController } from '../../src/controllers/user/create-user.js'
import { EmailAlreadyInUseError } from '../../src/errors/user.js'

describe('Create User Controller', () => {
  class CreateUserUseCaseStub {
    execute(user) {
      return user
    }
  }

  const makeSut = () => {
    const createUserUseCase = new CreateUserUseCaseStub()
    const sut = new CreateUserController(createUserUseCase)

    return { createUserUseCase, sut }
  }

  // 👉 Entrada da API simulada: camelCase
  const httpRequest = {
    body: {
      firstName: 'Edgardo',
      lastName: 'Hermiston-Beahan',
      email: 'edgardo@example.com',
      password: 'fL0eUa8',
    },
  }

  // 👉 O que o controller manda pro useCase/Zod: snake_case
  const normalizedParams = {
    first_name: 'Edgardo',
    last_name: 'Hermiston-Beahan',
    email: 'edgardo@example.com',
    password: 'fL0eUa8',
  }

  it('should return 201 when creating a user successfully', async () => {
    const { sut } = makeSut()

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(201)
    expect(result.body).toEqual(normalizedParams)
  })

  it('should return 400 if first_name is not provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        firstName: undefined,
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if last_name is not provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        lastName: undefined,
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if email is not provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        email: undefined,
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if password is not provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        password: undefined,
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if email is not valid', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        email: 'invalid_email',
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if password is too short', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        password: '123',
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should call CreateUserUseCase with correct params', async () => {
    const { sut, createUserUseCase } = makeSut()
    const executeSpy = jest.spyOn(createUserUseCase, 'execute')

    await sut.execute(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(normalizedParams)
  })

  it('should return 500 if CreateUserUseCase throws generic error', async () => {
    const { sut, createUserUseCase } = makeSut()
    jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  it('should return 400 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
    const { sut, createUserUseCase } = makeSut()
    jest
      .spyOn(createUserUseCase, 'execute')
      .mockImplementationOnce(() => {
        throw new EmailAlreadyInUseError(httpRequest.body.email)
      })

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(400)
  })
})
