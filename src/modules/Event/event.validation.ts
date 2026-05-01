import { z } from "zod";

export const EventValidation = {
  // Create Event
  create: z
    .object({
      title: z.string().min(2, "Title must be at least 2 characters").max(200),
      description: z.string().min(5),
      date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format",
        })
        .transform((val) => new Date(val)),
      location: z.string().optional(),
      image: z.string().optional(),
      isPublished: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
      }, z.boolean().optional().default(false)),
    })
    .strict(),

  // Update Event
  update: z
    .object({
      title: z.string().min(2).max(200).optional(),
      description: z.string().min(5).optional(),
      date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format",
        })
        .transform((val) => new Date(val))
        .optional(),
      location: z.string().optional(),
      image: z.string().optional(),
      isPublished: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
      }, z.boolean().optional().default(false)),
    })
    .strict(),

  // Params validation
  params: {
    id: z.object({
      id: z.string().uuid("Invalid ID format"),
    }),
  },
};

export type CreateEventInput = z.infer<typeof EventValidation.create>;
export type UpdateEventInput = z.infer<typeof EventValidation.update>;
