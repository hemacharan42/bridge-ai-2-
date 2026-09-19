import React from "react";
import { 
  Filter, 
  X, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  Award, 
  SlidersHorizontal,
  Building2,
  Zap,
  TrendingUp
} from "lucide-react";

export interface RecruiterFilterState {
  searchQuery: string;
  selectedTrades: string[];
  selectedInstitutions: string[];
  minCompositeScore: number;
  minSafetyScore: number;
  verdictFilter: "all" | "CERTIFIED_COMPETENT" | "CONDITIONAL_REMEDIATION_REQUIRED";
  selectedTiers: string[];
  speedRanks: string[];
  showShortlistOnly: boolean;
}

interface AdvancedFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: RecruiterFilterState;
  onFilterChange: (filters: RecruiterFilterState) => void;
  onResetFilters: () => void;
  availableTrades: string[];
  availableInstitutions: string[];
  totalCandidatesCount: number;
  filteredCount: number;
}

/**
 * =========================================================================
 * MULTI-SELECT ADVANCED FILTER DRAWER FOR RECRUITERS
 * - Fine-grained multi-select criteria across trades, institutions, and competencies
 * - Sliders for composite and safety score thresholds
 * - Instant live preview count with quick-reset
 * =========================================================================
 */
export const AdvancedFilterDrawer: React.FC<AdvancedFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  availableTrades,
  availableInstitutions,
  totalCandidatesCount,
  filteredCount,
}) => {
  if (!isOpen) return null;

  const toggleTrade = (trade: string) => {
    const updated = filters.selectedTrades.includes(trade)
      ? filters.selectedTrades.filter((t) => t !== trade)
      : [...filters.selectedTrades, trade];
    onFilterChange({ ...filters, selectedTrades: updated });
  };

  const toggleInstitution = (inst: string) => {
    const updated = filters.selectedInstitutions.includes(inst)
      ? filters.selectedInstitutions.filter((i) => i !== inst)
      : [...filters.selectedInstitutions, inst];
    onFilterChange({ ...filters, selectedInstitutions: updated });
  };

  const toggleTier = (tier: string) => {
    const updated = filters.selectedTiers.includes(tier)
      ? filters.selectedTiers.filter((t) => t !== tier)
      : [...filters.selectedTiers, tier];
    onFilterChange({ ...filters, selectedTiers: updated });
  };

  const toggleSpeedRank = (rank: string) => {
    const updated = filters.speedRanks.includes(rank)
      ? filters.speedRanks.filter((r) => r !== rank)
      : [...filters.speedRanks, rank];
    onFilterChange({ ...filters, speedRanks: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Advanced Filter Engine</h3>
              <p className="text-[11px] font-mono text-slate-400">
                Matching {filteredCount} of {totalCandidatesCount} Candidates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onResetFilters}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Form Controls */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {/* 1. Multi-Select Trades */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-white font-mono uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Trade Specialization</span>
              </label>
              {filters.selectedTrades.length > 0 && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, selectedTrades: [] })}
                  className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
                >
                  Clear ({filters.selectedTrades.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableTrades.map((trade) => {
                const isSelected = filters.selectedTrades.includes(trade);
                return (
                  <button
                    key={trade}
                    type="button"
                    onClick={() => toggleTrade(trade)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-500 font-bold shadow-sm shadow-blue-500/30"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                    <span>{trade}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Minimum Composite Score Threshold */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="font-bold text-white font-mono uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Min Composite Score</span>
              </label>
              <span className="font-mono text-amber-400 font-bold text-xs">
                {filters.minCompositeScore > 0 ? `≥ ${filters.minCompositeScore}%` : "Any"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={95}
              step={5}
              value={filters.minCompositeScore}
              onChange={(e) => onFilterChange({ ...filters, minCompositeScore: Number(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Any</span>
              <span>80%</span>
              <span>85%</span>
              <span>90%</span>
              <span>95%</span>
            </div>
          </div>

          {/* 3. Minimum Industrial Safety Score */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="font-bold text-white font-mono uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Min Safety Compliance</span>
              </label>
              <span className="font-mono text-emerald-400 font-bold text-xs">
                {filters.minSafetyScore > 0 ? `≥ ${filters.minSafetyScore}%` : "Any"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={98}
              step={5}
              value={filters.minSafetyScore}
              onChange={(e) => onFilterChange({ ...filters, minSafetyScore: Number(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Any</span>
              <span>75%</span>
              <span>85%</span>
              <span>90%</span>
              <span>98%</span>
            </div>
          </div>

          {/* 4. Accreditation Verdict */}
          <div className="space-y-2">
            <label className="font-bold text-white font-mono uppercase tracking-wider text-[11px]">
              Certification Status
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: "All Statuses", value: "all" },
                { label: "Certified Only", value: "CERTIFIED_COMPETENT" },
                { label: "Remediating", value: "CONDITIONAL_REMEDIATION_REQUIRED" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, verdictFilter: opt.value as any })}
                  className={`py-2 px-2 rounded-xl text-[10px] font-mono border text-center transition-all cursor-pointer ${
                    filters.verdictFilter === opt.value
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Project Upload Tier */}
          <div className="space-y-2">
            <label className="font-bold text-white font-mono uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              <span>Project Upload Tier</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {["Gold Tier (3+ Drills)", "Silver Tier (2 Drills)"].map((tier) => {
                const isSelected = filters.selectedTiers.includes(tier);
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => toggleTier(tier)}
                    className={`py-2 px-2.5 rounded-xl text-[10px] font-mono border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <span>{tier.split(" ")[0]}</span>
                    {isSelected && <Check className="w-3 h-3 text-purple-300" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Multi-Select Institutions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-white font-mono uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Partner ITI Institution</span>
              </label>
              {filters.selectedInstitutions.length > 0 && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, selectedInstitutions: [] })}
                  className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
                >
                  Clear ({filters.selectedInstitutions.length})
                </button>
              )}
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {availableInstitutions.map((inst) => {
                const isSelected = filters.selectedInstitutions.includes(inst);
                return (
                  <button
                    key={inst}
                    type="button"
                    onClick={() => toggleInstitution(inst)}
                    className={`w-full p-2 rounded-xl text-left text-[11px] border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-500/15 text-blue-300 border-blue-500/40 font-bold"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800/40 hover:text-slate-200"
                    }`}
                  >
                    <span className="truncate pr-2">{inst}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
          >
            Show {filteredCount} Results
          </button>
        </div>
      </div>
    </div>
  );
};
