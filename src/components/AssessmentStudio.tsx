import React, { useState, useRef } from "react";
import { useAssessment } from "../store/assessmentContext";
import { 
  Mic, 
  Video, 
  Upload, 
  Play, 
  Square, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  Eye, 
  Camera, 
  Layers,
  ArrowRight
} from "lucide-react";

interface AssessmentStudioProps {
  onAssessmentComplete: () => void;
}

export const AssessmentStudio: React.FC<AssessmentStudioProps> = ({ onAssessmentComplete }) => {
  const { selectedCourse, runAssessment, phase } = useAssessment();

  // Audio State
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioRecorded, setAudioRecorded] = useState(true);
  const [audioTranscriptPreview, setAudioTranscriptPreview] = useState(
    "Before opening the distribution panel, I isolated the 32-amp main isolator switch and verified zero voltage across phase and neutral terminals with my multimeter."
  );
  const [audioSeconds, setAudioSeconds] = useState(18);

  // Video State
  const [selectedBenchmarkVideo, setSelectedBenchmarkVideo] = useState("mcb_wiring");
  const [simulateOcclusion, setSimulateOcclusion] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleStartRecording = () => {
    setIsRecordingAudio(true);
    setAudioSeconds(0);
    const interval = setInterval(() => {
      setAudioSeconds((prev) => {
        if (prev >= 20) {
          clearInterval(interval);
          setIsRecordingAudio(false);
          setAudioRecorded(true);
          return 20;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecordingAudio(false);
    setAudioRecorded(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleRunEvaluation = async () => {
    setIsUploading(true);
    setPipelineStep("1/4: Ingesting video blob & extracting keyframes at 1.5 FPS...");

    setTimeout(() => {
      setPipelineStep("2/4: Demuxing 16kHz audio & running Whisper STT...");
    }, 1200);

    setTimeout(() => {
      setPipelineStep("3/4: Dispatching Gemini 1.5 Flash Safety Agent & Sequence Agent in parallel...");
    }, 2500);

    setTimeout(() => {
      setPipelineStep("4/4: Evaluating occlusion metrics & synthesizing Master Scorecard...");
    }, 4200);

    try {
      await runAssessment(null, videoFile, {
        simulatedOcclusion: simulateOcclusion,
        taskCode: selectedCourse.currentTaskId
      });
      setIsUploading(false);
      onAssessmentComplete();
    } catch (e) {
      console.error(e);
      setIsUploading(false);
      onAssessmentComplete();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1424] to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              DUAL-MODAL VERIFICATION STUDIO
            </span>
            <span className="text-xs font-mono text-slate-500">NSQF LEVEL {selectedCourse.nsqfLevel}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {selectedCourse.currentTaskTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Complete Step 1 (Contextual Verbal Reasoning) and Step 2 (Physical Execution Video) to trigger multi-agent evaluation.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 shrink-0">
          Latency Budget: <span className="text-emerald-400 font-bold">&lt; 9.0s</span>
        </div>
      </div>

      {/* Grid: Audio Reasoning (Left) & Physical Video Audit (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Verbal Reasoning Audio */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Step 1: Verbal Reasoning (15-30s Audio)</h3>
                  <span className="text-[11px] text-slate-400 font-mono">Articulate safety isolation & diagnostics</span>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {audioSeconds}s / 30s
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              State: (1) Main isolator switch de-energization, (2) Multimeter zero-voltage check across phase-neutral, (3) Earth continuity bonding.
            </p>

            {/* Audio Waveform / Recorder HUD */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Audio Stream: 16kHz Mono WAV</span>
                <span className={isRecordingAudio ? "text-red-400 animate-pulse font-bold" : "text-emerald-400"}>
                  {isRecordingAudio ? "RECORDING IN PROGRESS" : audioRecorded ? "AUDIO CAPTURED" : "READY"}
                </span>
              </div>

              {/* Simulated Audio Bars */}
              <div className="h-10 flex items-center justify-center gap-1">
                {[12, 28, 45, 18, 36, 52, 60, 42, 25, 33, 48, 20, 15, 30, 42, 19, 25, 38].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${isRecordingAudio ? Math.min(100, h * 1.4) : audioRecorded ? h * 0.7 : 8}%` }}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isRecordingAudio
                        ? "bg-amber-400 animate-pulse"
                        : audioRecorded
                        ? "bg-emerald-500"
                        : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>

              {/* Transcript Preview */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 italic">
                "{audioTranscriptPreview}"
              </div>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-2 pt-2">
            {!isRecordingAudio ? (
              <button
                type="button"
                id="btn-record-audio"
                onClick={handleStartRecording}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                <span>Record New Voice Reasoning</span>
              </button>
            ) : (
              <button
                type="button"
                id="btn-stop-audio"
                onClick={handleStopRecording}
                className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Stop & Save Reasoning</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setAudioRecorded(true);
                setAudioSeconds(18);
              }}
              className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              Use Sample
            </button>
          </div>
        </div>

        {/* Step 2: Physical Execution Video */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Step 2: Physical Execution Video (30-60s)</h3>
                  <span className="text-[11px] text-slate-400 font-mono">OpenCV 1.5 FPS decimation & PPE audit</span>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                36.0s MP4
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              The camera monitors: (1) 1000V dielectric insulated glove compliance, (2) Clean 0-nick wire stripping, (3) Terminal insertion torque & 15N pull test.
            </p>

            {/* Benchmark Video Selection */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Standard Benchmark Video Clip
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBenchmarkVideo("mcb_wiring")}
                  className={`p-2 rounded-lg border text-left text-xs transition-colors ${
                    selectedBenchmarkVideo === "mcb_wiring"
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="truncate">MCB 32A Wiring Run</div>
                  <div className="text-[10px] font-normal text-slate-500">Benchmark #ELE-402</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBenchmarkVideo("solar_combiner")}
                  className={`p-2 rounded-lg border text-left text-xs transition-colors ${
                    selectedBenchmarkVideo === "solar_combiner"
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="truncate">Solar DC Combiner</div>
                  <div className="text-[10px] font-normal text-slate-500">Benchmark #SOL-201</div>
                </button>
              </div>

              {/* Responsible AI Occlusion Simulator Toggle (PRD Section 1.1 Step 3 & US-03) */}
              <div className="pt-2 border-t border-slate-800/80">
                <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    id="simulate-occlusion-checkbox"
                    checked={simulateOcclusion}
                    onChange={(e) => setSimulateOcclusion(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span className="text-slate-300">
                    Simulate <strong>Torso Occlusion (&gt;40%)</strong>
                  </span>
                </label>
                <span className="text-[10px] text-amber-400/80 font-mono block pl-5 mt-0.5">
                  Triggers Responsible AI STATUS: UNCERTAIN_EVIDENCE → Faculty Review Queue
                </span>
              </div>
            </div>
          </div>

          {/* Upload Custom Video Option */}
          <div className="pt-1">
            <input
              type="file"
              accept="video/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-dashed border-slate-700 text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{videoFile ? `Attached: ${videoFile.name}` : "Or Upload Custom Workbench MP4 Video"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Agent Intelligence Core Execution Bar */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Multi-Agent Dual-Evidence Verification Engine</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simultaneously dispatches Whisper Speech NLP Agent, OpenCV Keyframe Sampler, and Gemini 1.5 Flash Vision Swarm.
            </p>
          </div>

          <button
            type="button"
            id="btn-trigger-evaluation"
            disabled={isUploading}
            onClick={handleRunEvaluation}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Running Multi-Agent Audit...</span>
              </>
            ) : (
              <>
                <span>Run Dual-Evidence Audit</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Live Pipeline State Indicator */}
        {isUploading && (
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-mono text-amber-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                {pipelineStep}
              </span>
              <span>8s Circuit Breaker Active</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full w-3/4 animate-pulse rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
