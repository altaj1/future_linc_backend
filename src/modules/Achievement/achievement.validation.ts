import { z } from 'zod';

export const AchievementValidation = {
    // Create Achievement
    create: z.object({
        title: z.string().min(2),
        description: z.string().min(5),
        image: z.string().optional(),
    }).strict(),

    // Update Achievement
    update: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
    }).strict(),

    // Params validation
    params: {
        id: z.object({
            id: z.string().uuid('Invalid ID format'),
        }),
    }
};

export type CreateAchievementInput = z.infer<typeof AchievementValidation.create>;
export type UpdateAchievementInput = z.infer<typeof AchievementValidation.update>;
