import React, { useRef, useState, useEffect, useCallback } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Crosshair,
  Volume2,
  Maximize2
} from "lucide-react";
import { MicroEvidenceItem } from "../types";

interface MillisecondVideoPlayerProps {
  activeTimestampMs: number | null;
  onTimeUpdate?: (ms: number) => void;
  timelineMarkers: MicroEvidenceItem[];
  onMarkerClick: (marker: MicroEvidenceItem) => void;
  highlightBoundingBox?: [number, number, number, number] | null;
  activeLabel?: string;
  sourceVideoUrl?: string;
}

export const MillisecondVideoPlayer: React.FC<MillisecondVideoPlayerProps> = ({
  activeTimestampMs,
  onTimeUpdate,
  timelineMarkers,
  onMarkerClick,
  highlightBoundingBox,
  activeLabel,
  sourceVideoUrl
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMs, setCurrentMs] = useState(activeTimestampMs || 14200);
  const [durationMs, setDurationMs] = useState(36000); // 36 seconds
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Sync external seek request (e.g. from clicking violation card)
  useEffect(() => {
    if (activeTimestampMs !== null && activeTimestampMs !== undefined) {
      seekToMs(activeTimestampMs, true);
    }
  }, [activeTimestampMs]);

  // Handle native video timeupdate
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const ms = Math.round(videoRef.current.currentTime * 1000);
      setCurrentMs(ms);
      if (onTimeUpdate) onTimeUpdate(ms);
      drawBoundingBox(ms);
    }
  };

  // Seek video with millisecond precision
  const seekToMs = useCallback((ms: number, pauseOnArrival = false) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, ms) / 1000.0;
      if (pauseOnArrival) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
    setCurrentMs(ms);
    if (onTimeUpdate) onTimeUpdate(ms);
    drawBoundingBox(ms);
  }, [onTimeUpdate]);

  // Frame step hook: step by ±50ms
  const stepFrame = (deltaMs: number) => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    const target = Math.min(Math.max(0, currentMs + deltaMs), durationMs);
    seekToMs(target, true);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        // Fallback simulated playback loop if external media is blocked
        setIsPlaying(true);
      });
    }
  };

  // Fallback simulated animation timer if native media is muted/synthetic
  useEffect(() => {
    let animId: number;
    if (isPlaying && (!videoRef.current || videoRef.current.paused)) {
      const start = performance.now();
      const initialMs = currentMs;
      const tick = (now: number) => {
        const elapsed = (now - start) * playbackRate;
        const nextMs = Math.min(initialMs + Math.round(elapsed), durationMs);
        setCurrentMs(nextMs);
        if (onTimeUpdate) onTimeUpdate(nextMs);
        drawBoundingBox(nextMs);
        if (nextMs < durationMs) {
          animId = requestAnimationFrame(tick);
        } else {
          setIsPlaying(false);
        }
      };
      animId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentMs, durationMs, playbackRate, onTimeUpdate]);

  // Draw overlay bounding box on canvas for violation (e.g. 14200ms glove violation)
  const drawBoundingBox = useCallback((timeMs: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find if current time falls within active violation or checkpoint window (±1500ms)
    const activeItem = timelineMarkers.find(
      (m) => Math.abs(m.timestamp_ms - timeMs) < 1800
    );

    if (activeItem) {
      const box = activeItem.bounding_box_norm || [0.38, 0.48, 0.72, 0.78];
      const ymin = box[0] * canvas.height;
      const xmin = box[1] * canvas.width;
      const ymax = box[2] * canvas.height;
      const xmax = box[3] * canvas.width;
      const width = xmax - xmin;
      const height = ymax - ymin;

      const isViolation = activeItem.status === "FAIL";
      const isUncertain = activeItem.status === "UNCERTAIN_EVIDENCE";

      // Color scheme
      ctx.strokeStyle = isViolation ? "#f43f5e" : isUncertain ? "#f59e0b" : "#10b981";
      ctx.lineWidth = 3;
      ctx.strokeRect(xmin, ymin, width, height);

      // Corner target brackets
      const bracketLen = 14;
      ctx.lineWidth = 4;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(xmin, ymin + bracketLen);
      ctx.lineTo(xmin, ymin);
      ctx.lineTo(xmin + bracketLen, ymin);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(xmax - bracketLen, ymin);
      ctx.lineTo(xmax, ymin);
      ctx.lineTo(xmax, ymin + bracketLen);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(xmin, ymax - bracketLen);
      ctx.lineTo(xmin, ymax);
      ctx.lineTo(xmin + bracketLen, ymax);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(xmax - bracketLen, ymax);
      ctx.lineTo(xmax, ymax);
      ctx.lineTo(xmax, ymax - bracketLen);
      ctx.stroke();

      // Label background & text
      const tagText = isViolation 
        ? `CRITICAL VIOLATION: ${activeItem.label}` 
        : isUncertain
        ? `STATUS: UNCERTAIN_EVIDENCE (${activeItem.label})`
        : `VERIFIED: ${activeItem.label}`;

      ctx.font = "bold 11px monospace";
      const textWidth = ctx.measureText(tagText).width;
      ctx.fillStyle = isViolation ? "rgba(225, 29, 72, 0.9)" : isUncertain ? "rgba(217, 119, 6, 0.9)" : "rgba(5, 150, 105, 0.9)";
      ctx.fillRect(xmin, Math.max(16, ymin - 22), textWidth + 16, 20);

      ctx.fillStyle = "#ffffff";
      ctx.fillText(tagText, xmin + 8, Math.max(30, ymin - 8));
    }
  }, [timelineMarkers]);

  useEffect(() => {
    drawBoundingBox(currentMs);
  }, [currentMs, drawBoundingBox]);

  const formatTimecode = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const millis = ms % 1000;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${millis.toString().padStart(3, "0")}`;
  };

  return (
    <div id="millisecond-video-player" className="flex flex-col w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
      {/* Video Display Viewport */}
      <div 
        ref={containerRef} 
        className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden select-none"
      >
        {/* Synthetic Video / Video Element */}
        <video
          ref={videoRef}
          src={sourceVideoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDurationMs(Math.round(videoRef.current.duration * 1000) || 36000);
              setIsVideoLoaded(true);
            }
          }}
          className="w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Dynamic Canvas Simulation (Active when no external video or for simulated test bench) */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 via-transparent to-black/60">
          {/* Top Video HUD Information */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-slate-700 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>OPENCV 1.5 FPS RECORDER • 640×360</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-slate-700 text-amber-300 font-bold tracking-wider">
              {formatTimecode(currentMs)}
            </div>
          </div>

          {/* Workbench simulation backdrop graphics if media stream is simulated */}
          <div className="my-auto flex flex-col items-center justify-center opacity-85">
            <div className="relative w-64 h-36 border border-slate-700/80 rounded-lg bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center">
              <div className="w-12 h-16 border-2 border-amber-500/70 rounded bg-slate-800/80 mb-2 flex flex-col justify-between p-1">
                <div className="w-full h-2 bg-red-500/60 rounded-xs" />
                <div className="w-full h-5 border border-slate-600 rounded-xs bg-slate-900 text-[8px] font-mono text-center flex items-center justify-center text-slate-300">
                  MCB 32A
                </div>
                <div className="w-full h-2 bg-blue-500/60 rounded-xs" />
              </div>
              <span className="text-[11px] font-mono text-slate-300">
                TASK: MCB WIRING & TERMINATION
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                Camera: Tripod Bench Angle 45°
              </span>
            </div>
          </div>

          {/* Bottom active violation toast in video */}
          {activeLabel && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-slate-700 text-xs text-slate-200">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate">{activeLabel}</span>
            </div>
          )}
        </div>

        {/* Interactive Bounding Box Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>

      {/* Scrubber & Timeline Bar */}
      <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
        {/* Timeline Slider with violation pins */}
        <div className="relative mb-3 pt-2">
          {/* Marker pins */}
          <div className="absolute top-0 left-0 right-0 h-3 pointer-events-none">
            {timelineMarkers.map((marker, idx) => {
              const leftPercent = Math.min(100, Math.max(0, (marker.timestamp_ms / durationMs) * 100));
              const isViolation = marker.status === "FAIL";
              const isUncertain = marker.status === "UNCERTAIN_EVIDENCE";
              const isActive = activeTimestampMs === marker.timestamp_ms;

              return (
                <button
                  key={idx}
                  type="button"
                  title={`${marker.label} (${marker.timestamp_ms}ms)`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkerClick(marker);
                  }}
                  style={{ left: `${leftPercent}%` }}
                  className={`pointer-events-auto absolute -top-1 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 transition-transform hover:scale-150 cursor-pointer ${
                    isActive ? "scale-125 ring-2 ring-white" : ""
                  } ${
                    isViolation
                      ? "bg-rose-600 border-white shadow-rose-500/50 shadow-md"
                      : isUncertain
                      ? "bg-amber-500 border-white shadow-amber-500/50 shadow-md"
                      : "bg-emerald-500 border-white"
                  }`}
                />
              );
            })}
          </div>

          {/* Range Slider Track */}
          <input
            type="range"
            min={0}
            max={durationMs}
            step={50} // ±50ms precision as specified in PRD Section 1.4
            value={currentMs}
            onChange={(e) => seekToMs(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
          />
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Playback & Frame Stepping */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              id="player-play-btn"
              onClick={togglePlay}
              className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {/* Frame step backward (50ms) */}
            <button
              type="button"
              id="player-step-back-btn"
              onClick={() => stepFrame(-50)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition-colors flex items-center gap-1"
              title="Step Backward -50ms"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>-50ms</span>
            </button>

            {/* Frame step forward (+50ms) */}
            <button
              type="button"
              id="player-step-fwd-btn"
              onClick={() => stepFrame(50)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition-colors flex items-center gap-1"
              title="Step Forward +50ms"
            >
              <span>+50ms</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              id="player-reset-btn"
              onClick={() => seekToMs(0)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Rewind to start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center: Precision Timecode & Scrub Status */}
          <div className="font-mono text-slate-300 flex items-center gap-2">
            <span className="text-amber-400 font-bold">{formatTimecode(currentMs)}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">{formatTimecode(durationMs)}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ±50ms
            </span>
          </div>

          {/* Right: Playback Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 font-mono">
            {[0.25, 0.5, 1.0, 1.5].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => {
                  setPlaybackRate(rate);
                  if (videoRef.current) videoRef.current.playbackRate = rate;
                }}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  playbackRate === rate
                    ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
