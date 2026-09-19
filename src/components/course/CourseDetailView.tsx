import React, { useState, useRef } from "react";
import { Course } from "../../types";
import { 
  BookOpen, 
  Video, 
  FileText, 
  CheckCircle2, 
  Play, 
  Pause, 
  Clock, 
  Award, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle, 
  Check, 
  ChevronRight, 
  ExternalLink,
  Layers,
  Zap,
  Sun,
  BatteryCharging,
  Cpu,
  Download,
  AlertTriangle,
  Lock
} from "lucide-react";
import confetti from "canvas-confetti";

interface CourseDetailViewProps {
  course: Course;
  onBackToCourses: () => void;
  onLaunchTestCase: (courseId: string) => void;
}

interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  moduleName: string;
  description: string;
  keyTakeaways: string[];
  videoThumbnailText: string;
}

interface AvailableTest {
  id: string;
  title: string;
  type: "THEORY" | "PRACTICAL_TEST_CASE" | "BENCH_DRILL" | "FINAL_EXAM";
  durationMinutes: number;
  questionCount?: number;
  status: "COMPLETED" | "AVAILABLE" | "LOCKED";
  score?: number;
  badge?: string;
  description: string;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  course,
  onBackToCourses,
  onLaunchTestCase,
}) => {
  const [activeTab, setActiveTab] = useState<"DETAILS" | "VIDEOS" | "TESTS">("DETAILS");
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(14);
  const [completedLessons, setCompletedLessons] = useState<string[]>(["vid-1"]);

  // Video lessons curriculum for the selected course
  const videoLessons: VideoLesson[] = [
    {
      id: "vid-1",
      title: "Class 0 1000V Dielectric Safety & Glove Inspection",
      duration: "14:20",
      moduleName: "Module 1: Safety & PPE Compliance",
      description: "Visual inspection protocols, pneumatic roll-up air retention test, and ASTM D120 certification stamp identification.",
      keyTakeaways: [
        "Roll cuff tightly towards fingers to trap air; submerge or listen for leaks",
        "Inspect leather protector glove for metallic shavings or oil contamination",
        "Never touch live 415V three-phase busbars without Class 0 rating"
      ],
      videoThumbnailText: "Dielectric Air-Retention & Roll-Up Demo"
    },
    {
      id: "vid-2",
      title: "Live-Dead-Live Zero-Potential Multimeter Standards",
      duration: "18:45",
      moduleName: "Module 2: Multimeter Diagnostics",
      description: "Step-by-step three-point verification sequence: known live source -> de-energized test circuit -> known live source.",
      keyTakeaways: [
        "CAT-III 600V or CAT-IV 1000V meter rating mandatory",
        "Verify 0.00V across Line-Line, Line-Neutral, and Neutral-Earth",
        "Test leads must feature finger barriers and max 4mm exposed tips"
      ],
      videoThumbnailText: "Three-Point Live-Dead-Live Procedure"
    },
    {
      id: "vid-3",
      title: "Conductor Stripping & 2.4 Nm Terminal Torque Calibration",
      duration: "21:10",
      moduleName: "Module 3: Wiring & Mechanical Assembly",
      description: "Precision wire stripping without copper strand scoring, ferrule crimping, and calibrated torque wrench pull-tests.",
      keyTakeaways: [
        "11mm clean strip depth for standard DIN-rail MCB terminals",
        "Zero copper strand nicking or severed cross-sectional area",
        "Listen for mechanical clutch click at calibrated 2.4 Nm torque"
      ],
      videoThumbnailText: "Precision Stripping & Torque Click"
    },
    {
      id: "vid-4",
      title: "LOTO Lockout/Tagout & 3-Phase Short Circuit Diagnostics",
      duration: "16:30",
      moduleName: "Module 4: Industrial Fault Isolation",
      description: "Application of safety hasps, padlocks, standardized danger tags, and simulated thermal overload troubleshooting.",
      keyTakeaways: [
        "Personal padlock key kept exclusively by operating technician",
        "Red danger tag with date, name, and technician ID clearly visible",
        "Discharge residual capacitive busbar energy before maintenance"
      ],
      videoThumbnailText: "Lockout/Tagout Standard Operating Procedure"
    }
  ];

  // Available tests for this trade course
  const availableTests: AvailableTest[] = [
    {
      id: "test-theory-diag",
      title: "Diagnostic Theory Pre-Test (Electrician Fundamentals)",
      type: "THEORY",
      durationMinutes: 20,
      questionCount: 15,
      status: "COMPLETED",
      score: 88,
      badge: "Theory Verified",
      description: "Ohm's law, three-phase impedance calculation, dielectric insulation thresholds, and color code standards."
    },
    {
      id: "test-bench-interim",
      title: "Mid-Term Bench Diagnostic Drill (Multimeter & PPE)",
      type: "BENCH_DRILL",
      durationMinutes: 15,
      status: "COMPLETED",
      score: 92,
      badge: "Bench Mastered",
      description: "Hands-on zero-voltage verification drill with simulated live/dead switchboard terminals."
    },
    {
      id: "test-practical-video",
      title: "Workshop Practical Test Case (Zero-Potential & Torque Assessment)",
      type: "PRACTICAL_TEST_CASE",
      durationMinutes: 30,
      status: "AVAILABLE",
      badge: "Core Practical Test",
      description: "Submit your hands-on workshop video for AI multimodal audit: 1000V PPE check, 0.00V multimeter check, and 2.4 Nm torque pull-test."
    },
    {
      id: "test-final-cert",
      title: "Final NSQF Level 4/5 Certification & Viva Voce",
      type: "FINAL_EXAM",
      durationMinutes: 45,
      status: "LOCKED",
      badge: "DGT Certified",
      description: "Comprehensive dual-evidence assessment: practical video exam combined with verbal technical reasoning evaluation."
    }
  ];

  const currentLesson = videoLessons[activeVideoIndex];

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case "Sun":
        return <Sun className="w-5 h-5 text-amber-400" />;
      case "BatteryCharging":
        return <BatteryCharging className="w-5 h-5 text-emerald-400" />;
      case "Cpu":
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case "Zap":
      default:
        return <Zap className="w-5 h-5 text-cyan-400" />;
    }
  };

  const markLessonComplete = (id: string) => {
    if (!completedLessons.includes(id)) {
      setCompletedLessons([...completedLessons, id]);
      confetti({ particleCount: 30, spread: 45 });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* TOP NAVIGATION & COURSE HERO HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          type="button"
          onClick={onBackToCourses}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses Catalog</span>
        </button>

        {/* PROMINENT JUMP TO TEST CASE CTA */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 hidden md:inline">
            Ready to verify practical skill?
          </span>
          <button
            type="button"
            onClick={() => onLaunchTestCase(course.id)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Video className="w-4 h-4 fill-current" />
            <span>Switch to Test Case</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* COURSE SPOTLIGHT CARD */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 font-bold">
                {getCourseIcon(course.iconName)}
                <span>NSQF Level {course.nsqfLevel}</span>
              </span>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Trade Code: {course.tradeCode}
              </span>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                DGT &amp; NCVT Accredited
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              {course.description}
            </p>

            {/* Endorsing Employers */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Endorsing Employers:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {course.industryPartners.map((partner, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-200"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 shrink-0">
            <div className="text-left md:text-right">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Curriculum Duration</span>
              <span className="text-lg font-bold font-mono text-amber-400 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.durationHours} Hours</span>
              </span>
            </div>
            <div className="text-left md:text-right">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Modules Progress</span>
              <span className="text-lg font-bold font-mono text-cyan-400">
                {course.completedModules} / {course.totalModules} Done
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
       * COURSE INTERFACE TABS: DETAILS | VIDEOS | TESTS
       * ========================================================= */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("DETAILS")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "DETAILS"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Course Details &amp; Syllabus</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("VIDEOS")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "VIDEOS"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Instructional Videos ({videoLessons.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("TESTS")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "TESTS"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Tests &amp; Practical Cases ({availableTests.length})</span>
        </button>
      </div>

      {/* =========================================================
       * TAB 1: COURSE DETAILS & SYLLABUS
       * ========================================================= */}
      {activeTab === "DETAILS" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Practical Competencies Grid */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>Verified Practical Competencies Taught</span>
              </h3>
              <p className="text-xs text-slate-400 font-light">
                Each competency is audited through high-frame rate computer vision and verbal diagnostic speech evaluation:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {course.skillsTaught.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{skill}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        NSQF Standard Benchmark
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modular Syllabus Breakdown */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>Modular Syllabus &amp; Milestones</span>
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                      Module 1 • Completed (100%)
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      Dielectric Safety &amp; High-Voltage PPE Verification
                    </h4>
                    <p className="text-xs text-slate-400 font-light">
                      Class 0 1000V rated glove visual inspection, dielectric test stamp verification.
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                      Module 2 • In Progress (Current Task)
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      Live-Dead-Live Zero-Voltage Testing &amp; Contactor Wiring
                    </h4>
                    <p className="text-xs text-slate-400 font-light">
                      Torque calibration, CAT-III multimeter testing, real-time verbal reasoning justification.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onLaunchTestCase(course.id)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-colors cursor-pointer shrink-0"
                  >
                    Take Test Case
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between opacity-70">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                      Module 3 • Up Next
                    </span>
                    <h4 className="text-sm font-bold text-slate-300">
                      Fault Simulation &amp; Thermal Breaker Verification
                    </h4>
                    <p className="text-xs text-slate-500 font-light">
                      Short circuit detection, lockout-tagout (LOTO) procedure, load balancing check.
                    </p>
                  </div>
                  <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: PREREQUISITES & GEAR REQUIREMENTS */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Workshop Gear Required
              </h3>
              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Class 0 (1000V) Dielectric Gloves</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>CAT-III 600V / CAT-IV Multimeter</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Calibrated Torque Screwdriver (2.4 Nm)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>1080p / 720p 30fps Video Camera</span>
                </div>
              </div>
            </div>

            {/* Test Case Launch Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/40 space-y-3">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                Direct Skill Verification
              </span>
              <h4 className="text-sm font-bold text-white">
                Launch Hands-On Test Case
              </h4>
              <p className="text-xs text-slate-300 font-light">
                Submit your workshop recording, trigger instant pre-audit models, self-check your footage, and re-confirm for official grading.
              </p>
              <button
                type="button"
                onClick={() => onLaunchTestCase(course.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Video className="w-4 h-4 fill-current" />
                <span>Open Video Test Case</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * TAB 2: INSTRUCTIONAL VIDEOS & LECTURE PLAYER
       * ========================================================= */}
      {activeTab === "VIDEOS" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* VIDEO PLAYER CONTAINER */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-video rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4 group">
              {/* Simulated playback frame */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950/80 to-black/60 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-xl">
                  <Video className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white font-mono">
                  {currentLesson.title}
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {currentLesson.moduleName} • Duration {currentLesson.duration}
                </p>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full mt-2">
                  DGT Master Instructor Video
                </span>
              </div>

              {/* Play / Pause Center Overlay Button */}
              <div className="relative z-10 my-auto flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="w-14 h-14 rounded-2xl bg-cyan-500/30 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-300 flex items-center justify-center shadow-xl transition-transform hover:scale-105 cursor-pointer backdrop-blur-sm"
                >
                  {isVideoPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              {/* Controls bar at bottom */}
              <div className="relative z-10 bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-slate-800 space-y-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={videoCurrentTime}
                  onChange={(e) => setVideoCurrentTime(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1 rounded-lg bg-slate-800 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="text-cyan-400 hover:text-white cursor-pointer"
                    >
                      {isVideoPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                    <span>04:12 / {currentLesson.duration}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => markLessonComplete(currentLesson.id)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-950/80 border border-slate-700 text-emerald-400 text-[10px] cursor-pointer"
                    >
                      {completedLessons.includes(currentLesson.id) ? "✓ Completed" : "Mark as Watched"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Lesson Notes & Key Takeaways */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                    Lesson Concept Overview
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {currentLesson.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onLaunchTestCase(course.id)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Practice in Test Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {currentLesson.description}
              </p>

              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                  Critical Workshop Principles:
                </span>
                {currentLesson.keyTakeaways.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PLAYLIST SIDEBAR */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                Curriculum Playlist
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                {completedLessons.length}/{videoLessons.length} Finished
              </span>
            </div>

            <div className="space-y-2">
              {videoLessons.map((lesson, idx) => {
                const isSelected = activeVideoIndex === idx;
                const isDone = completedLessons.includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      setActiveVideoIndex(idx);
                      setIsVideoPlaying(true);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 border-cyan-500/50 shadow-md shadow-cyan-500/10"
                        : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                        isSelected
                          ? "bg-cyan-400 text-slate-950"
                          : isDone
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono text-slate-500 truncate">
                            {lesson.moduleName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {lesson.duration}
                          </span>
                        </div>
                        <div className={`text-xs font-bold truncate mt-0.5 ${
                          isSelected ? "text-cyan-300" : "text-white"
                        }`}>
                          {lesson.title}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * TAB 3: TESTS AVAILABLE & PRACTICAL TEST CASES
       * ========================================================= */}
      {activeTab === "TESTS" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                Available Assessments &amp; Hands-On Video Audits
              </h3>
              <p className="text-xs text-slate-400 font-light">
                Complete all interim tests and video audits to unlock your final NSQF accreditation.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full w-fit">
              2 of 4 Tests Completed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableTests.map((test) => {
              const isTestCase = test.type === "PRACTICAL_TEST_CASE";
              const isCompleted = test.status === "COMPLETED";
              const isLocked = test.status === "LOCKED";

              return (
                <div
                  key={test.id}
                  className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${
                    isTestCase
                      ? "bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border-cyan-500/50 shadow-xl shadow-cyan-500/10"
                      : isCompleted
                      ? "bg-slate-900/70 border-emerald-500/30"
                      : "bg-slate-900/40 border-slate-800"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${
                        isTestCase
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                          : isCompleted
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}>
                        {test.badge}
                      </span>

                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{test.durationMinutes} Mins</span>
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">
                      {test.title}
                    </h4>

                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  {/* Bottom action row */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    {isCompleted ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Passed • Score: {test.score}%</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">Recorded</span>
                      </div>
                    ) : isTestCase ? (
                      <button
                        type="button"
                        onClick={() => onLaunchTestCase(course.id)}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                      >
                        <Video className="w-4 h-4 fill-current" />
                        <span>Open Test Case (Upload &amp; Verify)</span>
                      </button>
                    ) : isLocked ? (
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                        <Lock className="w-4 h-4" />
                        <span>Locked until Practical Test Case is Passed</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition-colors cursor-pointer"
                      >
                        Launch Assessment
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
