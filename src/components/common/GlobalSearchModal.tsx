import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { highlightText } from "../../utils/highlightMatch";
import { Search, Stethoscope, User, Building2, X, ArrowRight, Star } from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDoctor?: (doc: any) => void;
  onSelectPatient?: (patient: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectDoctor,
  onSelectPatient
}) => {
  const { doctors, appointments } = useApp();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"doctors" | "patients">("doctors");

  if (!isOpen) return null;

  const filteredDoctors = doctors.filter((doc) => {
    const q = query.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.hospital.toLowerCase().includes(q)
    );
  });

  // Extract unique patient records from appointments
  const patientMap = new Map();
  appointments.forEach((apt) => {
    if (!patientMap.has(apt.patientId)) {
      patientMap.set(apt.patientId, {
        id: apt.patientId,
        name: apt.patientName,
        age: apt.patientAge,
        gender: apt.patientGender,
        hospital: apt.hospital,
        specialty: apt.doctorSpecialty,
        symptoms: apt.symptoms
      });
    }
  });

  const uniquePatients = Array.from(patientMap.values());
  const filteredPatients = uniquePatients.filter((pat) => {
    const q = query.toLowerCase();
    return (
      pat.name.toLowerCase().includes(q) ||
      pat.specialty.toLowerCase().includes(q) ||
      pat.hospital.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 text-slate-100">
        {/* Header & Search Input */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Global Clinical & Specialty Directory Search</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Type doctor name, patient name, specialty, or hospital affiliation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
            id="global-search-modal-input"
          />
        </div>

        {/* Search Mode Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("doctors")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "doctors"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctors ({filteredDoctors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("patients")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "patients"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Patients ({filteredPatients.length})</span>
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {activeTab === "doctors" && (
            filteredDoctors.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No matching doctors found for "{query}".</p>
            ) : (
              filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    if (onSelectDoctor) onSelectDoctor(doc);
                    onClose();
                  }}
                  className="bg-slate-950 border border-slate-800 hover:border-cyan-500/40 p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-white">
                        {highlightText(doc.name, query)}
                      </h4>
                      <p className="text-[11px] text-cyan-400 font-semibold">
                        Specialty: {highlightText(doc.specialty, query)}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Hospital: {highlightText(doc.hospital, query)}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                    ${doc.consultationFee}
                  </span>
                </div>
              ))
            )
          )}

          {activeTab === "patients" && (
            filteredPatients.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No matching patient profiles found for "{query}".</p>
            ) : (
              filteredPatients.map((pat) => (
                <div
                  key={pat.id}
                  onClick={() => {
                    if (onSelectPatient) onSelectPatient(pat);
                    onClose();
                  }}
                  className="bg-slate-950 border border-slate-800 hover:border-cyan-500/40 p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/30">
                      {pat.id.slice(-3)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">
                        {highlightText(pat.name, query)} ({pat.age}y {pat.gender})
                      </h4>
                      <p className="text-[11px] text-cyan-400 font-semibold">
                        Specialty Care: {highlightText(pat.specialty, query)}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Hospital Campus: {highlightText(pat.hospital, query)}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};
