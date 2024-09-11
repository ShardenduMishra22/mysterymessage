import { z } from 'zod'

export const messageSchema = z.object({
    message : z
        .string()
        .min(10 , {message : "Cmon, Write atleast 10 Charecters !!"})
        .max(2000, {message : "Message is too long, Keep it under 2000 Charecters !!"})
})