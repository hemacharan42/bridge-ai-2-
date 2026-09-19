import React, { useState } from "react";
import { useAssessment } from "../store/assessmentContext";
import { Course } from "../types";
import { 
  Zap, 
  Sun, 
  BatteryCharging, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Award,
  Sparkles,
  BookOpen,
  Video
} from "lucide-react";

interface StudentOnboardingModalProps {
  isOpen: boolean;
  onComplete: (action?: "join-course" | "test-case") => void;
}

export const StudentOnboardingModal: React.FC<StudentOnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { courses, completeOnboarding } = useAssessment();
  const [selectedId, setSelectedId] = useState<string>(courses[0].id);

  if (!isOpen) return null;

  const currentSelection = courses.find((c) => c.id === selectedId) || courses[0];

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case "Sun":
        return <Sun className="w-5 h-5 text-amber-400" />;
      case "BatteryCharging":
        return <BatteryCharging className="w-5 h-5 text-emerald-400" />;
      case "Cpu":
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case "Zap":
      default:
        return <Zap className="w-5 h-5 text-amber-400" />;
    }
  };

  const handleAction = (action: "join-course" | "test-case") => {
    completeOnboarding(selectedId);
    onComplete(action);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 mb-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            FIRST-TIME STUDENT ONBOARDING
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Select Your Primary Practical Trade Course
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
            Bridge pairs hands-on workbench video audits with verbal diagnostic articulation. Choose your qualification target to begin.
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="relative z-10 space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              High-Value Vocational Course Catalog (NSQF Level 4/5)
            </label>
            <select
              id="onboarding-course-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors font-medium cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white py-2">
                  {c.title} • [NSQF L{c.nsqfLevel}] • {c.durationHours} hrs
                </option>
              ))}
            </select>
          </div>

          {/* Selected Course Spotlight Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  {getCourseIcon(currentSelection.iconName)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">{currentSelection.title}</h3>
                  <span className="text-xs font-mono text-amber-400">
                    Trade Code: {currentSelection.tradeCode} • NSQF Level {currentSelection.nsqfLevel}
                  </span>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Industry Accredited
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {currentSelection.description}
            </p>

            {/* Practical Skills List */}
            <div className="mb-3">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                Core Verified Practical Competencies:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentSelection.skillsTaught.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Hiring Partners */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] text-slate-500 font-mono">Endorsing Employers:</span>
              <div className="flex items-center gap-2 text-slate-300 font-medium text-[11px]">
                {currentSelection.industryPartners.join(" • ")}
              </div>
            </div>
          </div>
        </div>

        {/* Dual Action Options: Join Course vs Test Case */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dual-modal audio + video evaluation standard active</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              id="onboarding-join-course-btn"
              onClick={() => handleAction("join-course")}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Join Course</span>
            </button>

            <button
              type="button"
              id="onboarding-test-case-btn"
              onClick={() => handleAction("test-case")}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Video className="w-4 h-4 fill-current" />
              <span>Test Case</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
