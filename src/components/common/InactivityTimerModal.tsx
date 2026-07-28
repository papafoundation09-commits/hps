import React, { useEffect, useState } from "react";
import { Clock, ShieldAlert, LogOut, RefreshCw, AlertTriangle, Lock } from "lucide-react";

interface InactivityTimerModalProps {
  isWarningOpen: boolean;
  secondsRemaining: number;
  onExtendSession: () => void;
  onLogoutNow: () => void;
}

export const InactivityTimerModal: React.FC<InactivityTimerModalProps> = ({
  isWarningOpen,
  secondsRemaining,
  onExtendSession,
  onLogoutNow
}) => {
  if (!isWarningOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-slate-100 relative overflow-hidden">
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500" />

        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full mb-1.5">
              <Lock className="w-3 h-3" />
              <span>HIPAA Compliance Security Lock</span>
            </div>
            <h2 className="text-lg font-bold text-white">Inactivity Session Timeout Warning</h2>
            <p className="text-xs text-slate-300 mt-1">
              You have been inactive for an extended period. For patient data privacy, your session will automatically log out in:
            </p>
          </div>
        </div>

        {/* Countdown Visual Display */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
          <div className="text-3xl font-extrabold font-mono text-amber-400 flex items-center justify-center gap-2">
            <Clock className="w-6 h-6 animate-pulse text-amber-400" />
            <span>00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Seconds remaining before automatic session termination
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onExtendSession}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Extend Active Session</span>
          </button>

          <button
            onClick={onLogoutNow}
            className="bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700 hover:border-red-500/50 text-xs shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
