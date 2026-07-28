import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { INITIAL_APPOINTMENTS, INITIAL_DOCTORS } from "../data/mockData";
import { Appointment, SoapNote, Doctor } from "../types";

const FALLBACK_SOAP_NOTES: SoapNote[] = [
  {
    id: "soap-1001",
    visitId: "apt-1",
    patientId: "pat-1001",
    doctorId: "doc-101",
    doctorName: "Dr. Sarah Jenkins, MD",
    date: "2026-07-28",
    subjective: "Patient reports exertional fatigue and mild retrosternal pressure after tennis.",
    objective: "BP: 124/82 mmHg, HR: 74 bpm. Normal chest auscultation.",
    assessment: "Essential Hypertension (ICD-10 I10), Hyperlipidemia (ICD-10 E78.5)",
    plan: "Atorvastatin 20mg daily at bedtime, follow up in 4 weeks.",
    icdCodes: [{ code: "I10", description: "Essential hypertension" }],
    cptCodes: [{ code: "99214", description: "Office visit 30-39 min" }]
  }
];

// Mock API service layer with network simulation
export const fetchAppointmentsApi = async (): Promise<Appointment[]> => {
  // Simulate network latency / offline fallback
  const cached = localStorage.getItem("carepulse_appointments_cache");
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // fallback
    }
  }
  localStorage.setItem("carepulse_appointments_cache", JSON.stringify(INITIAL_APPOINTMENTS));
  return INITIAL_APPOINTMENTS;
};

export const fetchSoapNotesApi = async (patientId?: string): Promise<SoapNote[]> => {
  const cached = localStorage.getItem("carepulse_soap_notes_cache");
  let notes: SoapNote[] = FALLBACK_SOAP_NOTES;
  if (cached) {
    try {
      notes = JSON.parse(cached);
    } catch (e) {
      notes = FALLBACK_SOAP_NOTES;
    }
  } else {
    localStorage.setItem("carepulse_soap_notes_cache", JSON.stringify(FALLBACK_SOAP_NOTES));
  }

  if (patientId) {
    return notes.filter((n) => n.patientId === patientId);
  }
  return notes;
};

export const fetchDoctorsApi = async (): Promise<Doctor[]> => {
  const cached = localStorage.getItem("carepulse_doctors_cache");
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }
  localStorage.setItem("carepulse_doctors_cache", JSON.stringify(INITIAL_DOCTORS));
  return INITIAL_DOCTORS;
};

// React Query Hooks with Offline Caching
export function useAppointmentsQuery() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointmentsApi,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours persistence
    networkMode: "offlineFirst"
  });
}

export function usePatientEmrQuery(patientId?: string) {
  return useQuery({
    queryKey: ["soap_notes", patientId || "all"],
    queryFn: () => fetchSoapNotesApi(patientId),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60 * 24,
    networkMode: "offlineFirst"
  });
}

export function useDoctorsQuery() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctorsApi,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24,
    networkMode: "offlineFirst"
  });
}

export function useAddSoapNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newNote: SoapNote) => {
      const existing = await fetchSoapNotesApi();
      const updated = [newNote, ...existing];
      localStorage.setItem("carepulse_soap_notes_cache", JSON.stringify(updated));
      return updated;
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["soap_notes", "all"], updatedData);
      queryClient.invalidateQueries({ queryKey: ["soap_notes"] });
    }
  });
}
