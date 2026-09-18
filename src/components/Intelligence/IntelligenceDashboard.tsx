import React from 'react';
import { Outlet } from '../../types';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  Activity,
  Bot,
  Zap,
  ShieldCheck,
  Compass,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  BarChart3,
  Cpu
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
} from 'recharts';
import {
  mockIntelligenceProblems,
  mockPredictiveForecasts,
  mockAutonomousAgents,
  mockEnterpriseSynergies,
} from '../../data/intelligenceData';

interface IntelligenceDashboardProps {
  outlets: Outlet[];
  onNavigateSubTab?: (tab: 'problems' | 'radar' | 'agents' | 'synergy' | 'simulator') => void;
}

export const IntelligenceDashboard: React.FC<IntelligenceDashboardProps> = ({
  outlets,
  onNavigateSubTab,
}) => {
  // Model & Reasoning Accuracy Trend
  const telemetryTrendData = [
    { time: '08:00', accuracy: 96.8, anomaliesDetected: 3, latencyMs: 110 },
    { time: '10:00', accuracy: 98.2, anomaliesDetected: 5, latencyMs: 125 },
    { time: '12:00', accuracy: 97.5, anomaliesDetected: 9, latencyMs: 140 },
    { time: '14:00', accuracy: 98.9, anomaliesDetected: 7, latencyMs: 115 },
    { time: '16:00', accuracy: 99.1, anomaliesDetected: 4, latencyMs: 105 },
    { time: '18:00', accuracy: 98.4, anomaliesDetected: 8, latencyMs: 130 },
    { time: '20:00', accuracy: 99.4, anomaliesDetected: 6, latencyMs: 120 },
    { time: '22:00', accuracy: 99.0, anomaliesDetected: 2, latencyMs: 98 },
  ];

  // Category Distribution of Root-Cause Cases
  const problemCategoryMix = [
    { name: 'Supply Chain & Cold Chain', count: 3, color: '#f59e0b', pct: 30 },
    { name: 'Kitchen & Fulfillment SLA', count: 3, color: '#6366f1', pct: 30 },
    { name: 'Labor & Staffing Overtime', count: 2, color: '#10b981', pct: 20 },
    { name: 'Aggregator Margin Drift', count: 2, color: '#ec4899', pct: 20 },
  ];

  // Agent Telemetry Workload
  const agentWorkloadData = mockAutonomousAgents.map((ag) => ({
    name: ag.name.split(' ')[0],
    actionsExecuted: ag.decisionsLast24H,
    accuracy: ag.accuracyRate,
    impact: Math.round(ag.monthlyRupeesSaved / 1000),
  }));

  // Predictive Demand Surge vs Actuals by Day
  const forecastTrendData = [
    { date: 'Mon', projectedDemand: 340, actualObserved: 355, historicalBaseline: 310 },
    { date: 'Tue', projectedDemand: 290, actualObserved: 285, historicalBaseline: 280 },
    { date: 'Wed', projectedDemand: 315, actualObserved: 320, historicalBaseline: 295 },
    { date: 'Thu', projectedDemand: 410, actualObserved: 425, historicalBaseline: 360 },
    { date: 'Fri', projectedDemand: 680, actualObserved: 710, historicalBaseline: 580 },
    { date: 'Sat', projectedDemand: 890, actualObserved: 920, historicalBaseline: 750 },
    { date: 'Sun', projectedDemand: 760, actualObserved: 740, historicalBaseline: 690 },
  ];

  return (
    <div id="intelligence-dashboard" className="space-y-6 pb-6">
      {/* 1. PRIMARY CHARTS: PREDICTIVE TELEMETRY & PROBLEM CATEGORY MIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Predictive Demand & Actual Velocity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-600" />
                <span>Multi-Horizon Neural Demand Forecast vs Baseline</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                AI projected orders across franchise cluster incorporating weather, paydays, and sports events
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                <Sparkles className="w-3 h-3" />
                98.4% Model Confidence
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="projectedDemand" name="Projected Demand (Orders)" stroke="#6366f1" strokeWidth={2.5} fill="url(#demandGrad)" />
                <Area type="monotone" dataKey="actualObserved" name="Actual Observed Orders" stroke="#10b981" strokeWidth={2} fill="url(#actualGrad)" />
                <Line type="monotone" dataKey="historicalBaseline" name="Historical 30D Average" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
            <div className="p-2 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Forecast Lead Horizon</span>
              <p className="text-sm font-black text-slate-800 mt-0.5">14 Days Ahead</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Forecast Accuracy</span>
              <p className="text-sm font-black text-emerald-600 mt-0.5">97.8% (±2.2%)</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Surge Variance Buffer</span>
              <p className="text-sm font-black text-indigo-600 mt-0.5">+18.5% Stocked</p>
            </div>
          </div>
        </div>

        {/* Root-Cause Problem Domain Mix */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" />
              <span>Operational Risk Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Active telemetry anomalies categorized by operational discipline
            </p>
          </div>

          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={problemCategoryMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {problemCategoryMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} active cases`, name]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">10</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Telemetry Cases</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {problemCategoryMix.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.count} issues ({item.pct}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SECOND ROW: AGENT WORKLOAD & REAL-TIME REASONING TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Autonomous Agents Throughput */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-600" />
                <span>Autonomous Agent Actions (24h)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Automated actions dispatched without human latency</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentWorkloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    name === 'actionsExecuted' ? `${value} actions` : `₹${value}k saved`,
                    name === 'actionsExecuted' ? 'Actions Executed' : 'Monthly Value',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="actionsExecuted" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-emerald-950">4 Active Sentinel Agents</span>
            </div>
            <span className="text-emerald-700 font-mono font-bold">100% SLA Uptime</span>
          </div>
        </div>

        {/* Real-Time Diagnostic Latency & Neural Accuracy */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                <span>Neural Inference Health & Telemetry Latency Curve</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time inference speed (ms) and anomaly precision monitoring
              </p>
            </div>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-mono font-bold rounded-lg">
              Avg Latency: 116ms
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} domain={[90, 150]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    name === 'latencyMs' ? `${val} ms` : `${val}%`,
                    name === 'latencyMs' ? 'Inference Latency' : 'Accuracy Rating',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="latencyMs" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1' }} name="Latency (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Model Precision: <strong>99.1%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-slate-600">Anomaly Recall: <strong>98.7%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-600">False Positive: <strong>&lt;0.4%</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. ENTERPRISE SYNERGY CLUSTERS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>Cross-Brand Multi-Store Synergies</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Consolidated savings unlocked through synchronized bulk procurement, shared logistics, and joint advertising
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Total Value Unlocked: ₹1,55,000 / mo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockEnterpriseSynergies.map((synergy, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-md">
                  {synergy.benchmarkTitle}
                </span>
                <span className="text-xs font-black text-emerald-700 font-mono">
                  {synergy.expectedGains}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900">{synergy.topPerformer}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{synergy.aiInsight}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Lagging Outlet:</span>
                <span className="font-bold text-slate-800">{synergy.laggingPerformer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
