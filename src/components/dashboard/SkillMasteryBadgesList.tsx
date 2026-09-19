import React from "react";
import { Award, Sparkles, Lock, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { Course } from "../../types";
import { SkillMasteryItem } from "./SkillMasteryModal";

interface SkillMasteryBadgesListProps {
  course: Course;
  onSelectBadge: (badge: SkillMasteryItem) => void;
  compact?: boolean;
  onSimulateComplete?: (courseId: string, moduleIndex: number) => void;
}

export const SkillMasteryBadgesList: React.FC<SkillMasteryBadgesListProps> = ({
  course,
  onSelectBadge,
  compact = false,
  onSimulateComplete,
}) => {
  const completedCount = course.completedModules || 0;
  const skills = course.skillsTaught || [
    "Zero-Potential Verification",
    "1000V Dielectric Glove Usage",
    "Conductor Stripping Standards",
    "Terminal Torque Pull Test",
  ];

  const handleBadgeClick = (skillName: string, index: number, is100: boolean) => {
    const item: SkillMasteryItem = {
      skillName,
      moduleIndex: index + 1,
      moduleTitle: `Module ${index + 1}: ${skillName}`,
      is100Percent: is100,
      completionPercent: is100 ? 100 : (index === completedCount ? 65 : 0),
      course,
      nsqfCode: `NOS_${course.tradeCode || "TRD"}_MOD${index + 1}`,
      verificationDate: "2026-09-18",
      visionScore: is100 ? 100 : 72,
      sequenceScore: is100 ? 100 : 80,
      verbalScore: is100 ? 100 : 65,
      digitalHash: `0x${course.tradeCode.slice(0, 4)}_SKILL_${index + 1}_V992B`,
    };
    onSelectBadge(item);
  };

  const masteredCount = Math.min(completedCount, skills.length);

  return (
    <div className="space-y-2.5">
      {/* Header with Mastered Count */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-mono text-slate-300">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-slate-200">Interactive Skill Mastery Badges</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
          <span>
            {masteredCount}/{skills.length} Mastered (100%)
          </span>
        </span>
      </div>

      {/* Badges Flow / Grid */}
      <div className={`grid ${compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"} gap-2`}>
        {skills.map((skill, idx) => {
          const is100 = idx < completedCount;
          const isInProgress = idx === completedCount;

          return (
            <div
              key={`${course.id}-skill-${idx}`}
              className="relative group"
            >
              <button
                type="button"
                onClick={() => handleBadgeClick(skill, idx, is100)}
                title={is100 ? "Click to view 100% Skill Mastery Credential" : "Click to view competence requirements"}
                className={`w-full text-left p-2.5 rounded-xl border transition-all relative overflow-hidden flex items-center justify-between gap-2.5 cursor-pointer ${
                  is100
                    ? "bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-600/15 border-amber-400/60 text-amber-200 shadow-md shadow-amber-500/10 hover:border-amber-300 animate-badge-glow hover:scale-[1.02] active:scale-[0.98]"
                    : isInProgress
                    ? "bg-slate-950/70 border-cyan-500/40 text-slate-300 hover:border-cyan-400 hover:bg-slate-900"
                    : "bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400"
                }`}
              >
                {/* Continuous Diagonal Specular Shine Ray for 100% Completed Badges */}
                {is100 && (
                  <div
                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-badge-shine"
                    aria-hidden="true"
                  />
                )}

                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      is100
                        ? "bg-amber-400/20 text-amber-300 border-amber-400/50 animate-star-sparkle shadow-sm shadow-amber-400/50"
                        : isInProgress
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                        : "bg-slate-800/80 text-slate-500 border-slate-700"
                    }`}
                  >
                    {is100 ? (
                      <Award className="w-4 h-4 fill-amber-400/50 text-amber-300" />
                    ) : isInProgress ? (
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold truncate ${is100 ? "text-amber-100" : "text-white"}`}>
                        {skill}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono flex items-center gap-1 mt-0.5">
                      {is100 ? (
                        <span className="text-amber-400/90 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          <span>100% Mastered</span>
                        </span>
                      ) : isInProgress ? (
                        <span className="text-cyan-400">In Progress (65%)</span>
                      ) : (
                        <span className="text-slate-500">Locked • Module {idx + 1}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Pill or Shine Indicator */}
                <div className="shrink-0 flex items-center gap-1">
                  {is100 ? (
                    <span className="flex items-center gap-1 text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                      <Sparkles className="w-2.5 h-2.5 fill-current" />
                      <span>Shine</span>
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
              </button>

              {/* Quick toggle to simulate 100% completion if pending */}
              {onSimulateComplete && !is100 && isInProgress && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSimulateComplete(course.id, idx + 1);
                  }}
                  title="Simulate 100% completion in this module to see the badge shine"
                  className="mt-1 w-full text-[10px] font-mono text-cyan-400/90 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/20 hover:border-cyan-500/40 rounded-lg py-1 px-2 flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>Test 100% Pass to Unlock Shine</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
