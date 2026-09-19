import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { storage } from "./server/storage";
import { 
  proctoringEngine, 
  barcodeVerifier, 
  speechEngine, 
  dualModalEngine 
} from "./server/subagents";
import { proctoringService } from "./server/proctoringService";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Pre-computed Golden Fallback payload from Section 5.2 of PRD
const GOLDEN_SAMPLE_SCORECARD = {
  report_id: "rep_golden_sample_01",
  created_at: new Date().toISOString(),
  candidate_id: "STUDENT_ITI_DL_2026_042",
  candidate_name: "Rajesh Kumar",
  trade_info: {
    trade_name: "Electrician",
    nsqf_level: 4,
    competency_code: "ELE/N0102",
    trade_code: "ELE_L4_DOMESTIC"
  },
  composite_score: 76.5,
  verdict: "CONDITIONAL_REMEDIATION_REQUIRED",
  human_review_required: true,
  uncertainty_flags: [
    {
      sub_system: "VISION_SEQUENCE_AGENT",
      step_ref: "NOS_ELE_N0102_ST03",
      timestamp_ms: 22400,
      reason: "CAMERA_OCCLUSION_EXCEEDS_THRESHOLD",
      action_taken: "ROUTED_TO_FACULTY_QUEUE"
    }
  ],
  breakdown: {
    safety_weight: 0.30,
    sequence_weight: 0.45,
    verbal_weight: 0.25,
    safety_score: 65.0,
    sequence_score: 82.0,
    verbal_score: 88.0
  },
  micro_evidence_timeline: [
    {
      timestamp_ms: 4600,
      type: "CHECKPOINT",
      status: "PASS",
      label: "Mains Isolation Verified (0 V across L-N)",
      source: "VIDEO & AUDIO",
      penalty_points: 0.0,
      frame_index: 7
    },
    {
      timestamp_ms: 11800,
      type: "CHECKPOINT",
      status: "PASS",
      label: "Wire Stripped Cleanly (10mm, 0 strand nicks)",
      source: "VIDEO",
      penalty_points: 0.0,
      frame_index: 18
    },
    {
      timestamp_ms: 14200,
      type: "VIOLATION",
      status: "FAIL",
      label: "Missing 1000V Insulated Safety Gloves",
      source: "VISION_SAFETY_AGENT",
      penalty_points: 25.0,
      frame_index: 21,
      bounding_box_norm: [0.42, 0.58, 0.71, 0.84]
    },
    {
      timestamp_ms: 22400,
      type: "FLAG",
      status: "UNCERTAIN_EVIDENCE",
      label: "Terminal Screw Torque Occluded (>40% by body)",
      source: "VISION_SEQUENCE_AGENT",
      penalty_points: 0.0,
      frame_index: 34
    },
    {
      timestamp_ms: 31200,
      type: "CHECKPOINT",
      status: "PASS",
      label: "Mechanical Pull-Test Verified (15N tug confirmed)",
      source: "VIDEO",
      penalty_points: 0.0,
      frame_index: 47
    }
  ],
  seven_day_remediation_plan: [
    {
      day: 1,
      focus_area: "PPE Safety Compliance",
      drill_description: "Perform 10 verified glove donning & dielectric seal inspection runs prior to touching terminal screws.",
      estimated_minutes: 20,
      completed: true
    },
    {
      day: 2,
      focus_area: "Camera Positioning & Visibility",
      drill_description: "Set workshop phone tripod at 45° elevation angle to eliminate torso occlusion during screw driver torque rotation.",
      estimated_minutes: 25,
      completed: false
    },
    {
      day: 3,
      focus_area: "De-Energization Articulation",
      drill_description: "Verbalize exact multimeter reading sequence: 'Testing L to N, L to E, N to E' before physical casing detachment.",
      estimated_minutes: 15,
      completed: false
    },
    {
      day: 4,
      focus_area: "Conductor Gauge Selection",
      drill_description: "Practice 2.5 sq.mm copper wire stripping with automatic wire stripper set at exactly 11mm strip length.",
      estimated_minutes: 30,
      completed: false
    },
    {
      day: 5,
      focus_area: "Torque Calibration Check",
      drill_description: "Use calibrated insulated torque screwdriver set to 2.2 Nm on miniature circuit breaker cage terminals.",
      estimated_minutes: 25,
      completed: false
    },
    {
      day: 6,
      focus_area: "Live-Simulation Mock Assessment",
      drill_description: "Record 45-second uncut trade task with both dual-modal audio explanation and unobstructed camera capture.",
      estimated_minutes: 35,
      completed: false
    },
    {
      day: 7,
      focus_area: "Official NSQF Level 4 Re-Certification",
      drill_description: "Submit live assessment clip through Bridge verification pipeline to unlock employers' verified badge.",
      estimated_minutes: 20,
      completed: false
    }
  ],
  speech_audit: {
    session_id: "aud_9f8d3c1a-6b2e-4f32-8a19-3f6284f69911",
    transcript: "Before opening the distribution panel, I isolated the 32-amp main isolator switch and verified zero voltage across phase and neutral terminals with my digital multimeter.",
    duration_seconds: 18.4,
    overall_verbal_score: 88.0,
    metrics: {
      technical_terminology_score: 92.0,
      procedural_coherence_score: 85.0,
      safety_precaution_score: 87.0
    },
    keywords_detected: ["isolated", "32-amp main isolator switch", "zero voltage", "phase and neutral"],
    missing_critical_terms: ["earthing continuity"],
    reasoning_critique: "Candidate correctly articulated de-energization protocols but omitted confirmation of ground bonding verification."
  },
  safety_audit: {
    ppe_score: 65.0,
    is_compliant: false,
    confidence_score: 0.94,
    violations: [
      {
        timestamp_ms: 14200,
        violation_code: "PPE_GLOVES_ABSENT",
        severity: "CRITICAL",
        label: "Missing 1000V Insulated Safety Gloves",
        description: "Candidate handling live-side conductors without dielectric insulated gloves.",
        bounding_box_norm: [0.42, 0.58, 0.71, 0.84],
        frame_index: 21
      }
    ]
  },
  sequence_audit: {
    procedural_score: 82.0,
    steps_total: 4,
    steps_completed: 3,
    steps: [
      {
        step_order: 1,
        nsqf_step_ref: "NOS_ELE_N0102_ST01",
        name: "De-energization & Isolation",
        status: "PASS",
        timestamp_ms: 4600
      },
      {
        step_order: 2,
        nsqf_step_ref: "NOS_ELE_N0102_ST02",
        name: "Conductor Stripping",
        status: "PASS",
        timestamp_ms: 11800
      },
      {
        step_order: 3,
        nsqf_step_ref: "NOS_ELE_N0102_ST03",
        name: "Terminal Insertion & Torque",
        status: "UNCERTAIN_EVIDENCE",
        timestamp_ms: 22400,
        uncertainty_reason: "Camera occlusion >40% by candidate body"
      },
      {
        step_order: 4,
        nsqf_step_ref: "NOS_ELE_N0102_ST04",
        name: "Pull Test Verification",
        status: "PASS",
        timestamp_ms: 31200
      }
    ]
  }
};

