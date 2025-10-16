import validator from 'validator'

export const checkPassworIsValid = (body) => {
    return body.length >= 6
}

export const checkIfEmailIsValid = (email) => {
    return validator.isEmail(email)
}

export const checkedIfIdIsValid = (userId) => {
    return validator.isUUID(userId)
}