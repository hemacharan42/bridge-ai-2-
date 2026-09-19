import React, { useState } from "react";
import { RoleMorphScene } from "./RoleMorphScene";
import { useAssessment } from "../store/assessmentContext";
import { DEFAULT_STUDENT_USER, DEFAULT_EMPLOYER_USER, DEFAULT_FACULTY_USER } from "../data/mockData";
import { Lock, Mail, ArrowRight, UserCheck, Sparkles, Building2, GraduationCap, AlertCircle, ShieldAlert } from "lucide-react";

interface LoginPageProps {
  onSuccess: (isFirstTime: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { setCurrentUser } = useAssessment();
  const [role, setRole] = useState<"student" | "employee">("student");
  const [email, setEmail] = useState("rajesh.kumar@iti-delhi.edu.in");
  const [password, setPassword] = useState("••••••••••••");
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRoleChange = (newRole: "student" | "employee") => {
    setRole(newRole);
    setErrorMessage(null);
    if (newRole === "student") {
      setEmail("rajesh.kumar@iti-delhi.edu.in");
    } else {
      setEmail("vikram.mehta@schneider-vendor.in");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid institution or corporate email address.");
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage("Password must be at least 4 characters.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (role === "student") {
        const user = {
          ...DEFAULT_STUDENT_USER,
          email,
          isFirstTime: isFirstTimeUser
        };
        setCurrentUser(user);
        onSuccess(isFirstTimeUser);
      } else {
        const user = {
          ...DEFAULT_EMPLOYER_USER,
          email,
          isFirstTime: false
        };
        setCurrentUser(user);
        onSuccess(false);
      }
    }, 600);
  };

  const quickSwitch = (target: "student" | "employee" | "faculty", firstTime = false) => {
    if (target === "student") {
      setRole("student");
      setIsFirstTimeUser(firstTime);
      setEmail("rajesh.kumar@iti-delhi.edu.in");
      const user = { ...DEFAULT_STUDENT_USER, isFirstTime: firstTime };
      setCurrentUser(user);
      onSuccess(firstTime);
    } else if (target === "employee") {
      setRole("employee");
      setEmail("vikram.mehta@schneider-vendor.in");
      setCurrentUser(DEFAULT_EMPLOYER_USER);
      onSuccess(false);
    } else {
      setRole("employee");
      setCurrentUser(DEFAULT_FACULTY_USER);
      onSuccess(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
        {/* Left Panel: Role-Responsive Visual Morph Animation */}
        <div id="login-morph-panel" className="order-2 lg:order-1">
          <RoleMorphScene role={role} />
        </div>

        {/* Right Panel: Authentication Form */}
        <div id="login-form-panel" className="order-1 lg:order-2 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-slate-900/90">
          <div>
            {/* Header branding */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm tracking-tighter">SB</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight leading-none">SKILLBRIDGE AI</h1>
                  <span className="text-[10px] font-mono text-slate-400">NSQF DUAL-EVIDENCE VERIFIER</span>
                </div>
              </div>

              {/* Status pill */}
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                v1.5 PRD-Ready
              </span>
            </div>

            {/* Role Switcher Pill Bar (PRD Addendum Section 1.1) */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Select Assessment Persona & Mode
              </label>
              <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                <button
                  type="button"
                  id="role-select-student-btn"
                  onClick={() => handleRoleChange("student")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${
                    role === "student"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student / Trainee</span>
                </button>

                <button
                  type="button"
                  id="role-select-employee-btn"
                  onClick={() => handleRoleChange("employee")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${
                    role === "employee"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Employer / Recruiter</span>
                </button>
              </div>
            </div>

            {/* Form Introduction */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {role === "student" ? "Sign In to Trade Learning Portal" : "Industry Verified Talent Access"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {role === "student"
                  ? "Access your NSQF practical training modules, upload workbench audit videos, and review 7-day remediation plans."
                  : "Review authentic candidate video verification clips, PPE safety metrics, and NSQF Level 4/5 competency badges."}
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {role === "student" ? "ITI / Trainee Institutional Email" : "Corporate Work Email"}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    id="login-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={role === "student" ? "trainee@iti.gov.in" : "recruiter@company.com"}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  <span className="text-[11px] text-slate-500 hover:text-slate-400 cursor-pointer">
                    Demo Mode (Any)
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    id="login-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* First-Time Checkbox for Student Testing (PRD Addendum Section 3.1 & 3.2) */}
              {role === "student" && (
                <div className="pt-1 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="first-time-checkbox"
                      checked={isFirstTimeUser}
                      onChange={(e) => setIsFirstTimeUser(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500/30"
                    />
                    <span>Simulate <strong>First-Time Student</strong> (Triggers Course Selection Onboarding)</span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                id="login-submit-btn"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  role === "student"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-amber-500/15"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20"
                } disabled:opacity-50`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <>
                    <span>Enter {role === "student" ? "Trainee Workspace" : "Employer Portal"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Demo 1-Click Launchers */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                1-Click Preset Personas
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Instant Hydration</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                id="demo-persona-student-new"
                onClick={() => quickSwitch("student", true)}
                className="px-2.5 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left text-[11px] transition-colors group"
              >
                <div className="font-semibold text-slate-200 group-hover:text-amber-300">New Student</div>
                <div className="text-[10px] text-slate-400">Course Onboarding</div>
              </button>
              <button
                type="button"
                id="demo-persona-student-returning"
                onClick={() => quickSwitch("student", false)}
                className="px-2.5 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left text-[11px] transition-colors group"
              >
                <div className="font-semibold text-slate-200 group-hover:text-amber-300">Returning Student</div>
                <div className="text-[10px] text-slate-400">Resume In-Progress</div>
              </button>
              <button
                type="button"
                id="demo-persona-evaluator"
                onClick={() => quickSwitch("faculty", false)}
                className="px-2.5 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left text-[11px] transition-colors group"
              >
                <div className="font-semibold text-slate-200 group-hover:text-blue-300">NSQF Evaluator</div>
                <div className="text-[10px] text-slate-400">Cohort & Queue</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
