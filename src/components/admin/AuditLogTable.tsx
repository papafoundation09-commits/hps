import React, { useState } from "react";
import { getAuditLogs, AuditLogEntry } from "../../services/auditLogService";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  FileText, 
  Lock, 
  UserCheck, 
  RefreshCw, 
  AlertTriangle,
  Download,
  Eye,
  Activity
} from "lucide-react";

export const AuditLogTable: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(getAuditLogs());
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("All");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.patientName && log.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.resourceId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === "All" || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>HIPAA Compliance & Immutable Security Audit Log</span>
          </div>
          <h2 className="text-xl font-bold text-white">System Read-Only Access & Change Audit Records</h2>
          <p className="text-xs text-slate-400 mt-1">
            Tracks critical clinical operations including EMR updates, prescription creations, and record access logs.
          </p>
        </div>

        <button
          onClick={() => setLogs(getAuditLogs())}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors self-start md:self-auto flex items-center gap-1.5 text-xs font-bold"
          title="Refresh Audit Log Table"
        >
          <RefreshCw className="w-4 h-4 text-cyan-400" />
          <span>Refresh Audit Stream</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search user, patient, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-medium w-full sm:w-auto"
          >
            <option value="All">All Actions</option>
            <option value="EMR_UPDATE">EMR Updates</option>
            <option value="PRESCRIPTION_CREATE">Prescription Created</option>
            <option value="PRESCRIPTION_VIEW">Prescription Viewed</option>
            <option value="PATIENT_RECORD_VIEW">Patient Record Viewed</option>
            <option value="LAB_ORDER_CREATE">Lab Order Created</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor (User)</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Target Patient & Resource</th>
                <th className="p-3.5">Encounter Details</th>
                <th className="p-3.5">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="p-3.5">
                    <p className="font-bold text-white">{log.userName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Role: {log.userRole} | {log.ipAddress}
                    </p>
                  </td>

                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border font-mono ${
                      log.action === "EMR_UPDATE"
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                        : log.action === "PRESCRIPTION_CREATE"
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                        : log.action === "PRESCRIPTION_VIEW"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    }`}>
                      {log.action}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <p className="font-bold text-slate-200">{log.patientName || "System Scope"}</p>
                    <p className="text-[10px] text-slate-400">{log.resourceType} ({log.resourceId})</p>
                  </td>

                  <td className="p-3.5 max-w-xs">
                    <p className="text-[11px] text-slate-300 leading-snug">{log.details}</p>
                  </td>

                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[10px] bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full whitespace-nowrap">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{log.complianceFlag}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
