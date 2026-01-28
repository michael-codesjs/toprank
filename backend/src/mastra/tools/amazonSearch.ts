import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { searchAmazon } from '@/clients/serper';

const AmazonSearchInput = z.object({
  brandName: z.string(),
});

export const amazonSearchTool = createTool({
  id: 'amazonSearch',
  description: 'Searches Amazon for a brand name using SerpApi',
  inputSchema: AmazonSearchInput as any,
  execute: async ({ brandName }) => {
    // const { brandName } = input;
    try {
      const results = await searchAmazon(brandName);
      return results.map((result: any) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet,
      }));
    } catch (error) {
      console.error('Error in amazonSearchTool:', error);
      return [];
    }
  },
});
