import { 
  Course, 
  MasterScorecardReport, 
  CohortHeatmapData, 
  UserProfile, 
  CandidateItem, 
  GamificationBadge, 
  TrendDataPoint, 
  RemedialQuizQuestion 
} from "../types";

export const DEFAULT_STUDENT_USER: UserProfile = {
  id: "STUDENT_ITI_DL_2026_042",
  name: "Rajesh Kumar",
  email: "rajesh.kumar@iti-delhi.edu.in",
  role: "student",
  isFirstTime: false,
  institution: "Government Industrial Training Institute (ITI), Pusa, Delhi",
  selectedCourseId: "course_electrician_nsqf4",
  enrolledCourses: ["course_electrician_nsqf4", "course_solar_pv"],
  completedCourses: [],
};

export const DEFAULT_EMPLOYER_USER: UserProfile = {
  id: "REC_SCHNEIDER_092",
  name: "Vikram Mehta",
  email: "vikram.mehta@schneider-vendor.in",
  role: "employee",
  isFirstTime: false,
  institution: "L&T / Schneider Electric Authorized Engineering Division",
};

export const DEFAULT_FACULTY_USER: UserProfile = {
  id: "FAC_NSQF_SUNITA_01",
  name: "Smt. Sunita Deshmukh",
  email: "sunita.deshmukh@iti-eval.gov.in",
  role: "faculty",
  isFirstTime: false,
  institution: "Senior Trade Instructor & Lead NSQF Master Assessor",
};

export const HIGH_VALUE_COURSES: Course[] = [
  {
    id: "course_electrician_nsqf4",
    title: "Industrial & Domestic Electrician (NSQF Level 4/5)",
    tradeCode: "ELE_L4_DOMESTIC",
    nsqfLevel: 4,
    durationHours: 120,
    description: "Hands-on mastery of 3-phase panels, MCB distribution, live-line de-energization protocols, and dielectric PPE safety compliance.",
    iconName: "Zap",
    skillsTaught: ["Zero-Potential Verification", "1000V Dielectric Glove Usage", "Conductor Stripping (0 nick)", "Terminal Torque & Pull Test"],
    totalModules: 8,
    completedModules: 3,
    currentTaskTitle: "Module 4: MCB Distribution Wiring & Zero-Voltage Verification",
    currentTaskId: "TASK_MCB_WIRING_01",
    industryPartners: ["Schneider Electric", "L&T Heavy Engineering", "Siemens India", "Havells"],
    badgeTitle: "NSQF Certified Industrial Wireman"
  },
  {
    id: "course_solar_pv",
    title: "Solar PV Rooftop & Grid-Tie Technician (NSQF Level 4)",
    tradeCode: "SOL_L4_GRID",
    nsqfLevel: 4,
    durationHours: 90,
    description: "DC string combiner wiring, inverter synchronization, ground-fault isolation, and solar irradiance array testing.",
    iconName: "Sun",
    skillsTaught: ["DC String Splicing", "Inverter MPPT Isolation", "Fall Protection Harness", "Ground Bonding Verification"],
    totalModules: 6,
    completedModules: 1,
    currentTaskTitle: "Module 2: String Inverter DC Terminal Connection",
    currentTaskId: "TASK_SOLAR_DC_02",
    industryPartners: ["Tata Power Solar", "Adani Solar", "ReNew Power"],
    badgeTitle: "Suryamitra Certified Solar PV Installer"
  },
  {
    id: "course_ev_technician",
    title: "Electric Vehicle (EV) Powertrain & Battery Service (NSQF Level 5)",
    tradeCode: "AUT_L5_EV",
    nsqfLevel: 5,
    durationHours: 140,
    description: "High-voltage traction battery pack servicing, contactor pre-charge troubleshooting, and BMS diagnostic communication.",
    iconName: "BatteryCharging",
    skillsTaught: ["HV Interlock Disconnect (MSD)", "Class 0 Arc-Flash PPE", "Cell Balancing Audit", "Coolant Leak Pressure Test"],
    totalModules: 10,
    completedModules: 0,
    currentTaskTitle: "Module 1: High-Voltage Interlock Loop (HVIL) Isolation",
    currentTaskId: "TASK_EV_HVIL_01",
    industryPartners: ["Tata Motors Commercial", "Mahindra Last Mile", "Ola Electric"],
    badgeTitle: "NSQF Certified High-Voltage EV Specialist"
  },
  {
    id: "course_plc_automation",
    title: "Industrial Automation & PLC Wireman (NSQF Level 5)",
    tradeCode: "AUT_L5_PLC",
    nsqfLevel: 5,
    durationHours: 160,
    description: "Control panel DIN-rail architecture, 24VDC sensor loop calibration, wire ferruling standards, and E-Stop safety circuits.",
    iconName: "Cpu",
    skillsTaught: ["Ferruling & Schematic Tracing", "Safety Relay Integration", "Noise Shield Grounding", "Loop Current Sinking"],
    totalModules: 12,
    completedModules: 0,
    currentTaskTitle: "Module 1: DIN-Rail 24VDC Power Supply Wiring",
    currentTaskId: "TASK_PLC_DIN_01",
    industryPartners: ["Rockwell Automation", "ABB India", "Omron Industrial"],
    badgeTitle: "Mechatronics & PLC Certified Wireman"
  }
];

