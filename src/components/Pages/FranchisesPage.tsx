import React, { useState, useMemo } from 'react';
import { FranchiseGroup, Outlet } from '../../types';
import { FranchisesDashboard } from '../Franchises/FranchisesDashboard';
import {
  Building2,
  Store,
  TrendingUp,
  Award,
  Users,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  DollarSign,
  PieChart as PieIcon,
  ShieldCheck,
  Zap,
  Target,
  BarChart3,
  Flame,
  LayoutDashboard
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
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';

interface FranchisesPageProps {
  franchises: FranchiseGroup[];
  outlets: Outlet[];
  onSelectOutletTab: () => void;
  onSelectOutlet?: (outlet: Outlet) => void;
}

export const FranchisesPage: React.FC<FranchisesPageProps> = ({
  franchises,
  outlets,
  onSelectOutletTab,
  onSelectOutlet,
}) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'directory'>('dashboard');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrandForModal, setSelectedBrandForModal] = useState<FranchiseGroup | null>(null);

  // Franchise categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(franchises.map((f) => f.category)));
    return ['All', ...cats];
  }, [franchises]);

  // Aggregate Metrics & KPI Calculations with Benchmarks & Actionable Insights
  const totalBrands = franchises.length;
  const totalOutlets = outlets.length;
  const consolidatedMonthlyRevenue = outlets.reduce((sum, o) => sum + o.monthlyRevenue, 0);
  const consolidatedMonthlyTarget = outlets.reduce((sum, o) => sum + o.monthlyTarget, 0);
  const revenuePacingPct = Math.round((consolidatedMonthlyRevenue / (consolidatedMonthlyTarget || 1)) * 100);

  const avgFleetHealth = Math.round(
    outlets.reduce((sum, o) => sum + o.healthScore, 0) / (outlets.length || 1)
  );
  const targetHealthBenchmark = 85;

  const avgAuditScore = Math.round(
    outlets.reduce((sum, o) => sum + o.auditScore, 0) / (outlets.length || 1)
  );

  const totalUnderperforming = outlets.filter((o) => o.isUnderperforming).length;
  const underperformingRate = Math.round((totalUnderperforming / (outlets.length || 1)) * 100);

  // Brand Performance Calculations
  const brandStats = useMemo(() => {
    return franchises.map((f) => {
      const brandOutlets = outlets.filter((o) => o.franchiseId === f.id);
      const rev = brandOutlets.reduce((s, o) => s + o.monthlyRevenue, 0);
      const target = brandOutlets.reduce((s, o) => s + o.monthlyTarget, 0);
      const pacing = Math.round((rev / (target || 1)) * 100);
      const health = Math.round(
        brandOutlets.reduce((s, o) => s + o.healthScore, 0) / (brandOutlets.length || 1)
      );
      const audit = Math.round(
        brandOutlets.reduce((s, o) => s + o.auditScore, 0) / (brandOutlets.length || 1)
      );
      const atRiskCount = brandOutlets.filter((o) => o.isUnderperforming).length;

      return {
        ...f,
        outletsCount: brandOutlets.length,
        brandRevenue: rev,
        brandTarget: target,
        pacingPct: pacing,
        avgHealth: health,
        avgAudit: audit,
        atRiskCount,
        outlets: brandOutlets,
      };
    });
  }, [franchises, outlets]);

  // Filtered Brands
  const filteredBrands = useMemo(() => {
    return brandStats.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || b.category === categoryFilter;
      const matchesBrandId = selectedBrandId === 'all' || b.id === selectedBrandId;
      return matchesSearch && matchesCategory && matchesBrandId;
    });
  }, [brandStats, searchQuery, categoryFilter, selectedBrandId]);

  // Chart 1: Brand Revenue vs Target Pacing
  const brandRevenuePacingData = brandStats.map((b) => ({
    name: b.name.split(' ')[0],
    fullName: b.name,
    actualRev: Math.round(b.brandRevenue / 100000), // in Lakhs
    targetRev: Math.round(b.brandTarget / 100000),
    pacingPct: b.pacingPct,
  }));

  // Chart 2: Category Market Share Pie Data
  const categoryShareData = useMemo(() => {
    const catMap: { [cat: string]: number } = {};
    brandStats.forEach((b) => {
      catMap[b.category] = (catMap[b.category] || 0) + b.brandRevenue;
    });
    return Object.keys(catMap).map((cat) => ({
      name: cat,
      value: catMap[cat],
    }));
  }, [brandStats]);

  const PIE_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6'];

  // Chart 3: Brand Health vs Quality Audit Benchmark Curve (Area Ribbon)
  const brandQualityRibbonData = brandStats.map((b) => ({
    name: b.brand,
    fullName: b.name,
    healthScore: b.avgHealth,
    auditScore: b.avgAudit,
    benchmark: 85,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* FRANCHISES MODULE VIEW SWITCHER BAR */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => {
              setViewMode('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === 'dashboard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Franchises Dashboard</span>
          </button>

          <button
            onClick={() => {
              setViewMode('directory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === 'directory'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>Brand Directory & Profiles</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={onSelectOutletTab}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Store className="w-3.5 h-3.5" />
            <span>View {totalOutlets} Outlets</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {viewMode === 'dashboard' ? (
        <FranchisesDashboard
          franchises={franchises}
          outlets={outlets}
          onSelectBrand={(brand) => {
            const found = brandStats.find((b) => b.id === brand.id);
            if (found) setSelectedBrandForModal(found as any);
          }}
        />
      ) : (
        <>
      {/* 1. MASTER HEADER & PORTFOLIO ACTION BAR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Franchise Portfolio Intelligence
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              {totalBrands} Master Brands • {totalOutlets} Outlets
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
            Master Franchise Brand Executive Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise portfolio analytics with measurable benchmarks, store distribution matrix, and corrective action workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSelectOutletTab}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-xs transition-all hover:shadow-md shrink-0 cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span>View All {totalOutlets} Outlets</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. STRUCTURED KPI CARDS (Clear Business Meaning + Benchmark Target + Action Status) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Consolidated Revenue Run-rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
              revenuePacingPct >= 90 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
            }`}>
              {revenuePacingPct}% Target Pace
            </span>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                ₹{(consolidatedMonthlyRevenue / 10000000).toFixed(2)} Cr
              </h3>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Consolidated Monthly Revenue</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Target: ₹{(consolidatedMonthlyTarget / 10000000).toFixed(2)} Cr</span>
            <span className="font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% YoY
            </span>
          </div>
        </div>

        {/* KPI 2: Network Health Index */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-700">
              <Award className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-full text-[11px] font-black">
              Benchmark: {targetHealthBenchmark} pts
            </span>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {avgFleetHealth} <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </h3>
              <span className={`text-xs font-bold ${avgFleetHealth >= targetHealthBenchmark ? 'text-emerald-600' : 'text-amber-600'}`}>
                {avgFleetHealth >= targetHealthBenchmark ? 'Above Standard' : 'Requires Tuning'}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Average Brand Health Index</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Weighted across 6 pillars</span>
            <span className="font-bold text-indigo-600">Audit Avg: {avgAuditScore}%</span>
          </div>
        </div>

        {/* KPI 3: Store Network Footprint & Density */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-700">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full text-[11px] font-black">
              {totalBrands} Major Brands
            </span>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {totalOutlets} <span className="text-sm font-semibold text-slate-400">Stores</span>
              </h3>
              <span className="text-xs font-bold text-blue-600">+4 Pipeline</span>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Active Franchise Footprint</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Across 6 Metro Hubs</span>
            <span className="font-bold text-slate-700">Avg {totalBrands > 0 ? Math.round(totalOutlets / totalBrands) : 0} units/brand</span>
          </div>
        </div>

        {/* KPI 4: Underperforming & At-Risk Units */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
              totalUnderperforming > 0 ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'
            }`}>
              {underperformingRate}% of Fleet
            </span>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-rose-600 tracking-tight">
                {totalUnderperforming} <span className="text-sm font-semibold text-slate-400">Stores</span>
              </h3>
              <span className="text-xs font-bold text-rose-600">Action Required</span>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-0.5">At-Risk / Sub-Par Units</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Target Threshold: &lt;5%</span>
            <span className="font-bold text-rose-600">Recovery Playbooks Ready</span>
          </div>
        </div>

      </div>

      {/* 3. VISUAL ANALYTICAL DASHBOARD CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Brand Revenue vs Monthly Target Comparison */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Brand Revenue vs Target Pacing (₹ Lakhs)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Benchmark actual monthly run-rate against franchise business targets
              </p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold rounded">
              Monthly Pacing
            </span>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandRevenuePacingData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1.5 shadow-xl">
                          <p className="font-black text-emerald-400">{d.fullName}</p>
                          <p className="text-slate-300">Actual Revenue: <strong className="text-white">₹{d.actualRev} Lakhs</strong></p>
                          <p className="text-slate-300">Target Quota: <strong className="text-white">₹{d.targetRev} Lakhs</strong></p>
                          <p className="text-slate-300">Target Achievement: <strong className={d.pacingPct >= 90 ? 'text-emerald-400' : 'text-amber-400'}>{d.pacingPct}%</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="actualRev" name="Actual Revenue (₹ Lakhs)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="targetRev" name="Target Quota (₹ Lakhs)" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Actual Rev</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Target Quota</span>
            <span className="font-bold text-slate-700">Network Goal: 100% Target Run-Rate</span>
          </div>
        </div>

        {/* Chart 2: Category Revenue Share Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Category Portfolio Share
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Revenue contribution by vertical
              </p>
            </div>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[10px] font-mono font-bold rounded">
              Share
            </span>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryShareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryShareData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`₹${(val / 100000).toFixed(1)} Lakhs`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Dominant: Fast Food / QSR</span>
            <span className="font-bold text-indigo-600">{categoryShareData.length} Verticals</span>
          </div>
        </div>

      </div>

      {/* 4. BRAND PERFORMANCE RIBBON AREA CHART (Leader vs Benchmark) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900">
                Franchise Health & Quality Audit Ribbon
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Multi-brand comparison of operational health and audit compliance against standard benchmark (85 pts)
            </p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold rounded-full">
            Area Ribbon
          </span>
        </div>

        <div className="h-[210px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={brandQualityRibbonData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="brandHealthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="brandAuditGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
              <YAxis domain={[50, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `${v}`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1.5 shadow-xl">
                        <p className="font-bold text-amber-400">{d.fullName}</p>
                        <p className="text-emerald-300">Health Index: <strong>{d.healthScore}/100</strong></p>
                        <p className="text-indigo-300">Audit Score: <strong>{d.auditScore}%</strong></p>
                        <p className="text-slate-400">Benchmark Target: <strong>{d.benchmark} pts</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="healthScore" name="Health Score" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#brandHealthGrad)" />
              <Area type="monotone" dataKey="auditScore" name="Audit Score" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#brandAuditGrad)" />
              <Line type="monotone" dataKey="benchmark" name="Benchmark (85)" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Brand Health Index</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Audit Compliance</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-rose-500" /> Target Standard (85)</span>
        </div>
      </div>

      {/* 5. INTERACTIVE FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search brand, category, or stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          <span className="text-[11px] font-bold text-slate-500 shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 6. FRANCHISE BRAND CARDS GRID WITH STORE DRILLDOWN & AUDIT ACTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBrands.map((b) => (
          <div
            key={b.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-black text-xl flex items-center justify-center shadow-xs">
                  {b.brand.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{b.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{b.category}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold text-xs">
                  +{b.growthRate}% YoY
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Brand Velocity</p>
              </div>
            </div>

            {/* Structured KPI Stats Bar */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Stores</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{b.outletsCount}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Rev</span>
                <p className="text-sm font-extrabold text-emerald-700 mt-0.5">₹{(b.brandRevenue / 100000).toFixed(1)}L</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Health Index</span>
                <p className="text-sm font-extrabold text-indigo-700 mt-0.5">{b.avgHealth}/100</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Audit Score</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{b.avgAudit}%</p>
              </div>
            </div>

            {/* Drilldown Stores List */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-slate-400" />
                  Store Outlets ({b.outlets.length})
                </h4>
                {b.atRiskCount > 0 && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    {b.atRiskCount} At Risk
                  </span>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {b.outlets.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      if (onSelectOutlet) {
                        onSelectOutlet(o);
                      } else {
                        onSelectOutletTab();
                      }
                    }}
                    className="py-2.5 px-2 flex items-center justify-between text-xs hover:bg-slate-50 rounded-xl transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {o.name}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <span className="text-slate-400 text-[11px]">{o.city}, {o.state} • Code: {o.code}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-800">₹{(o.monthlyRevenue / 1000).toFixed(0)}k</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        o.isUnderperforming ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {o.healthScore} Health
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedBrandForModal(b)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Brand Governance Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onSelectOutletTab}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Drilldown Analytics</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>
      </>
      )}

      {/* MODAL: BRAND GOVERNANCE PROFILE */}
      {selectedBrandForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center">
                  {selectedBrandForModal.brand.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedBrandForModal.name}</h3>
                  <p className="text-xs text-slate-500">{selectedBrandForModal.category} Brand Profile</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBrandForModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Brand Governance Status</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Total Outlets</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedBrandForModal.outlets.length} Units</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Average Health</span>
                  <p className="font-bold text-indigo-600 text-sm mt-0.5">{selectedBrandForModal.avgHealth} / 100</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Audit Compliance</span>
                  <p className="font-bold text-emerald-600 text-sm mt-0.5">{selectedBrandForModal.avgAudit}%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">YoY Velocity</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">+{selectedBrandForModal.growthRate}%</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Franchise Operating Agreement Valid</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  All compliance checklists, royalty collection reconciliations, and master franchise standards are currently active.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedBrandForModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedBrandForModal(null);
                  onSelectOutletTab();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2"
              >
                <span>Manage Outlets</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
