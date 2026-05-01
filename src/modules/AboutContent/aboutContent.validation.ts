import { z } from 'zod';

export const AboutContentValidation = {
    // Create AboutContent
    create: z.object({
        section: z.string().min(2),
        title: z.string().optional(),
        content: z.string().optional(),
        image: z.string().optional(),
        videoUrl: z.string().optional(),
    }).strict(),

    // Update AboutContent
    update: z.object({
        section: z.string().optional(),
        title: z.string().optional(),
        content: z.string().optional(),
        image: z.string().optional(),
        videoUrl: z.string().optional(),
    }).strict(),

    // Params validation
    params: {
        id: z.object({
            id: z.string().uuid('Invalid ID format'),
        }),
    }
};

export type CreateAboutContentInput = z.infer<typeof AboutContentValidation.create>;
export type UpdateAboutContentInput = z.infer<typeof AboutContentValidation.update>;
