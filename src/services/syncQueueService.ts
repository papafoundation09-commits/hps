export interface QueuedMutation {
  id: string;
  actionType: "ADD_SOAP_NOTE" | "BOOK_APPOINTMENT" | "ADD_PRESCRIPTION" | "UPDATE_VITALS" | "ADD_LAB_ORDER";
  payload: any;
  timestamp: string;
  status: "pending" | "syncing" | "failed";
  retryCount: number;
}

export interface SoapDraft {
  visitOrPatientId: string;
  patientName?: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  icdCodes?: { code: string; description: string }[];
  cptCodes?: { code: string; description: string }[];
  lastSavedAt: string;
}

const SYNC_QUEUE_KEY = "carepulse_offline_sync_queue";
const SOAP_DRAFT_PREFIX = "carepulse_soap_draft_";

// --- SOAP Draft Management ---
export const saveSoapDraft = (
  visitOrPatientId: string,
  draft: Omit<SoapDraft, "visitOrPatientId" | "lastSavedAt">
): SoapDraft => {
  const fullDraft: SoapDraft = {
    visitOrPatientId,
    ...draft,
    lastSavedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  };
  localStorage.setItem(`${SOAP_DRAFT_PREFIX}${visitOrPatientId}`, JSON.stringify(fullDraft));
  return fullDraft;
};

export const getSoapDraft = (visitOrPatientId: string): SoapDraft | null => {
  const raw = localStorage.getItem(`${SOAP_DRAFT_PREFIX}${visitOrPatientId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

export const clearSoapDraft = (visitOrPatientId: string): void => {
  localStorage.removeItem(`${SOAP_DRAFT_PREFIX}${visitOrPatientId}`);
};

// --- Sync Queue Management ---
export const getSyncQueue = (): QueuedMutation[] => {
  const raw = localStorage.getItem(SYNC_QUEUE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const enqueueOfflineMutation = (
  actionType: QueuedMutation["actionType"],
  payload: any
): QueuedMutation => {
  const currentQueue = getSyncQueue();
  const newMutation: QueuedMutation = {
    id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    actionType,
    payload,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    status: "pending",
    retryCount: 0
  };

  const updated = [...currentQueue, newMutation];
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updated));
  return newMutation;
};

export const clearSyncQueue = (): void => {
  localStorage.removeItem(SYNC_QUEUE_KEY);
};

export const removeMutationFromQueue = (id: string): void => {
  const currentQueue = getSyncQueue();
  const updated = currentQueue.filter((item) => item.id !== id);
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updated));
};

export const updateMutationInQueue = (id: string, updates: Partial<QueuedMutation>): void => {
  const currentQueue = getSyncQueue();
  const updated = currentQueue.map((item) => (item.id === id ? { ...item, ...updates } : item));
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updated));
};
