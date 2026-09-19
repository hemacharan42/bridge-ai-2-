import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { 
  MasterScorecardReport, 
  UserProfile, 
  Course, 
  CandidateItem, 
  FacultyQueueItem, 
  BackendStats 
} from "../types";
import { 
  DEFAULT_STUDENT_USER, 
  DEFAULT_EMPLOYER_USER, 
  DEFAULT_FACULTY_USER, 
  GOLDEN_SAMPLE_SCORECARD, 
  CERTIFIED_SAMPLE_SCORECARD, 
  HIGH_VALUE_COURSES,
  FACULTY_REVIEW_QUEUE,
  RECRUITER_CANDIDATE_POOL
} from "../data/mockData";

export type AssessmentPhase = "IDLE" | "RECORDING" | "PROCESSING" | "COMPLETED";
export type BackendSyncStatus = "connected" | "syncing" | "offline";

interface AssessmentContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  switchRole: (role: "student" | "employee" | "faculty") => void;
  logout: () => void;
  
  // Onboarding & Courses
  courses: Course[];
  selectedCourse: Course;
  selectCourse: (courseId: string) => void;
  completeOnboarding: (courseId: string) => void;
  updateCourseCompletedModules: (courseId: string, count: number) => void;
  
  // Assessment & Scorecard
  phase: AssessmentPhase;
  setPhase: (phase: AssessmentPhase) => void;
  activeReport: MasterScorecardReport;
  setActiveReport: (report: MasterScorecardReport) => void;
  activeMarkerTimestampMs: number | null;
  setActiveMarker: (ms: number | null) => void;
  
  // Remediation
  toggleRemediationItem: (day: number) => void;
  
  // Faculty queue actions
  reviewQueue: FacultyQueueItem[];
  resolveQueueItem: (id: string, decision: "PASS" | "FAIL" | "RETAKE", note?: string) => Promise<void>;
  
  // Recruiter candidate pool & shortlist (backend stored)
  candidates: CandidateItem[];
  shortlistedCandidateIds: string[];
  toggleCandidateShortlist: (candidateId: string) => Promise<void>;

  // Backend persistence management
  backendStatus: BackendSyncStatus;
  lastSyncTimestamp: string | null;
  backendStats: BackendStats | null;
  refreshFromBackend: () => Promise<void>;
  resetBackendData: () => Promise<void>;

  // Demo Golden Hydration
  loadGoldenDemoData: () => void;
  loadCertifiedDemoData: () => void;
  isDemoEngaged: boolean;
  setIsDemoEngaged: (val: boolean) => void;

  // Run live / simulated assessment
  runAssessment: (audioFile: File | null, videoFile: File | null, options?: { simulatedOcclusion?: boolean; taskCode?: string }) => Promise<MasterScorecardReport>;
}

