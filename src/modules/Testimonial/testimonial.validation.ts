import { z } from 'zod';

export const TestimonialValidation = {
    create: z.object({
        name: z.string().min(1, 'Name is required'),
        role: z.string().optional(),
        content: z.string().min(1, 'Content is required'),
        rating: z.any().transform(Number).pipe(z.number().min(1).max(5)).optional(),
    }),
    update: z.object({
        name: z.string().optional(),
        role: z.string().optional(),
        content: z.string().optional(),
        rating: z.any().transform(Number).pipe(z.number().min(1).max(5)).optional(),
    }),
    params: {
        id: z.object({
            id: z.string().uuid('Invalid Testimonial ID format'),
        }),
    },
};

export type CreateTestimonialInput = z.infer<typeof TestimonialValidation.create>;
export type UpdateTestimonialInput = z.infer<typeof TestimonialValidation.update>;
