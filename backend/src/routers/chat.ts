import { Router } from 'express';
import { mastra } from '../mastra';

const router = Router();

router.post('/workflow', async (req: any, res: any) => {
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const workflow = mastra.getWorkflow('brandAuditWorkflow');

    // Notify start
    res.write(`data: ${JSON.stringify({ type: 'status', message: 'Workflow initialized' })}\n\n`);

    // Execute workflow using the Streaming Run API
    console.log(`Executing workflow for domain: ${domain}`);
    const run = await workflow.createRun();

    try {
      const { fullStream } = await run.stream({
        inputData: { domain },
        initialState: {
          domain,
          brandName: '',
          rawResults: [],
        },
      });

      let finalAnalyzeResult = null;

      for await (const event of fullStream as any) {
        console.log(`Workflow Event: ${event.type}`, event.payload?.id);

        if (event.type === 'workflow-step-start') {
          const stepId = event.payload?.id;
          if (stepId === 'extract') {
            res.write(
              `data: ${JSON.stringify({ type: 'phase', phase: 'EXTRACTING', message: 'Initiating data extraction from Amazon...' })}\n\n`,
            );
          } else if (stepId === 'analyze') {
            res.write(
              `data: ${JSON.stringify({ type: 'phase', phase: 'ANALYZING', message: 'Handing off to AI for strategic analysis...' })}\n\n`,
            );
          }
        } else if (event.type === 'workflow-step-result') {
          const stepId = event.payload?.id;
          if (stepId === 'analyze') {
            finalAnalyzeResult = event.payload?.output;
          }
        }
      }

      console.log('Workflow Streaming Complete');

      // Send final result
      if (finalAnalyzeResult) {
        res.write(`data: ${JSON.stringify({ type: 'result', data: finalAnalyzeResult })}\n\n`);
      } else {
        res.write(
          `data: ${JSON.stringify({ type: 'error', error: 'Analysis result not found in stream' })}\n\n`,
        );
      }
      res.end();
    } catch (streamError: any) {
      console.error('Streaming Error:', streamError);
      res.write(
        `data: ${JSON.stringify({ type: 'error', error: streamError?.message || 'Workflow streaming failed' })}\n\n`,
      );
      res.end();
    }
  } catch (error) {
    console.error('Workflow failed:', error);
    // If headers already sent, execute write.
    res.write(`data: ${JSON.stringify({ type: 'error', error: 'Workflow failed' })}\n\n`);
    res.end();
  }
});

export default router;
