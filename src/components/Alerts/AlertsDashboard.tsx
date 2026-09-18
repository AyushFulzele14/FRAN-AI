import React from 'react';
import { AlertItem, Outlet } from '../../types';
import {
  BellRing,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Zap,
  Thermometer,
  Wrench,
  TrendingDown,
  PieChart as PieIcon,
  BarChart3,
  Flame,
  Radio
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

interface AlertsDashboardProps {
  alerts: AlertItem[];
  outlets?: Outlet[];
  onNavigateSubTab?: (tab: 'active' | 'rules' | 'resolved' | 'diagnostics') => void;
}

export const AlertsDashboard: React.FC<AlertsDashboardProps> = ({
  alerts,
  outlets,
  onNavigateSubTab,
}) => {
  // Calculations
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical').length;
  const highAlerts = alerts.filter((a) => a.severity === 'high').length;
  const mediumAlerts = alerts.filter((a) => a.severity === 'medium').length;
  const lowAlerts = alerts.filter((a) => a.severity === 'low').length;

  const resolvedAlertsCount = alerts.filter((a) => a.resolved).length;
  const resolutionRate = totalAlerts > 0 ? Math.round((resolvedAlertsCount / totalAlerts) * 100) : 78;

  // Severity Distribution Pie Chart Data
  const severityMix = [
    { name: 'Critical Incident', value: criticalAlerts || 1, color: '#ef4444' },
    { name: 'High Priority Alert', value: highAlerts || 2, color: '#f59e0b' },
    { name: 'Medium Operational', value: mediumAlerts || 2, color: '#6366f1' },
    { name: 'Low Advisory', value: lowAlerts || 1, color: '#10b981' },
  ];

  // Incidents Trend over past 8 hours
  const incidentVelocityData = [
    { time: '08:00', incidentCount: 1, resolvedCount: 1, avgMttrMins: 14 },
    { time: '10:00', incidentCount: 2, resolvedCount: 2, avgMttrMins: 12 },
    { time: '12:00', incidentCount: 4, resolvedCount: 3, avgMttrMins: 18 },
    { time: '14:00', incidentCount: 3, resolvedCount: 3, avgMttrMins: 15 },
    { time: '16:00', incidentCount: 2, resolvedCount: 2, avgMttrMins: 11 },
    { time: '18:00', incidentCount: 5, resolvedCount: 4, avgMttrMins: 20 },
    { time: '20:00', incidentCount: 4, resolvedCount: 4, avgMttrMins: 16 },
    { time: '22:00', incidentCount: 1, resolvedCount: 1, avgMttrMins: 9 },
  ];

  // Category Incident Count
  const categoryAlertCounts = [
    { category: 'Equipment & IoT Sensor', count: 3, color: '#ef4444' },
    { category: 'Inventory & Stock Out', count: 2, color: '#f59e0b' },
    { category: 'Drive-Thru & Speed SLA', count: 2, color: '#6366f1' },
    { category: 'Staffing & Absence', count: 1, color: '#10b981' },
  ];

  return (
    <div id="alerts-dashboard" className="space-y-6 pb-6">
      {/* 1. PRIMARY CHARTS: INCIDENT VELOCITY & SEVERITY MIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Incident Trigger Velocity & Resolution Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BellRing className="w-5 h-5 text-rose-500" />
                <span>Incident Generation & Automated Resolution Velocity</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time stream of triggered alerts vs dispatched operational interventions
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Active Sentinel Stream
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incidentVelocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="resolveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    `${val} incidents`,
                    name === 'incidentCount' ? 'Triggered Incidents' : 'Resolved & Closed',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="incidentCount" stroke="#ef4444" strokeWidth={2.5} fill="url(#alertGrad)" name="incidentCount" />
                <Area type="monotone" dataKey="resolvedCount" stroke="#10b981" strokeWidth={2} fill="url(#resolveGrad)" name="resolvedCount" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-center text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Mean Time to Resolve (MTTR)</span>
              <p className="text-sm font-black text-emerald-600 mt-0.5">14.2 Mins Avg</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Autonomous Auto-Fix</span>
              <p className="text-sm font-black text-indigo-600 mt-0.5">64% Auto-Handled</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Active Critical</span>
              <p className="text-sm font-black text-rose-600 mt-0.5">{criticalAlerts} Immediate Actions</p>
            </div>
          </div>
        </div>

        {/* Severity Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-rose-500" />
              <span>Incident Severity Share</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live alert distribution across criticality tiers
            </p>
          </div>

          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} alerts`, name]}
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
              <span className="text-2xl font-black text-slate-900">{totalAlerts}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Alerts</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {severityMix.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. SECOND ROW: INCIDENT CATEGORY BREAKDOWN & IOT SENSOR STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Count Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Incident Count by Operational Domain</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Root domain distribution across store sensors, POS streams, and kitchen equipment
              </p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryAlertCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} alerts`, 'Incident Count']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* IoT Hardware Telemetry Sentinel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-indigo-600" />
              <span>IoT Telemetry Hardware Status</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Connected kitchen sensors</p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <strong className="text-emerald-950">Walk-in Freezer Thermostats</strong>
                <span className="text-emerald-700 font-bold">-18.4°C Nominal</span>
              </div>
              <p className="text-[11px] text-emerald-800">12 / 12 units connected with battery 96%</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <strong className="text-slate-900">Fryer Oil Temperature Sensors</strong>
                <span className="text-indigo-700 font-bold">178°C In Range</span>
              </div>
              <p className="text-[11px] text-slate-500">Continuous telemetry heartbeat active</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <strong className="text-slate-900">Drive-Thru Timer Sensors</strong>
                <span className="text-slate-700 font-bold">100% Online</span>
              </div>
              <p className="text-[11px] text-slate-500">Optical vehicle detection calibrated</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
