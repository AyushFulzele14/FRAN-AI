import React, { useState, useMemo } from 'react';
import { SaleRecord, Outlet } from '../../types';
import { SalesDashboard } from '../Sales/SalesDashboard';
import {
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Download,
  Plus,
  Receipt,
  Printer,
  ChevronRight,
  Sparkles,
  Layers,
  Utensils,
  Truck,
  Car,
  Store,
  Calendar,
  X,
  RefreshCw,
  SlidersHorizontal,
  FileSpreadsheet,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  Tag,
  AlertCircle,
  LayoutDashboard
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface SalesPageProps {
  sales: SaleRecord[];
  outlets: Outlet[];
  onAddNewSale?: (sale: SaleRecord) => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({ sales: initialSales, outlets, onAddNewSale }) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'transactions'>('dashboard');
  // Local active sales state for interactivity and simulator additions
  const [localSales, setLocalSales] = useState<SaleRecord[]>(initialSales);
  const [activeSubTab, setActiveSubTab] = useState<'transactions' | 'trends' | 'channels' | 'products' | 'leaderboard'>('transactions');
  
  // Filters
  const [selectedOutletFilter, setSelectedOutletFilter] = useState<string>('all');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('all');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Order for Receipt Modal
  const [selectedOrder, setSelectedOrder] = useState<SaleRecord | null>(null);

  // New POS Order Simulator Modal
  const [showPosSimulator, setShowPosSimulator] = useState<boolean>(false);
  const [simulatorOutletId, setSimulatorOutletId] = useState<string>(outlets[0]?.id || 'o-101');
  const [simulatorChannel, setSimulatorChannel] = useState<'Dine-In' | 'Takeaway' | 'Delivery' | 'Drive-Thru'>('Dine-In');
  const [simulatorPayment, setSimulatorPayment] = useState<'Credit Card' | 'Mobile Wallet' | 'Cash' | 'UPI / QR Code'>('Credit Card');
  const [simulatorCustomer, setSimulatorCustomer] = useState<string>('Rajesh Gupta');
  const [simulatorSelectedItems, setSimulatorSelectedItems] = useState<{ [key: string]: number }>({
    'Farmhouse Large Pizza': 1,
    'Garlic Bread with Dip': 1,
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync initialSales prop updates if live simulation adds orders
  React.useEffect(() => {
    setLocalSales(initialSales);
  }, [initialSales]);

  // Filtered Sales Calculation
  const filteredSales = useMemo(() => {
    return localSales.filter((s) => {
      if (selectedOutletFilter !== 'all' && s.outletId !== selectedOutletFilter) return false;
      if (selectedChannelFilter !== 'all' && s.channel !== selectedChannelFilter) return false;
      if (selectedPaymentFilter !== 'all' && s.paymentMethod !== selectedPaymentFilter) return false;
      if (selectedStatusFilter !== 'all' && s.status !== selectedStatusFilter) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchOrder = s.orderNumber.toLowerCase().includes(query);
        const matchOutlet = s.outletName.toLowerCase().includes(query);
        const matchCustomer = s.customerName?.toLowerCase().includes(query);
        if (!matchOrder && !matchOutlet && !matchCustomer) return false;
      }
      return true;
    });
  }, [localSales, selectedOutletFilter, selectedChannelFilter, selectedPaymentFilter, selectedStatusFilter, searchQuery]);

  // Overall KPI aggregations
  const totalRevenue = useMemo(() => {
    return outlets.reduce((acc, curr) => acc + curr.monthlyRevenue, 0);
  }, [outlets]);

  const todayGrossSales = useMemo(() => {
    return outlets.reduce((acc, curr) => acc + curr.todaySales, 0);
  }, [outlets]);

  const totalTodayOrders = useMemo(() => {
    return outlets.reduce((acc, curr) => acc + curr.todayOrders, 0);
  }, [outlets]);

  const avgTicketSize = useMemo(() => {
    if (totalTodayOrders === 0) return 0;
    return (todayGrossSales / totalTodayOrders).toFixed(2);
  }, [todayGrossSales, totalTodayOrders]);

  // Hourly / Day Trend Chart Data
  const hourlyTrendData = useMemo(() => [
    { time: '08:00 AM', actual: 420, target: 350, orders: 28 },
    { time: '10:00 AM', actual: 890, target: 700, orders: 55 },
    { time: '12:00 PM', actual: 2450, target: 2100, orders: 142 },
    { time: '02:00 PM', actual: 1980, target: 1800, orders: 110 },
    { time: '04:00 PM', actual: 1150, target: 1200, orders: 68 },
    { time: '06:00 PM', actual: 2890, target: 2500, orders: 165 },
    { time: '08:00 PM', actual: 3420, target: 3000, orders: 198 },
    { time: '10:00 PM', actual: 1650, target: 1500, orders: 92 },
  ], []);

  // Multi-day Revenue Comparison Data
  const weeklyAggregatedData = useMemo(() => [
    { day: 'Mon', actual: 112400, target: 105000, orders: 5400 },
    { day: 'Tue', actual: 118900, target: 108000, orders: 5720 },
    { day: 'Wed', actual: 124500, target: 112000, orders: 5950 },
    { day: 'Thu', actual: 128000, target: 116000, orders: 6100 },
    { day: 'Fri', actual: 158200, target: 140000, orders: 7420 },
    { day: 'Sat', actual: 164500, target: 145000, orders: 7800 },
    { day: 'Sun', actual: 138000, target: 130000, orders: 6600 },
  ], []);

  // Channel Distribution Data
  const channelData = useMemo(() => [
    { name: 'Dine-In', value: 34, revenue: 285000, color: '#10b981' },
    { name: 'Takeaway', value: 38, revenue: 318000, color: '#6366f1' },
    { name: 'Delivery', value: 20, revenue: 167000, color: '#f59e0b' },
    { name: 'Drive-Thru', value: 8, revenue: 67000, color: '#ec4899' },
  ], []);

  // Daypart Mealtime Mix Data
  const daypartData = useMemo(() => [
    { daypart: 'Breakfast (8-11 AM)', sales: 64000, orders: 3200, avgTicket: 20.0 },
    { daypart: 'Lunch Rush (12-3 PM)', sales: 312000, orders: 13800, avgTicket: 22.6 },
    { daypart: 'Afternoon Tea (3-6 PM)', sales: 118000, orders: 7200, avgTicket: 16.4 },
    { daypart: 'Dinner Peak (7-10 PM)', sales: 410000, orders: 17100, avgTicket: 23.9 },
    { daypart: 'Late Night (10 PM+)', sales: 86000, orders: 3900, avgTicket: 22.0 },
  ], []);

  // Top Selling Items Catalogue
  const topSellingProducts = useMemo(() => [
    { name: 'Farmhouse Loaded Pizza', category: 'Pizza', units: 4820, revenue: 106040, growth: '+18.4%', margin: '68%' },
    { name: 'McSpicy Chicken Burger Combo', category: 'Burgers', units: 5410, revenue: 62215, growth: '+22.1%', margin: '62%' },
    { name: 'Hot & Crispy 6-Pc Bucket', category: 'Chicken', units: 3180, revenue: 69960, growth: '+14.8%', margin: '58%' },
    { name: 'Peppy Paneer Cheese Burst', category: 'Pizza', units: 2890, revenue: 69360, growth: '+9.5%', margin: '65%' },
    { name: 'Peri Peri Seasoned Fries (L)', category: 'Sides', units: 7120, revenue: 24920, growth: '+26.3%', margin: '78%' },
    { name: 'Choco Lava Cake Supreme', category: 'Desserts', units: 3940, revenue: 17730, growth: '+19.2%', margin: '74%' },
  ], []);

  // Simulator Catalog Items
  const posCatalog = [
    { name: 'Farmhouse Large Pizza', price: 22.0 },
    { name: 'Peppy Paneer Cheese Burst', price: 24.0 },
    { name: 'McSpicy Chicken Burger Meal', price: 11.5 },
    { name: 'Hot & Crispy Chicken Bucket', price: 22.0 },
    { name: 'Garlic Bread with Dip', price: 8.5 },
    { name: 'Peri Peri Fries (Large)', price: 3.5 },
    { name: 'Choco Lava Cake', price: 4.5 },
    { name: 'Iced Beverage Cooler', price: 3.0 },
  ];

  // Handle POS Order Submission
  const handleCreateSimulatedOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const targetOutlet = outlets.find((o) => o.id === simulatorOutletId) || outlets[0];
    
    // Calculate total
    const itemEntries = Object.entries(simulatorSelectedItems).filter(([_, qty]) => Number(qty) > 0);
    if (itemEntries.length === 0) {
      showToast('Please add at least 1 menu item to the POS order.');
      return;
    }

    const items: { name: string; qty: number; price: number }[] = itemEntries.map(([name, qty]) => {
      const found = posCatalog.find((c) => c.name === name);
      const price = found ? found.price : 10.0;
      return { name, qty: Number(qty), price };
    });

    const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0);
    const tax = Number((subtotal * 0.1).toFixed(2));
    const totalAmount = Number((subtotal + tax).toFixed(2));

    const newOrder: SaleRecord = {
      id: `s-sim-${Date.now()}`,
      outletId: targetOutlet.id,
      outletName: targetOutlet.name,
      orderNumber: `#POS-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: 'Just now',
      itemsCount: items.reduce((a, b) => a + b.qty, 0),
      amount: totalAmount,
      subtotal,
      tax,
      discount: 0,
      channel: simulatorChannel,
      paymentMethod: simulatorPayment,
      status: 'Completed',
      customerName: simulatorCustomer || 'Walk-in Guest',
      tableOrCarNo: simulatorChannel === 'Dine-In' ? 'Table #04' : simulatorChannel === 'Drive-Thru' ? 'Drive-Thru Lane 1' : 'Express Pickup',
      prepTimeMinutes: Math.floor(Math.random() * 8) + 4,
      items,
    };

    setLocalSales((prev) => [newOrder, ...prev]);
    if (onAddNewSale) onAddNewSale(newOrder);

    setShowPosSimulator(false);
    showToast(`Order ${newOrder.orderNumber} successfully processed at ${targetOutlet.name}! (₹${totalAmount})`);
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = 'Order Number,Outlet Name,Timestamp,Channel,Payment Method,Items Count,Amount,Status\n';
    const rows = filteredSales
      .map((s) => `"${s.orderNumber}","${s.outletName}","${s.timestamp}","${s.channel}","${s.paymentMethod}",${s.itemsCount},${s.amount},"${s.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `franchise_sales_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sales transaction ledger exported to CSV successfully.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SALES MODULE VIEW SWITCHER BAR */}
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
            <span>Sales Dashboard</span>
          </button>

          <button
            onClick={() => {
              setViewMode('transactions');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === 'transactions'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Receipt className="w-4 h-4 text-indigo-400" />
            <span>Transactions & POS Insights</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setShowPosSimulator(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate POS Order</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {viewMode === 'dashboard' ? (
        <SalesDashboard
          sales={localSales}
          outlets={outlets}
          onSelectOrder={(order) => setSelectedOrder(order)}
        />
      ) : (
        <>
      {/* Main Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Live Sales & Revenue Intelligence
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live POS Stream Active
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1.5 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <span>Transaction & Revenue Analytics Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-franchise POS ledger, hourly revenue pacing, basket ticket dynamics & channel performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowPosSimulator(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate POS Order</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export Ledger (.CSV)</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Today's Live Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Today's Gross Sales</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">₹{todayGrossSales.toLocaleString()}</span>
            <span className="text-emerald-700 text-xs font-extrabold flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +14.8%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '78%' }} />
          </div>
          <p className="text-[10px] text-slate-400 font-medium">78% of today's target pacing achieved</p>
        </div>

        {/* Metric 2: Today's Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Today's Transactions</span>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{totalTodayOrders.toLocaleString()}</span>
            <span className="text-indigo-700 text-xs font-extrabold flex items-center gap-0.5 bg-indigo-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +18.2%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '84%' }} />
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Avg fulfillment time: 3.4 mins / ticket</p>
        </div>

        {/* Metric 3: Average Order Value (AOV) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Average Ticket (AOV)</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">₹{avgTicketSize}</span>
            <span className="text-amber-800 text-xs font-extrabold flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +₹2.40
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '92%' }} />
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Avg items/order: 2.8 items (Combo boost)</p>
        </div>

        {/* Metric 4: Monthly Revenue Run-rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Monthly Run-Rate (MTD)</span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">₹{(totalRevenue / 1000).toFixed(0)}k</span>
            <span className="text-emerald-700 text-xs font-extrabold flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              On Track
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }} />
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Network Target: ₹940,000 / month</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('transactions')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeSubTab === 'transactions'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
            <span>1. Live POS Orders ({filteredSales.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('trends')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeSubTab === 'trends'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>2. Revenue Pacing & Target Trends</span>
          </button>

          <button
            onClick={() => setActiveSubTab('channels')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeSubTab === 'channels'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Channel & Daypart Matrix</span>
          </button>

          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeSubTab === 'products'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-rose-400" />
            <span>4. Product Mix & Velocity</span>
          </button>

          <button
            onClick={() => setActiveSubTab('leaderboard')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeSubTab === 'leaderboard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>5. Store Leaderboard</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE TRANSACTIONS & FILTERABLE POS LEDGER */}
      {activeSubTab === 'transactions' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search order #, store, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Outlet Filter */}
              <select
                value={selectedOutletFilter}
                onChange={(e) => setSelectedOutletFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">All Outlets ({outlets.length})</option>
                {outlets.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>

              {/* Channel Filter */}
              <select
                value={selectedChannelFilter}
                onChange={(e) => setSelectedChannelFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">All Channels</option>
                <option value="Dine-In">Dine-In</option>
                <option value="Takeaway">Takeaway</option>
                <option value="Delivery">Delivery</option>
                <option value="Drive-Thru">Drive-Thru</option>
              </select>

              {/* Payment Filter */}
              <select
                value={selectedPaymentFilter}
                onChange={(e) => setSelectedPaymentFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">All Payments</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Mobile Wallet">Mobile Wallet</option>
                <option value="Cash">Cash</option>
                <option value="UPI / QR Code">UPI / QR Code</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Refunded">Refunded</option>
              </select>

              {(selectedOutletFilter !== 'all' || selectedChannelFilter !== 'all' || selectedPaymentFilter !== 'all' || selectedStatusFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedOutletFilter('all');
                    setSelectedChannelFilter('all');
                    setSelectedPaymentFilter('all');
                    setSelectedStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>Live Transaction Ledger</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-500">
                Showing {filteredSales.length} of {localSales.length} orders
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Order ID</th>
                    <th className="p-3.5">Outlet Store</th>
                    <th className="p-3.5">Customer / Target</th>
                    <th className="p-3.5">Channel</th>
                    <th className="p-3.5">Payment</th>
                    <th className="p-3.5">Items</th>
                    <th className="p-3.5 text-right">Amount</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredSales.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedOrder(s)}
                      className="hover:bg-slate-50/90 transition-colors cursor-pointer"
                    >
                      <td className="p-3.5">
                        <span className="font-extrabold text-emerald-700 font-mono text-xs">{s.orderNumber}</span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{s.timestamp}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-extrabold text-slate-900 block">{s.outletName}</span>
                        <span className="text-[10px] text-slate-400">{s.tableOrCarNo || 'Standard Counter'}</span>
                      </td>

                      <td className="p-3.5 text-slate-600">
                        <span className="font-bold text-slate-800 block">{s.customerName || 'Walk-in Guest'}</span>
                        <span className="text-[10px] text-slate-400">Prep time: {s.prepTimeMinutes || 6} mins</span>
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-xl font-extrabold text-[10px] inline-flex items-center gap-1 ${
                          s.channel === 'Dine-In'
                            ? 'bg-emerald-50 text-emerald-800'
                            : s.channel === 'Delivery'
                            ? 'bg-amber-50 text-amber-800'
                            : s.channel === 'Drive-Thru'
                            ? 'bg-purple-50 text-purple-800'
                            : 'bg-indigo-50 text-indigo-800'
                        }`}>
                          {s.channel === 'Dine-In' && <Utensils className="w-3 h-3" />}
                          {s.channel === 'Delivery' && <Truck className="w-3 h-3" />}
                          {s.channel === 'Drive-Thru' && <Car className="w-3 h-3" />}
                          {s.channel === 'Takeaway' && <ShoppingBag className="w-3 h-3" />}
                          {s.channel}
                        </span>
                      </td>

                      <td className="p-3.5 text-slate-600 font-medium">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-semibold">{s.paymentMethod}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-extrabold text-slate-900">{s.itemsCount} items</span>
                      </td>

                      <td className="p-3.5 text-right font-black text-slate-900 text-sm">
                        ₹{s.amount.toFixed(2)}
                      </td>

                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          s.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-900'
                            : s.status === 'Processing'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}>
                          {s.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(s);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REVENUE PACING & TARGET TRENDS */}
      {activeSubTab === 'trends' && (
        <div className="space-y-6">
          {/* Hourly Pacing Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Today's Real-Time Hourly Sales Pace vs Target (₹)</span>
                </h3>
                <p className="text-xs text-slate-500">Live hourly telemetry tracking rush peaks across all network POS lanes</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-3 h-3 bg-emerald-500 rounded-sm" /> Actual Sales
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-3 h-3 bg-slate-300 rounded-sm" /> Target Baseline
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyTrendData}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                  />
                  <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" name="Actual Revenue (₹)" />
                  <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} name="Target Goal (₹)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Aggregated Trend */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Day-of-Week Revenue Performance vs Target Budget</span>
                </h3>
                <p className="text-xs text-slate-500">Aggregated revenue generation across Monday - Sunday cycles</p>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAggregatedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="actual" fill="#6366f1" name="Actual Revenue (₹)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="target" fill="#cbd5e1" name="Budget Target (₹)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CHANNELS & DAYPART MATRIX */}
      {activeSubTab === 'channels' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Channel Share Donut / Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-emerald-600" />
                <span>Sales Fulfillment Channel Breakdown</span>
              </h3>
              <p className="text-xs text-slate-500">Distribution of revenue volume across Takeaway, Dine-In, Delivery & Drive-Thru</p>
            </div>

            <div className="space-y-3">
              {channelData.map((ch) => (
                <div key={ch.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-extrabold">
                    <span className="text-slate-800 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ch.color }} />
                      {ch.name}
                    </span>
                    <span className="text-slate-900 font-black">₹{ch.revenue.toLocaleString()} ({ch.value}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${ch.value}%`, backgroundColor: ch.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daypart Mealtime Analysis */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Daypart Meal Shift Sales Velocity</span>
              </h3>
              <p className="text-xs text-slate-500">Revenue generation dynamics sorted by operational meal slots</p>
            </div>

            <div className="space-y-3">
              {daypartData.map((dp) => (
                <div key={dp.daypart} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-900 text-xs block">{dp.daypart}</span>
                    <span className="text-[11px] text-slate-500">{dp.orders.toLocaleString()} orders • AOV ₹{dp.avgTicket}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-700 text-sm">₹{dp.sales.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCTS & VELOCITY */}
      {activeSubTab === 'products' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>Top Selling Menu Items & Category Mix</span>
              </h3>
              <p className="text-xs text-slate-500">High velocity SKU volume, total revenue yield, and profit margins</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Menu Item Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Units Sold</th>
                  <th className="p-3.5">Gross Revenue</th>
                  <th className="p-3.5">Gross Margin</th>
                  <th className="p-3.5">Growth Velocity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {topSellingProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="p-3.5 font-extrabold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                        {idx + 1}
                      </span>
                      {p.name}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700 text-[10px]">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">{p.units.toLocaleString()} units</td>
                    <td className="p-3.5 font-black text-slate-900">₹{p.revenue.toLocaleString()}</td>
                    <td className="p-3.5 font-extrabold text-emerald-700">{p.margin}</td>
                    <td className="p-3.5">
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                        {p.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: STORE LEADERBOARD */}
      {activeSubTab === 'leaderboard' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Franchise Store Sales Revenue Leaderboard</span>
            </h3>
            <p className="text-xs text-slate-500">Live store ranking sorted by monthly gross revenue and growth momentum</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Rank & Store</th>
                  <th className="p-3.5">City & Region</th>
                  <th className="p-3.5">Today Sales</th>
                  <th className="p-3.5">Monthly Revenue</th>
                  <th className="p-3.5">Target Pacing</th>
                  <th className="p-3.5">Avg Ticket</th>
                  <th className="p-3.5">Health Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {[...outlets]
                  .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
                  .map((outlet, idx) => (
                    <tr key={outlet.id} className="hover:bg-slate-50/80">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                            idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-slate-300 text-slate-900' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-extrabold text-slate-900 block">{outlet.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{outlet.code}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 text-slate-600">
                        <span className="font-bold text-slate-800 block">{outlet.city}</span>
                        <span className="text-[10px] text-slate-400">{outlet.region} Region</span>
                      </td>

                      <td className="p-3.5 font-bold text-slate-900">₹{outlet.todaySales.toLocaleString()}</td>

                      <td className="p-3.5 font-black text-slate-900 text-sm">
                        ₹{outlet.monthlyRevenue.toLocaleString()}
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600">
                            {Math.round((outlet.monthlyRevenue / outlet.monthlyTarget) * 100)}% of target
                          </span>
                          <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                outlet.monthlyRevenue >= outlet.monthlyTarget ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${outlet.monthlyTarget > 0 ? Math.min(100, Math.round(((outlet.monthlyRevenue || 0) / outlet.monthlyTarget) * 100)) : 0}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 font-extrabold text-slate-800">₹{outlet.avgTicketSize}</td>

                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          outlet.healthGrade === 'A+' || outlet.healthGrade === 'A'
                            ? 'bg-emerald-100 text-emerald-900'
                            : outlet.healthGrade.startsWith('B')
                            ? 'bg-indigo-100 text-indigo-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}>
                          Grade {outlet.healthGrade}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </>
      )}

      {/* ORDER RECEIPT MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Receipt Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-extrabold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                  Official POS Tax Invoice
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedOrder.orderNumber}</h3>
                <p className="text-xs text-slate-500">{selectedOrder.outletName}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Metadata */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] block">Customer / Desk</span>
                <strong className="text-slate-800">{selectedOrder.customerName || 'Walk-in Guest'}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Table / Channel</span>
                <strong className="text-slate-800">{selectedOrder.channel} • {selectedOrder.tableOrCarNo || 'Counter'}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Timestamp</span>
                <span className="text-slate-700 font-semibold">{selectedOrder.timestamp}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Payment Method</span>
                <span className="text-slate-700 font-semibold">{selectedOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-900 block">Ordered Items</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {(selectedOrder.items && selectedOrder.items.length > 0
                  ? selectedOrder.items
                  : [
                      { name: 'Standard Franchise Menu Combo Meal', qty: selectedOrder.itemsCount, price: selectedOrder.amount / selectedOrder.itemsCount }
                    ]
                ).map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-slate-100">
                    <span className="text-slate-700 font-medium">
                      <strong className="text-slate-900">{it.qty}x</strong> {it.name}
                    </span>
                    <span className="font-extrabold text-slate-900">₹{(it.price * it.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtotal & Totals */}
            <div className="space-y-1 text-xs border-t border-slate-200 pt-3">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹{(selectedOrder.subtotal || selectedOrder.amount * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated Tax (GST 10%)</span>
                <span>₹{(selectedOrder.tax || selectedOrder.amount * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Amount Paid</span>
                <span className="text-emerald-700">₹{selectedOrder.amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  showToast(`Invoice for ${selectedOrder.orderNumber} sent to printer.`);
                  setSelectedOrder(null);
                }}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print POS Receipt</span>
              </button>

              <button
                onClick={() => {
                  showToast(`Order ${selectedOrder.orderNumber} re-order queued.`);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Re-Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS ORDER SIMULATOR MODAL */}
      {showPosSimulator && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-extrabold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                  Live POS Simulator
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Dispatch Simulated POS Transaction</h3>
                <p className="text-xs text-slate-500">Inject an order in real-time into the franchise sales telemetry stream.</p>
              </div>
              <button
                onClick={() => setShowPosSimulator(false)}
                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSimulatedOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Target Outlet</label>
                  <select
                    value={simulatorOutletId}
                    onChange={(e) => setSimulatorOutletId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    {outlets.map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Fulfillment Channel</label>
                  <select
                    value={simulatorChannel}
                    onChange={(e) => setSimulatorChannel(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Dine-In">Dine-In</option>
                    <option value="Takeaway">Takeaway</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Drive-Thru">Drive-Thru</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={simulatorPayment}
                    onChange={(e) => setSimulatorPayment(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Mobile Wallet">Mobile Wallet</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI / QR Code">UPI / QR Code</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={simulatorCustomer}
                    onChange={(e) => setSimulatorCustomer(e.target.value)}
                    placeholder="Guest Name"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Menu Item Selector */}
              <div className="space-y-2">
                <label className="font-extrabold text-slate-700 block">Select Menu Items</label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {posCatalog.map((item) => {
                    const qty = simulatorSelectedItems[item.name] || 0;
                    return (
                      <div key={item.name} className="flex justify-between items-center p-2 bg-white rounded-xl border border-slate-200">
                        <div>
                          <span className="font-bold text-slate-800 block text-xs">{item.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">₹{item.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSimulatorSelectedItems((prev) => ({
                                ...prev,
                                [item.name]: Math.max(0, (prev[item.name] || 0) - 1),
                              }));
                            }}
                            className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-black flex items-center justify-center hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-xs w-4 text-center">{qty}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSimulatorSelectedItems((prev) => ({
                                ...prev,
                                [item.name]: (prev[item.name] || 0) + 1,
                              }));
                            }}
                            className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center hover:bg-emerald-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Estimated Order Total</span>
                  <span className="text-xl font-black text-emerald-400">
                    ₹
                    {(
                      Object.entries(simulatorSelectedItems).reduce((acc, [name, qty]) => {
                        const it = posCatalog.find((c) => c.name === name);
                        return acc + (it ? it.price * Number(qty) : 0);
                      }, 0) * 1.1
                    ).toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Dispatch Order to Feed</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
