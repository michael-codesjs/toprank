'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'iconsax-react';
import { toast } from 'sonner';
import { usePipelineStore } from '../store/pipelineStore';
import PipelineVisualizer from '../components/PipelineVisualizer';
import Dashboard from '../components/Dashboard';
import DeveloperDrawer from '../components/DeveloperDrawer';

export default function Home() {
  const { phase, setPhase, addLog, setDomain, domain, reset } = usePipelineStore();
  const [inputValue, setInputValue] = useState('');

  // Handle running the audit simulation
  const handleRunAudit = async () => {
    if (!inputValue) {
      toast.error('Please enter a domain');
      return;
    }

    const domainRegex =
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    if (!domainRegex.test(inputValue)) {
      toast.error('Invalid domain format. Use format: domain.com');
      return;
    }

    setDomain(inputValue);
    setPhase('EXTRACTING');
    reset(); // clear previous results/logs but keep domain
    setDomain(inputValue);
    setPhase('EXTRACTING');

    addLog('Agent initialized with domain target: ' + inputValue);
    addLog('Connecting to backend workflow engine...');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: inputValue }),
      });

      if (!response.ok) throw new Error('Workflow failed');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '');
            try {
              const event = JSON.parse(dataStr);
              if (event.type === 'status') {
                addLog(event.message);
              } else if (event.type === 'phase') {
                setPhase(event.phase);
                addLog(event.message);
              } else if (event.type === 'result') {
                addLog('Strategic report generated successfully.');
                usePipelineStore.getState().setResults(event.data);
                setPhase('COMPLETE');
              } else if (event.type === 'error') {
                addLog('Error: ' + event.error);
                setPhase('IDLE');
              }
            } catch (e) {
              console.error('Error parsing SSE:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Audit failed:', error);
      addLog('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setPhase('IDLE');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRunAudit();
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden selection:bg-white selection:text-black">
      {/* Header - Always visible unless complete? Maybe minimalist header */}
      <header className="p-6 flex justify-end items-center absolute top-0 w-full z-10">
        {phase === 'COMPLETE' && (
          <button
            onClick={reset}
            className="text-xs text-[#AAAAAA] hover:text-white transition-colors border border-[#333] px-3 py-1.5 rounded-full"
          >
            New Audit
          </button>
        )}
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <AnimatePresence mode="wait">
          {/* PHASE 0: IDLE (INPUT) */}
          {phase === 'IDLE' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl text-center flex flex-col items-center space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight select-none">
                  AGENTIC AUDIT
                </h1>
                <p className="text-white/40 text-lg md:text-xl font-light tracking-tight max-w-lg mx-auto leading-relaxed">
                  Edit a brands amazon presense with AI.
                </p>
              </div>

              <div className="w-full max-w-lg space-y-6 flex flex-col items-center">
                <div className="relative w-full group">
                  <div className="relative flex flex-col items-center gap-6">
                    <div className="relative w-full flex items-stretch bg-[#0A0A0A] border border-[#333333] hover:border-[#555] focus-within:border-white/50 rounded-2xl transition-all duration-300 overflow-hidden">
                      <div className="pl-6 flex items-center justify-center">
                        <span className="text-[#444] font-mono text-sm select-none">https://</span>
                      </div>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) =>
                          setInputValue(e.target.value.toLowerCase().replace(/https?:\/\//, ''))
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="domain.com"
                        className="bg-transparent border-none outline-none text-white px-4 py-4 flex-1 placeholder:text-[#333] text-lg font-normal tracking-normal focus:ring-0"
                        autoFocus
                        autoCapitalize="none"
                        spellCheck={false}
                      />
                    </div>

                    <button
                      onClick={handleRunAudit}
                      className="group relative px-20 flex items-center justify-center gap-3 bg-white text-black py-4 font-bold rounded-full transition-all duration-300 hover:bg-[#e5e5e5] active:scale-[0.98]"
                    >
                      Run Audit
                      <ArrowRight
                        size={20}
                        variant="Linear"
                        className="group-hover:translate-x-1 transition-transform duration-300"
                        color="currentColor"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-8 opacity-20">
                <div className="w-px h-12 bg-linear-to-b from-white to-transparent mx-auto"></div>
              </div>
            </motion.div>
          )}

          {/* PHASE 1 & 2: PIPELINE VISUALIZER */}
          {(phase === 'EXTRACTING' || phase === 'ANALYZING') && (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <PipelineVisualizer />
            </motion.div>
          )}

          {/* PHASE 3: DASHBOARD */}
          {phase === 'COMPLETE' && (
            <motion.div
              key="dashboard"
              className="w-full h-full pt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DeveloperDrawer />
    </main>
  );
}
