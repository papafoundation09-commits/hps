import React from "react";
import { useApp } from "../../context/AppContext";
import { 
  Users, 
  FlaskConical, 
  CalendarClock, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  Clock,
  Zap,
  ArrowUpRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

export const QuickInsightsCards: React.FC = () => {
  const { appointments, labOrders } = useApp();

  const totalPatientsCount = appointments.length;
  const pendingLabsCount = labOrders.filter((l) => l.status === "Sample Collected" || l.status === "In Analysis" || l.status === "Ordered").length;
  const completedLabsCount = labOrders.filter((l) => l.status === "Completed").length;
  const upcomingFollowupsCount = appointments.filter((a) => a.consultType === "Follow-up" || a.status === "Confirmed").length;

  // Mini Chart Datasets
  const patientHourlyData = [
    { time: "8 AM", count: 2 },
    { time: "10 AM", count: 4 },
    { time: "12 PM", count: 6 },
    { time: "2 PM", count: 3 },
    { time: "4 PM", count: 5 }
  ];

  const labStatusData = [
    { name: "Completed", value: completedLabsCount || 4, color: "#10b981" },
    { name: "In Analysis", value: pendingLabsCount || 2, color: "#06b6d4" },
    { name: "Pending", value: 1, color: "#f59e0b" }
  ];

  const followupForecastData = [
    { day: "Mon", count: 3 },
    { day: "Tue", count: 5 },
    { day: "Wed", count: 8 },
    { day: "Thu", count: 6 },
    { day: "Fri", count: 4 }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <span>Quick Insights & Real-Time Clinical Analytics</span>
        </h3>
        <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full font-mono">
          Updated Live
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Today's Total Patients */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 hover:border-cyan-500/40 transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Today's Total Patients
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-white">{totalPatientsCount}</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +15%
                </span>
              </div>
            </div>

            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Recharts Micro Area Visual */}
          <div className="h-16 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patientHourlyData}>
                <defs>
                  <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#patientGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-medium">
            <span>Peak Flow: 12:00 PM</span>
            <span className="text-cyan-400">4 Teleconsults</span>
          </div>
        </div>

        {/* Card 2: Pending Lab Results */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 hover:border-amber-500/40 transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pending Lab Results
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-amber-400">{pendingLabsCount}</span>
                <span className="text-xs text-slate-400 font-mono">
                  / {labOrders.length} total
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-6 h-6" />
            </div>
          </div>

          {/* Recharts Micro Bar Chart for Lab Status */}
          <div className="h-16 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={labStatusData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {labStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-medium">
            <span>Critical Lipid Panel Ready</span>
            <span className="text-emerald-400 font-bold">{completedLabsCount} Verified</span>
          </div>
        </div>

        {/* Card 3: Upcoming Follow-ups */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 hover:border-emerald-500/40 transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Upcoming Follow-ups
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-emerald-400">{upcomingFollowupsCount}</span>
                <span className="text-xs font-bold text-cyan-400">Next 7 Days</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 group-hover:scale-105 transition-transform">
              <CalendarClock className="w-6 h-6" />
            </div>
          </div>

          {/* Recharts Bar Forecast */}
          <div className="h-16 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={followupForecastData}>
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-medium">
            <span>High Risk Cardio Recall: 2</span>
            <span className="text-emerald-400 font-bold">Auto-reminders active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
