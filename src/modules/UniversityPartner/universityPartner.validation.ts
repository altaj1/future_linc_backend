import { z } from "zod";

export const UniversityPartnerValidation = {
  create: z.object({
    name: z.string().min(1, "Name is required"),
    countryId: z.string().uuid("Invalid Country ID format"),
  }),
  update: z.object({
    name: z.string().optional(),
    countryId: z.string().uuid("Invalid Country ID format").optional(),
  }),
  params: {
    id: z.object({
      id: z.string().uuid("Invalid UniversityPartner ID format"),
    }),
  },
};

export type CreateUniversityPartnerInput = z.infer<
  typeof UniversityPartnerValidation.create
>;
export type UpdateUniversityPartnerInput = z.infer<
  typeof UniversityPartnerValidation.update
>;