export const GOLDEN_SAMPLE_SCORECARD: MasterScorecardReport = {
  report_id: "rep_golden_sample_01",
  created_at: "2026-09-18T10:14:00Z",
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
    keywords_detected: ["isolated", "32-amp main isolator switch", "zero voltage", "phase and neutral", "digital multimeter"],
    missing_critical_terms: ["earthing continuity", "lockout-tagout (LOTO)"],
    reasoning_critique: "Candidate correctly articulated de-energization protocols and multimeter zero-potential check, but omitted confirmation of earth bond continuity before physical contact."
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
        description: "Candidate handling live-side conductors without dielectric insulated gloves during wire guidance.",
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
        timestamp_ms: 4600,
        evidence_description: "Main isolator pulled down; multimeter proves 0.02V residual.",
        tool_used: "Fluke 115 Multimeter"
      },
      {
        step_order: 2,
        nsqf_step_ref: "NOS_ELE_N0102_ST02",
        name: "Conductor Stripping",
        status: "PASS",
        timestamp_ms: 11800,
        evidence_description: "10mm PVC insulation stripped cleanly without nicking strands.",
        tool_used: "Knipex Wire Stripper"
      },
      {
        step_order: 3,
        nsqf_step_ref: "NOS_ELE_N0102_ST03",
        name: "Terminal Insertion & Torque",
        status: "UNCERTAIN_EVIDENCE",
        timestamp_ms: 22400,
        evidence_description: "Insertion observed, but torque tightening occluded by operator's elbow.",
        uncertainty_reason: "Camera occlusion >40% by candidate body"
      },
      {
        step_order: 4,
        nsqf_step_ref: "NOS_ELE_N0102_ST04",
        name: "Mechanical Pull Test Verification",
        status: "PASS",
        timestamp_ms: 31200,
        evidence_description: "Firm 15N downward pull executed with zero conductor displacement.",
        tool_used: "Manual Test Tug"
      }
    ]
  },
  verification_badge: {
    badge_id: "SB-NSQF-2026-9921",
    issue_date: "Pending Remediation",
    verifying_authority: "Directorate General of Training (DGT) / NSDC Electronic Audited",
    clip_sample_ms: [4200, 7800]
  }
};

export const CERTIFIED_SAMPLE_SCORECARD: MasterScorecardReport = {
  report_id: "rep_certified_sample_02",
  created_at: "2026-09-17T14:30:00Z",
  candidate_id: "STUDENT_ITI_MH_2026_119",
  candidate_name: "Amit Patel",
  trade_info: {
    trade_name: "Electrician",
    nsqf_level: 4,
    competency_code: "ELE/N0102",
    trade_code: "ELE_L4_DOMESTIC"
  },
  composite_score: 94.5,
  verdict: "CERTIFIED_COMPETENT",
  human_review_required: false,
  uncertainty_flags: [],
  breakdown: {
    safety_weight: 0.30,
    sequence_weight: 0.45,
    verbal_weight: 0.25,
    safety_score: 96.0,
    sequence_score: 95.0,
    verbal_score: 92.0
  },
  micro_evidence_timeline: [
    {
      timestamp_ms: 3500,
      type: "CHECKPOINT",
      status: "PASS",
      label: "Class 0 1000V Dielectric Gloves Donned",
      source: "VISION_SAFETY_AGENT",
      penalty_points: 0.0,
      frame_index: 5
    },
    {
      timestamp_ms: 8200,
      type: "CHECKPOINT",
      status: "PASS",
      label: "Isolator Cutoff & 0V Lockout-Tagout Verified",
      source: "VIDEO & AUDIO",
      penalty_points: 0.0,
      frame_index: 12
    },
    {
      timestamp_ms: 16400,
      type: "CHECKPOINT",
      status: "PASS",
      label: "Clean Stripping & Ferruling Standard Met",
      source: "VISION_SEQUENCE_AGENT",
      penalty_points: 0.0,
      frame_index: 24
    },
    {
      timestamp_ms: 25100,
      type: "CHECKPOINT",
      status: "PASS",
      label: "2.4Nm Calibrated Torque Screw Engagement",
      source: "VISION_SEQUENCE_AGENT",
      penalty_points: 0.0,
      frame_index: 38
    },
    {
      timestamp_ms: 33800,
      type: "CHECKPOINT",
      status: "PASS",
      label: "NSQF Compliant Pull-Test Resistance Passed",
      source: "VISION_SEQUENCE_AGENT",
      penalty_points: 0.0,
      frame_index: 51
    }
  ],
  seven_day_remediation_plan: [],
  speech_audit: {
    session_id: "aud_certified_9102",
    transcript: "Applied lockout tagout on 32A main switch. Measured 0.00V across phase, neutral, and verified earth continuity. Wearing 1000V rated dielectric safety gloves and polycarbonate eye protection.",
    duration_seconds: 19.1,
    overall_verbal_score: 92.0,
    metrics: {
      technical_terminology_score: 95.0,
      procedural_coherence_score: 91.0,
      safety_precaution_score: 90.0
    },
    keywords_detected: ["lockout tagout", "main switch", "0.00V", "phase, neutral", "earth continuity", "1000V rated dielectric", "eye protection"],
    missing_critical_terms: [],
    reasoning_critique: "Flawless technical articulation covering safety equipment, de-energization, zero potential, and earth continuity."
  },
  safety_audit: {
    ppe_score: 96.0,
    is_compliant: true,
    confidence_score: 0.98,
    violations: []
  },
  sequence_audit: {
    procedural_score: 95.0,
    steps_total: 4,
    steps_completed: 4,
    steps: [
      {
        step_order: 1,
        nsqf_step_ref: "NOS_ELE_N0102_ST01",
        name: "De-energization & Isolation",
        status: "PASS",
        timestamp_ms: 8200,
        evidence_description: "LOTO applied, zero voltage verified."
      },
      {
        step_order: 2,
        nsqf_step_ref: "NOS_ELE_N0102_ST02",
        name: "Conductor Stripping",
        status: "PASS",
        timestamp_ms: 16400,
        evidence_description: "Exact 11mm cut without copper deformation."
      },
      {
        step_order: 3,
        nsqf_step_ref: "NOS_ELE_N0102_ST03",
        name: "Terminal Insertion & Torque",
        status: "PASS",
        timestamp_ms: 25100,
        evidence_description: "Clear camera visibility, audible torque clutch slip at 2.4Nm."
      },
      {
        step_order: 4,
        nsqf_step_ref: "NOS_ELE_N0102_ST04",
        name: "Mechanical Pull Test Verification",
        status: "PASS",
        timestamp_ms: 33800,
        evidence_description: "Sustained pull test passed."
      }
    ]
  },
  verification_badge: {
    badge_id: "SB-NSQF-2026-8819-AUTH",
    issue_date: "2026-09-17",
    verifying_authority: "Directorate General of Training (DGT) — NSQF Level 4 Verified",
    clip_sample_ms: [7800, 11500]
  }
};

