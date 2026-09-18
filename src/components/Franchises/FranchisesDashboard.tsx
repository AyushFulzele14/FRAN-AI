import React, { useState } from 'react';
import { FranchiseGroup, Outlet } from '../../types';
import {
  Building2,
  TrendingUp,
  Store,
  DollarSign,
  Award,
  ShieldCheck,
  Target,
  Sparkles,
  PieChart as PieIcon,
  Compass,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Filter,
  BarChart3,
  Layers,
  Activity,
  X,
  ExternalLink,
  Users,
  Utensils
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
  LineChart,
  Line,
} from 'recharts';

interface FranchisesDashboardProps {
  franchises: FranchiseGroup[];
  outlets: Outlet[];
  onSelectBrand?: (brand: FranchiseGroup) => void;
}

export const FranchisesDashboard: React.FC<FranchisesDashboardProps> = ({
  franchises,
  outlets,
  onSelectBrand,
}) => {
  // Interactive States
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [activeBrandMetric, setActiveBrandMetric] = useState<'revenue' | 'pacing' | 'health' | 'audit'>('revenue');
  const [lineChartBrandFilter, setLineChartBrandFilter] = useState<'all' | 'mcdonalds' | 'dominos' | 'kfc'>('all');

  // Brand metrics breakdown
  const brandPerformanceData = franchises.map((f) => {
    const brandOutlets = outlets.filter((o) => o.franchiseId === f.id);
    const actualRev = brandOutlets.reduce((s, o) => s + o.monthlyRevenue, 0);
    const targetRev = brandOutlets.reduce((s, o) => s + o.monthlyTarget, 0);
    const avgHealth = Math.round(
      brandOutlets.reduce((s, o) => s + o.healthScore, 0) / (brandOutlets.length || 1)
    );
    const avgAudit = Math.round(
      brandOutlets.reduce((s, o) => s + o.auditScore, 0) / (brandOutlets.length || 1)
    );
    const totalOrders = brandOutlets.reduce((s, o) => s + o.todayOrders, 0);
    const pacingPct = Math.round((actualRev / (targetRev || 1)) * 100);

    return {
      id: f.id,
      name: f.name,
      shortName: f.name.split(' ')[0],
      actualRevK: Math.round(actualRev / 1000),
      targetRevK: Math.round(targetRev / 1000),
      pacingPct,
      avgHealth,
      avgAudit,
      storeCount: brandOutlets.length,
      royaltyPct: f.royaltyFeePercentage,
      totalOrders,
      category: f.category,
      brand: f,
      outlets: brandOutlets,
      // For dynamic metric rendering
      metricVal: activeBrandMetric === 'revenue'
        ? Math.round(actualRev / 1000)
        : activeBrandMetric === 'pacing'
        ? pacingPct
        : activeBrandMetric === 'health'
        ? avgHealth
        : avgAudit,
    };
  });

  // Selected Brand Object
  const activeBrandData = selectedBrandId
    ? brandPerformanceData.find((b) => b.id === selectedBrandId)
    : null;

  // Category Distribution for Pie Chart
  const categoryMix = [
    { name: 'Pizza & Italian', value: 45, color: '#10b981', storeCount: 8, leadBrand: "Domino's Pizza", topItem: 'Peppy Paneer Burst' },
    { name: 'Burgers & Fast Food', value: 35, color: '#6366f1', storeCount: 6, leadBrand: "McDonald's India", topItem: 'McSpicy Chicken Meal' },
    { name: 'Fried Chicken & QSR', value: 20, color: '#f59e0b', storeCount: 4, leadBrand: 'KFC Restaurants', topItem: 'Hot & Crispy Bucket' },
  ];

  const activeCategoryData = selectedCategory
    ? categoryMix.find((c) => c.name === selectedCategory)
    : null;

  // Brand Growth Rate Trend Data
  const monthlyBrandTrends = [
    { month: 'Mar', dominos: 320, mcdonalds: 410, kfc: 280, topPerformer: "McDonald's", growthRate: '+6.2%' },
    { month: 'Apr', dominos: 345, mcdonalds: 430, kfc: 295, topPerformer: "Domino's", growthRate: '+7.8%' },
    { month: 'May', dominos: 380, mcdonalds: 460, kfc: 310, topPerformer: "McDonald's", growthRate: '+8.4%' },
    { month: 'Jun', dominos: 395, mcdonalds: 490, kfc: 325, topPerformer: "KFC", growthRate: '+5.9%' },
    { month: 'Jul', dominos: 420, mcdonalds: 520, kfc: 340, topPerformer: "Domino's", growthRate: '+9.1%' },
    { month: 'Aug', dominos: 450, mcdonalds: 550, kfc: 360, topPerformer: "McDonald's", growthRate: '+11.4%' },
  ];

  const activeMonthData = selectedMonth
    ? monthlyBrandTrends.find((m) => m.month === selectedMonth)
    : null;

  return (
    <div id="franchises-dashboard" className="space-y-6 pb-6 animate-in fade-in duration-300">
      
      {/* ACTIVE SELECTION BANNER (IF FILTERED) */}
      {(selectedBrandId || selectedCategory || selectedMonth) && (
        <div className="bg-indigo-900 text-white p-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3 border border-indigo-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-800 rounded-xl">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">Active Chart Filter</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-white">
                {selectedBrandId && `Brand: ${activeBrandData?.name}`}
                {selectedCategory && `Segment: ${selectedCategory}`}
                {selectedMonth && `Month: ${selectedMonth} 2026 Analysis`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedBrandId(null);
              setSelectedCategory(null);
              setSelectedMonth(null);
            }}
            className="px-3 py-1.5 bg-indigo-800/80 hover:bg-indigo-700 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-indigo-600 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}

      {/* 1. BRAND REVENUE VS TARGET BENCHMARK & CATEGORY DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Brand Actual Revenue vs Target Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Brand Revenue & Target Benchmark (Interactive)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any bar or brand below to inspect outlets, run-rate pacing, and health scores
              </p>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setActiveBrandMetric('revenue')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeBrandMetric === 'revenue' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Revenue (₹k)
              </button>
              <button
                onClick={() => setActiveBrandMetric('pacing')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeBrandMetric === 'pacing' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pacing %
              </button>
              <button
                onClick={() => setActiveBrandMetric('health')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeBrandMetric === 'health' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Health
              </button>
              <button
                onClick={() => setActiveBrandMetric('audit')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeBrandMetric === 'audit' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Audit QA
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={brandPerformanceData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    const brandObj = e.activePayload[0].payload;
                    setSelectedBrandId(selectedBrandId === brandObj.id ? null : brandObj.id);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="shortName" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    activeBrandMetric === 'revenue'
                      ? `₹${val}k`
                      : activeBrandMetric === 'pacing'
                      ? `${val}% Target Achieved`
                      : `${val} / 100 Score`,
                    name === 'metricVal'
                      ? activeBrandMetric === 'revenue'
                        ? 'Actual Run-Rate'
                        : activeBrandMetric.toUpperCase()
                      : 'Target Benchmark',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="metricVal"
                  radius={[6, 6, 0, 0]}
                  cursor="pointer"
                >
                  {brandPerformanceData.map((entry) => (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={
                        selectedBrandId === entry.id
                          ? '#10b981'
                          : selectedBrandId
                          ? '#94a3b8'
                          : '#6366f1'
                      }
                    />
                  ))}
                </Bar>
                {activeBrandMetric === 'revenue' && (
                  <Bar dataKey="targetRevK" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="targetRevK" cursor="pointer" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Clickable Brand Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-center">
            {brandPerformanceData.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBrandId(selectedBrandId === b.id ? null : b.id)}
                className={`p-3 rounded-2xl transition-all text-left cursor-pointer border ${
                  selectedBrandId === b.id
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase">{b.shortName}</span>
                  {selectedBrandId === b.id && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </div>
                <p className="text-sm font-black text-slate-900 mt-0.5">₹{b.actualRevK}k <span className="text-xs font-normal text-slate-500">({b.pacingPct}%)</span></p>
                <span className="text-[10px] text-indigo-600 font-bold">{b.storeCount} Outlets • {b.avgHealth}/100 Health</span>
              </button>
            ))}
          </div>

          {/* DYNAMIC BRAND DETAIL DRAWER */}
          {activeBrandData && (
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{activeBrandData.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{activeBrandData.category} • {activeBrandData.royaltyPct}% Royalty</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onSelectBrand && (
                    <button
                      onClick={() => onSelectBrand(activeBrandData.brand)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Brand Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedBrandId(null)}
                    className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Outlet List for Selected Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {activeBrandData.outlets.map((outlet) => (
                  <div key={outlet.id} className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{outlet.name}</p>
                      <span className="text-[10px] text-slate-400">{outlet.region} • Mgr: {outlet.manager}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-emerald-400">₹{(outlet.monthlyRevenue / 1000).toFixed(1)}k</p>
                      <span className="text-[10px] text-slate-300">{outlet.healthScore}/100 Health</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Brand Segment Share - Interactive Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-emerald-600" />
                <span>Segment Mix (Click Slices)</span>
              </h3>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-[11px] font-bold text-emerald-600 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click slice to view lead brand, store count & top SKU
            </p>
          </div>

          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  cursor="pointer"
                  onClick={(entry) => {
                    setSelectedCategory(selectedCategory === entry.name ? null : entry.name);
                  }}
                >
                  {categoryMix.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={selectedCategory === entry.name ? '#0f172a' : '#ffffff'}
                      strokeWidth={selectedCategory === entry.name ? 3 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}% Portfolio Share`, name]}
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
              <span className="text-2xl font-black text-slate-900">{franchises.length}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Brands</span>
            </div>
          </div>

          {/* Interactive Category Buttons */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {categoryMix.map((item) => (
              <button
                key={item.name}
                onClick={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}
                className={`w-full flex items-center justify-between text-xs p-2 rounded-xl transition-all cursor-pointer ${
                  selectedCategory === item.name
                    ? 'bg-slate-100 ring-1 ring-slate-400 font-bold'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 text-left">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </button>
            ))}
          </div>

          {/* ACTIVE CATEGORY DETAIL HIGHLIGHT */}
          {activeCategoryData && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between font-extrabold text-emerald-900">
                <span>{activeCategoryData.name}</span>
                <span>{activeCategoryData.storeCount} Locations</span>
              </div>
              <div className="text-[11px] text-emerald-800 flex justify-between">
                <span>Lead Brand:</span>
                <strong>{activeCategoryData.leadBrand}</strong>
              </div>
              <div className="text-[11px] text-emerald-800 flex justify-between">
                <span>Top Velocity Item:</span>
                <strong>{activeCategoryData.topItem}</strong>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 2. BRAND HEALTH, AUDIT QUADRANT & MULTI-MONTH REVENUE TRAJECTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Brand Multi-Month Trajectory - Interactive Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>6-Month Revenue Trajectory by Franchise (₹k)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click lines or month markers to inspect month-over-month growth pacing
              </p>
            </div>

            {/* Line Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setLineChartBrandFilter('all')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  lineChartBrandFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All Brands
              </button>
              <button
                onClick={() => setLineChartBrandFilter('mcdonalds')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  lineChartBrandFilter === 'mcdonalds' ? 'bg-amber-100 text-amber-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                McDonald's
              </button>
              <button
                onClick={() => setLineChartBrandFilter('dominos')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  lineChartBrandFilter === 'dominos' ? 'bg-indigo-100 text-indigo-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Domino's
              </button>
              <button
                onClick={() => setLineChartBrandFilter('kfc')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  lineChartBrandFilter === 'kfc' ? 'bg-rose-100 text-rose-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                KFC
              </button>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyBrandTrends}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    const monthObj = e.activePayload[0].payload;
                    setSelectedMonth(selectedMonth === monthObj.month ? null : monthObj.month);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    `₹${val}k`,
                    name === 'mcdonalds' ? "McDonald's" : name === 'dominos' ? "Domino's" : 'KFC',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                {(lineChartBrandFilter === 'all' || lineChartBrandFilter === 'mcdonalds') && (
                  <Line type="monotone" dataKey="mcdonalds" stroke="#f59e0b" strokeWidth={lineChartBrandFilter === 'mcdonalds' ? 3.5 : 2.5} dot={{ r: 4 }} name="McDonald's" />
                )}
                {(lineChartBrandFilter === 'all' || lineChartBrandFilter === 'dominos') && (
                  <Line type="monotone" dataKey="dominos" stroke="#6366f1" strokeWidth={lineChartBrandFilter === 'dominos' ? 3.5 : 2.5} dot={{ r: 4 }} name="Domino's" />
                )}
                {(lineChartBrandFilter === 'all' || lineChartBrandFilter === 'kfc') && (
                  <Line type="monotone" dataKey="kfc" stroke="#ef4444" strokeWidth={lineChartBrandFilter === 'kfc' ? 3.5 : 2.5} dot={{ r: 4 }} name="KFC" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ACTIVE MONTH DIAGNOSTIC STRIP */}
          {activeMonthData ? (
            <div className="p-3 bg-slate-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded">
                  {activeMonthData.month} 2026 Focus
                </span>
                <span className="text-slate-300">MoM Growth: <strong className="text-emerald-400">{activeMonthData.growthRate}</strong></span>
              </div>
              <div className="flex items-center gap-4">
                <span>Top Brand: <strong className="text-amber-400">{activeMonthData.topPerformer}</strong></span>
                <span>MCD: <strong>₹{activeMonthData.mcdonalds}k</strong></span>
                <span>DOM: <strong>₹{activeMonthData.dominos}k</strong></span>
                <span>KFC: <strong>₹{activeMonthData.kfc}k</strong></span>
              </div>
              <button
                onClick={() => setSelectedMonth(null)}
                className="text-slate-400 hover:text-white text-[11px] font-bold"
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Tip: Click on any month node in the trajectory to drill down into monthly revenue shares.</span>
              <span className="font-bold text-emerald-600">Peak Month: August 2026 (+11.4%)</span>
            </div>
          )}
        </div>

        {/* Brand Royalty & Compliance Benchmark Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Royalty & Governance Index</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Click brand to inspect franchise parameters</p>
          </div>

          <div className="space-y-3">
            {brandPerformanceData.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBrandId(selectedBrandId === b.id ? null : b.id)}
                className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                  selectedBrandId === b.id
                    ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/70 border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">{b.name}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    {b.royaltyPct}% Royalty
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Health Index</span>
                    <strong className="text-slate-800">{b.avgHealth}/100</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Audit Quality</span>
                    <strong className="text-indigo-600">{b.avgAudit}%</strong>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
