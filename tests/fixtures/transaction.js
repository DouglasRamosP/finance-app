import { faker } from '@faker-js/faker'

export const createTransactionParams = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: 'EXPENSES',
    amount: Number(faker.finance.amount()),
}
