import { z } from 'zod';

export const FaqValidation = {
    create: z.object({
        question: z.string().min(1, 'Question is required'),
        answer: z.string().min(1, 'Answer is required'),
    }),
    update: z.object({
        question: z.string().optional(),
        answer: z.string().optional(),
    }),
    params: {
        id: z.object({
            id: z.string().uuid('Invalid Faq ID format'),
        }),
    },
    updateSection: z.object({
        title: z.string().optional(),
    }),
};

export type CreateFaqInput = z.infer<typeof FaqValidation.create>;
export type UpdateFaqInput = z.infer<typeof FaqValidation.update>;
