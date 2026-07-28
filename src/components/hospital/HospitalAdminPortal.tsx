import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { AuditLogTable } from "../admin/AuditLogTable";
import { VirtualWaitlist } from "./VirtualWaitlist";
import { ReferralManagement } from "../doctor/ReferralManagement";
import { 
  Building2, 
  Users, 
  Activity, 
  CreditCard, 
  Pill, 
  FlaskConical, 
  FolderKanban, 
  QrCode, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Printer, 
  ShieldCheck,
  TrendingUp,
  BarChart2,
  PieChart as PieChartIcon
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";

const REVENUE_ANALYTICS = [
  { month: "Jan", OPD: 42000, IPD: 95000, Pharmacy: 28000, Lab: 32000 },
  { month: "Feb", OPD: 48000, IPD: 102000, Pharmacy: 31000, Lab: 36000 },
  { month: "Mar", OPD: 51000, IPD: 110000, Pharmacy: 34000, Lab: 41000 },
  { month: "Apr", OPD: 47000, IPD: 98000, Pharmacy: 30000, Lab: 35000 },
  { month: "May", OPD: 56000, IPD: 125000, Pharmacy: 39000, Lab: 45000 },
  { month: "Jun", OPD: 62000, IPD: 138000, Pharmacy: 42000, Lab: 51000 },
];

export const HospitalAdminPortal: React.FC<{ activeSection: string }> = ({ activeSection }) => {
  const { 
    currentRole, 
    appointments, 
    pharmacyItems, 
    updatePharmacyStock, 
    labOrders, 
    updateLabStatus, 
    invoices, 
    updateInvoiceStatus,
    showToast
  } = useApp();

  // Reception Registration State
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regDept, setRegDept] = useState("Cardiology");

  // Lab Sample Barcode Search
  const [barcodeQuery, setBarcodeQuery] = useState("");

  // Pharmacy Inventory Search
  const [pharmacySearch, setPharmacySearch] = useState("");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* Real-Time Virtual Waitlist Section */}
      {(activeSection === "waitlist" || currentRole === "receptionist") && (
        <VirtualWaitlist />
      )}

      {/* Specialist Referral Pipeline Section */}
      {activeSection === "referrals" && (
        <ReferralManagement />
      )}
      {/* Role Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-cyan-400" />
            <span className="capitalize">{currentRole.replace("_", " ")} Portal</span>
          </h1>
          <p className="text-xs text-slate-400">srivoratech Operational Hospital Management & Resource Controls</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-3 py-1 rounded-full">
            System Operational • 99.98% Uptime
          </span>
        </div>
      </div>

      {/* Hospital Admin Perspective */}
      {(currentRole === "hospital_admin" || activeSection === "overview") && (
        <div className="space-y-8 animate-fadeIn">
          {/* Executive Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ICU & Bed Occupancy</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">88%</span>
                <span className="text-xs text-amber-400 font-semibold">142 / 160 Beds</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-400 h-full w-[88%]"></div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active On-Duty Doctors</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">34</span>
                <span className="text-xs text-emerald-400 font-semibold">12 Teleconsulting</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">OPD Tokens Processed</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-cyan-400">184</span>
                <span className="text-xs text-slate-400">Today</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monthly Revenue</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">$293,000</span>
                <span className="text-xs text-emerald-400 font-semibold">+14.2%</span>
              </div>
            </div>
          </div>

          {/* Revenue Analytics Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>Hospital Operational Revenue Breakdown ($ USD)</span>
              </h3>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_ANALYTICS}>
                  <defs>
                    <linearGradient id="colorOpd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorIpd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", fontSize: "12px", borderRadius: "12px" }} />
                  <Area type="monotone" dataKey="IPD" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIpd)" />
                  <Area type="monotone" dataKey="OPD" stroke="#06b6d4" fillOpacity={1} fill="url(#colorOpd)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* HIPAA Security & Compliance Audit Log Table */}
          <AuditLogTable />
        </div>
      )}

      {/* Receptionist Walk-In & OPD Token Perspective */}
      {currentRole === "receptionist" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Walk-in Registration Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Walk-In Patient OPD Registration</span>
              </h3>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast(`Walk-in patient "${regName}" registered! Issued Token #CP-T${appointments.length + 1}`);
                  setRegName("");
                  setRegPhone("");
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Robert Smith"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+1 (555) 019-2831"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Target Department</label>
                    <select
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                    >
                      <option value="Cardiology">Cardiology OPD</option>
                      <option value="Neurology">Neurology OPD</option>
                      <option value="Pediatrics">Pediatrics OPD</option>
                      <option value="Orthopedics">Orthopedics OPD</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all"
                >
                  Generate OPD Queue Token & Register
                </button>
              </form>
            </div>

            {/* Live Token Display Queue */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <FolderKanban className="w-5 h-5 text-amber-400" />
                <span>OPD Queue Token Monitor</span>
              </h3>

              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-cyan-400">{apt.tokenNumber}</span>
                      <p className="font-bold text-white text-sm mt-0.5">{apt.patientName}</p>
                      <p className="text-[10px] text-slate-400">{apt.doctorName} • {apt.consultType}</p>
                    </div>

                    <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold px-2.5 py-1 rounded-lg">
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lab Tech Sample Tracking Perspective */}
      {currentRole === "lab_tech" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-400" />
                <span>Diagnostic Sample Tracking & Validation</span>
              </h3>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Scan specimen barcode..."
                  value={barcodeQuery}
                  onChange={(e) => setBarcodeQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              {labOrders.map((lab) => (
                <div key={lab.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-cyan-400 font-bold">BARCODE: #{lab.barcode}</span>
                      <h4 className="font-bold text-white text-sm">{lab.testName}</h4>
                      <p className="text-slate-400">Patient: {lab.patientName} • Specimen: {lab.specimenType || "Venous Blood"}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {lab.status === "Ordered" && (
                        <button
                          onClick={() => updateLabStatus(lab.id, "Sample Collected")}
                          className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                        >
                          Collect Sample
                        </button>
                      )}

                      {lab.status === "Sample Collected" && (
                        <button
                          onClick={() => updateLabStatus(lab.id, "Processing")}
                          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                        >
                          Start Processing
                        </button>
                      )}

                      {lab.status === "Processing" && (
                        <button
                          onClick={() => updateLabStatus(lab.id, "Completed", "Automated Hematology Analyzer: Normal parameters. Verified by Senior Tech.")}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                        >
                          Validate & Upload Report
                        </button>
                      )}

                      {lab.status === "Completed" && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-lg">
                          Report Validated
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pharmacist Inventory Perspective */}
      {currentRole === "pharmacist" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-400" />
                <span>Pharmacy Inventory & Barcode Stock Search</span>
              </h3>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search medicine stock..."
                  value={pharmacySearch}
                  onChange={(e) => setPharmacySearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pharmacyItems.map((item) => (
                <div key={item.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <p className="text-cyan-400 font-semibold">{item.genericName}</p>
                      <p className="text-slate-400 text-[10px]">{item.manufacturer} • {item.location}</p>
                    </div>

                    <span className="font-bold text-emerald-400 text-sm">${item.unitPrice} / unit</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
                    <div>
                      <span className="text-slate-400 text-[11px]">In Stock:</span>
                      <strong className={`ml-1 text-sm ${item.stockQty <= item.reorderLevel ? "text-red-400 font-black" : "text-white"}`}>
                        {item.stockQty} units
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updatePharmacyStock(item.id, -10)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs font-bold"
                        title="Dispense 10 units"
                      >
                        -10 Dispense
                      </button>
                      <button
                        onClick={() => updatePharmacyStock(item.id, 50)}
                        className="bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2 py-1 rounded text-xs font-bold"
                        title="Restock 50 units"
                      >
                        +50 Restock
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insurance & Billing Staff Perspective */}
      {currentRole === "insurance_staff" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <span>Master Insurance Claims & Billing Operations</span>
            </h3>

            <div className="space-y-4">
              {invoices.map((inv) => (
                <div key={inv.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-cyan-400 font-bold">INVOICE #{inv.id}</span>
                      <h4 className="font-bold text-white text-sm">{inv.patientName}</h4>
                      <p className="text-slate-400">Total: ${inv.totalAmount} • Insurance Claimed: ${inv.insuranceClaimedAmount}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {inv.status === "Claim Submitted" && (
                        <button
                          onClick={() => updateInvoiceStatus(inv.id, "Claim Approved")}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                        >
                          Approve Claim
                        </button>
                      )}

                      <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-3 py-1 rounded-lg">
                        {inv.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
