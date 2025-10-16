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

export const checkIfIsString = (value) => typeof value === 'string'

export const checkedRequiredFields = (params, requiredFields) => {
    for (const field of requiredFields) {
        const fieldIsMissing = !params[field]
        const fieldIsEmpty =
            checkIfIsString(params[field]) &&
            validator.isEmpty(params[field], { ignore_whitespace: true })
        if (fieldIsMissing || fieldIsEmpty) {
            return {
                missingField: field,
                ok: false,
            }
        }
    }

    return {
        ok: true,
        missingField: undefined,
    }
}

export const checkIfAmountIsValid = (amount) => {
    validator.isCurrency(amount, {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
    })
}

export const checkIfTypeIsValid = (type) => {
    return ['EARNINGS', 'EXPENSES', 'INVESTMENTS'].includes(type)
}
