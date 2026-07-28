import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppContext";
import { 
  Users, 
  Clock, 
  Plus, 
  CheckCircle2, 
  UserCheck, 
  AlertTriangle, 
  Activity, 
  Wifi, 
  WifiOff, 
  ArrowRight, 
  X, 
  Stethoscope,
  Trash2,
  Bell
} from "lucide-react";

export interface WaitlistItem {
  id: string;
  patientName: string;
  patientAge: number;
  chiefComplaint: string;
  triageLevel: string;
  priorityColor: "red" | "amber" | "green";
  status: "Checked-in" | "With Doctor" | "Completed";
  arrivalTime: string;
  assignedDoctor: string;
}

export const VirtualWaitlist: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useApp();

  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([
    {
      id: "wait-1",
      patientName: "James Rodriguez",
      patientAge: 34,
      chiefComplaint: "Acute Chest Tightness & Dizziness",
      triageLevel: "Urgent (Level 2)",
      priorityColor: "amber",
      status: "Checked-in",
      arrivalTime: "08:45 AM",
      assignedDoctor: "Dr. Sarah Jenkins, MD"
    },
    {
      id: "wait-2",
      patientName: "Aaliyah Patel",
      patientAge: 27,
      chiefComplaint: "High Fever (102.4F) & Severe Migraine",
      triageLevel: "Emergent (Level 1)",
      priorityColor: "red",
      status: "With Doctor",
      arrivalTime: "08:20 AM",
      assignedDoctor: "Dr. Robert Chen, MD"
    },
    {
      id: "wait-3",
      patientName: "Lucas Vance",
      patientAge: 52,
      chiefComplaint: "Sprained Ankle & Contusion",
      triageLevel: "Routine (Level 4)",
      priorityColor: "green",
      status: "Completed",
      arrivalTime: "07:50 AM",
      assignedDoctor: "Dr. Elena Rostova, MD"
    }
  ]);

  const [isConnected, setIsConnected] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Walk-in form state
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(30);
  const [complaint, setComplaint] = useState("");
  const [priority, setPriority] = useState<"red" | "amber" | "green">("amber");
  const [assignedDoc, setAssignedDoc] = useState("Dr. Sarah Jenkins, MD");

  useEffect(() => {
    // Connect to WebSocket server on current host
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "waitlist:init" || message.type === "waitlist:update") {
            if (Array.isArray(message.data)) {
              setWaitlist(message.data);
            }
          }
        } catch (e) {
          console.error("Failed to parse WS waitlist message", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };

      return () => {
        ws.close();
      };
    } catch (e) {
      console.error("WS connection error", e);
    }
  }, []);

  const sendWsAction = (type: string, data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }));
    } else {
      // Fallback local state mutation if WS is connecting
      if (type === "waitlist:add") {
        const newItem: WaitlistItem = {
          id: `wait-${Date.now()}`,
          patientName: data.patientName,
          patientAge: data.patientAge,
          chiefComplaint: data.chiefComplaint,
          triageLevel: data.priorityColor === "red" ? "Emergent (Level 1)" : data.priorityColor === "amber" ? "Urgent (Level 2)" : "Routine (Level 3)",
          priorityColor: data.priorityColor,
          status: "Checked-in",
          arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          assignedDoctor: data.assignedDoctor
        };
        setWaitlist([newItem, ...waitlist]);
      } else if (type === "waitlist:update_status") {
        setWaitlist(waitlist.map((w) => w.id === data.id ? { ...w, status: data.newStatus } : w));
      } else if (type === "waitlist:delete") {
        setWaitlist(waitlist.filter((w) => w.id !== data.id));
      }
    }
  };

  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !complaint) {
      showToast("Please provide patient name and complaint.");
      return;
    }

    sendWsAction("waitlist:add", {
      patientName: name,
      patientAge: Number(age),
      chiefComplaint: complaint,
      priorityColor: priority,
      assignedDoctor: assignedDoc,
      triageLevel: priority === "red" ? "Emergent (Level 1)" : priority === "amber" ? "Urgent (Level 2)" : "Routine (Level 3)"
    });

    setIsAddModalOpen(false);
    setName("");
    setComplaint("");
    showToast(`Walk-in patient ${name} registered in Virtual Waitlist.`);
  };

  const handleUpdateStatus = (id: string, newStatus: WaitlistItem["status"]) => {
    sendWsAction("waitlist:update_status", { id, newStatus });
    showToast(`Patient status updated to ${newStatus}`);
  };

  const handleDeleteEntry = (id: string) => {
    sendWsAction("waitlist:delete", { id });
    showToast("Walk-in record removed.");
  };

  const columns: WaitlistItem["status"][] = ["Checked-in", "With Doctor", "Completed"];

  return (
    <div className="space-y-6">
      {/* Real-time Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t("virtualWaitlist")}</span>
            </span>

            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
              isConnected
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
            }`}>
              {isConnected ? <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" /> : <WifiOff className="w-3 h-3" />}
              <span>{isConnected ? "WebSocket Real-Time Live" : "Local Sync Mode"}</span>
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-white">Live Walk-in Triage & Patient Queue</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time walk-in patient registration, triage priority levels, and physician consultation tracking.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shrink-0"
          id="add-walkin-btn"
        >
          <Plus className="w-4 h-4" />
          <span>Check-in Walk-In Patient</span>
        </button>
      </div>

      {/* Real-time Kanban Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((colStatus) => {
          const colItems = waitlist.filter((w) => w.status === colStatus);

          return (
            <div key={colStatus} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    colStatus === "Checked-in" ? "bg-amber-400" : colStatus === "With Doctor" ? "bg-cyan-400" : "bg-emerald-400"
                  }`} />
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider">{colStatus}</h3>
                </div>

                <span className="bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                  {colItems.length}
                </span>
              </div>

              <div className="space-y-3.5 flex-1 min-h-[220px]">
                {colItems.length === 0 ? (
                  <div className="border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs my-auto">
                    No patients currently in this queue stage.
                  </div>
                ) : (
                  colItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950 border border-slate-800 hover:border-cyan-500/40 p-4 rounded-2xl space-y-3 transition-all shadow-md group relative"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-white">{item.patientName} ({item.patientAge}y)</h4>
                          <p className="text-[10px] text-slate-400 font-mono">Arrived at: {item.arrivalTime}</p>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          item.priorityColor === "red"
                            ? "bg-red-500/20 text-red-300 border-red-500/40"
                            : item.priorityColor === "amber"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        }`}>
                          {item.triageLevel}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                        "{item.chiefComplaint}"
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2 font-mono">
                        <span className="flex items-center gap-1 text-slate-300 font-semibold">
                          <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{item.assignedDoctor}</span>
                        </span>

                        <button
                          onClick={() => handleDeleteEntry(item.id)}
                          className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                          title="Remove from queue"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Status Transition Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        {colStatus === "Checked-in" && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, "With Doctor")}
                            className="w-full bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                          >
                            <span>Send to Doctor</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {colStatus === "With Doctor" && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, "Completed")}
                            className="w-full bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                          >
                            <span>Mark Consult Completed</span>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Walk-in Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Register Walk-in Patient</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWalkIn} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Maria Santos"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Chief Complaint / Symptoms</label>
                <input
                  type="text"
                  placeholder="e.g. Severe Abdominal Cramping & Nausea"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Triage Urgency</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="amber">Urgent (Yellow)</option>
                    <option value="red">Emergent (Red)</option>
                    <option value="green">Routine OPD (Green)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Assigned Physician</label>
                  <select
                    value={assignedDoc}
                    onChange={(e) => setAssignedDoc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Dr. Sarah Jenkins, MD">Dr. Sarah Jenkins, MD</option>
                    <option value="Dr. Robert Chen, MD">Dr. Robert Chen, MD</option>
                    <option value="Dr. Elena Rostova, MD">Dr. Elena Rostova, MD</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Check In Walk-In</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
