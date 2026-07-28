import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/common/Header";
import { Sidebar } from "./components/common/Sidebar";
import { PublicWebsite } from "./components/public/PublicWebsite";
import { PatientPortal } from "./components/patient/PatientPortal";
import { DoctorPortal } from "./components/doctor/DoctorPortal";
import { HospitalAdminPortal } from "./components/hospital/HospitalAdminPortal";
import { TeleconsultationRoom } from "./components/doctor/TeleconsultationRoom";
import { SecureMessagingPortal } from "./components/messaging/SecureMessagingPortal";
import { SymptomCheckerModal } from "./components/ai/SymptomCheckerModal";
import { AIAssistantDrawer } from "./components/ai/AIAssistantDrawer";
import { InactivityTimerModal } from "./components/common/InactivityTimerModal";
import { GlobalSearchModal } from "./components/common/GlobalSearchModal";
import { useInactivityTimer } from "./hooks/useInactivityTimer";
import { Appointment, Doctor } from "./types";

function MainApp() {
  const { 
    currentRole, 
    setCurrentRole,
    activeUserName, 
    setIsSymptomCheckerOpen, 
    startTeleconsultation, 
    activeConsultationAppointment,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>("public");
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);

  // Global HIPAA Inactivity Timer
  const {
    isWarningOpen,
    secondsRemaining,
    handleExtendSession,
    handleLogoutNow
  } = useInactivityTimer({
    inactivityTimeoutMs: 120000, // 2 minutes inactivity timeout
    warningDurationSec: 30,
    currentRole,
    userName: activeUserName,
    onLogout: () => {
      setCurrentRole("patient");
      setActiveTab("public");
    },
    showToast
  });

  const handleBookDoctorFromPublic = (doctor: Doctor) => {
    setActiveTab("dashboard");
    setActiveSection("appointments");
  };

  const handleStartTeleconsult = (apt: Appointment) => {
    startTeleconsultation(apt);
    setActiveTab("teleconsult");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white bg-grid-pattern">
      {/* Top Header Navigation */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
      />

      {/* Main Body Layout */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} activeTab={activeTab} />

        {/* Content Region */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {activeTab === "public" && (
            <PublicWebsite
              onBookDoctor={handleBookDoctorFromPublic}
              onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)}
            />
          )}

          {activeTab === "messaging" && <SecureMessagingPortal />}

          {activeTab === "teleconsult" && activeConsultationAppointment && (
            <TeleconsultationRoom
              appointment={activeConsultationAppointment}
              onLeaveCall={() => setActiveTab("dashboard")}
            />
          )}

          {activeTab === "dashboard" && (
            <>
              {currentRole === "patient" && (
                <PatientPortal
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  onJoinTeleconsult={handleStartTeleconsult}
                />
              )}

              {currentRole === "doctor" && (
                <DoctorPortal
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  onStartTeleconsult={handleStartTeleconsult}
                />
              )}

              {(currentRole === "hospital_admin" ||
                currentRole === "receptionist" ||
                currentRole === "lab_tech" ||
                currentRole === "pharmacist" ||
                currentRole === "insurance_staff") && (
                <HospitalAdminPortal activeSection={activeSection} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Global AI Modals, Search & Inactivity Security Lock */}
      <SymptomCheckerModal />
      <AIAssistantDrawer />
      <InactivityTimerModal
        isWarningOpen={isWarningOpen}
        secondsRemaining={secondsRemaining}
        onExtendSession={handleExtendSession}
        onLogoutNow={handleLogoutNow}
      />
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onSelectDoctor={() => {
          setActiveTab("public");
        }}
        onSelectPatient={() => {
          setActiveTab("dashboard");
          setActiveSection("emr");
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
