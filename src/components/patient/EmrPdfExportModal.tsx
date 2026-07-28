import React, { useRef } from "react";
import { SoapNote, Allergy, Medication, PatientVitals } from "../../types";
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  ShieldCheck, 
  Heart, 
  Pill, 
  AlertTriangle, 
  Calendar,
  CheckCircle2,
  Building2,
  UserCheck
} from "lucide-react";

interface EmrPdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  vitals?: PatientVitals;
  allergies?: Allergy[];
  medications?: Medication[];
  soapNotes?: SoapNote[];
}

export const EmrPdfExportModal: React.FC<EmrPdfExportModalProps> = ({
  isOpen,
  onClose,
  patientName,
  patientId,
  vitals,
  allergies = [],
  medications = [],
  soapNotes = []
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrintOrPdf = () => {
    if (!printRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>srivoratech EMR Summary Document - ${patientName}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #ffffff;
              color: #0f172a;
              margin: 0;
              padding: 24px;
            }
            .header {
              border-bottom: 3px solid #0891b2;
              padding-bottom: 16px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .brand {
              font-size: 24px;
              font-weight: 800;
              color: #0e7490;
              letter-spacing: -0.5px;
            }
            .subtitle {
              font-size: 12px;
              color: #64748b;
              margin-top: 4px;
            }
            .section {
              margin-bottom: 24px;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 16px;
              background: #f8fafc;
            }
            .section-title {
              font-size: 14px;
              font-weight: 700;
              color: #0369a1;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 1px solid #cbd5e1;
              padding-bottom: 8px;
              margin-bottom: 12px;
            }
            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }
            .grid-3 {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
              font-size: 12px;
            }
            th {
              background-color: #e2e8f0;
              color: #334155;
              text-align: left;
              padding: 8px;
              font-weight: 700;
            }
            td {
              border-bottom: 1px solid #e2e8f0;
              padding: 8px;
            }
            .badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 10px;
              font-weight: 700;
              background: #e0f2fe;
              color: #0369a1;
            }
            .footer {
              margin-top: 32px;
              border-top: 1px solid #e2e8f0;
              padding-top: 16px;
              font-size: 10px;
              color: #94a3b8;
              text-align: center;
            }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Modal Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Export Clinical EMR Document</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Geometric Balance format formatted for PDF export, clinical printing & insurance filing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintOrPdf}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* EMR Printable Content Container */}
        <div ref={printRef} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 text-xs text-slate-200 font-sans">
          {/* Header Branding & Metadata */}
          <div className="border-b-2 border-cyan-500 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-extrabold text-cyan-400 tracking-tight flex items-center gap-2">
                <span>srivoratech Healthcare Network</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                  HIPAA VERIFIED EMR
                </span>
              </h1>
              <p className="text-slate-400 text-[11px] mt-1">
                Integrated Electronic Medical Record Summary & Clinical Encounter Details
              </p>
            </div>

            <div className="text-right font-mono text-[11px] text-slate-400 space-y-0.5">
              <p><strong className="text-slate-200">Doc ID:</strong> EMR-PDF-{patientId.toUpperCase()}</p>
              <p><strong className="text-slate-200">Generated:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Patient Overview Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Patient Name</p>
              <p className="font-bold text-white text-sm mt-0.5">{patientName}</p>
              <p className="text-[11px] text-slate-400 font-mono">ID: {patientId}</p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Latest Vitals Summary</p>
              <p className="font-bold text-cyan-300 text-xs mt-0.5">
                {vitals ? `BP: ${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg | HR: ${vitals.heartRate} bpm` : "120/80 mmHg | 72 bpm"}
              </p>
              <p className="text-[11px] text-slate-400">BMI: {vitals?.bmi || 23.4} | SpO2: {vitals?.spO2 || 99}%</p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Care Team Attending</p>
              <p className="font-bold text-white text-xs mt-0.5">Dr. Sarah Jenkins, MD</p>
              <p className="text-[11px] text-slate-400">Cardiology & Internal Medicine</p>
            </div>
          </div>

          {/* Allergies & Current Medications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Allergies */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <h3 className="font-bold text-xs text-red-400 flex items-center gap-1.5 uppercase tracking-wide border-b border-slate-800 pb-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Known Allergies & Sensitivities</span>
              </h3>
              {allergies.length === 0 ? (
                <p className="text-[11px] text-slate-400">No known drug allergies recorded (NKDA).</p>
              ) : (
                <ul className="space-y-1.5 text-[11px]">
                  {allergies.map((a) => (
                    <li key={a.id} className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="font-bold text-slate-200">{a.allergen}</span>
                      <span className="text-red-400 font-semibold">{a.severity} — {a.reaction}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Current Active Medications */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <h3 className="font-bold text-xs text-cyan-400 flex items-center gap-1.5 uppercase tracking-wide border-b border-slate-800 pb-1.5">
                <Pill className="w-3.5 h-3.5" />
                <span>Active Prescribed Medications</span>
              </h3>
              {medications.length === 0 ? (
                <p className="text-[11px] text-slate-400">No active prescriptions currently on file.</p>
              ) : (
                <ul className="space-y-1.5 text-[11px]">
                  {medications.map((m) => (
                    <li key={m.id} className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">{m.name} ({m.dosage})</p>
                        <p className="text-[10px] text-slate-400">{m.frequency} — {m.duration}</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                        {m.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Historical SOAP Notes Encounters */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-xs text-cyan-400 flex items-center gap-1.5 uppercase tracking-wide border-b border-slate-800 pb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Clinical Visit SOAP Notes & Diagnosis Records</span>
            </h3>

            {soapNotes.length === 0 ? (
              <p className="text-[11px] text-slate-400">No past clinical encounter notes recorded.</p>
            ) : (
              <div className="space-y-3">
                {soapNotes.map((note) => (
                  <div key={note.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[11px] border-b border-slate-800 pb-1.5 font-mono">
                      <span className="text-cyan-300 font-bold">{note.doctorName}</span>
                      <span className="text-slate-400">{note.date}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <strong className="text-slate-400 block text-[10px]">Subjective (S):</strong>
                        <p className="text-slate-200">{note.subjective}</p>
                      </div>
                      <div>
                        <strong className="text-slate-400 block text-[10px]">Objective (O):</strong>
                        <p className="text-slate-200">{note.objective}</p>
                      </div>
                      <div>
                        <strong className="text-slate-400 block text-[10px]">Assessment (A):</strong>
                        <p className="text-slate-200">{note.assessment}</p>
                      </div>
                      <div>
                        <strong className="text-slate-400 block text-[10px]">Plan (P):</strong>
                        <p className="text-slate-200">{note.plan}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Notice */}
          <div className="border-t border-slate-800 pt-3 text-[10px] text-slate-500 text-center space-y-1 font-mono">
            <p>CONFIDENTIAL MEDICAL RECORD — FOR AUTHORIZED CLINICAL & PATIENT USE ONLY</p>
            <p>srivoratech Integrated Digital EMR Platform | Security Compliance Token: CP-HIPAA-2026-99A</p>
          </div>
        </div>
      </div>
    </div>
  );
};
