import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  Eye, 
  Smartphone, 
  FileText, 
  Users, 
  Volume2, 
  Clock, 
  Download, 
  Filter,
  Check,
  X,
  MessageSquare,
  ArrowUpRight
} from "lucide-react";
import { ProctoringViolationEvent, ProctoringSession } from "../../types";

interface ProctoringReviewerDashboardProps {
  sessionId?: string;
  onClose?: () => void;
}

export const ProctoringReviewerDashboard: React.FC<ProctoringReviewerDashboardProps> = ({
  sessionId = "sess_nsqf_ele_2026_01",
  onClose
}) => {
  const [session, setSession] = useState<ProctoringSession | null>(null);
  const [events, setEvents] = useState<ProctoringViolationEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ProctoringViolationEvent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(900); // 15 mins exam
  const [filterSeverity, setFilterSeverity] = useState<"ALL" | "HIGH" | "MEDIUM">("ALL");
  const [filterSource, setFilterSource] = useState<"ALL" | "local" | "gemini">("ALL");
  const [reviewerNote, setReviewerNote] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fetch session & violation timeline events from backend
  const fetchSessionData = async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setSession(data);
        if (data.events) {
          setEvents(data.events);
          if (data.events.length > 0 && !selectedEvent) {
            setSelectedEvent(data.events[0]);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to fetch proctoring session data:", e);
    }
  };

  useEffect(() => {
    fetchSessionData();
    const interval = setInterval(fetchSessionData, 5000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handleSeek = (timeSec: number) => {
    setCurrentTimeSec(timeSec);
    if (videoRef.current) {
      videoRef.current.currentTime = timeSec % (videoRef.current.duration || 60);
    }
  };

  const handleDecision = async (
    eventId: string, 
    decision: "ACCEPTED" | "DISMISSED" | "ESCALATED"
  ) => {
    try {
      await fetch(`/api/sessions/${sessionId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          decision,
          notes: reviewerNote || undefined
        })
      });

      // Update local state
      setEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, reviewer_status: decision } : ev));
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent(prev => prev ? { ...prev, reviewer_status: decision } : null);
      }
      setReviewerNote("");
    } catch (e) {
      console.error("Failed to update reviewer decision:", e);
    }
  };

  const handleExportDossier = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }, 1200);
  };

  const filteredEvents = events.filter(ev => {
    if (filterSeverity !== "ALL" && ev.severity !== filterSeverity) return false;
    if (filterSource !== "ALL" && ev.source !== filterSource) return false;
    return true;
  });

  const getEventBadgeColor = (type: string, severity: string) => {
    if (severity === "HIGH" || type.includes("PHONE") || type.includes("FACE_ABSENT") || type.includes("MULTIPLE")) {
      return "bg-rose-500/20 text-rose-300 border-rose-500/40";
    }
    if (severity === "MEDIUM" || type.includes("LOOK_AWAY") || type.includes("GAZE")) {
      return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    }
    return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
  };

  const getEventIcon = (type: string) => {
    if (type.includes("PHONE")) return <Smartphone className="w-3.5 h-3.5 text-rose-400" />;
    if (type.includes("NOTES")) return <FileText className="w-3.5 h-3.5 text-amber-400" />;
    if (type.includes("MULTIPLE") || type.includes("FACE")) return <Users className="w-3.5 h-3.5 text-rose-400" />;
    if (type.includes("GAZE") || type.includes("LOOK_AWAY")) return <Eye className="w-3.5 h-3.5 text-amber-400" />;
    if (type.includes("AUDIO")) return <Volume2 className="w-3.5 h-3.5 text-indigo-400" />;
    return <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Bar / Stats Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10.5px] font-mono font-bold">
              HUMAN-IN-THE-LOOP PROCTORING AUDIT
            </span>
            <span className="text-xs font-mono text-slate-400">
              Session: {session?.id || sessionId}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Candidate Assessment Proctoring Dossier</span>
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </h2>
          <p className="text-xs text-slate-400 font-light">
            Candidate: <strong className="text-white">{session?.candidate_name || "Rajesh Kumar"}</strong> • Exam: <span className="text-cyan-300">{session?.exam_title || "NSQF Level 4 Electrical Competency"}</span>
          </p>
        </div>

        {/* Action Controls & Export */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Trust Score</div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {session?.trust_score ?? 92}%
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              (session?.trust_score ?? 92) > 85 ? "bg-emerald-400" : "bg-amber-400"
            } animate-pulse`} />
          </div>

          <button
            type="button"
            onClick={handleExportDossier}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer shadow-lg"
          >
            {isExporting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Dossier...</span>
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Audit Dossier Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Export Audit PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Video Player + Seekbar & Violation Dossier Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Video Playback & Scrubber Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <h3 className="text-sm font-bold text-white">Continuous Session Recording</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {Math.floor(currentTimeSec / 60).toString().padStart(2, "0")}:
                {(currentTimeSec % 60).toString().padStart(2, "0")} / 15:00
              </span>
            </div>

            {/* Video Viewport */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden group">
              <video
                ref={videoRef}
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                playsInline
                loop
                className="w-full h-full object-cover"
                onTimeUpdate={(e) => setCurrentTimeSec(Math.floor((e.target as HTMLVideoElement).currentTime))}
              />

              {/* HUD Overlay for active timestamp */}
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>REC TIMESTAMP: 00:{currentTimeSec.toString().padStart(2, "0")}</span>
              </div>

              {selectedEvent && (
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    {getEventIcon(selectedEvent.type)}
                    <div>
                      <span className="font-bold text-white block">{selectedEvent.title}</span>
                      <span className="text-[11px] text-slate-400">{selectedEvent.description}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${getEventBadgeColor(selectedEvent.type, selectedEvent.severity)}`}>
                    {selectedEvent.source}
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Timeline Seekbar with Colored Violation Event Markers */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>00:00 (Start)</span>
                <span className="text-cyan-400 font-bold">Interactive Timeline Markers ({events.length} flags)</span>
                <span>15:00 (Submission)</span>
              </div>

              {/* Scrubber track */}
              <div className="relative w-full h-6 bg-slate-950 rounded-xl border border-slate-800 flex items-center px-2 cursor-pointer">
                {/* Progress bar */}
                <div 
                  className="absolute left-2 top-2 bottom-2 bg-cyan-500/20 rounded-md pointer-events-none"
                  style={{ width: `${(currentTimeSec / durationSec) * 100}%` }}
                />

                {/* Clickable Violation Markers */}
                {events.map((ev, idx) => {
                  const markerPercent = Math.min(95, Math.max(5, (idx + 1) * 22));
                  const isSelected = selectedEvent?.id === ev.id;

                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => {
                        setSelectedEvent(ev);
                        handleSeek(markerPercent * 9);
                      }}
                      style={{ left: `${markerPercent}%` }}
                      className={`absolute -top-1.5 w-4 h-9 rounded-full transition-transform hover:scale-125 cursor-pointer z-10 ${
                        ev.severity === "HIGH" 
                          ? "bg-rose-500 shadow-lg shadow-rose-500/50" 
                          : "bg-amber-400 shadow-lg shadow-amber-400/50"
                      } ${isSelected ? "ring-4 ring-cyan-400 scale-125" : ""}`}
                      title={`${ev.title} at ${ev.timestamp_formatted}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (videoRef.current) {
                      if (isPlaying) {
                        videoRef.current.pause();
                      } else {
                        videoRef.current.play();
                      }
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleSeek(0)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Rewind to start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>High Severity ({events.filter(e => e.severity === "HIGH").length})</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Medium ({events.filter(e => e.severity === "MEDIUM").length})</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Violation Dossier & Human Reviewer Action Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            {/* Header & Filters */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Flagged Incident Log</h3>
                <span className="text-[10px] font-mono text-slate-400">
                  {filteredEvents.length} violation events recorded
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <select
                  aria-label="Filter severity"
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value as any)}
                  className="text-[11px] font-mono bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300"
                >
                  <option value="ALL">All Severities</option>
                  <option value="HIGH">High Risk</option>
                  <option value="MEDIUM">Medium</option>
                </select>

                <select
                  aria-label="Filter source"
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value as any)}
                  className="text-[11px] font-mono bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300"
                >
                  <option value="ALL">All Sources</option>
                  <option value="gemini">Gemini Vision</option>
                  <option value="local">Local Tracker</option>
                </select>
              </div>
            </div>

            {/* List of Flagged Events */}
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {filteredEvents.map((ev) => {
                const isSelected = selectedEvent?.id === ev.id;
                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-slate-800 border-cyan-500 shadow-md"
                        : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        {getEventIcon(ev.type)}
                        <span className="text-xs font-bold text-white truncate">{ev.title}</span>
                      </div>
                      <span className="text-[10.5px] font-mono text-cyan-400 font-semibold shrink-0">
                        {ev.timestamp_formatted}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {ev.description}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/60">
                      <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded font-bold uppercase ${getEventBadgeColor(ev.type, ev.severity)}`}>
                        {ev.source === "gemini" ? "Google AI Studio Review" : "On-Device Landmark"}
                      </span>

                      <span className={`text-[10px] font-mono font-bold ${
                        ev.reviewer_status === "ACCEPTED" 
                          ? "text-rose-400" 
                          : ev.reviewer_status === "DISMISSED" 
                          ? "text-emerald-400" 
                          : ev.reviewer_status === "ESCALATED" 
                          ? "text-amber-400" 
                          : "text-slate-400"
                      }`}>
                        Status: {ev.reviewer_status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Event Action Box (Human Reviewer Decisions) */}
            {selectedEvent && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Reviewer Adjudication</span>
                  </div>
                  <span className="text-[10.5px] font-mono text-slate-400">ID: {selectedEvent.id}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-mono text-slate-400">Reviewer Justification Note (Optional)</label>
                  <input
                    type="text"
                    value={reviewerNote}
                    onChange={(e) => setReviewerNote(e.target.value)}
                    placeholder="Enter factual audit comment..."
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleDecision(selectedEvent.id, "ACCEPTED")}
                    className="px-2.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Penalty</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDecision(selectedEvent.id, "DISMISSED")}
                    className="px-2.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Dismiss Flag</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDecision(selectedEvent.id, "ESCALATED")}
                    className="px-2.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Escalate</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
