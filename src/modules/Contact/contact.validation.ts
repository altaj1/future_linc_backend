import { z } from "zod";

export const ContactValidation = {
  // Create Contact
  create: z
    .object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email address"),
      phone: z.string().optional(),
      address: z.string().optional(),
      message: z.string().min(10, "Message must be at least 10 characters"),
      status: z
        .enum(["pending", "resolved", "archived"])
        .optional()
        .default("pending"),
    })
    .strict(),

  // Update Contact
  update: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      message: z.string().optional(),
      status: z.enum(["pending", "resolved", "archived"]).optional(),
    })
    .strict(),

  // Params validation
  params: {
    id: z.object({
      id: z.string().uuid("Invalid ID format"),
    }),
  },
};

export type CreateContactInput = z.infer<typeof ContactValidation.create>;
export type UpdateContactInput = z.infer<typeof ContactValidation.update>;
