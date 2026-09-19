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

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase font-mono">
              <Zap className="w-4 h-4" />
              <span>Audio Viva-Voce</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Whisper STT evaluates conversational reasoning, troubleshooting rationale, and safety protocol articulation in local vernaculars.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase font-mono">
              <Video className="w-4 h-4" />
              <span>30 FPS Vision Audit</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              OpenCV and Gemini 1.5 Flash detect PPE violations (such as missing 1000V rated gloves) with millisecond-exact timestamps.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Anti-Tampering Barcode</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Physical barcode tracking guarantees the physical component belongs to the registered trainee, eliminating impersonation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase font-mono">
              <Award className="w-4 h-4" />
              <span>Faculty Uncertainty Queue</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Any AI confidence under 85% routes immediately to certified ITI master trainers for human-in-the-loop review.
            </p>
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
