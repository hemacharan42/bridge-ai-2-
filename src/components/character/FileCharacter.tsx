"use client";

import React from "react";
import { motion } from "framer-motion";
import { CharacterFocusState } from "@/types";

interface FileCharacterProps {
  focusState: CharacterFocusState;
  className?: string;
  height?: number;
}

/**
 * ============================================================================
 * FILE CHARACTER COMPONENT (Employee Route)
 * ============================================================================
 * 
 * DESIGN CONSTRAINTS:
 * 1. Fixed rendered height: Strictly 320px (h-80), EXACTLY matching BookCharacter.
 * 2. Visual Theme: Professional stack of enterprise dossier folders & document files.
 * 3. Reactive Focus States:
 *    - "idle": Subtle breathing and standing at attention.
 *    - "username": Eyes track rightward toward the corporate username/ID field.
 *    - "password-hidden": Confidential stamp flaps & file tabs close over eyes; head turns away.
 *    - "password-visible": Tabs slide apart; eyes peek through to verify password.
 * 
 * MANUAL ASSET REPLACEMENT GUIDE:
 * - To swap vector colors (e.g. from Manila/Slate to Corporate Navy), edit the SVG
 *   fill hex codes in the layer groups below.
 * - To scale or replace elements, preserve the outer frame `h-[320px] w-[320px]`.
 * ============================================================================
 */
