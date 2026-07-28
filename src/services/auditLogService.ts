import { UserRole } from "../types";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: "EMR_UPDATE" | "PRESCRIPTION_CREATE" | "PRESCRIPTION_VIEW" | "PATIENT_RECORD_VIEW" | "DISCHARGE_SUMMARY_CREATE" | "LAB_ORDER_CREATE" | "SYSTEM_LOGIN" | "SESSION_TIMEOUT";
  resourceType: "Patient EMR" | "Prescription" | "Lab Order" | "Discharge Summary" | "User Session";
  resourceId: string;
  patientName?: string;
  ipAddress: string;
  details: string;
  complianceFlag: "HIPAA Compliant" | "Access Alert" | "Standard Action";
}

const AUDIT_LOGS_STORAGE_KEY = "srivoratech_hipaa_audit_logs";

export const getAuditLogs = (): AuditLogEntry[] => {
  const stored = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
  }

  // Initial seeded audit logs for HIPAA compliance demonstration
  const initialLogs: AuditLogEntry[] = [
    {
      id: "audit-1001",
      timestamp: "2026-07-28 09:14:22",
      userId: "doc-101",
      userName: "Dr. Sarah Jenkins, MD",
      userRole: "doctor",
      action: "EMR_UPDATE",
      resourceType: "Patient EMR",
      resourceId: "pat-1001",
      patientName: "Michael Chang",
      ipAddress: "192.168.1.45 (Encrypted Gateway)",
      details: "Updated SOAP Note Subjective & Assessment for Essential Hypertension (ICD-10 I10).",
      complianceFlag: "HIPAA Compliant"
    },
    {
      id: "audit-1002",
      timestamp: "2026-07-28 08:45:10",
      userId: "doc-101",
      userName: "Dr. Sarah Jenkins, MD",
      userRole: "doctor",
      action: "PRESCRIPTION_CREATE",
      resourceType: "Prescription",
      resourceId: "rx-2001",
      patientName: "Michael Chang",
      ipAddress: "192.168.1.45 (Encrypted Gateway)",
      details: "Issued digital Rx for Atorvastatin 20mg & Lisinopril 10mg. QR verification token attached.",
      complianceFlag: "HIPAA Compliant"
    },
    {
      id: "audit-1003",
      timestamp: "2026-07-28 08:12:05",
      userId: "pharm-301",
      userName: "Robert Vance, PharmD",
      userRole: "pharmacist",
      action: "PRESCRIPTION_VIEW",
      resourceType: "Prescription",
      resourceId: "rx-2001",
      patientName: "Michael Chang",
      ipAddress: "192.168.1.88",
      details: "Accessed prescription record for dispensing validation. Status set to 'Filled'.",
      complianceFlag: "HIPAA Compliant"
    },
    {
      id: "audit-1004",
      timestamp: "2026-07-27 16:30:00",
      userId: "admin-01",
      userName: "David Miller (Hospital Admin)",
      userRole: "hospital_admin",
      action: "PATIENT_RECORD_VIEW",
      resourceType: "Patient EMR",
      resourceId: "pat-1002",
      patientName: "Sarah Connor",
      ipAddress: "192.168.1.12",
      details: "Administrative access to verify billing & insurance claim code mapping.",
      complianceFlag: "HIPAA Compliant"
    },
    {
      id: "audit-1005",
      timestamp: "2026-07-27 14:15:33",
      userId: "doc-102",
      userName: "Dr. Robert Chen, MD",
      userRole: "doctor",
      action: "LAB_ORDER_CREATE",
      resourceType: "Lab Order",
      resourceId: "lab-401",
      patientName: "Sarah Connor",
      ipAddress: "192.168.1.52",
      details: "Submitted priority Lipid Panel & HbA1c Lab Requisition to Central BioLab.",
      complianceFlag: "HIPAA Compliant"
    }
  ];

  localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(initialLogs));
  return initialLogs;
};

export const recordAuditLog = (
  userId: string,
  userName: string,
  userRole: UserRole,
  action: AuditLogEntry["action"],
  resourceType: AuditLogEntry["resourceType"],
  resourceId: string,
  details: string,
  patientName?: string,
  complianceFlag: AuditLogEntry["complianceFlag"] = "HIPAA Compliant"
): AuditLogEntry => {
  const currentLogs = getAuditLogs();
  const now = new Date();
  const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${now.toLocaleTimeString([], { hour12: false })}`;

  const newEntry: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    timestamp: formattedTime,
    userId,
    userName,
    userRole,
    action,
    resourceType,
    resourceId,
    patientName,
    ipAddress: "192.168.1." + Math.floor(10 + Math.random() * 80) + " (SSL Encrypted)",
    details,
    complianceFlag
  };

  const updated = [newEntry, ...currentLogs];
  localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
};
