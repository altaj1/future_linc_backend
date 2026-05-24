import { z } from "zod";

export const WhyFuturelincValidation = {
  // Create WhyFuturelinc
  create: z
    .object({
      thambnail: z
        .string()
        .min(2, "Title must be at least 2 characters")
        .max(100),
      description: z.string().max(500).optional(),
      videoUrl: z.string().url("Invalid URL format").optional(),
      status: z.enum(["active", "inactive"]).optional().default("active"),
    })
    .strict(),
  upsert: z
    .object({
      title: z.string().min(2, "Title must be at least 2 characters").max(100),
      description: z.string().max(500).optional(),
      videoUrl: z.string().url("Invalid URL format").optional(),
      status: z.enum(["active", "inactive"]).optional().default("active"),
    })
    .strict(),
  // Update WhyFuturelinc
  update: z
    .object({
      title: z.string().min(2).max(100).optional(),
      description: z.string().max(500).optional(),
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

export type UpsertWhyFuturelincInput = z.infer<
  typeof WhyFuturelincValidation.upsert
>;
export type UpdateWhyFuturelincInput = z.infer<
  typeof WhyFuturelincValidation.update
>;
