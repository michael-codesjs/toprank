import { extractStep } from '../src/mastra/workflows';
import { mastra } from '../src/mastra';

async function main() {
  console.log('Testing Step 1: Extraction...');

  const mockParams = {
    inputData: { domain: 'patagonia.com' },
    // Mocking setState as required by the step's execute function
    setState: async (state: any) => {
      console.log('Step 1 called setState with:', JSON.stringify(state, null, 2));
    },
    // Adding context and other params if needed by Mastra internals
    context: {},
    runId: 'test-run-1',
  };

  try {
    // @ts-ignore - bypassing strict type check for independent execution
    const result = await extractStep.execute(mockParams);

    console.log('\n--- Output JSON ---');
    console.log(JSON.stringify(result, null, 2));
    console.log('-------------------\n');
  } catch (error) {
    console.error('Extraction Step Failed:', error);
  }
}

main();
