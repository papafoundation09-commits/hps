import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area
} from "recharts";
import { Activity, Heart, Scale, TrendingUp, Filter, Calendar } from "lucide-react";

export const PatientVitalsHistoricalChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"1M" | "3M" | "6M" | "1Y">("3M");
  const [activeMetric, setActiveMetric] = useState<"all" | "bp" | "weight" | "heartRate">("all");

  // Historical Vitals Data Series
  const historicalVitalsData = [
    { date: "May 01", bpSystolic: 135, bpDiastolic: 88, weightKg: 78.5, heartRate: 82, spO2: 97 },
    { date: "May 15", bpSystolic: 132, bpDiastolic: 85, weightKg: 78.0, heartRate: 79, spO2: 98 },
    { date: "Jun 01", bpSystolic: 128, bpDiastolic: 84, weightKg: 77.2, heartRate: 76, spO2: 98 },
    { date: "Jun 15", bpSystolic: 126, bpDiastolic: 82, weightKg: 76.8, heartRate: 75, spO2: 99 },
    { date: "Jul 01", bpSystolic: 125, bpDiastolic: 83, weightKg: 76.0, heartRate: 74, spO2: 99 },
    { date: "Jul 15", bpSystolic: 122, bpDiastolic: 80, weightKg: 75.5, heartRate: 72, spO2: 99 },
    { date: "Jul 28", bpSystolic: 120, bpDiastolic: 78, weightKg: 75.0, heartRate: 71, spO2: 99 }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header & Metric Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Historical Vitals Analytics</span>
          </div>
          <h3 className="text-lg font-bold text-white">Blood Pressure, Weight & Heart Rate Trends</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Track long-term biometrics and medication efficacy over time.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Selector */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            {(["1M", "3M", "6M", "1Y"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeRange === range
                    ? "bg-cyan-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Metric Selector */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setActiveMetric("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeMetric === "all" ? "bg-slate-800 text-cyan-300" : "text-slate-400"
              }`}
            >
              All Metrics
            </button>
            <button
              onClick={() => setActiveMetric("bp")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeMetric === "bp" ? "bg-red-500/20 text-red-300 border border-red-500/40" : "text-slate-400"
              }`}
            >
              BP Only
            </button>
            <button
              onClick={() => setActiveMetric("weight")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeMetric === "weight" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400"
              }`}
            >
              Weight
            </button>
          </div>
        </div>
      </div>

      {/* Recharts Graphical Visualization Container */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={historicalVitalsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis yAxisId="left" stroke="#ef4444" tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[60, 160]} />
            <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[60, 90]} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "1rem",
                color: "#f8fafc",
                fontSize: "12px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)"
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />

            {(activeMetric === "all" || activeMetric === "bp") && (
              <>
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="bpSystolic"
                  name="Systolic BP (mmHg)"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorBp)"
                  strokeWidth={2.5}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bpDiastolic"
                  name="Diastolic BP (mmHg)"
                  stroke="#f97316"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </>
            )}

            {(activeMetric === "all" || activeMetric === "weight") && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="weightKg"
                name="Weight (kg)"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 4, fill: "#06b6d4" }}
              />
            )}

            {(activeMetric === "all" || activeMetric === "heartRate") && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="heartRate"
                name="Resting HR (BPM)"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, fill: "#10b981" }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Insights Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-4 text-xs">
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400">Systolic BP Improvement</p>
            <p className="font-extrabold text-white text-sm mt-0.5">-15 mmHg (135 → 120)</p>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400">Weight Loss Progress</p>
            <p className="font-extrabold text-white text-sm mt-0.5">-3.5 kg over 90 days</p>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400">Vitals Risk Profile</p>
            <p className="font-extrabold text-emerald-400 text-sm mt-0.5">Optimal / Low Cardiac Risk</p>
          </div>
        </div>
      </div>
    </div>
  );
};
