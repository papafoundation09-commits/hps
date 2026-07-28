import { useState, useEffect, useRef } from "react";
import { recordAuditLog } from "../services/auditLogService";
import { UserRole } from "../types";

interface UseInactivityTimerOptions {
  inactivityTimeoutMs?: number; // Time before warning modal opens (e.g., 2 minutes)
  warningDurationSec?: number; // Duration of warning modal countdown (e.g., 30 seconds)
  currentRole: UserRole;
  userName: string;
  onLogout: () => void;
  showToast: (msg: string) => void;
}

export function useInactivityTimer({
  inactivityTimeoutMs = 120000, // 2 minutes default
  warningDurationSec = 30,
  currentRole,
  userName,
  onLogout,
  showToast
}: UseInactivityTimerOptions) {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(warningDurationSec);

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetActivityTimer = () => {
    // If warning modal is open, don't reset unless extend is clicked
    if (isWarningOpen) return;

    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    inactivityTimerRef.current = setTimeout(() => {
      triggerWarning();
    }, inactivityTimeoutMs);
  };

  const triggerWarning = () => {
    setIsWarningOpen(true);
    setSecondsRemaining(warningDurationSec);
  };

  const handleExtendSession = () => {
    setIsWarningOpen(false);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    resetActivityTimer();
    showToast("Session extended successfully. Security lock reset.");
  };

  const handleLogoutNow = () => {
    setIsWarningOpen(false);
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    recordAuditLog(
      "user-session",
      userName,
      currentRole,
      "SESSION_TIMEOUT",
      "User Session",
      "session-lock",
      "Session terminated automatically due to user inactivity (HIPAA privacy lock).",
      undefined,
      "Access Alert"
    );

    onLogout();
    showToast("Security Timeout: Automatically logged out due to inactivity.");
  };

  // Activity listeners
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    const handleUserActivity = () => {
      resetActivityTimer();
    };

    events.forEach((evt) => window.addEventListener(evt, handleUserActivity));
    resetActivityTimer();

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleUserActivity));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [isWarningOpen, inactivityTimeoutMs]);

  // Countdown timer when warning modal is active
  useEffect(() => {
    if (isWarningOpen) {
      countdownTimerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current as NodeJS.Timeout);
            handleLogoutNow();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    }

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [isWarningOpen]);

  return {
    isWarningOpen,
    secondsRemaining,
    handleExtendSession,
    handleLogoutNow
  };
}
