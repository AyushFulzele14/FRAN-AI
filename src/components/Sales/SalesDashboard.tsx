import React, { useState } from 'react';
import { SaleRecord, Outlet } from '../../types';
import {
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Utensils,
  Truck,
  Car,
  Store,
  Clock,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  Flame,
  CheckCircle2,
  X,
  ChevronRight,
  Filter,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Timer
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

interface SalesDashboardProps {
  sales: SaleRecord[];
  outlets: Outlet[];
  onSelectOrder?: (order: SaleRecord) => void;
  onNavigateSubTab?: (tab: 'transactions' | 'trends' | 'channels' | 'products' | 'leaderboard') => void;
}

export const SalesDashboard: React.FC<SalesDashboardProps> = ({
  sales,
  outlets,
  onSelectOrder,
  onNavigateSubTab,
}) => {
  // Interactive States
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [daypartFilter, setDaypartFilter] = useState<'all' | 'morning' | 'lunch' | 'dinner'>('all');
  const [regionFilter, setRegionFilter] = useState<'all' | 'South' | 'North' | 'West'>('all');

  // Aggregate sales calculations
  const totalSalesVolume = sales.reduce((acc, s) => acc + s.amount, 0);
  const totalOrdersCount = sales.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalSalesVolume / totalOrdersCount) : 712;

  // Channel distribution
  const dineInSales = sales.filter((s) => s.channel === 'Dine-In').reduce((sum, s) => sum + s.amount, 0);
  const takeawaySales = sales.filter((s) => s.channel === 'Takeaway').reduce((sum, s) => sum + s.amount, 0);
  const deliverySales = sales.filter((s) => s.channel === 'Delivery').reduce((sum, s) => sum + s.amount, 0);
  const driveThruSales = sales.filter((s) => s.channel === 'Drive-Thru').reduce((sum, s) => sum + s.amount, 0);

  const salesChannelMix = [
    {
      name: 'Dine-In',
      value: dineInSales || 45000,
      color: '#10b981',
      pct: '38%',
      orders: 68,
      avgAov: '₹662',
      turnaround: '24 mins table time',
      topItem: 'Farmhouse Loaded Pizza',
      driverInfo: 'Table Turnover: 2.8x / shift',
    },
    {
      name: 'Takeaway',
      value: takeawaySales || 35000,
      color: '#6366f1',
      pct: '29%',
      orders: 52,
      avgAov: '₹673',
      turnaround: '8 mins pack time',
      topItem: 'McSpicy Chicken Burger Combo',
      driverInfo: 'Counter Pickups: 94% on-time',
    },
    {
      name: 'Delivery',
      value: deliverySales || 28000,
      color: '#f59e0b',
      pct: '23%',
      orders: 41,
      avgAov: '₹682',
      turnaround: '18 mins avg ETA',
      topItem: 'Hot & Crispy 6-Pc Bucket',
      driverInfo: 'Swiggy 54% • Zomato 42% • Direct 4%',
    },
    {
      name: 'Drive-Thru',
      value: driveThruSales || 12000,
      color: '#ec4899',
      pct: '10%',
      orders: 18,
      avgAov: '₹666',
      turnaround: '4.2 mins window time',
      topItem: 'Peri Peri Seasoned Fries (L)',
      driverInfo: 'Lane Velocity: 14 cars / 15 mins',
    },
  ];

  const activeChannelData = selectedChannel
    ? salesChannelMix.find((c) => c.name === selectedChannel)
    : null;

  // Hourly Sales Velocity curve with rich metadata
  const rawHourlyData = [
    { hour: '09:00', period: 'morning', sales: 12400, orders: 18, avgTicket: 688, topItem: 'Egg McMuffin Meal', ktt: '3.8m', peakStaff: 4 },
    { hour: '11:00', period: 'lunch', sales: 28600, orders: 42, avgTicket: 680, topItem: 'Iced Coffee & Fries', ktt: '4.2m', peakStaff: 6 },
    { hour: '13:00', period: 'lunch', sales: 64200, orders: 88, avgTicket: 729, topItem: 'Farmhouse Large Pizza', ktt: '5.8m', peakStaff: 9 },
    { hour: '15:00', period: 'lunch', sales: 32000, orders: 46, avgTicket: 695, topItem: 'Choco Lava Cake Supreme', ktt: '4.0m', peakStaff: 5 },
    { hour: '17:00', period: 'dinner', sales: 24800, orders: 36, avgTicket: 688, topItem: 'Peri Peri French Fries', ktt: '3.9m', peakStaff: 6 },
    { hour: '19:00', period: 'dinner', sales: 78900, orders: 104, avgTicket: 758, topItem: 'McSpicy Chicken Burger Meal', ktt: '6.4m', peakStaff: 10 },
    { hour: '21:00', period: 'dinner', sales: 86400, orders: 118, avgTicket: 732, topItem: 'Hot & Crispy Bucket & Cokes', ktt: '6.9m', peakStaff: 11 },
    { hour: '23:00', period: 'dinner', sales: 21500, orders: 31, avgTicket: 693, topItem: 'Cheese Burst Late Night Slice', ktt: '4.5m', peakStaff: 5 },
  ];

  const filteredHourlyData = rawHourlyData.filter((h) => {
    if (daypartFilter === 'all') return true;
    return h.period === daypartFilter;
  });

  const activeHourData = selectedHour
    ? rawHourlyData.find((h) => h.hour === selectedHour)
    : null;

  // Sales by Outlet comparison
  const filteredOutlets = outlets.filter((o) => {
    if (regionFilter === 'all') return true;
    return o.region.toLowerCase().includes(regionFilter.toLowerCase());
  });

  const salesByStoreData = filteredOutlets.map((o) => {
    const storeSales = sales.filter((s) => s.outletId === o.id).reduce((sum, s) => sum + s.amount, 0);
    return {
      id: o.id,
      name: o.name.replace("McDonald's ", 'MCD-').replace("Domino's ", 'DOM-').replace("KFC ", 'KFC-').slice(0, 14),
      fullName: o.name,
      code: o.code,
      actualSalesK: Math.round((storeSales || o.todaySales) / 1000),
      todayOrders: o.todayOrders,
      region: o.region,
      manager: o.manager,
      healthScore: o.healthScore,
      auditScore: o.auditScore,
      outlet: o,
    };
  });

  const activeStoreData = selectedStoreId
    ? salesByStoreData.find((s) => s.id === selectedStoreId)
    : null;

  // Payment Method Breakdown with Gateway specifics
  const paymentBreakdown = [
    {
      method: 'UPI / QR Code',
      amount: 58,
      color: '#6366f1',
      gateway: 'Paytm Dynamic POS & PhonePe Switch',
      successRate: '99.7%',
      avgSettlementTime: 'Instant (T+0)',
      refundRate: '0.08%',
    },
    {
      method: 'Credit / Debit Card',
      amount: 28,
      color: '#10b981',
      gateway: 'PineLabs Plutus & Razorpay EDC POS',
      successRate: '99.2%',
      avgSettlementTime: 'Next Day (T+1)',
      refundRate: '0.24%',
    },
    {
      method: 'Mobile Wallets',
      amount: 10,
      color: '#f59e0b',
      gateway: 'Amazon Pay, Cred Pay & MobiKwik',
      successRate: '98.9%',
      avgSettlementTime: 'Next Day (T+1)',
      refundRate: '0.12%',
    },
    {
      method: 'Cash',
      amount: 4,
      color: '#94a3b8',
      gateway: 'POS Register Safe & Cash Drop Log',
      successRate: '100%',
      avgSettlementTime: 'End of Shift Deposit',
      refundRate: '0.02%',
    },
  ];

  const activePaymentData = selectedPaymentMethod
    ? paymentBreakdown.find((p) => p.method === selectedPaymentMethod)
    : null;

  return (
    <div id="sales-dashboard" className="space-y-6 pb-6 animate-in fade-in duration-300">
      
      {/* ACTIVE SELECTION BANNER */}
      {(selectedHour || selectedChannel || selectedStoreId || selectedPaymentMethod) && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Interactive Drilldown Active</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-white">
                {selectedHour && `Time Interval: ${selectedHour} Rush Period`}
                {selectedChannel && `Channel: ${selectedChannel}`}
                {selectedStoreId && `Store: ${activeStoreData?.fullName}`}
                {selectedPaymentMethod && `Payment Tender: ${selectedPaymentMethod}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedHour(null);
              setSelectedChannel(null);
              setSelectedStoreId(null);
              setSelectedPaymentMethod(null);
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}

      {/* 1. PRIMARY CHARTS: HOURLY SALES VELOCITY & CHANNEL MIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hourly Sales & Peak Lunch/Dinner Velocity Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Intraday Sales Velocity (Interactive)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any hourly point to inspect ticket counts, top SKU, and kitchen ticket speed
              </p>
            </div>

            {/* Daypart Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setDaypartFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  daypartFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Day
              </button>
              <button
                onClick={() => setDaypartFilter('lunch')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  daypartFilter === 'lunch' ? 'bg-amber-100 text-amber-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lunch (11-15h)
              </button>
              <button
                onClick={() => setDaypartFilter('dinner')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  daypartFilter === 'dinner' ? 'bg-indigo-100 text-indigo-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dinner (17-23h)
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredHourlyData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    const hourObj = e.activePayload[0].payload;
                    setSelectedHour(selectedHour === hourObj.hour ? null : hourObj.hour);
                  }
                }}
              >
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    name === 'sales' ? `₹${val.toLocaleString()}` : `${val} tickets`,
                    name === 'sales' ? 'Hourly Revenue' : 'Ticket Count',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="sales"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#salesGrad)"
                  cursor="pointer"
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 7, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* DYNAMIC HOURLY DIAGNOSTIC CARD */}
          {activeHourData ? (
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{activeHourData.hour} Peak Interval</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{activeHourData.orders} orders processed • Crew on shift: {activeHourData.peakStaff}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-emerald-400 font-mono">₹{activeHourData.sales.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block">Avg Ticket: ₹{activeHourData.avgTicket}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-400">Top Velocity Item:</span>
                  <strong className="text-amber-300 font-bold">{activeHourData.topItem}</strong>
                </div>
                <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-400">Kitchen Prep Speed (KTT):</span>
                  <strong className="text-emerald-400 font-bold">{activeHourData.ktt} avg</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-center text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Peak Hourly Velocity</span>
                <p className="text-sm font-black text-slate-900 mt-0.5">₹86,400 / hr</p>
                <span className="text-[10px] text-emerald-600 font-bold">21:00 Peak Rush</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Fleet Avg Ticket (AOV)</span>
                <p className="text-sm font-black text-emerald-600 mt-0.5">₹{avgOrderValue}</p>
                <span className="text-[10px] text-slate-500 font-bold">+12% vs Target</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Peak Order Throughput</span>
                <p className="text-sm font-black text-indigo-600 mt-0.5">118 Orders/hr</p>
                <span className="text-[10px] text-indigo-500 font-bold">6.9m KTT speed</span>
              </div>
            </div>
          )}
        </div>

        {/* Fulfillment Channel Distribution - Interactive Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-indigo-600" />
                <span>Channel Mix (Click Slices)</span>
              </h3>
              {selectedChannel && (
                <button
                  onClick={() => setSelectedChannel(null)}
                  className="text-[11px] font-bold text-indigo-600 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click slice to view turnaround speed, top item & aggregator splits
            </p>
          </div>

          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesChannelMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  cursor="pointer"
                  onClick={(entry) => {
                    setSelectedChannel(selectedChannel === entry.name ? null : entry.name);
                  }}
                >
                  {salesChannelMix.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={selectedChannel === entry.name ? '#0f172a' : '#ffffff'}
                      strokeWidth={selectedChannel === entry.name ? 3 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`₹${val.toLocaleString()}`, name]}
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
              <span className="text-2xl font-black text-slate-900">4</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Channels</span>
            </div>
          </div>

          {/* Interactive Channel Buttons */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {salesChannelMix.map((item) => (
              <button
                key={item.name}
                onClick={() => setSelectedChannel(selectedChannel === item.name ? null : item.name)}
                className={`w-full flex items-center justify-between text-xs p-2 rounded-xl transition-all cursor-pointer ${
                  selectedChannel === item.name
                    ? 'bg-slate-100 ring-1 ring-slate-400 font-bold'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">₹{(item.value / 1000).toFixed(1)}k ({item.pct})</span>
              </button>
            ))}
          </div>

          {/* ACTIVE CHANNEL DETAIL HIGHLIGHT */}
          {activeChannelData && (
            <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between font-extrabold text-indigo-950">
                <span>{activeChannelData.name} Breakdown</span>
                <span>{activeChannelData.orders} Orders ({activeChannelData.avgAov} AOV)</span>
              </div>
              <div className="text-[11px] text-indigo-800 flex justify-between">
                <span>Speed / Turnaround:</span>
                <strong>{activeChannelData.turnaround}</strong>
              </div>
              <div className="text-[11px] text-indigo-800 flex justify-between">
                <span>Top Velocity SKU:</span>
                <strong>{activeChannelData.topItem}</strong>
              </div>
              <div className="text-[11px] text-indigo-800 flex justify-between border-t border-indigo-200/60 pt-1">
                <span>Fulfillment Split:</span>
                <span className="font-bold">{activeChannelData.driverInfo}</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 2. SECOND ROW: SALES BY OUTLET & PAYMENT GATEWAY ADOPTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales by Outlet Comparison - Interactive Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-600" />
                <span>Today's Sales Revenue by Store (₹k) (Click Bar)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any store bar to view live transactions, store manager & audit health
              </p>
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setRegionFilter('all')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  regionFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600'
                }`}
              >
                All Regions
              </button>
              <button
                onClick={() => setRegionFilter('South')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  regionFilter === 'South' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600'
                }`}
              >
                South
              </button>
              <button
                onClick={() => setRegionFilter('North')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  regionFilter === 'North' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600'
                }`}
              >
                North
              </button>
              <button
                onClick={() => setRegionFilter('West')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  regionFilter === 'West' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600'
                }`}
              >
                West
              </button>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesByStoreData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    const storeObj = e.activePayload[0].payload;
                    setSelectedStoreId(selectedStoreId === storeObj.id ? null : storeObj.id);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`₹${val}k`, "Today's Sales"]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="actualSalesK" radius={[6, 6, 0, 0]} cursor="pointer">
                  {salesByStoreData.map((entry) => (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={selectedStoreId === entry.id ? '#10b981' : selectedStoreId ? '#94a3b8' : '#6366f1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* DYNAMIC STORE DIAGNOSTIC CARD */}
          {activeStoreData && (
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h4 className="text-sm font-black text-white">{activeStoreData.fullName}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{activeStoreData.code} • {activeStoreData.region}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-emerald-400 font-mono">₹{activeStoreData.actualSalesK}k</span>
                  <span className="text-[10px] text-slate-400 block">{activeStoreData.todayOrders} Orders Today</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block uppercase">Store Manager</span>
                  <strong className="text-white">{activeStoreData.manager}</strong>
                </div>
                <div className="p-2 bg-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block uppercase">Health Index</span>
                  <strong className="text-emerald-400">{activeStoreData.healthScore}/100</strong>
                </div>
                <div className="p-2 bg-slate-800 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block uppercase">Audit QA Score</span>
                  <strong className="text-indigo-300">{activeStoreData.auditScore}% Passed</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Gateway Adoption - Interactive Click */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              <span>Payment Tender Mix</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Click method to inspect gateway success rate & switch metrics</p>
          </div>

          <div className="space-y-3 pt-1">
            {paymentBreakdown.map((pay) => (
              <button
                key={pay.method}
                onClick={() => setSelectedPaymentMethod(selectedPaymentMethod === pay.method ? null : pay.method)}
                className={`w-full text-left p-2 rounded-xl border transition-all cursor-pointer space-y-1 ${
                  selectedPaymentMethod === pay.method
                    ? 'bg-slate-100/90 border-slate-300 shadow-xs'
                    : 'bg-slate-50/50 hover:bg-slate-100/60 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-800 font-bold">{pay.method}</span>
                  <span className="font-black text-slate-900">{pay.amount}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pay.amount}%`, backgroundColor: pay.color }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* DYNAMIC PAYMENT METHOD DETAILS */}
          {activePaymentData ? (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between font-extrabold text-amber-950">
                <span>{activePaymentData.method}</span>
                <span className="text-emerald-700 font-bold">{activePaymentData.successRate} Success</span>
              </div>
              <div className="text-[11px] text-amber-900 flex justify-between">
                <span>Gateway Switch:</span>
                <strong className="text-right truncate ml-2">{activePaymentData.gateway}</strong>
              </div>
              <div className="text-[11px] text-amber-900 flex justify-between">
                <span>Settlement Speed:</span>
                <strong>{activePaymentData.avgSettlementTime}</strong>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
              <span>UPI & Instant QR Share:</span>
              <strong className="text-indigo-600 font-bold">58% Dominance</strong>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
