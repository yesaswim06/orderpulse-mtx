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
    <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-white/10 rounded-2xl p-3 mb-4 shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-[10px] font-mono font-bold text-slate-700 dark:text-neutral-300">
            TEST SUITE
          </div>
          <div>
            <span className="text-xs font-bold font-mono text-slate-800 dark:text-neutral-200">
              Deterministic Matching Scenarios:
            </span>
            <span className="text-xs text-slate-500 dark:text-neutral-400 hidden sm:inline ml-2">
              Inject validated exchange test vectors
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Scenario 1: Normal Matching */}
          <button
            onClick={() => handleRun('normal')}
            disabled={disabled || loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[#00B386] text-xs font-mono font-semibold transition cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>1. Normal Match</span>
          </button>

          {/* Scenario 2: Partial Fill */}
          <button
            onClick={() => handleRun('partial_fill')}
            disabled={disabled || loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 text-slate-700 dark:text-neutral-300 text-xs font-mono font-semibold transition cursor-pointer disabled:opacity-50"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Partial Fill</span>
          </button>

          {/* Scenario 3: Price Shock */}
          <button
            onClick={() => handleRun('price_shock')}
            disabled={disabled || loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-xs font-mono font-semibold transition cursor-pointer disabled:opacity-50"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>3. Price Shock (Trip Halt)</span>
          </button>

          {/* Scenario 4: Order Burst */}
          <button
            onClick={() => handleRun('burst')}
            disabled={disabled || loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-semibold transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>4. 50-Order Burst</span>
          </button>

          {/* Reset */}
          <button
            onClick={() => handleRun('reset')}
            disabled={loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 text-slate-500 hover:text-black dark:hover:text-white text-xs font-mono font-medium transition cursor-pointer"
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
