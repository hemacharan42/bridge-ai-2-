import React, { useState } from "react";
import { CandidateItem } from "../../types";
import { 
  X, 
  ShieldCheck, 
  Award, 
  Play, 
  CheckCircle2, 
  BookmarkCheck, 
  TrendingUp, 
  Sparkles, 
  Zap, 
  Layers, 
  ExternalLink,
  Download,
  AlertCircle,
  Clock,
  Video,
  ArrowRight
} from "lucide-react";

interface CandidateComparisonMatrixProps {
  candidates: CandidateItem[];
  onClose: () => void;
  onRemoveCandidate: (id: string) => void;
  onShortlistToggle: (id: string) => void;
  shortlistedIds: string[];
  onOpenDossier: (candidate: CandidateItem) => void;
}

/**
 * =========================================================================
 * SIDE-BY-SIDE CANDIDATE COMPARISON MATRIX
 * - Multi-column matrix comparing 2 to 4 candidates across dual-evidence dimensions
 * - Highlights top performers across Safety, Speed, Viva, and Composite score
 * - Direct timeline review access & comparative dossier export
 * =========================================================================
 */
export const CandidateComparisonMatrix: React.FC<CandidateComparisonMatrixProps> = ({
  candidates,
  onClose,
  onRemoveCandidate,
  onShortlistToggle,
  shortlistedIds,
  onOpenDossier,
}) => {
  const [highlightBest, setHighlightBest] = useState(true);

  if (candidates.length === 0) {
    return null;
  }

  // Calculate best-in-class values for highlighting
  const maxComposite = Math.max(...candidates.map((c) => c.composite_score));
  const maxSafety = Math.max(...candidates.map((c) => c.safety_score));
  const maxViva = Math.max(...candidates.map((c) => c.viva_speech_score || 0));
  const maxProcedural = Math.max(...candidates.map((c) => c.procedural_score || 0));

  const handleExportComparison = () => {
    const names = candidates.map((c) => c.name).join(", ");
    alert(`Exporting Comparative Audit Matrix PDF for: ${names}\nOfficial NSQF benchmark summary generated.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/90 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider font-bold">
                Recruiter Talent Acquisition Matrix
              </span>
              <span className="text-xs font-mono text-slate-400">
                Comparing {candidates.length} of 4 Max Candidates
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Side-by-Side Dual-Evidence Comparison</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h2>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Objective benchmark across physical sensor telemetry, computer vision safety logs, and viva-voce technical justification
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setHighlightBest(!highlightBest)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-all cursor-pointer ${
                highlightBest
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
              title="Toggle highlighting best performer for each benchmark"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Highlight Leaders</span>
            </button>

            <button
              type="button"
              onClick={handleExportComparison}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Close Comparison Matrix"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Matrix Table Area */}
        <div className="flex-1 overflow-auto py-4 -mx-2 px-2">
          <div className="min-w-[720px]">
            {/* Column Headers: Candidate Cards */}
            <div className="grid grid-cols-5 gap-3 mb-4 pb-4 border-b border-slate-800">
              <div className="col-span-1 flex flex-col justify-end p-2">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                  Competency Attribute
                </span>
              </div>

              {candidates.map((c) => {
                const isShortlisted = shortlistedIds.includes(c.candidate_id);
                return (
                  <div
                    key={c.candidate_id}
                    className="col-span-1 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 relative flex flex-col justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => onRemoveCandidate(c.candidate_id)}
                      className="absolute top-2 right-2 p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Remove candidate from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div>
                      <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">
                        Level {c.nsqf_level || 4}
                      </div>
                      <h4 className="text-sm font-bold text-white truncate pr-4">
                        {c.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-light truncate mt-0.5">
                        {c.institution}
                      </p>
                      <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                        {c.trade}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onShortlistToggle(c.candidate_id)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                          isShortlisted
                            ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                            : "bg-blue-600 hover:bg-blue-500 text-white"
                        }`}
                      >
                        <BookmarkCheck className="w-3 h-3" />
                        <span>{isShortlisted ? "Saved" : "Shortlist"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDossier(c)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Open full audit dossier"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Placeholder slots if fewer than 4 */}
              {Array.from({ length: 4 - candidates.length }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="col-span-1 p-4 rounded-2xl border border-dashed border-slate-800/80 flex flex-col items-center justify-center text-center text-slate-600 space-y-1"
                >
                  <Layers className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-mono">Empty Slot</span>
                  <span className="text-[10px] text-slate-600">Select another candidate to compare</span>
                </div>
              ))}
            </div>

            {/* Comparison Rows */}
            <div className="space-y-2">
              {/* Row 1: Composite Score */}
              <div className="grid grid-cols-5 gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 items-center">
                <div className="col-span-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Composite Score</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-light mt-0.5">
                    Weighted index (Safety 40%, Sequence 30%, Verbal 30%)
                  </div>
                </div>
                {candidates.map((c) => {
                  const isTop = highlightBest && c.composite_score === maxComposite;
                  return (
                    <div
                      key={c.candidate_id}
                      className={`col-span-1 p-2.5 rounded-xl border flex items-center justify-between ${
                        isTop
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                          : "bg-slate-900/60 border-slate-800/80 text-slate-200"
                      }`}
                    >
                      <span className="font-mono text-base font-extrabold">{c.composite_score}%</span>
                      {isTop && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase">
                          Leader
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Row 2: Safety & PPE Adherence */}
              <div className="grid grid-cols-5 gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 items-center">
                <div className="col-span-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Safety Adherence</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-light mt-0.5">
                    1000V Glove Donning &amp; Mains LOTO Isolation
                  </div>
                </div>
                {candidates.map((c) => {
                  const isTop = highlightBest && c.safety_score === maxSafety;
                  return (
                    <div
                      key={c.candidate_id}
                      className={`col-span-1 p-2.5 rounded-xl border flex items-center justify-between ${
                        isTop
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                          : "bg-slate-900/60 border-slate-800/80 text-slate-200"
                      }`}
                    >
                      <div>
                        <div className="font-mono text-sm font-bold">{c.safety_score}%</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {c.safety_score >= 90 ? "Zero Violations" : "Glove Violation Logged"}
                        </div>
                      </div>
                      {isTop && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                          Safe
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Row 3: Practical Execution Speed */}
              <div className="grid grid-cols-5 gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 items-center">
                <div className="col-span-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Speed Benchmark</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-light mt-0.5">
                    Cycle completion time vs industry norms
                  </div>
                </div>
                {candidates.map((c) => (
                  <div
                    key={c.candidate_id}
                    className="col-span-1 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-300">
                        {c.practical_speed_rank}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {c.task_execution_time || "32s"}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-light mt-0.5 truncate">
                      {c.verified_clip_duration}
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 4: Verbal Rationale & Speech Score */}
              <div className="grid grid-cols-5 gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 items-center">
                <div className="col-span-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-400" />
                    <span>Viva-Voce Speech</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-light mt-0.5">
                    Technical terminology &amp; justification
                  </div>
                </div>
                {candidates.map((c) => {
                  const vivaScore = c.viva_speech_score || 88;
                  const isTop = highlightBest && vivaScore === maxViva;
                  return (
                    <div
                      key={c.candidate_id}
                      className={`col-span-1 p-2.5 rounded-xl border flex items-center justify-between ${
                        isTop
                          ? "bg-blue-500/10 border-blue-500/40 text-blue-300"
                          : "bg-slate-900/60 border-slate-800/80 text-slate-200"
                      }`}
                    >
                      <span className="font-mono text-sm font-bold">{vivaScore}%</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {vivaScore >= 90 ? "Articulate" : "Competent"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Row 5: Procedural Tool Sequence */}
              <div className="grid grid-cols-5 gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 items-center">
                <div className="col-span-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span>Sequence &amp; Calibration</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-light mt-0.5">
                    Torque pull test &amp; wiring ferrule order
                  </div>
                </div>
                {candidates.map((c) => {
                  const procScore = c.procedural_score || 90;
                  const isTop = highlightBest && procScore === maxProcedural;
                  return (
                    <div
                      key={c.candidate_id}
                      className={`col-span-1 p-2.5 rounded-xl border flex items-center justify-between ${
                        isTop
                          ? "bg-purple-500/10 border-purple-500/40 text-purple-300"
                          : "bg-slate-900/60 border-slate-800/80 text-slate-200"
                      }`}
                    >
                      <span className="font-mono text-sm font-bold">{procScore}%</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Calibrated
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Row 6: Verified Skills & Key Competencies */}
              <div className="grid grid-cols-5 gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 items-start">
                <div className="col-span-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Verified Skills</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-light mt-0.5">
                    Vision-audited physical dexterity tasks
                  </div>
                </div>
                {candidates.map((c) => (
                  <div
                    key={c.candidate_id}
                    className="col-span-1 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1"
                  >
                    {(c.key_skills || ["Zero-Potential", "Torque Pull", "1000V Gloves"]).slice(0, 3).map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 truncate"
                      >
                        • {skill}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Row 7: Dual-Evidence Video Proof & Project Tier */}
              <div className="grid grid-cols-5 gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 items-center">
                <div className="col-span-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-400" />
                    <span>Audit Proof &amp; Tier</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-light mt-0.5">
                    Verified video drills on file
                  </div>
                </div>
                {candidates.map((c) => (
                  <div
                    key={c.candidate_id}
                    className="col-span-1 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-amber-400 font-bold">{c.project_upload_tier || "Gold Tier"}</span>
                      <span className="text-slate-400">{c.video_drills_count || 3} Drills</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenDossier(c)}
                      className="w-full py-1 px-2 rounded bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-[10px] font-mono text-blue-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Play Verification Clip</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Row 8: Hiring Verdict & Availability */}
              <div className="grid grid-cols-5 gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 items-center">
                <div className="col-span-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hiring Status</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-light mt-0.5">
                    NCVET clearance &amp; availability
                  </div>
                </div>
                {candidates.map((c) => {
                  const isCertified = c.verdict === "CERTIFIED_COMPETENT";
                  return (
                    <div
                      key={c.candidate_id}
                      className="col-span-1 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1"
                    >
                      <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isCertified
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      }`}>
                        {isCertified ? "Certified Competent" : "Remediating (Day 2/7)"}
                      </span>
                      <div className="text-[10px] text-slate-400 truncate">
                        {c.hiring_status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-4 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-mono text-slate-400">
            * All assessment metrics backed by unforgeable cryptographically signed sensor timestamps.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExportComparison}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download Comparative Dossier</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
