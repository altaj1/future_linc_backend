import { z } from 'zod';

export const UniversityPartnerValidation = {
    create: z.object({
        name: z.string().min(1, 'Name is required'),
    }),
    update: z.object({
        name: z.string().optional(),
    }),
    params: {
        id: z.object({
            id: z.string().uuid('Invalid UniversityPartner ID format'),
        }),
    },
};

export type CreateUniversityPartnerInput = z.infer<typeof UniversityPartnerValidation.create>;
export type UpdateUniversityPartnerInput = z.infer<typeof UniversityPartnerValidation.update>;
