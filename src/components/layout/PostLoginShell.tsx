import React, { useState } from "react";
import { 
  BookOpen, 
  Video, 
  FileText, 
  BarChart3, 
  HelpCircle, 
  Building2, 
  Info, 
  LogOut, 
  Sparkles, 
  Layers, 
  Menu, 
  X, 
  GraduationCap, 
  ShieldCheck, 
  ChevronRight, 
  Briefcase,
  Database,
  Box,
  Square
} from "lucide-react";
import { useAssessment } from "../../store/assessmentContext";
import { useScorecard } from "../../store/ScorecardContext";
import { AboutModal } from "../about/AboutModal";
import { BridgeLogo } from "../brand/BridgeLogo";
import { BackendDataModal } from "../storage/BackendDataModal";
import { GamificationStreak } from "../dashboard/GamificationStreak";

export type PostLoginView = 
  | "dashboard" 
  | "side-by-side" 
  | "studio" 
  | "scorecard" 
  | "heatmap" 
  | "queue" 
  | "recruiter";

interface PostLoginShellProps {
  currentView: PostLoginView;
  onSelectView: (view: PostLoginView) => void;
  children: React.ReactNode;
}

/**
 * =========================================================================
 * FEATURE C: Global Application Shell (Post-Login)
 * - Top-Left Header: Contains the application Logo and Name. Clicking it
 *   redirects to the respective post-login dashboard.
 * - Sidebar Navigation: Strictly role-tailored.
 *   - Recruiter (Employee): ONLY has access to the Industry Hiring Portal.
 *     Student Dashboard and Side-by-Side Assessment are completely excluded.
 *   - Student: Student Dashboard, Side-by-Side Assessment, Master Scorecard, Cohort Heatmap.
 *   - Faculty: Faculty Review Queue, Master Scorecard, Cohort Heatmap.
 * =========================================================================
 */
