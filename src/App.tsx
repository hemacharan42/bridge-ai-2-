import React, { useState, useEffect } from "react";
import { AssessmentProvider, useAssessment } from "./store/assessmentContext";
import { ScorecardProvider } from "./store/ScorecardContext";
import { ScorecardModal } from "./components/ScorecardModal";
import { BridgeHomePage } from "./components/BridgeHomePage";
import { InteractiveSplitLogin } from "./components/auth/InteractiveSplitLogin";
import { StudentLoginPage } from "./components/auth/StudentLoginPage";
import { PostLoginShell, PostLoginView } from "./components/layout/PostLoginShell";
import { StudentDashboard } from "./components/dashboard/StudentDashboard";
import { SideBySideAssessment } from "./components/video-assessment/SideBySideAssessment";
import { AssessmentStudio } from "./components/AssessmentStudio";
import { ScorecardView } from "./components/ScorecardView";
import { CohortHeatmapView } from "./components/CohortHeatmapView";
import { FacultyQueueView } from "./components/FacultyQueueView";
import { RecruiterPortalView } from "./components/RecruiterPortalView";
import { StudentOnboardingModal } from "./components/StudentOnboardingModal";

type PreLoginRoute = "landing" | "student-login" | "employee-login";

const MainLayout: React.FC = () => {
  const { currentUser } = useAssessment();
  const [preLoginRoute, setPreLoginRoute] = useState<PreLoginRoute>("landing");
  const [postLoginView, setPostLoginView] = useState<PostLoginView>("dashboard");
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [studentInitialSubView, setStudentInitialSubView] = useState<"OVERVIEW" | "COURSE_INTERFACE" | "TEST_CASE">("OVERVIEW");

  // Synchronize initial post-login view based on user role
  useEffect(() => {
    if (currentUser?.role === "employee") {
      setPostLoginView("recruiter");
    } else if (currentUser?.role === "faculty") {
      setPostLoginView("queue");
    } else if (currentUser?.role === "student") {
      setPostLoginView("dashboard");
    }
  }, [currentUser?.role]);

  // Authentication success handler
  const handleLoginSuccess = (isFirstTime: boolean) => {
    if (isFirstTime) {
      setShowOnboarding(true);
      setPostLoginView("dashboard");
    } else {
      if (currentUser?.role === "employee") {
        setPostLoginView("recruiter");
      } else if (currentUser?.role === "faculty") {
        setPostLoginView("queue");
      } else {
        setPostLoginView("dashboard");
      }
    }
  };

  // =========================================================================
  // PRE-LOGIN STATE: Landing Page (/) or Role Split Logins
  // =========================================================================
  if (!currentUser) {
    if (preLoginRoute === "student-login") {
      return (
        <StudentLoginPage
          onSuccess={handleLoginSuccess}
          onBackToHome={() => setPreLoginRoute("landing")}
        />
      );
    }

    if (preLoginRoute === "employee-login") {
      return (
        <InteractiveSplitLogin
          portalType="employee"
          onSuccess={handleLoginSuccess}
          onBackToHome={() => setPreLoginRoute("landing")}
        />
      );
    }

    // Default Pre-Login Landing Page (/)
    return (
      <BridgeHomePage
        onNavigateToStudentLogin={() => setPreLoginRoute("student-login")}
        onNavigateToEmployeeLogin={() => setPreLoginRoute("employee-login")}
        onDirectLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // =========================================================================
  // RECRUITER / EMPLOYEE PORTAL: EXCLUSIVELY INDUSTRY HIRING PORTAL
  // Student dashboard and all side-by-side assessment views are completely excluded.
  // =========================================================================
  if (currentUser.role === "employee") {
    return (
      <PostLoginShell currentView="recruiter" onSelectView={() => setPostLoginView("recruiter")}>
        <RecruiterPortalView />
      </PostLoginShell>
    );
  }

  // =========================================================================
  // POST-LOGIN STATE: Student and Faculty Platforms
  // =========================================================================
  return (
    <PostLoginShell currentView={postLoginView} onSelectView={setPostLoginView}>
      {postLoginView === "dashboard" && (
        <StudentDashboard
          key={studentInitialSubView}
          initialSubView={studentInitialSubView}
          onStartAssessment={() => setPostLoginView("side-by-side")}
          onViewScorecard={() => setPostLoginView("scorecard")}
          onOpenSideBySide={() => setPostLoginView("side-by-side")}
          onOpenNewCourse={() => setShowOnboarding(true)}
        />
      )}

      {postLoginView === "side-by-side" && (
        <SideBySideAssessment
          onNavigateToScorecard={() => setPostLoginView("scorecard")}
        />
      )}

      {postLoginView === "studio" && (
        <AssessmentStudio
          onAssessmentComplete={() => setPostLoginView("scorecard")}
        />
      )}

      {postLoginView === "scorecard" && (
        <ScorecardView
          onNavigateToQueue={() => setPostLoginView("queue")}
          onNavigateToStudio={() => setPostLoginView("side-by-side")}
        />
      )}

      {postLoginView === "heatmap" && (
        <CohortHeatmapView />
      )}

      {postLoginView === "queue" && (
        <FacultyQueueView />
      )}

      {/* First-Time Course Selection Modal for Students */}
      <StudentOnboardingModal
        isOpen={showOnboarding}
        onComplete={(action) => {
          setShowOnboarding(false);
          setPostLoginView("dashboard");
          if (action === "join-course") {
            setStudentInitialSubView("COURSE_INTERFACE");
          } else if (action === "test-case") {
            setStudentInitialSubView("TEST_CASE");
          } else {
            setStudentInitialSubView("OVERVIEW");
          }
        }}
      />
    </PostLoginShell>
  );
};

export default function App() {
  return (
    <AssessmentProvider>
      <ScorecardProvider>
        <MainLayout />
        <ScorecardModal />
      </ScorecardProvider>
    </AssessmentProvider>
  );
}
