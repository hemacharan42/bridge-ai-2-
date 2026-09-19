import React from "react";
import { 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ArrowUpRight,
  Flame,
  Calendar,
  Sparkles
} from "lucide-react";
import { Course, UserProfile } from "../../types";
import { useScorecard } from "../../store/ScorecardContext";

interface StudentProgressSummaryProps {
  user?: UserProfile | null;
  course: Course;
  readinessScore?: number;
  onLaunchDrill: () => void;
  onOpenScorecard: () => void;
}

export const StudentProgressSummary: React.FC<StudentProgressSummaryProps> = ({
  user,
  course,
  readinessScore = 84.2,
  onLaunchDrill,
  onOpenScorecard,
}) => {
  const { uiLayoutPreference } = useScorecard();
  const userName = user?.name || "Trainee Candidate";
  const userId = user?.id || "ITI-2026-042";
  const userInstitution = user?.institution || "Government Industrial Training Institute (ITI) Pusa, New Delhi";
  const is3d = uiLayoutPreference === "3d-depth";

  return (
    <div 
      id="student-progress-summary-card"
      className={`relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/95 via-[#0a1220] to-slate-950 border border-slate-800 shadow-2xl overflow-hidden transition-all ${
        is3d ? "perspective-container-3d card-depth-3d" : "card-depth-flat"
      }`}
    >
      {/* Ambient Cosmic Radial Accents with particle dust glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Trainee Info & Job Readiness Status */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider font-bold">
              NSQF Level {course.nsqfLevel} • {course.tradeCode}
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Verified In DGT Institutional Registry
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Roll: {userId}
            </span>
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold mb-1 flex items-center gap-1.5">
              <span>Government Industrial Training Institute (ITI)</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-normal">DGT Verified Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>{userName}</span>
              <span className="text-xs font-normal text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Trainee Batch 2026
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light mt-1 leading-relaxed">
              {userInstitution} • Enrolled in{" "}
              <strong className="text-white font-medium">{course.title}</strong>
            </p>
          </div>

          {/* Core Metric Highlights - 3 Floating Glass Metric Cards with Neon Readouts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* 1. Safety Adherence 92.0% */}
            <div 
              id="metric-safety-adherence"
              className={`p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 backdrop-blur-md shadow-lg transition-all ${
                is3d ? "hover:-translate-y-1 hover:shadow-emerald-500/15 hover:border-emerald-500/50" : ""
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Safety Adherence</div>
              <div className="text-xl font-mono font-extrabold text-emerald-400 mt-1 flex items-baseline gap-1">
                <span className={is3d ? "text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" : ""}>92.0%</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Zero electrocution hazard</span>
              </div>
            </div>

            {/* 2. Procedural Steps 89.0% */}
            <div 
              id="metric-procedural-steps"
              className={`p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md shadow-lg transition-all ${
                is3d ? "hover:-translate-y-1 hover:shadow-cyan-500/15 hover:border-cyan-500/50" : ""
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Procedural Steps</div>
              <div className="text-xl font-mono font-extrabold text-cyan-400 mt-1 flex items-baseline gap-1">
                <span className={is3d ? "text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" : ""}>89.0%</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>3 of 4 modules verified</span>
              </div>
            </div>

            {/* 3. Technical Viva 88.0% */}
            <div 
              id="metric-technical-viva"
              className={`p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 backdrop-blur-md shadow-lg transition-all ${
                is3d ? "hover:-translate-y-1 hover:shadow-amber-500/15 hover:border-amber-500/50" : ""
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Technical Viva</div>
              <div className="text-xl font-mono font-extrabold text-amber-400 mt-1 flex items-baseline gap-1">
                <span className={is3d ? "text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" : ""}>88.0%</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                <span>High verbal reasoning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Job-Readiness 3D Glass Circular Score Gauge & Actions */}
        <div 
          id="industry-readiness-panel"
          className={`w-full lg:w-80 shrink-0 p-5 rounded-3xl bg-slate-950/90 border border-cyan-500/30 shadow-2xl flex flex-col justify-between space-y-4 backdrop-blur-xl relative overflow-hidden transition-all ${
            is3d ? "float-metric-3d shadow-cyan-500/10" : ""
          }`}
        >
          {/* Subtle Backlighting */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Industry Readiness Index
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 font-bold">
              Market-Certified
            </span>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            {/* 3D Glass Circular Score Gauge */}
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${readinessScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-xl font-extrabold text-white tracking-tight">{readinessScore}%</span>
                <span className="text-[8px] text-cyan-400 uppercase font-bold tracking-wider">Ready</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-bold text-white flex items-center gap-1">
                <span>Tier-1 Qualified</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Verified for direct plant floor interview without probation.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 relative z-10">
            <button
              type="button"
              id="launch-assessment-drill-btn"
              onClick={onLaunchDrill}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer font-mono"
            >
              <Zap className="w-4 h-4 fill-current text-slate-950" />
              <span>Launch Assessment</span>
            </button>
            <button
              type="button"
              onClick={onOpenScorecard}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
              title="View full cryptographic NSQF report"
            >
              <Award className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
