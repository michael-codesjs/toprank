'use client';

import { useState } from 'react';
import { Code1, CloseCircle, Copy, TickCircle } from 'iconsax-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const mockRawData = {
  meta: {
    target: 'patagonia.com',
    timestamp: '2026-01-27T23:14:00Z',
    agent_version: 'v2.4.1',
  },
  extraction: {
    source: 'SerperDev::GoogleShopping',
    depth: 'deep_crawl',
    nodes_visited: 142,
  },
  analysis: {
    model: 'claude-3-5-sonnet',
    tokens_in: 14520,
    tokens_out: 850,
    sentiment: 'positive',
    audit_score: 98,
  },
  inventory_snapshot: [
    { id: 'sku-9921', name: 'Better Sweater', stock_status: 'in_stock' },
    { id: 'sku-2210', name: 'Nano Puff', stock_status: 'low_stock' },
  ],
  insights_raw: [
    'Sustainability_Messaging_Gap::High_Confidence',
    'Price_Elasticity::Medium_Confidence',
    'Stock_Velocity::Warning',
  ],
};

export default function DeveloperDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(mockRawData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#0A0A0A] border border-[#333333] hover:border-white/40 text-xs text-[#AAAAAA] hover:text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all shadow-lg z-50 backdrop-blur-md"
      >
        <Code1 size={14} color="currentColor" />
        Show Raw JSON
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-999"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[500px] bg-[#050505] border-l border-[#333333] shadow-2xl z-1000 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-sm text-white">Latest Extract Logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-[#111] rounded-md transition-colors text-[#AAAAAA] hover:text-white"
                  >
                    {copied ? (
                      <TickCircle size={16} color="currentColor" />
                    ) : (
                      <Copy size={16} color="currentColor" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-[#111] rounded-md transition-colors text-[#AAAAAA] hover:text-white"
                  >
                    <CloseCircle size={16} color="currentColor" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-black">
                <pre className="text-xs font-mono leading-relaxed">
                  <code className="language-json text-gray-300">
                    {JSON.stringify(mockRawData, null, 2)}
                  </code>
                </pre>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
