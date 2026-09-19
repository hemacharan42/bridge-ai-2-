import React from "react";
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Calendar, 
  Zap, 
  Maximize2,
  CheckCircle2,
  Clock,
  Award
} from "lucide-react";
import { BridgeLogo } from "../brand/BridgeLogo";

interface IsometricMockupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchAssessment?: () => void;
}

export const IsometricMockupModal: React.FC<IsometricMockupModalProps> = ({
  isOpen,
  onClose,
  onLaunchAssessment,
}) => {
  const [selectedShowcase, setSelectedShowcase] = React.useState<"wide-glassmorphism" | "telemetry-pathway" | "assessment-gauge">("wide-glassmorphism");
  if (!isOpen) return null;

  return (
    <div 
      id="isometric-mockup-modal"
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        id="isometric-mockup-container"
        className="w-full max-w-6xl bg-[#090D16] border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden text-slate-200 relative"
      >
        {/* Subtle glowing cosmic particle dust and ambient backlights */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Bar with Dual Showcase Switcher */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                  <span>3D Isometric Dashboard Showcase</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                    OCTANE 8K VIEW
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                High-end 3D isometric dark-mode web dashboard featuring floating depth, recruiter telemetry &amp; active trade pathways
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher buttons */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setSelectedShowcase("wide-glassmorphism")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                  selectedShowcase === "wide-glassmorphism"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Wide Glass Cards (Edge-to-Edge)
              </button>
              <button
                type="button"
                onClick={() => setSelectedShowcase("telemetry-pathway")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                  selectedShowcase === "telemetry-pathway"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Vertical Rail &amp; Telemetry
              </button>
              <button
                type="button"
                onClick={() => setSelectedShowcase("assessment-gauge")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                  selectedShowcase === "assessment-gauge"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Circular Gauge &amp; Metrics
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body with 3D Isometric Visualization Canvas */}
        <div className="p-4 sm:p-8 space-y-6 overflow-y-auto max-h-[80vh] relative z-10">
          
          {/* High-Resolution Generated Octane Render Showcase */}
          <div className="relative rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl bg-slate-950 group">
            <img 
              src={
                selectedShowcase === "wide-glassmorphism"
                  ? "/src/assets/images/bridge_wide_glass_dashboard_1789777562996.jpg"
                  : selectedShowcase === "telemetry-pathway"
                  ? "/src/assets/images/bridge_3d_showcase_isometric_1789777281234.jpg"
                  : "/src/assets/images/bridge_3d_dashboard_mockup_1789774942666.jpg"
              } 
              alt="BRIDGE 3D Isometric Web Dashboard Showcase"
              className="w-full h-auto object-cover max-h-[560px] transition-transform duration-700 group-hover:scale-[1.015]"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay Gradient for depth separation */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none" />

            {/* Floating Live Architecture Callout Badge */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                <div className="text-xs font-mono">
                  <span className="text-white font-bold">
                    {selectedShowcase === "wide-glassmorphism"
                      ? "Full-Screen Edge-to-Edge Wide Layout: Dual Massive Side-by-Side Glass Course Cards"
                      : selectedShowcase === "telemetry-pathway"
                      ? "Fully Populated Vertical Rail + Active Trade Pathway (63%) + New Course Catalog"
                      : "3-Layer Spatial Depth Architecture: Compact Sidebar + Floating Glass Readouts + Circular Score Gauge"}
                  </span>
                  <span className="text-slate-400 ml-1.5">
                    {selectedShowcase === "wide-glassmorphism"
                      ? "Zero empty sidebar space with 4 gold glowing SHINE badges & NSQF Mastery Showcase footer banner"
                      : selectedShowcase === "telemetry-pathway"
                      ? "Zero empty vertical space with live recruiter telemetry"
                      : "Volumetric ambient glow with NSQF L4/L5 certification readouts"}
                  </span>
                </div>
              </div>

              {onLaunchAssessment && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLaunchAssessment();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Live Assessment</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Specification Breakdown & Parity Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Left Specification Column */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {selectedShowcase === "wide-glassmorphism"
                    ? "TOP HEADER & DUAL GLASS CARDS"
                    : "LEFT SIDEBAR (Fully Populated Vertical Rail)"}
                </span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                {selectedShowcase === "wide-glassmorphism" ? (
                  <>
                    <li className="flex items-start gap-1.5">
                      <span className="text-cyan-400">▸</span>
                      <span><strong>Top Header:</strong> Glowing cyan &ldquo;BRIDGE&rdquo; logo with filter tags (&ldquo;All (8)&rdquo;, &ldquo;Unlocked (5)&rdquo;).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-cyan-400">▸</span>
                      <span><strong>Left Massive Card:</strong> Industrial &amp; Domestic Electrician (NSQF Level 4/5) with 63% glowing progress bar, cyan &ldquo;Selected&rdquo; badge.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-cyan-400">▸</span>
                      <span><strong>SHINE Badges:</strong> Grid of 4 gold glowing &ldquo;✨ SHINE&rdquo; mastery badges (&ldquo;Zero-Potential&rdquo;, &ldquo;1000V Dist&rdquo;) &amp; gradient action buttons (&ldquo;Join Course&rdquo;, &ldquo;Test Case&rdquo;).</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-1.5">
                      <span className="text-cyan-400">▸</span>
                      <span><strong>TOP:</strong> Glowing cyan &ldquo;BRIDGE&rdquo; logo with vertical navigation menu (Dashboard, Trade Pathways, Verification Matrix).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-cyan-400">▸</span>
                      <span><strong>MIDDLE:</strong> Compact 3D &ldquo;14-Day Learning Streak&rdquo; card with glowing amber flame, &ldquo;ON FIRE&rdquo; badge, 7-day mini calendar row (M–S) with active cyan nodes, and gold progress bar.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-cyan-400">▸</span>
                      <span><strong>BOTTOM:</strong> Live &ldquo;Recruiter Telemetry&rdquo; feed card displaying &ldquo;L&amp;T Talent Desk viewed your profile&rdquo; with pulsing status dot.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Right Specification Column */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Zap className="w-4 h-4" />
                <span>
                  {selectedShowcase === "wide-glassmorphism"
                    ? "RIGHT CARD & BOTTOM SHOWCASE FOOTER"
                    : "RIGHT MAIN CANVAS (Spatial Trade Pathways)"}
                </span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                {selectedShowcase === "wide-glassmorphism" ? (
                  <>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400">▸</span>
                      <span><strong>Right Card:</strong> Solar PV Rooftop &amp; Grid-Tie Technician (NSQF Level 4) with 17% progress bar, mixed active/locked skill badges, and action buttons.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400">▸</span>
                      <span><strong>Bottom Footer:</strong> Full-width &ldquo;NSQF Skill Mastery &amp; Badges Showcase&rdquo; banner with a 3D badge icon and cryptographically sealed credential note.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400">▸</span>
                      <span><strong>Visual Style:</strong> Octane Render style, 8k resolution, slight isometric tilt, glassmorphism blur layers, vibrant cyan (#06b6d4) &amp; amber (#f59e0b) accents.</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400">▸</span>
                      <span><strong>Active Trade Pathway Card:</strong> Industrial &amp; Domestic Electrician (NSQF Level 4/5) with 63% glowing progress bar.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400">▸</span>
                      <span><strong>Start a New Course:</strong> High-value catalog action card featuring 3D gold plus icon for immediate program enrollment.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400">▸</span>
                      <span><strong>Octane Render Style:</strong> Deep cosmic navy background with subtle floating light particles, soft glassmorphism reflections, and vibrant cyan (#06b6d4) &amp; amber (#f59e0b) neon accents.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