export const COHORT_HEATMAP_DATA: CohortHeatmapData[] = [
  {
    competencyCode: "NOS_ELE_N0102_02",
    title: "Personal Protective Equipment (1000V Gloves)",
    nsqfLevel: 4,
    failureRate: 62,
    criticalSafetyRisk: true,
    traineesTested: 140,
    topViolationReason: "Trainees removing gloves for fine screw manipulation"
  },
  {
    competencyCode: "NOS_ELE_N0102_01",
    title: "Mains Isolation & Zero-Potential Verification",
    nsqfLevel: 4,
    failureRate: 38,
    criticalSafetyRisk: true,
    traineesTested: 140,
    topViolationReason: "Omitting earth-to-neutral residual voltage check"
  },
  {
    competencyCode: "NOS_ELE_N0102_03",
    title: "Clean Conductor Stripping (0 Nick Standard)",
    nsqfLevel: 4,
    failureRate: 41,
    criticalSafetyRisk: false,
    traineesTested: 140,
    topViolationReason: "Using blunt pliers causing severed copper strands"
  },
  {
    competencyCode: "NOS_ELE_N0102_04",
    title: "Terminal Screw Torque & Mechanical Pull Test",
    nsqfLevel: 4,
    failureRate: 29,
    criticalSafetyRisk: false,
    traineesTested: 140,
    topViolationReason: "Insufficient torque resulting in loose terminal contact"
  },
  {
    competencyCode: "NOS_SOL_N0201_01",
    title: "DC String Open-Circuit Voltage Polarity Check",
    nsqfLevel: 4,
    failureRate: 45,
    criticalSafetyRisk: true,
    traineesTested: 92,
    topViolationReason: "Reverse polarity measurement without arc-rated shield"
  },
  {
    competencyCode: "NOS_AUT_N0304_02",
    title: "High-Voltage Interlock Loop (HVIL) Disconnect",
    nsqfLevel: 5,
    failureRate: 54,
    criticalSafetyRisk: true,
    traineesTested: 68,
    topViolationReason: "Premature high-voltage manual service disconnect removal"
  }
];

export const FACULTY_REVIEW_QUEUE = [
  {
    id: "queue_rev_001",
    candidate_id: "STUDENT_ITI_DL_2026_042",
    candidate_name: "Rajesh Kumar",
    trade_name: "Electrician NSQF L4",
    task: "MCB Distribution Wiring (TASK_MCB_WIRING_01)",
    flag_type: "CAMERA_OCCLUSION_EXCEEDS_THRESHOLD",
    reason: "Camera occlusion >40% by candidate body during terminal screw tightening.",
    timestamp_ms: 22400,
    status: "PENDING_FACULTY_DECISION",
    submitted_at: "18 Sep 2026, 10:14 AM",
    system_confidence: "UNCERTAIN_EVIDENCE"
  },
  {
    id: "queue_rev_002",
    candidate_id: "STUDENT_ITI_UP_2026_088",
    candidate_name: "Pooja Sharma",
    trade_name: "Solar PV Rooftop Technician",
    task: "DC String Combiner Box Splicing",
    flag_type: "LOW_ILLUMINATION_WARNING",
    reason: "Lighting below 150 Lux at panel shadow. Cable ferrule labels could not be verified by vision agent.",
    timestamp_ms: 18900,
    status: "PENDING_FACULTY_DECISION",
    submitted_at: "18 Sep 2026, 09:30 AM",
    system_confidence: "UNCERTAIN_EVIDENCE"
  },
  {
    id: "queue_rev_003",
    candidate_id: "STUDENT_ITI_GJ_2026_015",
    candidate_name: "Farhan Ali",
    trade_name: "EV Battery Service NSQF L5",
    task: "Manual Service Disconnect (MSD) Removal",
    flag_type: "RAPID_MOTION_BLUR",
    reason: "Hand motion speed exceeded shutter limit (>1.8 m/s). Pre-charge resistor check unconfirmed.",
    timestamp_ms: 12300,
    status: "PENDING_FACULTY_DECISION",
    submitted_at: "17 Sep 2026, 04:15 PM",
    system_confidence: "UNCERTAIN_EVIDENCE"
  }
];

