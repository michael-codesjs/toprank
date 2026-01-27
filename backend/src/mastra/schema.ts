import { z } from 'zod';

export const ExtractionSchema = z.object({
  amazon_presence: z.boolean(),
  confidence_level: z.enum(['High', 'Medium', 'Low']),
  primary_category: z.string(),
  estimated_product_count: z.string(),
  top_products: z
    .array(
      z.object({
        name: z.string(),
        price: z.string(),
        rating: z.string(),
        url: z.string(),
      }),
    )
    .max(5),
  ranking_data: z.string().optional(),
});

export type ExtractionData = z.infer<typeof ExtractionSchema>;
