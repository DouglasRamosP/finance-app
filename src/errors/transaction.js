export class TransactionNotFoundError extends Error {
    constructor(transactionId) {
        super(`Transaction with id ${transactionId} not found.`)
        this.name = 'TransactionNotFoundError'
    }
}

export class UnauthorizedTransactionAccessError extends Error {
    constructor() {
        super(`You do not have permission to access this transaction.`)
        this.name = 'UnauthorizedTransactionAccessError'
    }
}
