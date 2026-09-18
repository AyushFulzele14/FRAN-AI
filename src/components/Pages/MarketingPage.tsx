import React, { useState, useMemo } from 'react';
import { MarketingCampaign } from '../../types';
import { MarketingDashboard } from '../Marketing/MarketingDashboard';
import {
  Megaphone,
  TrendingUp,
  IndianRupee,
  Calendar,
  Users,
  Target,
  BarChart3,
  Sparkles,
  Download,
  Share2,
  Award,
  CheckCircle2,
  ArrowUpRight,
  Percent,
  Smartphone,
  Search,
  Filter,
  Clock,
  ArrowRight,
  FileText,
  RefreshCw,
  ChevronRight,
  X,
  Zap,
  Building2,
  Flame,
  Eye,
  Plus,
  Check,
  DownloadCloud,
  Printer,
  ShoppingBag,
  Sliders,
  PieChart as PieIcon,
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

interface MarketingPageProps {
  campaigns: MarketingCampaign[];
}

export const MarketingPage: React.FC<MarketingPageProps> = ({ campaigns: initialCampaigns }) => {
  const [pageViewMode, setPageViewMode] = useState<'dashboard' | 'campaigns'>('dashboard');
  const [campaignsList, setCampaignsList] = useState<MarketingCampaign[]>(initialCampaigns);
  const [activeTab, setActiveTab] = useState<'performance' | 'engagement' | 'effectiveness' | 'roi' | 'recommendations'>('performance');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [regionFilter, setRegionFilter] = useState<string>('All');

  // Modal States
  const [selectedCampaignForDetails, setSelectedCampaignForDetails] = useState<MarketingCampaign | null>(null);
  const [isRoiReportModalOpen, setIsRoiReportModalOpen] = useState(false);
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  
  // ROI Report generator filters
  const [roiTimeframe, setRoiTimeframe] = useState<'thisMonth' | 'qtd' | 'ytd'>('thisMonth');
  const [roiExportSuccess, setRoiExportSuccess] = useState(false);

  // New Campaign Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'Percentage' | 'BOGO' | 'Fixed Cash'>('Percentage');
  const [newBudget, setNewBudget] = useState(20000);
  const [newRegion, setNewRegion] = useState('South');

  // Applied Recommendations state
  const [appliedRecs, setAppliedRecs] = useState<string[]>([]);
  const [recToast, setRecToast] = useState<string | null>(null);

  // Extract unique regions
  const allRegions = Array.from(
    new Set(campaignsList.flatMap((c) => c.targetRegions))
  );

  // Filtered campaigns
  const filteredCampaigns = campaignsList.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesRegion =
      regionFilter === 'All' || c.targetRegions.includes(regionFilter);
    return matchesSearch && matchesStatus && matchesRegion;
  });

  // Performance calculations
  const totalBudget = campaignsList.reduce((sum, c) => sum + c.budget, 0);
  const totalRevenue = campaignsList.reduce((sum, c) => sum + c.attributedRevenue, 0);
  const blendedRoi = (totalRevenue / (totalBudget || 1)).toFixed(1);
  const totalRedemptions = campaignsList.reduce((sum, c) => sum + (c.redemptions || 0), 0);
  const totalImpressions = campaignsList.reduce((sum, c) => sum + (c.impressions || 0), 0);
  const avgRedemptionRate = (
    campaignsList.reduce((sum, c) => sum + (c.redemptionRate || 0), 0) / (campaignsList.length || 1)
  ).toFixed(1);

  // Handle Apply Recommendation
  const handleApplyRecommendation = (recId: string, title: string, revImpact: number, roiGain: number) => {
    if (appliedRecs.includes(recId)) return;
    setAppliedRecs((prev) => [...prev, recId]);

    // Apply simulated boost to campaigns
    setCampaignsList((prev) =>
      prev.map((c) => {
        if (c.status === 'Active') {
          const newRev = c.attributedRevenue + Math.round(revImpact / 2);
          const newRoi = Number((newRev / c.budget).toFixed(1));
          return {
            ...c,
            attributedRevenue: newRev,
            roi: newRoi,
          };
        }
        return c;
      })
    );

    setRecToast(`Applied: "${title}"! Projected +₹${revImpact.toLocaleString('en-IN')} revenue added.`);
    setTimeout(() => setRecToast(null), 4000);
  };

  // Handle Create New Campaign
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCode) return;

    const created: MarketingCampaign = {
      id: `mc-${Date.now()}`,
      title: newTitle,
      code: newCode.toUpperCase(),
      discountType: newDiscountType,
      targetRegions: [newRegion],
      startDate: '2026-08-01',
      endDate: '2026-09-30',
      budget: Number(newBudget),
      attributedRevenue: Math.round(newBudget * 4.2),
      roi: 4.2,
      status: 'Active',
      impressions: 120000,
      clicks: 15000,
      ctr: 12.5,
      cpa: 75,
      totalIssued: 10000,
      redemptions: 6200,
      redemptionRate: 62.0,
      aovWithPromo: 550,
      aovWithoutPromo: 400,
      basketUpliftPercent: 37.5,
      topPromotedItem: 'Special Offer Bundle',
      channelBreakdown: { appPush: 40, socialAds: 30, inStoreQR: 20, email: 10 },
      customerTypeBreakdown: { newCustomers: 45, returningCustomers: 55 },
      csatScore: 4.7,
    };

    setCampaignsList((prev) => [created, ...prev]);
    setIsNewCampaignModalOpen(false);
    setNewTitle('');
    setNewCode('');
    setRecToast(`Successfully launched new campaign "${created.title}"!`);
    setTimeout(() => setRecToast(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* TOAST NOTIFICATION */}
      {recToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold">{recToast}</p>
        </div>
      )}

      {/* MARKETING MODULE VIEW SWITCHER BAR */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => {
              setPageViewMode('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              pageViewMode === 'dashboard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Marketing Dashboard</span>
          </button>

          <button
            onClick={() => {
              setPageViewMode('campaigns');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              pageViewMode === 'campaigns'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Megaphone className="w-4 h-4 text-indigo-400" />
            <span>Campaign Directory & Analytics</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsRoiReportModalOpen(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-slate-200 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>ROI Report</span>
          </button>
          <button
            onClick={() => setIsNewCampaignModalOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {pageViewMode === 'dashboard' ? (
        <MarketingDashboard
          campaigns={campaignsList}
          onInspectCampaign={(c) => setSelectedCampaignForDetails(c)}
          onLaunchCampaign={() => setIsNewCampaignModalOpen(true)}
          onGenerateRoi={() => setIsRoiReportModalOpen(true)}
        />
      ) : (
        <>
      {/* HEADER BANNER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
            <Megaphone className="w-3 h-3 text-emerald-600" />
            <span>Franchise Promotional & Growth Engine</span>
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
            Marketing Operations & ROI Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor campaign performance, analyze customer engagement, measure promotion effectiveness, generate ROI reports & apply AI improvements.
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsRoiReportModalOpen(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all border border-slate-200 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Generate ROI Report</span>
          </button>
          <button
            onClick={() => setIsNewCampaignModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Campaign</span>
          </button>
        </div>
      </div>

      {/* KEY PERFORMANCE INDICATORS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Total Budget</span>
            <IndianRupee className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">₹{totalBudget.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-slate-500 font-medium">Across {campaignsList.length} campaigns</p>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold">Attributed Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-950">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-emerald-700 font-medium">+34.2% vs previous period</p>
        </div>

        <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-800">
            <span className="text-xs font-bold">Blended ROI Multiplier</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-950">{blendedRoi}x</p>
          <p className="text-[11px] text-indigo-700 font-medium">₹{totalBudget > 0 ? (totalRevenue / totalBudget).toFixed(2) : '0.00'} revenue per ₹1 spend</p>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-900">
            <span className="text-xs font-bold">Total Redemptions</span>
            <ShoppingBag className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-950">{totalRedemptions.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-amber-800 font-medium">{avgRedemptionRate}% avg redemption rate</p>
        </div>

        <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200/80 shadow-xs space-y-1 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-teal-900">
            <span className="text-xs font-bold">Ad Impressions</span>
            <Eye className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-teal-950">{(totalImpressions / 1000).toFixed(0)}k</p>
          <p className="text-[11px] text-teal-800 font-medium">12.8% Avg Click-Through Rate</p>
        </div>
      </div>

      {/* MARKETING KPI ANALYTICAL CHARTS DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Campaign Budget vs Attributed Revenue (ROI Benchmark) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Campaign Spend vs Attributed Revenue (₹ Lakhs)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Promotion financial return benchmarked against blended 3.5x ROI target
              </p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold rounded">
              ROI Multiplier
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={campaignsList.slice(0, 6).map((c) => ({
                  name: c.code,
                  title: c.title,
                  budget: Math.round(c.budget / 1000),
                  revenue: Math.round(c.attributedRevenue / 1000),
                  roi: (c.attributedRevenue / (c.budget || 1)).toFixed(1),
                }))}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `₹${v}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-xl">
                          <p className="font-black text-emerald-400">{d.title} ({d.name})</p>
                          <p className="text-slate-300">Spend Budget: <strong className="text-white">₹{d.budget}k</strong></p>
                          <p className="text-slate-300">Revenue Generated: <strong className="text-emerald-400">₹{d.revenue}k</strong></p>
                          <p className="text-slate-300">Campaign ROI: <strong className="text-indigo-400">{d.roi}x</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" name="Attributed Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="budget" name="Ad Spend Budget" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Attributed Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Ad Spend</span>
            <span className="font-bold text-emerald-600">Blended ROI: {blendedRoi}x Return</span>
          </div>
        </div>

        {/* Chart 2: Channel Acquisition Mix */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Channel Acquisition Mix
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Redemption traffic by medium
              </p>
            </div>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[10px] font-mono font-bold rounded">
              Traffic
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'App Push Notifications', value: 42 },
                    { name: 'Social Media Ads', value: 28 },
                    { name: 'In-Store QR Displays', value: 18 },
                    { name: 'Email / SMS Direct', value: 12 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {['#10b981', '#6366f1', '#f59e0b', '#ec4899'].map((c, i) => (
                    <Cell key={`mkt-cell-${i}`} fill={c} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val}% Share`, 'Volume']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Leading: App Push (42%)</span>
            <span className="font-bold text-indigo-600">{totalRedemptions.toLocaleString()} Redemptions</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between overflow-x-auto custom-scrollbar gap-1">
        <div className="flex items-center gap-1 min-w-max">
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'performance'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>1. Monitor Performance</span>
          </button>

          <button
            onClick={() => setActiveTab('engagement')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'engagement'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Customer Engagement</span>
          </button>

          <button
            onClick={() => setActiveTab('effectiveness')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'effectiveness'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>3. Promotion Effectiveness</span>
          </button>

          <button
            onClick={() => setActiveTab('roi')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'roi'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>4. Generate ROI Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'recommendations'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>5. Campaign Improvements</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaign name or promo code (DOM2FOR1, MCDMORNING...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Region:</span>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="All">All Regions</option>
              {allRegions.map((r) => (
                <option key={r} value={r}>
                  {r} Region
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TAB 1: MONITOR CAMPAIGN PERFORMANCE */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <span>Real-Time Campaign Performance Tracker</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Live monitoring of active, scheduled, and completed promotional offers.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                Showing {filteredCampaigns.length} campaigns
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold">
                    <th className="p-3.5">Campaign Details</th>
                    <th className="p-3.5">Target Regions</th>
                    <th className="p-3.5">Budget</th>
                    <th className="p-3.5">Attributed Sales</th>
                    <th className="p-3.5 text-center">ROI Multiplier</th>
                    <th className="p-3.5">Impressions / Clicks</th>
                    <th className="p-3.5">Redemptions</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCampaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-mono font-bold text-[10px]">
                              {c.code}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                c.status === 'Active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : c.status === 'Completed'
                                  ? 'bg-slate-100 text-slate-700'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>
                          <p className="font-extrabold text-slate-900 text-xs">{c.title}</p>
                          <p className="text-[11px] text-slate-400">
                            {c.startDate} to {c.endDate} · {c.discountType}
                          </p>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1">
                          {c.targetRegions.map((r) => (
                            <span
                              key={r}
                              className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-3.5 font-bold text-slate-800">
                        ₹{c.budget.toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5 font-black text-emerald-700">
                        ₹{c.attributedRevenue.toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5 text-center">
                        <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 font-black rounded-xl text-xs inline-block">
                          {c.roi}x ROI
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-0.5 text-[11px]">
                          <p className="font-bold text-slate-800">
                            {((c.impressions || 0) / 1000).toFixed(0)}k views
                          </p>
                          <p className="text-slate-500">
                            {(c.clicks || 0).toLocaleString()} clicks ({c.ctr}% CTR)
                          </p>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-0.5 text-[11px]">
                          <p className="font-bold text-amber-900">
                            {(c.redemptions || 0).toLocaleString()} used
                          </p>
                          <p className="text-slate-500">{c.redemptionRate}% rate</p>
                        </div>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedCampaignForDetails(c)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredCampaigns.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500">
                        No campaigns match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANALYZE CUSTOMER ENGAGEMENT */}
      {activeTab === 'engagement' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Customer Engagement & Multi-Channel Acquisition</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of customer type response (New vs Returning) and marketing channel engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-200/80 space-y-2">
                <div className="flex items-center justify-between text-indigo-900">
                  <span className="text-xs font-bold uppercase">Mobile App Push</span>
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-2xl font-black text-indigo-950">42.5% Share</p>
                <p className="text-[11px] text-indigo-700">Highest conversion rate (24.8%)</p>
              </div>

              <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-200/80 space-y-2">
                <div className="flex items-center justify-between text-teal-900">
                  <span className="text-xs font-bold uppercase">Social Media Ads</span>
                  <Share2 className="w-4 h-4 text-teal-600" />
                </div>
                <p className="text-2xl font-black text-teal-950">30.0% Share</p>
                <p className="text-[11px] text-teal-800">Drives 52% of new customer trial</p>
              </div>

              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between text-amber-900">
                  <span className="text-xs font-bold uppercase">In-Store QR Banners</span>
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-2xl font-black text-amber-950">17.5% Share</p>
                <p className="text-[11px] text-amber-800">82% on-counter scan conversion</p>
              </div>

              <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200/80 space-y-2">
                <div className="flex items-center justify-between text-rose-900">
                  <span className="text-xs font-bold uppercase">Customer CSAT Score</span>
                  <Award className="w-4 h-4 text-rose-600" />
                </div>
                <p className="text-2xl font-black text-rose-950">4.8 / 5.0 ★</p>
                <p className="text-[11px] text-rose-800">94% offer satisfaction rating</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaignsList.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-mono font-bold text-[10px]">
                      {c.code}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-1">{c.title}</h4>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    ⭐ {c.csatScore || 4.7} CSAT
                  </span>
                </div>

                {/* Customer Type Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">New Customers ({c.customerTypeBreakdown?.newCustomers || 40}%)</span>
                    <span className="text-slate-600">Returning ({c.customerTypeBreakdown?.returningCustomers || 60}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${c.customerTypeBreakdown?.newCustomers || 40}%` }}
                      title="New Buyers"
                    />
                    <div
                      className="bg-indigo-500 h-full"
                      style={{ width: `${c.customerTypeBreakdown?.returningCustomers || 60}%` }}
                      title="Returning Buyers"
                    />
                  </div>
                </div>

                {/* Channel breakdown bars */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[11px]">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <p className="text-slate-400 font-bold uppercase text-[9px]">App Push</p>
                    <p className="font-extrabold text-slate-800 mt-0.5">{c.channelBreakdown?.appPush}%</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <p className="text-slate-400 font-bold uppercase text-[9px]">Social Ads</p>
                    <p className="font-extrabold text-slate-800 mt-0.5">{c.channelBreakdown?.socialAds}%</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <p className="text-slate-400 font-bold uppercase text-[9px]">In-Store QR</p>
                    <p className="font-extrabold text-slate-800 mt-0.5">{c.channelBreakdown?.inStoreQR}%</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <p className="text-slate-400 font-bold uppercase text-[9px]">Email</p>
                    <p className="font-extrabold text-slate-800 mt-0.5">{c.channelBreakdown?.email}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MEASURE PROMOTION EFFECTIVENESS */}
      {activeTab === 'effectiveness' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Percent className="w-5 h-5 text-emerald-600" />
                <span>Promotion & Discount Effectiveness Matrix</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Analyze coupon redemption velocity, ticket size uplift, and top-performing promoted items.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campaignsList.map((c) => (
                <div key={c.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-900 font-mono font-black text-xs rounded">
                      {c.code}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      +{c.basketUpliftPercent}% Basket Uplift
                    </span>
                  </div>

                  <h4 className="font-black text-slate-900 text-sm">{c.title}</h4>

                  {/* Top Promoted Item */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Top Promoted Product</span>
                    <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{c.topPromotedItem}</span>
                    </p>
                  </div>

                  {/* AOV Uplift Comparison */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">AOV With Promo</span>
                      <p className="text-sm font-black text-emerald-700 mt-0.5">₹{c.aovWithPromo}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">AOV Without Promo</span>
                      <p className="text-sm font-black text-slate-600 mt-0.5">₹{c.aovWithoutPromo}</p>
                    </div>
                  </div>

                  {/* Redemption Rate Gauge */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Redemption Rate</span>
                      <span className="text-amber-900 font-black">{c.redemptionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${c.redemptionRate}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium pt-0.5">
                      {(c.redemptions || 0).toLocaleString()} redeemed out of {(c.totalIssued || 0).toLocaleString()} issued
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GENERATE ROI REPORTS */}
      {activeTab === 'roi' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-600" />
                  <span>Franchise Promotional ROI Financial Statement</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consolidated financial impact, net profit attribution, and return-on-ad-spend (ROAS).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRoiReportModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Full Printable Report</span>
                </button>
              </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Gross Attributed Revenue</span>
                <p className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-slate-500">From verified promo orders</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Marketing Ad Spend</span>
                <p className="text-2xl font-black text-rose-700">₹{totalBudget.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-slate-500">Campaign ad budgets</p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-900 uppercase">Net Promotional Margin</span>
                <p className="text-2xl font-black text-emerald-950">₹{(totalRevenue - totalBudget).toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-emerald-700">+{totalRevenue > 0 ? (((totalRevenue - totalBudget) / totalRevenue) * 100).toFixed(1) : '0.0'}% profit margin</p>
              </div>

              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-1">
                <span className="text-xs font-bold text-indigo-900 uppercase">Overall Net ROI</span>
                <p className="text-2xl font-black text-indigo-950">{blendedRoi}x Multiplier</p>
                <p className="text-[11px] text-indigo-700">₹{totalBudget > 0 ? (totalRevenue / totalBudget).toFixed(2) : '0.00'} return per ₹1 spent</p>
              </div>
            </div>

            {/* Campaign-by-Campaign Financial Breakdown Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Campaign Name</th>
                    <th className="p-3.5">Coupon Code</th>
                    <th className="p-3.5 text-right">Budget Spent</th>
                    <th className="p-3.5 text-right">Attributed Revenue</th>
                    <th className="p-3.5 text-right">Net Profit</th>
                    <th className="p-3.5 text-center">ROI Multiplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {campaignsList.map((c) => {
                    const profit = c.attributedRevenue - c.budget;
                    return (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">{c.title}</td>
                        <td className="p-3.5 font-mono text-indigo-700 font-bold">{c.code}</td>
                        <td className="p-3.5 text-right text-slate-700">₹{c.budget.toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-right font-bold text-emerald-700">₹{c.attributedRevenue.toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-right font-black text-slate-900">₹{profit.toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-center">
                          <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 font-black rounded-lg text-xs">
                            {c.roi}x
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RECOMMEND CAMPAIGN IMPROVEMENTS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl border border-emerald-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-700 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Growth & Campaign Optimizer</span>
              </span>
              <span className="text-xs text-emerald-200 font-mono">Real-Time Data Synthesis</span>
            </div>
            <h2 className="text-xl font-black text-white">Recommended Campaign Improvements & Budget Actions</h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Data-driven recommendations to maximize revenue attribution, optimize ad channel spending, and boost coupon redemption speed across franchise outlets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaignsList.flatMap((c) =>
              (c.recommendations || []).map((rec) => {
                const isApplied = appliedRecs.includes(rec.id);
                return (
                  <div
                    key={rec.id}
                    className={`bg-white p-5 rounded-2xl border transition-all space-y-4 ${
                      isApplied
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-slate-200/90 hover:border-emerald-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase inline-block ${
                            rec.type === 'High Impact'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : rec.type === 'Budget Optimization'
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {rec.type}
                        </span>
                        <h4 className="font-black text-slate-900 text-sm">{rec.title}</h4>
                        <p className="text-[11px] font-semibold text-emerald-700">For: {c.title} ({c.code})</p>
                      </div>

                      {isApplied && (
                        <span className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-[10px] rounded-full inline-flex items-center gap-1 shrink-0">
                          <Check className="w-3 h-3" />
                          <span>Applied</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>

                    {/* Impact metrics pill */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-bold">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Expected Revenue Gain</span>
                        <span className="text-emerald-700 text-sm font-black">
                          +₹{rec.expectedRevenueImpact.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">ROI Lift</span>
                        <span className="text-indigo-700 text-sm font-black">+{rec.expectedRoiGain}x</span>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() =>
                          handleApplyRecommendation(rec.id, rec.title, rec.expectedRevenueImpact, rec.expectedRoiGain)
                        }
                        disabled={isApplied}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                          isApplied
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{isApplied ? 'Recommendation Active' : 'Apply Improvement'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
      </>
      )}

      {/* MODAL 1: INSPECT CAMPAIGN DETAILS */}
      {selectedCampaignForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-mono font-bold text-xs">
                  {selectedCampaignForDetails.code}
                </span>
                <h3 className="font-black text-slate-900 text-base mt-1">
                  {selectedCampaignForDetails.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCampaignForDetails(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Budget</span>
                  <p className="text-base font-black text-slate-900 mt-0.5">
                    ₹{selectedCampaignForDetails.budget.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase">Attributed Sales</span>
                  <p className="text-base font-black text-emerald-950 mt-0.5">
                    ₹{selectedCampaignForDetails.attributedRevenue.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 flex items-center justify-between font-bold">
                <span className="text-indigo-900">Net Campaign ROI Multiplier:</span>
                <span className="text-indigo-950 font-black text-base">{selectedCampaignForDetails.roi}x</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Target Product</span>
                <p className="font-extrabold text-slate-900">{selectedCampaignForDetails.topPromotedItem}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Impressions</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {((selectedCampaignForDetails.impressions || 0) / 1000).toFixed(0)}k
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Clicks</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {(selectedCampaignForDetails.clicks || 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Cost / Acq (CPA)</span>
                  <p className="font-bold text-slate-800 mt-0.5">₹{selectedCampaignForDetails.cpa || 80}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCampaignForDetails(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FORMAL ROI REPORT GENERATOR */}
      {isRoiReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Official Statement
                </span>
                <h3 className="font-black text-slate-900 text-lg mt-1">
                  Franchise Marketing ROI & Financial Impact Report
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsRoiReportModalOpen(false);
                  setRoiExportSuccess(false);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeframe options */}
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs font-bold">
              <span className="text-slate-500 px-2">Select Period:</span>
              {(['thisMonth', 'qtd', 'ytd'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setRoiTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    roiTimeframe === tf
                      ? 'bg-white text-slate-900 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tf === 'thisMonth' ? 'July 2026' : tf === 'qtd' ? 'Q3 2026 QTD' : 'YTD 2026'}
                </button>
              ))}
            </div>

            {/* Formal Statement Body */}
            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <div className="flex items-center justify-between font-extrabold border-b border-slate-200 pb-2 text-slate-800">
                <span>Metric Statement Item</span>
                <span>Financial Value</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Promotional Campaigns Executed</span>
                  <span className="font-bold text-slate-900">{campaignsList.length} Campaigns</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Marketing Ad Budget Spent</span>
                  <span className="font-bold text-rose-700">₹{totalBudget.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Gross Attributed Revenue</span>
                  <span className="font-extrabold text-emerald-700">₹{totalRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Coupon Redemptions Issued/Claimed</span>
                  <span className="font-bold text-slate-900">{totalRedemptions.toLocaleString('en-IN')} Orders</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Average Customer Order Uplift</span>
                  <span className="font-bold text-indigo-700">+38.5% Basket Size</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-950 font-black text-sm">
                <span>Net Promotional Profit (ROI {blendedRoi}x):</span>
                <span>₹{(totalRevenue - totalBudget).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {roiExportSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ROI Financial Statement PDF exported & queued for franchise email delivery!</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Statement</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setRoiExportSuccess(true);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE NEW CAMPAIGN */}
      {isNewCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">Launch New Promotional Campaign</h3>
                <p className="text-xs text-slate-500">Configure geo-targeted discount offers & budget.</p>
              </div>
              <button
                onClick={() => setIsNewCampaignModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekend Pizza Feast 20% Off"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FEAST20"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={newDiscountType}
                    onChange={(e) => setNewDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Percentage">Percentage %</option>
                    <option value="BOGO">BOGO (Buy 1 Get 1)</option>
                    <option value="Fixed Cash">Fixed Cash Off (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Marketing Budget (₹)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Region</label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="South">South Region</option>
                    <option value="North">North Region</option>
                    <option value="West">West Region</option>
                    <option value="East">East Region</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCampaignModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs"
                >
                  Launch Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
