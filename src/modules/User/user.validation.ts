import { z } from 'zod';
import { UserRole, AccountStatus } from '@/generated/prisma/client';

export const UserValidation = {
    create: z.object({
        email: z.string().email('Invalid email address'),
        username: z.string().optional(),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        password: z.string().min(6, 'Password needs to be at least 6 characters'),
        role: z.nativeEnum(UserRole).optional(),
        status: z.nativeEnum(AccountStatus).optional(),
        bio: z.string().optional(),
    }),
    update: z.object({
        email: z.string().email('Invalid email address').optional(),
        username: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        password: z.string().min(6).optional(),
        role: z.nativeEnum(UserRole).optional(),
        status: z.nativeEnum(AccountStatus).optional(),
        bio: z.string().optional(),
    }),
    params: {
        id: z.object({
            id: z.string().uuid('Invalid User ID format'),
        }),
    },
};

export type CreateUserInput = z.infer<typeof UserValidation.create>;
export type UpdateUserInput = z.infer<typeof UserValidation.update>;
