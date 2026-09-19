import React, { useState, useEffect, useRef } from "react";
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
  Menu, 
  X, 
  ShieldCheck, 
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
 * - Collapsible Sidebar Taskbar (ChatGPT-style Panel Toggle)
 * - Auto-opens when at start/top of the page
 * - Auto-closes smoothly as soon as user scrolls
 * - Manual Open/Close toggle with shortcut (Ctrl+B)
 * - Desktop icon rail dock when collapsed with hover tooltips
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

  // Sidebar Open/Close State (visible at start of page & expands on hover)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const mainScrollRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Scroll detection: auto-open at start (top) and auto-close when user scrolls
  useEffect(() => {
    const handleScrollPosition = (scrollTop: number) => {
      const atTop = scrollTop <= 30;
      setIsScrolled(!atTop);

      if (!atTop) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    const handleMainScroll = () => {
      if (mainScrollRef.current) {
        handleScrollPosition(mainScrollRef.current.scrollTop);
      }
    };

    const handleWinScroll = () => {
      handleScrollPosition(window.scrollY || document.documentElement.scrollTop || 0);
    };

    const scrollEl = mainScrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", handleMainScroll, { passive: true });
    }
    window.addEventListener("scroll", handleWinScroll, { passive: true });

    return () => {
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", handleMainScroll);
      }
      window.removeEventListener("scroll", handleWinScroll);
    };
  }, []);

  // Hover handlers for smooth opening & closing
  const handleMouseEnterSidebar = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsSidebarOpen(true);
  };

  const handleMouseLeaveSidebar = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Smooth delay before closing to avoid accidental flickers
    hoverTimeoutRef.current = setTimeout(() => {
      // If user is scrolled, close on mouse leave
      setIsSidebarOpen(false);
    }, 150);
  };

  const allNavItems = [
    {
      id: "recruiter" as PostLoginView,
      label: "Industry Hiring Portal",
      shortLabel: "Hiring",
      icon: Building2,
      badge: "Verified Pool",
      roles: ["employee"],
    },
    {
      id: "dashboard" as PostLoginView,
      label: "Student Dashboard",
      shortLabel: "Dashboard",
      icon: BookOpen,
      badge: null,
      roles: ["student"],
    },
    {
      id: "side-by-side" as PostLoginView,
      label: "Side-by-Side Assessment",
      shortLabel: "Dual-Modal",
      icon: Video,
      badge: "Dual-Pane",
      roles: ["student"],
    },
    {
      id: "scorecard" as PostLoginView,
      label: "Master Scorecard",
      shortLabel: "Scorecard",
      icon: FileText,
      badge: null,
      roles: ["student", "faculty"],
    },
    {
      id: "heatmap" as PostLoginView,
      label: "Cohort Heatmap",
      shortLabel: "Heatmap",
      icon: BarChart3,
      badge: null,
      roles: ["student", "faculty"],
    },
    {
      id: "queue" as PostLoginView,
      label: "Faculty Review Queue",
      shortLabel: "Queue",
      icon: HelpCircle,
      badge: pendingQueueCount > 0 ? `${pendingQueueCount} Pending` : null,
      roles: ["faculty"],
    },
  ];

  // Strictly filter navigation based on authenticated role
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
    <div className="h-screen w-screen bg-black text-slate-100 flex flex-col md:flex-row font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-hidden relative">
      
      {/* =========================================================================
       * COLLAPSIBLE SIDE TASKBAR (Opens on Hover, Closes on Mouse Leave)
       * ========================================================================= */}
      <aside 
        id="side-taskbar"
        onMouseEnter={handleMouseEnterSidebar}
        onMouseLeave={handleMouseLeaveSidebar}
        className={`bg-slate-950/95 border-b md:border-b-0 md:border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between shrink-0 z-40 transition-all duration-300 ease-in-out relative ${
          isSidebarOpen 
            ? "w-full md:w-64 lg:w-72 shadow-2xl md:shadow-cyan-950/20" 
            : "w-full md:w-16 h-auto md:h-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top-Left Application Logo */}
          <div className="p-3 sm:p-4 border-b border-slate-800/80 flex items-center justify-between min-h-[64px]">
            {isSidebarOpen ? (
              <>
                <button
                  type="button"
                  id="brand-logo-btn"
                  onClick={handleLogoClick}
                  className="flex items-center gap-2.5 text-left group cursor-pointer overflow-hidden transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-cyan-500/10 shrink-0">
                    <BridgeLogo variant="icon" size="sm" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-white text-sm tracking-wider font-sans">
                        BRIDGE
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                        {isRecruiter ? "INDUSTRY" : "NSQF"}
                      </span>
                    </div>
                    <div className="text-[8.5px] font-mono tracking-tight text-slate-400 flex items-center gap-1">
                      <span className="text-cyan-400">Traditional</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-amber-400">Market</span>
                    </div>
                  </div>
                </button>

                {/* Mobile Menu Toggle (Only on mobile) */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 cursor-pointer"
                >
                  {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </>
            ) : (
              /* Collapsed Mini Header: Displays the Bridge Logo (Photo 3) */
              <div className="w-full flex md:flex-col items-center justify-between md:justify-center gap-2">
                <button
                  type="button"
                  id="brand-logo-collapsed-btn"
                  onClick={handleLogoClick}
                  title="Bridge Dashboard"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center hover:scale-105 hover:border-cyan-500/40 transition-all shadow-lg shadow-cyan-500/10 cursor-pointer group"
                >
                  <BridgeLogo variant="icon" size="sm" />
                </button>

                {/* Mobile Menu Toggle when collapsed on mobile */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 cursor-pointer"
                >
                  {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Expanded Sidebar Body */}
          {isSidebarOpen ? (
            <div className="flex-1 overflow-y-auto sidebar-scrollbar px-3 py-2 space-y-3">
              {/* User Profile Card */}
              {currentUser && (
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isRecruiter 
                        ? "bg-blue-500/15 border border-blue-500/30 text-blue-400" 
                        : "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400"
                    }`}>
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                      <div className="text-[9.5px] font-mono text-amber-400 uppercase tracking-wider truncate">
                        {isRecruiter 
                          ? "INDUSTRY RECRUITER" 
                          : `${currentUser.role} • ${(currentUser.institution || "ITI").split(" ")[0]}`}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sidebar Navigation Index */}
              <nav className="space-y-1">
                <div className="px-2.5 py-1 text-[9.5px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>{isRecruiter ? "Industrial Recruitment" : "Platform Indexing"}</span>
                  <span className="text-[8.5px] text-slate-600 font-normal">Hover Expand</span>
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 to-transparent text-blue-300 border-l-2 border-blue-400 font-bold shadow-sm"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full shrink-0 ${
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
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 transition-colors cursor-pointer"
                >
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>About Bridge</span>
                </button>
              </nav>

              {/* Stacked 14-Day Learning Streak & Recruiter Telemetry */}
              {!isRecruiter && (
                <div className="pt-1 space-y-2">
                  <GamificationStreak
                    currentStreakDays={14}
                    longestStreakDays={22}
                    variant="compact-sidebar"
                  />

                  {/* Recruiter Telemetry Feed Card */}
                  <div 
                    id="recruiter-telemetry-feed"
                    className="p-2.5 rounded-xl bg-gradient-to-b from-slate-900/95 to-[#080d1a] border border-cyan-500/30 shadow-lg relative overflow-hidden text-xs font-mono"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[9.5px] uppercase tracking-wider">
                        <Briefcase className="w-3 h-3 text-cyan-400" />
                        <span>Recruiter Telemetry</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-[8.5px] text-emerald-400 font-semibold">LIVE</span>
                      </div>
                    </div>

                    <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[10.5px] text-slate-200 leading-snug">
                      <div className="font-semibold text-white flex items-center gap-1">
                        <span className="text-cyan-300">L&amp;T Talent Desk</span>
                        <span className="text-[8.5px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300">Tier-1</span>
                      </div>
                      <div className="text-[9.5px] text-slate-400 mt-0.5">
                        verified NSQF L4/L5 credentials.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Collapsed Compact Icon Rail (Desktop) */
            <div className="hidden md:flex flex-1 flex-col items-center py-2 space-y-2 overflow-y-auto sidebar-scrollbar">
              {displayedNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <div key={item.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => onSelectView(item.id)}
                      onMouseEnter={() => setActiveTooltip(item.label)}
                      onMouseLeave={() => setActiveTooltip(null)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                        isActive
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-md shadow-blue-500/10"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.badge && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </button>

                    {/* Floating Tooltip */}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-white text-[11px] font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                      {item.label}
                      {item.badge && ` • ${item.badge}`}
                    </div>
                  </div>
                );
              })}

              <div className="w-6 h-px bg-slate-800 my-1" />

              {/* Collapsed About Bridge Button */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setShowAboutModal(true)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  <Info className="w-4 h-4" />
                </button>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-white text-[11px] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  About Bridge
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Footer Controls */}
          {isSidebarOpen ? (
            <div className="p-3 border-t border-slate-800/80 space-y-1.5 shrink-0 bg-slate-950">
              {/* Global UI Layout Preference Toggle: Flat vs 3D-Depth */}
              <button
                type="button"
                id="global-ui-perspective-toggle-btn"
                onClick={toggleUiLayoutPreference}
                title="Toggle between Flat and Spatial 3D-Depth layouts"
                className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-mono transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  {uiLayoutPreference === "3d-depth" ? (
                    <Box className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>UI Perspective</span>
                </div>
                <span
                  className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full transition-colors ${
                    uiLayoutPreference === "3d-depth"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {uiLayoutPreference === "3d-depth" ? "3D" : "Flat"}
                </span>
              </button>

              {/* Backend Persistent Storage Inspector Button */}
              <button
                type="button"
                onClick={() => setShowStorageModal(true)}
                title="Inspect backend persistent file storage"
                className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-mono transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Backend Store</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${backendStatus === "connected" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-amber-400"}`} />
                  <span className="text-[9.5px] text-slate-400 capitalize">{backendStatus}</span>
                </div>
              </button>

              {/* Quick Demo Golden Run Button (Only for student/faculty) */}
              {!isRecruiter ? (
                <button
                  type="button"
                  onClick={loadGoldenDemoData}
                  title="Instant Golden Run Fallback (Ctrl+Shift+D)"
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Demo: Ctrl+Shift+D</span>
                </button>
              ) : (
                <div className="py-1 px-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-mono text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  <span>Recruiter Portal Active</span>
                </div>
              )}

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/60 text-slate-300 hover:text-rose-300 text-xs font-mono transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Collapsed Compact Footer on Desktop */
            <div className="hidden md:flex flex-col items-center py-2 space-y-2 border-t border-slate-800/80 bg-slate-950 shrink-0">
              {/* Perspective Mini Toggle */}
              <button
                type="button"
                onClick={toggleUiLayoutPreference}
                title={`UI Perspective: ${uiLayoutPreference}`}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-slate-900 transition-colors cursor-pointer"
              >
                {uiLayoutPreference === "3d-depth" ? <Box className="w-4 h-4 text-cyan-400" /> : <Square className="w-4 h-4" />}
              </button>

              {/* Backend Storage Mini Button */}
              <button
                type="button"
                onClick={() => setShowStorageModal(true)}
                title="Inspect backend storage"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-slate-900 transition-colors cursor-pointer relative"
              >
                <Database className="w-4 h-4" />
                <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${backendStatus === "connected" ? "bg-emerald-400" : "bg-amber-400"}`} />
              </button>

              {/* Sign Out Mini Button */}
              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* =========================================================================
       * MAIN CONTENT AREA
       * ========================================================================= */}
      <main 
        ref={mainScrollRef}
        id="main-content-scroll"
        className={`flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden relative transition-all ${
          uiLayoutPreference === "3d-depth" ? "perspective-container-3d" : "perspective-container-flat"
        }`}
      >
        {/* Floating Top Quick Bar */}
        <div className="sticky top-0 z-30 w-full px-4 sm:px-6 py-2.5 flex items-center justify-end pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Quick Demo Hotkey button in top bar if sidebar collapsed */}
            {!isSidebarOpen && !isRecruiter && (
              <button
                type="button"
                onClick={loadGoldenDemoData}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono transition-colors shadow-lg cursor-pointer"
                title="Instant Golden Run Fallback"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Demo Run</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary View Children Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto -mt-10 pt-10">
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
