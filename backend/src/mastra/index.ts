import 'dotenv/config';
import { Mastra } from '@mastra/core';
import { analystAgent } from './agents/analyst';
import { brandAuditWorkflow } from './workflows';

export const mastra = new Mastra({
  agents: { analystAgent },
  workflows: { brandAuditWorkflow },
});
