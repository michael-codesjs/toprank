import 'dotenv/config';
import { Mastra } from '@mastra/core';
import { analystAgent } from './agents/analyst';
import { extractorAgent } from './agents/extractor';
import { brandAuditWorkflow } from './workflows';

export const mastra = new Mastra({
  agents: { analystAgent, extractorAgent },
  workflows: { brandAuditWorkflow },
  server: {
    port: 4111,
  },
});