export const RECRUITER_CANDIDATE_POOL: CandidateItem[] = [
  {
    candidate_id: "STUDENT_ITI_MH_2026_119",
    name: "Amit Patel",
    trade: "Electrician NSQF Level 4",
    institution: "Govt ITI Mumbai Central",
    composite_score: 94.5,
    verdict: "CERTIFIED_COMPETENT",
    verified_badge: "SB-NSQF-2026-8819-AUTH",
    verified_clip_duration: "3.2s verified isolation & torque",
    hiring_status: "Available for Immediate Plant Hire",
    safety_score: 96,
    practical_speed_rank: "Top 5%",
    project_upload_tier: "Gold Tier (3+ Drills)",
    nsqf_level: 4,
    viva_speech_score: 93,
    procedural_score: 95,
    uncertainty_rate: 1.2,
    video_drills_count: 4,
    key_skills: ["1000V Dielectric Gloves", "CAT-III Multimeter", "Zero Potential", "Terminal Pull Test"],
    task_execution_time: "28 seconds"
  },
  {
    candidate_id: "STUDENT_ITI_DL_2026_042",
    name: "Rajesh Kumar",
    trade: "Electrician NSQF Level 4",
    institution: "Govt ITI Pusa Delhi",
    composite_score: 76.5,
    verdict: "CONDITIONAL_REMEDIATION_REQUIRED",
    verified_badge: "Under 7-Day Micro-Remediation",
    verified_clip_duration: "Glove violation logged at 14.2s",
    hiring_status: "Remediating PPE Compliance (Day 2/7)",
    safety_score: 65,
    practical_speed_rank: "Top 25%",
    project_upload_tier: "Silver Tier (2 Drills)",
    nsqf_level: 4,
    viva_speech_score: 84,
    procedural_score: 88,
    uncertainty_rate: 3.4,
    video_drills_count: 2,
    key_skills: ["MCB Distribution", "LOTO Protocols", "Zero Voltage Check", "Terminal Tightening"],
    task_execution_time: "36 seconds"
  },
  {
    candidate_id: "STUDENT_ITI_TN_2026_204",
    name: "Karthik Subramanian",
    trade: "Automation & PLC Wireman L5",
    institution: "Govt ITI Guindy Chennai",
    composite_score: 91.0,
    verdict: "CERTIFIED_COMPETENT",
    verified_badge: "SB-NSQF-2026-7731-AUTH",
    verified_clip_duration: "24VDC loop wiring verified",
    hiring_status: "Shortlisted by Siemens India",
    safety_score: 94,
    practical_speed_rank: "Top 10%",
    project_upload_tier: "Gold Tier (3+ Drills)",
    nsqf_level: 5,
    viva_speech_score: 90,
    procedural_score: 92,
    uncertainty_rate: 1.8,
    video_drills_count: 3,
    key_skills: ["24VDC Sensor Loops", "Noise Shield Grounding", "Ferruling Standard", "DIN-Rail Architecture"],
    task_execution_time: "32 seconds"
  },
  {
    candidate_id: "STUDENT_ITI_RJ_2026_055",
    name: "Priya Rathore",
    trade: "Solar PV Rooftop Technician",
    institution: "Govt ITI Jaipur Technical",
    composite_score: 93.0,
    verdict: "CERTIFIED_COMPETENT",
    verified_badge: "SB-NSQF-2026-9042-AUTH",
    verified_clip_duration: "DC string combiner wiring passed",
    hiring_status: "Available for Immediate Plant Hire",
    safety_score: 98,
    practical_speed_rank: "Top 8%",
    project_upload_tier: "Gold Tier (3+ Drills)",
    nsqf_level: 4,
    viva_speech_score: 91,
    procedural_score: 94,
    uncertainty_rate: 0.9,
    video_drills_count: 4,
    key_skills: ["DC Combiner Splicing", "Inverter MPPT Isolation", "Fall Arrest Harness", "Array Polarity"],
    task_execution_time: "30 seconds"
  },
  {
    candidate_id: "STUDENT_ITI_GJ_2026_015",
    name: "Farhan Ali",
    trade: "EV Battery Service NSQF L5",
    institution: "Govt ITI Ahmedabad West",
    composite_score: 87.5,
    verdict: "CERTIFIED_COMPETENT",
    verified_badge: "SB-NSQF-2026-6180-AUTH",
    verified_clip_duration: "High-voltage interlock isolated",
    hiring_status: "Available for Immediate Plant Hire",
    safety_score: 92,
    practical_speed_rank: "Top 15%",
    project_upload_tier: "Silver Tier (2 Drills)",
    nsqf_level: 5,
    viva_speech_score: 88,
    procedural_score: 86,
    uncertainty_rate: 2.5,
    video_drills_count: 2,
    key_skills: ["MSD Disconnect", "Arc-Flash Shield", "BMS Diagnostic Scan", "Cell Voltage Balancing"],
    task_execution_time: "41 seconds"
  },
  {
    candidate_id: "STUDENT_ITI_KA_2026_312",
    name: "Deepa Hegde",
    trade: "Electrician NSQF Level 4",
    institution: "Govt ITI Bangalore Peenya",
    composite_score: 89.2,
    verdict: "CERTIFIED_COMPETENT",
    verified_badge: "SB-NSQF-2026-7244-AUTH",
    verified_clip_duration: "3-Phase distribution verified",
    hiring_status: "Interview Scheduled with Schneider",
    safety_score: 95,
    practical_speed_rank: "Top 12%",
    project_upload_tier: "Gold Tier (3+ Drills)",
    nsqf_level: 4,
    viva_speech_score: 89,
    procedural_score: 91,
    uncertainty_rate: 1.4,
    video_drills_count: 3,
    key_skills: ["3-Phase Load Balance", "Dielectric Stamp Verification", "Torque Clutch 2.4Nm", "Earth Fault Loop"],
    task_execution_time: "34 seconds"
  }
];

