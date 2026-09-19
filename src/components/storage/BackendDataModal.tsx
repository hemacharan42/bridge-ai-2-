import React, { useState } from "react";
import { 
  Database, 
  X, 
  RefreshCw, 
  CheckCircle2, 
  RotateCcw, 
  Server, 
  HardDrive, 
  FileJson, 
  Activity, 
  Users, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Building2,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { useAssessment } from "../../store/assessmentContext";

interface BackendDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendDataModal: React.FC<BackendDataModalProps> = ({ isOpen, onClose }) => {
  const { 
    backendStatus, 
    lastSyncTimestamp, 
    backendStats, 
    refreshFromBackend, 
    resetBackendData,
    courses,
    reviewQueue,
    candidates,
    activeReport,
    currentUser
  } = useAssessment();

  const [activeTab, setActiveTab] = useState<"overview" | "raw" | "audit">("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshFromBackend();
    setIsRefreshing(false);
    setActionMessage("Backend data re-synced successfully");
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset all backend stored data to default factory seed state?")) {
      return;
    }
    setIsResetting(true);
    await resetBackendData();
    setIsResetting(false);
    setActionMessage("Backend store reset to default seed records");
    setTimeout(() => setActionMessage(null), 3500);
  };

  const statusColor = 
    backendStatus === "connected" 
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" 
      : backendStatus === "syncing"
      ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
      : "text-rose-400 bg-rose-500/10 border-rose-500/30";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Backend Stored Data
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase ${statusColor}`}>
                  {backendStatus === "connected" ? "Live Connected" : backendStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Persistent server-side file storage on Express engine (<code className="text-cyan-300 font-mono">./data/bridge_store.json</code>)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between pt-4 pb-3 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeTab === "overview" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Storage Metrics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("raw")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeTab === "raw" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Current State JSON
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Syncing..." : "Sync Now"}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isResetting}
              title="Reset backend data to factory demo defaults"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono transition-colors cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
              <span>Reset Store</span>
            </button>
          </div>
        </div>

        {/* Action toast */}
        {actionMessage && (
          <div className="my-2 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto pt-4 space-y-4 text-xs">
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Storage Health Card */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Engine</span>
                  <div className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <Server className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Node Express</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Storage Type</span>
                  <div className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                    <span>JSON File Store</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Disk File Size</span>
                  <div className="font-bold text-white font-mono mt-0.5">
                    {backendStats?.file_size_bytes 
                      ? `${(backendStats.file_size_bytes / 1024).toFixed(1)} KB` 
                      : "~18.5 KB"}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Last Synced</span>
                  <div className="font-bold text-emerald-400 font-mono mt-0.5 truncate">
                    {lastSyncTimestamp || "Just now"}
                  </div>
                </div>
              </div>

              {/* Records Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Backend Stored Collections
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Courses */}
                  <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">NSQF Courses</div>
                        <div className="text-[11px] text-slate-400">Curriculums & modules</div>
                      </div>
                    </div>
                    <span className="text-sm font-mono font-bold text-amber-400">
                      {courses.length}
                    </span>
                  </div>

                  {/* Scorecards */}
                  <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Master Scorecards</div>
                        <div className="text-[11px] text-slate-400">Audits & remediation plans</div>
                      </div>
                    </div>
                    <span className="text-sm font-mono font-bold text-blue-400">
                      {backendStats?.counts?.scorecards || 2}
                    </span>
                  </div>

                  {/* Faculty Queue */}
                  <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Faculty Review Queue</div>
                        <div className="text-[11px] text-slate-400">Occlusion & low-light flags</div>
                      </div>
                    </div>
                    <span className="text-sm font-mono font-bold text-purple-400">
                      {reviewQueue.length}
                    </span>
                  </div>

                  {/* Candidates */}
                  <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Verified Hiring Pool</div>
                        <div className="text-[11px] text-slate-400">Recruiter candidate records</div>
                      </div>
                    </div>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      {candidates.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Session Info */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Active Backend Session</span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Active User:</span>
                  <span className="font-bold text-white font-mono">{currentUser?.name || "Not signed in"} ({currentUser?.role || "guest"})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Active Scorecard:</span>
                  <span className="font-bold text-cyan-400 font-mono">{activeReport.report_id} ({activeReport.composite_score}%)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "raw" && (
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 block">
                Live State Dump (Synced from <code className="text-cyan-300">/api/data</code>):
              </span>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-[380px] overflow-auto leading-relaxed">
                {JSON.stringify({
                  status: backendStatus,
                  lastSynced: lastSyncTimestamp,
                  activeUser: currentUser,
                  coursesCount: courses.length,
                  activeScorecard: activeReport.report_id,
                  reviewQueueItems: reviewQueue.length,
                  candidatesCount: candidates.length,
                  courses: courses.map(c => ({ id: c.id, title: c.title, completedModules: c.completedModules }))
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Changes persist on disk across browser refreshes & server restarts</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