export const PostLoginShell: React.FC<PostLoginShellProps> = ({
  currentView,
  onSelectView,
  children,
}) => {
  const { currentUser, logout, loadGoldenDemoData, reviewQueue, backendStatus } = useAssessment();
  const { uiLayoutPreference, toggleUiLayoutPreference } = useScorecard();
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pendingQueueCount = reviewQueue.filter((q) => q.status === "PENDING_FACULTY_DECISION").length;

  const handleLogoClick = () => {
    if (currentUser?.role === "employee") {
      onSelectView("recruiter");
    } else if (currentUser?.role === "faculty") {
      onSelectView("queue");
    } else {
      onSelectView("dashboard");
    }
  };

  const allNavItems = [
    {
      id: "recruiter" as PostLoginView,
      label: "Industry Hiring Portal",
      icon: Building2,
      badge: "Verified Pool",
      roles: ["employee"],
    },
    {
      id: "dashboard" as PostLoginView,
      label: "Student Dashboard",
      icon: BookOpen,
      badge: null,
      roles: ["student"],
    },
    {
      id: "side-by-side" as PostLoginView,
      label: "Side-by-Side Assessment",
      icon: Video,
      badge: "Dual-Pane",
      roles: ["student"],
    },
    {
      id: "scorecard" as PostLoginView,
      label: "Master Scorecard",
      icon: FileText,
      badge: null,
      roles: ["student", "faculty"],
    },
    {
      id: "heatmap" as PostLoginView,
      label: "Cohort Heatmap",
      icon: BarChart3,
      badge: null,
      roles: ["student", "faculty"],
    },
    {
      id: "queue" as PostLoginView,
      label: "Faculty Review Queue",
      icon: HelpCircle,
      badge: pendingQueueCount > 0 ? `${pendingQueueCount} Pending` : null,
      roles: ["faculty"],
    },
  ];

  // Strictly filter navigation based on authenticated role
  // Recruiter ONLY sees the Industry Hiring Portal
  const displayedNavItems = allNavItems.filter((item) => {
    if (currentUser?.role === "employee") {
      return item.id === "recruiter";
    }
    if (currentUser?.role === "faculty") {
      return ["queue", "scorecard", "heatmap"].includes(item.id);
    }
    // Student default
    return ["dashboard", "side-by-side", "scorecard", "heatmap"].includes(item.id);
  });

  const isRecruiter = currentUser?.role === "employee";

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col md:flex-row font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* =========================================================================
       * LEFT SIDEBAR: TOP-LEFT LOGO + INDEXING NAVIGATION
       * ========================================================================= */}
      <aside className="w-full md:w-64 lg:w-72 bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between shrink-0 z-30">
        <div>
          {/* Top-Left Application Logo & Name (Redirects to Role Dashboard) */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              id="brand-logo-btn"
              onClick={handleLogoClick}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-cyan-500/10">
                <BridgeLogo variant="icon" size="sm" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base tracking-wider font-sans">
                    BRIDGE
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                    {isRecruiter ? "INDUSTRY" : "NSQF L4/L5"}
                  </span>
                </div>
                <div className="text-[9px] font-mono tracking-tight -mt-0.5 flex items-center gap-1">
                  <span className="text-cyan-400">Traditional</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-amber-400">Market</span>
                </div>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* User Profile Card */}
          {currentUser && (
            <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  isRecruiter 
                    ? "bg-blue-500/15 border border-blue-500/30 text-blue-400" 
                    : "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400"
                }`}>
                  {currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider truncate">
                    {isRecruiter 
                      ? "INDUSTRY RECRUITER • L&T / SCHNEIDER" 
                      : `${currentUser.role} • ${(currentUser.institution || "Government ITI").split(" ")[0]}`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Navigation Index */}
          <nav className={`px-3 py-2 space-y-1 ${isMobileMenuOpen ? "block" : "hidden md:block"}`}>
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              {isRecruiter ? "Industrial Recruitment" : "Platform Indexing"}
            </div>

            {displayedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-transparent text-blue-300 border-l-2 border-blue-400 font-bold shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Sidebar "About" Link */}
            <button
              type="button"
              onClick={() => {
                setShowAboutModal(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 transition-colors cursor-pointer"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>About Bridge</span>
            </button>

            {/* Stacked 14-Day Learning Streak Card to eliminate empty space */}
            {!isRecruiter && (
              <div className="pt-2 space-y-2.5">
                <GamificationStreak
                  currentStreakDays={14}
                  longestStreakDays={22}
                  variant="compact-sidebar"
                />

                {/* BOTTOM: Live Recruiter Telemetry Feed Card */}
                <div 
                  id="recruiter-telemetry-feed"
                  className="p-3 rounded-2xl bg-gradient-to-b from-slate-900/95 to-[#080d1a] border border-cyan-500/30 backdrop-blur-xl shadow-lg relative overflow-hidden text-xs font-mono"
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[10px] uppercase tracking-wider">
                      <Briefcase className="w-3 h-3 text-cyan-400" />
                      <span>Recruiter Telemetry</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[9px] text-emerald-400 font-semibold">LIVE</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-200 leading-snug">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span className="text-cyan-300">L&amp;T Talent Desk</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Tier-1</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      viewed your profile &amp; verified NSQF L4/L5 credentials.
                    </div>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-800/60">
                    <span>2 mins ago • Mumbai North Hub</span>
                    <span className="text-cyan-400 font-semibold">92% Match</span>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className={`p-4 border-t border-slate-800/80 space-y-2 ${isMobileMenuOpen ? "block" : "hidden md:block"}`}>
          {/* Global UI Layout Preference Toggle: Flat vs 3D-Depth */}
          <button
            type="button"
            id="global-ui-perspective-toggle-btn"
            onClick={toggleUiLayoutPreference}
            title="Toggle between Flat and Spatial 3D-Depth layouts"
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-mono transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-slate-300">
              {uiLayoutPreference === "3d-depth" ? (
                <Box className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>UI Perspective</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                  uiLayoutPreference === "3d-depth"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {uiLayoutPreference === "3d-depth" ? "3D Depth" : "Flat"}
              </span>
            </div>
          </button>

          {/* Backend Persistent Storage Inspector Button */}
          <button
            type="button"
            onClick={() => setShowStorageModal(true)}
            title="Inspect backend persistent file storage"
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-mono transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-slate-300">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Backend Store</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${backendStatus === "connected" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-amber-400"}`} />
              <span className="text-[10px] text-slate-400 capitalize">{backendStatus}</span>
            </div>
          </button>

          {/* Quick Demo Golden Run Button (Only for student/faculty) */}
          {!isRecruiter ? (
            <button
              type="button"
              onClick={loadGoldenDemoData}
              title="Instant Golden Run Fallback (Ctrl+Shift+D)"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo: Ctrl+Shift+D</span>
            </button>
          ) : (
            <div className="py-2 px-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-mono text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Recruiter Portal Active</span>
            </div>
          )}

          {/* Sign Out Button (Returns to pre-login landing page) */}
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/60 text-slate-300 hover:text-rose-300 text-xs font-mono transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out to Landing</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
       * MAIN CONTENT AREA
       * Spacious, clean layout with hardware-accelerated CSS perspective
       * ========================================================================= */}
      <main className={`flex-1 flex flex-col min-w-0 overflow-y-auto transition-all ${
        uiLayoutPreference === "3d-depth" ? "perspective-container-3d" : "perspective-container-flat"
      }`}>
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

      {/* About Modal */}
      <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />

      {/* Backend Stored Data Modal */}
      <BackendDataModal isOpen={showStorageModal} onClose={() => setShowStorageModal(false)} />
    </div>
  );
};

export default PostLoginShell;
