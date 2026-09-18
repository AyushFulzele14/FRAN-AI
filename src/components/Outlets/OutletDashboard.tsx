import React, { useState } from 'react';
import { Outlet } from '../../types';
import {
  BarChart3,
  Flame,
  Sliders,
  ShieldCheck,
  Compass,
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
  Line,
  ScatterChart,
  Scatter,
} from 'recharts';

interface OutletDashboardProps {
  outlets: Outlet[];
  onSelectOutletAndNavigate: (outlet: Outlet) => void;
  onOpenCompareModal?: () => void;
  onOpenRecoveryModal?: (outlet: Outlet) => void;
  isLiveSimulating?: boolean;
}

export const OutletDashboard: React.FC<OutletDashboardProps> = ({
  outlets,
  onSelectOutletAndNavigate,
}) => {
  const [regionFilter, setRegionFilter] = useState<string>('All');

  // Aggregated Fleet Metrics
  const totalOutletsCount = outlets.length;
  const totalMonthlyRevenue = outlets.reduce((sum, o) => sum + o.monthlyRevenue, 0);
  const totalMonthlyTarget = outlets.reduce((sum, o) => sum + o.monthlyTarget, 0);
  
  const avgHealthScore = Math.round(
    outlets.reduce((sum, o) => sum + o.healthScore, 0) / (totalOutletsCount || 1)
  );
  
  const avgFulfillmentTime = (
    outlets.reduce((sum, o) => sum + o.fulfillmentTimeMin, 0) / (totalOutletsCount || 1)
  ).toFixed(1);

  // Consolidated Channel Mix
  const fleetChannelData = [
    {
      name: 'Dine-In',
      value: Math.round(
        outlets.reduce((sum, o) => sum + (o.salesByChannel?.dineIn || 0), 0) / (totalOutletsCount || 1)
      ),
      color: '#10b981',
    },
    {
      name: 'Takeaway',
      value: Math.round(
        outlets.reduce((sum, o) => sum + (o.salesByChannel?.takeaway || 0), 0) / (totalOutletsCount || 1)
      ),
      color: '#6366f1',
    },
    {
      name: 'Delivery',
      value: Math.round(
        outlets.reduce((sum, o) => sum + (o.salesByChannel?.delivery || 0), 0) / (totalOutletsCount || 1)
      ),
      color: '#06b6d4',
    },
    {
      name: 'Drive-Thru',
      value: Math.round(
        outlets.reduce((sum, o) => sum + (o.salesByChannel?.driveThru || 0), 0) / (totalOutletsCount || 1)
      ),
      color: '#f59e0b',
    },
  ];

  // Store revenue comparison chart data
  const revenueComparisonData = outlets.map((o) => ({
    id: o.id,
    name: o.name.replace("Domino's ", '').replace("McDonald's ", '').replace("KFC ", ''),
    fullOutlet: o,
    actualRevenue: Math.round(o.monthlyRevenue / 1000),
    targetRevenue: Math.round(o.monthlyTarget / 1000),
    healthScore: o.healthScore,
    isUnderperforming: o.isUnderperforming,
  }));

  // Hourly Fleet Peak Traffic & Order Load Trend
  const hourlyTrafficTrend = [
    { hour: '09:00', orders: 42, speedMin: 9.2, capacityPct: 35 },
    { hour: '11:00', orders: 98, speedMin: 10.8, capacityPct: 58 },
    { hour: '13:00', orders: 284, speedMin: 14.5, capacityPct: 92 },
    { hour: '15:00', orders: 125, speedMin: 11.2, capacityPct: 62 },
    { hour: '17:00', orders: 168, speedMin: 12.0, capacityPct: 74 },
    { hour: '19:00', orders: 345, speedMin: 16.8, capacityPct: 98 },
    { hour: '21:00', orders: 290, speedMin: 15.2, capacityPct: 88 },
    { hour: '23:00', orders: 84, speedMin: 9.8, capacityPct: 40 },
  ];

  // Radar/Ribbon Matrix: Top Performer vs Average vs At-Risk
  const topPerformer = [...outlets].sort((a, b) => b.healthScore - a.healthScore)[0] || outlets[0];
  const lowestPerformer = [...outlets].sort((a, b) => a.healthScore - b.healthScore)[0] || outlets[0];

  const fleetRadarData = [
    {
      metric: 'Revenue Run-Rate',
      TopStore: Math.min(100, Math.round(((topPerformer.monthlyRevenue || 0) / (topPerformer.monthlyTarget || 1)) * 100)),
      FleetAvg: Math.min(100, Math.round((totalMonthlyRevenue / (totalMonthlyTarget || 1)) * 100)),
      LowStore: Math.min(100, Math.round(((lowestPerformer.monthlyRevenue || 0) / (lowestPerformer.monthlyTarget || 1)) * 100)),
    },
    {
      metric: 'Health Score',
      TopStore: topPerformer.healthScore,
      FleetAvg: avgHealthScore,
      LowStore: lowestPerformer.healthScore,
    },
    {
      metric: 'Hygiene & Audit',
      TopStore: topPerformer.auditScore,
      FleetAvg: Math.round(outlets.reduce((s, o) => s + o.auditScore, 0) / (outlets.length || 1)),
      LowStore: lowestPerformer.auditScore,
    },
    {
      metric: 'Fulfillment Speed',
      TopStore: Math.max(20, 100 - (topPerformer.fulfillmentTimeMin - 8) * 6),
      FleetAvg: Math.max(20, 100 - (Number(avgFulfillmentTime) - 8) * 6),
      LowStore: Math.max(20, 100 - (lowestPerformer.fulfillmentTimeMin - 8) * 6),
    },
    {
      metric: 'CSAT Rating',
      TopStore: Math.round((topPerformer.customerRating / 5) * 100),
      FleetAvg: Math.round((outlets.reduce((s, o) => s + o.customerRating, 0) / (outlets.length || 1) / 5) * 100),
      LowStore: Math.round((lowestPerformer.customerRating / 5) * 100),
    },
    {
      metric: 'Growth Velocity',
      TopStore: Math.min(100, Math.max(10, 50 + topPerformer.revenueGrowth * 2)),
      FleetAvg: 65,
      LowStore: Math.min(100, Math.max(10, 50 + lowestPerformer.revenueGrowth * 2)),
    },
  ];

  // Scatter quad data: Quality Audit Score (X) vs AI Health Score (Y)
  const scatterQuadData = outlets.map((o) => ({
    name: o.name,
    code: o.code,
    auditScore: o.auditScore,
    healthScore: o.healthScore,
    monthlyRevenue: o.monthlyRevenue,
    isUnderperforming: o.isUnderperforming,
    fullOutlet: o,
  }));

  // Regional breakdown
  const regionsList = ['North', 'South', 'West', 'East'] as const;
  const regionalSummary = regionsList.map((r) => {
    const regionOutlets = outlets.filter((o) => o.region === r);
    const count = regionOutlets.length;
    const revenue = regionOutlets.reduce((sum, o) => sum + o.monthlyRevenue, 0);
    const avgHealth = count > 0 ? Math.round(regionOutlets.reduce((sum, o) => sum + o.healthScore, 0) / count) : 0;
    return {
      region: r,
      count,
      revenue,
      avgHealth,
      outlets: regionOutlets,
    };
  });

  return (
    <div id="outlets-fleet-dashboard" className="space-y-6 pb-12">
      {/* 1. FLEET PERFORMANCE CHARTS (REVENUE COMPARISON & CHANNEL DISTRIBUTION) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multi-Store Revenue Comparison Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900">
                  Store Revenue vs Monthly Target Benchmark
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any bar or store below to open single-store performance drilldown.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-indigo-600" />
                Actual (₹k)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-300" />
                Target (₹k)
              </span>
            </div>
          </div>

          <div className="h-[270px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueComparisonData}
                margin={{ top: 10, right: 10, left: -15, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickFormatter={(val) => `₹${val}k`}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800 text-xs space-y-1">
                          <p className="font-bold text-sm text-emerald-400">{data.fullOutlet.name}</p>
                          <p className="text-slate-300">Actual Revenue: <strong className="text-white">₹{data.fullOutlet.monthlyRevenue.toLocaleString()}</strong></p>
                          <p className="text-slate-300">Monthly Target: <strong className="text-white">₹{data.fullOutlet.monthlyTarget.toLocaleString()}</strong></p>
                          <p className="text-slate-300">Health Score: <strong className={data.isUnderperforming ? 'text-rose-400' : 'text-emerald-400'}>{data.healthScore} / 100</strong></p>
                          <p className="text-[10px] text-indigo-300 font-semibold pt-1 border-t border-slate-800">
                            💡 Click bar to view detailed store page
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="actualRevenue"
                  name="Actual Revenue"
                  radius={[6, 6, 0, 0]}
                  onClick={(data) => onSelectOutletAndNavigate(data.fullOutlet)}
                  className="cursor-pointer"
                >
                  {revenueComparisonData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isUnderperforming ? '#f43f5e' : '#4f46e5'}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="targetRevenue"
                  name="Target Benchmark"
                  fill="#cbd5e1"
                  radius={[6, 6, 0, 0]}
                  onClick={(data) => onSelectOutletAndNavigate(data.fullOutlet)}
                  className="cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Sales Channel Mix Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Fleet Channel Mix</h3>
                <p className="text-xs text-slate-500">Average revenue share per channel</p>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                Network
              </span>
            </div>

            <div className="h-[180px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fleetChannelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {fleetChannelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val}%`, 'Fleet Contribution']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
            {fleetChannelData.map((cd, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cd.color }} />
                  <span className="text-slate-600 font-medium">{cd.name}</span>
                </div>
                <strong className="text-slate-900">{cd.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ADVANCED ANALYTICAL GRAPHS: HOURLY PEAK LOAD & HEALTH/AUDIT QUADRANT MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAPH 1: Hourly Peak Load & Ticket Fulfillment Speed Curve */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-black text-slate-900">
                  Peak Traffic & Kitchen Speed
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Hourly order surges vs avg fulfillment minutes
              </p>
            </div>
            <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] font-mono font-bold rounded">
              Rush Hour
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyTrafficTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `${v}m`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg">
                          <p className="font-bold text-amber-400">{d.hour} Window</p>
                          <p className="text-slate-300">Orders: <strong className="text-white">{d.orders}</strong></p>
                          <p className="text-slate-300">Avg Kitchen Time: <strong className="text-white">{d.speedMin} mins</strong></p>
                          <p className="text-slate-300">Kitchen Load: <strong className="text-white">{d.capacityPct}%</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area yAxisId="left" type="monotone" dataKey="orders" name="Order Volume" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#orderGrad)" />
                <Line yAxisId="right" type="monotone" dataKey="speedMin" name="Prep Time (mins)" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Orders</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Prep Time (Min)</span>
            <span className="font-bold text-slate-700">Peak: 19:00 (345 orders)</span>
          </div>
        </div>

        {/* GRAPH 2: Store Operational Multi-Factor Performance Ribbon / Area Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Fleet Multi-Factor Ribbon
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Benchmark curve comparing Leader vs Fleet Average vs At-Risk
              </p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold rounded">
              Ribbon Area
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fleetRadarData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="ribbonTop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="ribbonAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="ribbonLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="metric" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0]?.payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg">
                          <p className="font-bold text-amber-400">{d?.metric}</p>
                          <p className="text-emerald-300 flex items-center justify-between gap-3">
                            <span>🏆 Top Store ({topPerformer.code}):</span>
                            <strong>{d?.TopStore}/100</strong>
                          </p>
                          <p className="text-indigo-300 flex items-center justify-between gap-3">
                            <span>📊 Fleet Average:</span>
                            <strong>{d?.FleetAvg}/100</strong>
                          </p>
                          <p className="text-rose-300 flex items-center justify-between gap-3">
                            <span>⚠️ At-Risk ({lowestPerformer.code}):</span>
                            <strong>{d?.LowStore}/100</strong>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="TopStore" name="Leader Store" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#ribbonTop)" />
                <Area type="monotone" dataKey="FleetAvg" name="Fleet Average" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#ribbonAvg)" />
                <Area type="monotone" dataKey="LowStore" name="At-Risk Store" stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" fillOpacity={1} fill="url(#ribbonLow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Leader ({topPerformer.code})</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Fleet Avg</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> At Risk ({lowestPerformer.code})</span>
          </div>
        </div>

        {/* GRAPH 3: Store Quality Audit vs Health Score Scatter Quadrant */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Audit Score vs Health Quadrant
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Correlation between hygiene audits & overall health
              </p>
            </div>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[10px] font-mono font-bold rounded">
              Matrix
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="auditScore"
                  name="Audit Score"
                  domain={[60, 100]}
                  unit="%"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />
                <YAxis
                  type="number"
                  dataKey="healthScore"
                  name="Health Score"
                  domain={[50, 100]}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg">
                          <p className="font-bold text-indigo-300">{d.name} ({d.code})</p>
                          <p className="text-slate-300">Audit Score: <strong className="text-white">{d.auditScore}%</strong></p>
                          <p className="text-slate-300">Health Index: <strong className={d.isUnderperforming ? 'text-rose-400' : 'text-emerald-400'}>{d.healthScore}/100</strong></p>
                          <p className="text-slate-300">Monthly Rev: <strong className="text-white">₹{(d.monthlyRevenue/1000).toFixed(1)}k</strong></p>
                          <p className="text-[10px] text-emerald-400 pt-1 border-t border-slate-800 font-semibold">Click to drilldown</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter
                  name="Outlets"
                  data={scatterQuadData}
                  onClick={(pt) => pt?.fullOutlet && onSelectOutletAndNavigate(pt.fullOutlet)}
                  className="cursor-pointer"
                >
                  {scatterQuadData.map((entry, index) => (
                    <Cell
                      key={`scatter-cell-${index}`}
                      fill={entry.isUnderperforming ? '#f43f5e' : entry.healthScore >= 85 ? '#10b981' : '#f59e0b'}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Optimal (85+)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Underperforming</span>
          </div>
        </div>

      </div>

      {/* 3. REGIONAL HUBS PERFORMANCE SUMMARY */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>Regional Hub Clusters</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Regional operational volume and average store health benchmarks
            </p>
          </div>

          <span className="text-xs font-bold text-slate-400">
            {regionalSummary.reduce((sum, r) => sum + r.count, 0)} Total Outlets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {regionalSummary.map((reg) => {
            const isSelected = regionFilter === reg.region;
            return (
              <button
                key={reg.region}
                onClick={() => setRegionFilter(regionFilter === reg.region ? 'All' : reg.region)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-indigo-500/30'
                    : 'bg-slate-50 hover:bg-slate-100/80 text-slate-900 border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-black uppercase px-2 py-0.5 rounded ${
                    isSelected ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {reg.region} Region
                  </span>
                  <span className={`text-xs font-extrabold ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {reg.count} Stores
                  </span>
                </div>

                <p className={`text-lg font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  ₹{(reg.revenue / 1000).toFixed(1)}k <span className="text-xs font-normal opacity-70">/mo</span>
                </p>

                <div className="mt-3 pt-2 border-t border-slate-200/20 flex items-center justify-between text-xs">
                  <span className={isSelected ? 'text-slate-400' : 'text-slate-500'}>Avg Health:</span>
                  <span className={`font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-800'}`}>
                    {reg.avgHealth} / 100
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

