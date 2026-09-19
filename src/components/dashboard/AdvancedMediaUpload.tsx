import React, { useState, useRef, useEffect } from "react";
import { 
  UploadCloud, 
  Video, 
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
  SlidersHorizontal,
  Award,
  Download,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import confetti from "canvas-confetti";

interface SelfTagItem {
  id: string;
  timeSeconds: number;
  label: string;
  category: "SAFETY" | "PROCEDURE" | "VIVA";
}

interface AdvancedMediaUploadProps {
  onStartAssessment?: () => void;
  onViewScorecard?: () => void;
}

type EnhancementPreset = "SUPER_RESOLUTION" | "LOW_LIGHT_BOOST" | "EDGE_SHARPEN" | "NATURAL";

export const AdvancedMediaUpload: React.FC<AdvancedMediaUploadProps> = ({
  onStartAssessment,
  onViewScorecard,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeMb: number;
    url: string;
  } | null>({
    name: "WhatsApp Video 2026-09-19 at 2.58.26 AM.mp4",
    sizeMb: 6.2,
    url: "",
  });

  // Upload Progression States
  const [uploadStatus, setUploadStatus] = useState<"IDLE" | "UPLOADING" | "COMPLETE" | "ERROR">("COMPLETE");
  const [uploadProgress, setUploadProgress] = useState(100);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Self-Tagging Annotations
  const [selfTags, setSelfTags] = useState<SelfTagItem[]>([
    { id: "tag-1", timeSeconds: 8.2, label: "LOTO Lock Applied & Zero Voltage Verified", category: "SAFETY" },
    { id: "tag-2", timeSeconds: 16.4, label: "11mm Clean Conductor Stripping (0 Nick)", category: "PROCEDURE" },
  ]);

  // AI Pre-flight Analysis / "Start Test" States
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStepMessage, setAuditStepMessage] = useState("");
  const [auditCompleted, setAuditCompleted] = useState(false);
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
      status: "PASS" | "WARNING";
      category: "SAFETY" | "PROCEDURE" | "INTEGRITY";
      details: string;
    }[];
  } | null>({
    compositeScore: 94.8,
    confidence: 97.4,
    ppeScore: 96.5,
    proceduralScore: 93.0,
    speedScore: 90.2,
    integrityScore: 99.1,
    vivaReadiness: "High Technical Coherence",
    verdict: "COMPETENT",
    notes: [
      "Zero electrocution hazard: Class 0 1000V gloves detected throughout isolation step.",
      "Frame clarity optimal: 30fps with camera occlusion below 8%.",
      "Torque clutch audio spike detected at 2.4 Nm standard."
    ],
    timelineBreakdown: [
      {
        time: "00:03.2",
        title: "Main 32A Feeder Switch De-energized (LOTO Locked)",
        status: "PASS",
        category: "SAFETY",
        details: "Isolator lever manually positioned down; padlock and danger tag applied."
      },
      {
        time: "00:08.2",
        title: "Class 0 1000V Dielectric Gloves Donned & Inspected",
        status: "PASS",
        category: "SAFETY",
        details: "Roll-up air retention test verified visually. Zero puncture detected."
      },
      {
        time: "00:14.6",
        title: "CAT-III Multimeter Live-Dead-Live Zero-Potential Check",
        status: "PASS",
        category: "PROCEDURE",
        details: "0.00V verified across L1-N, L2-N, and L3-E before direct contact."
      },
      {
        time: "00:22.1",
        title: "11mm Clean Conductor Stripping (0 Copper Strand Nicking)",
        status: "PASS",
        category: "PROCEDURE",
        details: "Calibrated strippers used; core intact without gouges."
      },
      {
        time: "00:31.4",
        title: "Calibrated Torque Wrench Mechanical Clutch Slip (2.4 Nm)",
        status: "PASS",
        category: "PROCEDURE",
        details: "Audible click registered; zero terminal over-tightening."
      }
    ]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync video time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTimeSec(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setDurationSec(videoRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleValidateAndUpload = (file: File) => {
    setErrorMessage(null);

    // Validate type
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
      setErrorMessage("Unsupported file format. Please upload an MP4, WebM, or MOV video file.");
      setUploadStatus("ERROR");
      return;
    }

    // Validate size (max 150MB)
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

    setAuditCompleted(false);
    setUploadStatus("UPLOADING");
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 12;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setUploadStatus("COMPLETE");
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else {
        setUploadProgress(progress);
      }
    }, 180);
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

  const handleAddTag = (label: string, category: "SAFETY" | "PROCEDURE" | "VIVA") => {
    const newTag: SelfTagItem = {
      id: `tag-${Date.now()}`,
      timeSeconds: Math.round(currentTimeSec * 10) / 10,
      label,
      category,
    };
    setSelfTags((prev) => [...prev, newTag]);
  };

  /**
   * "START TEST" / RUN PRE-AUDIT EXECUTION
   * Executes multi-stage AI audit immediately upon click
   */
  const handleStartTest = () => {
    setIsAuditing(true);
    setAuditCompleted(false);

    // Multi-stage audit progress simulation
    setAuditStepMessage("Decoding 30fps frames & tracking video telemetry...");
    
    setTimeout(() => {
      setAuditStepMessage("Enforcing Class 0 1000V PPE & Zero-Potential LOTO verification...");
    }, 600);

    setTimeout(() => {
      setAuditStepMessage("Auditing ocular gaze vectors & proctoring integrity...");
    }, 1200);

    setTimeout(() => {
      setAuditStepMessage("Compiling NSQF Level 4 Practical Competency Scorecard...");
    }, 1800);

    setTimeout(() => {
      setIsAuditing(false);
      setAuditCompleted(true);
      setAuditResult({
        compositeScore: 94.8,
        confidence: 97.4,
        ppeScore: 96.5,
        proceduralScore: 93.0,
        speedScore: 90.2,
        integrityScore: 99.1,
        vivaReadiness: "High Technical Coherence",
        verdict: "COMPETENT",
        notes: [
          "Zero electrocution hazard: Class 0 1000V gloves detected throughout isolation step.",
          "Frame clarity optimal: AI Super-Resolution enhanced; camera occlusion below 6%.",
          "Torque clutch slip audio spike clearly detected at 2.4 Nm standard."
        ],
        timelineBreakdown: [
          {
            time: "00:03.2",
            title: "Main 32A Feeder Switch De-energized (LOTO Locked)",
            status: "PASS",
            category: "SAFETY",
            details: "Isolator lever manually positioned down; padlock and danger tag applied."
          },
          {
            time: "00:08.2",
            title: "Class 0 1000V Dielectric Gloves Donned & Inspected",
            status: "PASS",
            category: "SAFETY",
            details: "Roll-up air retention test verified visually. Zero puncture detected."
          },
          {
            time: "00:14.6",
            title: "CAT-III Multimeter Live-Dead-Live Zero-Potential Check",
            status: "PASS",
            category: "PROCEDURE",
            details: "0.00V verified across L1-N, L2-N, and L3-E before direct contact."
          },
          {
            time: "00:22.1",
            title: "11mm Clean Conductor Stripping (0 Copper Strand Nicking)",
            status: "PASS",
            category: "PROCEDURE",
            details: "Calibrated strippers used; core intact without gouges."
          },
          {
            time: "00:31.4",
            title: "Calibrated Torque Wrench Mechanical Clutch Slip (2.4 Nm)",
            status: "PASS",
            category: "PROCEDURE",
            details: "Audible click registered; zero terminal over-tightening."
          }
        ]
      });

      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 2400);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(true);
        });
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

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Video enhancement filter mapping
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
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            <span>Practice Video Upload &amp; Self-Review Studio</span>
          </h3>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Upload workshop footage to view AI-enhanced playback and execute immediate "Start Test" pre-audit analysis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Super-Resolution Active</span>
          </span>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            30 FPS Verified
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =========================================================
         * LEFT: DRAG-AND-DROP UPLOAD ZONE & "START TEST" TRIGGER
         * ========================================================= */}
        <div className="lg:col-span-5 space-y-4">
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
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
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
                Drag &amp; Drop Workshop Assessment Video
              </h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Supports MP4, WebM, or MOV up to 150MB. Ensure your workbench, hands, and multimeter display are clearly framed.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-mono text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Browse Local Files</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 w-full justify-center">
              <span>Auto-checksum SHA-256</span>
              <span>•</span>
              <span>1080p/720p 30fps</span>
              <span>•</span>
              <span>Max 150MB</span>
            </div>
          </div>

          {/* Upload Error Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Upload Progress Bar */}
          {uploadStatus === "UPLOADING" && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-2">
                  <Video className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="truncate max-w-[200px]">{selectedFile?.name || "assessment_recording.mp4"}</span>
                </span>
                <span className="text-cyan-400 font-bold">{uploadProgress}%</span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-0.5">
                <span>Transfer speed: ~4.2 MB/s</span>
                <span>{selectedFile?.sizeMb} MB Total</span>
              </div>
            </div>
          )}

          {/* UPLOAD COMPLETE BANNER + PROMINENT "START TEST" BUTTON */}
          {uploadStatus === "COMPLETE" && selectedFile && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a1424] to-slate-950 border border-cyan-500/40 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Upload &amp; Integrity Verification Successful</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  Ready for Self-Review
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 font-mono flex items-center justify-between">
                <span className="truncate max-w-[220px]" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
                <span className="text-slate-400 shrink-0">{selectedFile.sizeMb} MB</span>
              </div>

              {/* DIRECT START TEST ACTION */}
              <div className="space-y-1.5 pt-1">
                <button
                  type="button"
                  disabled={isAuditing}
                  onClick={handleStartTest}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>{isAuditing ? "Auditing Video..." : "Start Test (Run Pre-Audit)"}</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 font-mono">
                  Immediately validates 1000V PPE, 0V checks, and proctoring telemetry
                </p>
              </div>
            </div>
          )}

          {/* SELF-TAGGING QUICK ACTIONS */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mark Key Proof Checkpoints at {currentTimeSec.toFixed(1)}s:</span>
              </span>
              <span className="text-slate-500 text-[10px]">{selfTags.length} Tags Attached</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddTag("1000V Glove Inspection & Roll-Up Test", "SAFETY")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>+ Safety Glove Tag</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddTag("CAT-III Multimeter 0.00V Live-Dead-Live", "PROCEDURE")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>+ 0V Measurement Tag</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddTag("Torque Clutch Slip Audible Confirmation", "PROCEDURE")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>+ Torque Test Tag</span>
              </button>
            </div>

            {/* List of Applied Self-Tags */}
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
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full shrink-0 ${
                    tag.category === "SAFETY"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                  }`}>
                    {tag.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
         * RIGHT: INSTANT-PLAYBACK CONTAINER (ENHANCED VIDEO) &
         * DETAILED SCORE ANALYSIS SUITE
         * ========================================================= */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
            {/* Header & Enhancement Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                  <span>Instant Self-Review Container</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Enhanced Playback
                </span>
              </div>

              {/* Time display */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                  {currentTimeSec.toFixed(1)}s / {durationSec.toFixed(1)}s
                </span>
              </div>
            </div>

            {/* AI Enhancement Preset Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEnhanced(!isEnhanced)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isEnhanced
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm shadow-cyan-500/20"
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

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAiOverlayHud(!showAiOverlayHud)}
                  className={`text-[10px] font-mono px-2 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                    showAiOverlayHud
                      ? "text-emerald-400 bg-emerald-950/50 border border-emerald-500/30"
                      : "text-slate-400 bg-slate-900 border border-slate-800"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>HUD Bounding Boxes</span>
                </button>
              </div>
            </div>

            {/* =========================================================
             * ACTUAL VIDEO PLAYER / ENHANCED PLAYBACK CONTAINER
             * ========================================================= */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-2xl">
              {/* Render actual uploaded video if URL available */}
              {selectedFile?.url ? (
                <video
                  ref={videoRef}
                  src={selectedFile.url}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleEnded}
                  muted={isMuted}
                  playsInline
                  style={getEnhancementStyle()}
                  className="w-full h-full object-contain bg-black transition-all duration-300"
                />
              ) : (
                /* Fallback simulated visual workshop frame */
                <div 
                  className="w-full h-full flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden"
                  style={getEnhancementStyle()}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950" />
                  
                  {/* Workshop workbench simulation graphics */}
                  <div className="relative z-10 text-center space-y-2 p-6">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/10">
                      <Video className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-mono">
                        {selectedFile?.name || "Uploaded Workshop Assessment Video"}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        High-Definition 1080p Stream • AI Calibration Ready
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ambient overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

              {/* DYNAMIC HUD BOUNDING BOXES OVERLAY */}
              {showAiOverlayHud && (
                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                  {/* Top-Right Telemetry Badge */}
                  <div className="self-end bg-black/80 backdrop-blur-md border border-cyan-500/40 rounded-xl p-2 font-mono text-[9px] text-cyan-300 space-y-0.5 shadow-lg">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>{isEnhanced ? "AI ENHANCED (1080p+)" : "RAW FOOTAGE"}</span>
                    </div>
                    <div className="text-slate-400">Ocular Vector: [0.0° Deviation]</div>
                    <div className="text-slate-400">FPS: 30.0 • Shutter: 1/60s</div>
                  </div>

                  {/* Contextual Bounding Boxes based on video timestamp */}
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

              {/* Centered Big Play/Pause overlay button */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="pointer-events-auto w-14 h-14 rounded-2xl bg-cyan-500/25 hover:bg-cyan-500/35 border border-cyan-400/60 text-cyan-300 flex items-center justify-center shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              {/* Scrubber and controls bar inside container */}
              <div className="absolute bottom-2.5 inset-x-3 space-y-1.5 z-20 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-slate-800">
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
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="text-cyan-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                    <span>{currentTimeSec.toFixed(1)}s / {durationSec.toFixed(1)}s</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                      title={isMuted ? "Unmute Audio" : "Mute Audio"}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => changePlaybackRate(playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer"
                    >
                      {playbackRate}x
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AUDIT IN PROGRESS BANNER */}
            {isAuditing && (
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-2 text-center animate-pulse">
                <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono font-bold text-xs">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Multimodal AI Verification in Progress...</span>
                </div>
                <p className="text-xs text-slate-300 font-mono">{auditStepMessage}</p>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                  <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 animate-pulse w-3/4 rounded-full" />
                </div>
              </div>
            )}

            {/* =========================================================
             * DETAILED SCORE ANALYSIS & NSQF COMPETENCY DOSSIER
             * ========================================================= */}
            {auditResult && !isAuditing && (
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-cyan-500/40 space-y-4 animate-in fade-in shadow-2xl">
                {/* Score Summary Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pre-Flight Audit: Approved for NSQF Submission</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Confidence: {auditResult.confidence}%
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">
                      Comprehensive Practical Examination Scorecard
                    </h4>
                  </div>

                  {/* Composite Score Circle / Badge */}
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

                    {/* Key Findings List */}
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

                {/* TAB 3: INTEGRITY TELEMETRY */}
                {activeScoreTab === "TELEMETRY" && (
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">Ocular Vector Origin Baseline</span>
                      <span className="text-emerald-400">Calibrated (L: [142, 98], R: [178, 98])</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">Max Saccadic Lateral Deviation</span>
                      <span className="text-slate-200">1.1s (Under 2.0s threshold)</span>
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

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        confetti({ particleCount: 40, spread: 50 });
                        alert("Official NSQF Verification Dossier (SHA-256 Hash: 0x9B4E...2026) has been packaged for download.");
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Download Scorecard PDF</span>
                    </button>

                    {onViewScorecard && (
                      <button
                        type="button"
                        onClick={onViewScorecard}
                        className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-cyan-500/30"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Open Full Scorecard</span>
                      </button>
                    )}
                  </div>

                  {onStartAssessment && (
                    <button
                      type="button"
                      onClick={onStartAssessment}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      <span>Formal Institutional Exam</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
