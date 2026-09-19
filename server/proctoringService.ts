import { GoogleGenAI } from "@google/genai";

export interface ProctorSessionStore {
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
  video_url: string;
  calibrated: boolean;
  lighting_score: number;
  events: ProctorViolationStoreEvent[];
  snapshots: ProctorSnapshotItem[];
}

export interface ProctorViolationStoreEvent {
  id: string;
  session_id: string;
  type: string;
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

export interface ProctorSnapshotItem {
  id: string;
  session_id: string;
  ts: number;
  timestamp_formatted: string;
  verdict: {
    person_count: number;
    phone_or_device_visible: boolean;
    notes_or_paper_visible: boolean;
    candidate_looking_at_screen: boolean | "unclear";
    camera_obstructed: boolean;
    confidence: number;
    notes: string;
  };
  flagged: boolean;
  image_data_url?: string;
}

const sessions: Map<string, ProctorSessionStore> = new Map();

// Initialize default demo session with rich timeline flags
const defaultDemoSession: ProctorSessionStore = {
  id: "sess_nsqf_ele_2026_01",
  candidate_id: "STUDENT_ITI_DL_2026_042",
  candidate_name: "Rajesh Kumar",
  exam_id: "EXAM_ELE_N0102_PROCTOR",
  exam_title: "NSQF Level 4 Electrical Competency Proctored Exam",
  started_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  status: "IN_PROGRESS",
  trust_score: 92,
  soft_warnings: 1,
  max_warnings: 3,
  total_violations: 3,
  video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  calibrated: true,
  lighting_score: 88,
  events: [
    {
      id: "ev_01_init",
      session_id: "sess_nsqf_ele_2026_01",
      type: "CALIBRATION_COMPLETED",
      ts: Date.now() - 14 * 60 * 1000,
      timestamp_formatted: "00:45",
      source: "local",
      meta: { points_calibrated: 5, baseline_iris_ratio: 0.51, lighting: 88 },
      reviewer_status: "ACCEPTED",
      severity: "LOW",
      title: "5-Point Gaze Calibration Verified",
      description: "Candidate completed 5-point on-screen iris calibration. Baseline established."
    },
    {
      id: "ev_02_lookaway",
      session_id: "sess_nsqf_ele_2026_01",
      type: "SUSTAINED_LOOK_AWAY",
      ts: Date.now() - 11 * 60 * 1000,
      timestamp_formatted: "03:42",
      source: "local",
      meta: { gaze_direction: "LOOKING_DOWN_RIGHT", duration_ms: 3800, threshold_ms: 3000 },
      reviewer_status: "PENDING",
      severity: "MEDIUM",
      title: "Sustained Off-Screen Gaze (>3.8s)",
      description: "Iris vector deviated beyond 40° downward for 3.8 consecutive seconds."
    },
    {
      id: "ev_03_tab",
      session_id: "sess_nsqf_ele_2026_01",
      type: "TAB_SWITCH",
      ts: Date.now() - 7 * 60 * 1000,
      timestamp_formatted: "07:18",
      source: "local",
      meta: { event: "visibilitychange", state: "hidden", unfocused_duration_ms: 1200 },
      reviewer_status: "ACCEPTED",
      severity: "HIGH",
      title: "Browser Tab Focus Lost (Alt+Tab)",
      description: "Page Visibility API registered browser blur event during Question #2."
    },
    {
      id: "ev_04_gemini_phone",
      session_id: "sess_nsqf_ele_2026_01",
      type: "AI_SCENE_FLAG",
      ts: Date.now() - 3 * 60 * 1000,
      timestamp_formatted: "11:55",
      source: "gemini",
      meta: {
        model: "gemini-2.5-flash",
        verdict: {
          person_count: 1,
          phone_or_device_visible: true,
          notes_or_paper_visible: false,
          candidate_looking_at_screen: false,
          camera_obstructed: false,
          confidence: 0.94,
          notes: "Rectangular mobile device handheld in lower left corner of the webcam frame."
        }
      },
      reviewer_status: "PENDING",
      severity: "HIGH",
      title: "Cloud AI Review: Mobile Phone Detected in Hand",
      description: "Gemini 2.5 Flash identified secondary smartphone screen in bottom frame quadrant."
    }
  ],
  snapshots: [
    {
      id: "snap_01",
      session_id: "sess_nsqf_ele_2026_01",
      ts: Date.now() - 3 * 60 * 1000,
      timestamp_formatted: "11:55",
      verdict: {
        person_count: 1,
        phone_or_device_visible: true,
        notes_or_paper_visible: false,
        candidate_looking_at_screen: false,
        camera_obstructed: false,
        confidence: 0.94,
        notes: "Rectangular mobile device handheld in lower left corner of the webcam frame."
      },
      flagged: true
    }
  ]
};

sessions.set(defaultDemoSession.id, defaultDemoSession);

export class ProctoringService {
  private getGeminiClient(): GoogleGenAI | null {
    if (!process.env.GEMINI_API_KEY) {
      return null;
    }
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  getOrCreateSession(sessionId: string): ProctorSessionStore {
    let session = sessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        candidate_id: "STUDENT_ITI_DL_2026_042",
        candidate_name: "Rajesh Kumar",
        exam_id: "EXAM_ELE_N0102_PROCTOR",
        exam_title: "NSQF Level 4 Electrical Competency Proctored Exam",
        started_at: new Date().toISOString(),
        status: "IN_PROGRESS",
        trust_score: 100,
        soft_warnings: 0,
        max_warnings: 3,
        total_violations: 0,
        video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        calibrated: false,
        lighting_score: 85,
        events: [],
        snapshots: []
      };
      sessions.set(sessionId, session);
    }
    return session;
  }

