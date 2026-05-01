import { z } from 'zod';

export const TrackRecordValidation = {
    // Create TrackRecord
    create: z.object({
        value: z.string().min(1),
        label: z.string().min(2),
        icon: z.string().optional(),
        order: z.number().int().optional().default(0),
    }).strict(),

    // Update TrackRecord
    update: z.object({
        value: z.string().optional(),
        label: z.string().optional(),
        icon: z.string().optional(),
        order: z.number().int().optional(),
    }).strict(),

    // Params validation
    params: {
        id: z.object({
            id: z.string().uuid('Invalid ID format'),
        }),
    }
};

export type CreateTrackRecordInput = z.infer<typeof TrackRecordValidation.create>;
export type UpdateTrackRecordInput = z.infer<typeof TrackRecordValidation.update>;