export const STUDENT_TREND_DATA: TrendDataPoint[] = [
  {
    week: "W1",
    date: "24 Jul 2026",
    compositeScore: 58.0,
    safetyScore: 62.0,
    proceduralScore: 55.0,
    verbalScore: 57.0,
    cohortAverage: 54.0,
    topTenAverage: 78.0,
    milestoneNote: "Orientation & Initial Diagnostic Lab"
  },
  {
    week: "W2",
    date: "31 Jul 2026",
    compositeScore: 64.5,
    safetyScore: 70.0,
    proceduralScore: 62.0,
    verbalScore: 61.5,
    cohortAverage: 57.5,
    topTenAverage: 81.0,
    milestoneNote: "PPE Inspection & Tool Calibration"
  },
  {
    week: "W3",
    date: "07 Aug 2026",
    compositeScore: 69.0,
    safetyScore: 68.0,
    proceduralScore: 71.0,
    verbalScore: 68.0,
    cohortAverage: 60.0,
    topTenAverage: 84.5,
    milestoneNote: "Single-Phase Breaker Wiring"
  },
  {
    week: "W4",
    date: "14 Aug 2026",
    compositeScore: 72.0,
    safetyScore: 75.0,
    proceduralScore: 74.0,
    verbalScore: 72.0,
    cohortAverage: 62.5,
    topTenAverage: 87.0,
    milestoneNote: "Mid-Term Procedural Sequencing"
  },
  {
    week: "W5",
    date: "21 Aug 2026",
    compositeScore: 75.5,
    safetyScore: 82.0,
    proceduralScore: 76.0,
    verbalScore: 77.0,
    cohortAverage: 64.0,
    topTenAverage: 88.5,
    milestoneNote: "CAT-III Multimeter Zero-Potential"
  },
  {
    week: "W6",
    date: "28 Aug 2026",
    compositeScore: 73.0,
    safetyScore: 65.0,
    proceduralScore: 82.0,
    verbalScore: 81.0,
    cohortAverage: 65.2,
    topTenAverage: 90.0,
    milestoneNote: "Glove Occlusion Flag Logged"
  },
  {
    week: "W7",
    date: "04 Sep 2026",
    compositeScore: 78.5,
    safetyScore: 85.0,
    proceduralScore: 84.0,
    verbalScore: 85.0,
    cohortAverage: 66.8,
    topTenAverage: 91.5,
    milestoneNote: "Remedial Dielectric Air Test Complete"
  },
  {
    week: "W8",
    date: "18 Sep 2026",
    compositeScore: 84.2,
    safetyScore: 92.0,
    proceduralScore: 89.0,
    verbalScore: 88.0,
    cohortAverage: 68.5,
    topTenAverage: 93.0,
    milestoneNote: "Current Standing • NSQF L4 Practice"
  }
];

