import { z } from 'zod'
import validator from 'validator'

const dateRangeRefinement = ({ from, to }) => from <= to

export const createTransactionSchema = z.object({
    user_id: z.string().uuid(),
    name: z.string().trim().min(1, {
        message: 'Name is required.',
    }),
    date: z.coerce.date(),
    amount: z.coerce
        .number()
        .min(1, {
            message: 'Amount must be greater than 0.',
        })
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.',
            }),
        ),
    type: z.enum(['EXPENSES', 'EARNINGS', 'INVESTMENTS']),
})

export const updateTransactionSchema = createTransactionSchema
    .omit({ user_id: true })
    .partial()
    .strict({ message: 'some provided field is not allowed' })

export const getTransactionByUserIdSchema = z
    .object({
        user_id: z.string().uuid(),
        from: z.coerce.date(),
        to: z.coerce.date(),
    })
    .refine(dateRangeRefinement, {
        message: '"from" must be before or equal to "to".',
        path: ['to'],
    })