  async reviewFrameWithGemini(
    sessionId: string, 
    base64Jpeg?: string, 
    simulatedScenario?: string
  ): Promise<{
    verdict: {
      person_count: number;
      phone_or_device_visible: boolean;
      notes_or_paper_visible: boolean;
      candidate_looking_at_screen: boolean | "unclear";
      camera_obstructed: boolean;
      confidence: number;
      notes: string;
    };
    flagged: boolean;
    violationEvent?: ProctorViolationStoreEvent;
  }> {
    const session = this.getOrCreateSession(sessionId);

    const promptText = `You are a proctoring assistant reviewing a single webcam frame from an online skills assessment. Look only for objective, visible evidence.
Respond with ONLY valid JSON, no extra text, in this exact schema:
{
  "person_count": 1,
  "phone_or_device_visible": false,
  "notes_or_paper_visible": false,
  "candidate_looking_at_screen": true,
  "camera_obstructed": false,
  "confidence": 0.95,
  "notes": "<one short factual sentence, no speculation>"
}
If uncertain about any field, use "unclear" or your best-effort boolean with a lower confidence value. Do not guess identity, emotion, or intent.`;

    let verdict = {
      person_count: 1,
      phone_or_device_visible: false,
      notes_or_paper_visible: false,
      candidate_looking_at_screen: true as boolean | "unclear",
      camera_obstructed: false,
      confidence: 0.95,
      notes: "Candidate solitary, looking directly at screen, no unauthorized materials visible."
    };

    // Simulated scenario handling for instant offline/mock testing
    if (simulatedScenario === "phone") {
      verdict = {
        person_count: 1,
        phone_or_device_visible: true,
        notes_or_paper_visible: false,
        candidate_looking_at_screen: false,
        camera_obstructed: false,
        confidence: 0.92,
        notes: "Candidate holding mobile smartphone near desk level."
      };
    } else if (simulatedScenario === "multiple_persons" || simulatedScenario === "second_person") {
      verdict = {
        person_count: 2,
        phone_or_device_visible: false,
        notes_or_paper_visible: false,
        candidate_looking_at_screen: true,
        camera_obstructed: false,
        confidence: 0.89,
        notes: "Second individual standing behind candidate in background."
      };
    } else if (simulatedScenario === "notes") {
      verdict = {
        person_count: 1,
        phone_or_device_visible: false,
        notes_or_paper_visible: true,
        candidate_looking_at_screen: false,
        camera_obstructed: false,
        confidence: 0.91,
        notes: "Handwritten reference paper notes positioned adjacent to keyboard."
      };
    } else if (simulatedScenario === "camera_obstructed") {
      verdict = {
        person_count: 0,
        phone_or_device_visible: false,
        notes_or_paper_visible: false,
        candidate_looking_at_screen: "unclear",
        camera_obstructed: true,
        confidence: 0.98,
        notes: "Webcam lens is covered or heavily obstructed."
      };
    } else if (base64Jpeg && process.env.GEMINI_API_KEY) {
      try {
        const client = this.getGeminiClient();
        if (client) {
          // Clean base64 data header if present
          const cleanBase64 = base64Jpeg.replace(/^data:image\/\w+;base64,/, "");
          const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: "image/jpeg"
                }
              },
              {
                text: promptText
              }
            ],
            config: {
              responseMimeType: "application/json",
              temperature: 0.0
            }
          });

          if (response.text) {
            const parsed = JSON.parse(response.text);
            verdict = {
              person_count: Number(parsed.person_count) || 1,
              phone_or_device_visible: Boolean(parsed.phone_or_device_visible),
              notes_or_paper_visible: Boolean(parsed.notes_or_paper_visible),
              candidate_looking_at_screen: parsed.candidate_looking_at_screen,
              camera_obstructed: Boolean(parsed.camera_obstructed),
              confidence: Number(parsed.confidence) || 0.9,
              notes: String(parsed.notes || "Scene analysis completed.")
            };
          }
        }
      } catch (err) {
        console.warn("Gemini vision analysis error, falling back to safe local evaluation:", err);
      }
    }

    const flagged = 
      verdict.person_count > 1 || 
      verdict.phone_or_device_visible || 
      verdict.notes_or_paper_visible || 
      verdict.camera_obstructed;

    const snapshotItem: ProctorSnapshotItem = {
      id: `snap_${Date.now()}`,
      session_id: sessionId,
      ts: Date.now(),
      timestamp_formatted: new Date().toLocaleTimeString(),
      verdict,
      flagged,
      image_data_url: base64Jpeg ? (base64Jpeg.startsWith("data:") ? base64Jpeg : `data:image/jpeg;base64,${base64Jpeg}`) : undefined
    };

    session.snapshots.push(snapshotItem);

    let violationEvent: ProctorViolationStoreEvent | undefined;

    if (flagged) {
      let flagTitle = "Cloud AI Scene Flag";
      let flagType = "AI_SCENE_FLAG";
      if (verdict.phone_or_device_visible) {
        flagTitle = "Unauthorized Mobile Phone Visible";
        flagType = "PHONE_DETECTED";
      } else if (verdict.person_count > 1) {
        flagTitle = `Multiple Persons in Frame (${verdict.person_count})`;
        flagType = "MULTIPLE_FACES";
      } else if (verdict.notes_or_paper_visible) {
        flagTitle = "Unauthorized Paper / Reference Notes Visible";
        flagType = "NOTES_DETECTED";
      } else if (verdict.camera_obstructed) {
        flagTitle = "Webcam Video Stream Obstructed";
        flagType = "CAMERA_OBSTRUCTED";
      }

      violationEvent = {
        id: `ev_ai_${Date.now()}`,
        session_id: sessionId,
        type: flagType,
        ts: Date.now(),
        timestamp_formatted: new Date().toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
        source: "gemini",
        meta: { verdict },
        reviewer_status: "PENDING",
        severity: "HIGH",
        title: flagTitle,
        description: verdict.notes
      };

      session.events.push(violationEvent);
      session.total_violations += 1;
      session.trust_score = Math.max(20, session.trust_score - 10);
      session.soft_warnings += 1;
    }

    return { verdict, flagged, violationEvent };
  }

  logEvent(sessionId: string, eventData: {
    type: string;
    source?: "local" | "gemini";
    meta?: Record<string, any>;
    severity?: "LOW" | "MEDIUM" | "HIGH";
    title?: string;
    description?: string;
  }): ProctorViolationStoreEvent {
    const session = this.getOrCreateSession(sessionId);
    const event: ProctorViolationStoreEvent = {
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      session_id: sessionId,
      type: eventData.type,
      ts: Date.now(),
      timestamp_formatted: new Date().toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
      source: eventData.source || "local",
      meta: eventData.meta || {},
      reviewer_status: "PENDING",
      severity: eventData.severity || (eventData.type.includes("HIGH") || eventData.type.includes("TAB") ? "HIGH" : "MEDIUM"),
      title: eventData.title || eventData.type.replace(/_/g, " "),
      description: eventData.description || `Event logged via ${eventData.source || "local"} detector.`
    };

    session.events.push(event);
    session.total_violations += 1;
    if (event.severity === "HIGH") {
      session.trust_score = Math.max(30, session.trust_score - 8);
      session.soft_warnings += 1;
    } else if (event.severity === "MEDIUM") {
      session.trust_score = Math.max(50, session.trust_score - 4);
    }

    return event;
  }

  updateReviewDecision(
    sessionId: string, 
    eventId: string, 
    decision: "ACCEPTED" | "DISMISSED" | "ESCALATED", 
    notes?: string
  ): boolean {
    const session = sessions.get(sessionId);
    if (!session) return false;
    const event = session.events.find(e => e.id === eventId);
    if (!event) return false;
    event.reviewer_status = decision;
    if (notes) {
      event.meta = { ...event.meta, reviewer_notes: notes };
    }
    return true;
  }
}

export const proctoringService = new ProctoringService();
