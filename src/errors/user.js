export class EmailAlreadyInUseError extends Error {
    constructor(email) {
        super(`The email address ${email} is already in use by another account.`)
        this.name = 'EmailAlreadyInUseError'
    }
}
