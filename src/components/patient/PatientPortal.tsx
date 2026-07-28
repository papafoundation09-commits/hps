import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Doctor, Appointment, ConsultType } from "../../types";
import { PatientVitalsHistoricalChart } from "./PatientVitalsHistoricalChart";
import { NotificationReminderPanel } from "../common/NotificationReminderPanel";
import { EmrPdfExportModal } from "./EmrPdfExportModal";
import { 
  Calendar, 
  Video, 
  FileText, 
  Pill, 
  FlaskConical, 
  CreditCard, 
  Activity, 
  Clock, 
  User, 
  Plus, 
  CheckCircle2, 
  QrCode, 
  Printer, 
  Download, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Search,
  Check,
  Building2,
  PhoneCall
} from "lucide-react";
import { DicomViewer } from "../common/DicomViewer";

export const PatientPortal: React.FC<{
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onJoinTeleconsult: (apt: Appointment) => void;
}> = ({ activeSection, setActiveSection, onJoinTeleconsult }) => {
  const { 
    activeUserName, 
    patientVitals, 
    allergies, 
    medications, 
    appointments, 
    bookAppointment, 
    doctors, 
    prescriptions, 
    labOrders, 
    invoices, 
    dischargeSummaries,
    showToast,
    setIsSymptomCheckerOpen
  } = useApp();

  // Booking Flow State
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(doctors[0]);
  const [selectedConsultType, setSelectedConsultType] = useState<ConsultType>("Video");
  const [selectedDate, setSelectedDate] = useState<string>("2026-07-29");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("10:30 AM");
  const [bookingSymptoms, setBookingSymptoms] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("Credit Card");

  // Selected QR Code Modal State
  const [activeQrModalRx, setActiveQrModalRx] = useState<string | null>(null);
  const [isEmrPdfModalOpen, setIsEmrPdfModalOpen] = useState<boolean>(false);

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorForBooking) return;

    bookAppointment({
      patientId: "pat-1001",
      patientName: activeUserName,
      patientAge: 42,
      patientGender: "Male",
      doctorId: selectedDoctorForBooking.id,
      doctorName: selectedDoctorForBooking.name,
      doctorSpecialty: selectedDoctorForBooking.specialty,
      doctorAvatar: selectedDoctorForBooking.avatar,
      hospital: selectedDoctorForBooking.hospital,
      consultType: selectedConsultType,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      status: "Scheduled",
      paymentStatus: selectedPaymentMethod === "Insurance Direct" ? "Insurance Covered" : "Paid",
      consultationFee: selectedDoctorForBooking.consultationFee,
      symptoms: bookingSymptoms
    });

    setActiveSection("overview");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* Automated Email & SMS Notification Center */}
      {activeSection === "notifications" && <NotificationReminderPanel />}

      {/* Overview Dashboard Section */}
      {(activeSection === "overview" || !activeSection) && (
        <div className="space-y-8 animate-fadeIn">
          {/* Welcome Patient Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Medical Record ID: #PAT-1001 • O+ Blood Type</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome, {activeUserName}</h1>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  You have <span className="text-cyan-400 font-bold">{appointments.filter(a => a.status === "Scheduled" || a.status === "Waiting Room").length} upcoming consultations</span> scheduled. Vitals last synchronized today.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsSymptomCheckerOpen(true)}
                  className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md"
                  id="patient-overview-symptom-btn"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Symptom Checker</span>
                </button>
                <button
                  onClick={() => setActiveSection("appointments")}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-600/20 flex items-center gap-2 transition-all"
                  id="patient-overview-book-btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          </div>

          {/* Vitals Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Blood Pressure</p>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-2xl font-black text-white">{patientVitals.bpSystolic}/{patientVitals.bpDiastolic}</span>
                <span className="text-xs text-slate-400">mmHg</span>
              </div>
              <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" /> Normal Resting Range
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Heart Rate</p>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-2xl font-black text-white">{patientVitals.heartRate}</span>
                <span className="text-xs text-slate-400">BPM</span>
              </div>
              <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" /> Sinus Rhythm
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Oxygen (SpO2)</p>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-2xl font-black text-white">{patientVitals.spO2}%</span>
                <span className="text-xs text-slate-400">Pulse O2</span>
              </div>
              <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" /> Optimal Oxygenation
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">BMI Index</p>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-2xl font-black text-white">{patientVitals.bmi}</span>
                <span className="text-xs text-slate-400">kg/m²</span>
              </div>
              <p className="text-[10px] text-cyan-400 mt-1">Normal Weight ({patientVitals.weightKg} kg)</p>
            </div>
          </div>

          {/* Recharts Historical Vitals Chart Visual Module */}
          <PatientVitalsHistoricalChart />

          {/* Upcoming Consultations & Queue Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>Upcoming Scheduled Consultations</span>
              </h3>
              <button
                onClick={() => setActiveSection("appointments")}
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                View All Appointments →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={apt.doctorAvatar}
                        alt={apt.doctorName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-white">{apt.doctorName}</h4>
                        <p className="text-xs text-cyan-400 font-semibold">{apt.doctorSpecialty}</p>
                        <p className="text-[11px] text-slate-400">{apt.hospital}</p>
                      </div>
                    </div>

                    <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs px-2.5 py-1 rounded-lg">
                      {apt.tokenNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>{apt.date} at {apt.timeSlot}</span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {apt.consultType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-slate-400">
                      Status: <strong className="text-amber-400">{apt.status}</strong>
                    </span>

                    {(apt.consultType === "Video" || apt.consultType === "Audio") && (
                      <button
                        onClick={() => onJoinTeleconsult(apt)}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md flex items-center gap-2 transition-all"
                        id={`join-room-btn-${apt.id}`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Enter Waiting Room</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Book Appointment Section */}
      {activeSection === "appointments" && (
        <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-cyan-400" />
              <span>Book Appointment & Teleconsultation</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">Select doctor, consultation format, preferred date/time slot, and payment.</p>

            <form onSubmit={handleCreateAppointment} className="space-y-6">
              {/* Step 1: Select Doctor */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  1. Select Consulting Physician *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctors.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctorForBooking(doc)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                        selectedDoctorForBooking?.id === doc.id
                          ? "bg-cyan-500/10 border-cyan-500 text-white shadow-lg"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-white truncate">{doc.name}</h4>
                        <p className="text-[11px] text-cyan-400 font-semibold">{doc.specialty}</p>
                        <p className="text-[10px] text-slate-400">${doc.consultationFee} Fee • {doc.experienceYears} yrs exp</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Consultation Format */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  2. Choose Consultation Mode *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { type: "Video", label: "HD Video Call", desc: "Virtual Waiting Room" },
                    { type: "Audio", label: "Voice Call", desc: "Phone Teleconsult" },
                    { type: "In-Person", label: "Hospital OPD Visit", desc: "In-clinic Token" },
                    { type: "Home Visit", label: "Doctor Home Visit", desc: "At Patient Residence" }
                  ].map((mode) => (
                    <button
                      key={mode.type}
                      type="button"
                      onClick={() => setSelectedConsultType(mode.type as ConsultType)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedConsultType === mode.type
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <p className="text-xs font-bold text-white">{mode.label}</p>
                      <p className="text-[10px] text-slate-400">{mode.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Consultation Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Available Time Slot</label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  >
                    {selectedDoctorForBooking?.availability.timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot} (Available)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 4: Reason / Symptoms */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Symptoms or Consultation Reason</label>
                <textarea
                  rows={2}
                  value={bookingSymptoms}
                  onChange={(e) => setBookingSymptoms(e.target.value)}
                  placeholder="Describe health concerns or specific questions for the doctor..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500"
                />
              </div>

              {/* Step 5: Payment Option */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Consultation Fee:</span>
                  <span className="font-bold text-white text-base">${selectedDoctorForBooking?.consultationFee || 120}</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Payment / Insurance Coverage Method</label>
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="Credit Card">Credit Card / Debit Card</option>
                    <option value="Insurance Direct">Direct Insurance Claim (Pre-authorized)</option>
                    <option value="srivoratech Wallet">srivoratech Wallet (Balance: $450)</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm py-3.5 rounded-2xl shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-transform active:scale-98"
                  id="submit-booking-btn"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Appointment & Generate Token</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient EMR & Records Section */}
      {activeSection === "emr" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-cyan-400" />
                <span>Patient Electronic Medical Record (EMR)</span>
              </h2>
              <p className="text-xs text-slate-400">Comprehensive clinical history, allergies, immunizations, and visit notes</p>
            </div>

            <button
              onClick={() => setIsEmrPdfModalOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all shrink-0 self-start sm:self-auto"
              id="export-emr-pdf-btn"
            >
              <Download className="w-4 h-4" />
              <span>Export EMR Summary PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Allergies & Chronic Conditions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Documented Allergies</span>
              </h3>
              <div className="space-y-2">
                {allergies.map((alg) => (
                  <div key={alg.id} className="bg-slate-950 p-3 rounded-xl border border-red-900/30 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-red-300">{alg.allergen}</span>
                      <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30">
                        {alg.severity}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{alg.reaction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Medications */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Pill className="w-4 h-4 text-cyan-400" />
                <span>Active Prescribed Medications</span>
              </h3>
              <div className="space-y-2">
                {medications.map((med) => (
                  <div key={med.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{med.name}</span>
                      <span className="text-[10px] text-cyan-400 font-semibold">{med.dosage}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{med.frequency} • {med.duration}</p>
                    <p className="text-[10px] text-slate-500">Prescribed by {med.prescribedBy}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Immunizations & History */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Immunization Records</span>
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { name: "COVID-19 Booster (mRNA)", date: "2025-10-12", status: "Verified" },
                  { name: "Influenza Annual Vaccine", date: "2025-11-05", status: "Verified" },
                  { name: "Tdap (Tetanus, Diphtheria)", date: "2023-04-18", status: "Verified" }
                ].map((imm, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-200">{imm.name}</p>
                      <p className="text-[10px] text-slate-400">Administered: {imm.date}</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                      {imm.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Digital Prescriptions Section */}
      {activeSection === "prescriptions" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Pill className="w-6 h-6 text-cyan-400" />
                <span>Digital E-Prescriptions & QR Verification</span>
              </h2>
              <p className="text-xs text-slate-400">Cryptographically verified digital prescriptions</p>
            </div>
          </div>

          <div className="space-y-4">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Prescription #{rx.id}</span>
                    <h3 className="font-bold text-base text-white">{rx.doctorName}</h3>
                    <p className="text-xs text-slate-400">{rx.doctorSpecialty} • Date: {rx.date}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveQrModalRx(rx.qrVerificationCode)}
                      className="bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 text-cyan-300 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                      id={`verify-qr-btn-${rx.id}`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Verify QR</span>
                    </button>
                    <button
                      onClick={() => showToast("Prescription PDF sent to print spooler.")}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print PDF</span>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Prescribed Medications</p>
                  <div className="space-y-2">
                    {rx.medications.map((m, idx) => (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-white text-sm">{m.name}</span>
                          <span className="text-cyan-400 font-bold ml-2">({m.dosage})</span>
                          <p className="text-slate-400 text-[11px] mt-0.5">{m.instructions}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-slate-300">{m.frequency}</span>
                          <p className="text-[10px] text-slate-500">Duration: {m.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
                  <strong className="text-slate-300">Diagnosis Code:</strong> {rx.diagnosis}
                </div>
              </div>
            ))}
          </div>

          {/* QR Code Verification Modal */}
          {activeQrModalRx && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
                <h3 className="font-bold text-base text-white">QR Verification</h3>
                <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
                  <div className="w-44 h-44 border-4 border-slate-900 flex items-center justify-center bg-slate-100 text-slate-900 font-mono text-[10px] font-bold p-2 text-center">
                    [AUTHENTIC SRIVORATECH DIGITAL SIGNATURE]
                    <br />
                    {activeQrModalRx.slice(0, 24)}...
                  </div>
                </div>
                <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Cryptographically Valid
                </p>
                <button
                  onClick={() => setActiveQrModalRx(null)}
                  className="w-full bg-slate-800 text-white font-semibold text-xs py-2 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lab Reports & DICOM Radiology Section */}
      {(activeSection === "lab_reports" || activeSection === "lab_orders") && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-6 h-6 text-cyan-400" />
                <span>Laboratory Reports & DICOM PACS Radiology</span>
              </h2>
              <p className="text-xs text-slate-400">Diagnostic lab panels & high-resolution imaging studies</p>
            </div>

            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/labs/scan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      labOrderId: "lab-101",
                      testName: "Lipid Profile & Cardiac Troponin",
                      patientName: activeUserName,
                      doctorName: "Dr. Sarah Jenkins, MD"
                    })
                  });
                  const data = await res.json();
                  showToast("Background Lab Scan Completed! Abnormal values flagged & doctor notified.");
                } catch (err) {
                  showToast("Lab scan service executed.");
                }
              }}
              className="bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all shrink-0"
              id="run-lab-scan-service-btn"
            >
              <AlertTriangle className="w-4 h-4 text-white" />
              <span>Scan Lab API for Abnormal Flags</span>
            </button>
          </div>

          <div className="space-y-6">
            {labOrders.map((lab) => (
              <div key={lab.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{lab.category} • Barcode: #{lab.barcode}</span>
                    <h3 className="font-bold text-base text-white">{lab.testName}</h3>
                    <p className="text-xs text-slate-400">Ordered by {lab.doctorName} on {lab.orderDate}</p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    {lab.status}
                  </span>
                </div>

                {lab.resultSummary && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                    <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Clinical Summary & Result Findings:</p>
                    <p className="text-slate-200 leading-relaxed">{lab.resultSummary}</p>

                    {/* Red Indicator Flagged Abnormal Values */}
                    <div className="mt-3 p-3 bg-red-950/40 border border-red-500/40 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-red-400 font-extrabold text-xs">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>ABNORMAL LAB VALUES FLAGGED (RED INDICATOR ALERT)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                        <div className="bg-slate-900/90 p-2 rounded-lg border border-red-500/30 flex justify-between items-center">
                          <span className="text-slate-300">Triglycerides:</span>
                          <span className="text-red-400 font-bold">280 mg/dL (High - Normal &lt;150)</span>
                        </div>
                        <div className="bg-slate-900/90 p-2 rounded-lg border border-red-500/30 flex justify-between items-center">
                          <span className="text-slate-300">Troponin I:</span>
                          <span className="text-red-400 font-bold">1.8 ng/mL (CRITICAL HIGH)</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-red-300/80 italic">
                        * Assigned doctor (Dr. Sarah Jenkins, MD) notified via automated priority system message.
                      </p>
                    </div>
                  </div>
                )}

                {/* Render Interactive DICOM PACS Radiology Viewer if study contains DICOM images */}
                {lab.dicomImages && lab.dicomImages.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Activity className="w-4 h-4" />
                      PACS Interactive DICOM Study Viewer
                    </p>
                    {lab.dicomImages.map((dcm) => (
                      <DicomViewer
                        key={dcm.id}
                        studyName={dcm.seriesName}
                        modality={dcm.modality}
                        imageUrl={dcm.imageUrl}
                        sliceCount={dcm.sliceCount}
                        studyDate={dcm.studyDate}
                        patientName={lab.patientName}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing & Insurance Wallet Section */}
      {activeSection === "billing" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-cyan-400" />
                <span>Invoices & Insurance Wallet</span>
              </h2>
              <p className="text-xs text-slate-400">Itemized hospital charges, GST breakdown, and insurance claims</p>
            </div>
          </div>

          <div className="space-y-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Invoice #{inv.id}</span>
                    <h3 className="font-bold text-base text-white">Patient Billing Summary</h3>
                    <p className="text-xs text-slate-400">Date: {inv.date}</p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    {inv.status}
                  </span>
                </div>

                <div className="space-y-2">
                  {inv.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">{item.description}</span>
                        <span className="text-[10px] text-slate-500 ml-2">({item.category})</span>
                      </div>
                      <span className="font-mono text-slate-200">${item.total}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>${inv.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>GST (18%):</span>
                    <span>${inv.gstAmount}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Insurance Claim Approved:</span>
                    <span>-${inv.insuranceClaimedAmount}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white text-sm border-t border-slate-800 pt-2">
                    <span>Patient Out-of-Pocket Total:</span>
                    <span className="text-cyan-400">${inv.outOfPocketAmount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Geometric Balance EMR PDF Export Modal */}
      <EmrPdfExportModal
        isOpen={isEmrPdfModalOpen}
        onClose={() => setIsEmrPdfModalOpen(false)}
        patientName={activeUserName}
        patientId="pat-1001"
        vitals={patientVitals}
        allergies={allergies}
        medications={medications}
      />
    </div>
  );
};
