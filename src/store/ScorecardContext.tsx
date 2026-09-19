/**
 * ============================================================================
 * SCORECARD GLOBAL CONTEXT & DYNAMIC PERSISTENCE ENGINE
 * ============================================================================
 * Manages master scorecard persistence across test submissions, ensures single
 * source of truth between vision audit trail and evaluator observations, and
 * powers modal & PDF workflows.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { MasterScorecardReport, MicroEvidenceItem, FinalVerdict } from "../types";
import { GOLDEN_SAMPLE_SCORECARD, CERTIFIED_SAMPLE_SCORECARD } from "../data/mockData";
import { reconcileVisionEvaluation, ReconciledScorecardData } from "../lib/visionEvaluationPrompt";
import { generateScorecardPdf } from "../lib/pdfGenerator";

export interface VideoSourceState {
  url: string | null;
  name: string | null;
  file?: File | null;
}

export interface SaveTestAttemptOptions {
  videoUrl?: string;
  videoFileName?: string;
  videoFile?: File | null;
  candidateName?: string;
  candidateId?: string;
  courseTitle?: string;
  tradeCode?: string;
  rawTimeline?: MicroEvidenceItem[];
  speedScore?: number;
  integrityScore?: number;
  customNotes?: string[];
}

export interface ScorecardContextType {
  // Global UI Perspective & Depth Layout Preference ('flat' | '3d-depth')
  uiLayoutPreference: "flat" | "3d-depth";
  setUiLayoutPreference: (pref: "flat" | "3d-depth") => void;
  toggleUiLayoutPreference: () => void;

  // Active scorecard (latest test submission)
  activeScorecard: MasterScorecardReport;
  scorecardHistory: MasterScorecardReport[];
  setActiveScorecard: (scorecard: MasterScorecardReport) => void;

  // Attached video file / source for playback and seeking
  videoSource: VideoSourceState;
  setVideoSource: (video: VideoSourceState) => void;

  // Video seeking synchronizer
  modalSeekTimestampMs: number | null;
  setModalSeekTimestampMs: (ms: number | null) => void;
  seekToTimestamp: (timestampMs: number) => void;

  // Modal controls
  isScorecardModalOpen: boolean;
  openScorecardModal: (scorecard?: MasterScorecardReport, seekMs?: number) => void;
  closeScorecardModal: () => void;

  // PDF Export
  isExportingPdf: boolean;
  exportScorecardPdf: (scorecard?: MasterScorecardReport) => Promise<void>;

  // Save new test attempt from practical test case interface
  saveTestAttempt: (options: SaveTestAttemptOptions) => MasterScorecardReport;

  // Presets
  loadGoldenRun: () => void;
  loadCertifiedRun: () => void;
}

const SCORECARD_STORAGE_KEY = "skillbridge_scorecard_master";
const SCORECARD_HISTORY_KEY = "skillbridge_scorecard_history";
const SCORECARD_UI_PREFERENCE_KEY = "skillbridge_ui_layout_preference";

const ScorecardContext = createContext<ScorecardContextType | undefined>(undefined);

export const ScorecardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Global UI Preference: 'flat' or '3d-depth' (defaults to '3d-depth' for industrial spatial perspective)
  const [uiLayoutPreference, setUiLayoutPreferenceState] = useState<"flat" | "3d-depth">(() => {
    try {
      const saved = localStorage.getItem(SCORECARD_UI_PREFERENCE_KEY);
      if (saved === "flat" || saved === "3d-depth") {
        return saved;
      }
    } catch (e) {
      console.warn("Failed to load UI layout preference from localStorage", e);
    }
    return "3d-depth";
  });

  const setUiLayoutPreference = useCallback((pref: "flat" | "3d-depth") => {
    setUiLayoutPreferenceState(pref);
    try {
      localStorage.setItem(SCORECARD_UI_PREFERENCE_KEY, pref);
    } catch (e) {
      console.warn("Failed to persist UI layout preference", e);
    }
  }, []);

  const toggleUiLayoutPreference = useCallback(() => {
    setUiLayoutPreferenceState((prev) => {
      const next = prev === "3d-depth" ? "flat" : "3d-depth";
      try {
        localStorage.setItem(SCORECARD_UI_PREFERENCE_KEY, next);
      } catch (e) {
        console.warn("Failed to persist UI layout preference", e);
      }
      return next;
    });
  }, []);

  // 1. Initial State from localStorage
  const [activeScorecard, setActiveScorecardState] = useState<MasterScorecardReport>(() => {
    try {
      const saved = localStorage.getItem(SCORECARD_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load active scorecard from localStorage", e);
    }
    return GOLDEN_SAMPLE_SCORECARD;
  });

  const [scorecardHistory, setScorecardHistory] = useState<MasterScorecardReport[]>(() => {
    try {
      const saved = localStorage.getItem(SCORECARD_HISTORY_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load scorecard history from localStorage", e);
    }
    return [GOLDEN_SAMPLE_SCORECARD, CERTIFIED_SAMPLE_SCORECARD];
  });

  // Attached video state
  const [videoSource, setVideoSourceState] = useState<VideoSourceState>({
    url: null,
    name: "workshop_assessment_submission_01.mp4",
    file: null,
  });

  // Modal & Video scrub state
  const [isScorecardModalOpen, setIsScorecardModalOpen] = useState(false);
  const [modalSeekTimestampMs, setModalSeekTimestampMs] = useState<number | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Synchronize active scorecard to localStorage
  const setActiveScorecard = useCallback((report: MasterScorecardReport) => {
    setActiveScorecardState(report);
    try {
      localStorage.setItem(SCORECARD_STORAGE_KEY, JSON.stringify(report));
    } catch (e) {
      console.warn("Failed to persist scorecard", e);
    }
  }, []);

  const setVideoSource = useCallback((source: VideoSourceState) => {
    setVideoSourceState(source);
  }, []);

  const openScorecardModal = useCallback((scorecard?: MasterScorecardReport, seekMs?: number) => {
    if (scorecard) {
      setActiveScorecard(scorecard);
    }
    if (seekMs !== undefined) {
      setModalSeekTimestampMs(seekMs);
    }
    setIsScorecardModalOpen(true);
  }, [setActiveScorecard]);

  const closeScorecardModal = useCallback(() => {
    setIsScorecardModalOpen(false);
  }, []);

  const seekToTimestamp = useCallback((timestampMs: number) => {
    setModalSeekTimestampMs(timestampMs);
  }, []);

  /**
   * Save test attempt:
   * Reconciles raw video timeline with strict zero-tolerance PPE rules,
   * eliminates hallucinations, computes composite scores, updates activeScorecard and history.
   */
  const saveTestAttempt = useCallback((options: SaveTestAttemptOptions): MasterScorecardReport => {
    const rawTimeline = options.rawTimeline || activeScorecard.micro_evidence_timeline || GOLDEN_SAMPLE_SCORECARD.micro_evidence_timeline;

    // Apply strict single-source-of-truth vision evaluation
    const reconciled = reconcileVisionEvaluation(rawTimeline, {
      speedScore: options.speedScore,
      integrityScore: options.integrityScore,
      customNotes: options.customNotes,
    });

    const newReportId = `rep_${Date.now()}`;
    const newReport: MasterScorecardReport = {
      report_id: newReportId,
      created_at: new Date().toISOString(),
      candidate_id: options.candidateId || activeScorecard.candidate_id || "STUDENT_ITI_DL_2026_042",
      candidate_name: options.candidateName || activeScorecard.candidate_name || "Rajesh Kumar",
      trade_info: {
        trade_name: options.courseTitle || activeScorecard.trade_info?.trade_name || "Industrial Electrician",
        nsqf_level: activeScorecard.trade_info?.nsqf_level || 4,
        competency_code: activeScorecard.trade_info?.competency_code || "ELE/N0102",
        trade_code: options.tradeCode || activeScorecard.trade_info?.trade_code || "ELE_L4_DOMESTIC",
      },
      composite_score: reconciled.compositeScore,
      verdict: reconciled.verdict,
      human_review_required: reconciled.humanReviewRequired,
      uncertainty_flags: reconciled.humanReviewRequired
        ? [
            {
              sub_system: "VISION_SEQUENCE_AGENT",
              step_ref: "NOS_ELE_N0102_ST03",
              timestamp_ms: 22400,
              reason: "CAMERA_OCCLUSION_EXCEEDS_THRESHOLD",
              action_taken: "ROUTED_TO_FACULTY_QUEUE",
            },
          ]
        : [],
      breakdown: {
        safety_weight: 0.30,
        sequence_weight: 0.45,
        verbal_weight: 0.25,
        safety_score: reconciled.ppeScore,
        sequence_score: reconciled.proceduralScore,
        verbal_score: 88.0,
      },
      micro_evidence_timeline: reconciled.timeline,
      evaluator_observations: reconciled.notes,
      speed_score: reconciled.speedScore,
      integrity_score: reconciled.integrityScore,
      seven_day_remediation_plan: activeScorecard.seven_day_remediation_plan || GOLDEN_SAMPLE_SCORECARD.seven_day_remediation_plan,
      video_url: options.videoUrl || videoSource.url || undefined,
    };

    // Update active scorecard & video source
    setActiveScorecard(newReport);

    if (options.videoUrl || options.videoFile) {
      setVideoSourceState({
        url: options.videoUrl || videoSource.url,
        name: options.videoFileName || (options.videoFile ? options.videoFile.name : videoSource.name),
        file: options.videoFile !== undefined ? options.videoFile : videoSource.file,
      });
    }

    // Broadcast synchronization event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("skillbridge_scorecard_saved", { detail: newReport }));
    }

    // Update history
    setScorecardHistory((prev) => {
      const updated = [newReport, ...prev.filter((item) => item.report_id !== newReportId)].slice(0, 20);
      try {
        localStorage.setItem(SCORECARD_HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to persist history", e);
      }
      return updated;
    });

    return newReport;
  }, [activeScorecard, setActiveScorecard, videoSource]);

  /**
   * PDF Export Handler
   */
  const exportScorecardPdf = useCallback(async (scorecard?: MasterScorecardReport) => {
    setIsExportingPdf(true);
    try {
      const target = scorecard || activeScorecard;
      await generateScorecardPdf({
        report: target,
        videoUrl: videoSource.url || undefined,
        videoFileName: videoSource.name || undefined,
        candidateName: target.candidate_name,
        courseTitle: target.trade_info.trade_name,
      });
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsExportingPdf(false);
    }
  }, [activeScorecard, videoSource]);

  const loadGoldenRun = useCallback(() => {
    setActiveScorecard(GOLDEN_SAMPLE_SCORECARD);
  }, [setActiveScorecard]);

  const loadCertifiedRun = useCallback(() => {
    setActiveScorecard(CERTIFIED_SAMPLE_SCORECARD);
  }, [setActiveScorecard]);

  return (
    <ScorecardContext.Provider
      value={{
        uiLayoutPreference,
        setUiLayoutPreference,
        toggleUiLayoutPreference,
        activeScorecard,
        scorecardHistory,
        setActiveScorecard,
        videoSource,
        setVideoSource,
        modalSeekTimestampMs,
        setModalSeekTimestampMs,
        seekToTimestamp,
        isScorecardModalOpen,
        openScorecardModal,
        closeScorecardModal,
        isExportingPdf,
        exportScorecardPdf,
        saveTestAttempt,
        loadGoldenRun,
        loadCertifiedRun,
      }}
    >
      {children}
    </ScorecardContext.Provider>
  );
};

export const useScorecard = (): ScorecardContextType => {
  const context = useContext(ScorecardContext);
  if (!context) {
    throw new Error("useScorecard must be used within a ScorecardProvider");
  }
  return context;
};

// Also export as useScorecardStore for architectural parity
export const useScorecardStore = useScorecard;
