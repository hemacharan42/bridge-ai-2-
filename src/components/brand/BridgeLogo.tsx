import React from "react";

interface BridgeLogoProps {
  variant?: "full" | "icon" | "badge";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
}

/**
 * ============================================================================
 * Official BRIDGE Vector Logo
 * Features:
 * - Architectural suspension bridge with dual towers
 * - Academic mortarboard / graduation cap poised over the archway
 * - Vibrant neon cyan-to-golden road / highway curving forward through the bridge
 * - "BRIDGE" modern bold typography
 * - "Bridging Traditional Learning and market requirements" tagline
 * ============================================================================
 */
export const BridgeLogo: React.FC<BridgeLogoProps> = ({
  variant = "full",
  size = "md",
  showTagline = true,
  className = "",
}) => {
  // Dimensions mapping
  const iconSizeMap = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textHeadingSizeMap = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const taglineSizeMap = {
    sm: "text-[8px]",
    md: "text-[10px]",
    lg: "text-xs",
    xl: "text-sm",
  };

  // The core graphic SVG icon (Bridge towers, mortarboard cap, curving road)
  const LogoIcon = (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-[0_2px_12px_rgba(6,182,212,0.3)]"
    >
      <defs>
        {/* Left bridge cyan gradient */}
        <linearGradient id="bridgeCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Right bridge amber/orange gradient */}
        <linearGradient id="bridgeAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Cap blue gradient */}
        <linearGradient id="capBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        {/* Roadway perspective gradient */}
        <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Road stripe glow */}
        <linearGradient id="stripeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* =================================================== */}
      {/* 1. GRADUATION CAP / MORTARBOARD AT THE TOP PINNACLE */}
      {/* =================================================== */}
      <g filter="url(#neonGlow)">
        {/* Cap Rhombus Top Diamond */}
        <polygon
          points="200,28 258,58 200,88 142,58"
          fill="url(#capBlueGrad)"
          stroke="#67e8f9"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        
        {/* Cap Underneath Skull Cap Band */}
        <path
          d="M166,72 C166,72 178,98 200,98 C222,98 234,72 234,72 L234,80 C234,106 220,116 200,116 C180,116 166,106 166,80 Z"
          fill="#1d4ed8"
          stroke="#38bdf8"
          strokeWidth="3"
        />

        {/* Cap Button / Tassel Mount */}
        <circle cx="200" cy="58" r="4" fill="#fef08a" />

        {/* Cap Tassel Ribbon Hanging Right */}
        <path
          d="M200,58 Q228,64 246,88 L248,110"
          stroke="#fef08a"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="248" cy="112" r="3" fill="#fde047" />
      </g>

      {/* =================================================== */}
      {/* 2. LEFT SUSPENSION BRIDGE TOWER & CABLES (CYAN)     */}
      {/* =================================================== */}
      <g stroke="url(#bridgeCyanGrad)" strokeLinecap="round" strokeLinejoin="round">
        {/* Left Main Tower Pylon (Dual Vertical Columns) */}
        <line x1="108" y1="72" x2="108" y2="242" strokeWidth="8" />
        <line x1="126" y1="88" x2="126" y2="242" strokeWidth="6" />
        
        {/* Tower Cross Bracing & Summit Finial */}
        <polygon points="108,72 126,88 108,88" fill="url(#bridgeCyanGrad)" />
        <line x1="108" y1="130" x2="126" y2="130" strokeWidth="4" />
        <line x1="108" y1="175" x2="126" y2="175" strokeWidth="4" />
        <line x1="108" y1="218" x2="126" y2="218" strokeWidth="4" />

        {/* Left Outer Main Suspension Cable */}
        <path
          d="M108,76 Q60,140 28,198"
          strokeWidth="6"
          fill="none"
        />

        {/* Left Outer Vertical Suspension Hanger Ropes */}
        <line x1="88" y1="112" x2="88" y2="215" strokeWidth="3.5" />
        <line x1="68" y1="138" x2="68" y2="225" strokeWidth="3.5" />
        <line x1="48" y1="168" x2="48" y2="238" strokeWidth="3.5" />

        {/* Left Inner Main Arch Sweeping to Center Archway */}
        <path
          d="M108,76 Q150,150 178,168"
          strokeWidth="6"
          fill="none"
        />
        <line x1="145" y1="138" x2="145" y2="198" strokeWidth="3.5" />
        <line x1="164" y1="158" x2="164" y2="182" strokeWidth="3.5" />
      </g>

      {/* =================================================== */}
      {/* 3. RIGHT SUSPENSION BRIDGE TOWER & CABLES (AMBER)   */}
      {/* =================================================== */}
      <g stroke="url(#bridgeAmberGrad)" strokeLinecap="round" strokeLinejoin="round">
        {/* Right Main Tower Pylon (Dual Vertical Columns) */}
        <line x1="292" y1="72" x2="292" y2="242" strokeWidth="8" />
        <line x1="274" y1="88" x2="274" y2="242" strokeWidth="6" />

        {/* Tower Cross Bracing & Summit Finial */}
        <polygon points="292,72 274,88 292,88" fill="url(#bridgeAmberGrad)" />
        <line x1="274" y1="130" x2="292" y2="130" strokeWidth="4" />
        <line x1="274" y1="175" x2="292" y2="175" strokeWidth="4" />
        <line x1="274" y1="218" x2="292" y2="218" strokeWidth="4" />

        {/* Right Outer Main Suspension Cable */}
        <path
          d="M292,76 Q340,140 372,198"
          strokeWidth="6"
          fill="none"
        />

        {/* Right Outer Vertical Suspension Hanger Ropes */}
        <line x1="312" y1="112" x2="312" y2="215" strokeWidth="3.5" />
        <line x1="332" y1="138" x2="332" y2="225" strokeWidth="3.5" />
        <line x1="352" y1="168" x2="352" y2="238" strokeWidth="3.5" />

        {/* Right Inner Main Arch Sweeping to Center Archway */}
        <path
          d="M292,76 Q250,150 222,168"
          strokeWidth="6"
          fill="none"
        />
        <line x1="255" y1="138" x2="255" y2="198" strokeWidth="3.5" />
        <line x1="236" y1="158" x2="236" y2="182" strokeWidth="3.5" />
      </g>

      {/* =================================================== */}
      {/* 4. CENTRAL ARCHWAY CONNECTING THE TWO TOWERS        */}
      {/* =================================================== */}
      <path
        d="M126,170 C146,144 170,126 200,126 C230,126 254,144 274,170"
        stroke="#38bdf8"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        filter="url(#neonGlow)"
      />
      <path
        d="M138,185 C156,162 176,146 200,146 C224,146 244,162 262,185"
        stroke="#fde047"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* =================================================== */}
      {/* 5. DUAL FOUNDATION DECKS (BOOK / BRIDGE BASE LINES) */}
      {/* =================================================== */}
      {/* Left Wing Foundation Curve */}
      <path
        d="M20,248 C58,236 100,242 165,268 L155,290 C96,268 54,264 16,275 Z"
        fill="#0284c7"
        stroke="#38bdf8"
        strokeWidth="3.5"
      />
      <path
        d="M26,220 C64,212 110,218 160,242"
        stroke="#06b6d4"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Right Wing Foundation Curve */}
      <path
        d="M380,248 C342,236 300,242 235,268 L245,290 C304,268 346,264 384,275 Z"
        fill="#d97706"
        stroke="#f59e0b"
        strokeWidth="3.5"
      />
      <path
        d="M374,220 C336,212 290,218 240,242"
        stroke="#eab308"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* =================================================== */}
      {/* 6. CURVING PERSPECTIVE HIGHWAY / ROADWAY (S-CURVE)  */}
      {/* =================================================== */}
      {/* Dark Road Asphalt Base */}
      <path
        d="M188,148 C196,150 204,150 212,148 C226,170 248,198 238,228 C228,260 170,268 140,292 C120,308 100,318 80,320 L160,320 C186,306 226,288 256,262 C286,236 286,192 242,160 C230,152 220,146 212,148 Z"
        fill="#071b36"
        stroke="none"
      />

      {/* Highway Glowing Left Edge (Cyan-to-Blue neon curb) */}
      <path
        d="M192,150 C182,176 172,216 196,242 C216,264 212,278 184,295 C156,312 120,320 85,320"
        stroke="#38bdf8"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        filter="url(#neonGlow)"
      />

      {/* Highway Glowing Right Edge (Orange/Amber neon curb) */}
      <path
        d="M210,150 C234,178 248,206 238,236 C228,264 196,276 174,292 C148,310 114,320 178,320 C222,306 264,282 278,252 C290,224 266,182 216,150"
        stroke="#f59e0b"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Center Highway Dashed Neon Stripe (Speed Marks) */}
      <path
        d="M200,162 L198,172"
        stroke="url(#stripeGrad)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M196,184 L194,198"
        stroke="url(#stripeGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M195,212 L200,228"
        stroke="url(#stripeGrad)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M205,242 C205,250 200,258 190,266"
        stroke="url(#stripeGrad)"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        d="M178,278 C168,288 152,298 136,306"
        stroke="url(#stripeGrad)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M120,314 L100,320"
        stroke="url(#stripeGrad)"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
    </svg>
  );

  // Variant: Just the standalone Icon (Squircle app badge format like the bottom image)
  if (variant === "badge") {
    return (
      <div
        className={`relative aspect-square rounded-3xl bg-[#060b17] border border-slate-800/90 shadow-2xl p-3 flex items-center justify-center overflow-hidden group ${iconSizeMap[size]} ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-amber-500/10 pointer-events-none" />
        <div className="w-full h-full flex items-center justify-center p-1">
          {LogoIcon}
        </div>
      </div>
    );
  }

  // Variant: Just the icon without text
  if (variant === "icon") {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizeMap[size]} ${className}`}>
        {LogoIcon}
      </div>
    );
  }

  // Full Variant: Logo Icon + "BRIDGE" Typography + Subtitle Tagline
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Vector Bridge Emblem */}
      <div className={`shrink-0 ${iconSizeMap[size]}`}>
        {LogoIcon}
      </div>

      {/* Typography Block */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-wider text-white font-sans ${textHeadingSizeMap[size]}`}
            style={{ letterSpacing: "0.08em" }}
          >
            BRIDGE
          </span>
        </div>

        {showTagline && (
          <div className={`font-mono text-slate-300 tracking-tight mt-1 flex items-center gap-1 leading-tight ${taglineSizeMap[size]}`}>
            <span className="text-cyan-400 font-medium">Bridging Traditional Learning</span>
            <span className="text-slate-400 font-light">and</span>
            <span className="text-amber-400 font-semibold">market requirements</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BridgeLogo;
