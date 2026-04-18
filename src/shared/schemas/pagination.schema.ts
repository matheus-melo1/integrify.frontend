import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().max(100).default(10),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
