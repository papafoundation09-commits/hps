import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppContext";
import { 
  GitPullRequest, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  UserCheck, 
  Stethoscope, 
  AlertCircle, 
  ChevronRight,
  ArrowRight,
  FileText,
  Search,
  Filter,
  Check,
  X,
  Send,
  Building2,
  ShieldCheck
} from "lucide-react";

export interface SpecialistReferral {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  referringDoctor: string;
  targetSpecialty: string;
  targetDoctor?: string;
  hospitalCampus: string;
  priority: "Routine" | "Urgent" | "Emergency";
  clinicalReason: string;
  stage: "Referral Requested" | "Accepted & Scheduled" | "Follow-up Confirmed" | "Declined";
  requestedDate: string;
  appointmentDate?: string;
  specialistNotes?: string;
}

export const ReferralManagement: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { doctors, appointments, showToast } = useApp();

  const [referrals, setReferrals] = useState<SpecialistReferral[]>([
    {
      id: "ref-101",
      patientId: "pat-1001",
      patientName: "Michael Chang",
      patientAge: 48,
      referringDoctor: "Dr. Sarah Jenkins, MD",
      targetSpecialty: "Cardiology",
      targetDoctor: "Dr. Robert Chen, MD",
      hospitalCampus: "Central Campus - Wing B",
      priority: "Urgent",
      clinicalReason: "Hypertensive crisis evaluation & echocardiogram follow-up.",
      stage: "Accepted & Scheduled",
      requestedDate: "2026-07-26",
      appointmentDate: "2026-08-02 10:30 AM",
      specialistNotes: "Accepted. Ordered 24hr Holter monitor prior to visit."
    },
    {
      id: "ref-102",
      patientId: "pat-1002",
      patientName: "Sarah Connor",
      patientAge: 39,
      referringDoctor: "Dr. Elena Rostova, MD",
      targetSpecialty: "Endocrinology",
      hospitalCampus: "Northside Medical Plaza",
      priority: "Routine",
      clinicalReason: "Elevated HbA1c (8.2%) management and continuous glucose monitor setup.",
      stage: "Referral Requested",
      requestedDate: "2026-07-27"
    },
    {
      id: "ref-103",
      patientId: "pat-1003",
      patientName: "David Miller",
      patientAge: 62,
      referringDoctor: "Dr. Sarah Jenkins, MD",
      targetSpecialty: "Neurology",
      targetDoctor: "Dr. Marcus Vance, MD",
      hospitalCampus: "Westside Health Center",
      priority: "Urgent",
      clinicalReason: "Recurrent peripheral neuropathy and radiculopathy evaluation.",
      stage: "Follow-up Confirmed",
      requestedDate: "2026-07-20",
      appointmentDate: "2026-07-29 02:00 PM",
      specialistNotes: "Consultation finished. EMG/NCS scheduled."
    }
  ]);

  const [isNewReferralModalOpen, setIsNewReferralModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("All");

  // New Referral Form state
  const [newPatientName, setNewPatientName] = useState("");
  const [newTargetSpecialty, setNewTargetSpecialty] = useState("Cardiology");
  const [newPriority, setNewPriority] = useState<"Routine" | "Urgent" | "Emergency">("Urgent");
  const [newReason, setNewReason] = useState("");

  const pipelineStages: SpecialistReferral["stage"][] = [
    "Referral Requested",
    "Accepted & Scheduled",
    "Follow-up Confirmed"
  ];

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName || !newReason) {
      showToast("Please complete patient name and clinical indication.");
      return;
    }

    const newRef: SpecialistReferral = {
      id: `ref-${Date.now()}`,
      patientId: `pat-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: newPatientName,
      patientAge: 45,
      referringDoctor: "Dr. Sarah Jenkins, MD",
      targetSpecialty: newTargetSpecialty,
      hospitalCampus: "Central Hospital Network",
      priority: newPriority,
      clinicalReason: newReason,
      stage: "Referral Requested",
      requestedDate: new Date().toISOString().split("T")[0]
    };

    setReferrals([newRef, ...referrals]);
    setIsNewReferralModalOpen(false);
    setNewPatientName("");
    setNewReason("");
    showToast(`Referral issued for ${newPatientName} to ${newTargetSpecialty}`);
  };

  const handleAdvanceStage = (id: string, currentStage: SpecialistReferral["stage"]) => {
    setReferrals(
      referrals.map((r) => {
        if (r.id === id) {
          let nextStage: SpecialistReferral["stage"] = r.stage;
          if (currentStage === "Referral Requested") nextStage = "Accepted & Scheduled";
          else if (currentStage === "Accepted & Scheduled") nextStage = "Follow-up Confirmed";

          return {
            ...r,
            stage: nextStage,
            appointmentDate: nextStage === "Accepted & Scheduled" ? "2026-08-05 11:00 AM" : r.appointmentDate
          };
        }
        return r;
      })
    );
    showToast("Referral pipeline stage updated successfully.");
  };

  const filteredReferrals = referrals.filter((r) => {
    const matchesSearch =
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.targetSpecialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.clinicalReason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "All" || r.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <GitPullRequest className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t("referralPipeline")}</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Specialist Referral Workflow & Status Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track patient referral requests, specialist acceptance, and follow-up appointment confirmations.
          </p>
        </div>

        <button
          onClick={() => setIsNewReferralModalOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shrink-0"
          id="create-referral-btn"
        >
          <Plus className="w-4 h-4" />
          <span>New Specialist Referral</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search patient, specialty, or clinical reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white w-full sm:w-auto"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="Routine">Routine</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Visual Workflow Pipeline (3 Columns: Requested -> Accepted -> Confirmed) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pipelineStages.map((stageName, idx) => {
          const stageReferrals = filteredReferrals.filter((r) => r.stage === stageName);

          return (
            <div key={stageName} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col space-y-4">
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    idx === 0 ? "bg-amber-400" : idx === 1 ? "bg-cyan-400" : "bg-emerald-400"
                  }`} />
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider">{stageName}</h3>
                </div>

                <span className="bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                  {stageReferrals.length}
                </span>
              </div>

              {/* Cards in this Stage */}
              <div className="space-y-3.5 flex-1 min-h-[220px]">
                {stageReferrals.length === 0 ? (
                  <div className="border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs my-auto">
                    No referrals currently in this stage.
                  </div>
                ) : (
                  stageReferrals.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950 border border-slate-800 hover:border-cyan-500/40 p-4 rounded-2xl space-y-3 transition-all shadow-md group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-white">{item.patientName}</h4>
                          <p className="text-[11px] text-cyan-400 font-medium">{item.targetSpecialty}</p>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          item.priority === "Emergency"
                            ? "bg-red-500/20 text-red-300 border-red-500/40"
                            : item.priority === "Urgent"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        }`}>
                          {item.priority}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                        "{item.clinicalReason}"
                      </p>

                      <div className="text-[10px] text-slate-400 font-mono space-y-1 pt-1 border-t border-slate-800">
                        <p className="flex justify-between">
                          <span>Referring Doc:</span>
                          <span className="text-slate-200 font-semibold">{item.referringDoctor}</span>
                        </p>
                        {item.appointmentDate && (
                          <p className="flex justify-between text-cyan-300 font-bold">
                            <span>Appt Date:</span>
                            <span>{item.appointmentDate}</span>
                          </p>
                        )}
                      </div>

                      {/* Advance Stage Action Button */}
                      {stageName !== "Follow-up Confirmed" && (
                        <button
                          onClick={() => handleAdvanceStage(item.id, item.stage)}
                          className="w-full bg-slate-900 hover:bg-cyan-600 hover:text-white text-cyan-400 border border-cyan-500/30 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all mt-2"
                        >
                          <span>Advance to Next Stage</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Referral Modal */}
      {isNewReferralModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <GitPullRequest className="w-5 h-5 text-cyan-400" />
                <span>Issue New Specialist Referral</span>
              </h3>
              <button
                onClick={() => setIsNewReferralModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Patient Name & ID</label>
                <input
                  type="text"
                  placeholder="e.g. Michael Chang"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Medical Specialty</label>
                  <select
                    value={newTargetSpecialty}
                    onChange={(e) => setNewTargetSpecialty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pulmonology">Pulmonology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Triage Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Clinical Indication / Reason for Referral</label>
                <textarea
                  rows={3}
                  placeholder="Detail chief complaint, abnormal findings, and requested diagnostic/specialist evaluation..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewReferralModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Referral Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
