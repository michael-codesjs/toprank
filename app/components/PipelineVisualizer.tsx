'use client';

import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { useEffect, useState } from 'react';
import { Scan, Cpu, TickCircle, Timer1 } from 'iconsax-react';
import { cn } from '../lib/utils';

export default function PipelineVisualizer() {
  const { phase, logs } = usePipelineStore();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (phase === 'EXTRACTING') setCurrentStep(1);
    if (phase === 'ANALYZING') setCurrentStep(2);
    if (phase === 'COMPLETE') setCurrentStep(3);
  }, [phase]);

  const steps = [
    {
      label: 'Initializing',
      icon: (props: any) => <Timer1 {...props} className={props.className} color="currentColor" />,
    },
    {
      label: 'Deep Extraction',
      icon: (props: any) => <Scan {...props} className={props.className} color="currentColor" />,
    },
    {
      label: 'AI Analysis',
      icon: (props: any) => <Cpu {...props} className={props.className} color="currentColor" />,
    },
    {
      label: 'Report Ready',
      icon: (props: any) => (
        <TickCircle {...props} className={props.className} color="currentColor" />
      ),
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center space-y-12">
      {/* Stepper */}
      <div className="flex items-center justify-between w-full relative">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#333333] -z-10" />
        <motion.div
          className="absolute left-0 top-1/2 h-0.5 bg-white -z-10"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;
          const Icon = step.icon;

          return (
            <div key={index} className="flex flex-col items-center relative gap-2 bg-black px-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive ? '#FFFFFF' : '#0A0A0A',
                  borderColor: isActive ? '#FFFFFF' : '#333333',
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={cn(
                  'w-12 h-12 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-300',
                  isActive ? 'text-black' : 'text-[#555555]',
                )}
              >
                <Icon size={20} className={cn(isCurrent && 'animate-spin-slow')} />
              </motion.div>
              <span
                className={cn(
                  'text-xs font-medium tracking-wider uppercase absolute -bottom-8 whitespace-nowrap',
                  isActive ? 'text-white' : 'text-[#555555]',
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Terminal Status Card */}
      <div className="w-full relative min-h-[300px] bg-[#0A0A0A] border border-[#333333] rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-sm max-w-2xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#333333] bg-[#0F0F0F] select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="text-xs text-[#555] font-medium tracking-wide">agent_process_v2.4</div>
          <div className="w-10" /> {/* Spacer for balance */}
        </div>

        {/* Terminal Output */}
        <div className="flex-1 p-6 overflow-y-auto min-h-[240px] flex flex-col justify-end items-start space-y-3">
          {logs.length === 0 && (
            <span className="text-[#444] animate-pulse">Waiting for input...</span>
          )}
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 w-full"
            >
              <span className="text-[#333] select-none shrink-0">
                {new Date().toLocaleTimeString('en-US', {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
              <span className="text-gray-300 break-words leading-relaxed">{log}</span>
            </motion.div>
          ))}
          {phase !== 'COMPLETE' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2.5 h-5 bg-white/50 ml-20"
            />
          )}
        </div>
      </div>
    </div>
  );
}
