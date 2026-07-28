import React from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";
import { SyncStatusModal } from "./SyncStatusModal";
import { LanguageSelector } from "./LanguageSelector";
import { 
  Stethoscope, 
  Bot, 
  Bell, 
  ShieldAlert, 
  User, 
  Sparkles,
  PhoneCall,
  Activity,
  Layers,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  Search,
  GitPullRequest,
  Users
} from "lucide-react";

export const Header: React.FC<{ 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  onOpenGlobalSearch?: () => void;
}> = ({
  activeTab,
  setActiveTab,
  onOpenGlobalSearch
}) => {
  const { 
    currentRole, 
    setCurrentRole, 
    setIsSymptomCheckerOpen, 
    setIsAiDrawerOpen, 
    toastNotification,
    activeConsultationAppointment,
    appointments,
    syncStatus,
    syncQueue,
    isSyncModalOpen,
    setIsSyncModalOpen,
    isSimulatedOffline
  } = useApp();

  const roleOptions: { role: UserRole; label: string; icon: string }[] = [
    { role: "patient", label: "Patient Portal", icon: "👤" },
    { role: "doctor", label: "Doctor Portal", icon: "🩺" },
    { role: "hospital_admin", label: "Hospital Admin", icon: "🏥" },
    { role: "receptionist", label: "Reception Queue", icon: "📋" },
    { role: "lab_tech", label: "Lab & Radiology", icon: "🔬" },
    { role: "pharmacist", label: "Pharmacy Stock", icon: "💊" },
    { role: "insurance_staff", label: "Billing & Claims", icon: "💳" },
  ];

  const waitingCount = appointments.filter((a) => a.status === "Waiting Room").length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md">
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="bg-cyan-600 text-white text-xs font-semibold px-4 py-1.5 text-center flex items-center justify-center gap-2 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          <span>{toastNotification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Main Nav Jump */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab("public")}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
            id="brand-logo-button"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
                srivoratech <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-medium px-1.5 py-0.5 rounded">EMR 3.0</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Teleconsultation & Hospital OS</p>
            </div>
          </button>

          {/* Main Top Nav Links (Scrollable on mobile) */}
          <nav className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs font-medium overflow-x-auto max-w-[200px] sm:max-w-none">
            <button
              onClick={() => setActiveTab("public")}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === "public" ? "bg-cyan-500 text-white font-semibold" : "text-slate-300 hover:text-white"
              }`}
              id="nav-public-home"
            >
              Public Home
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === "dashboard" ? "bg-cyan-500 text-white font-semibold" : "text-slate-300 hover:text-white"
              }`}
              id="nav-portal-dashboard"
            >
              Active Portal
            </button>
            <button
              onClick={() => setActiveTab("messaging")}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === "messaging" ? "bg-cyan-500 text-white font-semibold" : "text-slate-300 hover:text-white"
              }`}
              id="nav-messaging"
            >
              Messages
            </button>
          </nav>
        </div>

        {/* Role Quick Switcher & AI Tools */}
        <div className="flex items-center gap-3">
          {/* Sync Status Badge Indicator */}
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all shadow-sm ${
              syncStatus === "Synced"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                : syncStatus === "Syncing"
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 animate-pulse"
                : "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
            }`}
            title="Click to view background mutation sync queue & browser storage persistence details"
            id="sync-status-header-badge"
          >
            {syncStatus === "Synced" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : syncStatus === "Syncing" ? (
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="hidden sm:inline">{syncStatus}</span>
            {syncQueue.length > 0 && (
              <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 text-[10px] rounded-full font-extrabold font-mono">
                {syncQueue.length}
              </span>
            )}
          </button>

          {/* Active Call Alert Badge */}
          {activeConsultationAppointment && (
            <button
              onClick={() => setActiveTab("teleconsult")}
              className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-2 animate-pulse"
              id="active-teleconsult-call-badge"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Live Video Call Active
            </button>
          )}

          {/* i18n Language Selector */}
          <LanguageSelector />

          {/* Global Patient & Doctor Directory Search Launcher */}
          {onOpenGlobalSearch && (
            <button
              onClick={onOpenGlobalSearch}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
              title="Search Doctors & Patients (Matches highlighted)"
              id="global-search-header-btn"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline">Directory Search</span>
            </button>
          )}

          {/* AI Symptom Checker Launcher */}
          <button
            onClick={() => setIsSymptomCheckerOpen(true)}
            className="hidden sm:flex items-center gap-1.5 bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-sm"
            id="ai-symptom-checker-header-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Symptom Triage</span>
          </button>

          {/* AI Clinical Assistant Drawer Launcher */}
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
            title="Open AI Medical Assistant"
            id="ai-clinical-drawer-btn"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">srivoratech AI</span>
          </button>

          {/* Perspective Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-lg p-1">
            <Layers className="w-3.5 h-3.5 text-slate-400 ml-1 hidden sm:inline" />
            <select
              value={currentRole}
              onChange={(e) => {
                setCurrentRole(e.target.value as UserRole);
                setActiveTab("dashboard");
              }}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer py-1 pr-1"
              id="role-perspective-select"
            >
              {roleOptions.map((opt) => (
                <option key={opt.role} value={opt.role} className="bg-slate-900 text-slate-100">
                  {opt.icon} Switch: {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Queue Badge */}
          {waitingCount > 0 && (
            <div 
              className="relative bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer"
              title={`${waitingCount} patients waiting in virtual queue`}
              onClick={() => setActiveTab("dashboard")}
              id="waiting-queue-badge"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>Queue: {waitingCount}</span>
            </div>
          )}

          {/* Emergency SOS Call trigger */}
          <button
            onClick={() => alert("Connecting to srivoratech 24/7 Emergency Dispatch Center (1-800-SRIVORA-911)...")}
            className="bg-red-600/90 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-sm"
            title="Emergency Hotline"
            id="emergency-call-header-btn"
          >
            <PhoneCall className="w-4 h-4" />
          </button>
        </div>
      </div>

      <SyncStatusModal isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} />
    </header>
  );
};