export const GAMIFICATION_BADGES: GamificationBadge[] = [
  {
    id: "badge_dielectric_shield",
    title: "1000V Dielectric Shield",
    category: "SAFETY",
    description: "Successfully performed full visual and physical roll-up air test on Class 0 safety gloves before live busbar de-energization.",
    icon: "ShieldCheck",
    unlocked: true,
    progressPercent: 100,
    earnedDate: "12 Sep 2026",
    nsqfCode: "NOS_ELE_N0102_02",
    digitalHash: "0x889A_PPE_1000V_VERIFIED",
    criteria: "Zero glove removal violations across 3 consecutive 30fps audit runs."
  },
  {
    id: "badge_zero_occlusion",
    title: "Zero Occlusion Master",
    category: "PRECISION",
    description: "Maintained pristine 30fps unobstructed vision camera line-of-sight during fine terminal torque and wire insertion.",
    icon: "Video",
    unlocked: true,
    progressPercent: 100,
    earnedDate: "05 Sep 2026",
    nsqfCode: "NOS_ELE_N0102_04",
    digitalHash: "0x772B_CAM_LINE_SIGHT",
    criteria: "Camera occlusion maintained below 10% during entire hands-on execution."
  },
  {
    id: "badge_precision_stripper",
    title: "Precision Conductor Stripper",
    category: "PRECISION",
    description: "Stripped stranded copper conductor to calibrated 11mm tolerance with zero nicked strands under high-resolution computer vision inspection.",
    icon: "Zap",
    unlocked: true,
    progressPercent: 100,
    earnedDate: "28 Aug 2026",
    nsqfCode: "NOS_ELE_N0102_03",
    digitalHash: "0x991C_COPPER_0_NICK",
    criteria: "0 strand severing detected on 2.5mm² and 4.0mm² cable terminals."
  },
  {
    id: "badge_verbal_ace",
    title: "Verbal Reasoning Ace",
    category: "VERBAL",
    description: "Articulated lockout-tagout rationale, zero-voltage measurements, and grounding theory with >=90% technical coherence.",
    icon: "Mic",
    unlocked: true,
    progressPercent: 100,
    earnedDate: "15 Sep 2026",
    nsqfCode: "NOS_ELE_N0102_VIVA",
    digitalHash: "0x334D_NLP_SPEECH_92",
    criteria: "Achieved >=90% score on Speech NLP Reasoning Agent."
  },
  {
    id: "badge_streak_flame",
    title: "14-Day Discipline Flame",
    category: "DISCIPLINE",
    description: "Logged into the Bridge verification engine and completed daily safety diagnostics for 14 consecutive calendar days.",
    icon: "Flame",
    unlocked: true,
    progressPercent: 100,
    earnedDate: "18 Sep 2026",
    nsqfCode: "NOS_DISCIPLINE_14D",
    digitalHash: "0x556E_DAILY_14D_STREAK",
    criteria: "14 consecutive active training days verified in institutional log."
  },
  {
    id: "badge_enterprise_gold",
    title: "Enterprise Gold Seal",
    category: "ENTERPRISE",
    description: "Official dual-evidence credential pre-authorized by Schneider Electric & L&T for fast-track direct industrial hire.",
    icon: "Award",
    unlocked: false,
    progressPercent: 80,
    nsqfCode: "NOS_DGT_L4_GOLD",
    digitalHash: "PENDING_FINAL_AUDIT",
    criteria: "Complete 4 unedited assessment drills with >=90% composite score."
  },
  {
    id: "badge_solar_specialist",
    title: "Solar String Specialist",
    category: "PRECISION",
    description: "Safely calibrated DC open-circuit voltage string polarity without arc-flash hazard under simulated outdoor irradiance.",
    icon: "Sun",
    unlocked: false,
    progressPercent: 50,
    nsqfCode: "NOS_SOL_N0201_01",
    criteria: "Pass Module 2 DC combiner splicing drill with zero reverse polarity errors."
  },
  {
    id: "badge_ev_high_voltage",
    title: "EV High-Voltage Master",
    category: "SAFETY",
    description: "Master manual service disconnect (MSD) safe interlock removal on 400V traction battery packs with Class 00 gloves.",
    icon: "BatteryCharging",
    unlocked: false,
    progressPercent: 20,
    nsqfCode: "NOS_AUT_N0304_02",
    criteria: "Complete EV powertrain interlock drill with verified pre-charge zero energy."
  }
];

