const toNumber = (value) => {
    if (value == null) {
        return 0
    }

    if (typeof value === 'number') {
        return value
    }

    if (typeof value?.toNumber === 'function') {
        return value.toNumber()
    }

    return Number(value)
}

export const serializeTransaction = (transaction) => {
    if (!transaction) {
        return transaction
    }

    return {
        ...transaction,
        amount: toNumber(transaction.amount),
    }
}

export const serializeTransactions = (transactions = []) => {
    return transactions.map(serializeTransaction)
}
