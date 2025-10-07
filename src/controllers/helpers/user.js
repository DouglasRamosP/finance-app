import { badRequest, notFound } from './http.js'

import validator from 'validator'

export const generateInvalidPasswordResponse = () => {
    return badRequest({
        message: 'Password must be at least 6 characters',
    })
}

export const generateEmailAlreadyUseResponse = () => {
    return badRequest({
        message: 'Invalid e-mail. Please provide a valid one',
    })
}

export const generateInvalidIdResponse = () => {
    return badRequest({
        message: 'The provided id is not valid',
    })
}

export const userNotFoundResponse = () => {
    return notFound({ message: 'User not found' })
}

export const checkPassworIsValid = (body) => {
    return body.length >= 6
}

export const checkIfEmailIsValid = (email) => {
    return validator.isEmail(email)
}

export const checkedIfIdIsValid = (userId) => {
    return validator.isUUID(userId)
}
