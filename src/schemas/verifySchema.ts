import { z } from 'zod';

export const verfySchema = z.object({
    code : z.string().length(6, {message : "Verification Code Must Be 6 digits Long"})
})