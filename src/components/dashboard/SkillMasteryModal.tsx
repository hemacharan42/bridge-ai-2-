import React from "react";
import {
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  Share2,
  Download,
  ExternalLink,
  Video,
  FileCheck,
  Building2,
  QrCode,
  Flame
} from "lucide-react";
import { Course } from "../../types";

export interface SkillMasteryItem {
  skillName: string;
  moduleIndex: number;
  moduleTitle: string;
  is100Percent: boolean;
  completionPercent: number;
  course: Course;
  nsqfCode: string;
  verificationDate: string;
  visionScore: number;
  sequenceScore: number;
  verbalScore: number;
  digitalHash: string;
}

interface SkillMasteryModalProps {
  badge: SkillMasteryItem | null;
  onClose: () => void;
  onViewEvidence?: () => void;
}

export const SkillMasteryModal: React.FC<SkillMasteryModalProps> = ({
  badge,
  onClose,
  onViewEvidence,
}) => {
  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Animated ambient gold radiance */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${
                badge.is100Percent
                  ? "bg-gradient-to-br from-amber-500 to-yellow-600 border-amber-300 text-slate-950 animate-badge-glow"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              <Award className="w-7 h-7 fill-current" />
            </div>
            {badge.is100Percent && (
              <span className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-400 text-slate-950 shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-current animate-spin" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                NSQF Level {badge.course.nsqfLevel} Mastery Badge
              </span>
              {badge.is100Percent ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> 100% Verified
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {badge.completionPercent}% In Progress
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white mt-1 leading-tight">
              {badge.skillName}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Course: {badge.course.title}
            </p>
          </div>
        </div>

        {/* 100% Shine Showcase Card */}
        {badge.is100Percent ? (
          <div className="relative p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/50 overflow-hidden shadow-inner space-y-3">
            {/* Sweeping Specular Shine Ray */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none animate-badge-shine" />

            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Certified Competency Unlocked</span>
              </span>
              <span className="font-mono text-amber-400 text-xs font-extrabold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                GRADE A+ • 100%
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Full practical mastery verified through dual-evidence AI safety vision audit and verbal technical justification. Endorsed for enterprise hiring pools.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Module Completion</span>
              <span className="text-cyan-400 font-bold">{badge.completionPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-400"
                style={{ width: `${badge.completionPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 font-light">
              Complete remaining practical checkpoints and viva questions in {badge.moduleTitle} to reach 100% and unlock the shining badge.
            </p>
          </div>
        )}

        {/* Evidence Breakdown Grid */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dual-Evidence Verification Breakdown</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-[10px] font-mono text-slate-400">PPE Safety</div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                {badge.is100Percent ? "100%" : `${badge.visionScore}%`}
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">Vision Agent</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-[10px] font-mono text-slate-400">Step Sequence</div>
              <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">
                {badge.is100Percent ? "100%" : `${badge.sequenceScore}%`}
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">NSQF Standard</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-[10px] font-mono text-slate-400">Verbal Viva</div>
              <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
                {badge.is100Percent ? "100%" : `${badge.verbalScore}%`}
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">Speech NLP</div>
            </div>
          </div>
        </div>

        {/* Verification Credentials & Digital Hash */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Industry Endorsement</span>
            </span>
            <span className="text-slate-200 font-semibold truncate max-w-[200px]">
              {badge.course.industryPartners[0] || "Schneider Electric"}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Competency Code</span>
            </span>
            <span className="text-cyan-400">{badge.nsqfCode}</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-slate-500" />
              <span>Verifiable Hash</span>
            </span>
            <span className="text-slate-500 truncate max-w-[170px]">
              {badge.digitalHash}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          {onViewEvidence && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewEvidence();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>View Evidence Recording</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              alert(`Badge credential ${badge.digitalHash} copied to clipboard for recruiter verification!`);
            }}
            className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Badge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
