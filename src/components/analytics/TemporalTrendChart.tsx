import React, { useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Award, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Eye, 
  EyeOff,
  Info,
  ChevronRight
} from "lucide-react";
import { TrendDataPoint } from "../../types";
import { STUDENT_TREND_DATA } from "../../data/mockData";

interface TemporalTrendChartProps {
  data?: TrendDataPoint[];
}

export const TemporalTrendChart: React.FC<TemporalTrendChartProps> = ({
  data = STUDENT_TREND_DATA,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<"composite" | "safety" | "procedural" | "verbal">("composite");
  const [showPeerOverlay, setShowPeerOverlay] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<TrendDataPoint | null>(null);

  const getMetricKey = (item: TrendDataPoint) => {
    switch (selectedMetric) {
      case "safety":
        return item.safetyScore;
      case "procedural":
        return item.proceduralScore;
      case "verbal":
        return item.verbalScore;
      case "composite":
      default:
        return item.compositeScore;
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case "safety":
        return "PPE & Dielectric Safety Adherence";
      case "procedural":
        return "Procedural Step Execution";
      case "verbal":
        return "Technical Viva Articulation";
      case "composite":
      default:
        return "NSQF Composite Verification Score";
    }
  };

  // Chart dimensions & scaling
  const chartWidth = 720;
  const chartHeight = 240;
  const paddingX = 45;
  const paddingY = 30;

  const minScore = 40;
  const maxScore = 100;

  const getX = (idx: number) => {
    return paddingX + (idx / (data.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    const clamped = Math.max(minScore, Math.min(maxScore, val));
    return (
      chartHeight -
      paddingY -
      ((clamped - minScore) / (maxScore - minScore)) * (chartHeight - paddingY * 2)
    );
  };

  // Generate SVG path strings
  const studentPath = data.reduce((acc, curr, idx) => {
    const x = getX(idx);
    const y = getY(getMetricKey(curr));
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  // Area path for gradient fill
  const areaPath = `${studentPath} L ${getX(data.length - 1)} ${chartHeight - paddingY} L ${getX(0)} ${chartHeight - paddingY} Z`;

  const cohortPath = data.reduce((acc, curr, idx) => {
    const x = getX(idx);
    const y = getY(curr.cohortAverage);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  const topTenPath = data.reduce((acc, curr, idx) => {
    const x = getX(idx);
    const y = getY(curr.topTenAverage);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  const latestPoint = data[data.length - 1];
  const deltaFromCohort = Math.round((getMetricKey(latestPoint) - latestPoint.cohortAverage) * 10) / 10;

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
      {/* Header & Metric Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Temporal Trend &amp; Peer Benchmarking</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
              8-Week Cohort Progression
            </span>
          </div>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Plotting individual competency progression alongside cohort averages and top-decile benchmarks
          </p>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setSelectedMetric("composite")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedMetric === "composite"
                ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Composite
          </button>
          <button
            type="button"
            onClick={() => setSelectedMetric("safety")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedMetric === "safety"
                ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Safety PPE
          </button>
          <button
            type="button"
            onClick={() => setSelectedMetric("procedural")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedMetric === "procedural"
                ? "bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Procedure
          </button>
          <button
            type="button"
            onClick={() => setSelectedMetric("verbal")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedMetric === "verbal"
                ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Viva Verbal
          </button>
        </div>
      </div>

      {/* Benchmarking Comparison Strip */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Current Trainee</span>
            <span className="text-base font-bold text-cyan-400 font-mono">
              {getMetricKey(latestPoint)}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Cohort Average</span>
            <span className="text-base font-bold text-slate-300 font-mono">
              {latestPoint.cohortAverage}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Top 10% Decile</span>
            <span className="text-base font-bold text-amber-400 font-mono">
              {latestPoint.topTenAverage}%
            </span>
          </div>
          <div className="hidden sm:block pl-2 border-l border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Cohort Delta</span>
            <span className="text-xs font-bold text-emerald-400">
              +{deltaFromCohort}% Above Class Avg
            </span>
          </div>
        </div>

        {/* Peer Benchmarking Overlay Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPeerOverlay(!showPeerOverlay)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer ${
            showPeerOverlay
              ? "bg-slate-800 text-cyan-300 border-cyan-500/30"
              : "bg-slate-950 text-slate-500 border-slate-800"
          }`}
        >
          {showPeerOverlay ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
          <span>{showPeerOverlay ? "Peer Traces Active" : "Peer Traces Hidden"}</span>
        </button>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-64 select-none overflow-visible"
        >
          <defs>
            <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="chartLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[40, 60, 80, 100].map((score) => {
            const y = getY(score);
            return (
              <g key={score}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {score}%
                </text>
              </g>
            );
          })}

          {/* Peer Cohort Overlay Lines */}
          {showPeerOverlay && (
            <>
              {/* Cohort Avg Line (Dashed Slate) */}
              <path
                d={cohortPath}
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeDasharray="5 5"
                opacity="0.7"
              />

              {/* Top 10% Benchmark Line (Solid Amber) */}
              <path
                d={topTenPath}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                opacity="0.75"
              />
            </>
          )}

          {/* Student Filled Area */}
          <path d={areaPath} fill="url(#chartAreaGradient)" />

          {/* Student Main Line */}
          <path
            d={studentPath}
            fill="none"
            stroke="url(#chartLineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {data.map((point, idx) => {
            const x = getX(idx);
            const y = getY(getMetricKey(point));
            const isHovered = hoveredPoint?.week === point.week;

            return (
              <g
                key={point.week}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Invisible hit target */}
                <circle cx={x} cy={y} r="16" fill="transparent" />

                {/* Point Halo */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 7 : 4.5}
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />

                {/* X Axis Label */}
                <text
                  x={x}
                  y={chartHeight - 8}
                  fill={isHovered ? "#38bdf8" : "#94a3b8"}
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight={isHovered ? "bold" : "normal"}
                >
                  {point.week}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/40 shadow-xl text-xs space-y-1 mt-2 animate-in fade-in">
            <div className="flex items-center justify-between font-mono">
              <span className="text-cyan-400 font-bold">
                {hoveredPoint.week} ({hoveredPoint.date})
              </span>
              <span className="text-slate-400 text-[10px]">
                Milestone: {hoveredPoint.milestoneNote}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 font-mono text-[11px] pt-1">
              <div>
                <span className="text-slate-400 block text-[9px]">Trainee Score:</span>
                <span className="text-cyan-300 font-bold">{getMetricKey(hoveredPoint)}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Batch Avg:</span>
                <span className="text-slate-300">{hoveredPoint.cohortAverage}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Top 10% Benchmark:</span>
                <span className="text-amber-400">{hoveredPoint.topTenAverage}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1 bg-cyan-400 rounded-full" />
            <span className="text-slate-200">Trainee Progression</span>
          </div>
          {showPeerOverlay && (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-slate-400 border-b border-dashed border-slate-400" />
                <span>Class Average</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 bg-amber-400 rounded-full" />
                <span>Top 10% Decile</span>
              </div>
            </>
          )}
        </div>

        <span className="text-slate-500">
          Rank: 14th / 140 ITI Trainees (Top 10%)
        </span>
      </div>
    </div>
  );
};
