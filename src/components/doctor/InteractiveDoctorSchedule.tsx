import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Appointment, ConsultType } from "../../types";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Video, 
  UserCheck, 
  CheckCircle2, 
  Move, 
  GripVertical,
  AlertCircle,
  Filter,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Coffee
} from "lucide-react";

export const InteractiveDoctorSchedule: React.FC<{
  onStartTeleconsult?: (apt: Appointment) => void;
}> = ({ onStartTeleconsult }) => {
  const { appointments, bookAppointment, showToast } = useApp();

  // Local state for calendar appointments so drag-and-drop changes persist dynamically
  const [scheduledEvents, setScheduledEvents] = useState<Appointment[]>(appointments);
  const [selectedDay, setSelectedDay] = useState<string>("2026-07-29");
  const [draggedAptId, setDraggedAptId] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  // Availability Blocks
  const [customBlocks, setCustomBlocks] = useState<
    { id: string; title: string; timeSlot: string; type: "break" | "opd" | "teleconsult" }[]
  >([
    { id: "blk-1", title: "Hospital OPD Ward Rounds", timeSlot: "08:00 AM", type: "opd" },
    { id: "blk-2", title: "Lunch & Clinical Review", timeSlot: "01:00 PM", type: "break" }
  ]);

  const timeSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM"
  ];

  // Unassigned queue items (appointments without a slot or dragged to unassigned)
  const [unassignedQueue, setUnassignedQueue] = useState<Appointment[]>([
    {
      id: "apt-pending-101",
      patientId: "pat-1002",
      patientName: "David Miller",
      patientAge: 54,
      patientGender: "Male",
      doctorId: "doc-101",
      doctorName: "Dr. Sarah Jenkins",
      doctorSpecialty: "Cardiologist",
      doctorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
      hospital: "srivoratech Multi-Specialty Hospital",
      consultType: "Video",
      date: selectedDay,
      timeSlot: "Unassigned",
      status: "Waiting Room",
      paymentStatus: "Paid",
      consultationFee: 150,
      tokenNumber: "CP-T08",
      symptoms: "Arrhythmia checkup follow-up"
    },
    {
      id: "apt-pending-102",
      patientId: "pat-1003",
      patientName: "Elena Rostova",
      patientAge: 38,
      patientGender: "Female",
      doctorId: "doc-101",
      doctorName: "Dr. Sarah Jenkins",
      doctorSpecialty: "Cardiologist",
      doctorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
      hospital: "srivoratech Multi-Specialty Hospital",
      consultType: "In-Person",
      date: selectedDay,
      timeSlot: "Unassigned",
      status: "Scheduled",
      paymentStatus: "Paid",
      consultationFee: 150,
      tokenNumber: "CP-T09",
      symptoms: "Post-op stent checkup"
    }
  ]);

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, aptId: string, fromQueue: boolean = false) => {
    setDraggedAptId(aptId);
    e.dataTransfer.setData("text/plain", JSON.stringify({ aptId, fromQueue }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, slot: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverSlot !== slot) {
      setDragOverSlot(slot);
    }
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, targetSlot: string) => {
    e.preventDefault();
    setDragOverSlot(null);
    if (!draggedAptId) return;

    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain") || "{}");
      const { aptId, fromQueue } = data;

      if (fromQueue) {
        // Move from unassigned queue to calendar slot
        const itemToMove = unassignedQueue.find((a) => a.id === aptId);
        if (itemToMove) {
          const updatedItem = { ...itemToMove, timeSlot: targetSlot, date: selectedDay };
          setScheduledEvents((prev) => [...prev, updatedItem]);
          setUnassignedQueue((prev) => prev.filter((a) => a.id !== aptId));
          showToast(`Scheduled ${itemToMove.patientName} for ${targetSlot}!`);
        }
      } else {
        // Move from one calendar slot to another
        setScheduledEvents((prev) =>
          prev.map((apt) =>
            apt.id === aptId ? { ...apt, timeSlot: targetSlot, date: selectedDay } : apt
          )
        );
        const aptName = scheduledEvents.find((a) => a.id === aptId)?.patientName || "Session";
        showToast(`Rescheduled ${aptName} to ${targetSlot}`);
      }
    } catch (err) {
      console.error("Drop error:", err);
    } finally {
      setDraggedAptId(null);
    }
  };

  // Add custom availability block
  const handleAddAvailabilityBlock = (slot: string, type: "opd" | "break" | "teleconsult") => {
    const titleMap = {
      opd: "OPD Physical Clinic Hours",
      break: "Physician Break / Admin Time",
      teleconsult: "Dedicated Virtual Teleconsult Slot"
    };
    const newBlock = {
      id: `blk-${Date.now()}`,
      title: titleMap[type],
      timeSlot: slot,
      type
    };
    setCustomBlocks((prev) => [...prev, newBlock]);
    showToast(`Added '${titleMap[type]}' to ${slot}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Calendar Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Drag-and-Drop Doctor Calendar</span>
          </div>
          <h2 className="text-xl font-bold text-white">Daily Schedule & Slot Availability Manager</h2>
          <p className="text-xs text-slate-400 mt-1">
            Drag appointments onto time slots to reassign, manage OPD vs Teleconsult availability blocks in real time.
          </p>
        </div>

        {/* Date Selector & Actions */}
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white shadow-md"
          />
          <button
            onClick={() => showToast("Daily schedule synced to Hospital EHR Queue.")}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Publish Schedule</span>
          </button>
        </div>
      </div>

      {/* Main Drag and Drop Interface (Queue Sidebar + Schedule Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Unassigned Patient Queue Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Unscheduled Queue ({unassignedQueue.length})</span>
            </h3>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
              Drag to Grid
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Drag any unscheduled patient card below directly onto a calendar time slot to assign them.
          </p>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {unassignedQueue.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                All patient requests scheduled!
              </div>
            ) : (
              unassignedQueue.map((apt) => (
                <div
                  key={apt.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, apt.id, true)}
                  className="bg-slate-950 border border-amber-500/30 hover:border-amber-400 p-4 rounded-2xl shadow-md cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02] space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-slate-600 group-hover:text-amber-400" />
                      <span className="font-bold text-xs text-white">{apt.patientName}</span>
                    </div>
                    <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
                      {apt.tokenNumber}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 pl-6">
                    {apt.patientAge}y {apt.patientGender} • Mode: <strong className="text-white">{apt.consultType}</strong>
                  </p>

                  {apt.symptoms && (
                    <p className="text-[10px] text-slate-400 italic pl-6 truncate">
                      "{apt.symptoms}"
                    </p>
                  )}

                  <div className="pl-6 pt-1 flex items-center gap-2 text-[10px] text-amber-400 font-semibold">
                    <Move className="w-3 h-3" />
                    <span>Drag onto time slot →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calendar Time Slot Grid */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Daily Time Slot Grid ({selectedDay})</h3>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Video Call
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> In-Person
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span> Blocked/Break
              </span>
            </div>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-2">
            {timeSlots.map((slot) => {
              const matchedApts = scheduledEvents.filter(
                (a) => a.timeSlot === slot || (slot === "10:30 AM" && a.timeSlot === "10:30 AM")
              );
              const matchedBlocks = customBlocks.filter((b) => b.timeSlot === slot);
              const isTargetSlot = dragOverSlot === slot;

              return (
                <div
                  key={slot}
                  onDragOver={(e) => handleDragOver(e, slot)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, slot)}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isTargetSlot
                      ? "bg-cyan-950/60 border-2 border-dashed border-cyan-400 scale-[1.01] shadow-xl"
                      : "bg-slate-950 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  {/* Slot Label */}
                  <div className="w-24 shrink-0 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-mono text-xs font-bold text-white">{slot}</span>
                  </div>

                  {/* Slot Content Container */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Render Availability Custom Blocks */}
                    {matchedBlocks.map((blk) => (
                      <div
                        key={blk.id}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                          blk.type === "break"
                            ? "bg-slate-800/80 text-slate-300 border-slate-700"
                            : "bg-emerald-950/30 text-emerald-300 border-emerald-800/50"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {blk.type === "break" ? <Coffee className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>{blk.title}</span>
                        </span>
                        <button
                          onClick={() => setCustomBlocks((prev) => prev.filter((b) => b.id !== blk.id))}
                          className="text-[10px] text-slate-500 hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {/* Render Scheduled Appointments */}
                    {matchedApts.map((apt) => (
                      <div
                        key={apt.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, apt.id, false)}
                        className={`p-3 rounded-xl border shadow-lg cursor-grab active:cursor-grabbing transition-all flex items-center justify-between gap-3 ${
                          apt.consultType === "Video"
                            ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-100"
                            : "bg-emerald-950/40 border-emerald-500/50 text-emerald-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <GripVertical className="w-4 h-4 text-slate-500" />
                          <img
                            src={apt.doctorAvatar}
                            alt={apt.patientName}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-white truncate">{apt.patientName}</p>
                            <p className="text-[10px] text-slate-300 truncate">
                              {apt.patientAge}y {apt.patientGender} • Token: <strong className="text-cyan-300">{apt.tokenNumber}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            apt.consultType === "Video"
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          }`}>
                            {apt.consultType}
                          </span>

                          {onStartTeleconsult && apt.consultType === "Video" && (
                            <button
                              onClick={() => onStartTeleconsult(apt)}
                              className="bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow"
                            >
                              <Video className="w-3 h-3" />
                              <span>Launch</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {matchedApts.length === 0 && matchedBlocks.length === 0 && (
                      <div className="text-[11px] text-slate-500 py-1.5 px-3 border border-dashed border-slate-800 rounded-xl flex items-center justify-between group hover:border-cyan-500/40 transition-colors">
                        <span>Available Slot — Drag patient here</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            onClick={() => handleAddAvailabilityBlock(slot, "opd")}
                            className="text-[10px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700 hover:bg-slate-700"
                          >
                            + OPD Block
                          </button>
                          <button
                            onClick={() => handleAddAvailabilityBlock(slot, "break")}
                            className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700 hover:bg-slate-700"
                          >
                            + Break
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
