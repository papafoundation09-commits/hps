import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Wifi, WifiOff, Database, RefreshCw, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const NetworkCacheBar: React.FC = () => {
  const { appointments, patientVitals, prescriptions, showToast } = useApp();
  const queryClient = useQueryClient();

  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Just now");

  // TanStack Query for Patient EMR & Appointments
  const { data: cachedEmrData, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["emrData", "pat-1001"],
    queryFn: async () => {
      // Simulate API fetch delay
      await new Promise((res) => setTimeout(res, 400));
      return {
        vitals: patientVitals,
        appointmentsCount: appointments.length,
        prescriptionsCount: prescriptions.length,
        syncedAt: new Date().toLocaleTimeString(),
      };
    },
    enabled: !isSimulatedOffline, // Don't fetch network when offline, return cached
    initialData: {
      vitals: patientVitals,
      appointmentsCount: appointments.length,
      prescriptionsCount: prescriptions.length,
      syncedAt: "Cached Session Data",
    },
  });

  const handleManualSync = () => {
    if (isSimulatedOffline) {
      showToast("Cannot sync: Connection is set to Offline mode.");
      return;
    }
    setIsSyncing(true);
    queryClient.invalidateQueries({ queryKey: ["emrData"] });
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString());
      showToast("TanStack Query Cache synchronized with Healthcare Server.");
    }, 600);
  };

  const toggleOfflineMode = () => {
    const nextState = !isSimulatedOffline;
    setIsSimulatedOffline(nextState);
    showToast(
      nextState
        ? "Simulated Offline Mode Enabled. EMR & Appointments served from TanStack Query Cache."
        : "Network Connection Restored! Syncing cached changes..."
    );
  };

  return (
    <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-medium">
          {isSimulatedOffline ? (
            <span className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-semibold text-[11px]">
              <WifiOff className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>Unstable / Offline Mode</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold text-[11px]">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>Online • Hospital Cloud Synced</span>
            </span>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 border-l border-slate-800 pl-3">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>TanStack Query Cache:</span>
          <span className="text-white font-mono font-bold">
            {cachedEmrData?.appointmentsCount || appointments.length} Appointments & EMR Records Preserved
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] text-cyan-300/80 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50 hidden md:inline-flex items-center gap-1">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>Offline Resilience Active</span>
        </span>

        <button
          onClick={handleManualSync}
          disabled={isSyncing || isSimulatedOffline}
          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all"
          title="Force refresh TanStack Query cache"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin text-cyan-400" : ""}`} />
          <span>{isSyncing ? "Syncing..." : "Sync Cache"}</span>
        </button>

        <button
          onClick={toggleOfflineMode}
          className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
            isSimulatedOffline
              ? "bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30"
              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
          }`}
          id="toggle-offline-mode-btn"
        >
          {isSimulatedOffline ? <WifiOff className="w-3 h-3 text-amber-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
          <span>{isSimulatedOffline ? "Restore Connection" : "Simulate Offline"}</span>
        </button>
      </div>
    </div>
  );
};
