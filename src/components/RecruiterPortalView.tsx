import React, { useState, useMemo } from "react";
import { RECRUITER_CANDIDATE_POOL, CERTIFIED_SAMPLE_SCORECARD, GOLDEN_SAMPLE_SCORECARD } from "../data/mockData";
import { useAssessment } from "../store/assessmentContext";
import { MillisecondVideoPlayer } from "./MillisecondVideoPlayer";
import { CandidateComparisonMatrix } from "./recruiter/CandidateComparisonMatrix";
import { AdvancedFilterDrawer, RecruiterFilterState } from "./recruiter/AdvancedFilterDrawer";
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Video, 
  Play, 
  CheckCircle2, 
  UserCheck, 
  ExternalLink,
  Search,
  Sparkles,
  BookmarkCheck,
  Filter,
  X,
  Clock,
  Calendar,
  AlertTriangle,
  Download,
  Briefcase,
  Layers,
  ChevronRight,
  SlidersHorizontal,
  Scale,
  Check,
  Eye,
  Box,
  Square
} from "lucide-react";
import { MicroEvidenceItem, CandidateItem } from "../types";
import { useScorecard } from "../store/ScorecardContext";

export const RecruiterPortalView: React.FC = () => {
  const { 
    loadCertifiedDemoData, 
    loadGoldenDemoData,
    candidates,
    shortlistedCandidateIds,
    toggleCandidateShortlist
  } = useAssessment();

  const { uiLayoutPreference, toggleUiLayoutPreference } = useScorecard();

  // Search and Filter State
  const [filters, setFilters] = useState<RecruiterFilterState>({
    searchQuery: "",
    selectedTrades: [],
    selectedInstitutions: [],
    minCompositeScore: 0,
    minSafetyScore: 0,
    verdictFilter: "all",
    selectedTiers: [],
    speedRanks: [],
    showShortlistOnly: false,
  });

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Candidate Comparison State
  const [comparisonCandidateIds, setComparisonCandidateIds] = useState<string[]>([
    "STUDENT_ITI_MH_2026_119",
    "STUDENT_ITI_TN_2026_204"
  ]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // Inspected Candidate Modal State
  const [inspectedCandidate, setInspectedCandidate] = useState<CandidateItem | null>(null);
  const [activeMarkerMs, setActiveMarkerMs] = useState<number>(7800);

  const candidatePool: CandidateItem[] = candidates && candidates.length > 0 ? candidates : RECRUITER_CANDIDATE_POOL;
  const shortlistedIds = shortlistedCandidateIds || [];

  const availableTrades = useMemo(() => {
    return Array.from(new Set(candidatePool.map((c) => c.trade)));
  }, [candidatePool]);

  const availableInstitutions = useMemo(() => {
    return Array.from(new Set(candidatePool.map((c) => c.institution)));
  }, [candidatePool]);

  const toggleShortlist = (candidateId: string) => {
    toggleCandidateShortlist(candidateId);
  };

  const toggleCompareCandidate = (candidateId: string) => {
    setComparisonCandidateIds((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      }
      if (prev.length >= 4) {
        alert("Maximum 4 candidates can be compared side-by-side. Please deselect one first.");
        return prev;
      }
      return [...prev, candidateId];
    });
  };

  const resetAllFilters = () => {
    setFilters({
      searchQuery: "",
      selectedTrades: [],
      selectedInstitutions: [],
      minCompositeScore: 0,
      minSafetyScore: 0,
      verdictFilter: "all",
      selectedTiers: [],
      speedRanks: [],
      showShortlistOnly: false,
    });
  };

  // Filtered pool
  const filteredCandidates = candidatePool.filter((c) => {
    // Search query
    const q = filters.searchQuery.toLowerCase().trim();
    if (q) {
      const matchName = c.name.toLowerCase().includes(q);
      const matchTrade = c.trade.toLowerCase().includes(q);
      const matchInst = c.institution.toLowerCase().includes(q);
      const matchId = c.candidate_id.toLowerCase().includes(q);
      const matchSkills = c.key_skills?.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchTrade && !matchInst && !matchId && !matchSkills) {
        return false;
      }
    }

    // Trade multi-select
    if (filters.selectedTrades.length > 0 && !filters.selectedTrades.includes(c.trade)) {
      return false;
    }

    // Institution multi-select
    if (filters.selectedInstitutions.length > 0 && !filters.selectedInstitutions.includes(c.institution)) {
      return false;
    }

    // Min Composite Score
    if (filters.minCompositeScore > 0 && c.composite_score < filters.minCompositeScore) {
      return false;
    }

    // Min Safety Score
    if (filters.minSafetyScore > 0 && c.safety_score < filters.minSafetyScore) {
      return false;
    }

    // Verdict Filter
    if (filters.verdictFilter !== "all" && c.verdict !== filters.verdictFilter) {
      return false;
    }

    // Project Tier
    if (filters.selectedTiers.length > 0 && (!c.project_upload_tier || !filters.selectedTiers.includes(c.project_upload_tier))) {
      return false;
    }

    // Shortlist
    if (filters.showShortlistOnly && !shortlistedIds.includes(c.candidate_id)) {
      return false;
    }

    return true;
  });

  const handleOpenInspection = (candidate: CandidateItem) => {
    setInspectedCandidate(candidate);
    if (candidate.verdict === "CERTIFIED_COMPETENT") {
      loadCertifiedDemoData();
      setActiveMarkerMs(7800);
    } else {
      loadGoldenDemoData();
      setActiveMarkerMs(14200);
    }
  };

  const comparisonCandidates = candidatePool.filter((c) =>
    comparisonCandidateIds.includes(c.candidate_id)
  );

  // Active filter count calculation
  const activeFiltersCount = 
    (filters.selectedTrades.length > 0 ? 1 : 0) +
    (filters.selectedInstitutions.length > 0 ? 1 : 0) +
    (filters.minCompositeScore > 0 ? 1 : 0) +
    (filters.minSafetyScore > 0 ? 1 : 0) +
    (filters.verdictFilter !== "all" ? 1 : 0) +
    (filters.selectedTiers.length > 0 ? 1 : 0) +
    (filters.showShortlistOnly ? 1 : 0);

  // Sample timeline markers for inspection player
  const sampleMarkers: MicroEvidenceItem[] = inspectedCandidate?.verdict === "CERTIFIED_COMPETENT"
    ? CERTIFIED_SAMPLE_SCORECARD.micro_evidence_timeline
    : GOLDEN_SAMPLE_SCORECARD.micro_evidence_timeline;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 animate-in fade-in">
      {/* =====================================================================
       * TOP BANNER: INDUSTRY HIRING WORKSPACE
       * ===================================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0b1528] to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 font-bold">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                INDUSTRY HIRING PORTAL
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                L&amp;T • SCHNEIDER ELECTRIC • SIEMENS RECRUITMENT DESK
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Verified Industrial Technical Talent Pool
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Direct access to vocational trainees who have demonstrated physical competency under unforgeable, 
              computer-vision-verified NSQF L4/L5 dual-evidence audits. Multi-select advanced filtering &amp; side-by-side comparative matrices.
            </p>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-xl font-mono font-bold text-emerald-400">148</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Ready to Hire</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-xl font-mono font-bold text-cyan-400">96.2%</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Avg Safety</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-xl font-mono font-bold text-amber-400">{shortlistedIds.length}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Shortlisted</div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
       * SEARCH, ADVANCED MULTI-SELECT FILTER BAR & SHORTLIST TOGGLES
       * ===================================================================== */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Search candidate, skill, institution, or roll..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Quick Trade Multi-Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {availableTrades.slice(0, 3).map((trade) => {
              const isSelected = filters.selectedTrades.includes(trade);
              return (
                <button
                  key={trade}
                  type="button"
                  onClick={() => {
                    const next = isSelected
                      ? filters.selectedTrades.filter((t) => t !== trade)
                      : [...filters.selectedTrades, trade];
                    setFilters({ ...filters, selectedTrades: next });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{trade.split(" ")[0]}</span>
                </button>
              );
            })}

            {/* Advanced Filters Button */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                activeFiltersCount > 0
                  ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40"
                  : "bg-slate-950 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800/60"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Shortlist & Certified Toggles & 3D Perspective Toggle */}
          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
            <button
              type="button"
              id="recruiter-perspective-toggle-btn"
              onClick={toggleUiLayoutPreference}
              title={`Switch layout to ${uiLayoutPreference === "3d-depth" ? "Flat" : "Spatial 3D-Depth"}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                uiLayoutPreference === "3d-depth"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              {uiLayoutPreference === "3d-depth" ? (
                <Box className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{uiLayoutPreference === "3d-depth" ? "3D Depth" : "Flat UI"}</span>
            </button>

            <button
              type="button"
              onClick={() => setFilters({ ...filters, showShortlistOnly: !filters.showShortlistOnly })}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                filters.showShortlistOnly
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Shortlisted ({shortlistedIds.length})</span>
            </button>

            {comparisonCandidateIds.length >= 2 && (
              <button
                type="button"
                onClick={() => setIsComparisonModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare ({comparisonCandidateIds.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Applied Filter Pills Bar (if any active) */}
        {(activeFiltersCount > 0 || filters.searchQuery) && (
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mr-1">
              Active Filters:
            </span>

            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300">
                <span>"{filters.searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, searchQuery: "" })}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.selectedTrades.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/15 text-[11px] font-mono text-blue-300 border border-blue-500/30"
              >
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      selectedTrades: filters.selectedTrades.filter((x) => x !== t),
                    })
                  }
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.minCompositeScore > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-[11px] font-mono text-amber-300 border border-amber-500/30">
                <span>Score ≥ {filters.minCompositeScore}%</span>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, minCompositeScore: 0 })}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.minSafetyScore > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-[11px] font-mono text-emerald-300 border border-emerald-500/30">
                <span>Safety ≥ {filters.minSafetyScore}%</span>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, minSafetyScore: 0 })}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[10px] font-mono text-slate-400 hover:text-white underline ml-2 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* =====================================================================
       * CANDIDATE CARDS GRID
       * ===================================================================== */}
      {filteredCandidates.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Filter className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No candidates matched your filter criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting trade filters or lowering minimum score thresholds to see available talent.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${
          uiLayoutPreference === "3d-depth" ? "perspective-container-3d" : "perspective-container-flat"
        }`}>
          {filteredCandidates.map((candidate) => {
            const isCertified = candidate.verdict === "CERTIFIED_COMPETENT";
            const isShortlisted = shortlistedIds.includes(candidate.candidate_id);
            const isCompared = comparisonCandidateIds.includes(candidate.candidate_id);
            const hasPpeViolation = candidate.safety_score < 75;

            // 3D perspective transform classes
            const cardPerspectiveClass = uiLayoutPreference === "3d-depth"
              ? hasPpeViolation
                ? "hazard-card-3d border-rose-500/50 bg-gradient-to-b from-slate-900 via-rose-950/20 to-slate-900"
                : "candidate-card-3d bg-slate-900/80 border-slate-800 hover:border-slate-700"
              : "card-depth-flat bg-slate-900/80 border-slate-800 hover:border-slate-700";

            return (
              <div
                key={candidate.candidate_id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all space-y-4 group relative ${cardPerspectiveClass} ${
                  isCompared
                    ? "border-cyan-500/70 ring-1 ring-cyan-500/40"
                    : ""
                }`}
              >
                <div>
                  {/* Critical Safety Anomaly Alert Pill (Elevated in 3D Mode) */}
                  {hasPpeViolation && (
                    <div className="mb-3 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-between text-[11px] font-mono font-bold animate-pulse">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        CRITICAL PPE ANOMALY
                      </span>
                      <span className="text-[10px] bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-500/30">
                        {candidate.safety_score}% &lt; 75%
                      </span>
                    </div>
                  )}

                  {/* Candidate Header & Compare Checkbox */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                          {candidate.name}
                        </h3>
                        {isShortlisted && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/40 shrink-0">
                            SHORTLISTED
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 block mt-0.5 truncate">
                        {candidate.institution}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold ${
                        isCertified
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : hasPpeViolation
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      } ${uiLayoutPreference === "3d-depth" ? "float-metric-3d" : ""}`}>
                        {candidate.composite_score}%
                      </span>

                      {/* Compare Checkbox Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleCompareCandidate(candidate.candidate_id)}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                          isCompared
                            ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm shadow-cyan-500/30"
                            : "bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-300"
                        }`}
                        title={isCompared ? "Remove from comparison matrix" : "Add to side-by-side comparison"}
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Candidate Metrics Box */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Trade:</span>
                      <span className="text-slate-200 font-semibold">{candidate.trade}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">PPE Safety Adherence:</span>
                      <span className={`font-mono font-bold ${
                        hasPpeViolation ? "text-rose-400" : "text-emerald-400"
                      }`}>
                        {candidate.safety_score}% {hasPpeViolation ? "• CRITICAL FAIL" : ""}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Speed Benchmark:</span>
                      <span className="text-amber-300 font-mono text-[11px]">{candidate.practical_speed_rank}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Project Upload Tier:</span>
                      <span className="text-purple-300 font-mono text-[11px] font-bold">
                        {candidate.project_upload_tier || "Gold Tier (3+ Drills)"}
                      </span>
                    </div>
                  </div>

                  {/* Key Skills Tags */}
                  {candidate.key_skills && candidate.key_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {candidate.key_skills.slice(0, 3).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] font-mono text-slate-300 border border-slate-700/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 3-Second Verified Clip Proof Chip */}
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-blue-300 min-w-0">
                      <Video className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-[11px] font-medium truncate">{candidate.verified_clip_duration}</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold shrink-0">
                      VERIFIED
                    </span>
                  </div>
                </div>

                {/* Candidate Action Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenInspection(candidate)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span>Inspect Audit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleShortlist(candidate.candidate_id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1 ${
                      isShortlisted
                        ? "bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>{isShortlisted ? "Saved" : "Shortlist"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
       * PERSISTENT FLOATING COMPARISON DOCK
       * Pops up smoothly when 1 or more candidates are selected for comparison
       * ===================================================================== */}
      {comparisonCandidateIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom duration-300">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 ring-1 ring-cyan-500/20">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">
                {comparisonCandidateIds.length}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Candidate Comparison Dock</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-normal">
                    ({comparisonCandidateIds.length}/4 Selected)
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {comparisonCandidates.map((c) => c.name).join(", ")}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setComparisonCandidateIds([])}
                className="px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => setIsComparisonModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Side-by-Side</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
       * SIDE-BY-SIDE CANDIDATE COMPARISON MATRIX MODAL
       * ===================================================================== */}
      {isComparisonModalOpen && (
        <CandidateComparisonMatrix
          candidates={comparisonCandidates}
          onClose={() => setIsComparisonModalOpen(false)}
          onRemoveCandidate={toggleCompareCandidate}
          onShortlistToggle={toggleShortlist}
          shortlistedIds={shortlistedIds}
          onOpenDossier={(candidate) => {
            setIsComparisonModalOpen(false);
            handleOpenInspection(candidate);
          }}
        />
      )}

      {/* =====================================================================
       * ADVANCED MULTI-SELECT FILTER DRAWER
       * ===================================================================== */}
      <AdvancedFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={resetAllFilters}
        availableTrades={availableTrades}
        availableInstitutions={availableInstitutions}
        totalCandidatesCount={candidatePool.length}
        filteredCount={filteredCandidates.length}
      />

      {/* =====================================================================
       * CANDIDATE AUDIT PROOF MODAL (Self-Contained Inside Industry Hiring Portal)
       * ===================================================================== */}
      {inspectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setInspectedCandidate(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    NSQF AUDIT DOSSIER INSPECTION
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ID: {inspectedCandidate.candidate_id}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{inspectedCandidate.name}</span>
                  <span className="text-sm font-normal text-slate-400">({inspectedCandidate.trade})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Institution: {inspectedCandidate.institution} • Composite Score:{" "}
                  <strong className="text-emerald-400">{inspectedCandidate.composite_score}%</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleCompareCandidate(inspectedCandidate.candidate_id)}
                  className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    comparisonCandidateIds.includes(inspectedCandidate.candidate_id)
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>
                    {comparisonCandidateIds.includes(inspectedCandidate.candidate_id)
                      ? "In Comparison"
                      : "Add to Comparison"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleShortlist(inspectedCandidate.candidate_id)}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    shortlistedIds.includes(inspectedCandidate.candidate_id)
                      ? "bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>
                    {shortlistedIds.includes(inspectedCandidate.candidate_id)
                      ? "In Shortlist"
                      : "Add to Shortlist"}
                  </span>
                </button>
              </div>
            </div>

            {/* Video Player & Micro-Evidence Inspection */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-400" />
                  Verified Hands-On Execution Video (Frame-Accurate Dual Evidence)
                </span>
                <span className="font-mono text-cyan-400">
                  Time: {(activeMarkerMs / 1000).toFixed(1)}s / 36.0s
                </span>
              </div>

              {/* Millisecond Video Player */}
              <div className="rounded-xl overflow-hidden border border-slate-800">
                <MillisecondVideoPlayer
                  activeTimestampMs={activeMarkerMs}
                  onTimeUpdate={(ms) => setActiveMarkerMs(ms)}
                  timelineMarkers={sampleMarkers}
                  onMarkerClick={(marker) => setActiveMarkerMs(marker.timestamp_ms)}
                  highlightBoundingBox={[0.2, 0.3, 0.8, 0.7]}
                  activeLabel={inspectedCandidate.trade}
                />
              </div>

              {/* Clickable Verification Checkpoint Chips */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Audit Verification Checkpoints (Click to seek clip)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sampleMarkers.slice(0, 3).map((marker, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMarkerMs(marker.timestamp_ms)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        activeMarkerMs === marker.timestamp_ms
                          ? "bg-blue-500/20 border-blue-500/50 text-blue-200 shadow-md"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                        <span className="text-slate-300">{(marker.timestamp_ms / 1000).toFixed(1)}s</span>
                        <span className="text-emerald-400 text-[10px]">VERIFIED</span>
                      </div>
                      <div className="text-xs font-medium truncate text-white">{marker.label}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {marker.source.replace(/_/g, " ")} • {marker.status}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Verification Proof & Compliance Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dual-Evidence Safety Compliance */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Industrial Safety Compliance AI Report
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                    <span className="text-slate-300">1000V Dielectric Gloves</span>
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                    <span className="text-slate-300">Mains Isolation Protocol</span>
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                    <span className="text-slate-300">Zero-Potential Residual Voltage</span>
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 0.0V Confirmed
                    </span>
                  </div>
                </div>
              </div>

              {/* Official Credential & Cryptographic Badge */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Government NSQF Accreditation
                </h4>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                  <div className="text-[11px] text-slate-400">Accredited Authority:</div>
                  <div className="font-semibold text-white">
                    National Council for Vocational Education and Training (NCVET)
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 break-all pt-1">
                    Hash: SHA256:{inspectedCandidate.verified_badge}-VALIDATED
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono">
                Candidate authorized for immediate apprenticeship or plant interview.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => alert(`Official NSQF Audit Dossier PDF downloaded for ${inspectedCandidate.name}.`)}
                  className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Dossier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectedCandidate(null)}
                  className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default RecruiterPortalView;
