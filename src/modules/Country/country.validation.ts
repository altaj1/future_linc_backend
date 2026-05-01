import { z } from 'zod';

export const CountryValidation = {
    // Create Country
    create: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').max(100),
        flag: z.string().optional(),
        description: z.string().optional(),
    }).strict(),

    // Update Country
    update: z.object({
        name: z.string().min(2).max(100).optional(),
        flag: z.string().optional(),
        description: z.string().optional(),
    }).strict(),

    // Params validation
    params: {
        id: z.object({
            id: z.string().uuid('Invalid ID format'),
        }),
    }
};

export type CreateCountryInput = z.infer<typeof CountryValidation.create>;
export type UpdateCountryInput = z.infer<typeof CountryValidation.update>;
