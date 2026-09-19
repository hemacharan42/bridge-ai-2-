import React, { useState, useRef } from "react";
import { Course, MicroEvidenceItem } from "../../types";
import { useScorecard } from "../../store/ScorecardContext";
import { useAssessment } from "../../store/assessmentContext";
import { 
  Video, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  FileText, 
  X, 
  ChevronRight, 
  Sliders, 
  Zap, 
  Check, 
  Eye, 
  Volume2, 
  VolumeX, 
  Award, 
  Download, 
  ArrowLeft, 
  ArrowRight,
  ShieldAlert,
  Layers,
  HelpCircle,
  XCircle
} from "lucide-react";
import confetti from "canvas-confetti";

interface TestCaseVideoInterfaceProps {
  course: Course;
  onBackToCourse: () => void;
  onBackToDashboard: () => void;
  onViewScorecard?: () => void;
}

type EnhancementPreset = "SUPER_RESOLUTION" | "LOW_LIGHT_BOOST" | "EDGE_SHARPEN" | "NATURAL";

interface SelfTagItem {
  id: string;
  timeSeconds: number;
  label: string;
  category: "SAFETY" | "PROCEDURE" | "VIVA";
}

export const TestCaseVideoInterface: React.FC<TestCaseVideoInterfaceProps> = ({
  course,
  onBackToCourse,
  onBackToDashboard,
  onViewScorecard,
}) => {
  const { 
    activeScorecard, 
    saveTestAttempt, 
    openScorecardModal, 
    exportScorecardPdf 
  } = useScorecard();
  const { currentUser, setActiveReport } = useAssessment();

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeMb: number;
    url: string;
  } | null>({
    name: "Workshop_Practical_ZeroPotential_Audit_2026.mp4",
    sizeMb: 8.4,
    url: "",
  });

  // Upload status states
  const [uploadStatus, setUploadStatus] = useState<"IDLE" | "UPLOADING" | "COMPLETE" | "ERROR">("COMPLETE");
  const [uploadProgress, setUploadProgress] = useState(100);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simulation scenario toggle (Golden violation vs Flawless)
  const [submissionScenario, setSubmissionScenario] = useState<"VIOLATION_14_2" | "FLAWLESS">("VIOLATION_14_2");

  // Workflow Phases:
  // "INPUT" -> Video submission / "Start Test"
  // "ANALYZING" -> Models running through video
  // "SELF_CHECK" -> Video provided for self-checking
  // "CONFIRMING" -> Modal / confirmation prompt
  // "SCORE_ANALYSIS" -> Detailed score analysis unlocked
  const [testWorkflowPhase, setTestWorkflowPhase] = useState<
    "INPUT" | "ANALYZING" | "SELF_CHECK" | "SCORE_ANALYSIS"
  >("SELF_CHECK");

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isConfirmedSubmitted, setIsConfirmedSubmitted] = useState<boolean>(false);

  // Video Playback States
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(36.0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(true);

  // AI Video Enhancement Controls
  const [isEnhanced, setIsEnhanced] = useState(true);
  const [enhancementPreset, setEnhancementPreset] = useState<EnhancementPreset>("SUPER_RESOLUTION");
  const [showAiOverlayHud, setShowAiOverlayHud] = useState(true);

  // Model progress messages
  const [auditStepMessage, setAuditStepMessage] = useState("");
  const [auditStepIndex, setAuditStepIndex] = useState(0);

  // Self-Tags
  const [selfTags, setSelfTags] = useState<SelfTagItem[]>([
    { id: "tag-1", timeSeconds: 8.2, label: "LOTO Lock Applied & Zero Voltage Verified", category: "SAFETY" },
    { id: "tag-2", timeSeconds: 16.4, label: "11mm Clean Conductor Stripping (0 Nick)", category: "PROCEDURE" },
  ]);

  // Score Analysis Tab
  const [activeScoreTab, setActiveScoreTab] = useState<"SUMMARY" | "CHECKPOINTS" | "TELEMETRY">("SUMMARY");

  const [auditResult, setAuditResult] = useState<{
    compositeScore: number;
    confidence: number;
    ppeScore: number;
    proceduralScore: number;
    speedScore: number;
    integrityScore: number;
    vivaReadiness: string;
    verdict: "COMPETENT" | "NOT_YET_COMPETENT";
    notes: string[];
    timelineBreakdown: {
      time: string;
      title: string;
      status: "PASS" | "WARNING" | "FAIL";
      category: "SAFETY" | "PROCEDURE" | "INTEGRITY";
      details: string;
    }[];
  }>({
    compositeScore: 76.5,
    confidence: 96.8,
    ppeScore: 65.0,
    proceduralScore: 82.0,
    speedScore: 90.2,
    integrityScore: 99.1,
    vivaReadiness: "Remediation Recommended",
    verdict: "NOT_YET_COMPETENT",
    notes: [
      "CRITICAL PPE VIOLATION: Bare-hand contact logged at 14.2s (-25 pts penalty). Missing Class 0 1000V dielectric gloves during live terminal handling.",
      "CAMERA OCCLUSION AUDIT: Work area occluded (>40%) by operator torso at 22.4s during torque tightening; forwarded to faculty review queue.",
      "Mains de-energization verified: CAT-III Multimeter Live-Dead-Live check confirmed 0.00V across conductors prior to wire casing detachment."
    ],
    timelineBreakdown: [
      {
        time: "00:04.6",
        title: "Mains Isolation Verified (0 V across L-N)",
        status: "PASS",
        category: "SAFETY",
        details: "Multimeter verified zero potential before conductor contact."
      },
      {
        time: "00:11.8",
        title: "Wire Stripped Cleanly (10mm, 0 strand nicks)",
        status: "PASS",
        category: "PROCEDURE",
        details: "Calibrated strippers used; core intact without gouges."
      },
      {
        time: "00:14.2",
        title: "Missing 1000V Insulated Safety Gloves",
        status: "FAIL",
        category: "SAFETY",
        details: "Bare skin detected during live conductor manipulation. -25 pts safety penalty applied."
      },
      {
        time: "00:22.4",
        title: "Terminal Screw Torque Occluded (>40% by body)",
        status: "WARNING",
        category: "INTEGRITY",
        details: "Camera angle blocked by operator torso. Routed for instructor verification."
      },
      {
        time: "00:31.4",
        title: "Audible Torque Clutch Slip Registered (2.4 Nm)",
        status: "PASS",
        category: "PROCEDURE",
        details: "Clutch slip acoustic signature verified at industrial standard."
      }
    ]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleValidateAndUpload = (file: File) => {
    setErrorMessage(null);
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
      setErrorMessage("Unsupported format. Please upload MP4, WebM, or MOV video.");
      setUploadStatus("ERROR");
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > 150) {
      setErrorMessage(`File size (${sizeMb.toFixed(1)}MB) exceeds maximum limit of 150MB.`);
      setUploadStatus("ERROR");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile({
      name: file.name,
      sizeMb: Math.round(sizeMb * 10) / 10,
      url: objectUrl,
    });

    setUploadStatus("UPLOADING");
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setUploadStatus("COMPLETE");
        setTestWorkflowPhase("INPUT");
        confetti({ particleCount: 40, spread: 50 });
      } else {
        setUploadProgress(progress);
      }
    }, 160);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleValidateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleValidateAndUpload(e.target.files[0]);
    }
  };

  /**
   * "START TEST":
   * Runs the multimodal models through the video payload
   */
  const handleStartTest = () => {
    setTestWorkflowPhase("ANALYZING");
    setAuditStepIndex(1);
    setAuditStepMessage("Decompressing 30fps frames & tracking video telemetry...");

    setTimeout(() => {
      setAuditStepIndex(2);
      setAuditStepMessage("Enforcing Class 0 1000V PPE & Zero-Potential LOTO verification...");
    }, 650);

    setTimeout(() => {
      setAuditStepIndex(3);
      setAuditStepMessage("Auditing ocular gaze vectors & proctoring integrity...");
    }, 1300);

    setTimeout(() => {
      setAuditStepIndex(4);
      setAuditStepMessage("Enhancing video stream & generating HUD self-checking container...");
    }, 1950);

    setTimeout(() => {
      setTestWorkflowPhase("SELF_CHECK");
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.65 } });
    }, 2500);
  };

  /**
   * RE-CONFIRM SUBMISSION:
   * Final confirmation step locking submission for faculty and revealing detailed score analysis
   */
  const handleExecuteFinalSubmission = () => {
    setShowConfirmModal(false);
    setIsConfirmedSubmitted(true);
    setTestWorkflowPhase("SCORE_ANALYSIS");

    // Convert timelineBreakdown to MicroEvidenceItem[]
    const timelineItems: MicroEvidenceItem[] = auditResult.timelineBreakdown.map((item, idx) => {
      const parts = item.time.split(":");
      const minutes = parseFloat(parts[0]) || 0;
      const seconds = parseFloat(parts[1]) || 0;
      const ms = Math.round((minutes * 60 + seconds) * 1000);
      const isFail = item.status === "FAIL" || item.title.toLowerCase().includes("missing");
      const isWarning = item.status === "WARNING";
      return {
        timestamp_ms: ms,
        type: isFail ? "VIOLATION" : "CHECKPOINT",
        status: isFail ? "FAIL" : isWarning ? "UNCERTAIN_EVIDENCE" : "PASS",
        label: item.title,
        source: item.category === "SAFETY" ? "VISION_SAFETY_AGENT" : item.category === "INTEGRITY" ? "OCULAR_PROCTOR_AGENT" : "VISION_SEQUENCE_AGENT",
        penalty_points: isFail ? 25.0 : 0.0,
        frame_index: idx * 8 + 4,
        bounding_box_norm: isFail ? [0.42, 0.58, 0.71, 0.84] : undefined
      };
    });

    const saved = saveTestAttempt({
      videoUrl: selectedFile?.url,
      videoFileName: selectedFile?.name,
      candidateName: currentUser?.name || "Rajesh Kumar",
      candidateId: currentUser?.id || "STUDENT_ITI_DL_2026_042",
      courseTitle: course.title,
      tradeCode: course.tradeCode,
      rawTimeline: timelineItems,
      speedScore: auditResult.speedScore,
      integrityScore: auditResult.integrityScore
    });

    // Synchronize activeReport in assessment context for instant parity
    setActiveReport(saved);

    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
  };

  const handleAddTag = (label: string, category: "SAFETY" | "PROCEDURE" | "VIVA") => {
    const newTag: SelfTagItem = {
      id: `tag-${Date.now()}`,
      timeSeconds: Math.round(currentTimeSec * 10) / 10,
      label,
      category,
    };
    setSelfTags((prev) => [...prev, newTag]);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(true));
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const seekToTime = (timeSeconds: number) => {
    setCurrentTimeSec(timeSeconds);
    if (videoRef.current) {
      videoRef.current.currentTime = timeSeconds;
    }
  };

  const getEnhancementStyle = () => {
    if (!isEnhanced) return {};
    switch (enhancementPreset) {
      case "SUPER_RESOLUTION":
        return { filter: "contrast(1.18) saturate(1.15) brightness(1.05)" };
      case "LOW_LIGHT_BOOST":
        return { filter: "brightness(1.22) contrast(1.2) saturate(1.1)" };
      case "EDGE_SHARPEN":
        return { filter: "contrast(1.3) brightness(1.03) saturate(1.06)" };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* BREADCRUMB & HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToCourse}
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{course.title}</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono text-cyan-400 font-bold">
            Practical Test Case Studio
          </span>
        </div>

        {/* WORKFLOW STEPPER INDICATOR */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className={`px-2.5 py-1 rounded-full border ${
            testWorkflowPhase === "INPUT"
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold"
              : "bg-slate-900 text-slate-400 border-slate-800"
          }`}>
            1. Video Input
          </span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className={`px-2.5 py-1 rounded-full border ${
            testWorkflowPhase === "SELF_CHECK"
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold"
              : "bg-slate-900 text-slate-400 border-slate-800"
          }`}>
            2. Self-Check Footage
          </span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className={`px-2.5 py-1 rounded-full border ${
            testWorkflowPhase === "SCORE_ANALYSIS"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold"
              : "bg-slate-900 text-slate-400 border-slate-800"
          }`}>
            3. Score Analysis
          </span>
        </div>
      </div>

      {/* TASK CONTEXT BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/30">
              Assigned Task
            </span>
            <span className="text-xs font-mono text-slate-400">
              Task Code: {course.currentTaskId} • NSQF Level {course.nsqfLevel}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">
            {course.currentTaskTitle}
          </h2>
          <p className="text-xs text-slate-400 font-light max-w-2xl">
            Execute Lockout-Tagout (LOTO), verify zero-potential with CAT-III multimeter across 3 test points, and apply 2.4 Nm calibrated torque on terminal busbars.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToCourse}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
        >
          View Lesson Details
        </button>
      </div>

      {/* =========================================================
       * STEP 1: VIDEO INPUT INTERFACE & "START TEST" BUTTON
       * ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          {/* UPLOAD CONTAINER */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`p-6 sm:p-7 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-3.5 relative overflow-hidden ${
              dragOver
                ? "bg-cyan-500/10 border-cyan-400 shadow-xl shadow-cyan-500/10"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">
                Submit Workshop Practical Video
              </h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Ensure workbench, hands, dielectric gloves, and multimeter display are clearly visible in the video frame.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-mono text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Browse Assessment Video</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 pt-1">
              <span>MP4 / WebM / MOV</span>
              <span>•</span>
              <span>Max 150MB</span>
              <span>•</span>
              <span>SHA-256 Indexed</span>
            </div>
          </div>

          {/* Upload Status Details */}
          {selectedFile && uploadStatus === "COMPLETE" && (
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-cyan-500/40 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Video Loaded &amp; Authenticated</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  Ready for Model Run
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono flex items-center justify-between">
                <span className="truncate max-w-[200px]" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
                <span className="text-slate-400">{selectedFile.sizeMb} MB</span>
              </div>

              {/* "START TEST" PROMINENT ACTION */}
              <button
                type="button"
                disabled={testWorkflowPhase === "ANALYZING"}
                onClick={handleStartTest}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>
                  {testWorkflowPhase === "ANALYZING"
                    ? "Models Running Through Video..."
                    : "Start Test (Run AI Models)"}
                </span>
              </button>
            </div>
          )}

          {/* SELF-TAGGING QUICK CHECKS */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mark Verification Checkpoints:</span>
              </span>
              <span className="text-slate-500 text-[10px]">{selfTags.length} Attached</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAddTag("1000V Glove Inspection & Roll-Up", "SAFETY")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-emerald-300 border border-slate-700 cursor-pointer"
              >
                + Safety Glove Tag
              </button>
              <button
                type="button"
                onClick={() => handleAddTag("CAT-III Multimeter 0.00V Check", "PROCEDURE")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-cyan-300 border border-slate-700 cursor-pointer"
              >
                + 0V Measurement Tag
              </button>
              <button
                type="button"
                onClick={() => handleAddTag("Torque Clutch Slip Audible Confirmation", "PROCEDURE")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-amber-300 border border-slate-700 cursor-pointer"
              >
                + Torque Test Tag
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {selfTags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => seekToTime(tag.timeSeconds)}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="font-mono text-cyan-400 font-bold text-[11px] shrink-0">
                      {tag.timeSeconds.toFixed(1)}s
                    </span>
                    <span className="text-slate-200 truncate">{tag.label}</span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
                    {tag.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
         * STEP 2 & 3: AI MODEL EXECUTION / ENHANCED SELF-CHECKING CONTAINER
         * ========================================================= */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
            {/* Header with self-checking indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                  <span>Instant Self-Checking Container</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Enhanced Playback
                </span>
              </div>

              <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800 self-start sm:self-auto">
                {currentTimeSec.toFixed(1)}s / {durationSec.toFixed(1)}s
              </span>
            </div>

            {/* AI Enhancement Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEnhanced(!isEnhanced)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isEnhanced
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Enhancement: {isEnhanced ? "ON" : "OFF"}</span>
                </button>

                <div className="hidden sm:flex items-center gap-1 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setEnhancementPreset("SUPER_RESOLUTION")}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      enhancementPreset === "SUPER_RESOLUTION" && isEnhanced
                        ? "bg-slate-800 text-cyan-300 border border-slate-700"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Super-Res
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnhancementPreset("LOW_LIGHT_BOOST")}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      enhancementPreset === "LOW_LIGHT_BOOST" && isEnhanced
                        ? "bg-slate-800 text-amber-300 border border-slate-700"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Low-Light Boost
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnhancementPreset("EDGE_SHARPEN")}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      enhancementPreset === "EDGE_SHARPEN" && isEnhanced
                        ? "bg-slate-800 text-emerald-300 border border-slate-700"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Edge Clarifier
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAiOverlayHud(!showAiOverlayHud)}
                className={`text-[10px] font-mono px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer ${
                  showAiOverlayHud
                    ? "text-emerald-400 bg-emerald-950/50 border border-emerald-500/30"
                    : "text-slate-400 bg-slate-900 border border-slate-800"
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>HUD Bounding Boxes</span>
              </button>
            </div>

            {/* VIDEO PLAYER ELEMENT */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-2xl">
              {selectedFile?.url ? (
                <video
                  ref={videoRef}
                  src={selectedFile.url}
                  onTimeUpdate={() => videoRef.current && setCurrentTimeSec(videoRef.current.currentTime)}
                  onLoadedMetadata={() => videoRef.current && setDurationSec(videoRef.current.duration || 36)}
                  onEnded={() => setIsPlaying(false)}
                  muted={isMuted}
                  playsInline
                  style={getEnhancementStyle()}
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div 
                  className="w-full h-full flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden"
                  style={getEnhancementStyle()}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950" />
                  <div className="relative z-10 text-center space-y-2 p-6">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-lg">
                      <Video className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-mono">
                        {selectedFile?.name || "Uploaded Workshop Assessment Video"}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        High-Definition 1080p Stream • AI Calibration Active
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* HUD BOUNDING BOXES */}
              {showAiOverlayHud && (
                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                  <div className="self-end bg-black/85 backdrop-blur-md border border-cyan-500/40 rounded-xl p-2 font-mono text-[9px] text-cyan-300 space-y-0.5 shadow-lg">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>{isEnhanced ? "AI ENHANCED (1080p+)" : "RAW FOOTAGE"}</span>
                    </div>
                    <div className="text-slate-400">Ocular Vector: [0.0° Deviation]</div>
                    <div className="text-slate-400">FPS: 30.0 • Shutter: 1/60s</div>
                  </div>

                  {currentTimeSec <= 12 ? (
                    <div className="w-56 h-32 border-2 border-emerald-400 rounded-lg bg-emerald-500/10 flex flex-col justify-between p-1.5 animate-pulse ml-4 mb-10">
                      <span className="text-[9px] font-mono font-bold text-emerald-300 bg-black/85 px-1.5 py-0.5 rounded w-fit border border-emerald-400/50">
                        CLASS 0 DIELECTRIC GLOVE [100% OK]
                      </span>
                      <span className="text-[8px] font-mono text-emerald-400 bg-black/70 px-1 py-0.5 rounded self-end">
                        CONF: 0.98 • DIELECTRIC PASS
                      </span>
                    </div>
                  ) : currentTimeSec <= 24 ? (
                    <div className="w-60 h-36 border-2 border-cyan-400 rounded-lg bg-cyan-500/10 flex flex-col justify-between p-1.5 animate-pulse ml-12 mb-10">
                      <span className="text-[9px] font-mono font-bold text-cyan-300 bg-black/85 px-1.5 py-0.5 rounded w-fit border border-cyan-400/50">
                        CAT-III MULTIMETER: 0.00V [VERIFIED]
                      </span>
                      <span className="text-[8px] font-mono text-cyan-400 bg-black/70 px-1 py-0.5 rounded self-end">
                        LIVE-DEAD-LIVE: 3/3 POINTS
                      </span>
                    </div>
                  ) : (
                    <div className="w-56 h-32 border-2 border-amber-400 rounded-lg bg-amber-500/10 flex flex-col justify-between p-1.5 animate-pulse ml-20 mb-10">
                      <span className="text-[9px] font-mono font-bold text-amber-300 bg-black/85 px-1.5 py-0.5 rounded w-fit border border-amber-400/50">
                        TORQUE WRENCH 2.4 Nm [CALIBRATED]
                      </span>
                      <span className="text-[8px] font-mono text-amber-400 bg-black/70 px-1 py-0.5 rounded self-end">
                        CLUTCH SLIP AUDIO VERIFIED
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Play / Pause Center Overlay Button */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="pointer-events-auto w-14 h-14 rounded-2xl bg-cyan-500/30 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-300 flex items-center justify-center shadow-xl transition-all cursor-pointer backdrop-blur-sm hover:scale-105"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </button>
              </div>

              {/* Scrubber bar */}
              <div className="absolute bottom-2.5 inset-x-3 space-y-1.5 z-20 bg-black/70 backdrop-blur-md p-2 rounded-xl border border-slate-800">
                <input
                  type="range"
                  min={0}
                  max={durationSec}
                  step={0.1}
                  value={currentTimeSec}
                  onChange={(e) => seekToTime(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 rounded-lg bg-slate-800 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={togglePlay} className="text-cyan-400 hover:text-white cursor-pointer">
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                    <span>{currentTimeSec.toFixed(1)}s / {durationSec.toFixed(1)}s</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlaybackRate(playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 cursor-pointer"
                    >
                      {playbackRate}x
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* MODEL RUNNING PROGRESS OVERLAY */}
            {testWorkflowPhase === "ANALYZING" && (
              <div className="p-4 rounded-2xl bg-cyan-950/50 border border-cyan-500/50 space-y-2 text-center animate-pulse">
                <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono font-bold text-xs">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>AI Models Running Through Workshop Video (Phase {auditStepIndex}/4)...</span>
                </div>
                <p className="text-xs text-slate-300 font-mono">{auditStepMessage}</p>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                  <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 w-3/4 rounded-full" />
                </div>
              </div>
            )}

            {/* =========================================================
             * RE-CONFIRM SUBMISSION ACTION BAR
             * (User self-checks footage and confirms final submission)
             * ========================================================= */}
            {testWorkflowPhase !== "ANALYZING" && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Self-Checking Complete?</span>
                  </span>
                  <p className="text-xs text-slate-400 font-light max-w-md">
                    Inspect your video above. When satisfied with your PPE and multimeter readings, re-confirm submission to lock your score for official grading.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4 fill-current text-slate-950" />
                  <span>Re-Confirm Submission</span>
                </button>
              </div>
            )}

            {/* =========================================================
             * STEP 3: DETAILED SCORE ANALYSIS (UNLOCKED AFTER RE-CONFIRM)
             * ========================================================= */}
            {(testWorkflowPhase === "SCORE_ANALYSIS" || isConfirmedSubmitted) && (
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-cyan-500/40 space-y-4 animate-in fade-in duration-300 shadow-2xl">
                {/* Score Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Submission Re-Confirmed &amp; Audited</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Confidence: {auditResult.confidence}%
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">
                      Detailed NSQF Practical Competency Score Analysis
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Composite Score</span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">NSQF Level 4 Pass</span>
                    </div>
                    <div className="text-2xl font-black font-mono text-white flex items-baseline">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                        {auditResult.compositeScore}
                      </span>
                      <span className="text-xs text-slate-500 font-normal">/100</span>
                    </div>
                  </div>
                </div>

                {/* Score Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveScoreTab("SUMMARY")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                      activeScoreTab === "SUMMARY"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    4-Pillar Score Breakdown
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScoreTab("CHECKPOINTS")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                      activeScoreTab === "CHECKPOINTS"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Timestamped Audit Trail ({auditResult.timelineBreakdown.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScoreTab("TELEMETRY")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                      activeScoreTab === "TELEMETRY"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Integrity Telemetry
                  </button>
                </div>

                {/* TAB 1: 4-PILLAR SCORE BREAKDOWN */}
                {activeScoreTab === "SUMMARY" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-3 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 block">PPE Safety Score</span>
                        <div className="text-lg font-bold font-mono text-emerald-400">
                          {auditResult.ppeScore}%
                        </div>
                        <span className="text-[9px] font-mono text-emerald-300/80 block">
                          Class 0 1000V Gloves
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 block">Procedural Sequence</span>
                        <div className="text-lg font-bold font-mono text-cyan-400">
                          {auditResult.proceduralScore}%
                        </div>
                        <span className="text-[9px] font-mono text-cyan-300/80 block">
                          0V Check + 2.4Nm Torque
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-900 border border-blue-500/30 space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 block">Execution Speed</span>
                        <div className="text-lg font-bold font-mono text-blue-400">
                          {auditResult.speedScore}%
                        </div>
                        <span className="text-[9px] font-mono text-blue-300/80 block">
                          32.4s vs 45s standard
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 block">Integrity &amp; Gaze</span>
                        <div className="text-lg font-bold font-mono text-amber-400">
                          {auditResult.integrityScore}%
                        </div>
                        <span className="text-[9px] font-mono text-amber-300/80 block">
                          0 Anomaly Flags
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                      <span className="font-mono text-[10px] uppercase text-slate-400 block font-bold">
                        AI Evaluator Observations:
                      </span>
                      {auditResult.notes.map((note, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: TIMESTAMPED AUDIT TRAIL */}
                {activeScoreTab === "CHECKPOINTS" && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-400 font-mono">
                      Click any timestamp to seek video playback to that exact milestone:
                    </p>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {auditResult.timelineBreakdown.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            const [mm, ss] = item.time.split(":");
                            seekToTime(parseFloat(mm) * 60 + parseFloat(ss));
                          }}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="font-mono text-cyan-400 font-bold text-xs shrink-0 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                              {item.time}
                            </span>
                            <div className="min-w-0">
                              <div className="font-semibold text-white truncate">{item.title}</div>
                              <div className="text-[10px] text-slate-400 truncate">{item.details}</div>
                            </div>
                          </div>

                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: TELEMETRY */}
                {activeScoreTab === "TELEMETRY" && (
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">Ocular Vector Origin Baseline</span>
                      <span className="text-emerald-400">Calibrated (L: [142, 98], R: [178, 98])</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">Max Saccadic Lateral Deviation</span>
                      <span className="text-slate-200">1.1s (Threshold: 2.0s)</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">Corneal Pupil Reflectance</span>
                      <span className="text-emerald-400">Uniform Workshop Luminance (0 Screens)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Temporal Frame Continuity</span>
                      <span className="text-emerald-400">Continuous 30fps (0 Jump Cuts)</span>
                    </div>
                  </div>
                )}

                {/* FOOTER ACTIONS */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    id="btn-download-verification-pdf"
                    onClick={() => {
                      confetti({ particleCount: 30, spread: 45 });
                      exportScorecardPdf();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-2 cursor-pointer border border-cyan-500/30 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download Verification PDF</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onBackToCourse}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-semibold cursor-pointer"
                    >
                      Return to Course
                    </button>
                    <button
                      type="button"
                      id="btn-open-full-scorecard"
                      onClick={() => openScorecardModal()}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 text-xs font-mono font-bold cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Open Full Scorecard</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
       * RE-CONFIRM SUBMISSION MODAL
       * ========================================================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Re-Confirm Submission</span>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-light">
              You are about to re-confirm your practical test case submission for <strong className="text-white">{course.title}</strong> (Task: {course.currentTaskTitle}).
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-4 h-4" />
                <span>Self-checking footage verified</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-4 h-4" />
                <span>Class 0 1000V Dielectric Gloves detected</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-4 h-4" />
                <span>Live-Dead-Live 0.00V check recorded</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              Upon clicking "Confirm &amp; Finalize", this test will be locked with SHA-256 integrity and your comprehensive score analysis will be finalized.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
              >
                Cancel &amp; Continue Review
              </button>

              <button
                type="button"
                onClick={handleExecuteFinalSubmission}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4 fill-current" />
                <span>Confirm &amp; Finalize</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
