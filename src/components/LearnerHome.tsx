import React from "react";
import { useAssessment } from "../store/assessmentContext";
import { Course } from "../types";
import { 
  Zap, 
  Sun, 
  BatteryCharging, 
  Cpu, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Award,
  Sparkles,
  Layers,
  Plus
} from "lucide-react";

interface LearnerHomeProps {
  onStartAssessment: () => void;
  onViewScorecard: () => void;
  onOpenNewCourse: () => void;
}

export const LearnerHome: React.FC<LearnerHomeProps> = ({
  onStartAssessment,
  onViewScorecard,
  onOpenNewCourse
}) => {
  const { currentUser, selectedCourse, courses, selectCourse, activeReport } = useAssessment();

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

  const pendingRemediations = activeReport.seven_day_remediation_plan.filter(
    (item) => !item.completed
  ).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Welcome & Learner Status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#0c1220] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              RETURNING TRAINEE
            </span>
            <span className="text-xs font-mono text-slate-500">{currentUser?.institution || "Govt ITI Delhi"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser?.name || "Rajesh Kumar"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Your NSQF Level 4 training progress is synchronized. Ready to complete your MCB distribution wiring verification audit.
          </p>
        </div>

        {/* Quick Diagnostic Metrics */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <div className="text-center px-3 border-r border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Last Audit</span>
            <span className="text-base font-bold font-mono text-amber-400">
              {activeReport.composite_score}%
            </span>
          </div>
          <div className="text-center px-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Active Drills</span>
            <span className="text-base font-bold font-mono text-slate-200">
              {pendingRemediations} Left
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Continue Course Card (Addendum Section 2.2 & 3.2) */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                PENDING COURSE IN-PROGRESS
              </span>
              <span className="text-xs font-mono text-slate-400">
                NSQF Level {selectedCourse.nsqfLevel} • {selectedCourse.tradeCode}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {selectedCourse.title}
              </h3>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                {selectedCourse.description}
              </p>
            </div>

            {/* Progress Bar & Next Action Info */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">
                  Course Progress: <strong className="text-white">Module {selectedCourse.completedModules} of {selectedCourse.totalModules}</strong>
                </span>
                <span className="text-amber-400 font-bold">
                  {Math.round((selectedCourse.completedModules / selectedCourse.totalModules) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all"
                  style={{ width: `${(selectedCourse.completedModules / selectedCourse.totalModules) * 100}%` }}
                />
              </div>
            </div>

            {/* Next immediate task */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-slate-400">Next Practical Task:</span>
                <span className="font-semibold text-slate-200">{selectedCourse.currentTaskTitle}</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 shrink-0">Dual-Evidence Req.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              type="button"
              id="home-continue-course-btn"
              onClick={onStartAssessment}
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Continue Practical Assessment</span>
            </button>

            <button
              type="button"
              id="home-view-scorecard-btn"
              onClick={onViewScorecard}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Inspect Last Video Audit Scorecard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Course Catalog & "Start New Course" Row (Addendum Section 3.2) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-white tracking-tight">
              Vocational Practical Course Pathways
            </h4>
            <p className="text-xs text-slate-400">
              Enroll in additional trade competencies or start a new NSQF credential track.
            </p>
          </div>

          <button
            type="button"
            id="home-start-new-course-btn"
            onClick={onOpenNewCourse}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Start New Course</span>
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => {
            const isCurrent = course.id === selectedCourse.id;

            return (
              <div
                key={course.id}
                onClick={() => selectCourse(course.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  isCurrent
                    ? "bg-slate-900 border-amber-500/50 shadow-md shadow-amber-500/5"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        {getCourseIcon(course.iconName)}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-white leading-snug">{course.title}</h5>
                        <span className="text-[11px] font-mono text-amber-400">
                          {course.tradeCode} • NSQF L{course.nsqfLevel}
                        </span>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {course.skillsTaught.slice(0, 3).map((skill, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    {course.durationHours} Hours Practical
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectCourse(course.id);
                      onStartAssessment();
                    }}
                    className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                  >
                    <span>Launch Exercises</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
