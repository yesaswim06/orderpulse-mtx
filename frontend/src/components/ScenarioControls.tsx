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
    <div className="bg-trading-card border border-trading-border rounded-xl p-3 mb-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Interactive Jury Demos:
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Execute key scenarios with one click
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Scenario 1: Normal Matching */}
          <button
            onClick={() => handleRun('normal')}
            disabled={disabled || loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>1. Normal Match</span>
          </button>

          {/* Scenario 2: Partial Fill */}
          <button
            onClick={() => handleRun('partial_fill')}
            disabled={disabled || loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Partial Fill</span>
          </button>

          {/* Scenario 3: Price Shock */}
          <button
            onClick={() => handleRun('price_shock')}
            disabled={disabled || loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>3. Price Shock (Halt)</span>
          </button>

          {/* Scenario 4: Order Burst */}
          <button
            onClick={() => handleRun('burst')}
            disabled={disabled || loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>4. 50-Order Burst</span>
          </button>

          {/* Reset */}
          <button
            onClick={() => handleRun('reset')}
            disabled={loadingScenario !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all cursor-pointer"
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
