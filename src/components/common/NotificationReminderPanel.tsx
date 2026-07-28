import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { getNotificationLogs, sendInstantReminder, NotificationLog } from "../../services/notificationService";
import { 
  BellRing, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Send, 
  Filter, 
  Smartphone, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  X
} from "lucide-react";

export const NotificationReminderPanel: React.FC = () => {
  const { appointments, showToast } = useApp();
  const [logs, setLogs] = useState<NotificationLog[]>(getNotificationLogs());
  const [filterType, setFilterType] = useState<"All" | "Email" | "SMS" | "WhatsApp">("All");

  // Notification Preferences State
  const [isEmailEnabled, setIsEmailEnabled] = useState(true);
  const [isSmsEnabled, setIsSmsEnabled] = useState(true);
  const [isWhatsappEnabled, setIsWhatsappEnabled] = useState(true);
  const [reminderLeadTime, setReminderLeadTime] = useState("24 Hours & 2 Hours Prior");

  const [selectedAptId, setSelectedAptId] = useState<string>(appointments[0]?.id || "apt-1");

  const handleTriggerManualSend = (type: "Email" | "SMS" | "WhatsApp") => {
    const targetApt = appointments.find((a) => a.id === selectedAptId) || appointments[0];
    if (!targetApt) return;

    const newLog = sendInstantReminder(targetApt, type);
    setLogs(getNotificationLogs());
    showToast(`Automated ${type} reminder dispatched to ${targetApt.patientName}!`);
  };

  const filteredLogs = logs.filter((log) => filterType === "All" || log.type === filterType);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <BellRing className="w-3.5 h-3.5 text-cyan-400" />
            <span>Automated Patient Notification & Reminder Service</span>
          </div>
          <h2 className="text-xl font-bold text-white">SMS & Email Appointment Reminders</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure automated pre-consultation reminders, track delivery logs, and trigger instant alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setLogs(getNotificationLogs());
              showToast("Notification logs refreshed.");
            }}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Refresh Notification Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Manual Trigger & Rules Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Instant Dispatch Box */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <Send className="w-4 h-4 text-cyan-400" />
            <span>Dispatch Instant Patient Reminder</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target Scheduled Patient</label>
              <select
                value={selectedAptId}
                onChange={(e) => setSelectedAptId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-medium"
              >
                {appointments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.patientName} — {apt.consultType} ({apt.date} at {apt.timeSlot})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => handleTriggerManualSend("SMS")}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all text-xs"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Send SMS</span>
              </button>

              <button
                onClick={() => handleTriggerManualSend("Email")}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all text-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </button>

              <button
                onClick={() => handleTriggerManualSend("WhatsApp")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Reminder Schedule Toggles */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Automated Dispatch Rules & Gateways</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-white">Twilio SMS</span>
              </div>
              <input
                type="checkbox"
                checked={isSmsEnabled}
                onChange={(e) => setIsSmsEnabled(e.target.checked)}
                className="accent-cyan-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white">SendGrid Email</span>
              </div>
              <input
                type="checkbox"
                checked={isEmailEnabled}
                onChange={(e) => setIsEmailEnabled(e.target.checked)}
                className="accent-blue-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">WhatsApp API</span>
              </div>
              <input
                type="checkbox"
                checked={isWhatsappEnabled}
                onChange={(e) => setIsWhatsappEnabled(e.target.checked)}
                className="accent-emerald-500 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400">Automated Reminder Schedule Interval:</span>
            <span className="font-bold text-cyan-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              {reminderLeadTime}
            </span>
          </div>
        </div>
      </div>

      {/* Notification Delivery History Log Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Live Dispatch Logs & Delivery Receipts</span>
          </h3>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(["All", "Email", "SMS", "WhatsApp"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-0.5 rounded-lg font-semibold transition-all ${
                  filterType === t ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Type & Gateway</th>
                  <th className="p-3.5">Patient Recipient</th>
                  <th className="p-3.5">Message Payload Preview</th>
                  <th className="p-3.5">Sent Timestamp</th>
                  <th className="p-3.5">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                        log.type === "Email"
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                          : log.type === "SMS"
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}>
                        {log.type === "Email" ? <Mail className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                        <span>{log.type}</span>
                      </span>
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-white">{log.patientName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{log.recipient}</p>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <p className="text-[11px] text-slate-300 truncate" title={log.template}>
                        {log.template}
                      </p>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-400">
                      {log.sentTime || log.scheduledTime}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px] bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
