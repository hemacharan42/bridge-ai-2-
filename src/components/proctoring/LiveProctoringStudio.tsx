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
  Info
} from "lucide-react";
import { ProctoringEvaluationResult, ProctoringViolationType } from "../../types";

interface LiveProctoringStudioProps {
  onClose?: () => void;
}

export const LiveProctoringStudio: React.FC<LiveProctoringStudioProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const [activeScenario, setActiveScenario] = useState<"clear" | "gaze_deviation" | "multiple_faces" | "face_absent" | "audio_disruption">("clear");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [latestResult, setLatestResult] = useState<ProctoringEvaluationResult>({
    frame_timestamp_ms: Date.now(),
    proctoring_status: "CLEAR",
    violations: [],
    issue_warning: false,
    warnings_issued: 0,
    max_warnings: 3,
    trigger_mentor_alert: false,
    mentor_notified: false,
    reason: "Candidate centered, iris locked, clear acoustic channel."
  });

  const [eventHistory, setEventHistory] = useState<Array<{
    timestamp: string;
    status: string;
    type?: string;
    detail: string;
    warningCount: number;
    mentorAlert: boolean;
  }>>([
    {
      timestamp: new Date().toLocaleTimeString(),
      status: "CLEAR",
      detail: "Sub-Agent 1 (Live Video & Audio Proctor) initialized at 1.5 FPS decimation.",
      warningCount: 0,
      mentorAlert: false
    }
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({ 0: 1 });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<any>(null);

  const mcqQuestions = [
    {
      id: 1,
      trade: "NSQF Level 4 Electrical",
      question: "Which instrument must be used to ensure zero potential before performing internal wiring on a 415V distribution board?",
      options: [
        "A. Single-pole neon test screwdriver",
        "B. Calibrated True-RMS digital multimeter across phase-to-neutral & phase-to-earth",
        "C. Visual examination of the main lever position only",
        "D. AC clamp meter around secondary conduit without direct contact"
      ],
      correct: 1
    },
    {
      id: 2,
      trade: "NSQF Level 4 Safety Protocols",
      question: "What is the minimum dielectric rating required for personal protective gloves in commercial industrial panel maintenance?",
      options: [
        "A. 250V Class 00",
        "B. 1000V Class 0 (EN 60903 compliant)",
        "C. Standard cotton thermal work gloves",
        "D. 500V Class 00 nitrile dipped"
      ],
      correct: 1
    },
    {
      id: 3,
      trade: "NSQF Level 4 Procedural Standards",
      question: "What is the acceptable tolerance limit for conductor strand nicking during stripping of 2.5 mm² multi-strand copper cables?",
      options: [
        "A. Up to 2 cut strands per conductor",
        "B. Up to 10% cross-sectional area loss",
        "C. Zero (0) severed or nicked copper strands",
        "D. Minor score marks if insulated tape is applied"
      ],
      correct: 2
    }
  ];

  // Initialize webcam if selected
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useWebcam) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn("Webcam access declined, using canvas simulation:", err);
          setUseWebcam(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useWebcam]);

  // Periodic proctoring evaluation loop
  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      evaluateFrame();
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, activeScenario, useWebcam]);

  const evaluateFrame = async (overrideScenario?: typeof activeScenario) => {
    setIsEvaluating(true);
    const scenario = overrideScenario || activeScenario;

    let frameBase64: string | undefined = undefined;

    // Capture from webcam if enabled
    if (useWebcam && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, 320, 240);
          frameBase64 = canvas.toDataURL("image/jpeg", 0.7);
        }
      }
    }

    try {
      const res = await fetch("/api/v1/proctor/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frame_bytes_base64: frameBase64,
          simulated_scenario: scenario,
          timestamp_ms: Date.now(),
          candidate_id: "STUDENT_ITI_DL_2026_042"
        })
      });

      const data: ProctoringEvaluationResult = await res.json();
      setLatestResult(data);

      const topViolation = data.violations[0];
      setEventHistory((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          status: data.proctoring_status,
          type: topViolation?.type,
          detail: topViolation?.details || data.reason || "Stream nominal",
          warningCount: data.warnings_issued,
          mentorAlert: data.trigger_mentor_alert
        },
        ...prev.slice(0, 19)
      ]);
    } catch (err) {
      console.error("Proctoring API error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = async () => {
    try {
      await fetch("/api/v1/proctor/reset", { method: "POST" });
      setLatestResult((prev) => ({
        ...prev,
        warnings_issued: 0,
        trigger_mentor_alert: false,
        mentor_notified: false,
        proctoring_status: "CLEAR",
        violations: []
      }));
      setEventHistory((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          status: "RESET",
          detail: "Proctoring warning counter reset to 0 by proctoring administrator.",
          warningCount: 0,
          mentorAlert: false
        },
        ...prev
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  const currentQ = mcqQuestions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono uppercase font-bold">
              SUB-AGENT 1 • REAL-TIME VISION & AUDIO PROCTOR
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
              {isActive ? "ACTIVE PROCTORING (1.5 FPS)" : "IDLE (STANDBY)"}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Live AI Proctoring Sub-Agent Studio & Examination Hall
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Simultaneously tracks candidate face presence, iris/gaze tracking (&gt;15° off-axis for &gt;2s), and secondary audio whispering. Dispatches mentor alerts upon exceeding 3 warnings.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Warnings ({latestResult.warnings_issued}/3)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsActive(!isActive);
              if (!isActive) evaluateFrame();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-lg ${
              isActive
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{isActive ? "Stop Proctor Stream" : "Start Live Proctor Stream"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Proctoring HUD & MCQ Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Candidate Video Feed & AI Proctoring Overlay */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Live Candidate Feed</h3>
                  <span className="text-[10px] font-mono text-slate-400">1280x720 • Decimated 1.5 FPS</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useWebcam}
                    onChange={(e) => setUseWebcam(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Use My Webcam</span>
                </label>
              </div>
            </div>

            {/* Video Viewport & Computer Vision Overlays */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-3">
              {useWebcam ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                /* Simulated Candidate Room View */
                <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className={`w-24 h-24 mx-auto rounded-full border-2 flex items-center justify-center transition-all ${
                      activeScenario === "face_absent"
                        ? "border-dashed border-rose-500/60 bg-rose-500/10"
                        : activeScenario === "multiple_faces"
                        ? "border-amber-400 bg-amber-500/10"
                        : activeScenario === "gaze_deviation"
                        ? "border-cyan-400 bg-cyan-500/10"
                        : "border-emerald-400 bg-emerald-500/10"
                    }`}>
                      <Users className={`w-10 h-10 ${
                        activeScenario === "face_absent" ? "text-rose-400 opacity-30" : "text-slate-200"
                      }`} />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 block">
                      {activeScenario === "face_absent"
                        ? "NO FACE IN FRAME"
                        : activeScenario === "multiple_faces"
                        ? "2 CANDIDATES IN FRAME"
                        : activeScenario === "gaze_deviation"
                        ? "GAZE: 24° OFF-CENTER (RIGHT)"
                        : "CANDIDATE CENTERED & LOCKED"}
                    </span>
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />

              {/* Top HUD: Gaze & Audio Status */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                <span className={`px-2 py-0.5 rounded-md backdrop-blur-md border ${
                  latestResult.proctoring_status === "CLEAR"
                    ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-950/80 border-rose-500/30 text-rose-300"
                }`}>
                  STATUS: {latestResult.proctoring_status}
                </span>

                <span className="px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-700 text-slate-300">
                  Warnings: <strong className={latestResult.warnings_issued >= 3 ? "text-rose-400 font-bold" : "text-amber-400"}>{latestResult.warnings_issued}</strong> / 3
                </span>
              </div>

              {/* Iris Tracking Reticle (Simulated MediaPipe Gaze Mesh) */}
              <div className="relative z-10 pointer-events-none self-center flex items-center justify-center">
                <div className={`w-32 h-32 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all ${
                  latestResult.proctoring_status === "CLEAR"
                    ? "border-emerald-400/40"
                    : "border-rose-400 animate-pulse bg-rose-500/10"
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    activeScenario === "gaze_deviation"
                      ? "bg-rose-400 translate-x-8"
                      : "bg-cyan-400"
                  }`} />
                </div>
              </div>

              {/* Bottom HUD: Live Diagnostics */}
              <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-300">
                <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <Activity className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{latestResult.reason || "Acoustic & visual stream clear"}</span>
                </span>
                <span className="text-cyan-400 shrink-0">16kHz Mono</span>
              </div>
            </div>

            {/* Simulated Live Violation Injection Controls */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Simulate Candidate Sub-Agent Behavior
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "clear", label: "Nominal / Centered", icon: ShieldCheck, color: "text-emerald-400" },
                  { id: "gaze_deviation", label: "Gaze Deviation (>15°)", icon: Eye, color: "text-amber-400" },
                  { id: "multiple_faces", label: "Multiple Persons", icon: Users, color: "text-rose-400" },
                  { id: "face_absent", label: "Face Missing", icon: AlertTriangle, color: "text-rose-400" },
                  { id: "audio_disruption", label: "Audio Whispering", icon: Volume2, color: "text-amber-400" }
                ].map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      setActiveScenario(sc.id as any);
                      evaluateFrame(sc.id as any);
                    }}
                    className={`p-2 rounded-xl border text-left text-xs font-mono transition-all flex items-center gap-2 ${
                      activeScenario === sc.id
                        ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <sc.icon className={`w-3.5 h-3.5 ${sc.color}`} />
                    <span className="truncate">{sc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mentor Alert Dispatch Banner if 3 warnings exceeded */}
            {latestResult.trigger_mentor_alert && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-bold font-mono text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span>3/3 WARNINGS EXCEEDED: MENTOR ALERT DISPATCHED</span>
                </div>
                <p className="text-[11px] font-light text-rose-300/90 leading-relaxed">
                  Webhook payload sent to <code>https://bridge-audit.nsqf.gov.in/webhooks/mentor-alerts</code>. Human proctor intervention requested.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 7 Cols: MCQ Candidate Examination Interface & Proctoring Audit Timeline */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Examination Question Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  {currentQ.trade}
                </span>
                <h3 className="text-base font-bold text-white">
                  Theory Question {currentQuestionIndex + 1} of {mcqQuestions.length}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                {mcqQuestions.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(i)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                      currentQuestionIndex === i
                        ? "bg-cyan-500 text-slate-950"
                        : selectedAnswers[i] !== undefined
                        ? "bg-slate-800 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-950 text-slate-500 border border-slate-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm font-medium text-slate-100 leading-relaxed">
              {currentQ.question}
            </p>

            {/* Answer Radio Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIndex) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIndex;
                return (
                  <button
                    key={optIndex}
                    type="button"
                    onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: optIndex })}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-200 font-medium"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? "border-cyan-400 bg-cyan-400" : "border-slate-700"
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </div>
                    <span className="leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-mono text-slate-300"
              >
                Previous Question
              </button>

              <button
                type="button"
                disabled={currentQuestionIndex === mcqQuestions.length - 1}
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(mcqQuestions.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-xs font-mono font-bold text-slate-950"
              >
                Next Question
              </button>
            </div>
          </div>

          {/* Real-Time Sub-Agent Telemetry Stream Log */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                  Live Sub-Agent 1 Proctoring Event Telemetry
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Decimation: 1.5 FPS • Buffer: 20 events
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {eventHistory.map((ev, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-[11px] font-mono flex items-center justify-between gap-3 ${
                    ev.mentorAlert
                      ? "bg-rose-950/30 border-rose-500/40 text-rose-200"
                      : ev.status === "CLEAR"
                      ? "bg-slate-950/60 border-slate-800/80 text-slate-400"
                      : "bg-amber-950/20 border-amber-500/30 text-amber-300"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-500 shrink-0">{ev.timestamp}</span>
                    <span className="font-bold text-slate-200 shrink-0">[{ev.status}]</span>
                    <span className="truncate">{ev.detail}</span>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {ev.warningCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 text-[10px]">
                        Warn {ev.warningCount}/3
                      </span>
                    )}
                    {ev.mentorAlert && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white font-bold text-[10px]">
                        MENTOR ALERT
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
