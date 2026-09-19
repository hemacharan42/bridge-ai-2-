import React, { useState } from "react";
import { useAssessment } from "../../store/assessmentContext";
import { 
  Play, 
  BookOpen, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Award, 
  ShieldCheck, 
  ChevronRight, 
  AlertCircle,
  Zap,
  ArrowUpRight,
  Video,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { SkillMasteryModal, SkillMasteryItem } from "./SkillMasteryModal";
import { SkillMasteryBadgesList } from "./SkillMasteryBadgesList";
import { StudentProgressSummary } from "./StudentProgressSummary";
import { GamificationStreak } from "./GamificationStreak";
import { BadgesShowcase } from "./BadgesShowcase";
import { AdvancedMediaUpload } from "./AdvancedMediaUpload";
import { CourseDetailView } from "../course/CourseDetailView";
import { TestCaseVideoInterface } from "../course/TestCaseVideoInterface";
import { useScorecard } from "../../store/ScorecardContext";
import { IsometricMockupModal } from "./IsometricMockupModal";

interface StudentDashboardProps {
  onStartAssessment: () => void;
  onViewScorecard: () => void;
  onOpenSideBySide: () => void;
  onOpenNewCourse: () => void;
  initialSubView?: "OVERVIEW" | "COURSE_INTERFACE" | "TEST_CASE";
}

/**
 * =========================================================================
 * ENHANCED STUDENT DASHBOARD & ENROLLMENT SUITE
 * - Centralized Dashboard: Comprehensive progress summary with readiness KPI
 * - Gamification Engines: Learning Streak tracker + Badges Showcase grid
 * - Advanced Media Upload: Drag-and-drop upload zone, progress state, instant
 *   playback self-review container, timestamp tagging, AI pre-flight audit
 * =========================================================================
 */
export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onStartAssessment,
  onViewScorecard,
  onOpenSideBySide,
  onOpenNewCourse,
  initialSubView = "OVERVIEW",
}) => {
  const { currentUser, selectedCourse, courses, selectCourse, updateCourseCompletedModules } = useAssessment();
  const { uiLayoutPreference } = useScorecard();
  const [activeBadgeModal, setActiveBadgeModal] = useState<SkillMasteryItem | null>(null);
  const [showIsometricMockup, setShowIsometricMockup] = useState(false);
  const [dashboardView, setDashboardView] = useState<"OVERVIEW" | "COURSE_INTERFACE" | "TEST_CASE">(initialSubView);

  // If in Course Interface view (Join Course)
  if (dashboardView === "COURSE_INTERFACE") {
    return (
      <CourseDetailView
        course={selectedCourse}
        onBackToCourses={() => setDashboardView("OVERVIEW")}
        onLaunchTestCase={(courseId) => {
          selectCourse(courseId);
          setDashboardView("TEST_CASE");
        }}
      />
    );
  }

  // If in Test Case view (Video Input, Start Test, Self-Checking, Re-confirm, Score Analysis)
  if (dashboardView === "TEST_CASE") {
    return (
      <TestCaseVideoInterface
        course={selectedCourse}
        onBackToCourse={() => setDashboardView("COURSE_INTERFACE")}
        onBackToDashboard={() => setDashboardView("OVERVIEW")}
        onViewScorecard={onViewScorecard}
      />
    );
  }

  const completedModulesCount = selectedCourse.completedModules || 1;
  const totalModulesCount = selectedCourse.totalModules || 4;
  const progressPercent = Math.round((completedModulesCount / totalModulesCount) * 100);

  // Curriculum modules based on selected course
  const moduleList = [
    {
      id: "mod-1",
      title: "Safety Pre-Flight & Calibrated PPE Protocols",
      description: "Class 0 1000V rated glove visual inspection, dielectric test stamp verification.",
      completed: completedModulesCount >= 1,
      completionPercent: completedModulesCount >= 1 ? 100 : 70,
      taskCode: "NSQF-MOD-01",
      skillName: selectedCourse.skillsTaught?.[0] || "Zero-Potential Verification",
    },
    {
      id: "mod-2",
      title: selectedCourse.currentTaskTitle || "Busbar & Contactor Wiring Assessment",
      description: "Torque calibration, CAT-III multimeter testing, real-time verbal reasoning justification.",
      completed: completedModulesCount >= 2,
      completionPercent: completedModulesCount >= 2 ? 100 : (completedModulesCount === 1 ? 65 : 0),
      taskCode: selectedCourse.currentTaskId || "NSQF-MOD-02",
      skillName: selectedCourse.skillsTaught?.[1] || "1000V Dielectric Glove Usage",
    },
    {
      id: "mod-3",
      title: "Fault Simulation & Thermal Breaker Verification",
      description: "Short circuit detection, lockout-tagout (LOTO) procedure, load balancing check.",
      completed: completedModulesCount >= 3,
      completionPercent: completedModulesCount >= 3 ? 100 : 0,
      taskCode: "NSQF-MOD-03",
      skillName: selectedCourse.skillsTaught?.[2] || "Conductor Stripping Standards",
    },
    {
      id: "mod-4",
      title: "Master Industrial Certification & Recruiter Proof",
      description: "Dual-evidence comprehensive audit for direct enterprise hiring pool entry.",
      completed: completedModulesCount >= 4,
      completionPercent: completedModulesCount >= 4 ? 100 : 0,
      taskCode: "NSQF-MOD-04",
      skillName: selectedCourse.skillsTaught?.[3] || "Terminal Torque Pull Test",
    },
  ];

  // Active enrolled courses for the current trainee
  const enrolledCourseIds = currentUser?.enrolledCourses && currentUser.enrolledCourses.length > 0
    ? currentUser.enrolledCourses
    : ["course_electrician_nsqf4", "course_solar_pv"];

  const activeCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-12">
      {/* QUICK WORKFLOW SWITCH BAR */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Active Qualification:</span>
          <span className="text-xs font-bold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {selectedCourse.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* High-End 3D Isometric View Inspection Button */}
          <button
            type="button"
            id="view-3d-isometric-mockup-btn"
            onClick={() => setShowIsometricMockup(true)}
            title="Inspect high-end 3D isometric dark-mode web dashboard mockup"
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D Isometric Render</span>
          </button>

          <button
            type="button"
            onClick={() => setDashboardView("COURSE_INTERFACE")}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Join Course (Videos &amp; Details)</span>
          </button>

          <button
            type="button"
            onClick={() => setDashboardView("TEST_CASE")}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-cyan-500/20 cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 fill-current" />
            <span>Test Case Studio</span>
          </button>
        </div>
      </div>

      {/* ========================================================
       * 1. CENTRALIZED DASHBOARD: PROGRESS SUMMARY & JOB READINESS
       * ======================================================== */}
      <StudentProgressSummary
        user={currentUser}
        course={selectedCourse}
        readinessScore={84.2}
        onLaunchDrill={onStartAssessment}
        onOpenScorecard={onViewScorecard}
      />

      {/* ========================================================
       * 2. GAMIFICATION ENGINES: LEARNING STREAK TRACKER
       * ======================================================== */}
      <GamificationStreak
        currentStreakDays={14}
        longestStreakDays={22}
        onPracticeDrill={onStartAssessment}
      />

      {/* ========================================================
       * 3. HERO DUAL-ACTION SECTION: ACTIVE PATHWAY & NEW COURSES
       * ======================================================== */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${
        uiLayoutPreference === "3d-depth" ? "perspective-container-3d" : "perspective-container-flat"
      }`}>
        {/* 1) CONTINUE PENDING COURSE SECTION */}
        <div className={`lg:col-span-2 relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 shadow-xl overflow-hidden group transition-all ${
          uiLayoutPreference === "3d-depth" ? "card-depth-3d" : "card-depth-flat"
        }`}>
          {/* Subtle Ambient Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
                  Active Trade Pathway
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Est. {selectedCourse.durationHours} Hours Required</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {selectedCourse.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {selectedCourse.description}
              </p>
            </div>

            {/* Progress Bar & Milestone */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">Active Pathway Completion</span>
                <span className="text-cyan-300 font-extrabold text-sm drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{completedModulesCount} of {totalModulesCount} Modules Completed</span>
                <span className="text-amber-400 font-mono font-medium">Next: Module {Math.min(totalModulesCount, completedModulesCount + 1)} Assessment</span>
              </div>
            </div>

            {/* Interactive Skill Mastery Badges Showcase Strip */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 shadow-sm">
              <SkillMasteryBadgesList
                course={selectedCourse}
                onSelectBadge={setActiveBadgeModal}
                onSimulateComplete={(courseId, modIdx) => updateCourseCompletedModules(courseId, modIdx)}
              />
            </div>

            {/* Primary Action Buttons: Join Course vs Test Case */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                id="join-active-course-btn"
                onClick={() => setDashboardView("COURSE_INTERFACE")}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Join Course (View Details &amp; Videos)</span>
              </button>

              <button
                type="button"
                id="test-case-active-course-btn"
                onClick={() => setDashboardView("TEST_CASE")}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Video className="w-4 h-4 fill-current" />
                <span>Test Case (Video Input &amp; Models)</span>
              </button>

              <button
                type="button"
                onClick={onOpenSideBySide}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Video className="w-4 h-4 text-cyan-400" />
                <span>Side-by-Side Player</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2) START A NEW COURSE ACTION CARD */}
        <div className={`relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all ${
          uiLayoutPreference === "3d-depth" ? "card-depth-3d" : "card-depth-flat"
        }`}>
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/25 via-amber-400/20 to-yellow-500/10 border border-amber-400/50 text-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 relative group-hover:scale-105 transition-transform">
              <PlusCircle className="w-7 h-7 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] stroke-[2.2]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
            </div>

            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                High-Value Catalog
              </span>
              <h3 className="text-lg font-bold text-white mt-1">Start a New Course</h3>
              <p className="text-xs text-slate-400 font-light mt-1 leading-relaxed">
                Enroll in another industry-verified trade program to expand your practical certifications and recruiter visibility.
              </p>
            </div>

            {/* Quick Available Courses List with Progress Bars */}
            <div className="space-y-2.5 pt-2">
              {courses.slice(0, 3).map((c) => {
                const cPercent = Math.round(((c.completedModules || 0) / (c.totalModules || 1)) * 100);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectCourse(c.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all group cursor-pointer ${
                      c.id === selectedCourse.id
                        ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-semibold truncate text-white">{c.title}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          Level {c.nsqfLevel} • {c.completedModules}/{c.totalModules} modules
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] font-mono font-bold text-cyan-400">
                          {cPercent}%
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    {/* Compact Visual Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800/90 overflow-hidden mt-2 relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          c.id === selectedCourse.id
                            ? "bg-gradient-to-r from-cyan-400 to-amber-400 shadow-sm shadow-cyan-500/50"
                            : "bg-gradient-to-r from-cyan-500/80 to-blue-500/80"
                        }`}
                        style={{ width: `${cPercent}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenNewCourse}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors group cursor-pointer"
          >
            <span>Browse All High-Value Courses</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-amber-400" />
          </button>
        </div>
      </div>

      {/* ========================================================
       * 4. ACTIVE ENROLLED COURSES & VISUAL PROGRESS TRACKERS
       * ======================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Active Enrolled Courses &amp; Progress</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                EDGE-TO-EDGE GLASS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Live NSQF competency completion and dual-evidence verification status across your enrolled programs
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filter tags matching the showcase specification: All (8), Unlocked (5) */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-xs">
                All (8)
              </span>
              <span className="px-3 py-1 rounded-lg text-slate-400 font-medium">
                Unlocked (5)
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full hidden sm:inline-block">
              {activeCourses.length} Active {activeCourses.length === 1 ? "Program" : "Programs"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCourses.map((course) => {
            const coursePercent = Math.round(
              ((course.completedModules || 0) / (course.totalModules || 1)) * 100
            );
            const isCurrent = course.id === selectedCourse.id;

            return (
              <div
                key={course.id}
                className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isCurrent
                    ? "bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950 border-cyan-500/40 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-500/20"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70"
                }`}
              >
                <div>
                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {course.tradeCode}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Level {course.nsqfLevel} • {course.durationHours} hrs
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {course.title}
                      </h4>
                    </div>

                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        Selected
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => selectCourse(course.id)}
                        className="text-[11px] font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors shrink-0 cursor-pointer"
                      >
                        Switch
                      </button>
                    )}
                  </div>

                  {/* Visual Progress Bar Section */}
                  <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 my-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Completion Progress</span>
                      </span>
                      <span className="text-sm font-bold text-cyan-400">
                        {coursePercent}%
                      </span>
                    </div>

                    {/* Progress Bar with smooth fill */}
                    <div
                      className="w-full h-3 rounded-full bg-slate-800/90 overflow-hidden relative p-[1px]"
                      role="progressbar"
                      aria-valuenow={coursePercent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${
                          isCurrent
                            ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 shadow-cyan-500/30"
                            : "bg-gradient-to-r from-slate-400 via-cyan-500 to-amber-400 shadow-cyan-500/20"
                        }`}
                        style={{ width: `${coursePercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                      <span>
                        {course.completedModules} of {course.totalModules} Modules Verified
                      </span>
                      <span className="font-mono text-slate-500">
                        {course.totalModules - course.completedModules} Remaining
                      </span>
                    </div>
                  </div>

                  {/* Interactive Skill Mastery Badges on Course Card */}
                  <div className="my-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <SkillMasteryBadgesList
                      course={course}
                      onSelectBadge={setActiveBadgeModal}
                      compact={true}
                      onSimulateComplete={(courseId, modIdx) => updateCourseCompletedModules(courseId, modIdx)}
                    />
                  </div>
                </div>

                {/* Current pending drill & Dual Action: Join Course vs Test Case */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mt-1">
                  <div className="min-w-0 pr-2">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                      Current Task
                    </div>
                    <div className="text-xs text-slate-300 font-medium truncate">
                      {course.currentTaskTitle}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      id={`join-course-btn-${course.id}`}
                      onClick={() => {
                        selectCourse(course.id);
                        setDashboardView("COURSE_INTERFACE");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Join Course</span>
                    </button>

                    <button
                      type="button"
                      id={`test-case-btn-${course.id}`}
                      onClick={() => {
                        selectCourse(course.id);
                        setDashboardView("TEST_CASE");
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-cyan-500/20 transition-all cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5 fill-current" />
                      <span>Test Case</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
       * 5. GAMIFICATION: BADGES SHOWCASE GRID
       * ======================================================== */}
      <BadgesShowcase onPracticeDrill={onStartAssessment} />

      {/* ========================================================
       * 6. ADVANCED MEDIA UPLOAD & SELF-REVIEW STUDIO
       * ======================================================== */}
      <AdvancedMediaUpload
        onStartAssessment={onStartAssessment}
        onViewScorecard={onViewScorecard}
      />

      {/* ========================================================
       * 7. DETAILED NSQF MODULE BREAKDOWN & DRILL LAUNCHER
       * ======================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>{selectedCourse.title} • NSQF Curriculum Modules</span>
            </h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Each module requires dual-evidence verification: physical tool dexterity &amp; verbal technical rationale
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full w-fit">
            {completedModulesCount} of {totalModulesCount} Mastered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moduleList.map((mod, idx) => (
            <div
              key={mod.id}
              className={`p-5 rounded-2xl border transition-all ${
                mod.completed
                  ? "bg-slate-900/90 border-slate-800"
                  : "bg-slate-900/50 border-slate-800/80"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      mod.completed
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{mod.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-light">{mod.description}</p>
                  </div>
                </div>

                {mod.completed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveBadgeModal({
                        skillName: mod.skillName,
                        moduleIndex: idx + 1,
                        moduleTitle: mod.title,
                        is100Percent: true,
                        completionPercent: 100,
                        course: selectedCourse,
                        nsqfCode: mod.taskCode,
                        verificationDate: "2026-09-18",
                        visionScore: 100,
                        sequenceScore: 100,
                        verbalScore: 100,
                        digitalHash: `0x${selectedCourse.tradeCode.slice(0, 4)}_MOD${idx + 1}_GOLD`,
                      });
                    }}
                    className="relative overflow-hidden inline-flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/25 via-yellow-500/15 to-amber-600/25 text-amber-300 border border-amber-400/70 shadow-md shadow-amber-500/20 cursor-pointer hover:scale-105 active:scale-95 transition-transform shrink-0"
                    title="100% Mastered - Click to inspect verified credential"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
                    <span>100% Mastered</span>
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <Clock className="w-3 h-3" />
                      Pending ({mod.completionPercent}%)
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCourseCompletedModules(selectedCourse.id, idx + 1)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      title="Simulate reaching 100% completion in this module"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      <span>Pass 100%</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Task code and competencies */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 text-[11px]">{mod.taskCode} • {mod.skillName}</span>
                <button
                  type="button"
                  onClick={onStartAssessment}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>{mod.completed ? "Review Recording" : "Launch Studio"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Skill Mastery Modal */}
      <SkillMasteryModal
        badge={activeBadgeModal}
        onClose={() => setActiveBadgeModal(null)}
        onViewEvidence={onStartAssessment}
      />

      {/* 3D Isometric Dark-Mode Web Dashboard Render Mockup Modal */}
      <IsometricMockupModal
        isOpen={showIsometricMockup}
        onClose={() => setShowIsometricMockup(false)}
        onLaunchAssessment={onStartAssessment}
      />
    </div>
  );
};
