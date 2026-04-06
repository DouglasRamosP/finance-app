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

export const serializeBalance = (balance) => {
    if (!balance) {
        return balance
    }

    return {
        balance: toNumber(balance.balance),
        earnings: toNumber(balance.earnings),
        expenses: toNumber(balance.expenses),
        investments: toNumber(balance.investments),
        earningsPercentage: toNumber(balance.earningsPercentage),
        expensesPercentage: toNumber(balance.expensesPercentage),
        investmentsPercentage: toNumber(balance.investmentsPercentage),
    }
}
