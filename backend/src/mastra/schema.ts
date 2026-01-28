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
  strategic_insights: z
    .array(
      z.object({
        title: z.string(),
        content: z.string(),
        icon: z
          .enum(['Lightbulb', 'TrendingUp', 'AlertCircle'])
          .describe(
            "Icon mapping: 'Lightbulb' for opportunities, 'TrendingUp' for growth, 'AlertCircle' for warnings",
          ),
      }),
    )
    .optional()
    .describe('3 distinct strategic insights derived from the analysis'),
});

export type ExtractionData = z.infer<typeof ExtractionSchema>;

export const InsightSchema = z.object({
  strategic_insights: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
      icon: z.enum(['Lightbulb', 'TrendingUp', 'AlertCircle']),
    }),
  ),
});
