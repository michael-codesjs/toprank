import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { analystAgent } from '../agents/analyst';
import { ExtractionSchema, InsightSchema } from '../schema';
import { searchAmazon } from '../../clients/serper';

const WorkflowState = z.object({
  domain: z.string().optional(),
  brandName: z.string().optional(),
  rawResults: z.any().optional(),
});

export const extractStep = createStep({
  id: 'extract',
  inputSchema: z.object({
    domain: z.string(),
  }),
  outputSchema: z.any(),
  stateSchema: WorkflowState,
  execute: async ({ inputData, setState }) => {
    const { domain } = inputData;

    if (!domain) {
      throw new Error('Domain not provided in inputData');
    }

    const brandName = domain.includes('.') ? domain.split('.')[0] : domain;

    console.log(`Workflow State: Searching Amazon for: ${brandName}`);
    const results = await searchAmazon(brandName);

    await setState({
      domain,
      brandName,
      rawResults: results,
    });

    return {
      success: true,
    };
  },
});

export const analyzeStep = createStep({
  id: 'analyze',
  inputSchema: z.any(),
  outputSchema: ExtractionSchema,
  stateSchema: WorkflowState,
  execute: async ({ state }: any) => {
    const brandName = state.brandName!;
    const domain = state.domain!;
    const rawResults = state.rawResults || [];

    console.log(`Analyzing results for ${brandName} (${rawResults.length} items found)`);

    const result = await analystAgent.generate(
      `Analyze these Amazon search results for the brand "${brandName}" (domain: ${domain}):
      
      ${JSON.stringify(rawResults)}
      
      Please provide a complete audit report following the schema.`,
      {
        structuredOutput: {
          schema: ExtractionSchema as any,
        },
      },
    );

    return result.object;
  },
});

export const brandAuditWorkflow = createWorkflow({
  id: 'brand-audit-workflow',
  inputSchema: z.object({
    domain: z.string(),
  }),
  stateSchema: WorkflowState,
  outputSchema: ExtractionSchema,
})
  .then(extractStep)
  .then(analyzeStep)
  .commit();
