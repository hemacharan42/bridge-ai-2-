import React, { useState } from "react";
import { useAssessment } from "../../store/assessmentContext";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Upload, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Barcode, 
  Clock, 
  Sparkles, 
  Eye, 
  Maximize2, 
  Volume2, 
  ChevronRight,
  Info,
  Layers,
  X
} from "lucide-react";
import { MillisecondVideoPlayer } from "../MillisecondVideoPlayer";
import { MicroEvidenceItem } from "../../types";

interface SideBySideAssessmentProps {
  onNavigateToScorecard: () => void;
}

/**
 * =========================================================================
 * FEATURE E: Side-by-Side Video Assessment Interface
 * - Dual-Pane Layout:
 *   Left Pane: AI Video Explanation / Tutorial Master Player.
 *   Right Pane: Trainee's Uploaded Video Player (Unedited Proof) with
 *               custom review scrubber and clickable AI timestamp markers.
 * - Anti-Tampering Prompt:
 *   Pre-flight checklist forcing the trainee to acknowledge physical barcode
 *   attachment before video upload can proceed.
 * =========================================================================
 */
export const SideBySideAssessment: React.FC<SideBySideAssessmentProps> = ({
  onNavigateToScorecard,
}) => {
  const { selectedCourse, activeReport, activeMarkerTimestampMs, setActiveMarker } = useAssessment();

  // Left Pane: Tutorial player state
  const [tutorialPlaying, setTutorialPlaying] = useState(false);
  const [tutorialTimeSec, setTutorialTimeSec] = useState(12);
  const [tutorialSpeed, setTutorialSpeed] = useState(1.0);

  // Right Pane: User upload & anti-tampering state
  const [hasAcknowledgedBarcode, setHasAcknowledgedBarcode] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MicroEvidenceItem | null>(
    activeReport.micro_evidence_timeline[0] || null
  );

  const barcodeId = "UID-2026-IND-8849-BARCODE";

  const handleMarkerClick = (marker: MicroEvidenceItem) => {
    setSelectedMarker(marker);
    setActiveMarker(marker.timestamp_ms);
  };

  const handleConfirmBarcodeAndUpload = () => {
    setHasAcknowledgedBarcode(true);
    setShowBarcodeModal(false);
  };

  const isViolation = selectedMarker?.type === "VIOLATION";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================
       * PAGE HEADER & BREADCRUMB
       * ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase">
              Dual-Pane Assessment
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {selectedCourse.tradeCode} • Practical Drill
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Side-by-Side Verification: {selectedCourse.currentTaskTitle || "Busbar & Contactor Assembly"}
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Compare master procedure tutorials directly alongside unedited 30fps evidence feeds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Barcode Status Badge */}
          <button
            type="button"
            onClick={() => setShowBarcodeModal(true)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
              hasAcknowledgedBarcode
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-amber-500/10 border-amber-500/30 text-amber-300"
            }`}
          >
            <Barcode className="w-4 h-4" />
            <span>{hasAcknowledgedBarcode ? "Barcode Attached: Verified" : "Verify Physical Barcode"}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToScorecard}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors"
          >
            View Scorecard
          </button>
        </div>
      </div>

      {/* ========================================================
       * DUAL-PANE SIDE-BY-SIDE VIDEO PLAYERS
       * Left: AI Tutorial Explanation Player
       * Right: User's Uploaded Video Player with AI Markers
       * ======================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ====================================================
         * LEFT PANE: AI TUTORIAL / EXPLANATION MASTER PLAYER
         * ==================================================== */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xs font-bold font-mono">
                AI
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Tutorial & Master Procedure</h3>
                <span className="text-[10px] font-mono text-slate-400">Benchmark Reference • NSQF Level {selectedCourse.nsqfLevel}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              <span className="text-slate-400">Speed:</span>
              {[0.5, 1.0, 1.5].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setTutorialSpeed(speed)}
                  className={`px-1.5 py-0.5 rounded ${
                    tutorialSpeed === speed ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* AI Tutorial Simulated Video Screen */}
          <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden group flex flex-col justify-between p-4">
            {/* Animated Technical Wireframe Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#082f4915_1px,transparent_1px),linear-gradient(to_bottom,#082f4915_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Top HUD */}
            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-cyan-300">
              <span className="bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                AI MASTER TUTORIAL: PHASE 02
              </span>
              <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                00:{tutorialTimeSec < 10 ? `0${tutorialTimeSec}` : tutorialTimeSec} / 01:20
              </span>
            </div>

            {/* Center Visual Diagram */}
            <div className="relative z-10 my-auto text-center space-y-2">
              <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <ShieldCheck className="w-10 h-10 animate-pulse" />
              </div>
              <div className="text-sm font-bold text-white">
                Mandatory PPE Protocol: 1000V Insulated Gloves
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-light">
                Always visually inspect EN 60903 / ASTM D120 class rating markings before contacting live terminals.
              </p>
            </div>

            {/* Bottom Scrubber Controls */}
            <div className="relative z-10 space-y-2 pt-2 bg-gradient-to-t from-slate-950/90 to-transparent">
              <div className="w-full h-1.5 rounded-full bg-slate-800 cursor-pointer overflow-hidden">
                <div
                  className="h-full bg-cyan-400"
                  style={{ width: `${(tutorialTimeSec / 80) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTutorialPlaying(!tutorialPlaying)}
                    className="p-1 rounded text-white hover:text-cyan-400"
                  >
                    {tutorialPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTutorialTimeSec(0)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px]">Chapter 2 of 4</span>
                </div>

                <span className="font-mono text-[10px] text-cyan-400">Master Audio Active</span>
              </div>
            </div>
          </div>

          {/* Tutorial Step-by-Step Guidance */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Benchmark Standard Steps
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Step 1 (00:05):</strong> Don Class 0 (1000V) electrical safety gloves and verify test stamp.
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Step 2 (00:25):</strong> Zero-calibrate True-RMS digital multimeter on known voltage source.
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Step 3 (00:50):</strong> Verify busbar torque to 2.5 Nm using calibrated torque driver.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
         * RIGHT PANE: USER'S UPLOADED PROOF VIDEO & AUDIT SCRUBBER
         * ==================================================== */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xs font-bold font-mono">
                CV
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Trainee Unedited Proof Video</h3>
                <span className="text-[10px] font-mono text-slate-400">
                  Physical Barcode: {barcodeId}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBarcodeModal(true)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Re-verify Barcode</span>
            </button>
          </div>

          {/* Full Custom Millisecond Video Player with Clickable AI Scrubber Markers */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            <MillisecondVideoPlayer
              activeTimestampMs={activeMarkerTimestampMs}
              timelineMarkers={activeReport.micro_evidence_timeline}
              onMarkerClick={handleMarkerClick}
              activeLabel={selectedMarker?.label}
              highlightBoundingBox={selectedMarker?.bounding_box_norm}
            />
          </div>

          {/* Active AI Violation / Confirmation Inspector */}
          {selectedMarker && (
            <div
              className={`p-3.5 rounded-2xl border text-xs transition-all ${
                isViolation
                  ? "bg-rose-950/30 border-rose-800/60 text-rose-200"
                  : "bg-emerald-950/30 border-emerald-800/60 text-emerald-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 font-bold font-mono text-[11px]">
                  {isViolation ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>
                    {isViolation ? "CRITICAL AUDIT VIOLATION" : "VERIFIED COMPETENCY STEP"}
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                  {(selectedMarker.timestamp_ms / 1000).toFixed(2)}s • Deduction: {selectedMarker.penalty_points} pts
                </span>
              </div>
              <p className="font-light text-slate-300 leading-relaxed">
                {selectedMarker.label} • Detected by {selectedMarker.source}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
       * FEATURE E ANTI-TAMPERING PRE-FLIGHT MODAL
       * Forces Trainee to Acknowledge Barcode Placement
       * ======================================================== */}
      {showBarcodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-slate-100 relative">
            <button
              type="button"
              onClick={() => setShowBarcodeModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Barcode className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                  Pre-Flight Security Check
                </span>
                <h3 className="text-lg font-bold text-white">Physical Barcode Verification</h3>
              </div>
            </div>

            {/* Barcode Visual Display */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-2">
              <div className="h-10 w-48 bg-white flex items-center justify-center px-4 rounded">
                {/* SVG Barcode Stripes */}
                <div className="flex items-center gap-1 w-full h-full py-1">
                  <div className="w-1 bg-black h-full" />
                  <div className="w-2 bg-black h-full" />
                  <div className="w-0.5 bg-black h-full" />
                  <div className="w-3 bg-black h-full" />
                  <div className="w-1 bg-black h-full" />
                  <div className="w-2 bg-black h-full" />
                  <div className="w-1.5 bg-black h-full" />
                  <div className="w-0.5 bg-black h-full" />
                  <div className="w-2.5 bg-black h-full" />
                  <div className="w-1 bg-black h-full" />
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest">
                {barcodeId}
              </span>
            </div>

            {/* Mandatory Anti-Tampering Acknowledgment Text */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed font-light">
              <p className="font-medium text-amber-300 mb-1">Zero-Impersonation Protocol:</p>
              "I have attached my unique User Barcode to the physical components at the start of the video and removed it at the end as proof of authenticity."
            </div>

            {/* Checkbox Acknowledgment */}
            <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-slate-300">
              <input
                type="checkbox"
                checked={hasAcknowledgedBarcode}
                onChange={(e) => setHasAcknowledgedBarcode(e.target.checked)}
                className="mt-0.5 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>
                I confirm that this unedited recording contains my verified physical barcode affixed to the circuit terminals throughout the duration of the practical test.
              </span>
            </label>

            {/* Confirm & Proceed Button */}
            <button
              type="button"
              disabled={!hasAcknowledgedBarcode}
              onClick={handleConfirmBarcodeAndUpload}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                hasAcknowledgedBarcode
                  ? "bg-gradient-to-r from-cyan-400 to-amber-400 text-slate-950 shadow-cyan-500/20 hover:opacity-95"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Attach Unedited Proof</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
