import { z } from 'zod';

export const ServiceValidation = {
    // Create Service
    create: z.object({
        title: z.string().min(2, 'Title must be at least 2 characters').max(200),
        description: z.string().min(5),
        icon: z.string().optional(),
    }).strict(),

    // Update Service
    update: z.object({
        title: z.string().min(2).max(200).optional(),
        description: z.string().min(5).optional(),
        icon: z.string().optional(),
    }).strict(),

    // Params validation
    params: {
        id: z.object({
            id: z.string().uuid('Invalid ID format'),
        }),
    }
};

export type CreateServiceInput = z.infer<typeof ServiceValidation.create>;
export type UpdateServiceInput = z.infer<typeof ServiceValidation.update>;
