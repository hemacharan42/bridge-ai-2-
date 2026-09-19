import React, { useState } from "react";
import { useAssessment } from "../store/assessmentContext";
import { 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Clock, 
  User, 
  Video, 
  ChevronRight, 
  AlertTriangle,
  FileCheck
} from "lucide-react";

export const FacultyQueueView: React.FC = () => {
  const { reviewQueue, resolveQueueItem, setActiveMarker } = useAssessment();
  const [selectedId, setSelectedId] = useState(reviewQueue[0]?.id || "");
  const [facultyNote, setFacultyNote] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const selectedItem = reviewQueue.find((q) => q.id === selectedId) || reviewQueue[0];

  const handleDecision = (decision: "PASS" | "FAIL" | "RETAKE") => {
    if (!selectedItem) return;
    resolveQueueItem(selectedItem.id, decision, facultyNote);
    setSuccessToast(`Decision recorded: ${decision} for candidate ${selectedItem.candidate_name}`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
              RESPONSIBLE AI HUMAN-IN-THE-LOOP
            </span>
            <span className="text-xs font-mono text-slate-500">NSQF ASSESSOR TRIAGE</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Faculty Uncertainty Review Queue
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            When workshop illumination is low or camera angles are occluded (&gt;30%), Bridge emits <code className="text-amber-300 font-mono">STATUS: UNCERTAIN_EVIDENCE</code> to eliminate hallucinations.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
          Pending Audits: <span className="text-amber-400 font-bold">{reviewQueue.filter(q => q.status === "PENDING_FACULTY_DECISION").length}</span>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Grid: Queue List (Left) & Inspection Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Queue List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block px-1">
            Flagged Submissions Requiring Verification
          </span>

          <div className="space-y-2.5">
            {reviewQueue.map((item) => {
              const isSelected = item.id === selectedId;
              const isPending = item.status === "PENDING_FACULTY_DECISION";

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-purple-500/50 shadow-md shadow-purple-500/10"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.candidate_name}</h4>
                      <span className="text-[11px] font-mono text-slate-400">{item.candidate_id}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      isPending ? "bg-amber-500/15 text-amber-300 border border-amber-500/30" : "bg-emerald-500/15 text-emerald-300"
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 mb-2">
                    {item.task}
                  </div>

                  <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-[11px] text-amber-300/90 font-mono">
                    {item.flag_type}: {(item.timestamp_ms / 1000).toFixed(1)}s
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2">
                    <span>{item.trade_name}</span>
                    <span>{item.submitted_at}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): Selected Inspection Workspace */}
        {selectedItem && (
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block mb-1">
                  Evidence Deep-Audit Workspace
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {selectedItem.candidate_name} — {selectedItem.task}
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Timestamp: {(selectedItem.timestamp_ms / 1000).toFixed(2)}s ({selectedItem.timestamp_ms}ms)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
                <HelpCircle className="w-5 h-5 text-purple-400" />
              </div>
            </div>

            {/* Occlusion Warning Banner */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>AI Confidence Withheld: {selectedItem.flag_type}</span>
              </div>
              <p className="leading-relaxed">
                {selectedItem.reason}
              </p>
            </div>

            {/* Video Snapshot Inspection Frame */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Keyframe Extraction: Frame #{Math.round(selectedItem.timestamp_ms / 666)}</span>
                <span className="text-amber-400">Target Time: {(selectedItem.timestamp_ms / 1000).toFixed(1)}s</span>
              </div>

              {/* Simulated Frame Preview with Occlusion Overlay */}
              <div className="relative aspect-video w-full rounded-lg bg-black border border-slate-700 overflow-hidden flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="w-20 h-24 border-2 border-dashed border-amber-500/60 rounded bg-slate-900/60 mx-auto mb-2 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-amber-300">Occluded &gt;40%</span>
                  </div>
                  <span className="text-xs font-mono text-slate-300 block">
                    Candidate Torso Blocks Terminal Cage View
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Manual Trade Instructor Verification Mandated
                  </span>
                </div>
              </div>
            </div>

            {/* Evaluator Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Faculty Evaluation Remarks (Appended to Official NSQF Dossier)
              </label>
              <textarea
                rows={2}
                value={facultyNote}
                onChange={(e) => setFacultyNote(e.target.value)}
                placeholder="e.g., Verified conductor seated securely in cage terminal despite camera angle. Marking pass with angle correction note."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
              />
            </div>

            {/* Decision Actions Bar */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2.5">
              <button
                type="button"
                id="faculty-override-pass-btn"
                onClick={() => handleDecision("PASS")}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Override & Mark Pass</span>
              </button>

              <button
                type="button"
                id="faculty-uphold-fail-btn"
                onClick={() => handleDecision("FAIL")}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Uphold Violation (Fail)</span>
              </button>

              <button
                type="button"
                id="faculty-retake-btn"
                onClick={() => handleDecision("RETAKE")}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Request 45° Retake</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
