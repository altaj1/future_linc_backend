import { z } from 'zod';

export const CommitmentValidation = {
    // Create Commitment
    create: z.object({
        title: z.string().min(2, 'Title must be at least 2 characters').max(200),
        description: z.string().optional(),
        icon: z.string().optional(),
        order: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
        status: z.enum(['active', 'inactive']).optional().default('active'),
    }).strict(),

    // Update Commitment
    update: z.object({
        title: z.string().min(2).max(200).optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        order: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
        status: z.enum(['active', 'inactive']).optional(),
    }).strict(),

    // Params validation
    params: {
        id: z.object({
            id: z.string().uuid('Invalid ID format'),
        }),
    }
};

export type CreateCommitmentInput = z.infer<typeof CommitmentValidation.create>;
export type UpdateCommitmentInput = z.infer<typeof CommitmentValidation.update>;