export default function FileCharacter({ focusState, className = "" }: FileCharacterProps) {
  // Eye pupil offset based on interactive state
  const getPupilOffset = () => {
    switch (focusState) {
      case "username":
        return { x: 7, y: 0 }; // Looking right at the username field
      case "password-visible":
        return { x: 8, y: 3 }; // Peeking down-right at the revealed password
      case "password-hidden":
        return { x: -6, y: -2 }; // Looking away to the left
      case "idle":
      default:
        return { x: 3, y: 0 }; // Neutral forward-right look
    }
  };

  const pupilOffset = getPupilOffset();

  return (
    <div 
      className={`relative flex flex-col items-center justify-center h-[320px] w-[320px] select-none ${className}`}
      style={{ height: "320px", maxHeight: "320px" }}
      aria-label="Interactive animated file folder character reacting to form focus"
    >
      {/* Soft ambient pedestal shadow */}
      <div className="absolute bottom-2 w-48 h-6 bg-slate-200/80 rounded-full blur-md -z-10" />

      {/* Main Character SVG Canvas (320x320 viewBox) */}
      <svg
        viewBox="0 0 320 320"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* --- BOTTOM DOSSIER (Enterprise Dark Steel Gray) --- */}
        <g id="bottom-folder">
          <ellipse cx="160" cy="275" rx="92" ry="12" fill="#cbd5e1" />
          {/* Main folder base */}
          <rect x="60" y="242" width="200" height="26" rx="4" fill="#334155" />
          {/* Manila document sticking out */}
          <rect x="74" y="246" width="176" height="18" rx="2" fill="#f1f5f9" />
          <line x1="82" y1="252" x2="160" y2="252" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="82" y1="257" x2="140" y2="257" stroke="#cbd5e1" strokeWidth="2" />
          {/* Filing Index Tab */}
          <path d="M72 242 L88 242 L94 236 L120 236 L124 242 Z" fill="#64748b" />
        </g>

        {/* --- MIDDLE FOLDER (Classic Manila Yellow / Amber File) --- */}
        <g id="middle-folder">
          <rect x="68" y="202" width="184" height="34" rx="5" fill="#f59e0b" />
          <rect x="76" y="207" width="168" height="24" rx="2" fill="#fffbeb" />
          {/* Index Tab Right */}
          <path d="M190 202 L202 196 L232 196 L238 202 Z" fill="#d97706" />
          {/* Metal binder clip */}
          <rect x="150" y="198" width="20" height="8" rx="2" fill="#94a3b8" />
          <circle cx="160" cy="202" r="2" fill="#475569" />
        </g>

        {/* --- TOP DOSSIER (Main Character Face - Industrial Azure Blue) --- */}
        <motion.g
          id="top-file-head"
          animate={{
            rotate: focusState === "username" ? 2 : focusState === "password-hidden" ? -4 : 0,
            y: focusState === "username" ? -2 : focusState === "password-hidden" ? 2 : 0,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          {/* Main Folder Back Cover */}
          <rect x="80" y="125" width="160" height="72" rx="8" fill="#0284c7" />
          {/* Top Filing Tab */}
          <path d="M80 125 L92 114 L142 114 L152 125 Z" fill="#0369a1" />
          <text x="98" y="123" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace">CONFIDENTIAL</text>

          {/* White Paper Inside Facing Front */}
          <rect x="88" y="132" width="144" height="58" rx="5" fill="#ffffff" />

          {/* Subtle Document Lines */}
          <line x1="96" y1="140" x2="120" y2="140" stroke="#e2e8f0" strokeWidth="2" />
          <line x1="96" y1="145" x2="114" y2="145" stroke="#e2e8f0" strokeWidth="2" />

          {/* Corporate Badge / Stamp on Corner */}
          <circle cx="216" cy="144" r="9" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
          <text x="210" y="147" fill="#dc2626" fontSize="6" fontWeight="bold" fontFamily="sans-serif">VERIFIED</text>

          {/* Cheeks */}
          <circle cx="112" cy="168" r="5" fill="#bae6fd" opacity="0.8" />
          <circle cx="208" cy="168" r="5" fill="#bae6fd" opacity="0.8" />

          {/* Mouth */}
          <path
            d={
              focusState === "password-hidden"
                ? "M 152 173 Q 160 171 168 173" // Serious straight line
                : focusState === "password-visible"
                ? "M 152 168 Q 160 178 168 168" // Professional warm smirk
                : "M 154 170 Q 160 174 166 170" // Focused line
            }
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* --- EYES & TRACKING LOGIC --- */}
          {/* Left Eye */}
          <circle cx="132" cy="155" r="13" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Right Eye */}
          <circle cx="188" cy="155" r="13" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Left Pupil */}
          <motion.g
            animate={{
              x: pupilOffset.x,
              y: pupilOffset.y,
              scaleY: focusState === "password-hidden" ? 0.2 : 1,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
          >
            <circle cx="132" cy="155" r="7" fill="#0f172a" />
            <circle cx="134" cy="153" r="2.5" fill="#ffffff" />
          </motion.g>

          {/* Right Pupil */}
          <motion.g
            animate={{
              x: pupilOffset.x,
              y: pupilOffset.y,
              scaleY: focusState === "password-hidden" ? 0.2 : 1,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
          >
            <circle cx="188" cy="155" r="7" fill="#0f172a" />
            <circle cx="190" cy="153" r="2.5" fill="#ffffff" />
          </motion.g>

          {/* Modern Sleek Rectangular Frame Glasses */}
          <rect x="114" y="142" width="36" height="26" rx="4" stroke="#0f172a" strokeWidth="2.5" fill="none" />
          <rect x="170" y="142" width="36" height="26" rx="4" stroke="#0f172a" strokeWidth="2.5" fill="none" />
          <line x1="150" y1="152" x2="170" y2="152" stroke="#0f172a" strokeWidth="2.5" />

          {/* --- FILE FLAPS / HANDS (Covering & Peeking) --- */}
          {/* Left Folder Flap Hand */}
          <motion.g
            initial={false}
            animate={
              focusState === "password-hidden"
                ? { x: 30, y: -26, rotate: 18 } // Fully covers left eye
                : focusState === "password-visible"
                ? { x: 16, y: -10, rotate: 8 } // Slightly lowered, peeking
                : { x: 0, y: 0, rotate: 0 } // Neutral resting
            }
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <path d="M78 170 C 85 160, 100 162, 106 174 C 108 182, 95 190, 84 186 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            <circle cx="95" cy="174" r="2.5" fill="#ffffff" />
          </motion.g>

          {/* Right Folder Flap Hand */}
          <motion.g
            initial={false}
            animate={
              focusState === "password-hidden"
                ? { x: -30, y: -26, rotate: -18 } // Fully covers right eye
                : focusState === "password-visible"
                ? { x: -16, y: -10, rotate: -8 } // Slightly lowered, peeking
                : { x: 0, y: 0, rotate: 0 } // Neutral resting
            }
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <path d="M242 170 C 235 160, 220 162, 214 174 C 212 182, 225 190, 236 186 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            <circle cx="225" cy="174" r="2.5" fill="#ffffff" />
          </motion.g>
        </motion.g>
      </svg>

      {/* State Caption Indicator */}
      <div className="text-xs font-mono text-slate-400 mt-2 tracking-tight">
        {focusState === "username" && "👀 Tracking: Corporate ID"}
        {focusState === "password-hidden" && "🙈 Shielding: NDA Restricted"}
        {focusState === "password-visible" && "🧐 Peeking: Credentials Verified"}
        {focusState === "idle" && "📁 Ready: Plant Recruiter / Evaluator"}
      </div>
    </div>
  );
}

export { FileCharacter };
