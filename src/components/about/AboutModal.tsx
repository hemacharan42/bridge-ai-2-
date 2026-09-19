import React from "react";
import { X, ShieldCheck, Award, Zap, Cpu, Video, CheckCircle2 } from "lucide-react";
import { BridgeLogo } from "../brand/BridgeLogo";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Official Bridge Logo */}
        <div className="flex items-center gap-4 mb-5 pb-4 border-b border-slate-800">
          <BridgeLogo variant="badge" size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-wider text-white font-sans">BRIDGE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                NSQF L4/L5
              </span>
            </div>
            <div className="text-xs font-mono text-slate-300 mt-0.5 flex items-center gap-1.5">
              <span className="text-cyan-400">Bridging Traditional Learning</span>
              <span className="text-slate-500">and</span>
              <span className="text-amber-400">market requirements</span>
            </div>
          </div>
        </div>

        {/* Mission */}
        <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
          Bridge bridges the gap between traditional vocational curriculum and rigorous market requirements.
          By combining audio viva-voce reasoning with unedited 30fps computer vision audit feeds, the platform certifies real hands-on technical competence with zero hallucinations.
        </p>

        {/* Pillars: 4 Differentiated Sub-Agents Architecture */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              4 Differentiated Sub-Agent Engines
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Autonomous & Multimodal Pipeline</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Agent 1: Live Video & Audio Proctor</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                Evaluates real-time MCQ examination streams at 1.5 FPS decimation for face presence, gaze deviation &gt;15°, and audio whispering. Dispatches mentor webhooks upon 3 warnings.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs font-mono">
                <Cpu className="w-4 h-4" />
                <span>Agent 2: Multimodal Barcode Verifier</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                Inspects video keyframes for physical QR/UPC/Code 128 tags. Handles barcode matching, &gt;30% occlusion, and alerts mentors upon mismatch or uncertain evidence.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs font-mono">
                <Zap className="w-4 h-4" />
                <span>Agent 3: Speech Reasoning & Viva</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                Whisper STT and Gemini 1.5/3.8 evaluate conversational technical terminology, zero-potential de-energization reasoning, and safety precautions.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs font-mono">
                <Video className="w-4 h-4" />
                <span>Agent 4: Safety & Sequence Inspector</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                Multimodal 30fps vision pipeline for PPE compliance (1000V gloves), torque pull tests, and 8.0s circuit breaker routing to Faculty Review Queue.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-amber-950/30 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Compliant with DGT & NSDC National Occupational Standards</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
