import { z } from "zod";

export const BlogValidation = {
  // Create Blog
  create: z
    .object({
      title: z.string().min(2).max(200),
      slug: z.string().min(2).max(200).optional(),
      content: z.string(),
      excerpt: z.string().optional(),
      image: z.string().optional(),
      category: z.string().optional(),
      author: z.string().optional(),
      isPublished: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
      }, z.boolean().optional().default(false)),
    })
    .strict(),

  // Update Blog
  update: z
    .object({
      title: z.string().optional(),
      slug: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      image: z.string().optional(),
      category: z.string().optional(),
      author: z.string().optional(),
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

export type CreateBlogInput = z.infer<typeof BlogValidation.create>;
export type UpdateBlogInput = z.infer<typeof BlogValidation.update>;
