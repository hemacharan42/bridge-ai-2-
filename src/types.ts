export type ViolationSeverity = "INFO" | "WARNING" | "CRITICAL";

export type CharacterFocusState = "idle" | "username" | "password-hidden" | "password-visible";

export type StepStatus = "PASS" | "FAIL" | "UNCERTAIN_EVIDENCE";

export type EvidenceType = "CHECKPOINT" | "VIOLATION" | "FLAG";

export type SubSystemSource = "VISION_SAFETY_AGENT" | "VISION_SEQUENCE_AGENT" | "SPEECH_NLP_AGENT";

export type FinalVerdict = 
  | "CERTIFIED_COMPETENT" 
  | "CONDITIONAL_REMEDIATION_REQUIRED" 
  | "FAILED_UNSAFE_OPERATION" 
  | "FLAGGED_FOR_HUMAN_AUDIT";

export type UserRole = "student" | "employee" | "faculty";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isFirstTime: boolean;
  institution?: string;
  selectedCourseId?: string;
  enrolledCourses?: string[];
  completedCourses?: string[];
}

export interface Course {
  id: string;
  title: string;
  tradeCode: string;
  nsqfLevel: number;
  durationHours: number;
  description: string;
  iconName: string;
  skillsTaught: string[];
  totalModules: number;
  completedModules: number;
  currentTaskTitle: string;
  currentTaskId: string;
  industryPartners: string[];
  badgeTitle: string;
}

export interface PPEViolation {
  timestamp_ms: number;
  violation_code: string;
  severity: ViolationSeverity;
  label: string;
  description: string;
  bounding_box_norm?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1
  frame_index: number;
}

export interface SafetyAuditResult {
  ppe_score: number;
  is_compliant: boolean;
  violations: PPEViolation[];
  confidence_score: number;
}

export interface SequenceStepItem {
  step_order: number;
  nsqf_step_ref: string;
  name: string;
  status: StepStatus;
  timestamp_ms?: number;
  evidence_description: string;
  tool_used?: string;
  uncertainty_reason?: string;
}

export interface SequenceAuditResult {
  procedural_score: number;
  steps_total: number;
  steps_completed: number;
  steps: SequenceStepItem[];
}

export interface SpeechMetrics {
  technical_terminology_score: number;
  procedural_coherence_score: number;
  safety_precaution_score: number;
}

export interface SpeechAuditResult {
  session_id: string;
  transcript: string;
  duration_seconds: number;
  overall_verbal_score: number;
  metrics: SpeechMetrics;
  keywords_detected: string[];
  missing_critical_terms: string[];
  reasoning_critique: string;
}

export interface MicroEvidenceItem {
  timestamp_ms: number;
  type: EvidenceType;
  status: StepStatus;
  label: string;
  source: string;
  penalty_points: number;
  frame_index?: number;
  bounding_box_norm?: [number, number, number, number];
}

export interface UncertaintyFlag {
  sub_system: SubSystemSource;
  step_ref?: string;
  timestamp_ms?: number;
  reason: string;
  action_taken: string;
}

export interface RemediationTask {
  day: number;
  focus_area: string;
  drill_description: string;
  estimated_minutes: number;
  completed?: boolean;
}

export interface TradeInfo {
  trade_name: string;
  nsqf_level: number;
  competency_code: string;
  trade_code?: string;
}

export interface MasterScorecardReport {
  report_id: string;
  created_at: string;
  candidate_id: string;
  candidate_name?: string;
  trade_info: TradeInfo;
  composite_score: number;
  verdict: FinalVerdict;
  human_review_required: boolean;
  uncertainty_flags: UncertaintyFlag[];
  breakdown: {
    safety_weight?: number;
    sequence_weight?: number;
    verbal_weight?: number;
    safety_score?: number;
    sequence_score?: number;
    verbal_score?: number;
  };
  micro_evidence_timeline: MicroEvidenceItem[];
  seven_day_remediation_plan: RemediationTask[];
  video_url?: string;
  audio_url?: string;
  speech_audit?: SpeechAuditResult;
  safety_audit?: SafetyAuditResult;
  sequence_audit?: SequenceAuditResult;
  evaluator_observations?: string[];
  speed_score?: number;
  integrity_score?: number;
  verification_badge?: {
    badge_id: string;
    issue_date: string;
    verifying_authority: string;
    clip_sample_ms: [number, number];
  };
}

export interface CohortHeatmapData {
  competencyCode: string;
  title: string;
  nsqfLevel: number;
  failureRate: number;
  criticalSafetyRisk: boolean;
  traineesTested: number;
  topViolationReason: string;
}

export interface CandidateItem {
  candidate_id: string;
  name: string;
  avatar_url?: string;
  student_id?: string;
  trade: string;
  institution: string;
  composite_score: number;
  verdict: string;
  verified_badge: string;
  verified_clip_duration: string;
  hiring_status: string;
  safety_score: number;
  practical_speed_rank: string;
  project_upload_tier?: "Gold Tier (3+ Drills)" | "Silver Tier (2 Drills)" | "Bronze Tier (1 Drill)";
  nsqf_level?: number;
  viva_speech_score?: number;
  procedural_score?: number;
  uncertainty_rate?: number;
  video_drills_count?: number;
  key_skills?: string[];
  task_execution_time?: string;
}

