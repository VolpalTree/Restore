import z from "zod";

const passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
)

export const registerSchema = z.object({
    email: z.email(),
    password: z.string().regex(passwordValidation, {
        message: 'Password must contain 1 letter, 1 number, 1 special character and must be more than 8 characters'
    })
})

export type RegisterSchema = z.infer<typeof registerSchema>