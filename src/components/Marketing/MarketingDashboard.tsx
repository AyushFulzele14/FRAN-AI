import React from 'react';
import { MarketingCampaign } from '../../types';
import {
  Megaphone,
  TrendingUp,
  IndianRupee,
  Calendar,
  Users,
  Target,
  BarChart3,
  Sparkles,
  PieChart as PieIcon,
  Award,
  CheckCircle2,
  Percent,
  Flame,
  ArrowUpRight
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

interface MarketingDashboardProps {
  campaigns: MarketingCampaign[];
  onNavigateSubTab?: (tab: 'performance' | 'engagement' | 'effectiveness' | 'roi' | 'recommendations') => void;
}

export const MarketingDashboard: React.FC<MarketingDashboardProps> = ({
  campaigns,
  onNavigateSubTab,
}) => {
  // Aggregate Calculations
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'Active');
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalRevenueGenerated = campaigns.reduce((sum, c) => sum + (c.attributedRevenue || (c as any).revenueGenerated || 0), 0);
  const overallRoas = totalBudget > 0 ? (totalRevenueGenerated / totalBudget).toFixed(1) : '3.8';
  const totalRedemptions = campaigns.reduce((sum, c) => sum + (c.redemptions || (c as any).redemptionCount || 420), 0);

  // Campaign ROI Bar Chart Data
  const campaignRoiData = campaigns.slice(0, 6).map((c) => {
    const rev = c.attributedRevenue || (c as any).revenueGenerated || 180000;
    const bud = c.budget || 45000;
    return {
      name: c.title.length > 14 ? c.title.substring(0, 13) + '...' : c.title,
      code: c.code,
      budgetK: Math.round(bud / 1000),
      revenueK: Math.round(rev / 1000),
      roas: bud > 0 ? (rev / bud).toFixed(1) : '3.8',
      redemptions: c.redemptions || (c as any).redemptionCount || 420,
    };
  });

  // Channel Mix distribution
  const marketingChannelMix = [
    { name: 'Swiggy & Zomato Promos', value: 42, color: '#f59e0b' },
    { name: 'WhatsApp & SMS Direct', value: 28, color: '#10b981' },
    { name: 'Instagram & Meta Ads', value: 20, color: '#6366f1' },
    { name: 'In-Store Table QR Codes', value: 10, color: '#ec4899' },
  ];

  // Campaign Redemptions Trend over 6 weeks
  const campaignRedemptionTrend = [
    { week: 'W1', redemptions: 420, revenueGeneratedK: 84.0, cacCost: 28 },
    { week: 'W2', redemptions: 680, revenueGeneratedK: 142.8, cacCost: 24 },
    { week: 'W3', redemptions: 890, revenueGeneratedK: 195.8, cacCost: 21 },
    { week: 'W4', redemptions: 1150, revenueGeneratedK: 264.5, cacCost: 19 },
    { week: 'W5', redemptions: 1420, revenueGeneratedK: 326.6, cacCost: 18 },
    { week: 'W6', redemptions: 1780, revenueGeneratedK: 412.0, cacCost: 17 },
  ];

  return (
    <div id="marketing-dashboard" className="space-y-6 pb-6">
      {/* 1. PRIMARY CHARTS: CAMPAIGN REVENUE VS BUDGET & CHANNEL MIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Campaign Revenue Generated vs Ad Spend Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                <span>Campaign Revenue Generated vs Ad Spend Budget (₹k)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Top promotion performance across franchise marketing initiatives
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Revenue
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-slate-300 inline-block" /> Budget
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignRoiData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    `₹${val}k`,
                    name === 'revenueK' ? 'Gross Revenue Generated' : 'Campaign Budget',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="revenueK" fill="#10b981" radius={[6, 6, 0, 0]} name="revenueK" />
                <Bar dataKey="budgetK" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="budgetK" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-center text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Promo Revenue</span>
              <p className="text-sm font-black text-emerald-600 mt-0.5">₹{(totalRevenueGenerated / 1000).toFixed(1)}k</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Fleet Average ROAS</span>
              <p className="text-sm font-black text-indigo-600 mt-0.5">{overallRoas}x Return</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Redemptions</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">{totalRedemptions.toLocaleString()} Coupons</p>
            </div>
          </div>
        </div>

        {/* Marketing Channel Mix Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-indigo-600" />
              <span>Acquisition Channel Share</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer conversions by channel
            </p>
          </div>

          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketingChannelMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {marketingChannelMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}% Share`, name]}
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
              <span className="text-2xl font-black text-slate-900">{totalCampaigns}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Campaigns</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {marketingChannelMix.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. SECOND ROW: REDEMPTIONS GROWTH & CAC REDUCTION CURVE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Multi-Week Redemption Growth & CAC Compression */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Weekly Redemptions vs Customer Acquisition Cost (CAC ₹)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Viral campaign coefficient resulting in 39% reduction in cost per acquired guest
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
              CAC: ₹17 / Customer
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={campaignRedemptionTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="mktGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    name === 'redemptions' ? `${val} orders` : `₹${val}`,
                    name === 'redemptions' ? 'Voucher Redemptions' : name === 'cacCost' ? 'Acquisition Cost' : 'Revenue Generated (k)',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="redemptions" stroke="#10b981" strokeWidth={2.5} fill="url(#mktGrad)" name="redemptions" />
                <Line type="monotone" dataKey="cacCost" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="cacCost" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Promotional Recommendations Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>AI Revenue Uplift Suggestions</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">High-intent automated tactical offers</p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <strong className="text-indigo-950">Afternoon Tea Combo Surge</strong>
                <span className="text-emerald-700 font-bold font-mono">+₹45k / mo</span>
              </div>
              <p className="text-[11px] text-indigo-800">Launch 16:00-18:00 beverage bundle on Swiggy to bridge slow mid-day slot.</p>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <strong className="text-amber-950">Late Night Weekend BOGO</strong>
                <span className="text-emerald-700 font-bold font-mono">+₹68k / mo</span>
              </div>
              <p className="text-[11px] text-amber-800">Target Indiranagar & Hitec tech hubs after 22:30 PM with delivery discounts.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
