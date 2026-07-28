import React from "react";
import { useApp } from "../../context/AppContext";
import { Wifi, WifiOff, RefreshCw, Database, FileText, CheckCircle2, Clock, Trash2, ShieldCheck, Zap, X, AlertTriangle } from "lucide-react";

interface SyncStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyncStatusModal: React.FC<SyncStatusModalProps> = ({ isOpen, onClose }) => {
  const {
    isOnline,
    isSimulatedOffline,
    setIsSimulatedOffline,
    syncStatus,
    syncQueue,
    processPendingSyncs,
    soapDraftTimestamps,
    clearSoapDraft,
    showToast
  } = useApp();

  if (!isOpen) return null;

  const activeDraftKeys = Object.keys(soapDraftTimestamps || {});

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl border ${
              syncStatus === "Synced" 
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : syncStatus === "Syncing"
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
            }`}>
              {syncStatus === "Synced" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : syncStatus === "Syncing" ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <WifiOff className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>CarePulse Offline Sync & Persistence Manager</span>
                <span className="text-xs bg-slate-800 text-cyan-400 border border-slate-700 px-2 py-0.5 rounded font-mono">
                  Redis-Queue Mode
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time connection monitoring, mutation queueing & local EMR SOAP note draft storage.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network & Offline Simulation Toggle */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              isOnline && !isSimulatedOffline
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}>
              {isOnline && !isSimulatedOffline ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6 animate-pulse" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-white">
                  {isOnline && !isSimulatedOffline ? "Network Online & Cloud Synchronized" : "Offline Mode Active (Local Persistence Enabled)"}
                </p>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isOnline && !isSimulatedOffline
                  ? "All API requests and EMR mutations sync directly with Cloud Database."
                  : "All SOAP note drafts and API mutations are saved locally and queued for background sync."}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSimulatedOffline(!isSimulatedOffline);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 flex items-center gap-1.5 ${
              isSimulatedOffline
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30"
                : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
            }`}
          >
            {isSimulatedOffline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
            <span>{isSimulatedOffline ? "Restore Connection" : "Simulate Connection Drop"}</span>
          </button>
        </div>

        {/* Background Mutation Sync Queue Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Pending Offline API Mutation Queue ({syncQueue.length})</span>
            </h3>

            {syncQueue.length > 0 && (
              <button
                onClick={processPendingSyncs}
                disabled={isSimulatedOffline}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Queue Now</span>
              </button>
            )}
          </div>

          {syncQueue.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400 space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
              <p className="font-bold text-white text-sm">Sync Queue is Empty</p>
              <p>No pending offline mutations. All EMR notes, prescriptions, and orders are synced.</p>
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Action Type</th>
                      <th className="p-3">Payload Summary</th>
                      <th className="p-3">Queued At</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {syncQueue.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3">
                          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
                            {item.actionType}
                          </span>
                        </td>
                        <td className="p-3 max-w-xs truncate text-slate-200">
                          {item.actionType === "ADD_SOAP_NOTE"
                            ? `SOAP Note: ${item.payload.subjective?.substring(0, 30)}...`
                            : item.actionType === "ADD_PRESCRIPTION"
                            ? `Rx: ${item.payload.medicationName}`
                            : JSON.stringify(item.payload).substring(0, 35)}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-400">{item.timestamp}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 text-amber-400 font-bold text-[11px] bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            <span>Queued</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* EMR SOAP Draft Storage Section */}
        <div className="space-y-3 border-t border-slate-800 pt-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Local Browser SOAP Note Drafts</span>
          </h3>

          {activeDraftKeys.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center text-xs text-slate-400">
              <p>No active ongoing SOAP drafts stored in browser storage.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeDraftKeys.map((key) => (
                <div key={key} className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white flex items-center gap-2">
                      <span>Target Record: {key}</span>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-mono">
                        Auto-Saved {soapDraftTimestamps[key]}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Draft safely preserved in local browser storage against network failures.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      clearSoapDraft(key);
                      showToast(`Cleared draft for ${key}`);
                    }}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            CarePulse uses local browser storage resilience to ensure HIPAA clinical records are never lost during sudden connectivity loss.
          </span>
        </div>
      </div>
    </div>
  );
};
