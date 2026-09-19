import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { BookCharacter } from "../character/BookCharacter";
import { CharacterFocusState } from "../../types";
import { useAssessment } from "../../store/assessmentContext";
import { DEFAULT_STUDENT_USER } from "../../data/mockData";
import { BridgeLogo } from "../brand/BridgeLogo";

interface StudentLoginPageProps {
  onSuccess: (isFirstTime: boolean) => void;
  onBackToHome: () => void;
}

/**
 * ============================================================================
 * FEATURE B: STUDENT SPLIT-SCREEN LOGIN PAGE
 * ============================================================================
 * 
 * CORE REQUIREMENTS:
 * 1. Google-clean, spacious 50/50 split layout.
 * 2. Left Panel: Animated Pile of Books Character (Height calibrated to 320px).
 * 3. Right Panel: Minimalist Auth Form (Username, Password, Eye Toggle, Sign In).
 * 4. Interactive Character Behavior:
 *    - Focusing Username: Character tracks/looks towards the username input.
 *    - Typing Password (Hidden): Character covers eyes and looks away bashfully.
 *    - Clicking Eye Toggle (Visible): Character peeks at the password input.
 *    - Blur/Idle: Character returns to neutral position.
 * 5. Student/Employee switcher is removed from this form (handled on landing page).
 * ============================================================================
 */
export const StudentLoginPage: React.FC<StudentLoginPageProps> = ({
  onSuccess,
  onBackToHome,
}) => {
  const { setCurrentUser } = useAssessment();

  // Interactive character focus tracking state
  const [characterState, setCharacterState] = useState<CharacterFocusState>("idle");

  // Form input state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Handle password visibility toggle and trigger character peeking
  const handleTogglePasswordVisibility = () => {
    const nextShow = !showPassword;
    setShowPassword(nextShow);
    if (nextShow) {
      setCharacterState("password-visible");
    } else {
      setCharacterState("password-hidden");
    }
  };

  const handlePasswordFocus = () => {
    if (showPassword) {
      setCharacterState("password-visible");
    } else {
      setCharacterState("password-hidden");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please provide both student ID/email and password.");
      return;
    }

    setIsLoading(true);

    // Simulate clean auth delay
    setTimeout(() => {
      setIsLoading(false);
      // Persist auth session
      try {
        localStorage.setItem("skillbridge_user_role", "student");
        localStorage.setItem("skillbridge_user_name", username || "Rajesh Kumar (ITI Trainee)");
        localStorage.setItem("skillbridge_user_id", "STUDENT_ITI_DL_2026_042");
      } catch (err) {
        console.error("Storage error", err);
      }

      // Update global context
      const user = {
        ...DEFAULT_STUDENT_USER,
        name: username.includes("@") ? username.split("@")[0] : username,
        isFirstTime,
      };
      setCurrentUser(user);

      // Route to Student Dashboard (which handles first-time onboarding modal)
      onSuccess(isFirstTime);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-black text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top minimal navigation bar */}
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

      {/* 50/50 Split Screen Layout */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl">
          
          {/* ------------------------------------------------------------- */}
          {/* LEFT PANEL: Interactive Book Character (Calibrated 320px)    */}
          {/* ------------------------------------------------------------- */}
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-slate-950/90 border-b lg:border-b-0 lg:border-r border-slate-800/80 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 bg-cyan-500 transition-colors duration-500" />

            <div className="mb-4 text-center">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                Trainee Vocational Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">Welcome Back, Learner</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Practical trade assessments, NSQF rubrics, and video verifications are ready.
              </p>
            </div>

            {/* Interactive Character Component (Calibrated 320px) */}
            <div className="my-2 flex items-center justify-center">
              <BookCharacter focusState={characterState} height={280} />
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400 font-medium">
                {characterState === "username" && "Character is looking right at your trainee ID."}
                {characterState === "password-hidden" && "Character is covering its eyes for privacy."}
                {characterState === "password-visible" && "Character is peeking at your visible password!"}
                {characterState === "idle" && "Click the fields on the right to interact."}
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* RIGHT PANEL: Clean Dark Minimalist Auth Form                  */}
          {/* ------------------------------------------------------------- */}
          <div className="p-8 sm:p-12 flex flex-col justify-center bg-slate-900/40">
            <div className="mb-8">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10 mb-4">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Sign in to Bridge</h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 font-light">
                Enter your ITI roll number, trainee ID, or registered email.
              </p>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Google-Clean Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Username / Trainee ID Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Trainee ID or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setCharacterState("username")}
                    onBlur={() => setCharacterState("idle")}
                    placeholder="e.g. STUDENT_ITI_DL_2026_042"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Password Field with Show/Hide Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { alert("Password reset token dispatched to registered institutional phone/email."); }}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={handlePasswordFocus}
                    onBlur={() => setCharacterState("idle")}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm transition-all"
                  />
                  {/* Eye Show/Hide Toggle Button */}
                  <button
                    type="button"
                    onClick={handleTogglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-cyan-400 transition-colors rounded-md focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & First-Time Onboarding Checkboxes */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-slate-300">Remember this device</span>
                </label>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                    <input
                      type="checkbox"
                      checked={isFirstTime}
                      onChange={(e) => setIsFirstTime(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-slate-300">
                      Simulate <strong>First-Time Trainee</strong> (Triggers NSQF onboarding)
                    </span>
                  </label>
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-xl font-bold text-sm text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>Sign in as Student Trainee</span>
                )}
              </button>

              {/* Demo quick fill button for instant evaluation */}
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <button
                  type="button"
                  onClick={() => {
                    setUsername("STUDENT_ITI_DL_2026_042");
                    setPassword("RajeshSecure@2026");
                  }}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  Click to Auto-Fill Verified Trainee
                </button>

                <span className="flex items-center gap-1 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>NSQF Verified</span>
                </span>
              </div>

            </form>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 font-mono">
              Protected by NSQF Dual-Evidence Security &amp; Video Audit Pipeline
            </div>

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

export default StudentLoginPage;
