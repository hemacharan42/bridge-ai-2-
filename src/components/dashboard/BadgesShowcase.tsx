import React, { useState } from "react";
import { 
  Award, 
  ShieldCheck, 
  Video, 
  Zap, 
  Mic, 
  Flame, 
  Sun, 
  BatteryCharging, 
  Lock, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  X,
  Share2,
  Copy,
  Layers
} from "lucide-react";
import { GamificationBadge } from "../../types";
import { GAMIFICATION_BADGES } from "../../data/mockData";
import confetti from "canvas-confetti";

interface BadgesShowcaseProps {
  onPracticeDrill?: () => void;
}

export const BadgesShowcase: React.FC<BadgesShowcaseProps> = ({ onPracticeDrill }) => {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "UNLOCKED" | "LOCKED">("ALL");
  const [selectedBadge, setSelectedBadge] = useState<GamificationBadge | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const className = `w-5 h-5 ${unlocked ? "text-amber-400" : "text-slate-500"}`;
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck className={className} />;
      case "Video":
        return <Video className={className} />;
      case "Zap":
        return <Zap className={className} />;
      case "Mic":
        return <Mic className={className} />;
      case "Flame":
        return <Flame className={className} />;
      case "Sun":
        return <Sun className={className} />;
      case "BatteryCharging":
        return <BatteryCharging className={className} />;
      case "Award":
      default:
        return <Award className={className} />;
    }
  };

  const filteredBadges = GAMIFICATION_BADGES.filter((badge) => {
    if (activeFilter === "UNLOCKED") return badge.unlocked;
    if (activeFilter === "LOCKED") return !badge.unlocked;
    return true;
  });

  const unlockedCount = GAMIFICATION_BADGES.filter((b) => b.unlocked).length;

  const handleCopyHash = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>NSQF Skill Mastery &amp; Badges Showcase</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
              {unlockedCount} of {GAMIFICATION_BADGES.length} Unlocked
            </span>
          </div>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Cryptographically sealed credentials recognized by accredited vocational boards and enterprise hiring pools
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveFilter("ALL")}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeFilter === "ALL"
                ? "bg-slate-800 text-white font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All ({GAMIFICATION_BADGES.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("UNLOCKED")}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeFilter === "UNLOCKED"
                ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("LOCKED")}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeFilter === "LOCKED"
                ? "bg-slate-800 text-slate-200 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            In-Progress ({GAMIFICATION_BADGES.length - unlockedCount})
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            onClick={() => setSelectedBadge(badge)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
              badge.unlocked
                ? "bg-gradient-to-b from-slate-900/90 to-slate-950 border-amber-500/30 hover:border-amber-400/60 shadow-lg shadow-amber-500/5 hover:-translate-y-0.5"
                : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40"
            }`}
          >
            {/* Top Bar: Icon + Category */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                    badge.unlocked
                      ? "bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border-amber-500/40 shadow-sm shadow-amber-500/20 group-hover:scale-110"
                      : "bg-slate-800/50 border-slate-700 text-slate-600"
                  }`}
                >
                  {getBadgeIcon(badge.icon, badge.unlocked)}
                </div>

                {badge.unlocked ? (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    VERIFIED
                  </span>
                ) : (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    {badge.progressPercent}%
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                {badge.title}
              </h4>
              <p className="text-[11px] text-slate-400 font-light mt-1 line-clamp-2 leading-relaxed">
                {badge.description}
              </p>
            </div>

            {/* Bottom Progress or Earned Date */}
            <div className="pt-3 mt-3 border-t border-slate-800/80">
              {badge.unlocked ? (
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-amber-400/90 font-medium">Earned {badge.earnedDate}</span>
                  <span className="text-slate-500">{badge.nsqfCode}</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Progress to unlock</span>
                    <span className="text-cyan-400 font-bold">{badge.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      style={{ width: `${badge.progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Badge Inspection Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative space-y-5">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badge Emblem Header */}
            <div className="flex items-center gap-4 pr-8">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${
                  selectedBadge.unlocked
                    ? "bg-gradient-to-br from-amber-500/25 to-yellow-500/15 border-amber-500/50 shadow-amber-500/20"
                    : "bg-slate-800/80 border-slate-700"
                }`}
              >
                {getBadgeIcon(selectedBadge.icon, selectedBadge.unlocked)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider font-bold">
                    {selectedBadge.category} BADGE
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedBadge.nsqfCode}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {selectedBadge.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-light">
              {selectedBadge.description}
            </p>

            {/* Verification Metadata Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">NSQF Qualification Standard:</span>
                <span className="text-slate-200 font-mono font-medium">{selectedBadge.nsqfCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={`font-mono font-bold ${selectedBadge.unlocked ? "text-emerald-400" : "text-amber-400"}`}>
                  {selectedBadge.unlocked ? `Unlocked on ${selectedBadge.earnedDate}` : `In Progress (${selectedBadge.progressPercent}%)`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Unlock Criteria:</span>
                <span className="text-slate-300 text-right max-w-[240px] text-[11px] font-light">
                  {selectedBadge.criteria}
                </span>
              </div>
              {selectedBadge.digitalHash && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-mono text-[11px]">Audit Hash:</span>
                  <span className="text-cyan-400 font-mono text-[10px] truncate max-w-[200px]">
                    {selectedBadge.digitalHash}
                  </span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleCopyHash(selectedBadge.digitalHash || selectedBadge.id)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? "Audit Hash Copied!" : "Copy Verification Proof"}</span>
              </button>

              {!selectedBadge.unlocked && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBadge(null);
                    onPracticeDrill?.();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Practice to Unlock</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
