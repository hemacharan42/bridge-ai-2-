import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ShieldCheck, GraduationCap, Building2, BookOpen } from "lucide-react";

interface RoleMorphSceneProps {
  role: "student" | "employee";
}

export const RoleMorphScene: React.FC<RoleMorphSceneProps> = ({ role }) => {
  const isStudent = role === "student";

  return (
    <div className="relative w-full h-full min-h-[480px] lg:min-h-[640px] flex flex-col justify-between p-8 lg:p-12 overflow-hidden bg-gradient-to-br from-slate-950 via-[#0d1424] to-[#070b14] border-r border-slate-800/60">
      {/* Ambient background glows */}
      <div 
        className={`absolute top-1/4 -left-12 w-96 h-96 rounded-full blur-3xl opacity-25 transition-colors duration-1000 ${
          isStudent ? "bg-amber-500" : "bg-blue-600"
        }`} 
      />
      <div 
        className={`absolute bottom-10 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${
          isStudent ? "bg-emerald-500" : "bg-indigo-500"
        }`} 
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono tracking-wider backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          NSQF LEVEL 4/5 TRADE VERIFICATION
        </div>
        <div className="text-xs font-mono text-slate-500">
          SYSTEM_STATE: {isStudent ? "LEARNING_MODE" : "HIRING_MODE"}
        </div>
      </div>

      {/* Central Morphing Animation Canvas */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Orbital Glow Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-slate-700/50"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute inset-6 rounded-full border border-slate-800/80"
          />

          {/* Morphing Scene SVGs */}
          <AnimatePresence mode="wait">
            {isStudent ? (
              // Student Mode: Industrial Buildings spiral down and illuminate into an Open Knowledge Book
              <motion.div
                key="student-scene"
                initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 15 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* Spiraling structural architectural lines fading into pages */}
                <svg className="w-full h-full" viewBox="0 0 320 320" fill="none">
                  <defs>
                    <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <linearGradient id="glowSpire" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>

                  {/* Fading ghost building silhouette transforming into knowledge base */}
                  <motion.rect
                    x="50"
                    y="110"
                    width="44"
                    height="90"
                    rx="3"
                    stroke="#475569"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    initial={{ y: 90, opacity: 0.6 }}
                    animate={{ y: 135, opacity: 0.2, scaleY: 0.5 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  />
                  <motion.rect
                    x="226"
                    y="95"
                    width="44"
                    height="105"
                    rx="3"
                    stroke="#475569"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    initial={{ y: 80, opacity: 0.6 }}
                    animate={{ y: 135, opacity: 0.2, scaleY: 0.4 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  />

                  {/* Radiating learning rays */}
                  <motion.circle
                    cx="160"
                    cy="160"
                    r="85"
                    stroke="url(#glowSpire)"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Open Book Core */}
                  {/* Left Page */}
                  <motion.path
                    d="M 160 195 C 130 185 90 190 65 205 L 65 125 C 90 110 130 105 160 118 Z"
                    fill="#1e293b"
                    stroke="url(#bookGrad)"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                  />
                  {/* Right Page */}
                  <motion.path
                    d="M 160 195 C 190 185 230 190 255 205 L 255 125 C 230 110 190 105 160 118 Z"
                    fill="#0f172a"
                    stroke="url(#bookGrad)"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                  />
                  {/* Spine Center */}
                  <motion.line
                    x1="160"
                    y1="118"
                    x2="160"
                    y2="198"
                    stroke="#fbbf24"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Page script lines */}
                  <line x1="85" y1="135" x2="140" y2="132" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                  <line x1="85" y1="150" x2="135" y2="147" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                  <line x1="85" y1="165" x2="125" y2="162" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />

                  <line x1="180" y1="132" x2="235" y2="135" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                  <line x1="185" y1="147" x2="235" y2="150" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                  <line x1="195" y1="162" x2="235" y2="165" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />

                  {/* Floating Electrical Sparkles / Tool Glyph */}
                  <motion.circle
                    cx="160"
                    cy="86"
                    r="14"
                    fill="#fbbf24"
                    fillOpacity="0.15"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M 160 76 L 160 96 M 150 86 L 170 86"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    animate={{ rotate: 180 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                </svg>

                {/* Badge Overlay */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-2 flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[11px] font-medium text-amber-300 backdrop-blur-sm"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  Workplace Practice → Apprenticeship Knowledge
                </motion.div>
              </motion.div>
            ) : (
              // Employee / Recruiter Mode: Books spiral and assemble into an Industrial Plant & Headquarters Building
              <motion.div
                key="employee-scene"
                initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: -15 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <svg className="w-full h-full" viewBox="0 0 320 320" fill="none">
                  <defs>
                    <linearGradient id="buildGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient id="towerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#93c5fd" />
                      <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>
                  </defs>

                  {/* Fading ghost books spiraling into foundation */}
                  <motion.path
                    d="M 110 240 C 90 235 60 238 45 248"
                    stroke="#475569"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    initial={{ opacity: 0.8, y: -20 }}
                    animate={{ opacity: 0.2, y: 0 }}
                    transition={{ duration: 1 }}
                  />
                  <motion.path
                    d="M 210 240 C 230 235 260 238 275 248"
                    stroke="#475569"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    initial={{ opacity: 0.8, y: -20 }}
                    animate={{ opacity: 0.2, y: 0 }}
                    transition={{ duration: 1 }}
                  />

                  {/* Industrial Plant / Corporate Structure Assembly */}
                  {/* Left Facility Tower */}
                  <motion.rect
                    x="75"
                    y="130"
                    width="48"
                    height="95"
                    rx="3"
                    fill="#0f172a"
                    stroke="url(#buildGrad)"
                    strokeWidth="2"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                  />
                  {/* Left Tower Windows */}
                  <line x1="87" y1="145" x2="111" y2="145" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="87" y1="165" x2="111" y2="165" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="87" y1="185" x2="111" y2="185" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="87" y1="205" x2="111" y2="205" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />

                  {/* Central High-Voltage High-Rise */}
                  <motion.rect
                    x="133"
                    y="75"
                    width="54"
                    height="150"
                    rx="4"
                    fill="#1e293b"
                    stroke="url(#buildGrad)"
                    strokeWidth="2.5"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                  />
                  {/* Central Antenna Spire */}
                  <motion.line
                    x1="160"
                    y1="75"
                    x2="160"
                    y2="45"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  />
                  <motion.circle
                    cx="160"
                    cy="43"
                    r="4"
                    fill="#38bdf8"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />

                  {/* Central Tower Window Grid */}
                  <rect x="143" y="90" width="34" height="6" rx="1" fill="#60a5fa" fillOpacity="0.4" />
                  <rect x="143" y="105" width="34" height="6" rx="1" fill="#60a5fa" fillOpacity="0.4" />
                  <rect x="143" y="120" width="34" height="6" rx="1" fill="#60a5fa" fillOpacity="0.7" />
                  <rect x="143" y="135" width="34" height="6" rx="1" fill="#60a5fa" fillOpacity="0.4" />
                  <rect x="143" y="150" width="34" height="6" rx="1" fill="#60a5fa" fillOpacity="0.9" />
                  <rect x="143" y="165" width="34" height="6" rx="1" fill="#60a5fa" fillOpacity="0.5" />
                  <rect x="143" y="180" width="34" height="6" rx="1" fill="#60a5fa" fillOpacity="0.8" />

                  {/* Right Facility Wing */}
                  <motion.rect
                    x="197"
                    y="110"
                    width="48"
                    height="115"
                    rx="3"
                    fill="#0f172a"
                    stroke="url(#buildGrad)"
                    strokeWidth="2"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                  />
                  <line x1="209" y1="125" x2="233" y2="125" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="209" y1="145" x2="233" y2="145" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="209" y1="165" x2="233" y2="165" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="209" y1="185" x2="233" y2="185" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />

                  {/* Ground Foundation Line */}
                  <line x1="50" y1="225" x2="270" y2="225" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                </svg>

                {/* Badge Overlay */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-2 flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-[11px] font-medium text-blue-300 backdrop-blur-sm"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  Verified Evidence → Industrial Plant & Hiring
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Narrative Caption */}
        <div className="text-center max-w-sm mt-4">
          <h3 className="text-base font-semibold text-slate-200">
            {isStudent ? "Bridge Rote Learning to Shop-Floor Mastery" : "Direct Evidence-Grounded Industrial Hiring"}
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {isStudent 
              ? "Submit 20s technical articulation and 45s workbench execution video. Receive millisecond NSQF error diagnostics and a 7-day micro-remediation plan."
              : "Audit unforgeable skill badges with 3-second verified video clips proving candidates follow de-energization and 1000V dielectric PPE standards."}
          </p>
        </div>
      </div>

      {/* Bottom Footer Statistics */}
      <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero AI Hallucination Guardrails</span>
        </div>
        <div className="font-mono text-slate-500 text-[11px]">
          {isStudent ? "TARGET: NSQF 4/5" : "PLANT READY: 94.2%"}
        </div>
      </div>
    </div>
  );
};
