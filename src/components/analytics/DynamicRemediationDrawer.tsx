import React, { useState } from "react";
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  FileText, 
  Zap, 
  Sparkles, 
  Check, 
  AlertCircle,
  ExternalLink,
  Award
} from "lucide-react";
import { CohortHeatmapData, RemedialQuizQuestion } from "../../types";
import { REMEDIAL_LEARNING_RESOURCES } from "../../data/mockData";
import confetti from "canvas-confetti";

interface DynamicRemediationDrawerProps {
  competency: CohortHeatmapData | null;
  onClose: () => void;
  onLaunchDrill?: (competencyCode: string) => void;
  onAssignToPlan?: (competencyCode: string) => void;
}

export const DynamicRemediationDrawer: React.FC<DynamicRemediationDrawerProps> = ({
  competency,
  onClose,
  onLaunchDrill,
  onAssignToPlan,
}) => {
  if (!competency) return null;

  const resource = REMEDIAL_LEARNING_RESOURCES[competency.competencyCode] || {
    title: competency.title,
    nsqfLevel: competency.nsqfLevel,
    failureDescription: `High failure rate (${competency.failureRate}%) observed across the cohort due to: ${competency.topViolationReason}.`,
    proceduralGuide: [
      "Review the standard NSQF technical operating procedure for this workstation.",
      "Verify calibration of measurement tools prior to hands-on testing.",
      "Maintain clear 30fps camera line of sight to avoid occlusion penalties.",
      "Perform a full verbal justification of your steps during video capture."
    ],
    safetyChecklist: [
      "PPE compliance verified prior to cabinet access",
      "Calibrated CAT-III multimeter utilized",
      "Zero-potential threshold verified",
      "Clean mechanical connections without burrs"
    ],
    quiz: [
      {
        id: "gen_q1",
        question: "What is the primary factor monitored by the vision safety agent during this task?",
        options: [
          "Candidate speed only",
          "Continuous PPE adherence and unobstructed line-of-sight",
          "Brand of clothing worn",
          "Volume of verbal speech"
        ],
        correctIndex: 1,
        explanation: "Vision safety algorithms continuously verify PPE presence (gloves, eye protection) and unobstructed camera viewing of the hands.",
        practicalTip: "Never position your torso between the camera and the breaker terminal."
      }
    ]
  };

  const [activeTab, setActiveTab] = useState<"GUIDE" | "QUIZ" | "CHECKLIST">("GUIDE");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    resource.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    if (calculateScore() === resource.quiz.length) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleAssignPlan = () => {
    setAssignedSuccess(true);
    onAssignToPlan?.(competency.competencyCode);
    setTimeout(() => setAssignedSuccess(false), 3000);
  };

  const isHighRisk = competency.failureRate >= 50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Top Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                  {competency.competencyCode}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  NSQF Level {competency.nsqfLevel}
                </span>
                {competency.criticalSafetyRisk && (
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    CRITICAL SAFETY HAZARD
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                {competency.title}
              </h2>

              <p className="text-xs text-slate-400">
                Cohort Failure Rate:{" "}
                <strong className={`font-mono font-bold ${isHighRisk ? "text-rose-400" : "text-amber-400"}`}>
                  {competency.failureRate}%
                </strong>{" "}
                across {competency.traineesTested} evaluated candidates
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs inside Drawer */}
          <div className="flex items-center gap-2 pt-4">
            <button
              type="button"
              onClick={() => setActiveTab("GUIDE")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeTab === "GUIDE"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              Remedial Guide
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("QUIZ")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "QUIZ"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <span>Interactive Quiz</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("CHECKLIST")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeTab === "CHECKLIST"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              Safety Checklist
            </button>
          </div>
        </div>

        {/* Drawer Body Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Dominant Root Cause Warning Callout */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono uppercase text-[11px]">
              <AlertTriangle className="w-4 h-4" />
              <span>Primary Failure Trap Detected In Workshop Audits</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-light">
              {resource.failureDescription}
            </p>
          </div>

          {/* TAB 1: PROCEDURAL GUIDE */}
          {activeTab === "GUIDE" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Standardized Remedial Execution Steps</span>
              </h3>

              <div className="space-y-2.5">
                {resource.proceduralGuide.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* 3D Blueprint Simulated Graphic Container */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>NSQF Certified Schematic Blueprint</span>
                  <span className="text-cyan-400">DGT-SPEC-REV-4</span>
                </div>
                <div className="h-32 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-center p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                  <div className="relative z-10 space-y-1">
                    <Zap className="w-6 h-6 text-cyan-400 mx-auto animate-pulse" />
                    <div className="text-xs font-semibold text-white">
                      Live-Dead-Live Calibrated Testing Sequence
                    </div>
                    <p className="text-[10px] text-slate-400 max-w-xs">
                      Probe Phase-Neutral, Phase-Earth, and Neutral-Earth. Verify 0.00V before handling stripped copper conductors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE QUIZ */}
          {activeTab === "QUIZ" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Targeted Competency Check</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Answer these practical scenario questions to prove conceptual mastery.
                  </p>
                </div>

                {quizSubmitted && (
                  <span className="px-3 py-1 rounded-full font-mono text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Score: {calculateScore()} / {resource.quiz.length}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {resource.quiz.map((q, qIdx) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          Q{qIdx + 1}
                        </span>
                        <p className="text-xs font-semibold text-white leading-relaxed">
                          {q.question}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="space-y-1.5 pl-7">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAnswer === optIdx;
                          let optionStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700";

                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              optionStyle = "bg-emerald-500/15 border-emerald-500/60 text-emerald-300 font-semibold";
                            } else if (isSelected && !isCorrect) {
                              optionStyle = "bg-rose-500/15 border-rose-500/60 text-rose-300 line-through";
                            }
                          } else if (isSelected) {
                            optionStyle = "bg-cyan-500/20 border-cyan-500/60 text-cyan-200 font-medium";
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs transition-colors flex items-start gap-2 cursor-pointer ${optionStyle}`}
                            >
                              <span className="font-mono text-[10px] text-slate-500 uppercase mt-0.5">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback after submission */}
                      {quizSubmitted && (
                        <div className={`p-3 rounded-xl text-xs space-y-1 pl-7 ${
                          isCorrect ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                        }`}>
                          <div className="font-semibold flex items-center gap-1.5">
                            {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                            <span>{isCorrect ? "Correct Procedure!" : "Incorrect Answer"}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-light">
                            {q.explanation}
                          </p>
                          <p className="text-[10px] text-amber-300/90 font-mono">
                            Practical Tip: {q.practicalTip}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  type="button"
                  disabled={Object.keys(selectedAnswers).length < resource.quiz.length}
                  onClick={handleSubmitQuiz}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-40"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Verify My Answers</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300">
                    {calculateScore() === resource.quiz.length ? "Ready for practical re-audit!" : "Review the guide and retry."}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-mono underline cursor-pointer"
                  >
                    Reset Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAFETY CHECKLIST */}
          {activeTab === "CHECKLIST" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pre-Flight Shop-Floor Safety Checklist</span>
              </h3>

              <div className="space-y-2">
                {resource.safetyChecklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs text-slate-200"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">DGT Institutional Standard PDF</div>
                  <p className="text-[11px] text-slate-400">Download printable workshop bench reminder</p>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Simulated NSQF Checklist PDF downloaded.")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download Spec</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center gap-3">
          <button
            type="button"
            onClick={handleAssignPlan}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {assignedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Added to 7-Day Plan!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Add 10-Min Remedial Drill to Daily Plan</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onLaunchDrill?.(competency.competencyCode);
            }}
            className="py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
          >
            <span>Launch Video Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
