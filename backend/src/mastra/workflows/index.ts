import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { analystAgent } from '../agents/analyst';
import { extractorAgent } from '../agents/extractor';
import { ExtractionSchema } from '../schema';
import { searchAmazon } from '../../clients/serper';

const WorkflowState = z.object({
  domain: z.string().optional(),
  brandName: z.string().optional(),
  rawResults: z.any().optional(),
  structuredData: z.any().optional(),
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

    console.log(`[Extract] Identifying brand from domain: ${domain}...`);

    // Ask the agent to identify the brand name from the URL
    const brandIdentity = await extractorAgent.generate(
      `Identify the core brand name from this URL: "${domain}". 
       Return ONLY the brand name (e.g., for "zambia.steers.africa" return "Steers", for "patagonia.com" return "Patagonia").`,
      {
        structuredOutput: {
          schema: z.object({
            brandName: z.string().describe('The core brand name identified from the URL'),
          }),
        },
      },
    );

    const brandName = brandIdentity.object.brandName;

    console.log(`[Extract] Searching Amazon for: ${brandName}`);
    const rawResults = await searchAmazon(brandName);

    console.log(`[Extract] Structuring data via AI...`);
    const result = await extractorAgent.generate(
      `Structure the following search results for brand "${brandName}" into clean JSON.
      
      Search Results: ${JSON.stringify(rawResults)}`,
      {
        structuredOutput: {
          schema: ExtractionSchema as any,
        },
      },
    );

    const structuredData = result.object;

    await setState({
      domain,
      brandName,
      rawResults,
      structuredData,
    });

    console.log(`[Extract] Data structured successfully.`);
    return structuredData;
  },
});

export const analyzeStep = createStep({
  id: 'analyze',
  inputSchema: z.any(),
  outputSchema: ExtractionSchema,
  stateSchema: WorkflowState,
  execute: async ({ state }: any) => {
    const brandName = state.brandName!;
    const structuredData = state.structuredData!;

    console.log(`[Analyze] Generatiing insights for ${brandName}...`);

    const result = await analystAgent.generate(
      `Analyze this structured Amazon data for the brand "${brandName}":
      
      ${JSON.stringify(structuredData)}
      
      Generate 3 strategic business insights based on this data and return the full completed report.`,
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
