import React, { useState } from 'react';
import { Play, Flame, Layers, Sparkles, RotateCcw } from 'lucide-react';

interface ScenarioControlsProps {
  onTriggerScenario: (scenario: string) => Promise<void>;
  disabled: boolean;
}

export const ScenarioControls: React.FC<ScenarioControlsProps> = ({
  onTriggerScenario,
  disabled,
}) => {
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);

  const handleRun = async (scenario: string) => {
    try {
      setLoadingScenario(scenario);
      await onTriggerScenario(scenario);
    } finally {
      setLoadingScenario(null);
    }
  };

  return (
    <div className="glass-panel p-3 mb-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Interactive Scenarios:
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline ml-2">
              Execute deterministic simulation scenarios
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Scenario 1: Normal Matching */}
          <button
            onClick={() => handleRun('normal')}
            disabled={disabled || loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-md transition-all shadow-sm hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-emerald-400/40" />
            <span>1. Normal Match</span>
          </button>

          {/* Scenario 2: Partial Fill */}
          <button
            onClick={() => handleRun('partial_fill')}
            disabled={disabled || loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-300 text-xs font-semibold backdrop-blur-md transition-all shadow-sm hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Partial Fill</span>
          </button>

          {/* Scenario 3: Price Shock */}
          <button
            onClick={() => handleRun('price_shock')}
            disabled={disabled || loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-300 text-xs font-semibold backdrop-blur-md transition-all shadow-sm hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>3. Price Shock (Halt)</span>
          </button>

          {/* Scenario 4: Order Burst */}
          <button
            onClick={() => handleRun('burst')}
            disabled={disabled || loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-semibold backdrop-blur-md transition-all shadow-sm hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>4. 50-Order Burst</span>
          </button>

          {/* Reset */}
          <button
            onClick={() => handleRun('reset')}
            disabled={loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-400 hover:text-white text-xs font-medium backdrop-blur-md transition-all cursor-pointer"
            title="Clear and reset engine state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
