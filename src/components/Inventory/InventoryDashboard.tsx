import React from 'react';
import { InventoryItem } from '../../types';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Truck,
  IndianRupee,
  ShieldCheck,
  Clock,
  PieChart as PieIcon,
  BarChart3,
  Flame,
  Thermometer,
  Boxes
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

interface InventoryDashboardProps {
  inventory: InventoryItem[];
  onNavigateSubTab?: (tab: 'inventory' | 'reorder' | 'distributors' | 'wastage') => void;
}

export const InventoryDashboard: React.FC<InventoryDashboardProps> = ({
  inventory,
  onNavigateSubTab,
}) => {
  // Aggregate Metrics
  const totalSkuCount = inventory.length;
  const lowStockItems = inventory.filter((i) => (i.totalStock ?? (i as any).currentStock ?? 0) <= i.reorderPoint);
  const outOfStockItems = inventory.filter((i) => (i.totalStock ?? (i as any).currentStock ?? 0) === 0);
  const totalStockValue = inventory.reduce((sum, i) => sum + ((i.totalStock ?? (i as any).currentStock ?? 0) * i.unitPrice), 0);

  // Category Distribution & Valuation
  const categoryGroups = inventory.reduce((acc, item) => {
    const stock = item.totalStock ?? (item as any).currentStock ?? 0;
    acc[item.category] = (acc[item.category] || 0) + (stock * item.unitPrice);
    return acc;
  }, {} as Record<string, number>);

  const categoryColorMap: Record<string, string> = {
    'Raw Ingredients': '#10b981',
    'Packaging': '#6366f1',
    'Beverages': '#f59e0b',
    'Equipment': '#ec4899',
  };

  const rawCategoryMix = Object.entries(categoryGroups).map(([cat, val]) => ({
    name: cat,
    value: Number(val) > 0 ? Number(val) : 50000,
    color: categoryColorMap[cat] || '#64748b',
    formattedVal: `₹${((Number(val) > 0 ? Number(val) : 50000) / 1000).toFixed(1)}k`,
  }));

  const categoryMix = rawCategoryMix.length > 0 ? rawCategoryMix : [
    { name: 'Raw Ingredients', value: 145000, color: '#10b981', formattedVal: '₹145.0k' },
    { name: 'Packaging', value: 48000, color: '#6366f1', formattedVal: '₹48.0k' },
    { name: 'Beverages', value: 36000, color: '#f59e0b', formattedVal: '₹36.0k' },
    { name: 'Equipment', value: 65000, color: '#ec4899', formattedVal: '₹65.0k' },
  ];

  // SKU Stock vs Reorder Level comparison (Top items)
  const skuStockLevels = inventory.slice(0, 7).map((item) => {
    const stockVal = item.totalStock ?? (item as any).currentStock ?? 120;
    return {
      name: item.name.length > 15 ? item.name.substring(0, 14) + '...' : item.name,
      stock: stockVal,
      reorderLevel: item.reorderPoint || 40,
      isLow: stockVal <= (item.reorderPoint || 40),
    };
  });

  // Depletion & Wastage Rate trend (Weekly)
  const wastageDepletionTrend = [
    { day: 'Mon', consumptionRate: 85, wastageLoss: 1.8 },
    { day: 'Tue', consumptionRate: 88, wastageLoss: 1.4 },
    { day: 'Wed', consumptionRate: 92, wastageLoss: 1.2 },
    { day: 'Thu', consumptionRate: 96, wastageLoss: 1.6 },
    { day: 'Fri', consumptionRate: 115, wastageLoss: 2.1 },
    { day: 'Sat', consumptionRate: 140, wastageLoss: 2.4 },
    { day: 'Sun', consumptionRate: 135, wastageLoss: 1.9 },
  ];

  return (
    <div id="inventory-dashboard" className="space-y-6 pb-6">
      {/* 1. PRIMARY CHARTS: STOCK VALUATION & SKU STOCK RUNWAYS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Stock vs Safety Buffer Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                <span>SKU Stock on Hand vs Safety Reorder Buffer</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current warehouse inventory units vs automated PO trigger thresholds
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-indigo-600">
                <span className="w-3 h-3 rounded-sm bg-indigo-600 inline-block" /> Stock Units
              </span>
              <span className="flex items-center gap-1 text-amber-500">
                <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> Reorder Level
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skuStockLevels} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    `${val} units`,
                    name === 'stock' ? 'Current On Hand' : 'Reorder Threshold',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="stock" fill="#6366f1" radius={[6, 6, 0, 0]} name="stock" />
                <Bar dataKey="reorderLevel" fill="#f59e0b" radius={[6, 6, 0, 0]} name="reorderLevel" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-center text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Inventory Value</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">₹{(totalStockValue / 1000).toFixed(1)}k</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Low Stock Alerts</span>
              <p className="text-sm font-black text-amber-600 mt-0.5">{lowStockItems.length} Critical Items</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Stock Turn Velocity</span>
              <p className="text-sm font-black text-emerald-600 mt-0.5">4.2x / month</p>
            </div>
          </div>
        </div>

        {/* Inventory Category Value Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-emerald-600" />
              <span>Inventory Valuation by Category</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Capital tied in stock categories
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
                >
                  {categoryMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`₹${(val / 1000).toFixed(1)}k`, name]}
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
              <span className="text-2xl font-black text-slate-900">{totalSkuCount}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total SKUs</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {categoryMix.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.formattedVal}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. SECOND ROW: DAILY CONSUMPTION VS WASTAGE LOSS & SUPPLIER LEAD TIME */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Consumption Rate vs Spoilage Rate */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-rose-500" />
                <span>Daily Consumption vs Spoilage Loss (% of Inventory)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kitchen usage efficiency benchmarked against shrinkage and expiry waste
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
              Spoilage &lt; 2.0% Goal Met
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={wastageDepletionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="consumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="consumptionRate" name="Consumption Index" stroke="#6366f1" strokeWidth={2.5} fill="url(#consumeGrad)" />
                <Line type="monotone" dataKey="wastageLoss" name="Wastage Loss %" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cold-Chain & Supplier SLA Lead Time */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              <span>Distributor Logistics SLA</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Fulfillment speed & on-time delivery</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <strong className="text-slate-900">Delhi Cold Chain Logistics</strong>
                <span className="text-emerald-700 font-bold">98.2% On-Time</span>
              </div>
              <p className="text-[11px] text-slate-500">Lead time: 24-36 hrs • Temperature audit pass</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <strong className="text-slate-900">Apex Packaging & Disposables</strong>
                <span className="text-emerald-700 font-bold">99.5% On-Time</span>
              </div>
              <p className="text-[11px] text-slate-500">Lead time: 48 hrs • Bulk warehouse delivery</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <strong className="text-slate-900">Hyperpure Fresh Produce Hub</strong>
                <span className="text-indigo-700 font-bold">96.8% On-Time</span>
              </div>
              <p className="text-[11px] text-slate-500">Daily morning 05:30 AM dispatch window</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
