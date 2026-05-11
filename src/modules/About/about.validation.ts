import { z } from 'zod';

export const AboutValidation = {
    // Create About
    create: z.object({
        section: z.string().min(1, 'Section is required').max(100),
        title: z.string().max(255).optional(),
        content: z.string().optional(),
        content2: z.string().optional(),
        videoUrl: z.string().url().optional(),
    }).strict(),

    // Update About
    update: z.object({
        section: z.string().max(100).optional(),
        title: z.string().max(255).optional(),
        content: z.string().optional(),
        content2: z.string().optional(),
        videoUrl: z.string().url().optional().or(z.literal('')),
    }).strict(),

    // Params validation
    params: {
        id: z.object({
            id: z.string().uuid('Invalid ID format'),
        }),
    }
};

export type CreateAboutInput = z.infer<typeof AboutValidation.create>;
export type UpdateAboutInput = z.infer<typeof AboutValidation.update>;
