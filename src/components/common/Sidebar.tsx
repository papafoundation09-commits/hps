import React from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppContext";
import { 
  LayoutDashboard, 
  Calendar, 
  Video, 
  FileText, 
  Activity, 
  FlaskConical, 
  Pill, 
  CreditCard, 
  MessageSquare, 
  UserCheck, 
  Building2, 
  Settings, 
  Award, 
  Shield, 
  Users,
  FolderKanban,
  FileSpreadsheet,
  Stethoscope,
  BellRing,
  GitPullRequest
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
  activeTab: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, activeTab }) => {
  const { currentRole } = useApp();
  const { t } = useTranslation();

  if (activeTab === "public") return null;

  // Define sidebar navigation items based on current role perspective
  const getNavItems = () => {
    switch (currentRole) {
      case "patient":
        return [
          { id: "overview", label: t("navDashboard") || "Dashboard", icon: LayoutDashboard },
          { id: "appointments", label: "Book & Appointments", icon: Calendar },
          { id: "notifications", label: "SMS & Email Reminders", icon: BellRing },
          { id: "teleconsult", label: t("teleconsultation") || "Teleconsultation Room", icon: Video },
          { id: "emr", label: "My Medical Records", icon: FileText },
          { id: "prescriptions", label: t("prescriptions") || "Digital Prescriptions", icon: Pill },
          { id: "lab_reports", label: t("labResults") || "Lab & Radiology", icon: FlaskConical },
          { id: "billing", label: "Insurance & Wallet", icon: CreditCard },
          { id: "messages", label: "Doctor Messages", icon: MessageSquare },
        ];
      case "doctor":
        return [
          { id: "overview", label: "Doctor Dashboard", icon: LayoutDashboard },
          { id: "schedule", label: "Availability Calendar", icon: Calendar },
          { id: "referrals", label: t("referralPipeline") || "Specialist Referrals", icon: GitPullRequest },
          { id: "waitlist", label: t("virtualWaitlist") || "Virtual Walk-in Queue", icon: Users },
          { id: "notifications", label: "Patient Reminders", icon: BellRing },
          { id: "queue", label: "Live Queue & Patients", icon: UserCheck },
          { id: "teleconsult", label: "Consultation Room", icon: Video },
          { id: "emr_editor", label: "SOAP & EMR Editor", icon: FileText },
          { id: "prescriptions", label: "Issue Prescriptions", icon: Pill },
          { id: "lab_orders", label: "Order Lab/Radiology", icon: FlaskConical },
          { id: "messages", label: "Patient & Staff Chat", icon: MessageSquare },
        ];
      case "hospital_admin":
        return [
          { id: "overview", label: "Admin Operations", icon: LayoutDashboard },
          { id: "waitlist", label: t("virtualWaitlist") || "Virtual Waitlist", icon: Users },
          { id: "referrals", label: t("referralPipeline") || "Referral Pipeline", icon: GitPullRequest },
          { id: "notifications", label: "SMS & Email Engine", icon: BellRing },
          { id: "departments", label: "Departments & Beds", icon: Building2 },
          { id: "staff", label: "Doctors & Staff", icon: Users },
          { id: "analytics", label: "Hospital Analytics", icon: Activity },
          { id: "billing_admin", label: "Financial Management", icon: CreditCard },
          { id: "pharmacy_admin", label: "Pharmacy Inventory", icon: Pill },
          { id: "lab_admin", label: "Diagnostic Services", icon: FlaskConical },
        ];
      case "receptionist":
        return [
          { id: "overview", label: "Reception Desk", icon: LayoutDashboard },
          { id: "waitlist", label: t("virtualWaitlist") || "Virtual Waitlist", icon: Users },
          { id: "referrals", label: "Referral Pipeline", icon: GitPullRequest },
          { id: "patient_registration", label: "Walk-in Registration", icon: UserCheck },
          { id: "token_queue", label: "OPD Token Queue", icon: FolderKanban },
          { id: "billing_quick", label: "Quick Checkout & POS", icon: CreditCard },
        ];
      case "lab_tech":
        return [
          { id: "overview", label: "Lab Workstation", icon: LayoutDashboard },
          { id: "sample_tracking", label: "Sample Barcoding", icon: FlaskConical },
          { id: "dicom_upload", label: "DICOM PACS Radiology", icon: Activity },
          { id: "report_validation", label: "Report Validation", icon: FileCheckIcon },
        ];
      case "pharmacist":
        return [
          { id: "overview", label: "Pharmacy Dashboard", icon: LayoutDashboard },
          { id: "dispense", label: "Prescription Dispenser", icon: Pill },
          { id: "inventory", label: "Stock & Barcode Search", icon: FileSpreadsheet },
        ];
      case "insurance_staff":
        return [
          { id: "overview", label: "Billing & Claims Portal", icon: LayoutDashboard },
          { id: "claims_queue", label: "Insurance Claims", icon: Shield },
          { id: "invoices", label: "Master Invoices & GST", icon: CreditCard },
        ];
      default:
        return [
          { id: "overview", label: "Dashboard", icon: LayoutDashboard },
          { id: "appointments", label: "Appointments", icon: Calendar },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shrink-0 hidden md:flex">
      <div>
        {/* Current Active Role Badge */}
        <div className="mb-6 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Current Portal Perspective</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="font-semibold text-sm text-white capitalize">
              {currentRole.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-md shadow-cyan-600/20"
                    : "hover:bg-slate-800 hover:text-white text-slate-300"
                }`}
                id={`sidebar-link-${item.id}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info Card */}
      <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-xs text-cyan-200">
        <div className="flex items-center gap-2 mb-1">
          <Stethoscope className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white text-[11px]">srivoratech HIPAA Compliant</span>
        </div>
        <p className="text-[10px] text-cyan-300/80 leading-relaxed">
          256-bit AES encrypted teleconsultation streams & FHIR compliant EMR records.
        </p>
      </div>
    </aside>
  );
};

// Helper icon component for lab report validation
function FileCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}
