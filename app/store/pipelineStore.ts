import { create } from 'zustand';

type PipelinePhase = 'IDLE' | 'EXTRACTING' | 'ANALYZING' | 'COMPLETE' | 'ERROR';

interface PipelineState {
  phase: PipelinePhase;
  logs: string[];
  domain: string;
  setPhase: (phase: PipelinePhase) => void;
  addLog: (log: string) => void;
  setDomain: (domain: string) => void;
  results: any | null;
  setResults: (results: any) => void;
  reset: () => void;
}

export const usePipelineStore = create<PipelineState>((set) => ({
  phase: 'IDLE',
  logs: [],
  domain: '',
  results: null,
  setPhase: (phase) => set({ phase }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  setDomain: (domain) => set({ domain }),
  setResults: (results) => set({ results }),
  reset: () => set({ phase: 'IDLE', logs: [], domain: '', results: null }),
}));
