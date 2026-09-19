import React, { useState } from "react";
import { useAssessment } from "../store/assessmentContext";
import { BridgeLogo } from "./brand/BridgeLogo";
import { BackendDataModal } from "./storage/BackendDataModal";
import { 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  Layers, 
  Sparkles, 
  LogOut, 
  BarChart3, 
  HelpCircle, 
  BookOpen, 
  Video, 
  FileText,
  UserCheck,
  Database
} from "lucide-react";

interface AppHeaderProps {
  currentView: "home" | "studio" | "scorecard" | "heatmap" | "queue" | "recruiter";
  setCurrentView: (view: "home" | "studio" | "scorecard" | "heatmap" | "queue" | "recruiter") => void;
  onOpenLogin: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentView, setCurrentView, onOpenLogin }) => {
  const { currentUser, switchRole, logout, loadGoldenDemoData, reviewQueue, backendStatus } = useAssessment();
  const [showStorageModal, setShowStorageModal] = useState(false);

  const pendingQueueCount = reviewQueue.filter((q) => q.status === "PENDING_FACULTY_DECISION").length;

  return (
    <header className="sticky top-0 z-40 w-full bg-black/90 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Accreditation */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView("home")}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <BridgeLogo variant="full" size="sm" showTagline={false} />
            <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
              NSQF L4/L5
            </span>
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setCurrentView("home")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              currentView === "home" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Learning Hub</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView("studio")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              currentView === "studio" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span>Dual-Modal Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView("scorecard")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              currentView === "scorecard" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Master Scorecard</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView("heatmap")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              currentView === "heatmap" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
            <span>Cohort Heatmap</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView("queue")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 relative ${
              currentView === "queue" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Faculty Queue</span>
            {pendingQueueCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-purple-500 text-white text-[9px] font-mono flex items-center justify-center font-bold">
                {pendingQueueCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentView("recruiter")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              currentView === "recruiter" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hiring Pool</span>
          </button>
        </nav>

        {/* Right: Fast Demo Trigger & Role Selector */}
        <div className="flex items-center gap-2.5">
          {/* Backend Persistent Storage Trigger */}
          <button
            type="button"
            onClick={() => setShowStorageModal(true)}
            title="Inspect backend persistent file storage"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Storage:</span>
            <span className={`w-2 h-2 rounded-full ${backendStatus === "connected" ? "bg-emerald-400" : "bg-amber-400"}`} />
          </button>

          {/* Ctrl+Shift+D Demo Fallback Button (PRD Section 4.2) */}
          <button
            type="button"
            id="demo-hotkey-btn"
            onClick={loadGoldenDemoData}
            title="Instant Golden Run Fallback (Hotkey: Ctrl+Shift+D)"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Demo: Ctrl+Shift+D</span>
          </button>

          {/* User role pill / switcher */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-white block leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-mono text-amber-400 uppercase">
                  {currentUser.role}
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Sign Out / Back to Home"
                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 text-slate-300 transition-colors border border-slate-700/60"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around bg-slate-950 px-2 py-2 border-t border-slate-800 text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setCurrentView("home")}
          className={`px-2.5 py-1 rounded-lg ${currentView === "home" ? "text-amber-400 font-bold" : "text-slate-400"}`}
        >
          Learning
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("studio")}
          className={`px-2.5 py-1 rounded-lg ${currentView === "studio" ? "text-amber-400 font-bold" : "text-slate-400"}`}
        >
          Studio
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("scorecard")}
          className={`px-2.5 py-1 rounded-lg ${currentView === "scorecard" ? "text-amber-400 font-bold" : "text-slate-400"}`}
        >
          Scorecard
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("heatmap")}
          className={`px-2.5 py-1 rounded-lg ${currentView === "heatmap" ? "text-blue-400 font-bold" : "text-slate-400"}`}
        >
          Heatmap
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("queue")}
          className={`px-2.5 py-1 rounded-lg ${currentView === "queue" ? "text-purple-400 font-bold" : "text-slate-400"}`}
        >
          Queue
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("recruiter")}
          className={`px-2.5 py-1 rounded-lg ${currentView === "recruiter" ? "text-emerald-400 font-bold" : "text-slate-400"}`}
        >
          Recruiter
        </button>
      </div>

      {/* Backend Stored Data Inspector Modal */}
      <BackendDataModal isOpen={showStorageModal} onClose={() => setShowStorageModal(false)} />
    </header>
  );
};