export const REMEDIAL_LEARNING_RESOURCES: Record<string, {
  title: string;
  nsqfLevel: number;
  failureDescription: string;
  proceduralGuide: string[];
  safetyChecklist: string[];
  quiz: RemedialQuizQuestion[];
}> = {
  "NOS_ELE_N0102_02": {
    title: "Personal Protective Equipment: 1000V Dielectric Gloves",
    nsqfLevel: 4,
    failureDescription: "62% of trainees remove their 1000V insulating gloves to manipulate small terminal screws, exposing hands to live arc-flash and electrocution hazards.",
    proceduralGuide: [
      "Step 1: Inspect gloves for air leaks using the manual roll-up inflation test prior to wearing.",
      "Step 2: Check current dielectric inspection stamp (must be certified within last 6 months).",
      "Step 3: Wear leather outer protector gloves over rubber insulating gloves to prevent mechanical tears.",
      "Step 4: Keep gloves ON for the entire duration of breaker cabinet work until zero-potential is verified."
    ],
    safetyChecklist: [
      "ASTM D120 / IEC 60903 Class 0 (1000V AC / 1500V DC) rated gloves verified",
      "Roll-up air pressure test completed with no pinhole punctures",
      "Cuff length exceeds wrist line by at least 2 inches",
      "Zero grease, oil, or chemical residue on dielectric rubber surface"
    ],
    quiz: [
      {
        id: "q1",
        question: "Why must insulating rubber gloves NEVER be worn without outer leather protector gloves in switchgear work?",
        options: [
          "Leather looks more professional to the inspector",
          "Rubber is prone to mechanical puncture from burrs, screws, and sharp cable edges",
          "Leather increases the electrical breakdown voltage by 5000V",
          "Leather keeps the hands cooler under industrial shop lights"
        ],
        correctIndex: 1,
        explanation: "Rubber gloves offer electrical resistance but zero mechanical cut resistance. A single microscopic scratch or puncture ruins the dielectric barrier.",
        practicalTip: "Always slip on your leather protectors immediately after the roll-up air test."
      },
      {
        id: "q2",
        question: "When should the roll-up air test be conducted on Class 0 dielectric gloves?",
        options: [
          "Once every year during official audit",
          "Only when the supervisor asks for inspection",
          "Daily, immediately before entering the energized or de-energized cabinet",
          "After finishing the entire electrical wiring job"
        ],
        correctIndex: 2,
        explanation: "Roll-up air inflation must be done daily before starting any work to detect pinholes caused during storage or transport.",
        practicalTip: "Roll from the cuff towards the fingertips and hold against your cheek to feel for escaping air."
      },
      {
        id: "q3",
        question: "If you struggle to manipulate an M3 terminal screw with 1000V gloves on, what is the approved NSQF procedure?",
        options: [
          "Briefly take off the glove on your dominant hand",
          "Use a magnetic screw-holding insulated screwdriver bit while keeping gloves on",
          "Have an un-gloved peer hold the screw for you",
          "Skip the screw and tape the wire instead"
        ],
        correctIndex: 1,
        explanation: "Removing gloves inside a panel is a critical safety violation. Use specialized insulated screw-starter or magnetic retaining tools.",
        practicalTip: "Use certified VDE 1000V magnetic screwdrivers for small terminal screws."
      }
    ]
  },
  "NOS_ELE_N0102_01": {
    title: "Mains Isolation & Zero-Potential Verification",
    nsqfLevel: 4,
    failureDescription: "38% of trainees test Phase-to-Neutral but forget to check Neutral-to-Earth and Phase-to-Earth, missing dangerous floating neutral voltage.",
    proceduralGuide: [
      "Step 1: Apply Lockout-Tagout (LOTO) padlock on upstream circuit breaker.",
      "Step 2: Prove tester on known live source before opening cabinet (Live-Dead-Live method).",
      "Step 3: Measure all 3 pairs: Phase to Neutral, Phase to Earth, and Neutral to Earth.",
      "Step 4: Prove tester again on known live source immediately after measurement."
    ],
    safetyChecklist: [
      "CAT-III 600V or CAT-IV 1000V multimeter leads in calibrated condition",
      "LOTO safety padlock attached with trainee identity tag",
      "Live-Dead-Live three-step calibration completed",
      "Residual voltage verified strictly at 0.00V (<5V safety threshold)"
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary purpose of the 'Live-Dead-Live' multimeter protocol?",
        options: [
          "To test if the multimeter battery has run out during measurement",
          "To guarantee the voltmeter is functioning before and after reading zero volts",
          "To recharge the internal capacitors of the test probe",
          "To verify the multimeter calibration stamp with the proctor"
        ],
        correctIndex: 1,
        explanation: "A blown meter fuse can display '0.00V' on a 415V live busbar, leading to fatal electrocution. Live-Dead-Live verifies meter integrity.",
        practicalTip: "Check live source -> check test circuit (0V) -> check live source again."
      },
      {
        id: "q2",
        question: "In a 3-phase 4-wire installation, how many individual potential measurements are required to prove complete de-energization?",
        options: [
          "Only 1 measurement across the main incoming switch",
          "3 measurements (L1-L2, L2-L3, L3-L1)",
          "10 measurements (all phase-phase, phase-neutral, phase-earth, neutral-earth)",
          "2 measurements (Phase to Neutral and Earth)"
        ],
        correctIndex: 2,
        explanation: "All phase-to-phase (3), phase-to-neutral (3), phase-to-earth (3), and neutral-to-earth (1) must be verified dead (10 total).",
        practicalTip: "Never assume neutral or earth cannot carry return or back-feed current."
      }
    ]
  },
  "NOS_ELE_N0102_03": {
    title: "Clean Conductor Stripping (0 Nick Standard)",
    nsqfLevel: 4,
    failureDescription: "41% of trainees use dull diagonal cutters instead of wire strippers, resulting in severed copper strands that lead to hot spots.",
    proceduralGuide: [
      "Step 1: Select the gauge-matched stripping notch for the conductor size (e.g. 2.5mm²).",
      "Step 2: Score insulation without biting into the copper core.",
      "Step 3: Slide insulation slug off smoothly along the conductor axis.",
      "Step 4: Visually inspect under light: 0 nicked, severed, or bent strands allowed."
    ],
    safetyChecklist: [
      "Automatic or calibrated multi-gauge wire stripper used",
      "Strip length measured with terminal strip gauge (exact 11mm)",
      "Zero cut strands across the entire stranded bunch",
      "Clean linear conductor without twist deformities"
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the fire hazard caused by nicked or severed strands inside an MCB terminal?",
        options: [
          "The breaker will trip immediately due to low voltage",
          "Reduced copper cross-section creates a high-resistance hot spot under current load",
          "Severed strands attract excessive electromagnetic interference",
          "The insulation will expand and cause mechanical jam"
        ],
        correctIndex: 1,
        explanation: "Severing even 2-3 strands reduces the wire's ampacity, creating localized resistive heating that can melt breaker housings.",
        practicalTip: "Inspect every stripped tip with a magnifying loupe or smartphone macro camera before torquing."
      }
    ]
  },
  "NOS_ELE_N0102_04": {
    title: "Terminal Screw Torque & Mechanical Pull Test",
    nsqfLevel: 4,
    failureDescription: "29% of trainees under-torque terminal screws or rely on manual guessing, causing loose connections that fail during thermal expansion.",
    proceduralGuide: [
      "Step 1: Verify manufacturer torque specification (e.g., 2.4 Nm for 32A MCB).",
      "Step 2: Adjust calibrated torque screwdriver clutch to exact setting.",
      "Step 3: Tighten until audible clutch slip is heard and captured by audio audit.",
      "Step 4: Perform sustained mechanical pull test (5kg pull force for 3 seconds)."
    ],
    safetyChecklist: [
      "Calibrated VDE torque screwdriver used (calibrated within 12 months)",
      "Correct PZ2 / Pozidriv bit matched to terminal screw head",
      "Audible torque clutch slip captured in assessment recording",
      "Sustained linear pull test executed with zero wire displacement"
    ],
    quiz: [
      {
        id: "q1",
        question: "Why is hand-tightening with a standard screwdriver prohibited under NSQF Level 4 terminal inspection?",
        options: [
          "Standard screwdrivers have smaller grips",
          "Human hand perception cannot reliably distinguish between 1.5 Nm and 2.8 Nm",
          "Standard screwdrivers cause static electrical discharge",
          "Inspectors prefer digital instruments only"
        ],
        correctIndex: 1,
        explanation: "Hand-tightening causes severe under-torquing (arcing risk) or over-torquing (stripped threads and fractured copper).",
        practicalTip: "Always set your torque clutch and listen for the calibrated click."
      }
    ]
  },
  "NOS_SOL_N0201_01": {
    title: "DC String Open-Circuit Voltage Polarity Check",
    nsqfLevel: 4,
    failureDescription: "45% of trainees touch multimeter probes to DC string terminals without confirming polarity or wearing arc-rated face shields.",
    proceduralGuide: [
      "Step 1: Don arc-flash face shield and safety glasses before opening DC combiner box.",
      "Step 2: Set multimeter to DC Volts 1000V range.",
      "Step 3: Connect red probe to positive string terminal, black probe to negative.",
      "Step 4: Verify open-circuit voltage matches irradiance calculation and polarity is positive."
    ],
    safetyChecklist: [
      "NFPA 70E / NSQF Arc-rated face shield (minimum 8 cal/cm²)",
      "Multimeter set to DC voltage mode (not AC or Current)",
      "Solar irradiance measured with pyranometer for expected Voc comparison",
      "MC4 connector latch integrity confirmed"
    ],
    quiz: [
      {
        id: "q1",
        question: "What occurs if you attempt to disconnect an MC4 solar connector while DC load current is flowing?",
        options: [
          "The solar panel shuts down automatically",
          "A continuous DC electric arc will ignite, which does not self-extinguish at zero-crossings",
          "The multimeter fuse will blow",
          "The battery charge controller switches to sleep mode"
        ],
        correctIndex: 1,
        explanation: "Unlike AC, DC current does not pass through zero. A sustained arc can cause severe flash burns and ignite combiner boxes.",
        practicalTip: "Always de-energize the DC load breaker before uncoupling any MC4 connectors."
      }
    ]
  },
  "NOS_AUT_N0304_02": {
    title: "High-Voltage Interlock Loop (HVIL) Disconnect",
    nsqfLevel: 5,
    failureDescription: "54% of trainees remove the manual service disconnect (MSD) too quickly without waiting for pre-charge capacitor discharge.",
    proceduralGuide: [
      "Step 1: Switch vehicle ignition OFF and disconnect 12V auxiliary battery ground.",
      "Step 2: Don Class 0 1000V rated gloves and full arc-flash PPE.",
      "Step 3: Unlatch the Manual Service Disconnect (MSD) safety lock lever.",
      "Step 4: Wait 5 minutes for inverter DC-bus capacitor discharge before measuring zero-volts."
    ],
    safetyChecklist: [
      "12V auxiliary system fully isolated and locked out",
      "Class 0 (1000V) electrical insulating gloves worn and verified",
      "5-minute capacitor dissipation timer observed",
      "Zero energy state verified across inverter DC bus terminals (<50V DC)"
    ],
    quiz: [
      {
        id: "q1",
        question: "Why must you wait at least 5 minutes after pulling the EV Manual Service Disconnect (MSD)?",
        options: [
          "To allow the coolant fluid to circulate back to the reservoir",
          "To allow internal high-voltage DC capacitors to bleed down through bleed resistors",
          "To allow the BMS microcontroller to upload telemetry to the cloud",
          "To allow the contactor coil to cool down to room temperature"
        ],
        correctIndex: 1,
        explanation: "High-voltage capacitors retain lethal 400V-800V charges for minutes after disconnection until internal discharge resistors bleed the charge.",
        practicalTip: "Always check your stopwatch for the full 5-minute wait, then verify with a CAT-IV meter."
      }
    ]
  }
};

