import { analyzeStep } from '../src/mastra/workflows';

async function main() {
  console.log('Testing Step 2: Analysis...');

  const mockRawResults = [
    {
      position: 1,
      title: 'Patagonia: Sports & Outdoors',
      link: 'https://www.amazon.com/Sports-Outdoors-Patagonia/s?rh=n%3A3375251%2Cp_4%3APatagonia',
      snippet:
        'Patagonia 49343 Black HOLE DUFFEL Duffel Bag, 55L (Black Hole Duffle) TDT Navy Green, navy · Save 25%. Lowest price in 30 days. Add to cart.',
    },
    {
      position: 2,
      title: 'Patagonia: Clothing, Shoes & Jewelry',
      link: 'https://www.amazon.com/Clothing-Shoes-Jewelry-Patagonia/s?rh=n%3A7141123011%2Cp_49%3APatagonia',
      snippet:
        'Check each product page for other buying options. Price and other details may vary based on product size and color. Patagonia Refugio Day Pack 47928 BLK ...',
    },
  ];

  const mockParams = {
    // Workflow State as expected by the analyst step
    state: {
      brandName: 'Patagonia',
      domain: 'patagonia.com',
      rawResults: mockRawResults,
    },
    // Adding context and other params if needed
    context: {},
    runId: 'test-run-2',
  };

  try {
    // @ts-ignore
    const result = (await analyzeStep.execute(mockParams)) as any;

    console.log('\n--- Strategic Insights Report ---');
    console.log(JSON.stringify(result, null, 2));

    // Formatting as Markdown-ish if needed
    if (result.strategic_insights) {
      console.log('\n## Strategic Insights');
      result.strategic_insights.forEach((insight: any) => {
        console.log(`\n### ${insight.icon} ${insight.title}`);
        console.log(insight.content);
      });
    }
    console.log('-------------------------------\n');
  } catch (error) {
    console.error('Analysis Step Failed:', error);
  }
}

main();
