import { Router } from 'express';
import { mastra } from '../mastra';
import { ExtractionSchema } from '../mastra/schema';

const router = Router();

// Extraction endpoint
router.post('/extract', async (req, res) => {
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    const agent = mastra.getAgent('extractorAgent');

    // Extract brand name from domain (e.g., "nike.com" -> "nike")
    const brandName = domain.includes('.') ? domain.split('.')[0] : domain;

    console.log(`Starting extraction for brand: ${brandName} (domain: ${domain})`);

    const result = await agent.stream(
      `Execute analysis for domain: "${domain}". Brand recognized as: "${brandName}".`,
      {
        structuredOutput: {
          schema: ExtractionSchema,
        },
        maxSteps: 5,
      },
    );

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const partial of result.objectStream) {
      res.write(`data: ${JSON.stringify(partial)}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('API Extract Error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Extraction failed',
        message: error instanceof Error ? error.message : String(error),
      });
    } else {
      res.write(
        `data: ${JSON.stringify({ error: 'Extraction failed', message: error instanceof Error ? error.message : String(error) })}\n\n`,
      );
      res.end();
    }
  }
});

export default router;
