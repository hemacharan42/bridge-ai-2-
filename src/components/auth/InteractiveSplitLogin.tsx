import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import BookCharacter from "../character/BookCharacter";
import FileCharacter from "../character/FileCharacter";
import { CharacterFocusState } from "../../types";
import { useAssessment } from "../../store/assessmentContext";
import { DEFAULT_STUDENT_USER, DEFAULT_EMPLOYER_USER } from "../../data/mockData";
import { BridgeLogo } from "../brand/BridgeLogo";

interface InteractiveSplitLoginProps {
  portalType: "student" | "employee";
  onSuccess: (isFirstTime: boolean) => void;
  onBackToHome: () => void;
}

/**
 * =========================================================================
 * FEATURE B: Interactive Split-Screen Login Pages
 * - Emulates Google-Clean minimalist authentication:
 *   Centered form, generous whitespace, clean focus rings, zero clutter.
 * - 50/50 split layout:
 *   Left Panel: Interactive character (Books for Student, Files for Employee).
 *   Right Panel: Google-clean Auth form.
 * - Interactive States:
 *   1) Username focused -> Character looks directly at the username field.
 *   2) Password typing (hidden) -> Character looks away / covers its eyes.
 *   3) Password show toggle -> Character peeks at the password.
 * =========================================================================
 */
export const InteractiveSplitLogin: React.FC<InteractiveSplitLoginProps> = ({
  portalType,
  onSuccess,
  onBackToHome,
}) => {
  const { setCurrentUser } = useAssessment();

  // Form input state
  const [username, setUsername] = useState(
    portalType === "student" ? "rajesh.kumar@iti.edu.in" : "vikram.mehta@schneider-vendor.com"
  );
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Focus tracking state for character interaction
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Derive Character focus state based on current user interaction
  let focusState: CharacterFocusState = "idle";
  if (isPasswordFocused) {
    focusState = showPassword ? "password-visible" : "password-hidden";
  } else if (isUsernameFocused) {
    focusState = "username";
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (portalType === "student") {
      const user = { ...DEFAULT_STUDENT_USER, isFirstTime };
      setCurrentUser(user);
      onSuccess(isFirstTime);
    } else {
      setCurrentUser(DEFAULT_EMPLOYER_USER);
      onSuccess(false);
    }
  };

  const handleQuickDemoFill = () => {
    if (portalType === "student") {
      setUsername("rajesh.kumar@iti.edu.in");
      setPassword("NsqfLevel4Secure!");
    } else {
      setUsername("vikram.mehta@schneider-vendor.com");
      setPassword("IndustrialAudit2026!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Top Bar Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors group px-3 py-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Landing Page</span>
        </button>

        <div className="flex items-center gap-2">
          <BridgeLogo variant="full" size="sm" showTagline={false} />
        </div>
      </header>

      {/* 50/50 Split Authentication Section */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl">
          {/* ========================================================
           * LEFT PANEL: CHARACTER ANIMATION WITH INTERACTIVE EYE TRACKING
           * Strictly enforced equal 280px rendered character height
           * ======================================================== */}
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-slate-950/90 border-b lg:border-b-0 lg:border-r border-slate-800/80 relative overflow-hidden">
            {/* Subtle background glow */}
            <div
              className={`absolute w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 transition-colors duration-500 ${
                portalType === "student" ? "bg-cyan-500" : "bg-amber-500"
              }`}
            />

            {/* Portal Title Badge */}
            <div className="mb-4 text-center">
              <span
                className={`text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${
                  portalType === "student"
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}
              >
                {portalType === "student" ? "Trainee Portal Authentication" : "Recruiter Portal Authentication"}
              </span>
            </div>

            {/* Interactive Character Component (Books for Student, Files for Recruiter) */}
            <div className="my-2 flex items-center justify-center">
              {portalType === "student" ? (
                <BookCharacter focusState={focusState} />
              ) : (
                <FileCharacter focusState={focusState} />
              )}
            </div>
          </div>

          {/* ========================================================
           * RIGHT PANEL: GOOGLE-CLEAN AUTHENTICATION FORM
           * Spacious layout, generous padding, clean input rings, no clutter
           * ======================================================== */}
          <div className="p-8 sm:p-12 flex flex-col justify-center bg-slate-900/40">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Sign in to Bridge
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 font-light">
                {portalType === "student"
                  ? "Access your dual-evidence course catalog, practical assessments, and master scorecard."
                  : "Access verified trade candidate audits, 3-second proof clips, and hiring pool."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  {portalType === "student" ? "Student Email / Trainee ID" : "Corporate Work Email"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setIsUsernameFocused(true)}
                    onBlur={() => setIsUsernameFocused(false)}
                    placeholder={portalType === "student" ? "trainee@iti.ac.in" : "recruiter@vendor.com"}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm transition-all pr-10"
                  />
                </div>
              </div>

              {/* Trainee First-Time Onboarding Simulation Toggle */}
              {portalType === "student" && (
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                    <input
                      type="checkbox"
                      checked={isFirstTime}
                      onChange={(e) => setIsFirstTime(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span className="text-slate-300">
                      Simulate <strong>First-Time Trainee</strong> (Opens Onboarding Modal)
                    </span>
                  </label>
                </div>
              )}

              {/* Google-Clean Primary Button */}
              <button
                type="submit"
                className={`w-full py-3 px-6 rounded-xl font-bold text-sm text-slate-950 flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-95 active:scale-[0.99] ${
                  portalType === "student"
                    ? "bg-cyan-400 hover:bg-cyan-300 shadow-cyan-500/20"
                    : "bg-amber-400 hover:bg-amber-300 shadow-amber-500/20"
                }`}
              >
                <span>Sign in as {portalType === "student" ? "Student" : "Employer"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Fill Demo Credentials */}
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Auto-fill verified demo credentials</span>
                </button>

                <span className="flex items-center gap-1 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zero Hallucination</span>
                </span>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-5 text-center text-[10px] font-mono text-slate-500">
        © 2026 BRIDGE Platform. All rights reserved. Dual-Evidence Skill Verification Engine.
      </footer>
    </div>
  );
};
