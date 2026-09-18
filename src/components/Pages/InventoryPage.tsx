import React, { useState, useMemo } from 'react';
import { InventoryItem } from '../../types';
import { InventoryDashboard } from '../Inventory/InventoryDashboard';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Truck,
  FileText,
  Clock,
  TrendingDown,
  DollarSign,
  IndianRupee,
  Layers,
  Building2,
  Calendar,
  Zap,
  Printer,
  Download,
  X,
  Check,
  AlertCircle,
  ShieldCheck,
  Thermometer,
  Trash2,
  ChevronRight,
  Sparkles,
  BarChart3,
  PieChart as PieIcon,
  Sliders,
  ArrowUpRight,
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

interface InventoryPageProps {
  inventory: InventoryItem[];
}

export const InventoryPage: React.FC<InventoryPageProps> = ({ inventory: initialInventory }) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'catalog'>('dashboard');
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>(initialInventory);
  const [activeTab, setActiveTab] = useState<'inventory' | 'reorder' | 'distributors' | 'wastage'>('inventory');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modal States
  const [isAddSkuModalOpen, setIsAddSkuModalOpen] = useState(false);
  const [selectedItemForRestock, setSelectedItemForRestock] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(20);
  const [restockReason, setRestockReason] = useState<string>('Vendor Shipment Received');

  // PO Generator Modal State
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [poSupplier, setPoSupplier] = useState('Delhi Cold Chain Logistics');
  const [poUrgency, setPoUrgency] = useState<'Standard 3-Day' | 'Express 24-Hour'>('Standard 3-Day');
  const [poGeneratedToast, setPoGeneratedToast] = useState<string | null>(null);

  // New SKU Form state
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'Raw Ingredients' | 'Packaging' | 'Beverages' | 'Equipment'>('Raw Ingredients');
  const [newStock, setNewStock] = useState(50);
  const [newUnit, setNewUnit] = useState('Boxes');
  const [newReorderPoint, setNewReorderPoint] = useState(20);
  const [newUnitPrice, setNewUnitPrice] = useState(1500);

  // Wastage logs state
  const [wastageLogs, setWastageLogs] = useState([
    { id: 'w-1', sku: 'SKU-MCD-MIX', item: 'McFlurry Dairy Ice Cream Mix Bags', qty: 2, unit: 'Bags', reason: 'Dispenser Temperature Spike', date: '2026-08-01', cost: 5600 },
    { id: 'w-2', sku: 'SKU-KFC-CHICK', item: 'KFC Fresh Chicken Drumsticks', qty: 1, unit: 'Crates', reason: 'Packaging Seal Leakage', date: '2026-07-28', cost: 7600 },
  ]);
  const [isLogWastageOpen, setIsLogWastageOpen] = useState(false);
  const [wastageItemSku, setWastageItemSku] = useState(initialInventory[0]?.sku || '');
  const [wastageQty, setWastageQty] = useState(1);
  const [wastageReason, setWastageReason] = useState('Expired / Damaged');

  // Toast helper
  const showToast = (msg: string) => {
    setPoGeneratedToast(msg);
    setTimeout(() => setPoGeneratedToast(null), 4000);
  };

  // Filtered inventory items
  const filteredInventory = inventoryList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Reorder items list (Low Stock or Reorder Needed)
  const reorderItems = inventoryList.filter(
    (item) => item.status === 'Reorder Needed' || item.status === 'Low Stock' || item.totalStock <= item.reorderPoint
  );

  // Stats calculations
  const totalValuation = inventoryList.reduce((sum, item) => sum + item.totalStock * item.unitPrice, 0);
  const lowStockCount = inventoryList.filter((item) => item.status === 'Low Stock' || item.status === 'Reorder Needed').length;
  const inStockCount = inventoryList.filter((item) => item.status === 'In Stock').length;

  // Handle Add New SKU
  const handleCreateSku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const skuCode = newSku.trim() ? newSku.toUpperCase() : `SKU-GEN-${Math.floor(100 + Math.random() * 900)}`;
    const statusVal: 'In Stock' | 'Low Stock' | 'Reorder Needed' =
      newStock <= 0 ? 'Reorder Needed' : newStock <= newReorderPoint ? 'Low Stock' : 'In Stock';

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      sku: skuCode,
      name: newName,
      category: newCategory,
      totalStock: Number(newStock),
      unit: newUnit,
      reorderPoint: Number(newReorderPoint),
      unitPrice: Number(newUnitPrice),
      status: statusVal,
      affectedOutletsCount: 12,
      supplierName: 'National Bakery & Supply Co.',
      leadTimeDays: 2,
      lastRestocked: new Date().toISOString().split('T')[0],
    };

    setInventoryList((prev) => [newItem, ...prev]);
    setIsAddSkuModalOpen(false);
    setNewName('');
    setNewSku('');
    showToast(`New SKU "${newItem.sku}" created successfully!`);
  };

  // Handle Restock Item
  const handleApplyRestock = () => {
    if (!selectedItemForRestock) return;

    setInventoryList((prev) =>
      prev.map((item) => {
        if (item.id === selectedItemForRestock.id) {
          const updatedStock = item.totalStock + Number(restockAmount);
          const newStatus: 'In Stock' | 'Low Stock' | 'Reorder Needed' =
            updatedStock > item.reorderPoint ? 'In Stock' : updatedStock > 0 ? 'Low Stock' : 'Reorder Needed';
          return {
            ...item,
            totalStock: updatedStock,
            status: newStatus,
            lastRestocked: new Date().toISOString().split('T')[0],
          };
        }
        return item;
      })
    );

    showToast(`Restocked +${restockAmount} ${selectedItemForRestock.unit} to ${selectedItemForRestock.sku}!`);
    setSelectedItemForRestock(null);
  };

  // Handle Log Wastage
  const handleLogWastage = (e: React.FormEvent) => {
    e.preventDefault();
    const targetItem = inventoryList.find((i) => i.sku === wastageItemSku);
    if (!targetItem) return;

    const wastageCost = targetItem.unitPrice * wastageQty;
    const newLog = {
      id: `w-${Date.now()}`,
      sku: targetItem.sku,
      item: targetItem.name,
      qty: wastageQty,
      unit: targetItem.unit,
      reason: wastageReason,
      date: new Date().toISOString().split('T')[0],
      cost: wastageCost,
    };

    setWastageLogs((prev) => [newLog, ...prev]);

    // Deduct stock
    setInventoryList((prev) =>
      prev.map((i) => {
        if (i.sku === targetItem.sku) {
          const newStockVal = Math.max(0, i.totalStock - wastageQty);
          return {
            ...i,
            totalStock: newStockVal,
            status: newStockVal <= 0 ? 'Reorder Needed' : newStockVal <= i.reorderPoint ? 'Low Stock' : 'In Stock',
          };
        }
        return i;
      })
    );

    setIsLogWastageOpen(false);
    showToast(`Logged wastage of ${wastageQty} ${targetItem.unit} for ${targetItem.sku}.`);
  };

  // Suppliers Data
  const suppliers = [
    {
      id: 'sup-1',
      name: 'Delhi Cold Chain Logistics',
      category: 'Perishables & Cold Chain',
      rating: 4.9,
      leadTime: '24-48 Hours',
      contact: '+91 98110 44321',
      email: 'orders@delhicoldchain.com',
      fulfilledOrders: 1420,
      onTimeRate: '98.5%',
    },
    {
      id: 'sup-2',
      name: 'National Bakery & Packaging Supply',
      category: 'Boxes, Cups & Paper Supplies',
      rating: 4.8,
      leadTime: '3 Days',
      contact: '+91 98450 12890',
      email: 'supply@nationalbakery.in',
      fulfilledOrders: 980,
      onTimeRate: '97.2%',
    },
    {
      id: 'sup-3',
      name: 'Hindustan Dairy & Beverage Hub',
      category: 'Dairy, Soft Serve Mix & Beverages',
      rating: 4.7,
      leadTime: '24 Hours',
      contact: '+91 97112 99001',
      email: 'sales@hindustandairy.co.in',
      fulfilledOrders: 2150,
      onTimeRate: '99.1%',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* TOAST NOTIFICATION */}
      {poGeneratedToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold">{poGeneratedToast}</p>
        </div>
      )}

      {/* INVENTORY MODULE VIEW SWITCHER BAR */}
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
            <span>Inventory Dashboard</span>
          </button>

          <button
            onClick={() => {
              setViewMode('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === 'catalog'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Package className="w-4 h-4 text-indigo-400" />
            <span>Stock Catalog & Reorders</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsPoModalOpen(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-slate-200 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Create PO</span>
          </button>
          <button
            onClick={() => setIsAddSkuModalOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add SKU</span>
          </button>
        </div>
      </div>

      {viewMode === 'dashboard' ? (
        <InventoryDashboard
          inventory={inventoryList}
          onRestock={(item) => setSelectedItemForRestock(item)}
          onAddNewSku={() => setIsAddSkuModalOpen(true)}
          onGeneratePo={() => setIsPoModalOpen(true)}
          onLogWastage={() => setIsLogWastageOpen(true)}
        />
      ) : (
        <>
      {/* HEADER BANNER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supply Chain & Multi-Outlet Inventory Control</span>
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
            Franchise Inventory & Stock Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor raw ingredients, packaging & equipment across all outlets, execute automated purchase orders, and reduce wastage.
          </p>
        </div>

        {/* QUICK ACTION BUTTONS */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsPoModalOpen(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all border border-slate-200 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Generate Purchase Order</span>
          </button>
          <button
            onClick={() => setIsAddSkuModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New SKU</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Total Stock Value</span>
            <IndianRupee className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">₹{totalValuation.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-slate-500 font-medium">Across {inventoryList.length} monitored SKUs</p>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold">Healthy Stock SKUs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-950">{inStockCount} SKUs</p>
          <p className="text-[11px] text-emerald-700 font-medium">Stock above safety reorder points</p>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-900">
            <span className="text-xs font-bold">Low / Reorder Needed</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-950">{lowStockCount} SKUs</p>
          <p className="text-[11px] text-amber-800 font-medium">Action required to prevent stockout</p>
        </div>

        <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-900">
            <span className="text-xs font-bold">Supply Chain Lead Time</span>
            <Truck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-950">1.8 Days Avg</p>
          <p className="text-[11px] text-indigo-700 font-medium">3 Preferred Franchise Vendors</p>
        </div>
      </div>

      {/* KPI ANALYTICAL CHARTS DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Stock Level vs Safety Reorder Point Thresholds */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">
                  SKU Inventory Levels vs Safety Thresholds
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Current stock on hand benchmarked against minimum reorder points
              </p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold rounded">
              Buffer Safety
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={inventoryList.slice(0, 8).map((item) => ({
                  name: item.sku.replace('SKU-', ''),
                  fullName: item.name,
                  stock: item.totalStock,
                  reorder: item.reorderPoint,
                  price: item.unitPrice,
                }))}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-xl">
                          <p className="font-black text-emerald-400">{d.fullName}</p>
                          <p className="text-slate-300">Stock on Hand: <strong className="text-white">{d.stock} Units</strong></p>
                          <p className="text-slate-300">Safety Buffer: <strong className="text-amber-400">{d.reorder} Units</strong></p>
                          <p className="text-slate-300">Unit Cost: <strong className="text-white">₹{d.price.toLocaleString()}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="stock" name="Current Stock" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reorder" name="Safety Reorder Threshold" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Current Stock</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Minimum Reorder Point</span>
            <span className="font-bold text-slate-700">{lowStockCount} Low Buffer Alerts</span>
          </div>
        </div>

        {/* Chart 2: Inventory Category Valuation Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Category Valuation Share
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Capital tied up across inventory verticals
              </p>
            </div>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[10px] font-mono font-bold rounded">
              Valuation
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Raw Ingredients', value: inventoryList.filter((i) => i.category === 'Raw Ingredients').reduce((s, i) => s + i.totalStock * i.unitPrice, 0) },
                    { name: 'Packaging', value: inventoryList.filter((i) => i.category === 'Packaging').reduce((s, i) => s + i.totalStock * i.unitPrice, 0) },
                    { name: 'Beverages', value: inventoryList.filter((i) => i.category === 'Beverages').reduce((s, i) => s + i.totalStock * i.unitPrice, 0) },
                    { name: 'Equipment', value: inventoryList.filter((i) => i.category === 'Equipment').reduce((s, i) => s + i.totalStock * i.unitPrice, 0) },
                  ].filter((c) => c.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {['#10b981', '#6366f1', '#f59e0b', '#ec4899'].map((c, i) => (
                    <Cell key={`cat-cell-${i}`} fill={c} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`₹${(val / 1000).toFixed(1)}k`, 'Valuation']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Healthy: {inStockCount} SKUs</span>
            <span className="font-bold text-emerald-600">₹{(totalValuation / 100000).toFixed(2)}L Value</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between overflow-x-auto custom-scrollbar gap-1">
        <div className="flex items-center gap-1 min-w-max">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>1. Stock Inventory Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('reorder')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'reorder'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-amber-600" />
            <span>2. Auto Reorders & PO Generator ({reorderItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('distributors')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'distributors'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>3. Distributors & Supply Partners</span>
          </button>

          <button
            onClick={() => setActiveTab('wastage')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'wastage'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>4. Stock Wastage & Expiry Control</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU code or ingredient name (e.g., Dough, Cheese, Cups...)"
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
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Reorder Needed">Reorder Needed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Raw Ingredients">Raw Ingredients</option>
              <option value="Packaging">Packaging</option>
              <option value="Beverages">Beverages</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>
        </div>
      </div>

      {/* TAB 1: STOCK INVENTORY MATRIX */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Live Multi-Outlet Ingredient & Packaging Inventory</span>
              </h3>
              <p className="text-xs text-slate-500">
                Current stock balances, reorder points, and outlet coverage.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Showing {filteredInventory.length} of {inventoryList.length} items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">SKU & Item Details</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Stock Level vs Threshold</th>
                  <th className="p-3.5 text-right">Unit Price</th>
                  <th className="p-3.5 text-right">Total Value</th>
                  <th className="p-3.5">Outlet Reach</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.map((item) => {
                  const stockPercent = Math.min(100, Math.round((item.totalStock / (item.reorderPoint * 2.5 || 1)) * 100));
                  const itemValuation = item.totalStock * item.unitPrice;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono font-bold text-[10px] rounded border border-slate-200 inline-block">
                            {item.sku}
                          </span>
                          <p className="font-extrabold text-slate-900 text-xs mt-1">{item.name}</p>
                          <p className="text-[10px] text-slate-400">
                            Supplier: {item.supplierName || 'National Bakery Supply'}
                          </p>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg">
                          {item.category}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-1 min-w-[140px]">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-slate-900">
                              {item.totalStock} {item.unit}
                            </span>
                            <span className="text-slate-400">Min: {item.reorderPoint}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                item.status === 'In Stock'
                                  ? 'bg-emerald-500'
                                  : item.status === 'Low Stock'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.max(8, stockPercent)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 text-right font-bold text-slate-800">
                        ₹{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-3.5 text-right font-black text-slate-900">
                        ₹{itemValuation.toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[11px] rounded border border-indigo-100">
                          {item.affectedOutletsCount} Outlets
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] inline-block ${
                            item.status === 'In Stock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Low Stock'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800 animate-pulse'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedItemForRestock(item);
                              setRestockAmount(item.reorderPoint);
                            }}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-bold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Restock</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredInventory.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No inventory items match the selected filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AUTOMATED REORDERS & PO GENERATOR */}
      {activeTab === 'reorder' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-extrabold text-[10px] rounded-full uppercase">
                  Automated Reorder Engine
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-amber-600" />
                  <span>Items Below Safety Reorder Threshold</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {reorderItems.length} items flagged for replenishment to avoid store stockouts.
                </p>
              </div>

              <button
                onClick={() => setIsPoModalOpen(true)}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Official PO Now</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reorderItems.map((item) => (
                <div key={item.id} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-[10px] text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        {item.sku}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm mt-1">{item.name}</h4>
                    </div>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold text-[10px] rounded-full">
                      {item.status}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200/60 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Stock:</span>
                      <span className="font-black text-slate-900">
                        {item.totalStock} {item.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reorder Threshold:</span>
                      <span className="font-bold text-slate-700">
                        {item.reorderPoint} {item.unit}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-1.5 font-bold">
                      <span className="text-amber-900">Recommended Order:</span>
                      <span className="text-emerald-700 font-black">
                        +{item.reorderPoint * 2} {item.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-500">Est. Cost: ₹{(item.reorderPoint * 2 * item.unitPrice).toLocaleString('en-IN')}</span>
                    <button
                      onClick={() => {
                        setSelectedItemForRestock(item);
                        setRestockAmount(item.reorderPoint * 2);
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-extrabold text-[11px] cursor-pointer"
                    >
                      Instant Restock
                    </button>
                  </div>
                </div>
              ))}

              {reorderItems.length === 0 && (
                <div className="col-span-full p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-extrabold text-slate-800 text-sm">All Stock Levels are Healthy!</p>
                  <p className="text-xs text-slate-500">No SKUs are currently below safety reorder points.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DISTRIBUTORS & SUPPLY CHAIN PARTNERS */}
      {activeTab === 'distributors' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                <span>Verified Franchise Supply Chain & Logistics Partners</span>
              </h3>
              <p className="text-xs text-slate-500">
                Direct vendor profiles, lead times, contact details, and SLA performance ratings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {suppliers.map((sup) => (
                <div key={sup.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 uppercase">
                        {sup.category}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm mt-1.5">{sup.name}</h4>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                      ⭐ {sup.rating}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Lead Time:</span>
                      <span className="font-bold text-slate-800">{sup.leadTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">On-Time SLA:</span>
                      <span className="font-extrabold text-emerald-700">{sup.onTimeRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Orders Fulfilled:</span>
                      <span className="font-bold text-slate-800">{sup.fulfilledOrders.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-slate-800">Contact Vendor:</p>
                    <p className="text-slate-600">{sup.contact}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{sup.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setPoSupplier(sup.name);
                      setIsPoModalOpen(true);
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Create PO for {sup.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STOCK WASTAGE & EXPIRY CONTROL */}
      {activeTab === 'wastage' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-rose-600" />
                  <span>Stock Spoilage & Wastage Log</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Track ingredient expiry, temperature compliance failures, and damaged packaging logs.
                </p>
              </div>

              <button
                onClick={() => setIsLogWastageOpen(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log Spoilage / Wastage</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">SKU & Item Name</th>
                    <th className="p-3.5">Quantity Wasted</th>
                    <th className="p-3.5">Reason</th>
                    <th className="p-3.5">Log Date</th>
                    <th className="p-3.5 text-right">Financial Loss (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {wastageLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3.5">
                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {log.sku}
                        </span>
                        <p className="font-bold text-slate-900 mt-0.5">{log.item}</p>
                      </td>
                      <td className="p-3.5 font-extrabold text-rose-700">
                        {log.qty} {log.unit}
                      </td>
                      <td className="p-3.5 text-slate-600">{log.reason}</td>
                      <td className="p-3.5 text-slate-500">{log.date}</td>
                      <td className="p-3.5 text-right font-black text-rose-900">
                        ₹{log.cost.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {/* MODAL 1: ADD NEW SKU */}
      {isAddSkuModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">Add New Inventory SKU</h3>
              <button onClick={() => setIsAddSkuModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSku} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">SKU Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. SKU-DOM-SAUCE"
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tomato Pizza Sauce Premium 5L"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs"
                  >
                    <option value="Raw Ingredients">Raw Ingredients</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Boxes, Crates"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reorder Pt</label>
                  <input
                    type="number"
                    value={newReorderPoint}
                    onChange={(e) => setNewReorderPoint(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSkuModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl"
                >
                  Create SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESTOCK SKU */}
      {selectedItemForRestock && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {selectedItemForRestock.sku}
                </span>
                <h3 className="font-black text-slate-900 text-sm mt-1">{selectedItemForRestock.name}</h3>
              </div>
              <button onClick={() => setSelectedItemForRestock(null)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between font-bold">
                <span className="text-slate-500">Current Stock:</span>
                <span className="text-slate-900">
                  {selectedItemForRestock.totalStock} {selectedItemForRestock.unit}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Additional Quantity to Add ({selectedItemForRestock.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-sm text-emerald-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={restockReason}
                  onChange={(e) => setRestockReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-950 font-extrabold flex justify-between">
                <span>New Total Stock:</span>
                <span>
                  {selectedItemForRestock.totalStock + Number(restockAmount)} {selectedItemForRestock.unit}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedItemForRestock(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyRestock}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs"
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: OFFICIAL PRINTABLE PURCHASE ORDER (PO) */}
      {isPoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                  Official Purchase Order
                </span>
                <h3 className="font-black text-slate-900 text-lg mt-1">
                  PO-2026-FRANCHISE-{Math.floor(1000 + Math.random() * 9000)}
                </h3>
              </div>
              <button onClick={() => setIsPoModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Vendor Supplier</span>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5">{poSupplier}</p>
                  <p className="text-slate-500 text-[11px]">Primary Cold Chain Hub • SLA 98.5%</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Order Date & Urgency</span>
                  <p className="font-bold text-slate-900 text-xs mt-0.5">{new Date().toLocaleDateString('en-IN')}</p>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-extrabold rounded text-[10px] inline-block mt-1">
                    {poUrgency}
                  </span>
                </div>
              </div>

              {/* Items in PO */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {reorderItems.slice(0, 4).map((item) => (
                      <tr key={item.id}>
                        <td className="p-3 font-mono font-bold text-indigo-700">{item.sku}</td>
                        <td className="p-3 font-bold text-slate-900">{item.name}</td>
                        <td className="p-3 text-right font-black">{item.reorderPoint * 2} {item.unit}</td>
                        <td className="p-3 text-right">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-bold text-slate-900">
                          ₹{(item.reorderPoint * 2 * item.unitPrice).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between font-black text-sm text-emerald-950">
                <span>Estimated Grand Total (incl. 18% GST):</span>
                <span className="text-base">
                  ₹
                  {Math.round(
                    reorderItems.slice(0, 4).reduce((sum, i) => sum + i.reorderPoint * 2 * i.unitPrice, 0) * 1.18
                  ).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-100">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print PO</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPoModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsPoModalOpen(false);
                    showToast(`Purchase Order dispatched to ${poSupplier}!`);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-xs cursor-pointer"
                >
                  Dispatch PO to Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: LOG WASTAGE */}
      {isLogWastageOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm">Log Stock Spoilage / Wastage</h3>
              <button onClick={() => setIsLogWastageOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogWastage} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Item</label>
                <select
                  value={wastageItemSku}
                  onChange={(e) => setWastageItemSku(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                >
                  {inventoryList.map((i) => (
                    <option key={i.id} value={i.sku}>
                      {i.sku} - {i.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Quantity Wasted</label>
                <input
                  type="number"
                  min="1"
                  value={wastageQty}
                  onChange={(e) => setWastageQty(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-rose-800 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Spoilage</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cold Chain Temp Spike / Seal Leak"
                  value={wastageReason}
                  onChange={(e) => setWastageReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogWastageOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl"
                >
                  Log Wastage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
