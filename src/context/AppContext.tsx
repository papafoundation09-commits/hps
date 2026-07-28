import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  UserRole, 
  Doctor, 
  Appointment, 
  Prescription, 
  SoapNote, 
  LabOrder, 
  PharmacyItem, 
  Invoice, 
  SecureMessage, 
  PatientVitals, 
  Allergy, 
  Medication,
  DischargeSummary
} from "../types";
import { 
  INITIAL_DOCTORS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_LAB_ORDERS, 
  INITIAL_PHARMACY_STOCK, 
  INITIAL_INVOICES, 
  INITIAL_MESSAGES 
} from "../data/mockData";
import {
  QueuedMutation,
  SoapDraft,
  saveSoapDraft as saveSoapDraftToStorage,
  getSoapDraft as getSoapDraftFromStorage,
  clearSoapDraft as clearSoapDraftFromStorage,
  getSyncQueue,
  enqueueOfflineMutation,
  clearSyncQueue
} from "../services/syncQueueService";

interface AppContextType {
  // Current Perspective
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Active User Profile
  activeUserId: string;
  activeUserName: string;

  // Doctors
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doc: Doctor | null) => void;

  // Appointments
  appointments: Appointment[];
  bookAppointment: (apt: Omit<Appointment, "id" | "tokenNumber">) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;

  // Active Teleconsultation Room
  activeConsultationAppointment: Appointment | null;
  startTeleconsultation: (apt: Appointment) => void;
  endTeleconsultation: () => void;

  // Patient EMR Data
  patientVitals: PatientVitals;
  updateVitals: (vitals: Partial<PatientVitals>) => void;
  allergies: Allergy[];
  addAllergy: (allergy: Omit<Allergy, "id">) => void;
  medications: Medication[];
  prescriptions: Prescription[];
  addPrescription: (rx: Omit<Prescription, "id" | "qrVerificationCode">) => void;
  
  // SOAP Notes
  soapNotes: SoapNote[];
  addSoapNote: (note: Omit<SoapNote, "id">) => void;

  // Local SOAP Note Drafts
  autoSaveSoapDraft: (visitOrPatientId: string, draft: Omit<SoapDraft, "visitOrPatientId" | "lastSavedAt">) => void;
  loadSoapDraft: (visitOrPatientId: string) => SoapDraft | null;
  clearSoapDraft: (visitOrPatientId: string) => void;
  soapDraftTimestamps: { [visitOrPatientId: string]: string };

  // Sync Manager & Offline Queue State
  isOnline: boolean;
  isSimulatedOffline: boolean;
  setIsSimulatedOffline: (offline: boolean) => void;
  syncStatus: "Synced" | "Syncing" | "Offline";
  syncQueue: QueuedMutation[];
  processPendingSyncs: () => Promise<void>;
  isSyncModalOpen: boolean;
  setIsSyncModalOpen: (open: boolean) => void;

  // Lab & Radiology
  labOrders: LabOrder[];
  addLabOrder: (order: Omit<LabOrder, "id" | "barcode">) => void;
  updateLabStatus: (id: string, status: LabOrder["status"], resultSummary?: string, reportUrl?: string) => void;

  // Pharmacy Stock
  pharmacyItems: PharmacyItem[];
  updatePharmacyStock: (id: string, qtyChange: number) => void;

  // Invoices & Billing
  invoices: Invoice[];
  createInvoice: (inv: Omit<Invoice, "id">) => Invoice;
  updateInvoiceStatus: (id: string, status: Invoice["status"]) => void;

  // Secure Messaging
  messages: SecureMessage[];
  sendMessage: (receiverId: string, receiverName: string, receiverRole: UserRole, content: string, attachments?: SecureMessage["attachments"]) => void;

  // Discharge Summaries
  dischargeSummaries: DischargeSummary[];
  addDischargeSummary: (summary: Omit<DischargeSummary, "id" | "pdfGeneratedDate">) => void;

  // Modals & AI UI state
  isSymptomCheckerOpen: boolean;
  setIsSymptomCheckerOpen: (open: boolean) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  
  // Notification alert toasts
  toastNotification: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>("patient");
  const [activeUserId] = useState<string>("pat-1001");
  const [activeUserName] = useState<string>("Michael Chang");

  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(INITIAL_DOCTORS[0]);

  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [activeConsultationAppointment, setActiveConsultationAppointment] = useState<Appointment | null>(null);

  // Patient EMR state
  const [patientVitals, setPatientVitals] = useState<PatientVitals>({
    bpSystolic: 124,
    bpDiastolic: 82,
    heartRate: 74,
    temperatureF: 98.6,
    spO2: 99,
    respiratoryRate: 16,
    bmi: 24.2,
    weightKg: 78,
    heightCm: 180,
    bloodGroup: "O+",
    recordedAt: "Today, 08:30 AM",
  });

  const [allergies, setAllergies] = useState<Allergy[]>([
    { id: "alg-1", allergen: "Penicillin", severity: "Severe", reaction: "Anaphylactic rash & bronchospasm" },
    { id: "alg-2", allergen: "Peanuts", severity: "Moderate", reaction: "Hives & facial swelling" },
  ]);

  const [medications] = useState<Medication[]>([
    { id: "med-1", name: "Atorvastatin 20mg", dosage: "20 mg", frequency: "1x daily at night", duration: "30 days", startDate: "2026-07-20", prescribedBy: "Dr. Sarah Jenkins", status: "Active" },
    { id: "med-2", name: "Amlodipine 5mg", dosage: "5 mg", frequency: "1x daily in morning", duration: "30 days", startDate: "2026-07-20", prescribedBy: "Dr. Sarah Jenkins", status: "Active" },
  ]);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [soapNotes, setSoapNotes] = useState<SoapNote[]>([
    {
      id: "soap-101",
      visitId: "apt-2026-001",
      patientId: "pat-1001",
      doctorId: "doc-101",
      doctorName: "Dr. Sarah Jenkins, MD",
      date: "2026-07-20",
      subjective: "Patient reports 2-week history of mild exertional chest pressure during brisk walking.",
      objective: "BP: 124/82 mmHg, HR: 74 bpm. Normal S1/S2 heart sounds without murmurs. No peripheral edema.",
      assessment: "I10 - Essential hypertension, E78.5 - Hyperlipidemia. Low immediate cardiac ischemia risk.",
      plan: "Initiate Atorvastatin 20mg daily + Amlodipine 5mg daily. Order Comprehensive Cardiac Lipid Panel.",
      icdCodes: [{ code: "I10", description: "Essential hypertension" }, { code: "E78.5", description: "Hyperlipidemia" }],
      cptCodes: [{ code: "99214", description: "Office visit, 30-39 min" }]
    }
  ]);

  const [labOrders, setLabOrders] = useState<LabOrder[]>(INITIAL_LAB_ORDERS);
  const [pharmacyItems, setPharmacyItems] = useState<PharmacyItem[]>(INITIAL_PHARMACY_STOCK);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [messages, setMessages] = useState<SecureMessage[]>(INITIAL_MESSAGES);
  const [dischargeSummaries, setDischargeSummaries] = useState<DischargeSummary[]>([]);

  // Modals & UI State
  const [isSymptomCheckerOpen, setIsSymptomCheckerOpen] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Sync Manager & Offline Queue State
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [syncQueue, setSyncQueue] = useState<QueuedMutation[]>(getSyncQueue());
  const [soapDraftTimestamps, setSoapDraftTimestamps] = useState<{ [key: string]: string }>({});

  const effectiveOnline = isOnline && !isSimulatedOffline;
  const syncStatus: "Synced" | "Syncing" | "Offline" = !effectiveOnline
    ? "Offline"
    : syncQueue.length > 0
    ? "Syncing"
    : "Synced";

  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => {
      setToastNotification(null);
    }, 5000);
  };

  // Listen to window online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast("Network Connection Restored — Synchronizing pending offline mutations...");
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast("Offline Mode Active — Changes are being saved locally and queued for synchronization.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Trigger persistent offline alert when simulated offline toggles
  useEffect(() => {
    if (isSimulatedOffline) {
      showToast("Offline Mode Active — Network connection paused. EMR SOAP drafts and changes are stored locally and queued for background sync.");
    } else if (syncQueue.length > 0) {
      processPendingSyncs();
    }
  }, [isSimulatedOffline]);

  // SOAP Draft Management
  const autoSaveSoapDraft = (
    visitOrPatientId: string,
    draft: Omit<SoapDraft, "visitOrPatientId" | "lastSavedAt">
  ) => {
    const saved = saveSoapDraftToStorage(visitOrPatientId, draft);
    setSoapDraftTimestamps((prev) => ({
      ...prev,
      [visitOrPatientId]: saved.lastSavedAt
    }));
  };

  const loadSoapDraft = (visitOrPatientId: string): SoapDraft | null => {
    return getSoapDraftFromStorage(visitOrPatientId);
  };

  const clearSoapDraft = (visitOrPatientId: string) => {
    clearSoapDraftFromStorage(visitOrPatientId);
    setSoapDraftTimestamps((prev) => {
      const copy = { ...prev };
      delete copy[visitOrPatientId];
      return copy;
    });
  };

  // Background Sync Queue Processor
  const processPendingSyncs = async () => {
    const queue = getSyncQueue();
    if (queue.length === 0) return;

    showToast(`Syncing ${queue.length} pending offline mutations to Healthcare Cloud...`);

    // Simulate background processing time
    await new Promise((res) => setTimeout(res, 800));

    // Clear process queue
    clearSyncQueue();
    setSyncQueue([]);
    showToast("Background Synchronization Complete — All local offline records updated on Healthcare Server!");
  };

  const bookAppointment = (aptData: Omit<Appointment, "id" | "tokenNumber">) => {
    const newId = `apt-2026-${String(appointments.length + 1).padStart(3, "0")}`;
    const token = `CP-T${String(appointments.length + 1).padStart(2, "0")}`;
    const newApt: Appointment = {
      ...aptData,
      id: newId,
      tokenNumber: token,
      status: "Scheduled",
      roomId: aptData.consultType === "Video" || aptData.consultType === "Audio" ? `tele-room-${newId}` : undefined
    };

    setAppointments((prev) => [newApt, ...prev]);
    showToast(`Appointment successfully booked! Token: ${token}`);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    showToast(`Appointment ${id} status updated to ${status}`);
  };

  const startTeleconsultation = (apt: Appointment) => {
    setActiveConsultationAppointment(apt);
    updateAppointmentStatus(apt.id, "In Progress");
  };

  const endTeleconsultation = () => {
    if (activeConsultationAppointment) {
      updateAppointmentStatus(activeConsultationAppointment.id, "Completed");
    }
    setActiveConsultationAppointment(null);
    showToast("Teleconsultation session concluded.");
  };

  const updateVitals = (vitals: Partial<PatientVitals>) => {
    setPatientVitals((prev) => ({
      ...prev,
      ...vitals,
      recordedAt: "Just now"
    }));
    showToast("Patient vitals updated in EMR.");
  };

  const addAllergy = (allergy: Omit<Allergy, "id">) => {
    const newAllergy: Allergy = {
      ...allergy,
      id: `alg-${Date.now()}`
    };
    setAllergies((prev) => [...prev, newAllergy]);
    showToast(`Allergy alert added: ${allergy.allergen}`);
  };

  const addPrescription = (rxData: Omit<Prescription, "id" | "qrVerificationCode">) => {
    const newRx: Prescription = {
      ...rxData,
      id: `rx-${Date.now().toString().slice(-4)}`,
      qrVerificationCode: `CP-RX-${Date.now()}-AUTH-KEY-VERIFIED`
    };
    setPrescriptions((prev) => [newRx, ...prev]);
    showToast(`Digital Prescription generated with QR verification code.`);
  };

  const addSoapNote = (noteData: Omit<SoapNote, "id">) => {
    const newNote: SoapNote = {
      ...noteData,
      id: `soap-${Date.now().toString().slice(-4)}`
    };
    setSoapNotes((prev) => [newNote, ...prev]);

    // Clear local draft for this patient/visit if it exists
    if (noteData.visitId) clearSoapDraft(noteData.visitId);
    if (noteData.patientId) clearSoapDraft(noteData.patientId);

    // If offline, queue for background sync
    if (!effectiveOnline) {
      const q = enqueueOfflineMutation("ADD_SOAP_NOTE", newNote);
      setSyncQueue((prev) => [...prev, q]);
      showToast("Offline Mode: SOAP Note saved locally to queue! Will automatically synchronize once online.");
    } else {
      showToast("SOAP Note saved and synchronized to Patient EMR.");
    }
  };

  const addLabOrder = (orderData: Omit<LabOrder, "id" | "barcode">) => {
    const barcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const newOrder: LabOrder = {
      ...orderData,
      id: `lab-${Date.now().toString().slice(-3)}`,
      barcode
    };
    setLabOrders((prev) => [newOrder, ...prev]);
    showToast(`Lab/Radiology Order created. Specimen Barcode: ${barcode}`);
  };

  const updateLabStatus = (id: string, status: LabOrder["status"], resultSummary?: string, reportUrl?: string) => {
    setLabOrders((prev) =>
      prev.map((lab) =>
        lab.id === id
          ? {
              ...lab,
              status,
              resultSummary: resultSummary || lab.resultSummary,
              reportUrl: reportUrl || lab.reportUrl
            }
          : lab
      )
    );
    showToast(`Lab order ${id} status: ${status}`);
  };

  const updatePharmacyStock = (id: string, qtyChange: number) => {
    setPharmacyItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, stockQty: Math.max(0, item.stockQty + qtyChange) }
          : item
      )
    );
    showToast("Pharmacy inventory stock level updated.");
  };

  const createInvoice = (invData: Omit<Invoice, "id">) => {
    const newInv: Invoice = {
      ...invData,
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setInvoices((prev) => [newInv, ...prev]);
    showToast(`Billing Invoice ${newInv.id} generated.`);
    return newInv;
  };

  const updateInvoiceStatus = (id: string, status: Invoice["status"]) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );
    showToast(`Invoice ${id} updated to ${status}`);
  };

  const sendMessage = (
    receiverId: string, 
    receiverName: string, 
    receiverRole: UserRole, 
    content: string, 
    attachments?: SecureMessage["attachments"]
  ) => {
    const newMsg: SecureMessage = {
      id: `msg-${Date.now()}`,
      senderId: activeUserId,
      senderName: activeUserName,
      senderRole: currentRole,
      receiverId,
      receiverName,
      receiverRole,
      threadId: `thread-${activeUserId}-${receiverId}`,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments,
      isRead: true
    };
    setMessages((prev) => [...prev, newMsg]);
    showToast("Message sent securely.");
  };

  const addDischargeSummary = (summaryData: Omit<DischargeSummary, "id" | "pdfGeneratedDate">) => {
    const newSummary: DischargeSummary = {
      ...summaryData,
      id: `dc-${Date.now().toString().slice(-4)}`,
      pdfGeneratedDate: new Date().toISOString().split("T")[0]
    };
    setDischargeSummaries((prev) => [newSummary, ...prev]);
    showToast("Automated Clinical Discharge Summary generated.");
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeUserId,
        activeUserName,
        doctors,
        selectedDoctor,
        setSelectedDoctor,
        appointments,
        bookAppointment,
        updateAppointmentStatus,
        activeConsultationAppointment,
        startTeleconsultation,
        endTeleconsultation,
        patientVitals,
        updateVitals,
        allergies,
        addAllergy,
        medications,
        prescriptions,
        addPrescription,
        soapNotes,
        addSoapNote,
        autoSaveSoapDraft,
        loadSoapDraft,
        clearSoapDraft,
        soapDraftTimestamps,
        isOnline,
        isSimulatedOffline,
        setIsSimulatedOffline,
        syncStatus,
        syncQueue,
        processPendingSyncs,
        isSyncModalOpen,
        setIsSyncModalOpen,
        labOrders,
        addLabOrder,
        updateLabStatus,
        pharmacyItems,
        updatePharmacyStock,
        invoices,
        createInvoice,
        updateInvoiceStatus,
        messages,
        sendMessage,
        dischargeSummaries,
        addDischargeSummary,
        isSymptomCheckerOpen,
        setIsSymptomCheckerOpen,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        toastNotification,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
