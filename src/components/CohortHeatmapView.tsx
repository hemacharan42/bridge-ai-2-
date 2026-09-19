import React, { useState } from "react";
import { COHORT_HEATMAP_DATA, STUDENT_TREND_DATA } from "../data/mockData";
import { 
  BarChart3, 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  TrendingDown, 
  FileSpreadsheet,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Filter,
  Check
} from "lucide-react";
import { CohortHeatmapData } from "../types";
import { DynamicRemediationDrawer } from "./analytics/DynamicRemediationDrawer";
import { TemporalTrendChart } from "./analytics/TemporalTrendChart";

interface CohortHeatmapViewProps {
  onLaunchAssessment?: () => void;
}

export const CohortHeatmapView: React.FC<CohortHeatmapViewProps> = ({ onLaunchAssessment }) => {
  const [selectedCompetency, setSelectedCompetency] = useState<CohortHeatmapData | null>(null);
  const [filterRisk, setFilterRisk] = useState<"ALL" | "CRITICAL" | "MODERATE">("ALL");
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  const filteredData = COHORT_HEATMAP_DATA.filter((item) => {
    if (filterRisk === "CRITICAL") return item.criticalSafetyRisk || item.failureRate >= 50;
    if (filterRisk === "MODERATE") return item.failureRate < 50;
    return true;
  });

  const handlePushBatchRemediation = () => {
    setBatchNotice("Batch micro-remediation assigned to 140 ITI student dashboard queues with 7-day completion countdown.");
    setTimeout(() => setBatchNotice(null), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
              INSTITUTIONAL COHORT ANALYTICS
            </span>
            <span className="text-xs font-mono text-slate-400">BATCH ITI-2026-N2 • 140 Trainees</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Cohort Practical Competency Failure Heatmap
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-light">
            Visualizing systemic shop-floor flaws across the batch. <strong className="text-cyan-300 font-medium">Click any competency block</strong> to open its targeted procedural guide, interactive scenario quiz, and 7-day remedial plan.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Trainees Evaluated</span>
            <span className="text-white font-bold text-sm">140</span>
          </div>
          <div className="h-7 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Average Pass Rate</span>
            <span className="text-emerald-400 font-bold text-sm">45.9%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Quick Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Filter By Risk:</span>
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setFilterRisk("ALL")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterRisk === "ALL" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All ({COHORT_HEATMAP_DATA.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterRisk("CRITICAL")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterRisk === "CRITICAL" ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Critical Risk
            </button>
            <button
              type="button"
              onClick={() => setFilterRisk("MODERATE")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterRisk === "MODERATE" ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Moderate
            </button>
          </div>
        </div>

        <span className="text-[11px] font-mono text-cyan-400/90 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Click any block for instant Remedial Guide &amp; Micro-Quiz</span>
        </span>
      </div>

      {/* Primary Heatmap Grid with Click Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item, idx) => {
          const isHighRisk = item.failureRate >= 50;
          const isMediumRisk = item.failureRate >= 35 && item.failureRate < 50;

          return (
            <div
              key={idx}
              onClick={() => setSelectedCompetency(item)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-1 hover:shadow-2xl ${
                item.criticalSafetyRisk
                  ? "bg-gradient-to-br from-slate-900 via-slate-900 to-[#1e1017] border-rose-900/50 hover:border-rose-500/70 shadow-rose-950/20"
                  : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 shadow-slate-950/40"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                    {item.competencyCode}
                  </span>
                  {item.criticalSafetyRisk && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      CRITICAL HAZARD
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-3">
                  {item.title}
                </h4>

                {/* Big Metric & Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Failure Rate:</span>
                    <span className={`text-xl font-extrabold font-mono ${
                      isHighRisk ? "text-rose-400" : isMediumRisk ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {item.failureRate}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${item.failureRate}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHighRisk
                          ? "bg-rose-500"
                          : isMediumRisk
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Primary Violation Cause */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs group-hover:border-slate-700 transition-colors">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                    Dominant Failure Cause
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                    {item.topViolationReason}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">{item.traineesTested} Tested</span>
                <span className="text-cyan-400 group-hover:underline flex items-center gap-1">
                  <span>Remediation</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Temporal Trend Chart with Peer Benchmarking Overlay */}
      <TemporalTrendChart data={STUDENT_TREND_DATA} />

      {/* Batch Remediation Notice Banner */}
      {batchNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{batchNotice}</span>
        </div>
      )}

      {/* Institutional Recommendation Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Recommended Workshop Curriculum Intervention</span>
          </h4>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-light">
            Due to the <strong>62% glove non-compliance rate</strong>, mandate Day 1 dielectric glove inspection drills at all 8 workshop benches before power isolation modules commence.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePushBatchRemediation}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 shrink-0 cursor-pointer"
        >
          <span>Push Batch Micro-Remediation</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Remediation Drawer Modal */}
      <DynamicRemediationDrawer
        competency={selectedCompetency}
        onClose={() => setSelectedCompetency(null)}
        onLaunchDrill={() => {
          setSelectedCompetency(null);
          onLaunchAssessment?.();
        }}
      />
    </div>
  );
};

