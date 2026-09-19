"use client";

import React from "react";
import { motion } from "framer-motion";
import { CharacterFocusState } from "@/types";

interface BookCharacterProps {
  focusState: CharacterFocusState;
  className?: string;
  height?: number;
}

/**
 * ============================================================================
 * BOOK CHARACTER COMPONENT (Student Route)
 * ============================================================================
 * 
 * DESIGN CONSTRAINTS:
 * 1. Fixed rendered height: Strictly 320px (h-80) to match FileCharacter.
 * 2. Visual Theme: Friendly stack of hardcover textbooks (Cobalt, Crimson, Amber).
 * 3. Reactive Focus States:
 *    - "idle": Subtle blinking and breathing motion.
 *    - "username": Pupils track rightward toward the username input field.
 *    - "password-hidden": Arms/hands cover eyes; head turns away bashfully.
 *    - "password-visible": Hands part slightly; character peeks playfully at the password.
 * 
 * MANUAL ASSET REPLACEMENT GUIDE:
 * - To swap vector colors, adjust the fill props in the SVG <rect> and <path> elements below.
 * - To replace with an external sprite/Lottie, replace the SVG body while preserving
 *   the wrapping container with `h-[320px] w-[320px]`.
 * ============================================================================
 */
export default function BookCharacter({ focusState, className = "" }: BookCharacterProps) {
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
      aria-label="Interactive animated book character reacting to form focus"
    >
      {/* Soft ambient pedestal glow & shadow */}
      <div className="absolute bottom-2 w-48 h-6 bg-slate-200/80 rounded-full blur-md -z-10" />

      {/* Main Character SVG Canvas (320x320 viewBox) */}
      <svg
        viewBox="0 0 320 320"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* --- BOTTOM BOOK (Deep Sapphire Blue) --- */}
        <g id="bottom-book">
          {/* Shadow underneath */}
          <ellipse cx="160" cy="275" rx="90" ry="12" fill="#cbd5e1" />
          {/* Book Spine and Cover */}
          <rect x="65" y="240" width="190" height="28" rx="6" fill="#1e3a8a" />
          {/* Paper Pages Layer */}
          <rect x="75" y="244" width="176" height="20" rx="3" fill="#f8fafc" />
          {/* Page Lines Texture */}
          <line x1="82" y1="249" x2="246" y2="249" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="82" y1="254" x2="246" y2="254" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="82" y1="259" x2="246" y2="259" stroke="#e2e8f0" strokeWidth="1.5" />
          {/* Bookmark Ribbon */}
          <path d="M190 260 L195 285 L200 278 L205 285 L210 260 Z" fill="#ef4444" />
        </g>

        {/* --- MIDDLE BOOK (Warm Emerald Green) --- */}
        <g id="middle-book">
          <rect x="75" y="200" width="170" height="36" rx="6" fill="#047857" />
          <rect x="85" y="205" width="156" height="26" rx="3" fill="#fefce8" />
          <line x1="92" y1="212" x2="236" y2="212" stroke="#fef08a" strokeWidth="1.5" />
          <line x1="92" y1="218" x2="236" y2="218" stroke="#fef08a" strokeWidth="1.5" />
          <line x1="92" y1="224" x2="236" y2="224" stroke="#fef08a" strokeWidth="1.5" />
          {/* Golden Spine Accent */}
          <rect x="75" y="200" width="12" height="36" rx="3" fill="#065f46" />
        </g>

        {/* --- TOP BOOK (Main Face Character - Crimson / Coral) --- */}
        <motion.g
          id="top-book-head"
          animate={{
            rotate: focusState === "username" ? 2 : focusState === "password-hidden" ? -4 : 0,
            y: focusState === "username" ? -2 : focusState === "password-hidden" ? 2 : 0,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          {/* Main Book Body */}
          <rect x="85" y="125" width="150" height="72" rx="10" fill="#dc2626" />
          {/* Inner Bookmark / Pages Top Edge */}
          <rect x="92" y="130" width="136" height="62" rx="6" fill="#b91c1c" />
          {/* Face Area (Warm Parchment Inset) */}
          <rect x="98" y="136" width="124" height="50" rx="8" fill="#ffffff" />

          {/* Cheeks Blush */}
          <circle cx="114" cy="168" r="6" fill="#fca5a5" opacity="0.6" />
          <circle cx="206" cy="168" r="6" fill="#fca5a5" opacity="0.6" />

          {/* Mouth */}
          <path
            d={
              focusState === "password-hidden"
                ? "M 152 173 Q 160 171 168 173" // Nervous straight mouth
                : focusState === "password-visible"
                ? "M 152 168 Q 160 178 168 168" // Cheerful smiling mouth
                : "M 154 170 Q 160 175 166 170" // Gentle smile
            }
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Graduation Cap / Bookmark Tassel on Top */}
          <path d="M140 125 L160 112 L180 125 L160 132 Z" fill="#1e1b4b" />
          <circle cx="160" cy="120" r="3" fill="#f59e0b" />
          <path d="M160 120 C 172 122, 178 135, 176 142" stroke="#f59e0b" strokeWidth="2" fill="none" />

          {/* --- EYES & TRACKING LOGIC --- */}
          {/* Left Eye Socket */}
          <circle cx="132" cy="155" r="13" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
          {/* Right Eye Socket */}
          <circle cx="188" cy="155" r="13" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />

          {/* Left Eye Pupil */}
          <motion.g
            animate={{
              x: pupilOffset.x,
              y: pupilOffset.y,
              scaleY: focusState === "password-hidden" ? 0.2 : 1, // Squint when hiding
            }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
          >
            <circle cx="132" cy="155" r="7" fill="#0f172a" />
            <circle cx="134" cy="153" r="2.5" fill="#ffffff" />
          </motion.g>

          {/* Right Eye Pupil */}
          <motion.g
            animate={{
              x: pupilOffset.x,
              y: pupilOffset.y,
              scaleY: focusState === "password-hidden" ? 0.2 : 1, // Squint when hiding
            }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
          >
            <circle cx="188" cy="155" r="7" fill="#0f172a" />
            <circle cx="190" cy="153" r="2.5" fill="#ffffff" />
          </motion.g>

          {/* Glasses Frame (Adds intellectual, cute student look) */}
          <rect x="116" y="140" width="32" height="30" rx="8" stroke="#334155" strokeWidth="2.5" fill="none" />
          <rect x="172" y="140" width="32" height="30" rx="8" stroke="#334155" strokeWidth="2.5" fill="none" />
          <line x1="148" y1="152" x2="172" y2="152" stroke="#334155" strokeWidth="2.5" />

          {/* --- HANDS / BOOK COVERS (Covering Eyes & Peeking) --- */}
          {/* Left Hand / Glove */}
          <motion.g
            initial={false}
            animate={
              focusState === "password-hidden"
                ? { x: 30, y: -26, rotate: 18 } // Fully covers left eye
                : focusState === "password-visible"
                ? { x: 16, y: -10, rotate: 8 } // Slightly dropped, peeking over fingers
                : { x: 0, y: 0, rotate: 0 } // Resting down on top of book
            }
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <ellipse cx="94" cy="180" rx="14" ry="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Little fingers indication */}
            <circle cx="98" cy="176" r="3" fill="#e2e8f0" />
            <circle cx="94" cy="174" r="3" fill="#e2e8f0" />
            <circle cx="90" cy="176" r="3" fill="#e2e8f0" />
          </motion.g>

          {/* Right Hand / Glove */}
          <motion.g
            initial={false}
            animate={
              focusState === "password-hidden"
                ? { x: -30, y: -26, rotate: -18 } // Fully covers right eye
                : focusState === "password-visible"
                ? { x: -16, y: -10, rotate: -8 } // Slightly dropped, peeking over fingers
                : { x: 0, y: 0, rotate: 0 } // Resting down on top of book
            }
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <ellipse cx="226" cy="180" rx="14" ry="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="222" cy="176" r="3" fill="#e2e8f0" />
            <circle cx="226" cy="174" r="3" fill="#e2e8f0" />
            <circle cx="230" cy="176" r="3" fill="#e2e8f0" />
          </motion.g>
        </motion.g>
      </svg>

      {/* State Caption Indicator for testing & clarity */}
      <div className="text-xs font-mono text-slate-400 mt-2 tracking-tight">
        {focusState === "username" && "👀 Tracking: Username"}
        {focusState === "password-hidden" && "🙈 Shielding: Confidential"}
        {focusState === "password-visible" && "🧐 Peeking: Password Visible"}
        {focusState === "idle" && "📚 Ready: Student Trainee"}
      </div>
    </div>
  );
}

export { BookCharacter };