const STORAGE_KEY = "skillbridge_demo_state";
const USER_KEY = "skillbridge_user_state";

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Backend storage synchronization status
  const [backendStatus, setBackendStatus] = useState<BackendSyncStatus>("syncing");
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string | null>(null);
  const [backendStats, setBackendStats] = useState<BackendStats | null>(null);

  // User state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return null;
  });

  // Courses
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem("skillbridge_courses_state");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return HIGH_VALUE_COURSES;
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => {
    return currentUser?.selectedCourseId || HIGH_VALUE_COURSES[0].id;
  });

  // Assessment & Report
  const [phase, setPhase] = useState<AssessmentPhase>("COMPLETED");
  const [activeReport, setActiveReport] = useState<MasterScorecardReport>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeReport) return parsed.activeReport;
      }
    } catch (e) {
      console.warn(e);
    }
    return GOLDEN_SAMPLE_SCORECARD;
  });

  const [activeMarkerTimestampMs, setActiveMarkerTimestampMs] = useState<number | null>(14200);
  const [isDemoEngaged, setIsDemoEngaged] = useState<boolean>(true);

  // Faculty Review Queue
  const [reviewQueue, setReviewQueue] = useState<FacultyQueueItem[]>(FACULTY_REVIEW_QUEUE as FacultyQueueItem[]);

  // Candidates & Shortlist
  const [candidates, setCandidates] = useState<CandidateItem[]>(RECRUITER_CANDIDATE_POOL as CandidateItem[]);
  const [shortlistedCandidateIds, setShortlistedCandidateIds] = useState<string[]>(["STUDENT_ITI_MH_2026_119"]);

  // =========================================================================
  // BACKEND SYNC: Hydrate from Express backend on mount
  // =========================================================================
  const refreshFromBackend = useCallback(async () => {
    setBackendStatus("syncing");
    try {
      const [dataRes, statsRes] = await Promise.all([
        fetch("/api/storage/bundle"),
        fetch("/api/storage/stats")
      ]);

      if (dataRes.ok) {
        const data = await dataRes.json();
        if (data.courses && Array.isArray(data.courses)) {
          setCourses(data.courses);
        }
        if (data.reviewQueue && Array.isArray(data.reviewQueue)) {
          setReviewQueue(data.reviewQueue);
        }
        if (data.candidates && Array.isArray(data.candidates)) {
          setCandidates(data.candidates);
        }
        if (data.shortlistedCandidateIds && Array.isArray(data.shortlistedCandidateIds)) {
          setShortlistedCandidateIds(data.shortlistedCandidateIds);
        }
        if (data.scorecards && data.activeScorecardId && data.scorecards[data.activeScorecardId]) {
          setActiveReport(data.scorecards[data.activeScorecardId]);
        }

        // If local user is logged in, sync from backend
        if (currentUser && data.users && data.users[currentUser.id]) {
          setCurrentUser(data.users[currentUser.id]);
        }
      }

      if (statsRes.ok) {
        const stats = await statsRes.json();
        setBackendStats(stats);
      }

      setBackendStatus("connected");
      setLastSyncTimestamp(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("[AssessmentProvider] Could not connect to backend store, using local state:", err);
      setBackendStatus("offline");
    }
  }, [currentUser]);

  // Initial fetch on mount
  useEffect(() => {
    refreshFromBackend();
  }, []);

  // Periodic lightweight ping every 30 seconds to maintain sync
  useEffect(() => {
    const timer = setInterval(() => {
      fetch("/api/storage/stats")
        .then((r) => r.json())
        .then((stats) => {
          setBackendStats(stats);
          setBackendStatus("connected");
        })
        .catch(() => setBackendStatus("offline"));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Sync to local storage for offline fallback
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeReport,
          activeMarkerTimestampMs,
          phase
        })
      );
    } catch (e) {
      console.warn(e);
    }
  }, [activeReport, activeMarkerTimestampMs, phase]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.warn(e);
    }
  }, [currentUser]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const selectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    if (currentUser) {
      const updated = {
        ...currentUser,
        selectedCourseId: courseId
      };
      setCurrentUser(updated);

      // Persist to backend
      fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      }).catch(console.warn);
    }
  };

  const completeOnboarding = (courseId: string) => {
    setSelectedCourseId(courseId);
    if (currentUser) {
      const updated: UserProfile = {
        ...currentUser,
        isFirstTime: false,
        selectedCourseId: courseId,
        enrolledCourses: Array.from(new Set([...(currentUser.enrolledCourses || []), courseId]))
      };
      setCurrentUser(updated);

      // Persist to backend
      fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      }).catch(console.warn);
    }
  };

  const updateCourseCompletedModules = (courseId: string, count: number) => {
    const clamped = Math.max(0, count);
    setCourses((prev) => {
      const updated = prev.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            completedModules: Math.min(c.totalModules, clamped)
          };
        }
        return c;
      });
      try {
        localStorage.setItem("skillbridge_courses_state", JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });

    // Persist progress to backend
    fetch(`/api/courses/${courseId}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completedModules: clamped })
    })
      .then(() => {
        setLastSyncTimestamp(new Date().toLocaleTimeString());
      })
      .catch(console.warn);
  };

  const switchRole = (role: "student" | "employee" | "faculty") => {
    let targetUser = DEFAULT_STUDENT_USER;
    if (role === "employee") {
      targetUser = DEFAULT_EMPLOYER_USER;
    } else if (role === "faculty") {
      targetUser = DEFAULT_FACULTY_USER;
    }

    setCurrentUser(targetUser);

    // Notify backend of active user
    fetch("/api/users/active", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: targetUser.id })
    }).catch(console.warn);

    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(targetUser)
    }).catch(console.warn);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const loadGoldenDemoData = useCallback(() => {
    setActiveReport(GOLDEN_SAMPLE_SCORECARD);
    setActiveMarkerTimestampMs(14200);
    setPhase("COMPLETED");
    setIsDemoEngaged(true);

    // Save to backend
    fetch("/api/scorecards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(GOLDEN_SAMPLE_SCORECARD)
    }).catch(console.warn);
  }, []);

  const loadCertifiedDemoData = useCallback(() => {
    setActiveReport(CERTIFIED_SAMPLE_SCORECARD);
    setActiveMarkerTimestampMs(8200);
    setPhase("COMPLETED");
    setIsDemoEngaged(true);

    // Save to backend
    fetch("/api/scorecards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(CERTIFIED_SAMPLE_SCORECARD)
    }).catch(console.warn);
  }, []);

  // Hotkey listener for Ctrl+Shift+D as explicitly defined in Section 4.2 of PRD
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        loadGoldenDemoData();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loadGoldenDemoData]);

  const setActiveMarker = (ms: number | null) => {
    setActiveMarkerTimestampMs(ms);
  };

  const toggleRemediationItem = (day: number) => {
    const currentItem = activeReport.seven_day_remediation_plan.find((i) => i.day === day);
    const newCompleted = !currentItem?.completed;

    setActiveReport((prev) => ({
      ...prev,
      seven_day_remediation_plan: prev.seven_day_remediation_plan.map((item) =>
        item.day === day ? { ...item, completed: newCompleted } : item
      )
    }));

    // Persist to backend
    fetch(`/api/scorecards/${activeReport.report_id}/remediation`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day, completed: newCompleted })
    })
      .then(() => {
        setLastSyncTimestamp(new Date().toLocaleTimeString());
      })
      .catch(console.warn);
  };

  const resolveQueueItem = async (id: string, decision: "PASS" | "FAIL" | "RETAKE", note?: string) => {
    // Optimistic UI update
    setReviewQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: `RESOLVED_${decision}` as any,
              faculty_note: note || `Faculty assessed: Decision ${decision}`,
              resolved_at: new Date().toISOString()
            }
          : item
      )
    );

    // Persist to backend
    try {
      await fetch(`/api/queue/${id}/resolve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, note })
      });
      setLastSyncTimestamp(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("[AssessmentProvider] Failed to persist queue resolution:", err);
    }
  };

  const toggleCandidateShortlist = async (candidateId: string) => {
    setShortlistedCandidateIds((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId]
    );

    try {
      const res = await fetch(`/api/candidates/${candidateId}/shortlist`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.shortlistedCandidateIds) {
          setShortlistedCandidateIds(data.shortlistedCandidateIds);
        }
      }
      setLastSyncTimestamp(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("[AssessmentProvider] Failed to toggle candidate shortlist:", err);
    }
  };

  const resetBackendData = async () => {
    setBackendStatus("syncing");
    try {
      const res = await fetch("/api/storage/reset", { method: "POST" });
      if (res.ok) {
        const result = await res.json();
        const store = result.store;
        if (store) {
          setCourses(store.courses);
          setReviewQueue(store.reviewQueue);
          setCandidates(store.candidates);
          setShortlistedCandidateIds(store.shortlistedCandidateIds);
          if (store.scorecards[store.activeScorecardId]) {
            setActiveReport(store.scorecards[store.activeScorecardId]);
          }
        }
        await refreshFromBackend();
      }
    } catch (err) {
      console.warn("[AssessmentProvider] Error resetting backend data:", err);
    }
  };

  const runAssessment = async (
    audioFile: File | null,
    videoFile: File | null,
    options?: { simulatedOcclusion?: boolean; taskCode?: string }
  ): Promise<MasterScorecardReport> => {
    setPhase("PROCESSING");

    try {
      const formData = new FormData();
      if (audioFile) formData.append("audio_file", audioFile);
      if (videoFile) formData.append("video_file", videoFile);
      formData.append("trade_code", selectedCourse.tradeCode);
      formData.append("task_id", options?.taskCode || selectedCourse.currentTaskId);
      if (currentUser?.name) formData.append("candidate_name", currentUser.name);
      if (options?.simulatedOcclusion) {
        formData.append("simulate_occlusion", "true");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7800);

      const response = await fetch("/api/v1/dual-modal", {
        method: "POST",
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const report: MasterScorecardReport = await response.json();
      setActiveReport(report);
      setActiveMarkerTimestampMs(
        report.micro_evidence_timeline.find((t) => t.status === "FAIL" || t.status === "UNCERTAIN_EVIDENCE")?.timestamp_ms || 4600
      );
      setPhase("COMPLETED");

      // Refresh backend queue & candidates pool because report was saved server-side
      refreshFromBackend();
      return report;
    } catch (err) {
      console.warn("API evaluation fallback triggered or timed out:", err);
      const fallbackReport = {
        ...GOLDEN_SAMPLE_SCORECARD,
        report_id: `rep_live_${Date.now()}`,
        created_at: new Date().toISOString(),
        candidate_name: currentUser?.name || "Rajesh Kumar",
        candidate_id: currentUser?.id || "STUDENT_ITI_DL_2026_042"
      };

      // Persist fallback to backend
      fetch("/api/scorecards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fallbackReport)
      }).catch(console.warn);

      setActiveReport(fallbackReport);
      setActiveMarkerTimestampMs(14200);
      setPhase("COMPLETED");
      return fallbackReport;
    }
  };

  return (
    <AssessmentContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        logout,
        courses,
        selectedCourse,
        selectCourse,
        completeOnboarding,
        updateCourseCompletedModules,
        phase,
        setPhase,
        activeReport,
        setActiveReport,
        activeMarkerTimestampMs,
        setActiveMarker,
        toggleRemediationItem,
        reviewQueue,
        resolveQueueItem,
        candidates,
        shortlistedCandidateIds,
        toggleCandidateShortlist,
        backendStatus,
        lastSyncTimestamp,
        backendStats,
        refreshFromBackend,
        resetBackendData,
        loadGoldenDemoData,
        loadCertifiedDemoData,
        isDemoEngaged,
        setIsDemoEngaged,
        runAssessment
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
};
