import { z } from 'zod'
import validator from 'validator'

export const createTransactionSchema = z.object({
    user_id: z.string().uuid(),
    name: z.string().trim().min(1, {
        message: 'Name is required.',
    }),
    date: z.coerce.date(),
    amount: z
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

export const getTransactionByUserIdSchema = z.object({
    user_id: z.string().uuid(),
    from: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            'Invalid date format (expected YYYY-MM-DD)',
        ),
    to: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            'Invalid date format (expected YYYY-MM-DD)',
        ),
})
