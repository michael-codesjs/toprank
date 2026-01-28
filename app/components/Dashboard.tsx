'use client';

import { motion } from 'framer-motion';
import { TrendUp, Warning2, Bag2, Star1, ExportSquare, LampOn, ArrowUp } from 'iconsax-react';
import { cn } from '../lib/utils';
import { usePipelineStore } from '../store/pipelineStore';

export default function Dashboard() {
  const { results, domain } = usePipelineStore();

  // Fallback if results aren't fully populated yet (should be by COMPLETE phase)
  const products = results?.top_products || [];
  const insights = results?.strategic_insights || [];

  const stats = {
    presence: results?.amazon_presence ? 'Dominant' : 'Weak',
    confidence: results?.confidence_level || 'N/A',
    category: results?.primary_category || 'Unidentified',
    count: results?.estimated_product_count || '0',
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getIcon = (iconName: string) => {
    if (iconName === 'TrendingUp') return TrendUp;
    if (iconName === 'AlertCircle') return Warning2;
    return LampOn;
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-7xl mx-auto space-y-6"
    >
      {/* Panel A: Executive Snapshot */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Amazon Presence"
          value={stats.presence}
          sub={results?.amazon_presence ? 'Top Tier' : 'Not Found'}
        />
        <StatCard label="Confidence Score" value={stats.confidence} sub="System Reliability" />
        <StatCard label="Primary Category" value={stats.category} sub={domain || 'Unknown'} />
        <StatCard label="Product Count" value={stats.count} sub="Active Listings" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-[600px]">
        {/* Panel B: Product Inventory (60% width -> col-span-6) */}
        <motion.div
          variants={item}
          className="lg:col-span-6 bg-[#0A0A0A] border border-[#333333] rounded-xl overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-[#333333] flex justify-between items-center bg-[#050505]">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Bag2 size={18} className="text-gray-400" color="currentColor" />
              Product Inventory
            </h3>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Top 5 by Vol</span>
          </div>

          <div className="overflow-auto flex-1 p-0">
            {products.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                No products found
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-[#0f0f0f] sticky top-0">
                  <tr>
                    <th className="px-6 py-3 font-medium">Product Name</th>
                    <th className="px-6 py-3 font-medium text-right">Price</th>
                    <th className="px-6 py-3 font-medium text-right">Rating</th>
                    <th className="px-6 py-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333333]">
                  {products.map((p: any, i: number) => (
                    <tr key={i} className="hover:bg-[#111111] transition-colors group">
                      <td className="px-6 py-4 font-medium text-white truncate max-w-[200px]">
                        {p.name}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-right font-mono">{p.price}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#111] border border-[#333] text-xs">
                          {p.rating}{' '}
                          <Star1
                            size={10}
                            variant="Bold"
                            className="text-yellow-500"
                            color="currentColor"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-white transition-colors inline-block"
                        >
                          <ExportSquare size={16} color="currentColor" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Panel C: Strategic Insights (40% width -> col-span-4) */}
        <motion.div
          variants={item}
          className="lg:col-span-4 flex flex-col gap-4 h-full overflow-hidden"
        >
          {/* Header purely for visual structure if needed, or just cards directly */}
          <div className="h-full flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {insights.map((insight: any, i: number) => {
              const Icon = getIcon(insight.icon);
              return (
                <div
                  key={i}
                  className="bg-[#0A0A0A] border border-[#333333] rounded-xl p-5 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-[#111] p-2 rounded-lg border border-[#333] group-hover:border-[#555] transition-colors">
                      <Icon size={20} className="text-white" variant="Bold" color="currentColor" />
                    </div>
                    <ArrowUp
                      size={16}
                      className="text-[#333] group-hover:text-white transition-colors rotate-45"
                      color="currentColor"
                    />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">{insight.title}</h4>
                  <p className="text-sm text-[#AAAAAA] leading-relaxed">{insight.content}</p>
                </div>
              );
            })}

            {insights.length === 0 && (
              <div className="p-4 border border-dashed border-[#333] rounded-xl flex items-center justify-center text-[#333] text-sm h-full min-h-[100px]">
                Waiting for analysis...
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-[#0A0A0A] border border-[#333333] p-5 rounded-xl flex flex-col justify-between h-32 hover:border-white/10 transition-colors">
      <span className="text-sm text-[#AAAAAA] font-medium uppercase tracking-wider">{label}</span>
      <div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-[#555555]">{sub}</div>
      </div>
    </div>
  );
}