export interface GamificationBadge {
  id: string;
  title: string;
  category: "SAFETY" | "PRECISION" | "DISCIPLINE" | "VERBAL" | "ENTERPRISE";
  description: string;
  icon: string;
  unlocked: boolean;
  progressPercent: number;
  earnedDate?: string;
  nsqfCode: string;
  digitalHash?: string;
  criteria: string;
}

export interface TrendDataPoint {
  week: string;
  date: string;
  compositeScore: number;
  safetyScore: number;
  proceduralScore: number;
  verbalScore: number;
  cohortAverage: number;
  topTenAverage: number;
  milestoneNote?: string;
}

export interface RemedialQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  practicalTip: string;
}

export interface FacultyQueueItem {
  id: string;
  candidate_id: string;
  candidate_name: string;
  trade_name: string;
  task: string;
  flag_type: string;
  reason: string;
  timestamp_ms: number;
  status: "PENDING_FACULTY_DECISION" | "RESOLVED_PASS" | "RESOLVED_FAIL" | "RESOLVED_RETAKE";
  submitted_at: string;
  system_confidence: string;
  faculty_note?: string;
  resolved_at?: string;
}

export interface BackendStats {
  status: string;
  storage_type: string;
  storage_path: string;
  file_size_bytes: number;
  last_updated: string;
  counts: {
    users: number;
    courses: number;
    scorecards: number;
    review_queue: number;
    candidates: number;
    shortlisted: number;
    audit_logs: number;
  };
}

// =========================================================================
// 4 DISTINCT SUB-AGENTS DEFINITIONS
// =========================================================================

// Agent 1: Live Video & Audio Proctoring Sub-Agent (Real-Time + Cloud Vision Layer)
export type ProctoringViolationType = 
  | "GAZE_DEVIATION" 
  | "SUSTAINED_LOOK_AWAY"
  | "MULTIPLE_FACES" 
  | "FACE_ABSENT" 
  | "NO_FACE"
  | "HEAD_TURNED_AWAY"
  | "TAB_SWITCH"
  | "WINDOW_UNFOCUSED"
  | "FULLSCREEN_EXITED"
  | "CLIPBOARD_ATTEMPT"
  | "AUDIO_ANOMALY" 
  | "AUDIO_DISRUPTION"
  | "AI_SCENE_FLAG"
  | "PHONE_DETECTED"
  | "NOTES_DETECTED"
  | "CAMERA_OBSTRUCTED";

export type ProctoringStatusType = 
  | "CLEAR" 
  | "DISTRACTION_DETECTED" 
  | "DISRUPTION_DETECTED"
  | "HIGH_RISK_VIOLATION";

export interface ProctoringViolation {
  type: ProctoringViolationType;
  confidence: number;
  details: string;
}

export interface ProctoringEvaluationResult {
  frame_timestamp_ms: number;
  proctoring_status: ProctoringStatusType;
  violations: ProctoringViolation[];
  issue_warning: boolean;
  warnings_issued: number;
  max_warnings: number;
  trigger_mentor_alert: boolean;
  mentor_notified: boolean;
  reason?: string;
}

export interface GeminiSceneVerdict {
  person_count: number;
  phone_or_device_visible: boolean;
  notes_or_paper_visible: boolean;
  candidate_looking_at_screen: boolean | "unclear";
  camera_obstructed: boolean;
  confidence: number;
  notes: string;
}

export interface ProctoringViolationEvent {
  id: string;
  session_id: string;
  type: ProctoringViolationType;
  ts: number;
  timestamp_formatted: string;
  source: "local" | "gemini";
  meta: Record<string, any>;
  reviewer_status: "PENDING" | "ACCEPTED" | "DISMISSED" | "ESCALATED";
  snapshot_url?: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  title: string;
  description: string;
}

export interface ProctoringSession {
  id: string;
  candidate_id: string;
  candidate_name: string;
  exam_id: string;
  exam_title: string;
  started_at: string;
  ended_at?: string;
  status: "SETUP" | "CALIBRATION" | "IN_PROGRESS" | "COMPLETED" | "FLAGGED_REVIEW";
  trust_score: number;
  soft_warnings: number;
  max_warnings: number;
  total_violations: number;
  video_url?: string;
  calibrated: boolean;
  lighting_score: number;
}

// Agent 2: Multimodal Barcode Verification Agent
export type BarcodeMatchStatus = 
  | "MATCHED" 
  | "MISMATCH" 
  | "UNCERTAIN_EVIDENCE";

export interface BarcodeVerificationResult {
  barcode_found: boolean;
  detected_code: string | null;
  detected_codes?: string[];
  expected_code: string;
  match_status: BarcodeMatchStatus;
  timestamp_sec: number;
  confidence_score: number;
  flag_mentor: boolean;
  summary: string;
  message?: string;
}

// Agent 3: Speech Reasoning & Viva-Voce Agent (defined above as SpeechAuditResult)
// Agent 4: Lead Industrial Safety & Procedural Inspection Agent (defined above as MasterScorecardReport)


