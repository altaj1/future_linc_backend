import { z } from "zod";

export const ClientSayValidation = {
  // Create ClientSay
  create: z
    .object({
      description: z.string().max(500).optional(),
      rating: z.number().min(1).max(5).optional().default(5),
      status: z.enum(["active", "inactive"]).optional().default("active"),
      userId: z.string().uuid("User ID must be a valid UUID").optional(),
    })
    .strict(),

  // Update ClientSay
  update: z
    .object({
      description: z.string().max(500).optional(),
      rating: z.number().min(1).max(5).optional(),
      status: z.enum(["active", "inactive"]).optional(),
    })
    .strict(),

  // Params validation
  params: {
    id: z.object({
      id: z.string().uuid("Invalid ID format"),
    }),
  },
};

export type CreateClientSayInput = z.infer<typeof ClientSayValidation.create>;
export type UpdateClientSayInput = z.infer<typeof ClientSayValidation.update>;
