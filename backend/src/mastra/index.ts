import 'dotenv/config';
import { Mastra } from '@mastra/core';
import { extractorAgent } from './agents/extractor';

export const mastra = new Mastra({
  agents: { extractorAgent },
});
