import React, { useState } from "react";
import { Sparkles, Eye } from "lucide-react";

export type CharacterMode = "default" | "username-focus" | "password-hidden" | "password-visible";

interface InteractiveCharacterProps {
  type: "books" | "files"; // 'books' for student route, 'files' for employee route
  mode: CharacterMode;
}

// Generated kawaii 2D vector cartoon mascot image matching user reference
const KAWAII_BOOKS_ART = "/src/assets/images/scholarly_books_mascot_1789739219618.jpg";

/**
 * =========================================================================
 * ASSET SWAPPING / CUSTOMIZATION GUIDE:
 * - To swap this SVG animation for an external Lottie animation, 3D Spline,
 *   or custom WebGL canvas, replace the <svg> element with your component:
 *   <Lottie animationData={yourAnimation} ... />
 * - Height Constraint: Both characters strictly maintain the exact same
 *   rendered height (280px) across both routes via `h-[280px] w-[280px]`.
 * - Eye offsets and look-away transforms can be adjusted via eyeLookOffset.
 * =========================================================================
 */
export const InteractiveCharacter: React.FC<InteractiveCharacterProps> = ({ type, mode }) => {
  const [artMode, setArtMode] = useState<"interactive" | "artwork">("interactive");

  // Eye pupil offset calculation based on interaction state
  let pupilOffsetX = 0;
  let pupilOffsetY = 0;
  let eyesClosed = false;
  let eyesPeeking = false;

  switch (mode) {
    case "username-focus":
      // 1. Look directly at the username input field (down and right towards form)
      pupilOffsetX = 10;
      pupilOffsetY = 4;
      break;
    case "password-hidden":
      // 2. Look away / cover eyes when user types password hidden
      eyesClosed = true;
      pupilOffsetX = -8;
      pupilOffsetY = -6;
      break;
    case "password-visible":
      // 3. Peek at the input when the user clicks 'show password'
      eyesPeeking = true;
      pupilOffsetX = 12;
      pupilOffsetY = 2;
      break;
    case "default":
    default:
      pupilOffsetX = 0;
      pupilOffsetY = 0;
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center select-none w-full">
      {/* Top Mode Switcher for Student Route */}
      {type === "books" && (
        <div className="mb-2 flex items-center gap-1.5 p-1 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setArtMode("interactive")}
            className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 ${
              artMode === "interactive"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Interactive Mascot</span>
          </button>
          <button
            type="button"
            onClick={() => setArtMode("artwork")}
            className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 ${
              artMode === "artwork"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Vector Mascot Art</span>
          </button>
        </div>
      )}

      {/* Container with strictly enforced equal height (280px) for both characters */}
      <div className="relative h-[280px] w-[280px] flex items-center justify-center">
        {type === "books" ? (
          artMode === "artwork" ? (
            /* =======================================================
             * KAWAII 2D VECTOR CARTOON ARTWORK VIEW
             * ======================================================= */
            <div className="relative w-[260px] h-[260px] rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-2xl bg-slate-950 group">
              <img
                src={KAWAII_BOOKS_ART}
                alt="Kawaii 2D Vector Cartoon Mascot Books"
                className="w-full h-full object-cover rounded-3xl transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Overlay Subject Badges */}
              <div className="absolute inset-x-2 bottom-2 bg-slate-950/90 backdrop-blur-md rounded-2xl p-2 border border-slate-800/80 flex items-center justify-around text-[9px] font-mono">
                <span className="text-red-400 font-bold">1. Electrical Safety</span>
                <span className="text-emerald-400 font-bold">2. Solar PV</span>
                <span className="text-blue-400 font-bold">3. Automation</span>
              </div>
            </div>
          ) : (
            /* =======================================================
             * STUDENT CHARACTER: EXACTLY MATCHING USER REFERENCE
             * - Top Book: Crimson Red with White Face, Glasses & Mortarboard Graduation Cap
             * - Middle Book: Forest Green with Yellow Pages & Lines
             * - Bottom Book: Navy Blue with White Pages & Red Hanging Ribbon Bookmark
             * ======================================================= */
            <svg
              viewBox="0 0 280 280"
              className="w-full h-full drop-shadow-2xl transition-all duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Soft Ambient Ground Shadow */}
              <ellipse cx="140" cy="256" rx="92" ry="13" fill="#020617" opacity="0.65" />
              <ellipse cx="140" cy="256" rx="78" ry="8" fill="#1e3a8a" opacity="0.25" />

              {/* ----------------------------------------------------
               * 1) BOTTOM BOOK: NAVY BLUE WITH WHITE PAGES & RED BOOKMARK
               * ---------------------------------------------------- */}
              <g className="transition-transform duration-300">
                {/* Book Cover / Shell */}
                <rect x="38" y="198" width="204" height="42" rx="8" fill="#172554" stroke="#1e40af" strokeWidth="2.5" />
                {/* White Pages */}
                <rect x="52" y="205" width="176" height="28" rx="4" fill="#ffffff" />
                {/* Page Horizontal Lines */}
                <path d="M54 212H224M54 219H224M54 226H224" stroke="#e2e8f0" strokeWidth="1.5" />
                {/* Left Spine Cap */}
                <rect x="34" y="198" width="18" height="42" rx="5" fill="#0f172a" stroke="#1e40af" strokeWidth="1.5" />
                {/* Spine Accents */}
                <line x1="38" y1="206" x2="48" y2="206" stroke="#60a5fa" strokeWidth="1.5" />
                <line x1="38" y1="232" x2="48" y2="232" stroke="#60a5fa" strokeWidth="1.5" />
                {/* Subject Label */}
                <text x="74" y="223" fill="#1e3a8a" fontSize="8.5" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.8">
                  AUTOMATION &amp; ROBOTICS
                </text>
                {/* Hanging Red Ribbon Bookmark (exactly like in image.png) */}
                <g className="drop-shadow-md">
                  <path d="M178 230L178 266L187 258L196 266L196 230Z" fill="#ef4444" stroke="#dc2626" strokeWidth="1.2" />
                  <rect x="178" y="230" width="18" height="3" fill="#b91c1c" />
                </g>
              </g>

              {/* ----------------------------------------------------
               * 2) MIDDLE BOOK: FOREST GREEN WITH WARM YELLOW PAGES & LINES
               * ---------------------------------------------------- */}
              <g className="transition-transform duration-300">
                {/* Green Cover */}
                <rect x="46" y="152" width="188" height="44" rx="8" fill="#046a38" stroke="#059669" strokeWidth="2.5" />
                {/* Warm Yellow Pages */}
                <rect x="58" y="158" width="164" height="32" rx="4" fill="#fef9c3" />
                {/* Golden/Yellow Page Lines */}
                <path d="M60 166H218M60 174H218M60 182H218" stroke="#facc15" strokeWidth="1.5" />
                {/* Left Spine Cap */}
                <rect x="42" y="152" width="16" height="44" rx="5" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                <line x1="46" y1="160" x2="54" y2="160" stroke="#34d399" strokeWidth="1.5" />
                <line x1="46" y1="188" x2="54" y2="188" stroke="#34d399" strokeWidth="1.5" />
                {/* Subject Label */}
                <text x="80" y="178" fill="#046a38" fontSize="8.5" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.8">
                  SOLAR PV &amp; ELECTRICAL
                </text>
              </g>

              {/* ----------------------------------------------------
               * 3) TOP BOOK: CRIMSON RED MASCOT (GRADUATION CAP + GLASSES)
               * Tilted slightly clockwise (~2.5deg) matching image.png!
               * ---------------------------------------------------- */}
              <g transform="rotate(2.5 140 108)" className="transition-transform duration-300">
                {/* Outer Bold Crimson Red Hardcover Frame */}
                <rect x="56" y="70" width="168" height="78" rx="16" fill="#dc2626" stroke="#b91c1c" strokeWidth="3" />
                {/* 3D Depth Inner Border Layer (matching image.png) */}
                <rect x="62" y="76" width="156" height="66" rx="13" fill="#991b1b" />
                {/* Crisp White Inner Face Plate */}
                <rect x="68" y="82" width="144" height="54" rx="10" fill="#ffffff" />

                {/* Left Spine Accent */}
                <rect x="52" y="70" width="16" height="78" rx="7" fill="#991b1b" stroke="#b91c1c" strokeWidth="1.5" />
                <line x1="56" y1="82" x2="64" y2="82" stroke="#f87171" strokeWidth="1.5" />
                <line x1="56" y1="136" x2="64" y2="136" stroke="#f87171" strokeWidth="1.5" />

                {/* GRADUATION CAP (MORTARBOARD) ON TOP */}
                <g className="drop-shadow-lg">
                  {/* Cap skull base */}
                  <path d="M124 64C124 74 156 74 156 64Z" fill="#0f172a" />
                  {/* Flat Mortarboard Diamond (Rhombus) */}
                  <polygon points="140,40 178,54 140,66 102,54" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
                  {/* Mortarboard Under-shade */}
                  <polygon points="102,54 140,66 178,54 176,57 140,69 104,57" fill="#020617" />
                  {/* Golden Center Button */}
                  <circle cx="140" cy="53" r="3.5" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
                  {/* Golden Curved Tassel curling over right side */}
                  <path
                    d="M140 53Q164 50 173 63Q180 74 175 92"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                  {/* Tassel Hanging Fringe */}
                  <polygon points="172,91 178,91 180,101 170,101" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />
                </g>

                {/* CUTE ROUND PINK BLUSH CHEEKS */}
                <ellipse cx="85" cy="116" rx="9.5" ry="6" fill="#fda4af" opacity="0.9" />
                <ellipse cx="195" cy="116" rx="9.5" ry="6" fill="#fda4af" opacity="0.9" />

                {/* STUDIOUS KAWAII MOUTH (Slightly serious / focused studious expression) */}
                <path d="M133 124Q140 126 147 124" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" fill="none" />

                {/* EYES & GLASSES SECTION */}
                {!eyesClosed && !eyesPeeking && (
                  /* DEFAULT & USERNAME FOCUS: Open, tracking eyes behind glossy spectacles */
                  <g className="transition-all duration-200">
                    {/* Left Eye Behind Glasses */}
                    <ellipse cx={114 + pupilOffsetX} cy={109 + pupilOffsetY} rx="5.8" ry="6.8" fill="#0f172a" />
                    <circle cx={116 + pupilOffsetX} cy={107 + pupilOffsetY} r="2.3" fill="#ffffff" />
                    <circle cx={112 + pupilOffsetX} cy={112 + pupilOffsetY} r="1.1" fill="#ffffff" />

                    {/* Right Eye Behind Glasses */}
                    <ellipse cx={166 + pupilOffsetX} cy={109 + pupilOffsetY} rx="5.8" ry="6.8" fill="#0f172a" />
                    <circle cx={168 + pupilOffsetX} cy={107 + pupilOffsetY} r="2.3" fill="#ffffff" />
                    <circle cx={164 + pupilOffsetX} cy={112 + pupilOffsetY} r="1.1" fill="#ffffff" />
                  </g>
                )}

                {eyesClosed && (
                  /* PASSWORD HIDDEN: Shy closed curved eyes with bashful posture */
                  <g className="transition-all duration-200">
                    <path d="M106 109Q114 103 122 109" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M158 109Q166 103 174 109" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />

                    {/* Chubby hands bashfully covering eyes/glasses */}
                    <g className="drop-shadow-lg">
                      <rect x="96" y="93" width="34" height="28" rx="14" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.8" />
                      <circle cx="104" cy="100" r="3.2" fill="#fde047" stroke="#f59e0b" strokeWidth="1" />
                      <circle cx="113" cy="97" r="3.5" fill="#fde047" stroke="#f59e0b" strokeWidth="1" />
                      <circle cx="122" cy="100" r="3.2" fill="#fde047" stroke="#f59e0b" strokeWidth="1" />

                      <rect x="150" y="93" width="34" height="28" rx="14" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.8" />
                      <circle cx="158" cy="100" r="3.2" fill="#fde047" stroke="#f59e0b" strokeWidth="1" />
                      <circle cx="167" cy="97" r="3.5" fill="#fde047" stroke="#f59e0b" strokeWidth="1" />
                      <circle cx="176" cy="100" r="3.2" fill="#fde047" stroke="#f59e0b" strokeWidth="1" />
                    </g>
                  </g>
                )}

                {eyesPeeking && (
                  /* PASSWORD VISIBLE: Playful peeking through glasses! */
                  <g className="transition-all duration-200">
                    <ellipse cx={114 + pupilOffsetX} cy={109 + pupilOffsetY} rx="4.5" ry="4.5" fill="#0f172a" />
                    <circle cx={115 + pupilOffsetX} cy={108 + pupilOffsetY} r="1.5" fill="#ffffff" />

                    <ellipse cx={166 + pupilOffsetX} cy={109 + pupilOffsetY} rx="6.5" ry="7.5" fill="#0f172a" />
                    <circle cx={168 + pupilOffsetX} cy={107 + pupilOffsetY} r="2.5" fill="#ffffff" />

                    <path d="M136 123Q142 127 148 123" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />

                    <g className="drop-shadow-md">
                      <rect x="98" y="96" width="30" height="24" rx="12" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />
                    </g>
                  </g>
                )}

                {/* THE ICONIC SPECTACLES / GLASSES WITH GLOSSY LENS REFLECTIONS */}
                <g className="pointer-events-none drop-shadow-sm">
                  {/* Left Lens Frame */}
                  <rect
                    x="94"
                    y="93"
                    width="40"
                    height="32"
                    rx="10"
                    fill="#f0f9ff"
                    fillOpacity="0.35"
                    stroke="#0f172a"
                    strokeWidth="3.8"
                  />
                  {/* Left Lens Diagonal Glossy Reflection (matching image.png) */}
                  <ellipse
                    cx="106"
                    cy="104"
                    rx="9"
                    ry="4.5"
                    transform="rotate(-28 106 104)"
                    fill="#ffffff"
                    fillOpacity="0.8"
                  />
                  <ellipse
                    cx="122"
                    cy="114"
                    rx="4.5"
                    ry="2.2"
                    transform="rotate(-28 122 114)"
                    fill="#ffffff"
                    fillOpacity="0.5"
                  />

                  {/* Right Lens Frame */}
                  <rect
                    x="146"
                    y="93"
                    width="40"
                    height="32"
                    rx="10"
                    fill="#f0f9ff"
                    fillOpacity="0.35"
                    stroke="#0f172a"
                    strokeWidth="3.8"
                  />
                  {/* Right Lens Diagonal Glossy Reflection (matching image.png) */}
                  <ellipse
                    cx="158"
                    cy="104"
                    rx="9"
                    ry="4.5"
                    transform="rotate(-28 158 104)"
                    fill="#ffffff"
                    fillOpacity="0.8"
                  />
                  <ellipse
                    cx="174"
                    cy="114"
                    rx="4.5"
                    ry="2.2"
                    transform="rotate(-28 174 114)"
                    fill="#ffffff"
                    fillOpacity="0.5"
                  />

                  {/* Connecting Bridge between Lenses */}
                  <path d="M134 108H146" stroke="#0f172a" strokeWidth="3.8" strokeLinecap="round" />
                </g>
              </g>
            </svg>
          )
        ) : (
          /* =======================================================
           * EMPLOYEE CHARACTER: PILE OF FILES / FOLDERS
           * [ASSET SWAP NOTE: Replace this SVG with custom employee asset]
           * ======================================================= */
          <svg
            viewBox="0 0 280 280"
            className="w-full h-full drop-shadow-2xl transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soft Ambient Ground Shadow */}
            <ellipse cx="140" cy="255" rx="90" ry="14" fill="#020617" opacity="0.6" />

            {/* Bottom Dossier: Industrial Navy Binder */}
            <g className="transition-transform duration-300">
              <rect x="42" y="194" width="196" height="42" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              {/* Folder tab */}
              <path d="M42 200L65 194H115L125 200H42Z" fill="#334155" />
              <rect x="58" y="206" width="168" height="22" rx="2" fill="#f8fafc" />
              <path d="M58 212H215M58 219H215" stroke="#94a3b8" strokeWidth="1.5" />
            </g>

            {/* Middle Dossier: Precision Teal File Folder */}
            <g className="transition-transform duration-300">
              <rect x="48" y="148" width="186" height="44" rx="6" fill="#065f46" stroke="#047857" strokeWidth="2" />
              {/* Folder tab */}
              <path d="M120 148H180L170 142H130L120 148Z" fill="#059669" />
              <rect x="62" y="156" width="160" height="24" rx="2" fill="#f0fdf4" />
              <path d="M62 163H210M62 170H210" stroke="#86efac" strokeWidth="1.5" />
              {/* Stamp: VERIFIED */}
              <rect x="74" y="160" width="34" height="12" rx="2" fill="#10b981" />
              <text x="77" y="169" fill="#022c22" fontSize="7" fontWeight="bold" fontFamily="monospace">AUDIT</text>
            </g>

            {/* Top Dossier: Ochre Manila Candidate Folder (Character Face) */}
            <g className="transition-transform duration-300">
              <rect x="60" y="96" width="160" height="52" rx="7" fill="#b45309" stroke="#d97706" strokeWidth="2" />
              {/* File Folder Top Flap & Tab */}
              <path d="M60 104L75 96H135L145 104H220V148H60V104Z" fill="#d97706" />
              <rect x="80" y="98" width="46" height="7" rx="2" fill="#fef3c7" />
              <text x="83" y="103" fill="#78350f" fontSize="5" fontWeight="bold" fontFamily="monospace">RECRUITER</text>

              {/* Papers sticking out */}
              <rect x="70" y="106" width="140" height="34" rx="3" fill="#fefce8" />

              {/* EYES SECTION */}
              {!eyesClosed && !eyesPeeking && (
                /* DEFAULT & USERNAME FOCUS: Open eyes watching username field */
                <g className="transition-all duration-200">
                  {/* Left Eye */}
                  <ellipse cx="124" cy="122" rx="11" ry="12" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
                  <ellipse cx={124 + pupilOffsetX} cy={122 + pupilOffsetY} rx="5.5" ry="6" fill="#0f172a" />
                  <circle cx={126 + pupilOffsetX} cy={120 + pupilOffsetY} r="2" fill="#ffffff" />

                  {/* Right Eye */}
                  <ellipse cx="160" cy="122" rx="11" ry="12" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
                  <ellipse cx={160 + pupilOffsetX} cy={122 + pupilOffsetY} rx="5.5" ry="6" fill="#0f172a" />
                  <circle cx={162 + pupilOffsetX} cy={120 + pupilOffsetY} r="2" fill="#ffffff" />

                  {/* Calm, analytical mouth */}
                  <path d="M136 136H148" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}

              {eyesClosed && (
                /* PASSWORD HIDDEN: Eyes covered by folder clips/arms */
                <g className="transition-all duration-200">
                  <path d="M115 123Q124 115 133 123" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M151 123Q160 115 169 123" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Cheeks */}
                  <ellipse cx="112" cy="131" rx="5" ry="3" fill="#fca5a5" opacity="0.6" />
                  <ellipse cx="172" cy="131" rx="5" ry="3" fill="#fca5a5" opacity="0.6" />

                  {/* Folder Clamps Covering Eyes */}
                  <g className="drop-shadow-md">
                    <rect x="108" y="109" width="30" height="24" rx="6" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
                    <rect x="114" y="115" width="18" height="4" rx="2" fill="#78350f" />

                    <rect x="148" y="109" width="30" height="24" rx="6" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
                    <rect x="154" y="115" width="18" height="4" rx="2" fill="#78350f" />
                  </g>
                </g>
              )}

              {eyesPeeking && (
                /* PASSWORD VISIBLE: Peeking out from behind folder cover */
                <g className="transition-all duration-200">
                  {/* Left Eye peeking */}
                  <ellipse cx="124" cy="122" rx="9" ry="9" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
                  <ellipse cx={124 + pupilOffsetX} cy={122 + pupilOffsetY} rx="4" ry="4" fill="#0f172a" />
                  <circle cx={125 + pupilOffsetX} cy={121 + pupilOffsetY} r="1.5" fill="#ffffff" />

                  {/* Right Eye wide open */}
                  <ellipse cx="160" cy="122" rx="12" ry="13" fill="#ffffff" stroke="#78350f" strokeWidth="2" />
                  <ellipse cx={160 + pupilOffsetX} cy={122 + pupilOffsetY} rx="6.5" ry="7" fill="#0f172a" />
                  <circle cx={162 + pupilOffsetX} cy={120 + pupilOffsetY} r="2.5" fill="#ffffff" />

                  <ellipse cx="142" cy="135" rx="3.5" ry="3" fill="#78350f" />
                </g>
              )}
            </g>
          </svg>
        )}
      </div>

      {/* Character Ground Tagline with Trade Subjects */}
      {type === "books" ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 max-w-xs">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-red-500/15 text-red-300 border border-red-500/30">
            📕 Electrical Safety
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            📗 Solar PV &amp; Energy
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30">
            📘 Automation &amp; Robotics
          </span>
        </div>
      ) : (
        <span className="mt-2 text-[11px] font-mono text-slate-400">
          Recruiter Verified Candidate Dossier
        </span>
      )}
    </div>
  );
};
