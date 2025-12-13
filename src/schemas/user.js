import { z } from 'zod'

export const createuserSchema = z.object({
    first_name: z.string().trim().min(1),
    last_name: z.string().trim().min(1),
    email: z.string().email().trim().min(1),
    password: z.string().trim().min(6),
})

export const updateUserSchema = createuserSchema.partial().strict({
    // .partial aceita parte dos campos, não precisa passar todos. .strict prende para passar somente os campos permitidos.
    message: 'Some provided field is not allowed.', // Ao trbalhar com {message: ''} é possivel alterar a message que aparece ao retornar o erro referente ao campo (neste caso strict).
})

export const loginUserSchema = z.object({
    email: z
        .string()
        .email({ message: 'Invalid email address' })
        .trim()
        .min(1, { message: 'Email is required' }),
    password: z
        .string()
        .trim()
        .min(6, { message: 'Password must be at least 6 characters long' }),
})

export const refreshTokenSchema = z.object({
    refreshToken: z
        .string()
        .trim()
        .min(1, { message: 'Refresh token is required' }),
})

export const getUserBalanceSchema = z.object({
    user_id: z.string().uuid(),
    from: z.coerce.date(),
    to: z.coerce.date(),
})