// API Routes
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "Bridge Dual-Evidence Verification Engine",
    version: "1.5.0-nsqf",
    gemini_configured: !!process.env.GEMINI_API_KEY,
    storage: storage.getStats()
  });
});

// =========================================================================
// BACKEND STORED DATA APIS
// Persistent file-backed storage for users, courses, scorecards, queue & candidates
// =========================================================================

// Full bundle synchronization for instant hydration
app.get("/api/data", (req: Request, res: Response) => {
  res.json(storage.getFullStore());
});

app.get("/api/storage/bundle", (req: Request, res: Response) => {
  res.json(storage.getFullStore());
});

app.get("/api/storage/stats", (req: Request, res: Response) => {
  res.json(storage.getStats());
});

app.post("/api/storage/reset", (req: Request, res: Response) => {
  const store = storage.resetDefaults();
  res.json({ message: "Reset to default demo data successful", store });
});

// Users
app.get("/api/users", (req: Request, res: Response) => {
  res.json(storage.getUsers());
});

app.get("/api/users/:id", (req: Request, res: Response) => {
  const user = storage.getUser(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

app.post("/api/users", (req: Request, res: Response) => {
  const saved = storage.saveUser(req.body);
  res.json(saved);
});

app.post("/api/users/active", (req: Request, res: Response) => {
  const { userId } = req.body;
  if (userId) storage.setActiveUser(userId);
  res.json({ success: true, activeUserId: userId });
});

// Courses
app.get("/api/courses", (req: Request, res: Response) => {
  res.json(storage.getCourses());
});

app.put("/api/courses/:id", (req: Request, res: Response) => {
  const updated = storage.updateCourse(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Course not found" });
  res.json(updated);
});

app.post("/api/courses/:id/progress", (req: Request, res: Response) => {
  const { completedModules } = req.body;
  const updated = storage.updateCourseCompletedModules(req.params.id, Number(completedModules) || 0);
  if (!updated) return res.status(404).json({ error: "Course not found" });
  res.json(updated);
});

// Scorecards
app.get("/api/scorecards", (req: Request, res: Response) => {
  res.json(storage.getScorecards());
});

app.get("/api/scorecards/:id", (req: Request, res: Response) => {
  const report = storage.getScorecard(req.params.id);
  if (!report) return res.status(404).json({ error: "Scorecard not found" });
  res.json(report);
});

app.post("/api/scorecards", (req: Request, res: Response) => {
  const saved = storage.saveScorecard(req.body);
  res.json(saved);
});

app.put("/api/scorecards/:id/remediation", (req: Request, res: Response) => {
  const { day, completed } = req.body;
  const updated = storage.updateRemediation(req.params.id, Number(day), completed);
  if (!updated) return res.status(404).json({ error: "Scorecard not found" });
  res.json(updated);
});

// Faculty Review Queue
app.get("/api/queue", (req: Request, res: Response) => {
  res.json(storage.getReviewQueue());
});

app.put("/api/queue/:id/resolve", (req: Request, res: Response) => {
  const { decision, note } = req.body;
  const resolved = storage.resolveQueueItem(req.params.id, decision, note);
  if (!resolved) return res.status(404).json({ error: "Queue item not found" });
  res.json(resolved);
});

// Recruiter Candidates & Shortlist
app.get("/api/candidates", (req: Request, res: Response) => {
  res.json({
    candidates: storage.getCandidates(),
    shortlistedCandidateIds: storage.getShortlistedIds()
  });
});

app.post("/api/candidates/:id/shortlist", (req: Request, res: Response) => {
  const updated = storage.toggleShortlist(req.params.id);
  res.json({ shortlistedCandidateIds: updated });
});

// Cohort Heatmap
app.get("/api/heatmap", (req: Request, res: Response) => {
  res.json(storage.getCohortHeatmap());
});

app.get("/api/v1/golden-scorecard", (req: Request, res: Response) => {
  const golden = storage.getScorecard("rep_golden_sample_01") || GOLDEN_SAMPLE_SCORECARD;
  res.json(golden);
});

// Audio assessment API as defined in PRD Section 2.2
// =========================================================================
// 4 SUB-AGENTS SPECIALIZED ENDPOINTS
// =========================================================================

// Manifest Endpoint: Differentiate all 4 sub-agents
app.get("/api/v1/subagents/manifest", (req: Request, res: Response) => {
  res.json({
    platform: "Bridge NSQF Multi-Agent Assessment Engine",
    subagents: [
      {
        id: "agent_01_proctoring",
        name: "Live Video & Audio Proctoring Sub-Agent",
        role: "Automated real-time proctoring agent evaluating candidate video streams during an MCQ/theory examination.",
        endpoint: "/api/v1/proctor/stream",
        parameters: ["Face Presence", "Iris/Gaze Tracking (>15° off-axis)", "Audio/Speech Whispering Disruption"],
        rules: "No biometric template retention; 1.0-1.5 FPS decimation; max 3 warnings before mentor alert webhook.",
        status: proctoringEngine.getStatus()
      },
      {
        id: "agent_02_barcode_verifier",
        name: "Multimodal Barcode Verification Agent",
        role: "Automated computer-vision inspector for video file submissions.",
        endpoint: "/api/v1/verify/barcode",
        parameters: ["Barcode Presence", "Code Matching (QR, UPC, Code 128, Data Matrix)", "Occlusion Detection (>30%)", "Video Quality Degradation"],
        rules: "Mismatch or degraded/uncertain evidence triggers mentor alert webhook and UNCERTAIN_EVIDENCE state.",
        status: { active: true, format_support: ["QR", "Code 128", "UPC-A", "Data Matrix"] }
      },
      {
        id: "agent_03_speech_reasoning",
        name: "Speech Reasoning & Viva-Voce Assessment Agent",
        role: "Lead Speech Evaluator analyzing de-energization reasoning, multimeter diagnostic steps, and safety precautions.",
        endpoint: "/api/v1/assess/audio",
        parameters: ["Technical Terminology", "Procedural Coherence", "Safety Precautions", "Keyword Detection"],
        rules: "Evaluates spoken trade rationale against NSQF Level 4/5 competency guidelines."
      },
      {
        id: "agent_04_dual_modal_inspection",
        name: "Lead Industrial Safety & Procedural Inspection Agent",
        role: "Computer-Vision & Multimodal Safety/Sequence Inspector analyzing unedited 30fps evidence videos.",
        endpoint: "/api/v1/dual-modal",
        parameters: ["1000V Dielectric Gloves", "Sequence Ordering", "Pull-Test (15N)", "Camera Torso Occlusion (>40%)"],
        rules: "8.0s circuit breaker; occlusion >40% routes to Faculty Review Queue."
      }
    ]
  });
});

// Sub-Agent 1: Live Video & Audio Proctoring Stream Evaluation
app.post("/api/v1/proctor/stream", async (req: Request, res: Response) => {
  try {
    const result = await proctoringEngine.evaluateProctoringEvent(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.post("/api/v1/proctor/reset", (req: Request, res: Response) => {
  res.json(proctoringEngine.resetWarnings());
});

app.get("/api/v1/proctor/status", (req: Request, res: Response) => {
  res.json(proctoringEngine.getStatus());
});

// =========================================================================
// PROCTORING ASSESSMENT LAYER (Real-Time + Google AI Studio Gemini Vision)
// Implements Step 6 & 7: Backend event & media ingestion and periodic snapshot review
// =========================================================================

// POST /api/sessions/:sessionId/snapshot - Periodic JPEG frame analysis via Gemini 2.5 Flash
app.post("/api/sessions/:sessionId/snapshot", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { file, image_base64, scenario } = req.body;
    const imagePayload = image_base64 || file;

    const result = await proctoringService.reviewFrameWithGemini(sessionId, imagePayload, scenario);
    res.json({
      ok: true,
      sessionId,
      verdict: result.verdict,
      flagged: result.flagged,
      violationEvent: result.violationEvent
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Direct scene check helper endpoint
app.post("/api/proctor/scene-check", async (req: Request, res: Response) => {
  try {
    const { sessionId = "sess_current", image_base64, scenario } = req.body;
    const result = await proctoringService.reviewFrameWithGemini(sessionId, image_base64, scenario);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// POST /api/sessions/:sessionId/events - Log local/on-device debounced violation event
app.post("/api/sessions/:sessionId/events", (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const event = proctoringService.logEvent(sessionId, req.body);
    res.json({ ok: true, event });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// GET /api/sessions/:sessionId/events - Retrieve all timeline violation events
app.get("/api/sessions/:sessionId/events", (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = proctoringService.getOrCreateSession(sessionId);
  res.json({ sessionId, events: session.events });
});

// GET /api/sessions/:sessionId - Retrieve full session state, trust score & snapshots
app.get("/api/sessions/:sessionId", (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = proctoringService.getOrCreateSession(sessionId);
  res.json(session);
});

// POST /api/sessions/:sessionId/review - Human-in-the-loop reviewer decision (Accept/Dismiss/Escalate)
app.post("/api/sessions/:sessionId/review", (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { eventId, decision, notes } = req.body;
  const success = proctoringService.updateReviewDecision(sessionId, eventId, decision, notes);
  if (!success) {
    return res.status(404).json({ error: "Session or violation event not found" });
  }
  res.json({ ok: true, sessionId, eventId, decision });
});

// Sub-Agent 2: Multimodal Barcode Verification
app.post("/api/v1/verify/barcode", async (req: Request, res: Response) => {
  try {
    const result = await barcodeVerifier.verifyBarcodeVideo(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get("/api/v1/verify/barcode/status", (req: Request, res: Response) => {
  res.json({
    active: true,
    agent: "MULTIMODAL_BARCODE_VERIFICATION_V1",
    supported_symbologies: ["QR_CODE", "CODE_128", "EAN_13", "UPC_A", "DATA_MATRIX"],
    decimation_rate: "1.5 FPS keyframes",
    occlusion_tolerance_percent: 30
  });
});

// Sub-Agent 3: Speech Reasoning & Viva Assessment Endpoint
app.post("/api/v1/assess/audio", async (req: Request, res: Response) => {
  try {
    const { transcript, trade_code, task_id } = req.body;
    const result = await speechEngine.evaluateSpeech({ transcript, trade_code, task_id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Dual-Modal Multi-Agent Assessment Endpoint with 8.0s Circuit Breaker (PRD Section 4.2)
app.post("/api/v1/dual-modal", async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { simulate_occlusion, candidate_name, trade_code } = req.body;

  // Circuit breaker: ensure response in under 7.5 seconds
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("API timeout threshold (7.5s) exceeded")), 7500)
  );

  const evaluationPromise = (async () => {
    const client = getGeminiClient();
    if (client && !simulate_occlusion) {
      try {
        const prompt = `You are the Lead Industrial Safety & Procedural Inspection Agent for NSQF Trade Assessments (Electrician Level 4/5).
Evaluate this assessment submission for candidate "${candidate_name || "Rajesh Kumar"}" on trade "${trade_code || "ELE_L4_DOMESTIC"}".
Output strictly valid JSON matching the MasterScorecardReport schema with:
- composite_score (0-100)
- verdict: "CERTIFIED_COMPETENT" | "CONDITIONAL_REMEDIATION_REQUIRED" | "FAILED_UNSAFE_OPERATION" | "FLAGGED_FOR_HUMAN_AUDIT"
- human_review_required: boolean
- uncertainty_flags: array of { sub_system, step_ref, timestamp_ms, reason, action_taken }
- breakdown: weights and sub-scores
- micro_evidence_timeline: array of { timestamp_ms, type, status, label, source, penalty_points }
- seven_day_remediation_plan: array of { day, focus_area, drill_description, estimated_minutes }`;

        const response = await client.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return {
            report_id: `rep_${Date.now()}`,
            created_at: new Date().toISOString(),
            candidate_id: "STUDENT_ITI_DL_2026_042",
            candidate_name: candidate_name || "Rajesh Kumar",
            trade_info: GOLDEN_SAMPLE_SCORECARD.trade_info,
            ...parsed
          };
        }
      } catch (err) {
        console.warn("AI generation error, engaging golden fallback:", err);
      }
    }

    // Return Golden Sample Scorecard with simulated parameters if requested
    const copy = JSON.parse(JSON.stringify(GOLDEN_SAMPLE_SCORECARD));
    copy.report_id = `rep_${Date.now()}`;
    copy.created_at = new Date().toISOString();
    if (candidate_name) copy.candidate_name = candidate_name;

    if (simulate_occlusion) {
      copy.verdict = "FLAGGED_FOR_HUMAN_AUDIT";
      copy.human_review_required = true;
      copy.uncertainty_flags = [
        {
          sub_system: "VISION_SEQUENCE_AGENT",
          step_ref: "NOS_ELE_N0102_ST03",
          timestamp_ms: 22400,
          reason: "Camera occlusion >40% by candidate torso during torque check",
          action_taken: "ROUTED_TO_FACULTY_QUEUE"
        }
      ];
    }
    return copy;
  })();

  try {
    const result = await Promise.race([evaluationPromise, timeoutPromise]);
    const saved = storage.saveScorecard(result as any);
    res.json(saved);
  } catch (err) {
    console.warn(`Live API threshold exceeded or error: ${err}. Engaging Golden Fallback.`);
    const fallbackCopy = JSON.parse(JSON.stringify(GOLDEN_SAMPLE_SCORECARD));
    fallbackCopy.report_id = `rep_${Date.now()}`;
    fallbackCopy.created_at = new Date().toISOString();
    if (candidate_name) fallbackCopy.candidate_name = candidate_name;
    const savedFallback = storage.saveScorecard(fallbackCopy);
    res.json(savedFallback);
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Bridge] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
