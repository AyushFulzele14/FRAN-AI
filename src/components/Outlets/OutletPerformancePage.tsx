import React, { useState, useMemo } from 'react';
import {
  Outlet,
  AIHealthAnalysis,
} from '../../types';
import {
  Store,
  TrendingUp,
  DollarSign,
  Clock,
  Award,
  AlertTriangle,
  Sparkles,
  MapPin,
  ChevronDown,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Building,
  RefreshCw,
  BarChart3,
  Users,
  Percent,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowLeft,
  LayoutDashboard,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from 'recharts';

import { OutletDashboard } from './OutletDashboard';
import { OutletMap } from './OutletMap';
import { OutletCompareModal } from './OutletCompareModal';
import { OutletRecoveryModal } from './OutletRecoveryModal';

interface OutletPerformancePageProps {
  outlets: Outlet[];
  selectedOutlet: Outlet | null;
  setSelectedOutlet: (outlet: Outlet | null) => void;
  isLiveSimulating: boolean;
}

export const OutletPerformancePage: React.FC<OutletPerformancePageProps> = ({
  outlets,
  selectedOutlet,
  setSelectedOutlet,
  isLiveSimulating,
}) => {
  // Navigation View Mode: Defaults to the newly built Outlets Dashboard
  const [viewMode, setViewMode] = useState<'dashboard' | 'performance'>('dashboard');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Underperforming' | 'Optimal'>('All');
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | 'YTD'>('7D');

  // Modals
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [recoveryModalOutlet, setRecoveryModalOutlet] = useState<Outlet | null>(null);

  // AI Health Score Report State
  const [aiHealthReport, setAiHealthReport] = useState<AIHealthAnalysis | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false);

  // Filter logic
  const filteredOutlets = outlets.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'All' || o.region === regionFilter;
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Underperforming'
        ? o.isUnderperforming
        : !o.isUnderperforming;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  // Current Active Outlet
  const currentOutlet = selectedOutlet || filteredOutlets[0] || outlets[0];

  const underperformingList = outlets.filter((o) => o.isUnderperforming);

  // Handler for selecting store from Dashboard and switching to Performance view
  const handleSelectFromDashboard = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setAiHealthReport(null);
    setViewMode('performance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate Health Score Breakdown
  const handleGenerateAiHealthReport = async () => {
    if (!currentOutlet) return;
    setIsHealthLoading(true);
    try {
      const res = await fetch('/api/ai/health-score-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outlet: currentOutlet }),
      });
      const data = await res.json();
      setAiHealthReport(data);
    } catch (err) {
      console.error('Error generating AI health report:', err);
    } finally {
      setIsHealthLoading(false);
    }
  };

  // Dynamic Revenue Trend Data based on timeRange
  const trendData = useMemo(() => {
    if (!currentOutlet) return [];
    if (timeRange === '7D') {
      return currentOutlet.weeklyRevenueData || [];
    } else if (timeRange === '30D') {
      const dailyAvgActual = (currentOutlet.monthlyRevenue || 120000) / 30;
      const dailyAvgTarget = (currentOutlet.monthlyTarget || 150000) / 30;
      return Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        const variance = Math.sin(i * 0.8) * 0.15 + (Math.random() * 0.1 - 0.05);
        return {
          date: `Day ${day}`,
          actualRevenue: Math.round(dailyAvgActual * (1 + variance)),
          targetRevenue: Math.round(dailyAvgTarget),
        };
      });
    } else {
      // YTD Monthly view
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.map((m, idx) => ({
        date: m,
        actualRevenue: Math.round(((currentOutlet.monthlyRevenue || 120000) * (0.85 + (idx % 4) * 0.08))),
        targetRevenue: Math.round((currentOutlet.monthlyTarget || 150000)),
      }));
    }
  }, [currentOutlet, timeRange]);

  // Channel Distribution Data for Pie Chart
  const channelData = [
    { name: 'Dine-In', value: currentOutlet?.salesByChannel.dineIn || 35, color: '#10b981' },
    { name: 'Takeaway', value: currentOutlet?.salesByChannel.takeaway || 35, color: '#6366f1' },
    { name: 'Delivery', value: currentOutlet?.salesByChannel.delivery || 20, color: '#14b8a6' },
    { name: 'Drive-Thru', value: currentOutlet?.salesByChannel.driveThru || 10, color: '#f59e0b' },
  ];

  const weekly7DayRevenue = currentOutlet?.weeklyRevenueData
    ? currentOutlet.weeklyRevenueData.reduce((acc, d) => acc + d.actualRevenue, 0)
    : Math.round((currentOutlet?.monthlyRevenue || 0) / 4);

  return (
    <div id="outlet-performance-container" className="space-y-6 pb-12">
      
      {/* OUTLETS MODULE VIEW SWITCHER BAR */}
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
            <span>Outlets Dashboard</span>
          </button>

          <button
            onClick={() => {
              setViewMode('performance');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === 'performance'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Store className="w-4 h-4 text-indigo-400" />
            <span>Store Performance & Drilldown</span>
            {currentOutlet && (
              <span className="hidden md:inline-block px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] rounded-md font-mono">
                {currentOutlet.name.split(' ')[0]}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {viewMode === 'performance' ? (
            <button
              onClick={() => {
                setViewMode('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Outlets Dashboard</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-slate-400 hidden lg:inline-block">
              Click any store card or chart to open single-store drilldown
            </span>
          )}

          <button
            id="compare-locations-btn"
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Building className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compare</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: OUTLETS DASHBOARD */}
      {viewMode === 'dashboard' && (
        <OutletDashboard
          outlets={outlets}
          onSelectOutletAndNavigate={handleSelectFromDashboard}
          onOpenCompareModal={() => setIsCompareModalOpen(true)}
          onOpenRecoveryModal={(st) => setRecoveryModalOutlet(st)}
          isLiveSimulating={isLiveSimulating}
        />
      )}

      {/* VIEW 2: SINGLE STORE PERFORMANCE & DRILLDOWN */}
      {viewMode === 'performance' && (
        <div className="space-y-6">
          {/* Top Page Header */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  Store Analytics
                </span>
                {isLiveSimulating && (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-xs">
                    <Zap className="w-3 h-3 fill-white" /> Live Feed
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Outlet Operations & Performance
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl font-medium">
                Track revenue, analyze store health scores, compare locations, and run real-time diagnostics for {currentOutlet.name}.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setViewMode('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          </div>

          {/* Underperforming Outlets Critical Alert Strip */}
          {underperformingList.length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                      Underperforming Outlets ({underperformingList.length} Stores Need Attention)
                    </h3>
                    <p className="text-xs text-rose-700 mt-0.5 font-medium">
                      Operating below target revenue or experiencing shift delay issues.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  {underperformingList.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setRecoveryModalOutlet(st)}
                      className="px-3 py-1.5 bg-white border border-rose-200 hover:border-rose-400 text-rose-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 shadow-xs cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                      <span>{st.name} ({st.healthScore} Score)</span>
                      <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded ml-1 font-bold">
                        Diagnose
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Filter and Selection Toolbar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search store name, city, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Region & Status Filters */}
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-1.5 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Region:</span>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Regions</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="Central">Central</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-1.5 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Outlets</option>
                  <option value="Optimal">Optimal Score</option>
                  <option value="Underperforming">Underperforming</option>
                </select>
              </div>

              <div className="text-xs text-slate-400 font-bold pl-2 hidden lg:block">
                <strong className="text-slate-800">{filteredOutlets.length}</strong> / {outlets.length} stores
              </div>
            </div>
          </div>

          {/* Outlet Selector Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {filteredOutlets.map((outlet) => {
              const isSelected = currentOutlet.id === outlet.id;
              return (
                <button
                  key={outlet.id}
                  onClick={() => {
                    setSelectedOutlet(outlet);
                    setAiHealthReport(null);
                  }}
                  className={`p-4 rounded-3xl text-left transition-all duration-200 border cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-100 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-indigo-500/30 text-indigo-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {outlet.code}
                    </span>

                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                      outlet.isUnderperforming
                        ? 'bg-rose-50 text-rose-600'
                        : outlet.healthScore >= 85
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      {outlet.healthScore}
                    </span>
                  </div>

                  <h4 className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {outlet.name}
                  </h4>
                  <p className={`text-[10px] truncate ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                    {outlet.city}, {outlet.state}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-200/20 flex items-center justify-between text-[11px]">
                    <span className={isSelected ? 'text-slate-400' : 'text-slate-400'}>Revenue:</span>
                    <span className={`font-black ${isSelected ? 'text-indigo-400' : 'text-slate-800'}`}>
                      ₹{(outlet.monthlyRevenue / 1000).toFixed(1)}k
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ACTIVE STORE DETAILED DASHBOARD SECTION */}
          {currentOutlet && (
            <div className="space-y-6 pt-2">
              
              {/* Active Store Header Banner */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                    {currentOutlet.code.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-800">{currentOutlet.name}</h2>
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                        currentOutlet.isUnderperforming
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {currentOutlet.isUnderperforming ? 'Needs Attention' : 'Optimal'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{currentOutlet.address}, {currentOutlet.city} ({currentOutlet.region})</span>
                      <span>•</span>
                      <span>Manager: <strong className="text-slate-700">{currentOutlet.manager}</strong></span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {currentOutlet.isUnderperforming && (
                    <button
                      onClick={() => setRecoveryModalOutlet(currentOutlet)}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Run Store Diagnostic</span>
                    </button>
                  )}

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${currentOutlet.name} ${currentOutlet.address} ${currentOutlet.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Google Maps</span>
                  </a>
                </div>
              </div>

              {/* REVENUE TRENDS & CHANNEL DISTRIBUTION SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Revenue Trend Area Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Revenue Trend</h3>
                      <p className="text-xs text-slate-400">Daily actual revenue vs benchmark target</p>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
                      <button
                        onClick={() => setTimeRange('7D')}
                        className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                          timeRange === '7D' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                        }`}
                      >
                        7D
                      </button>
                      <button
                        onClick={() => setTimeRange('30D')}
                        className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                          timeRange === '30D' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                        }`}
                      >
                        30D
                      </button>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-[250px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(val) => `₹${val/1000}k`} />
                        <Tooltip
                          formatter={(val: any) => [`₹${val?.toLocaleString()}`, '']}
                          contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#ffffff', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="actualRevenue" name="Actual Revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                        <Area type="monotone" dataKey="targetRevenue" name="Target Benchmark" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sales Channel Mix Pie Chart */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Sales Channels</h3>
                    <p className="text-xs text-slate-400">Revenue contribution per touchpoint</p>

                    <div className="h-[180px] w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={channelData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {channelData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(val: any) => [`${val}%`, 'Share']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3 mt-2">
                    {channelData.map((cd, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cd.color }}></span>
                        <span className="text-slate-500 font-medium">{cd.name}:</span>
                        <strong className="text-slate-800">{cd.value}%</strong>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Primary Sleek KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                
                {/* KPI 1: Today's Sales */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Sales</span>
                    <span className="bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      +{currentOutlet.revenueGrowth}%
                    </span>
                  </div>
                  <p className="text-3xl font-black text-slate-800 mt-2">
                    ₹{currentOutlet.todaySales.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {currentOutlet.todayOrders} total orders today
                  </p>
                </div>

                {/* KPI 2: Weekly Revenue */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Revenue</span>
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      7D Pace
                    </span>
                  </div>
                  <p className="text-3xl font-black text-slate-800 mt-2">
                    ₹{(weekly7DayRevenue / 1000).toFixed(1)}k
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 grid grid-cols-3 gap-1 text-[10px] font-medium text-slate-500">
                    <div><span className="text-slate-400 font-bold">7D:</span> <strong className="text-slate-800">₹{(weekly7DayRevenue / 1000).toFixed(1)}k</strong></div>
                    <div><span className="text-slate-400 font-bold">14D:</span> <strong className="text-slate-800">₹{((weekly7DayRevenue * 2) / 1000).toFixed(1)}k</strong></div>
                    <div><span className="text-slate-400 font-bold">21D:</span> <strong className="text-slate-800">₹{((weekly7DayRevenue * 3) / 1000).toFixed(1)}k</strong></div>
                  </div>
                </div>

                {/* KPI 3: Monthly Revenue & Target */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Revenue</span>
                    <span className="bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {currentOutlet.monthlyTarget > 0 ? Math.round(((currentOutlet.monthlyRevenue || 0) / currentOutlet.monthlyTarget) * 100) : 0}% Target
                    </span>
                  </div>
                  <p className="text-3xl font-black text-slate-800 mt-2">
                    ₹{((currentOutlet.monthlyRevenue || 0) / 1000).toFixed(1)}k
                  </p>
                  <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${currentOutlet.monthlyTarget > 0 ? Math.min(100, Math.round(((currentOutlet.monthlyRevenue || 0) / currentOutlet.monthlyTarget) * 100)) : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* KPI 4: AI Outlet Health Score */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Score</span>
                    <span className="bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      Grade {currentOutlet.healthGrade}
                    </span>
                  </div>
                  <p className="text-3xl font-black text-slate-800 mt-2">
                    {currentOutlet.healthScore} <span className="text-sm font-bold text-slate-400">/ 100</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Audit: {currentOutlet.auditScore}% • Rating: ⭐ {currentOutlet.customerRating}
                  </p>
                </div>

                {/* KPI 5: Order Speed */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Speed</span>
                    <span className="bg-orange-50 text-orange-600 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {currentOutlet.activeStaffOnShift} Staff
                    </span>
                  </div>
                  <p className="text-3xl font-black text-slate-800 mt-2">
                    {currentOutlet.fulfillmentTimeMin} <span className="text-sm font-bold text-slate-400">mins</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Avg Ticket: ₹{currentOutlet.avgTicketSize}
                  </p>
                </div>

              </div>

              {/* STORE 360 OPERATIONAL EFFICIENCY & DAILY VOLUME CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart A: Daily Orders & Average Ticket Size Combo Chart */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Daily Order Volume & Ticket Size (7D)
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Correlation between daily transaction counts and ticket averages
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold rounded">
                      Trend
                    </span>
                  </div>

                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={currentOutlet.weeklyRevenueData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <YAxis yAxisId="orders" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <YAxis yAxisId="ticket" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `₹${v}`} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              return (
                                <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg">
                                  <p className="font-bold text-indigo-300">{d.date}</p>
                                  <p className="text-slate-300">Orders: <strong className="text-white">{d.orderCount}</strong></p>
                                  <p className="text-slate-300">Avg Ticket: <strong className="text-emerald-400">₹{d.avgTicket}</strong></p>
                                  <p className="text-slate-300">Daily Revenue: <strong className="text-white">₹{d.actualRevenue.toLocaleString()}</strong></p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar yAxisId="orders" dataKey="orderCount" name="Order Count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="ticket" type="monotone" dataKey="avgTicket" name="Avg Ticket (₹)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Daily Orders</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Avg Ticket (₹)</span>
                    <span className="font-bold text-slate-700">Avg: ₹{currentOutlet.avgTicketSize} / order</span>
                  </div>
                </div>

                {/* Chart B: Store Competency Ribbon / Area Scorecard */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Store Performance Ribbon & Benchmark
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Performance curve vs network standard across 6 key pillars
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold rounded">
                      Ribbon Area
                    </span>
                  </div>

                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { metric: 'Rev Target', Store: Math.min(100, Math.round((currentOutlet.monthlyRevenue / currentOutlet.monthlyTarget) * 100)), Benchmark: 85 },
                          { metric: 'Health', Store: currentOutlet.healthScore, Benchmark: 80 },
                          { metric: 'Audit', Store: currentOutlet.auditScore, Benchmark: 82 },
                          { metric: 'Speed', Store: Math.max(20, 100 - (currentOutlet.fulfillmentTimeMin - 8) * 6), Benchmark: 75 },
                          { metric: 'CSAT', Store: Math.round((currentOutlet.customerRating / 5) * 100), Benchmark: 80 },
                          { metric: 'Growth', Store: Math.min(100, Math.max(10, 50 + currentOutlet.revenueGrowth * 2)), Benchmark: 65 },
                        ]}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="storeRibbonGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="benchRibbonGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="metric" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} />
                        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              return (
                                <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg">
                                  <p className="font-bold text-indigo-300">{d.metric}</p>
                                  <p className="text-indigo-200 flex items-center justify-between gap-3">
                                    <span>{currentOutlet.name}:</span>
                                    <strong>{d.Store}/100</strong>
                                  </p>
                                  <p className="text-slate-400 flex items-center justify-between gap-3">
                                    <span>Network Benchmark:</span>
                                    <strong>{d.Benchmark}/100</strong>
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area type="monotone" dataKey="Store" name={currentOutlet.name} stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#storeRibbonGrad)" />
                        <Area type="monotone" dataKey="Benchmark" name="Network Benchmark" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#benchRibbonGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> {currentOutlet.name.split(' ')[0]}</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Network Benchmark</span>
                    <span className={`font-bold ${currentOutlet.isUnderperforming ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {currentOutlet.isUnderperforming ? 'Needs Attention' : 'Optimal'}
                    </span>
                  </div>
                </div>

              </div>

              {/* AI OUTLET HEALTH SCORE REPORT & GENERATOR */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-base font-bold text-slate-900">
                        AI Store Health Diagnostic
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Multi-factor analysis of {currentOutlet.name} operations, hygiene compliance, and financial trends.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateAiHealthReport}
                    disabled={isHealthLoading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isHealthLoading ? 'animate-spin' : ''}`} />
                    <span>{isHealthLoading ? 'Analyzing...' : 'Run AI Diagnostic'}</span>
                  </button>
                </div>

                {/* AI Health Report Content */}
                {aiHealthReport ? (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        {aiHealthReport.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Strengths</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {aiHealthReport.keyStrengths.map((str, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                        <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <span>Recommendations</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {aiHealthReport.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 border border-slate-100">
                    Click <strong className="text-slate-800">"Run AI Diagnostic"</strong> above to generate real-time AI telemetry analysis for {currentOutlet.name}.
                  </div>
                )}
              </div>

              {/* INTERACTIVE LOCATION MAP SECTION */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      <span>Franchise Store Map</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Click markers to switch active outlet focus.
                    </p>
                  </div>

                  <div className="text-xs text-slate-400 font-bold hidden sm:block">
                    Region: <strong className="text-slate-800">{regionFilter}</strong>
                  </div>
                </div>

                {/* Map Container */}
                <OutletMap
                  outlets={filteredOutlets}
                  selectedOutlet={currentOutlet}
                  onSelectOutlet={(outlet) => {
                    setSelectedOutlet(outlet);
                    setAiHealthReport(null);
                  }}
                />
              </div>

            </div>
          )}

        </div>
      )}

      {/* COMPARISON MODAL */}
      <OutletCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        allOutlets={outlets}
        defaultSelectedOutlet={currentOutlet}
      />

      {/* RECOVERY PLAN DIAGNOSTIC MODAL */}
      <OutletRecoveryModal
        isOpen={Boolean(recoveryModalOutlet)}
        onClose={() => setRecoveryModalOutlet(null)}
        outlet={recoveryModalOutlet}
      />

    </div>
  );
};
