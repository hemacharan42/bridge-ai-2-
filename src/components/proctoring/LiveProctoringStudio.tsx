import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, 
  Eye, 
  Volume2, 
  Users, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  Radio, 
  Bell, 
  Sparkles,
  Activity,
  Send,
  Zap,
  Info,
  Smartphone,
  FileText,
  Clock,
  ChevronRight,
  ChevronLeft,
  Flag,
  Maximize2,
  Lock,
  Layers,
  HelpCircle,
  FileCheck,
  Check
} from "lucide-react";
import { 
  ProctoringEvaluationResult, 
  ProctoringViolationType, 
  GeminiSceneVerdict 
} from "../../types";
import { ProctoringSystemCheck } from "./ProctoringSystemCheck";
import { ProctoringReviewerDashboard } from "./ProctoringReviewerDashboard";

interface LiveProctoringStudioProps {
  onClose?: () => void;
}

export const LiveProctoringStudio: React.FC<LiveProctoringStudioProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"exam" | "reviewer" | "system_check">("exam");
  const [showSystemCheckModal, setShowSystemCheckModal] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState(true);
  const [isProctorActive, setIsProctorActive] = useState(true);
  const [useWebcam, setUseWebcam] = useState(false);

  // Calibration and Hardware state
  const [isCalibrated, setIsCalibrated] = useState(true);
  const [lightingQuality, setLightingQuality] = useState(88);
  const [micVolume, setMicVolume] = useState(12);

  // Active Candidate Simulation & Detection State
  const [activeScenario, setActiveScenario] = useState<
    "clear" | "gaze_deviation" | "multiple_faces" | "face_absent" | "phone_detected" | "notes_detected" | "audio_disruption"
  >("clear");

  // Real-time On-Device Geometry Telemetry
  const [gazeDirection, setGazeDirection] = useState<"CENTER" | "LEFT" | "RIGHT" | "DOWN">("CENTER");
  const [headYaw, setHeadYaw] = useState<number>(2.4);
  const [headPitch, setHeadPitch] = useState<number>(-1.1);
  const [faceConfidence, setFaceConfidence] = useState<number>(0.98);
  const [trustScore, setTrustScore] = useState<number>(96);

  // Periodic Gemini Cloud Review State
  const [lastGeminiVerdict, setLastGeminiVerdict] = useState<GeminiSceneVerdict>({
    person_count: 1,
    phone_or_device_visible: false,
    notes_or_paper_visible: false,
    candidate_looking_at_screen: true,
    camera_obstructed: false,
    confidence: 0.96,
    notes: "Candidate solitary and focused on assessment interface."
  });
  const [geminiScanCountdown, setGeminiScanCountdown] = useState(6);
  const [isGeminiScanning, setIsGeminiScanning] = useState(false);

  // Warnings & Event state
  const [softWarnings, setSoftWarnings] = useState(0);
  const [maxWarnings] = useState(3);
  const [mentorAlertTriggered, setMentorAlertTriggered] = useState(false);
  const [warningToast, setWarningToast] = useState<{ message: string; type: "warning" | "danger" } | null>(null);

  // Exam MCQ State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({ 0: 1 });
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [examTimeRemaining, setExamTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const countdownIntervalRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Trade Questions Data (NSQF Level 4/5 Electrical & Circuits)
  const mcqQuestions = [
    {
      id: 1,
      trade: "NSQF Level 4 Electrical - Safety Standards",
      question: "Which calibrated instrument is mandatory to confirm de-energization (0V across Line-Neutral & Line-Earth) before servicing an industrial 415V distribution board?",
      options: [
        "A. Single-pole neon test screwdriver",
        "B. Calibrated True-RMS digital multimeter with CAT III / 1000V rated safety probes",
        "C. Visual confirmation of the isolator switch handle position only",
        "D. AC clamp meter wrapped around secondary conduit without direct copper contact"
      ],
      correct: 1
    },
    {
      id: 2,
      trade: "NSQF Level 4 Electrical - Personal Protective Equipment",
      question: "What is the minimum EN 60903 / IEC dielectric glove rating required when performing live terminal torque inspection on commercial panels?",
      options: [
        "A. Class 00 (Proof test: 2,500V AC, Max use: 500V AC)",
        "B. Class 0 (Proof test: 5,000V AC, Max use: 1,000V AC)",
        "C. Standard cotton flame-retardant utility gloves",
        "D. Polyurethane coated mechanical grip gloves"
      ],
      correct: 1
    },
    {
      id: 3,
      trade: "NSQF Level 4 Electrical - Procedural Standards",
      question: "What is the acceptable tolerance limit for severed or nicked copper strands when stripping 2.5 mm² multi-strand flexible conductors?",
      options: [
        "A. Up to 2 nicked strands per conductor",
        "B. Up to 10% cross-sectional area loss",
        "C. Exactly zero (0) severed or nicked copper strands",
        "D. Minor strand damage if insulated heat-shrink tubing is applied"
      ],
      correct: 2
    },
    {
      id: 4,
      trade: "NSQF Level 4 Circuits - Protection & Grounding",
      question: "When calculating Earth Fault Loop Impedance (Zs) in a TN-C-S earthing system, which mathematical formula is correct?",
      options: [
        "A. Zs = Ze + (R1 + R2)",
        "B. Zs = Ze × (R1 / R2)",
        "C. Zs = Ze - (R1 + R2)",
        "D. Zs = (Ze + R1) / R2"
      ],
      correct: 0
    },
    {
      id: 5,
      trade: "NSQF Level 5 Electrical - Motor Control",
      question: "In a Star-Delta starting circuit for a 3-phase induction motor, how does the starting line current compare to direct-on-line (DOL) starting?",
      options: [
        "A. Reduced to 1/√3 (approx. 58%) of the DOL current",
        "B. Reduced to 1/3 (approx. 33%) of the DOL current",
        "C. Exactly equal to the DOL current",
        "D. Increased by a factor of 1.732"
      ],
      correct: 1
    }
  ];

  // Timer countdown for exam
  useEffect(() => {
    if (!isExamStarted || isExamSubmitted) return;
    const timer = setInterval(() => {
      setExamTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamStarted, isExamSubmitted]);

  // Periodic Cloud AI Review countdown & execution (Google AI Studio Gemini Vision)
  useEffect(() => {
    if (!isProctorActive || isExamSubmitted) return;

    const interval = setInterval(async () => {
      setGeminiScanCountdown(prev => {
        if (prev <= 1) {
          triggerCloudSceneReview();
          return 8; // Reset countdown to 8 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isProctorActive, activeScenario, isExamSubmitted]);

  // Capture canvas frame and send to backend Gemini Vision API
  const triggerCloudSceneReview = async () => {
    setIsGeminiScanning(true);
    try {
      let imageBase64 = "";
      if (useWebcam && videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = 480;
        canvas.height = 360;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, 480, 360);
          imageBase64 = canvas.toDataURL("image/jpeg", 0.7);
        }
      }

      // Map current active scenario
      const scenarioParam = activeScenario === "phone_detected" 
        ? "phone" 
        : activeScenario === "multiple_faces" 
        ? "multiple_persons" 
        : activeScenario === "notes_detected"
        ? "notes"
        : activeScenario === "face_absent"
        ? "camera_obstructed"
        : undefined;

      const res = await fetch("/api/sessions/sess_nsqf_ele_2026_01/snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "sess_nsqf_ele_2026_01",
          image_base64: imageBase64 || undefined,
          scenario: scenarioParam
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.verdict) {
          setLastGeminiVerdict(data.verdict);
          if (data.flagged) {
            handleIssueWarning(data.verdict.notes || "Cloud AI review flagged an assessment anomaly.");
          }
        }
      }
    } catch (err) {
      console.warn("Cloud scene check error:", err);
    } finally {
      setIsGeminiScanning(false);
    }
  };

  // Debounced warning handler
  const handleIssueWarning = (reason: string) => {
    setSoftWarnings(prev => {
      const next = prev + 1;
      if (next >= maxWarnings) {
        setMentorAlertTriggered(true);
        setTrustScore(prevScore => Math.max(35, prevScore - 20));
      } else {
        setTrustScore(prevScore => Math.max(50, prevScore - 10));
      }
      return next;
    });

    setWarningToast({
      message: reason,
      type: softWarnings >= 2 ? "danger" : "warning"
    });

    setTimeout(() => {
      setWarningToast(null);
    }, 4500);
  };

  // Browser Visibility & Tab Switch Listeners (Page Visibility API)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isProctorActive) {
        handleIssueWarning("Browser tab switch or window minimize detected (Alt+Tab recorded).");
        // Log to backend
        fetch("/api/sessions/sess_nsqf_ele_2026_01/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "TAB_SWITCH",
            source: "local",
            severity: "HIGH",
            title: "Browser Tab Focus Lost (Alt+Tab)",
            description: "Page Visibility API registered browser hidden state."
          })
        }).catch(() => {});
      }
    };

    const handleCopyPaste = (e: ClipboardEvent) => {
      if (isProctorActive) {
        e.preventDefault();
        handleIssueWarning("Clipboard copy/paste blocked during proctored exam.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
    };
  }, [isProctorActive, softWarnings]);

  // Scenario updates for live on-device telemetry simulation
  useEffect(() => {
    if (activeScenario === "gaze_deviation") {
      setGazeDirection("RIGHT");
      setHeadYaw(24.8);
      setHeadPitch(-4.2);
      setFaceConfidence(0.94);
    } else if (activeScenario === "face_absent") {
      setGazeDirection("CENTER");
      setFaceConfidence(0.0);
    } else if (activeScenario === "multiple_faces") {
      setGazeDirection("CENTER");
      setFaceConfidence(0.99);
    } else {
      setGazeDirection("CENTER");
      setHeadYaw(2.1);
      setHeadPitch(-1.2);
      setFaceConfidence(0.98);
    }
  }, [activeScenario]);

  const handleResetWarnings = async () => {
    try {
      await fetch("/api/v1/proctor/reset", { method: "POST" });
      setSoftWarnings(0);
      setMentorAlertTriggered(false);
      setTrustScore(96);
      setActiveScenario("clear");
    } catch (e) {
      console.error(e);
    }
  };

  const currentQ = mcqQuestions[currentQuestionIndex];
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* System Pre-Check Calibration Modal */}
      {showSystemCheckModal && (
        <ProctoringSystemCheck
          onComplete={(data) => {
            setIsCalibrated(data.calibrated);
            setLightingQuality(data.lightingScore);
            if (data.stream) {
              setUseWebcam(true);
              mediaStreamRef.current = data.stream;
              if (videoRef.current) {
                videoRef.current.srcObject = data.stream;
              }
            }
            setShowSystemCheckModal(false);
          }}
          onCancel={() => setShowSystemCheckModal(false)}
        />
      )}

      {/* Mode Navigation Tabs & Top Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10.5px] font-mono font-bold uppercase">
              NSQF PROCTORING ENGINE • REAL-TIME VISION & GEMINI
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <span className={`w-2 h-2 rounded-full ${isProctorActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
              {isProctorActive ? "REAL-TIME TRACKING ACTIVE (30 FPS)" : "PROCTOR PAUSED"}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Proctored Assessment Test & Live Invigilation Center
          </h2>
          <p className="text-xs text-slate-400 font-light max-w-2xl">
            Dual-layer integrity verification with on-device iris/gaze estimation and Google AI Studio Gemini 2.5 Flash cloud scene audit.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("exam")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "exam"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Candidate Assessment
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reviewer")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "reviewer"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Reviewer Audit Dossier
          </button>

          <button
            type="button"
            onClick={() => setShowSystemCheckModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Re-Calibrate
          </button>
        </div>
      </div>

      {/* REVIEWER AUDIT DOSSIER TAB */}
      {activeTab === "reviewer" && (
        <ProctoringReviewerDashboard
          sessionId="sess_nsqf_ele_2026_01"
          onClose={() => setActiveTab("exam")}
        />
      )}

      {/* CANDIDATE EXAM TAB */}
      {activeTab === "exam" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 5 Cols: Video Feed, On-Device Landmarks & Telemetry HUD */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              
              {/* Header inside HUD */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Live Proctoring Camera HUD</h3>
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                      Iris Vector • Head Pose • Cloud Vision
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 cursor-pointer bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={useWebcam}
                    onChange={(e) => {
                      setUseWebcam(e.target.checked);
                      if (e.target.checked && !mediaStreamRef.current) {
                        setShowSystemCheckModal(true);
                      }
                    }}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Live Webcam</span>
                </label>
              </div>

              {/* Viewport Box */}
              <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-3.5 group">
                {useWebcam ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  /* Simulated Classroom Camera Visualizer */
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                    <div className="text-center space-y-2 relative">
                      <div className={`w-28 h-28 mx-auto rounded-full border-2 flex items-center justify-center transition-all ${
                        activeScenario === "face_absent"
                          ? "border-dashed border-rose-500/60 bg-rose-500/10 scale-90"
                          : activeScenario === "multiple_faces"
                          ? "border-amber-400 bg-amber-500/10"
                          : activeScenario === "phone_detected"
                          ? "border-rose-500 bg-rose-500/20 animate-pulse"
                          : activeScenario === "gaze_deviation"
                          ? "border-cyan-400 bg-cyan-500/10"
                          : "border-emerald-400/80 bg-emerald-500/10"
                      }`}>
                        {activeScenario === "phone_detected" ? (
                          <Smartphone className="w-12 h-12 text-rose-400 animate-bounce" />
                        ) : activeScenario === "notes_detected" ? (
                          <FileText className="w-12 h-12 text-amber-400" />
                        ) : (
                          <Users className={`w-12 h-12 ${
                            activeScenario === "face_absent" ? "text-rose-400 opacity-20" : "text-slate-200"
                          }`} />
                        )}
                      </div>

                      <div className="text-[11px] font-mono font-bold text-slate-300">
                        {activeScenario === "face_absent"
                          ? "NO FACE IN CAMERA VIEW"
                          : activeScenario === "multiple_faces"
                          ? "2 INDIVIDUALS DETECTED IN FRAME"
                          : activeScenario === "phone_detected"
                          ? "PHONE SCREEN DETECTED IN HAND"
                          : activeScenario === "notes_detected"
                          ? "UNAUTHORIZED NOTES ON DESK"
                          : activeScenario === "gaze_deviation"
                          ? "GAZE VECTOR DEVIATION (24° RIGHT)"
                          : "CANDIDATE CENTERED & VERIFIED"}
                      </div>
                    </div>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                {/* Top Telemetry Overlay */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] font-mono text-cyan-300">
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span>GAZE: {gazeDirection}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] font-mono text-emerald-300">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>
                      {isGeminiScanning 
                        ? "GEMINI SCANNING..." 
                        : `NEXT AI REVIEW: ${geminiScanCountdown}s`}
                    </span>
                  </div>
                </div>

                {/* Bottom Telemetry Overlay */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] font-mono text-slate-300">
                    <span>Pose Yaw: {headYaw}° • Pitch: {headPitch}°</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] font-mono text-cyan-300">
                    <span>Trust Index: {trustScore}%</span>
                  </div>
                </div>
              </div>

              {/* Warning Count & Health Status */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10.5px] font-mono text-slate-400 uppercase">Warning Counter</div>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: maxWarnings }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-colors ${
                          idx < softWarnings
                            ? "bg-rose-500 text-white shadow-md shadow-rose-500/40"
                            : "bg-slate-800 text-slate-500 border border-slate-700"
                        }`}
                      >
                        {idx + 1}
                      </div>
                    ))}
                    <span className="text-xs font-mono text-slate-300 ml-2">
                      ({softWarnings}/{maxWarnings} Soft Warnings)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetWarnings}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Instant Scenario Simulator Drawer (For Zero-Webcam Testing) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Detection Scenario Simulator</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Instant Test Triggers</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveScenario("clear");
                    }}
                    className={`p-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                      activeScenario === "clear"
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Nominal / Clear
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveScenario("gaze_deviation");
                      handleIssueWarning("Sustained gaze deviation >24° off-screen detected (>3.0s).");
                    }}
                    className={`p-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                      activeScenario === "gaze_deviation"
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Off-Screen Gaze
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveScenario("phone_detected");
                      triggerCloudSceneReview();
                    }}
                    className={`p-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                      activeScenario === "phone_detected"
                        ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Phone in Hand
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveScenario("notes_detected");
                      triggerCloudSceneReview();
                    }}
                    className={`p-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                      activeScenario === "notes_detected"
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Notes on Desk
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveScenario("multiple_faces");
                      triggerCloudSceneReview();
                    }}
                    className={`p-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                      activeScenario === "multiple_faces"
                        ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    2nd Person
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveScenario("face_absent");
                      handleIssueWarning("No candidate face visible in frame (>2.5s).");
                    }}
                    className={`p-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                      activeScenario === "face_absent"
                        ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Camera Occluded
                  </button>
                </div>
              </div>

              {/* Active Warning Banner */}
              {warningToast && (
                <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2.5 animate-in slide-in-from-top-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-semibold">{warningToast.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right 7 Cols: Interactive Technical NSQF Exam Question UI */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              
              {/* Exam Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold border border-cyan-500/30">
                      {currentQ.trade}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Question {currentQuestionIndex + 1} of {mcqQuestions.length}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Industrial Competency Assessment
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{formatTime(examTimeRemaining)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFlaggedQuestions(prev => ({
                        ...prev,
                        [currentQuestionIndex]: !prev[currentQuestionIndex]
                      }));
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                      flaggedQuestions[currentQuestionIndex]
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{flaggedQuestions[currentQuestionIndex] ? "Flagged" : "Flag"}</span>
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <p className="text-sm font-semibold text-white leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedAnswers(prev => ({
                          ...prev,
                          [currentQuestionIndex]: idx
                        }));
                      }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-cyan-500/15 border-cyan-500 text-white shadow-md shadow-cyan-500/10"
                          : "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950"
                      }`}
                    >
                      <span className="text-xs font-medium leading-relaxed pr-4">{option}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "bg-cyan-500 border-cyan-400 text-slate-950" : "border-slate-700 bg-slate-900"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Question Navigation & Submit */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  {mcqQuestions.map((_, qIdx) => {
                    const isAnswered = selectedAnswers[qIdx] !== undefined;
                    const isCurrent = currentQuestionIndex === qIdx;
                    const isFlagged = flaggedQuestions[qIdx];

                    return (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => setCurrentQuestionIndex(qIdx)}
                        className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer relative ${
                          isCurrent
                            ? "bg-cyan-500 text-slate-950 ring-2 ring-cyan-300 shadow-md shadow-cyan-500/30"
                            : isAnswered
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        {qIdx + 1}
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {currentQuestionIndex < mcqQuestions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIndex(prev => Math.min(mcqQuestions.length - 1, prev + 1))}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsExamSubmitted(true);
                        setActiveTab("reviewer");
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Submit Exam</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
