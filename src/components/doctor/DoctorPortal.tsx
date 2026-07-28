import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Appointment, SoapNote } from "../../types";
import { InteractiveDoctorSchedule } from "./InteractiveDoctorSchedule";
import { NotificationReminderPanel } from "../common/NotificationReminderPanel";
import { QuickInsightsCards } from "./QuickInsightsCards";
import { ReferralManagement } from "./ReferralManagement";
import { VirtualWaitlist } from "../hospital/VirtualWaitlist";
import { 
  UserCheck, 
  Video, 
  FileText, 
  Pill, 
  FlaskConical, 
  Calendar, 
  Clock, 
  Sparkles, 
  Mic, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Search,
  Bot,
  Layers,
  ArrowRight,
  Save,
  HardDrive
} from "lucide-react";

export const DoctorPortal: React.FC<{
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onStartTeleconsult: (apt: Appointment) => void;
}> = ({ activeSection, setActiveSection, onStartTeleconsult }) => {
  const { 
    appointments, 
    updateAppointmentStatus, 
    addSoapNote, 
    addPrescription, 
    addLabOrder, 
    addDischargeSummary,
    dischargeSummaries,
    showToast,
    autoSaveSoapDraft,
    loadSoapDraft,
    soapDraftTimestamps
  } = useApp();

  // EMR Editor State
  const [selectedPatientForEmr, setSelectedPatientForEmr] = useState<Appointment>(appointments[0]);
  const [chiefComplaint, setChiefComplaint] = useState(appointments[0]?.symptoms || "Exertional dyspnea and mild retrosternal chest tightness.");
  const [rawDictation, setRawDictation] = useState("");
  const [isDictating, setIsDictating] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // SOAP Fields
  const [soapSubjective, setSoapSubjective] = useState("");
  const [soapObjective, setSoapObjective] = useState("");
  const [soapAssessment, setSoapAssessment] = useState("");
  const [soapPlan, setSoapPlan] = useState("");
  const [icdCodes, setIcdCodes] = useState<{ code: string; description: string }[]>([]);
  const [cptCodes, setCptCodes] = useState<{ code: string; description: string }[]>([]);
  const [drugAlerts, setDrugAlerts] = useState<any[]>([]);

  // Prescriptions & Orders State
  const [rxMedicine, setRxMedicine] = useState("Atorvastatin 20mg");
  const [rxDosage, setRxDosage] = useState("20mg");
  const [rxFreq, setRxFreq] = useState("Once daily at bedtime");
  const [rxDuration, setRxDuration] = useState("30 days");

  const [labTestName, setLabTestName] = useState("Comprehensive Lipid & Cardiac Panel");
  const [labCategory, setLabCategory] = useState<"Hematology" | "Biochemistry" | "Microbiology" | "Pathology" | "Radiology">("Biochemistry");

  // Restore saved draft when selected patient changes
  useEffect(() => {
    if (selectedPatientForEmr) {
      const draft = loadSoapDraft(selectedPatientForEmr.id);
      if (draft) {
        setSoapSubjective(draft.subjective || "");
        setSoapObjective(draft.objective || "");
        setSoapAssessment(draft.assessment || "");
        setSoapPlan(draft.plan || "");
        if (draft.icdCodes) setIcdCodes(draft.icdCodes);
        if (draft.cptCodes) setCptCodes(draft.cptCodes);
      }
    }
  }, [selectedPatientForEmr?.id]);

  // Auto-save draft on changes to SOAP fields
  useEffect(() => {
    if (selectedPatientForEmr && (soapSubjective || soapObjective || soapAssessment || soapPlan)) {
      const timer = setTimeout(() => {
        autoSaveSoapDraft(selectedPatientForEmr.id, {
          patientName: selectedPatientForEmr.patientName,
          subjective: soapSubjective,
          objective: soapObjective,
          assessment: soapAssessment,
          plan: soapPlan,
          icdCodes,
          cptCodes
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [soapSubjective, soapObjective, soapAssessment, soapPlan, selectedPatientForEmr?.id]);

  // AI SOAP Generator Trigger
  const handleGenerateAiSoap = async () => {
    setIsAiProcessing(true);
    try {
      const response = await fetch("/api/ai/soap-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawNotes: rawDictation || "Patient reports 2-week history of exertional chest discomfort. Non-smoker.",
          chiefComplaint,
          patientVitals: { bp: "124/82", hr: 74, spo2: 99 },
          currentMedications: ["Amlodipine 5mg"]
        })
      });

      const data = await response.json();
      setSoapSubjective(data.subjective || "Patient presents with exertional discomfort.");
      setSoapObjective(data.objective || "BP: 124/82, HR: 74 bpm. Clear breath sounds.");
      setSoapAssessment(data.assessment || "Essential Hypertension (ICD-10 I10), Hyperlipidemia (ICD-10 E78.5).");
      setSoapPlan(data.plan || "Initiate statin therapy, follow-up cardiac profile in 4 weeks.");
      setIcdCodes(data.icdCodes || [{ code: "I10", description: "Essential hypertension" }]);
      setCptCodes(data.cptCodes || [{ code: "99214", description: "Office visit 30-39 min" }]);
      setDrugAlerts(data.drugInteractionAlerts || []);
      showToast("AI Clinical SOAP Note & ICD/CPT Codes generated!");
    } catch (err) {
      console.error("AI SOAP error:", err);
      // Fallback
      setSoapSubjective("Patient reports exertional chest discomfort during moderate physical activity for 2 weeks.");
      setSoapObjective("BP: 124/82 mmHg, HR: 74 bpm. Normal S1/S2 heart sounds.");
      setSoapAssessment("I10 - Essential (primary) hypertension, E78.5 - Hyperlipidemia.");
      setSoapPlan("Atorvastatin 20mg daily at bedtime. Lipid profile in 30 days.");
      setIcdCodes([{ code: "I10", description: "Essential hypertension" }, { code: "E78.5", description: "Hyperlipidemia" }]);
      setCptCodes([{ code: "99214", description: "Office visit 30-39 min" }]);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Voice Dictation Simulation
  const handleToggleDictation = () => {
    if (!isDictating) {
      setIsDictating(true);
      showToast("Voice-to-Text Listening... Speak dictation into microphone.");
      setTimeout(() => {
        setRawDictation((prev) => prev + " Patient reports 2-week exertional chest tightness, non-radiation to jaw. BP is 124 over 82. No ankle edema.");
        setIsDictating(false);
        showToast("Voice dictation transcribed to EMR text.");
      }, 3000);
    } else {
      setIsDictating(false);
    }
  };

  // Automated Discharge Summary Generator Trigger
  const handleGenerateDischargeSummary = async () => {
    try {
      const response = await fetch("/api/ai/discharge-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: selectedPatientForEmr.patientName,
          admissionDate: "2026-07-26",
          dischargeDate: "2026-07-28",
          primaryDiagnosis: "Acute Coronary Syndrome - Resolved with Medical Management",
          courseInHospital: "Patient presented with chest tightness. Serial Troponin negative. Lipid panel managed with Atorvastatin.",
          dischargeMedications: "Atorvastatin 20mg daily, Amlodipine 5mg daily",
          followUpInstructions: "Follow up with Cardiology in 2 weeks."
        })
      });

      const data = await response.json();
      addDischargeSummary({
        patientId: selectedPatientForEmr.patientId,
        patientName: selectedPatientForEmr.patientName,
        admissionDate: "2026-07-26",
        dischargeDate: "2026-07-28",
        attendingPhysician: "Dr. Sarah Jenkins, MD",
        primaryDiagnosis: "Acute Coronary Syndrome - Resolved",
        hospitalCourse: data.clinicalOverview || "Course uncomplicated. Patient hemodynamically stable upon discharge.",
        dischargeMedications: data.medicationInstructions || ["Atorvastatin 20mg 1x daily"],
        followUpPlan: data.followUpAppointmentPlan || "Cardiology OPD in 2 weeks",
        warningSigns: data.warningSignsToReturn || ["Chest pain", "Shortness of breath"]
      });
    } catch (err) {
      console.error("Discharge summary error:", err);
      addDischargeSummary({
        patientId: selectedPatientForEmr.patientId,
        patientName: selectedPatientForEmr.patientName,
        admissionDate: "2026-07-26",
        dischargeDate: "2026-07-28",
        attendingPhysician: "Dr. Sarah Jenkins, MD",
        primaryDiagnosis: "Hypertensive Urgency - Controlled",
        hospitalCourse: "Patient admitted for blood pressure control. Responded well to oral antihypertensives.",
        dischargeMedications: ["Atorvastatin 20mg daily", "Amlodipine 5mg daily"],
        followUpPlan: "Cardiology OPD in 14 days",
        warningSigns: ["BP > 160/100", "Severe headache", "Chest pain"]
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* Referral Management Pipeline */}
      {activeSection === "referrals" && <ReferralManagement />}

      {/* Real-time Virtual Walk-in Waitlist */}
      {activeSection === "waitlist" && <VirtualWaitlist />}

      {/* Automated Email & SMS Notification Center */}
      {activeSection === "notifications" && <NotificationReminderPanel />}

      {/* Interactive Schedule & Drag-and-Drop Calendar */}
      {(activeSection === "schedule" || activeSection === "calendar") && (
        <InteractiveDoctorSchedule onStartTeleconsult={onStartTeleconsult} />
      )}

      {/* Overview Dashboard */}
      {(activeSection === "overview" || !activeSection) && (
        <div className="space-y-8 animate-fadeIn">
          {/* Quick Insights Cards with Recharts Progress visuals */}
          <QuickInsightsCards />

          {/* Top Banner Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Appointments</p>
              <p className="text-3xl font-black text-white mt-1">{appointments.length}</p>
              <p className="text-[10px] text-cyan-400 mt-1">4 Video Teleconsults</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Waiting Room Queue</p>
              <p className="text-3xl font-black text-amber-400 mt-1">
                {appointments.filter((a) => a.status === "Waiting Room").length}
              </p>
              <p className="text-[10px] text-amber-300 mt-1">Ready for Video Connect</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Sessions</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">
                {appointments.filter((a) => a.status === "Completed").length}
              </p>
              <p className="text-[10px] text-emerald-300 mt-1">SOAP Notes Signed</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Consultation Revenue</p>
              <p className="text-3xl font-black text-white mt-1">$480</p>
              <p className="text-[10px] text-emerald-400 mt-1">+18% vs last week</p>
            </div>
          </div>

          {/* Patient Queue & Consultation Actions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                <span>Today's Consultation Patient Queue</span>
              </h3>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs px-3 py-1.5 rounded-xl">
                      {apt.tokenNumber}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{apt.patientName}</h4>
                      <p className="text-xs text-slate-400">{apt.patientAge}y {apt.patientGender} • {apt.consultType} • {apt.timeSlot}</p>
                      {apt.symptoms && (
                        <p className="text-[11px] text-cyan-300/80 italic mt-0.5">"{apt.symptoms}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedPatientForEmr(apt);
                        setActiveSection("emr_editor");
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                      id={`open-emr-btn-${apt.id}`}
                    >
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>Open EMR</span>
                    </button>

                    {(apt.consultType === "Video" || apt.consultType === "Audio") && (
                      <button
                        onClick={() => onStartTeleconsult(apt)}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                        id={`start-teleconsult-btn-${apt.id}`}
                      >
                        <Video className="w-4 h-4" />
                        <span>Launch Teleconsult</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive EMR & SOAP Notes Editor Section */}
      {(activeSection === "emr_editor" || activeSection === "queue") && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-cyan-400" />
                <span>Clinical EMR Editor & AI SOAP Assistant</span>
              </h2>
              <p className="text-xs text-slate-400">
                Editing EMR for: <strong className="text-white">{selectedPatientForEmr.patientName}</strong> (#{selectedPatientForEmr.patientId})
              </p>
            </div>

            {/* AI Assistant Generate Trigger */}
            <button
              onClick={handleGenerateAiSoap}
              disabled={isAiProcessing}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
              id="ai-generate-soap-btn"
            >
              <Bot className="w-4 h-4 text-cyan-200" />
              <span>{isAiProcessing ? "AI Modeling SOAP..." : "Auto-Generate AI SOAP Note"}</span>
            </button>
          </div>

          {/* Voice Dictation & Raw Dictation Input */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" />
                <span>Doctor Dictation & Voice Transcription</span>
              </label>

              <button
                type="button"
                onClick={handleToggleDictation}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isDictating ? "bg-red-500 text-white animate-pulse" : "bg-slate-800 text-cyan-300 border border-slate-700"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isDictating ? "Listening Dictation..." : "Voice-to-Text Dictate"}</span>
              </button>
            </div>

            <textarea
              rows={2}
              value={rawDictation}
              onChange={(e) => setRawDictation(e.target.value)}
              placeholder="Dictate or type raw clinical observations here (e.g. Patient reports exertional chest pressure, BP 124/82...)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500"
            />
          </div>

          {/* Drug Interaction Warnings (If AI flagged any) */}
          {drugAlerts.length > 0 && (
            <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-2xl text-amber-200 space-y-2">
              <h4 className="font-bold text-xs flex items-center gap-1.5 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                AI Drug Interaction Warning Alert
              </h4>
              <ul className="text-xs space-y-1">
                {drugAlerts.map((alert: any, idx: number) => (
                  <li key={idx}>• {alert.description}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Structured SOAP Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-2">
              <h3 className="font-bold text-sm text-white">Structured SOAP Clinical Documentation</h3>
              
              {selectedPatientForEmr && soapDraftTimestamps[selectedPatientForEmr.id] ? (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Draft Auto-Saved locally at {soapDraftTimestamps[selectedPatientForEmr.id]}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-xl">
                  <Save className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Local Draft Auto-Save Active</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-cyan-400 mb-1">SUBJECTIVE (S)</label>
                <textarea
                  rows={3}
                  value={soapSubjective}
                  onChange={(e) => setSoapSubjective(e.target.value)}
                  placeholder="History of present illness, symptom duration, patient reports..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-400 mb-1">OBJECTIVE (O)</label>
                <textarea
                  rows={3}
                  value={soapObjective}
                  onChange={(e) => setSoapObjective(e.target.value)}
                  placeholder="Physical exam findings, vitals, lab values..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-400 mb-1">ASSESSMENT (A)</label>
                <textarea
                  rows={3}
                  value={soapAssessment}
                  onChange={(e) => setSoapAssessment(e.target.value)}
                  placeholder="Primary & secondary diagnoses..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-400 mb-1">PLAN (P)</label>
                <textarea
                  rows={3}
                  value={soapPlan}
                  onChange={(e) => setSoapPlan(e.target.value)}
                  placeholder="Treatment plan, medications, follow-up..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>

            {/* ICD-10 & CPT Suggestions */}
            {icdCodes.length > 0 && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap gap-2 text-xs">
                <span className="font-bold text-slate-400 text-xs">Suggested Billing Codes:</span>
                {icdCodes.map((code, idx) => (
                  <span key={idx} className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2.5 py-1 rounded-lg font-mono font-bold">
                    ICD-10: {code.code} ({code.description})
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={handleGenerateDischargeSummary}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
              >
                Generate Automated Discharge Summary
              </button>

              <button
                onClick={() => {
                  addSoapNote({
                    visitId: selectedPatientForEmr.id,
                    patientId: selectedPatientForEmr.patientId,
                    doctorId: selectedPatientForEmr.doctorId,
                    doctorName: selectedPatientForEmr.doctorName,
                    date: new Date().toISOString().split("T")[0],
                    subjective: soapSubjective,
                    objective: soapObjective,
                    assessment: soapAssessment,
                    plan: soapPlan,
                    icdCodes,
                    cptCodes
                  });
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all"
              >
                Save & Sign SOAP Note to EMR
              </button>
            </div>
          </div>

          {/* Orders & Prescription Generator Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Issue E-Prescription Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Pill className="w-4 h-4 text-emerald-400" />
                <span>Issue Signed Digital Prescription</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Medication Name</label>
                  <input
                    type="text"
                    value={rxMedicine}
                    onChange={(e) => setRxMedicine(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Frequency</label>
                    <input
                      type="text"
                      value={rxFreq}
                      onChange={(e) => setRxFreq(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Duration</label>
                    <input
                      type="text"
                      value={rxDuration}
                      onChange={(e) => setRxDuration(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    addPrescription({
                      patientId: selectedPatientForEmr.patientId,
                      patientName: selectedPatientForEmr.patientName,
                      doctorId: selectedPatientForEmr.doctorId,
                      doctorName: selectedPatientForEmr.doctorName,
                      doctorSpecialty: selectedPatientForEmr.doctorSpecialty,
                      date: new Date().toISOString().split("T")[0],
                      medications: [{ name: rxMedicine, dosage: rxDosage, frequency: rxFreq, duration: rxDuration, instructions: "Take as directed." }],
                      diagnosis: soapAssessment || "Essential hypertension",
                      status: "Issued"
                    });
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all"
                >
                  Sign & Send E-Prescription
                </button>
              </div>
            </div>

            {/* Order Lab / Radiology Test */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <FlaskConical className="w-4 h-4 text-cyan-400" />
                <span>Order Lab Test / DICOM Radiology Study</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Diagnostic Test / Study Name</label>
                  <input
                    type="text"
                    value={labTestName}
                    onChange={(e) => setLabTestName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Diagnostic Department</label>
                  <select
                    value={labCategory}
                    onChange={(e) => setLabCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Biochemistry">Biochemistry Lab</option>
                    <option value="Hematology">Hematology Lab</option>
                    <option value="Radiology">Radiology (X-Ray / CT / MRI)</option>
                    <option value="Microbiology">Microbiology Lab</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    addLabOrder({
                      patientId: selectedPatientForEmr.patientId,
                      patientName: selectedPatientForEmr.patientName,
                      doctorId: selectedPatientForEmr.doctorId,
                      doctorName: selectedPatientForEmr.doctorName,
                      testName: labTestName,
                      category: labCategory,
                      orderDate: new Date().toISOString().split("T")[0],
                      status: "Ordered"
                    });
                  }}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all"
                >
                  Submit Order & Generate Barcode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
