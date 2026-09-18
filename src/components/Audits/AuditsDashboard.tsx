import React from 'react';
import { AuditRecord } from '../../types';
import {
  ClipboardCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Award,
  ShieldCheck,
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Flame,
  Check,
  Clock,
  Eye,
  Camera
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
} from 'recharts';

interface AuditsDashboardProps {
  audits: AuditRecord[];
  onNavigateSubTab?: (tab: 'audits' | 'architecture' | 'inspection' | 'corrective') => void;
}

export const AuditsDashboard: React.FC<AuditsDashboardProps> = ({
  audits,
  onNavigateSubTab,
}) => {
  // Aggregate Calculations
  const totalAudits = audits.length;
  const passedAudits = audits.filter((a) => a.status === 'Passed').length;
  const flaggedAudits = audits.filter((a) => a.status === 'Action Required' || a.status === 'Failed' || (a as any).status === 'Needs Attention').length;
  const fleetPassRate = totalAudits > 0 ? Math.round((passedAudits / totalAudits) * 100) : 85;

  const avgAuditScore = totalAudits > 0
    ? Math.round(audits.reduce((sum, a) => sum + (a.overallScore || (a as any).score || (a as any).complianceScore || 88), 0) / totalAudits)
    : 88;

  // Compliance Trend Data (6 weeks)
  const complianceTrendData = [
    { period: 'Week 1', score: 82, target: 90, violations: 12 },
    { period: 'Week 2', score: 86, target: 90, violations: 8 },
    { period: 'Week 3', score: 89, target: 90, violations: 6 },
    { period: 'Week 4', score: 94, target: 90, violations: 3 },
    { period: 'Week 5', score: 92, target: 90, violations: 4 },
    { period: 'Week 6', score: 97, target: 90, violations: 1 },
  ];

  // Store ranking by Audit Score
  const branchRankingData = audits.map((a) => ({
    name: a.outletName.replace("McDonald's ", 'MCD-').replace("Domino's ", 'DOM-').replace("KFC ", 'KFC-').slice(0, 14),
    score: a.overallScore || (a as any).score || 88,
    passed: a.status === 'Passed',
  }));

  // Violation Severity Breakdown
  const violationSeverityData = [
    { name: 'Critical Sanitation / Temp', count: 2, color: '#ef4444', pct: 20 },
    { name: 'High SOP Deviation', count: 3, color: '#f59e0b', pct: 30 },
    { name: 'Medium Labeling / Storage', count: 3, color: '#6366f1', pct: 30 },
    { name: 'Low Uniform / Grooming', count: 2, color: '#10b981', pct: 20 },
  ];

  return (
    <div id="audits-dashboard" className="space-y-6 pb-6">
      {/* 1. PRIMARY CHARTS: COMPLIANCE RUN-RATE & VIOLATION SEVERITY MIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fleet Compliance Trajectory vs Target Line/Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-indigo-600" />
                <span>Fleet Compliance Index Trajectory vs Benchmark (%)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Weekly audit scores across food safety, hygiene, and QSR brand standards
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-indigo-600">
                <span className="w-3 h-3 rounded-sm bg-indigo-600 inline-block" /> Audit Score
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-slate-300 inline-block" /> 90% Target
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="auditGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    `${val}%`,
                    name === 'score' ? 'Audit Compliance Score' : 'Target Threshold',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fill="url(#auditGrad)" name="score" />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="target" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-center text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Fleet Avg Audit</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">{avgAuditScore}% Score</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Pass Rate</span>
              <p className="text-sm font-black text-emerald-600 mt-0.5">{fleetPassRate}% Passed</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Stores Flagged</span>
              <p className="text-sm font-black text-rose-600 mt-0.5">{flaggedAudits} Action Required</p>
            </div>
          </div>
        </div>

        {/* Audit Violation Severity Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-rose-500" />
              <span>Infraction Severity Share</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of logged policy discrepancies
            </p>
          </div>

          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={violationSeverityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {violationSeverityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} infractions`, name]}
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
              <span className="text-[10px] text-slate-400 uppercase font-bold">Infractions</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {violationSeverityData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.count} ({item.pct}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. SECOND ROW: STORE AUDIT RANKINGS & AI CCTV COMPUTER VISION BENCHMARK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Store Ranking Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Store Audit Compliance Index by Location (%)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current audit scores evaluated across kitchen hygiene, storage, and customer service
              </p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchRankingData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Audit Score']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {branchRankingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score >= 90 ? '#10b981' : entry.score >= 80 ? '#6366f1' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI CCTV Computer Vision Telemetry */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-600" />
              <span>AI Vision Camera Telemetry</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Automated kitchen stream audits</p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <strong className="text-emerald-950">Hairnet & Uniform Check</strong>
                <span className="text-emerald-700 font-bold font-mono">99.4% Pass</span>
              </div>
              <p className="text-[11px] text-emerald-800">4,200 video frames scanned in past 24h</p>
            </div>

            <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <strong className="text-indigo-950">Food Holding Temperature</strong>
                <span className="text-indigo-700 font-bold font-mono">98.1% Normal</span>
              </div>
              <p className="text-[11px] text-indigo-800">Steam table +68°C • Chiller +3.2°C logged</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
