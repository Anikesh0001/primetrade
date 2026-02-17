import { z } from "zod";

export const projectCreateSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200),
    description: z.string().min(10).max(2000),
    status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).optional()
  })
});

export const projectUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().min(10).max(2000).optional(),
    status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).optional()
  })
});

export const projectListSchema = z.object({
  query: z.object({
    status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional()
  })
});

export const projectIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
