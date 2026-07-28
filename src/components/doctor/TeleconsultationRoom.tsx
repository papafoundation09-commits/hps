import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { Appointment } from "../../types";
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  Share2, 
  Edit3, 
  FileText, 
  Pill, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  X,
  User,
  ShieldCheck,
  Bot,
  Disc,
  Lock,
  FileCheck,
  Check,
  AlertCircle
} from "lucide-react";

export const TeleconsultationRoom: React.FC<{
  appointment: Appointment;
  onLeaveCall: () => void;
}> = ({ appointment, onLeaveCall }) => {
  const { 
    endTeleconsultation, 
    addPrescription, 
    addSoapNote, 
    showToast,
    autoSaveSoapDraft,
    loadSoapDraft,
    soapDraftTimestamps
  } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<"video" | "whiteboard">("video");
  const [isEmrDrawerOpen, setIsEmrDrawerOpen] = useState(true);

  // Recording Configuration State
  const [isRecordingEnabled, setIsRecordingEnabled] = useState(true);
  const [patientConsentGiven, setPatientConsentGiven] = useState(true);
  const [doctorConsentGiven, setDoctorConsentGiven] = useState(true);
  const [recordingMode, setRecordingMode] = useState<"hd_cloud" | "audio_only">("hd_cloud");
  const [showRecordingSettingsModal, setShowRecordingSettingsModal] = useState(false);

  // In-Call Quick Prescription
  const [medName, setMedName] = useState("Atorvastatin 20mg");
  const [medDosage, setMedDosage] = useState("20mg");
  const [medFreq, setMedFreq] = useState("Once daily at bedtime");
  const [medDuration, setMedDuration] = useState("30 days");

  // In-Call SOAP Draft
  const [soapSubjective, setSoapSubjective] = useState(appointment.symptoms || "Patient reports mild exertion fatigue.");
  const [soapObjective, setSoapObjective] = useState("BP 124/82, HR 74 bpm. Normal chest auscultation.");
  const [soapAssessment, setSoapAssessment] = useState("Essential hypertension (I10)");
  const [soapPlan, setSoapPlan] = useState("Continue antihypertensives, follow up in 4 weeks.");

  // Restore saved draft on room load
  React.useEffect(() => {
    if (appointment) {
      const draft = loadSoapDraft(appointment.id);
      if (draft) {
        setSoapSubjective(draft.subjective || "");
        setSoapObjective(draft.objective || "");
        setSoapAssessment(draft.assessment || "");
        setSoapPlan(draft.plan || "");
      }
    }
  }, [appointment?.id]);

  // Auto-save SOAP draft on changes
  React.useEffect(() => {
    if (appointment && (soapSubjective || soapObjective || soapAssessment || soapPlan)) {
      const timer = setTimeout(() => {
        autoSaveSoapDraft(appointment.id, {
          patientName: appointment.patientName,
          subjective: soapSubjective,
          objective: soapObjective,
          assessment: soapAssessment,
          plan: soapPlan
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [soapSubjective, soapObjective, soapAssessment, soapPlan, appointment?.id]);

  const handleToggleRecording = () => {
    const nextRecordingState = !isRecordingEnabled;
    setIsRecordingEnabled(nextRecordingState);
    showToast(
      nextRecordingState
        ? "Session recording enabled. HIPAA Encrypted cloud recording in progress."
        : "Session recording disabled. Recording stopped for this teleconsultation."
    );
  };

  const handleIssueRx = (e: React.FormEvent) => {
    e.preventDefault();
    addPrescription({
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctorName,
      doctorSpecialty: appointment.doctorSpecialty,
      date: new Date().toISOString().split("T")[0],
      medications: [
        {
          name: medName,
          dosage: medDosage,
          frequency: medFreq,
          duration: medDuration,
          instructions: "Take with water."
        }
      ],
      diagnosis: soapAssessment,
      status: "Issued"
    });
  };

  const handleSaveSoap = (e: React.FormEvent) => {
    e.preventDefault();
    addSoapNote({
      visitId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctorName,
      date: new Date().toISOString().split("T")[0],
      subjective: soapSubjective,
      objective: soapObjective,
      assessment: soapAssessment,
      plan: soapPlan,
      icdCodes: [{ code: "I10", description: "Essential hypertension" }],
      cptCodes: [{ code: "99214", description: "Office visit 30 min" }]
    });
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between p-4 sm:p-6 space-y-4">
      {/* Top Header Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <span>CarePulse HD Encrypted Teleconsultation</span>
              <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/30">
                256-bit AES
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Patient: <strong className="text-white">{appointment.patientName}</strong> ({appointment.patientAge}y {appointment.patientGender}) • Token: <strong className="text-cyan-400">{appointment.tokenNumber}</strong>
            </p>
          </div>
        </div>

        {/* Header Session Controls & Recording Quick Status */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Session Recording Toggle Button in Top Header */}
          <button
            onClick={handleToggleRecording}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isRecordingEnabled
                ? "bg-red-500/20 text-red-300 border-red-500/60 shadow-lg shadow-red-500/10"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
            }`}
            id="toggle-recording-btn"
            title="Enable/Disable Session Recording"
          >
            <Disc className={`w-4 h-4 ${isRecordingEnabled ? "text-red-400 animate-pulse" : "text-slate-400"}`} />
            <span>{isRecordingEnabled ? "REC: ON" : "REC: OFF"}</span>
          </button>

          <button
            onClick={() => setShowRecordingSettingsModal(!showRecordingSettingsModal)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-medium flex items-center gap-1"
            title="Recording & Consent Configuration"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Consent Config</span>
          </button>

          <button
            onClick={() => setIsEmrDrawerOpen(!isEmrDrawerOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isEmrDrawerOpen ? "bg-cyan-500/20 text-cyan-300 border-cyan-500" : "bg-slate-800 text-slate-300 border-slate-700"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>In-Call EMR Drawer</span>
          </button>

          <button
            onClick={() => {
              endTeleconsultation();
              onLeaveCall();
            }}
            className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-red-600/30"
            id="end-call-btn"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* Recording Consent & Compliance Bar */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Session Recording Status:</span>
            {isRecordingEnabled ? (
              <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Recording Active (Encrypted Cloud Backup)</span>
              </span>
            ) : (
              <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span>Recording Disabled by Doctor</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
            <span className={`flex items-center gap-1 text-[11px] font-medium ${patientConsentGiven ? "text-emerald-400" : "text-amber-400"}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Patient Consent: {patientConsentGiven ? "Signed & Verified" : "Pending"}</span>
            </span>

            <span className={`flex items-center gap-1 text-[11px] font-medium ${doctorConsentGiven ? "text-emerald-400" : "text-amber-400"}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Physician Consent: {doctorConsentGiven ? "Signed" : "Pending"}</span>
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>HIPAA Compliance Audit ID: <span className="font-mono text-cyan-300">#REC-2026-0728-AUDIT</span></span>
        </div>
      </div>

      {/* Main Grid View (Video Stream + In-Call EMR Side Drawer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-2 flex-1">
        {/* Video Canvas Container */}
        <div className={`${isEmrDrawerOpen ? "lg:col-span-7" : "lg:col-span-12"} space-y-4 flex flex-col`}>
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex-1 min-h-[420px] shadow-2xl flex items-center justify-center">
            {/* Recording Watermark & Banner Overlay on Stream */}
            <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
              {isRecordingEnabled ? (
                <div className="bg-red-950/90 border border-red-500/60 backdrop-blur-md text-red-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>🔴 REC 00:08:42</span>
                  <span className="text-[10px] bg-red-900/60 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">
                    {recordingMode === "hd_cloud" ? "HD Video & Audio" : "Audio Only"}
                  </span>
                </div>
              ) : (
                <div className="bg-slate-900/90 border border-slate-700 backdrop-blur-md text-slate-400 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Private Session (No Recording)</span>
                </div>
              )}
            </div>

            {/* Main Remote Video Stream (Patient View Simulation) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950/40 flex items-center justify-center">
              {!isVideoOff ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
                    alt={appointment.patientName}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-white flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{appointment.patientName} (Remote Stream)</span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500 border border-slate-700">
                    <User className="w-10 h-10" />
                  </div>
                  <p className="text-xs text-slate-400">Camera Paused</p>
                </div>
              )}
            </div>

            {/* Picture-in-Picture Local Doctor Camera Simulation */}
            <div className="absolute bottom-4 right-4 w-40 h-28 bg-slate-950 border-2 border-cyan-500/50 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={appointment.doctorAvatar}
                alt={appointment.doctorName}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1.5 left-2 bg-slate-900/90 text-[10px] font-bold px-1.5 py-0.5 rounded text-cyan-300">
                You (Doctor)
              </span>
            </div>
          </div>

          {/* In-Call Media Control Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-center gap-4 shadow-lg">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-xl border transition-all ${
                isMuted ? "bg-red-500/20 border-red-500 text-red-400" : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              }`}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-xl border transition-all ${
                isVideoOff ? "bg-red-500/20 border-red-500 text-red-400" : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              }`}
              title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                setIsScreenSharing(!isScreenSharing);
                showToast(isScreenSharing ? "Stopped screen sharing." : "Screen sharing active.");
              }}
              className={`p-3 rounded-xl border transition-all ${
                isScreenSharing ? "bg-cyan-500/20 border-cyan-500 text-cyan-300" : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              }`}
              title="Share Screen"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Quick Session Recording Toggle Button inside Control Bar */}
            <button
              onClick={handleToggleRecording}
              className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 font-bold text-xs ${
                isRecordingEnabled
                  ? "bg-red-600/30 border-red-500 text-red-300 hover:bg-red-600/40"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
              id="main-control-recording-toggle"
            >
              <Disc className={`w-4 h-4 ${isRecordingEnabled ? "text-red-400 animate-pulse" : "text-slate-400"}`} />
              <span>{isRecordingEnabled ? "Stop Recording" : "Enable Recording"}</span>
            </button>
          </div>
        </div>

        {/* Side EMR Editor Drawer */}
        {isEmrDrawerOpen && (
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-5 flex flex-col justify-between overflow-y-auto max-h-[600px]">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>In-Call Clinical EMR Note & Rx</span>
                </h3>
              </div>

              {/* SOAP Form */}
              <form onSubmit={handleSaveSoap} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">Subjective (Symptoms)</label>
                  <textarea
                    rows={2}
                    value={soapSubjective}
                    onChange={(e) => setSoapSubjective(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">Objective (Vitals/Exam)</label>
                  <input
                    type="text"
                    value={soapObjective}
                    onChange={(e) => setSoapObjective(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">Assessment (ICD Diagnosis)</label>
                  <input
                    type="text"
                    value={soapAssessment}
                    onChange={(e) => setSoapAssessment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">Plan & Instructions</label>
                  <textarea
                    rows={2}
                    value={soapPlan}
                    onChange={(e) => setSoapPlan(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs py-2 rounded-xl transition-all"
                >
                  Save SOAP Note to Patient EMR
                </button>
              </form>

              {/* In-Call Quick Prescription Writer */}
              <div className="border-t border-slate-800 pt-4 mt-4 space-y-3">
                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-400" />
                  <span>Issue Live E-Prescription</span>
                </h4>

                <form onSubmit={handleIssueRx} className="space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="Medicine Name (e.g. Augmentin 625mg)"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    required
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Frequency"
                      value={medFreq}
                      onChange={(e) => setMedFreq(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      value={medDuration}
                      onChange={(e) => setMedDuration(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 rounded-xl transition-all"
                  >
                    Generate & Sign E-Prescription
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recording Configuration & Consent Settings Modal */}
      {showRecordingSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Disc className="w-5 h-5 text-red-400" />
                <span>Session Recording & Consent Configuration</span>
              </h3>
              <button
                onClick={() => setShowRecordingSettingsModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Master Recording Toggle */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-sm">Enable Session Recording</p>
                  <p className="text-slate-400 text-[11px]">Record video, audio, and clinical transcript to encrypted HIPAA cloud storage.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecordingEnabled}
                    onChange={(e) => {
                      setIsRecordingEnabled(e.target.checked);
                      showToast(e.target.checked ? "Recording enabled for session." : "Recording disabled for session.");
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {/* Consent Verifications */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <p className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Consent Verification Indicators</p>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="font-semibold text-white">Patient Teleconsultation Consent</p>
                      <p className="text-[10px] text-slate-400">Signed during booking checkout ({appointment.patientName})</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPatientConsentGiven(!patientConsentGiven);
                      showToast(patientConsentGiven ? "Patient consent revoked." : "Patient consent verified.");
                    }}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] border transition-all ${
                      patientConsentGiven ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {patientConsentGiven ? "✓ Verified" : "Pending Signature"}
                  </button>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-slate-800/60 pt-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="font-semibold text-white">Physician Recording Authorization</p>
                      <p className="text-[10px] text-slate-400">Attending Doctor ({appointment.doctorName})</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDoctorConsentGiven(!doctorConsentGiven);
                      showToast(doctorConsentGiven ? "Physician authorization toggled off." : "Physician authorization confirmed.");
                    }}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] border transition-all ${
                      doctorConsentGiven ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {doctorConsentGiven ? "✓ Authorized" : "Pending Authorization"}
                  </button>
                </div>
              </div>

              {/* Recording Format Selection */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Recording Media Format</label>
                <select
                  value={recordingMode}
                  onChange={(e) => setRecordingMode(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="hd_cloud">Full HD 1080p Video + Audio + AI SOAP Transcript</option>
                  <option value="audio_only">Audio Only Stream (Reduced Bandwidth)</option>
                </select>
              </div>

              <div className="bg-cyan-950/40 border border-cyan-800/50 p-3 rounded-xl text-[11px] text-cyan-200 flex items-start gap-2">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  All teleconsultation recordings are encrypted with AES-256 and stored in compliant HIPAA cloud storage with automatic retention policy of 7 years.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowRecordingSettingsModal(false)}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-lg shadow-cyan-600/20"
              >
                Apply & Save Recording Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

