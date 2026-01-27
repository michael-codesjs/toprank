import { Mastra } from '@mastra/core';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const mastra = new Mastra({
  agents: {},
});
