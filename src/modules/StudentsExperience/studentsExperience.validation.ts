import { z } from "zod";

export const StudentsExperienceValidation = {
  // Upsert StudentsExperience — used for both create and update
  upsert: z
    .object({
      videoUrl: z.string().url("Invalid URL format").optional(),
      status: z.enum(["active", "inactive"]).optional().default("active"),
    })
    .strict(),

  // Update StudentsExperience (partial)
  update: z
    .object({
      videoUrl: z.string().url("Invalid URL format").optional(),
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

export type UpsertStudentsExperienceInput = z.infer<
  typeof StudentsExperienceValidation.upsert
>;
export type UpdateStudentsExperienceInput = z.infer<
  typeof StudentsExperienceValidation.update
>;
