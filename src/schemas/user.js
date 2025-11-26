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
