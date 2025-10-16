import { badRequest, notFound } from './http.js'

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

export const requiredFildIsMissingResponse = (requiredFieldValidation) => {
    return badRequest({
        message: `The field ${requiredFieldValidation.missingField.toUpperCase()} is required.`,
    })
}

export const invalidAmountResponse = () => {
    return badRequest({
        message: 'The amount must be a valid currency.',
    })
}
