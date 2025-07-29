import React, { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Header } from "./components/Header";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { ChatInterface } from "./components/ChatInterface";
import { CulturalDashboard } from "./components/CulturalDashboard";
import { TravelPlanning } from "./components/TravelPlanning";
import { LiveRecommendations } from "./components/LiveRecommendations";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { UserManagement } from "./components/UserManagement";
import { AuthScreen } from "./components/AuthScreen";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAnalytics } from "./hooks/useAnalytics";
import { useAuthContext } from "./hooks/useAuth";

function AppContent() {
  const [currentView, setCurrentView] = useState("home");
  const { isAuthenticated, isLoading } = useAuthContext();
  const {
    trackPageView,
    trackInteraction,
    trackConversion,
    trackEngagement,
    trackDestinationView,
  } = useAnalytics();

  const handleStartOnboarding = () => {
    trackInteraction("start_onboarding");
    setCurrentView("onboarding");
  };

  const handleOnboardingComplete = () => {
    trackConversion("onboarding_completed", {
      preferences: ["Indie Folk", "Nordic Cuisine", "Independent Cinema"],
    });
    setCurrentView("dashboard");
  };

  const handleSelectDestination = (destinationId: string) => {
    trackDestinationView(destinationId, "Copenhagen");
    trackInteraction("select_destination", { destinationId });
    setCurrentView("live");
  };

  const handleViewChange = (view: string) => {
    trackPageView(view);
    setCurrentView(view);
  };

  // Track initial page view
  useEffect(() => {
    if (isAuthenticated) {
      trackPageView("home");
    }
  }, [trackPageView, isAuthenticated]);

  // Track engagement events
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleScroll = () => {
      trackEngagement("scroll", { scrollY: window.scrollY });
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" || target.closest("button")) {
        trackInteraction("button_click", {
          buttonText: target.textContent || "Unknown",
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
    };
  }, [trackEngagement, trackInteraction, isAuthenticated]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (isAuthenticated) {
    return <AuthScreen />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return <WelcomeScreen onStartOnboarding={handleStartOnboarding} />;
      case "onboarding":
        return <ChatInterface onComplete={handleOnboardingComplete} />;
      case "dashboard":
        return <CulturalDashboard />;
      case "travel":
        return <TravelPlanning onSelectDestination={handleSelectDestination} />;
      case "live":
        return <LiveRecommendations />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "users":
        return <UserManagement />;
      default:
        return <WelcomeScreen onStartOnboarding={handleStartOnboarding} />;
    }
  };

  return (
    <Layout>
      <Header currentView={currentView} onViewChange={handleViewChange} />
      {renderCurrentView()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
