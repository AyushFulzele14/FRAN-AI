import React, { useState, useMemo } from 'react';
import {
  Outlet,
  FranchiseGroup,
  SaleRecord,
  InventoryItem,
  StaffMember,
  MarketingCampaign,
  AuditRecord,
  AlertItem,
  NavTab
} from '../../types';
import {
  LayoutDashboard,
  Building2,
  Store,
  IndianRupee,
  Package,
  Users,
  Megaphone,
  ClipboardCheck,
  BellRing,
  BrainCircuit,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Sliders,
  Sparkles,
  Plus,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ChevronRight,
  BarChart3,
  PieChart as PieIcon,
  Filter,
  DollarSign,
  Activity,
  Layers,
  Zap,
  Target,
  Edit3,
  X,
  Receipt
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
  ComposedChart
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface ExecutiveDashboardPageProps {
  franchises: FranchiseGroup[];
  outlets: Outlet[];
  sales: SaleRecord[];
  inventory: InventoryItem[];
  staff: StaffMember[];
  campaigns: MarketingCampaign[];
  audits: AuditRecord[];
  alerts: AlertItem[];
  onNavigateToTab: (tab: NavTab) => void;
  // State changers for reactive live data mutability
  onUpdateOutlets: React.Dispatch<React.SetStateAction<Outlet[]>>;
  onUpdateSales: React.Dispatch<React.SetStateAction<SaleRecord[]>>;
  onUpdateInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  onUpdateStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  onUpdateCampaigns: React.Dispatch<React.SetStateAction<MarketingCampaign[]>>;
  onUpdateAudits: React.Dispatch<React.SetStateAction<AuditRecord[]>>;
  onUpdateAlerts: React.Dispatch<React.SetStateAction<AlertItem[]>>;
}

export const ExecutiveDashboardPage: React.FC<ExecutiveDashboardPageProps> = ({
  franchises,
  outlets,
  sales,
  inventory,
  staff,
  campaigns,
  audits,
  alerts,
  onNavigateToTab,
  onUpdateOutlets,
  onUpdateSales,
  onUpdateInventory,
  onUpdateStaff,
  onUpdateCampaigns,
  onUpdateAudits,
  onUpdateAlerts,
}) => {
  // Brand and Time Filters
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [timeWindow, setTimeWindow] = useState<'today' | 'week' | 'month'>('today');

  // Interactive Chart Active Filtering & Block Isolation States
  const [focusedStore, setFocusedStore] = useState<string | null>(null);
  const [focusedResource, setFocusedResource] = useState<string | null>(null);
  const [focusedHealthModule, setFocusedHealthModule] = useState<string | null>(null);
  const [focusedChannel, setFocusedChannel] = useState<string | null>(null);
  const [isIsolationMode, setIsIsolationMode] = useState<boolean>(true); // When true, chart only shows the clicked block

  // Interactive Target Benchmarks (Changeable by user via sliders)
  const [dailySalesTargetPerOutlet, setDailySalesTargetPerOutlet] = useState<number>(30000);
  const [auditPassThreshold, setAuditPassThreshold] = useState<number>(85);
  const [staffDailyQuota, setStaffDailyQuota] = useState<number>(15000);
  const [targetRoiMultiplier, setTargetRoiMultiplier] = useState<number>(3.5);

  // Modals & Drawers
  const [isDataModifierOpen, setIsDataModifierOpen] = useState<boolean>(false);
  const [isTargetsModalOpen, setIsTargetsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered outlets based on selected brand
  const filteredOutlets = useMemo(() => {
    if (selectedBrand === 'all') return outlets;
    return outlets.filter((o) => o.name.toLowerCase().includes(selectedBrand.toLowerCase()));
  }, [outlets, selectedBrand]);

  const filteredOutletIds = useMemo(() => new Set(filteredOutlets.map((o) => o.id)), [filteredOutlets]);

  // Time Window Multiplier & Labels
  const timeMultiplier = timeWindow === 'today' ? 1 : timeWindow === 'week' ? 7 : 30;
  const timePeriodName = timeWindow === 'today' ? 'Daily' : timeWindow === 'week' ? 'Weekly' : 'Monthly';
  const timePeriodLabel = timeWindow === 'today' ? 'Today' : timeWindow === 'week' ? 'This Week' : 'This Month';

  // Derived Calculations across all 8 modules
  // 1. Outlets Module KPIs
  const totalOutletsCount = filteredOutlets.length;
  const underperformingCount = filteredOutlets.filter((o) => o.isUnderperforming).length;
  const healthyOutletsCount = totalOutletsCount - underperformingCount;
  const avgHealthScore = totalOutletsCount > 0 
    ? Math.round(filteredOutlets.reduce((acc, o) => acc + (o.isUnderperforming ? 68 : 94), 0) / totalOutletsCount)
    : 90;

  // 2. Sales Module KPIs (Period Scaled)
  const currentPeriodSales = useMemo(() => {
    if (timeWindow === 'today') {
      return filteredOutlets.reduce((sum, o) => sum + (o.todaySales || 0), 0);
    } else if (timeWindow === 'week') {
      return filteredOutlets.reduce((sum, o) => sum + (o.todaySales || 0) * 7, 0);
    } else {
      return filteredOutlets.reduce((sum, o) => sum + (o.monthlyRevenue || 0), 0);
    }
  }, [filteredOutlets, timeWindow]);

  const currentPeriodOrders = useMemo(() => {
    if (timeWindow === 'today') {
      return filteredOutlets.reduce((sum, o) => sum + (o.todayOrders || 0), 0);
    } else if (timeWindow === 'week') {
      return filteredOutlets.reduce((sum, o) => sum + (o.todayOrders || 0) * 7, 0);
    } else {
      return filteredOutlets.reduce((sum, o) => sum + (o.todayOrders || 0) * 30, 0);
    }
  }, [filteredOutlets, timeWindow]);

  const networkSalesTarget = useMemo(() => {
    if (timeWindow === 'today') {
      return totalOutletsCount * dailySalesTargetPerOutlet;
    } else if (timeWindow === 'week') {
      return totalOutletsCount * dailySalesTargetPerOutlet * 7;
    } else {
      return filteredOutlets.reduce((sum, o) => sum + (o.monthlyTarget || 0), 0);
    }
  }, [totalOutletsCount, dailySalesTargetPerOutlet, filteredOutlets, timeWindow]);

  const salesTargetAchievedPercent = networkSalesTarget > 0 
    ? Math.round((currentPeriodSales / networkSalesTarget) * 100) 
    : 100;
  const averageOrderValue = currentPeriodOrders > 0 ? Math.round(currentPeriodSales / currentPeriodOrders) : 0;
  const monthlyRevenueRunRate = timeWindow === 'month' 
    ? currentPeriodSales 
    : Math.round(currentPeriodSales * (30 / timeMultiplier));

  // 3. Inventory Module KPIs
  const totalInventoryValuation = useMemo(() => {
    return inventory.reduce((sum, item) => sum + item.totalStock * item.unitPrice, 0);
  }, [inventory]);
  const lowStockItemsCount = useMemo(() => {
    return inventory.filter((item) => item.totalStock <= item.reorderPoint).length;
  }, [inventory]);
  const totalSkus = inventory.length;

  // 4. Staff Module KPIs (Period Scaled)
  const totalStaffCount = staff.length;
  const presentStaffCount = useMemo(() => {
    return staff.filter((s) => s.status === 'Present' || s.status === 'On Shift' || s.status === 'Active' || s.status === 'Break').length;
  }, [staff]);
  const staffAttendanceRate = totalStaffCount > 0 ? Math.round((presentStaffCount / totalStaffCount) * 100) : 0;
  
  const currentPeriodStaffGeneratedSales = useMemo(() => {
    const dailyTotal = staff.reduce((sum, s) => sum + (s.dailySales || 0), 0);
    return dailyTotal * timeMultiplier;
  }, [staff, timeMultiplier]);

  const avgSalesPerStaff = totalStaffCount > 0 ? Math.round(currentPeriodStaffGeneratedSales / totalStaffCount) : 0;
  const currentPeriodStaffQuota = staffDailyQuota * timeMultiplier;

  // 5. Marketing Module KPIs (Period Scaled)
  const totalMonthlyCampaignSpend = useMemo(() => {
    return campaigns.reduce((sum, c) => sum + c.budget, 0);
  }, [campaigns]);
  const totalMonthlyAttributedRevenue = useMemo(() => {
    return campaigns.reduce((sum, c) => sum + c.attributedRevenue, 0);
  }, [campaigns]);
  const totalMonthlyRedemptions = useMemo(() => {
    return campaigns.reduce((sum, c) => sum + c.redemptionsCount, 0);
  }, [campaigns]);

  const currentPeriodCampaignSpend = useMemo(() => {
    return timeWindow === 'month' ? totalMonthlyCampaignSpend : Math.round((totalMonthlyCampaignSpend / 30) * timeMultiplier);
  }, [totalMonthlyCampaignSpend, timeMultiplier, timeWindow]);

  const currentPeriodAttributedRevenue = useMemo(() => {
    return timeWindow === 'month' ? totalMonthlyAttributedRevenue : Math.round((totalMonthlyAttributedRevenue / 30) * timeMultiplier);
  }, [totalMonthlyAttributedRevenue, timeMultiplier, timeWindow]);

  const blendedRoi = currentPeriodCampaignSpend > 0 ? (currentPeriodAttributedRevenue / currentPeriodCampaignSpend).toFixed(2) : '0.00';

  const currentPeriodRedemptions = useMemo(() => {
    return timeWindow === 'month' ? totalMonthlyRedemptions : Math.round((totalMonthlyRedemptions / 30) * timeMultiplier);
  }, [totalMonthlyRedemptions, timeMultiplier, timeWindow]);

  // 6. Audits & Compliance Module KPIs
  const filteredAudits = useMemo(() => {
    if (selectedBrand === 'all') return audits;
    return audits.filter((a) => a.outletName.toLowerCase().includes(selectedBrand.toLowerCase()));
  }, [audits, selectedBrand]);

  const auditPassCount = filteredAudits.filter((a) => a.overallScore >= auditPassThreshold).length;
  const auditPassRate = filteredAudits.length > 0 ? Math.round((auditPassCount / filteredAudits.length) * 100) : 100;
  const avgAuditScore = filteredAudits.length > 0 
    ? Math.round(filteredAudits.reduce((sum, a) => sum + a.overallScore, 0) / filteredAudits.length)
    : 88;

  const periodAuditCount = useMemo(() => {
    if (timeWindow === 'today') return Math.max(1, Math.round(filteredAudits.length / 4));
    if (timeWindow === 'week') return filteredAudits.length;
    return filteredAudits.length * 4;
  }, [filteredAudits.length, timeWindow]);

  // 7. Alerts Module KPIs
  const activeAlerts = useMemo(() => {
    return alerts.filter((a) => !a.isResolved);
  }, [alerts]);
  const criticalAlertsCount = activeAlerts.filter((a) => a.severity === 'critical' || a.severity === 'high').length;
  const resolvedAlertsCount = alerts.filter((a) => a.isResolved).length;

  const periodResolvedAlerts = useMemo(() => {
    if (timeWindow === 'today') return resolvedAlertsCount;
    if (timeWindow === 'week') return resolvedAlertsCount * 4;
    return resolvedAlertsCount * 18;
  }, [resolvedAlertsCount, timeWindow]);

  // 8. Intelligence & Financial Leakage KPIs (Period Scaled)
  const monthlyPreventableLeakage = useMemo(() => {
    return (underperformingCount * 45000) + (lowStockItemsCount * 12000) + (criticalAlertsCount * 25000);
  }, [underperformingCount, lowStockItemsCount, criticalAlertsCount]);

  const currentPeriodPreventableLeakage = useMemo(() => {
    return timeWindow === 'month' ? monthlyPreventableLeakage : Math.round((monthlyPreventableLeakage / 30) * timeMultiplier);
  }, [monthlyPreventableLeakage, timeMultiplier, timeWindow]);

  // --- DATA MUTATION / SIMULATION ACTIONS (Makes everything changeable in real time) ---
  
  // 1. Add Live Simulated Sale to Top Store
  const handleInjectQuickSale = (amount: number, channel: 'Takeaway' | 'Dine-In' | 'Delivery' | 'Drive-Thru') => {
    if (filteredOutlets.length === 0) return;
    const targetOutlet = filteredOutlets[0];

    // Update Outlet
    onUpdateOutlets((prev) =>
      prev.map((o) =>
        o.id === targetOutlet.id
          ? {
              ...o,
              todaySales: o.todaySales + amount,
              todayOrders: o.todayOrders + 1,
              monthlyRevenue: o.monthlyRevenue + amount,
            }
          : o
      )
    );

    // Update Sales Log
    const newRecord: SaleRecord = {
      id: `s-${Date.now()}`,
      outletId: targetOutlet.id,
      outletName: targetOutlet.name,
      orderNumber: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      itemsCount: Math.floor(Math.random() * 3) + 1,
      amount,
      channel,
      paymentMethod: 'UPI / QR Code',
      status: 'Completed',
    };
    onUpdateSales((prev) => [newRecord, ...prev]);
    showToast(`Injected +₹${amount.toLocaleString()} ${channel} sale to ${targetOutlet.name}!`);
  };

  // 2. Restock Low Inventory
  const handleRestockAllInventory = () => {
    onUpdateInventory((prev) =>
      prev.map((item) => ({
        ...item,
        totalStock: Math.max(item.totalStock, item.reorderPoint + 50),
      }))
    );
    showToast('Restocked all low inventory SKUs to optimal buffer levels!');
  };

  // 3. Mark All Critical Alerts as Resolved
  const handleResolveAllAlerts = () => {
    onUpdateAlerts((prev) =>
      prev.map((a) => ({
        ...a,
        isResolved: true,
      }))
    );
    showToast('Resolved all operational incident alerts!');
  };

  // 4. Boost Staff Attendance to 100%
  const handleMaximizeStaffAttendance = () => {
    onUpdateStaff((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'Active',
        dailySales: s.dailySales + 2500,
      }))
    );
    showToast('Updated all staff roster profiles to Active on shift!');
  };

  // 5. Optimize Underperforming Outlets
  const handleOptimizeUnderperformingOutlets = () => {
    onUpdateOutlets((prev) =>
      prev.map((o) => ({
        ...o,
        isUnderperforming: false,
        todaySales: Math.max(o.todaySales, dailySalesTargetPerOutlet + 4500),
      }))
    );
    showToast('Executed AI turnaround playbook: all outlets restored to Healthy!');
  };

  // Chart Data 1: Store Sales vs Target Quota vs Audit Quality Score (Period Responsive)
  const allStoreComparisonData = useMemo(() => {
    return filteredOutlets.slice(0, 6).map((o) => {
      const matchAudit = audits.find((a) => a.outletId === o.id || a.outletName.includes(o.name.split(' ')[0]));
      const outletSales = timeWindow === 'today' 
        ? o.todaySales 
        : timeWindow === 'week' 
        ? o.todaySales * 7 
        : o.monthlyRevenue;
      
      const outletTarget = timeWindow === 'today' 
        ? dailySalesTargetPerOutlet 
        : timeWindow === 'week' 
        ? dailySalesTargetPerOutlet * 7 
        : o.monthlyTarget;

      const outletOrders = timeWindow === 'today' 
        ? o.todayOrders 
        : timeWindow === 'week' 
        ? o.todayOrders * 7 
        : o.todayOrders * 30;

      return {
        id: o.id,
        name: o.name.replace("McDonald's ", 'MCD-').replace("Domino's ", 'DOM-').replace("KFC ", 'KFC-').slice(0, 10),
        fullName: o.name,
        sales: Math.round(outletSales / 1000),
        target: Math.round(outletTarget / 1000),
        rawSales: outletSales,
        rawTarget: outletTarget,
        auditScore: matchAudit ? matchAudit.overallScore : 88,
        orders: outletOrders,
        fullOutlet: o,
      };
    });
  }, [filteredOutlets, dailySalesTargetPerOutlet, audits, timeWindow]);

  const storeComparisonData = useMemo(() => {
    if (focusedStore && isIsolationMode) {
      const single = allStoreComparisonData.filter(
        (s) => s.fullName.toLowerCase() === focusedStore.toLowerCase() || s.name.toLowerCase() === focusedStore.toLowerCase() || s.id === focusedStore
      );
      return single.length > 0 ? single : allStoreComparisonData;
    }
    return allStoreComparisonData;
  }, [allStoreComparisonData, focusedStore, isIsolationMode]);

  const focusedOutletObj = useMemo(() => {
    if (!focusedStore) return null;
    return outlets.find(
      (o) => o.name.toLowerCase() === focusedStore.toLowerCase() || o.id === focusedStore || o.name.includes(focusedStore)
    ) || null;
  }, [outlets, focusedStore]);

  // Chart Data 2: Multi-Module Resource Allocation & Expense Distribution (Period Responsive)
  const allResourceAllocationData = useMemo(() => {
    const staffLaborCost = Math.round(totalStaffCount * 1200 * timeMultiplier);
    return [
      { name: 'Inventory Valuation', value: Math.round(totalInventoryValuation / 1000), color: '#10b981', desc: `${totalSkus} SKUs in stock (₹${(totalInventoryValuation/100000).toFixed(2)}L Asset)` },
      { name: `Staff Labor Cost (${timePeriodName})`, value: Math.round(staffLaborCost / 1000), color: '#6366f1', desc: `${presentStaffCount}/${totalStaffCount} crew active (₹${(staffLaborCost/1000).toLocaleString()}k)` },
      { name: `Marketing Ad Spend (${timePeriodName})`, value: Math.round(currentPeriodCampaignSpend / 1000), color: '#f59e0b', desc: `${campaigns.length} campaigns generating ${blendedRoi}x ROI` },
      { name: `Preventable Leakage (${timePeriodName})`, value: Math.round(currentPeriodPreventableLeakage / 1000), color: '#ec4899', desc: `${underperformingCount} flagged stores + ${criticalAlertsCount} alerts` },
    ].filter((d) => d.value > 0);
  }, [totalInventoryValuation, totalStaffCount, timeMultiplier, timePeriodName, currentPeriodCampaignSpend, currentPeriodPreventableLeakage, totalSkus, presentStaffCount, campaigns.length, blendedRoi, underperformingCount, criticalAlertsCount]);

  const resourceAllocationData = useMemo(() => {
    if (focusedResource && isIsolationMode) {
      const single = allResourceAllocationData.filter((r) => r.name === focusedResource);
      return single.length > 0 ? single : allResourceAllocationData;
    }
    return allResourceAllocationData;
  }, [allResourceAllocationData, focusedResource, isIsolationMode]);

  const focusedResourceObj = useMemo(() => {
    if (!focusedResource) return null;
    return allResourceAllocationData.find((r) => r.name === focusedResource) || null;
  }, [allResourceAllocationData, focusedResource]);

  // Chart Data 3: Channel Revenue Composition (Period Responsive)
  const allChannelRevenueData = useMemo(() => {
    return [
      { name: 'Dine-In', value: 38, revenue: Math.round(currentPeriodSales * 0.38), color: '#10b981', orders: Math.round(currentPeriodOrders * 0.38) },
      { name: 'Takeaway', value: 32, revenue: Math.round(currentPeriodSales * 0.32), color: '#6366f1', orders: Math.round(currentPeriodOrders * 0.32) },
      { name: 'Delivery Apps', value: 22, revenue: Math.round(currentPeriodSales * 0.22), color: '#f59e0b', orders: Math.round(currentPeriodOrders * 0.22) },
      { name: 'Drive-Thru', value: 8, revenue: Math.round(currentPeriodSales * 0.08), color: '#ec4899', orders: Math.round(currentPeriodOrders * 0.08) },
    ];
  }, [currentPeriodSales, currentPeriodOrders]);

  const channelRevenueData = useMemo(() => {
    if (focusedChannel && isIsolationMode) {
      const single = allChannelRevenueData.filter((c) => c.name.toLowerCase() === focusedChannel.toLowerCase());
      return single.length > 0 ? single : allChannelRevenueData;
    }
    return allChannelRevenueData;
  }, [allChannelRevenueData, focusedChannel, isIsolationMode]);

  const focusedChannelObj = useMemo(() => {
    if (!focusedChannel) return null;
    return allChannelRevenueData.find((c) => c.name.toLowerCase() === focusedChannel.toLowerCase()) || null;
  }, [allChannelRevenueData, focusedChannel]);

  // Chart Data 4: Operational Module Health Index Radar / Grouped Bar
  const allModuleHealthIndexData = useMemo(() => {
    return [
      { module: 'Sales Pacing', score: Math.min(100, salesTargetAchievedPercent), benchmark: 100, status: salesTargetAchievedPercent >= 100 ? 'Optimal' : 'Behind Target', action: 'Inject POS Orders', color: '#10b981' },
      { module: 'Audit Compliance', score: avgAuditScore, benchmark: auditPassThreshold, status: avgAuditScore >= auditPassThreshold ? 'Optimal' : 'Needs Inspection', action: 'Review Audits', color: '#06b6d4' },
      { module: 'Staff Presence', score: staffAttendanceRate, benchmark: 90, status: staffAttendanceRate >= 90 ? 'Optimal' : 'Shift Understaffed', action: 'Set 100% Active', color: '#8b5cf6' },
      { module: 'Inventory Buffer', score: totalSkus > 0 ? Math.round(((totalSkus - lowStockItemsCount) / totalSkus) * 100) : 100, benchmark: 95, status: lowStockItemsCount === 0 ? 'Optimal' : `${lowStockItemsCount} Low Stock SKUs`, action: 'Restock SKUs', color: '#f59e0b' },
      { module: 'Alert SLA MTTR', score: activeAlerts.length === 0 ? 100 : Math.max(40, 100 - activeAlerts.length * 15), benchmark: 85, status: activeAlerts.length === 0 ? 'Optimal' : `${activeAlerts.length} Open Alerts`, action: 'Resolve Alerts', color: '#ef4444' },
      { module: 'Marketing ROI', score: Math.min(100, Math.round((parseFloat(blendedRoi) / targetRoiMultiplier) * 100)), benchmark: 100, status: parseFloat(blendedRoi) >= targetRoiMultiplier ? 'Optimal' : 'Below Target ROI', action: 'Boost Campaigns', color: '#ec4899' },
    ];
  }, [salesTargetAchievedPercent, avgAuditScore, auditPassThreshold, staffAttendanceRate, totalSkus, lowStockItemsCount, activeAlerts.length, blendedRoi, targetRoiMultiplier]);

  const moduleHealthIndexData = useMemo(() => {
    if (focusedHealthModule && isIsolationMode) {
      const single = allModuleHealthIndexData.filter((m) => m.module.toLowerCase() === focusedHealthModule.toLowerCase());
      return single.length > 0 ? single : allModuleHealthIndexData;
    }
    return allModuleHealthIndexData;
  }, [allModuleHealthIndexData, focusedHealthModule, isIsolationMode]);

  const focusedHealthObj = useMemo(() => {
    if (!focusedHealthModule) return null;
    return allModuleHealthIndexData.find((m) => m.module.toLowerCase() === focusedHealthModule.toLowerCase()) || null;
  }, [allModuleHealthIndexData, focusedHealthModule]);

  // Filtered sales records matching focused store or focused channel if active
  const recentFilteredSales = useMemo(() => {
    return sales.filter((s) => {
      if (focusedStore && s.outletName.toLowerCase() !== focusedStore.toLowerCase() && !s.outletName.toLowerCase().includes(focusedStore.toLowerCase())) {
        return false;
      }
      if (focusedChannel) {
        const normChannel = focusedChannel.toLowerCase();
        if (normChannel.includes('dine') && !s.channel.toLowerCase().includes('dine')) return false;
        if (normChannel.includes('takeaway') && !s.channel.toLowerCase().includes('takeaway')) return false;
        if (normChannel.includes('delivery') && !s.channel.toLowerCase().includes('delivery')) return false;
        if (normChannel.includes('drive') && !s.channel.toLowerCase().includes('drive')) return false;
      }
      return true;
    }).slice(0, 5);
  }, [sales, focusedStore, focusedChannel]);

  const hasAnyActiveFilter = Boolean(focusedStore || focusedResource || focusedHealthModule || focusedChannel);

  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

  return (
    <div id="executive-master-dashboard" className="space-y-6 pb-12">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DASHBOARD HERO HEADER & EXECUTIVE ACTION CONTROLS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Executive Master Dashboard
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Unified live command center aggregating all 8 enterprise operational modules
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls & Data Tuner Triggers */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <select
              id="dashboard-brand-filter"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-transparent text-slate-800 font-bold text-xs pr-2 py-1 outline-hidden cursor-pointer"
            >
              <option value="all">All Brands ({outlets.length} Outlets)</option>
              <option value="McDonald's">McDonald's</option>
              <option value="Domino's">Domino's</option>
              <option value="KFC">KFC</option>
            </select>
          </div>

          {/* Time Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {(['today', 'week', 'month'] as const).map((t) => (
              <button
                key={t}
                id={`time-tab-${t}`}
                onClick={() => setTimeWindow(t)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  timeWindow === t
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Target Benchmarks Modal Trigger */}
          <button
            id="open-targets-modal-btn"
            onClick={() => setIsTargetsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-all cursor-pointer shadow-2xs"
            title="Adjust target benchmark thresholds"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Target Tuner</span>
          </button>

          {/* Live Data Modifier & Simulator Drawer Trigger */}
          <button
            id="open-data-modifier-btn"
            onClick={() => setIsDataModifierOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm shadow-emerald-600/20"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>⚡ Change / Simulate Data</span>
          </button>
        </div>
      </div>

      {/* QUICK INLINE WHAT-IF SIMULATION TICKER BAR */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div className="font-semibold text-slate-200">
            <strong className="text-emerald-400">Live Multi-Module Sync Active:</strong> Any state change updates all KPIs and charts instantly.
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="quick-order-btn"
            onClick={() => handleInjectQuickSale(1450, 'Takeaway')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3 h-3" /> +₹1,450 POS Order
          </button>
          <button
            id="quick-restock-btn"
            onClick={handleRestockAllInventory}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Package className="w-3 h-3" /> Restock All Low SKUs
          </button>
          <button
            id="quick-resolve-alerts-btn"
            onClick={handleResolveAllAlerts}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ShieldCheck className="w-3 h-3" /> Clear Active Alerts
          </button>
        </div>
      </div>

      {/* ALL-IN-ONE 8 MODULE INTERACTIVE KPI MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Outlets & Franchises */}
        <div
          id="kpi-card-outlets"
          onClick={() => onNavigateToTab('outlets')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-md font-mono flex items-center gap-1">
              Outlets <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Outlets & Network</p>
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-extrabold rounded">
                {timePeriodLabel}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900">{totalOutletsCount} Locations</h3>
              <span className="text-xs font-bold text-emerald-600">
                {timeWindow === 'today' ? `${healthyOutletsCount} Healthy` : timeWindow === 'week' ? '99.2% Uptime' : '+14.8% Growth'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
              <span>
                {timeWindow === 'today' 
                  ? <>Avg Health: <strong className="text-slate-800">{avgHealthScore}%</strong></>
                  : timeWindow === 'week' 
                  ? <>Pacing: <strong className="text-slate-800">₹{(currentPeriodSales / 1000).toFixed(0)}k</strong></>
                  : <>Target: <strong className="text-slate-800">₹{(networkSalesTarget / 100000).toFixed(1)}L</strong></>
                }
              </span>
              <span className={underperformingCount > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600'}>
                {timeWindow === 'today' ? `${underperformingCount} Flagged` : timeWindow === 'week' ? `${healthyOutletsCount} On-Target` : '100% Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Sales & Revenue */}
        <div
          id="kpi-card-sales"
          onClick={() => onNavigateToTab('sales')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
              <IndianRupee className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[10px] font-bold rounded-md font-mono flex items-center gap-1">
              Sales <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Network {timePeriodName} Revenue</p>
              <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-extrabold rounded">
                {timePeriodLabel}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900">₹{(currentPeriodSales / 1000).toFixed(1)}k</h3>
              <span className={`text-xs font-bold ${salesTargetAchievedPercent >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {salesTargetAchievedPercent}% Target
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
              <span>Orders: <strong className="text-slate-800">{currentPeriodOrders.toLocaleString()}</strong></span>
              <span>AOV: <strong className="text-indigo-600">₹{averageOrderValue}</strong></span>
            </div>
          </div>
        </div>

        {/* Card 3: Inventory & Supply */}
        <div
          id="kpi-card-inventory"
          onClick={() => onNavigateToTab('inventory')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-md font-mono flex items-center gap-1">
              Stock <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Inventory Valuation</p>
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-extrabold rounded">
                {timePeriodLabel}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900">₹{(totalInventoryValuation / 100000).toFixed(2)}L</h3>
              <span className={`text-xs font-bold ${lowStockItemsCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {timeWindow === 'today' 
                  ? `${lowStockItemsCount} Low Buffer` 
                  : timeWindow === 'week' 
                  ? `${lowStockItemsCount * 2} Reorder Cycles` 
                  : '99.4% Stock Health'
                }
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
              <span>
                {timeWindow === 'today'
                  ? <>Daily Outflow: <strong className="text-slate-800">₹{Math.round((totalInventoryValuation * 0.035) / 1000)}k</strong></>
                  : timeWindow === 'week'
                  ? <>Weekly Flow: <strong className="text-slate-800">₹{Math.round((totalInventoryValuation * 0.245) / 1000)}k</strong></>
                  : <>Monthly Restock: <strong className="text-slate-800">₹{(totalInventoryValuation * 1.05 / 100000).toFixed(1)}L</strong></>
                }
              </span>
              <span className="text-emerald-600 font-bold">
                {timeWindow === 'today' ? 'Cold Chain OK' : timeWindow === 'week' ? 'Turnover 4.8x' : 'Shrink <0.3%'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Staff Operations */}
        <div
          id="kpi-card-staff"
          onClick={() => onNavigateToTab('staff')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 bg-purple-50 text-purple-800 text-[10px] font-bold rounded-md font-mono flex items-center gap-1">
              Staff <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Staff Attendance & Output</p>
              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-extrabold rounded">
                {timePeriodLabel}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900">
                {timeWindow === 'today' 
                  ? `${presentStaffCount}/${totalStaffCount} Active` 
                  : timeWindow === 'week' 
                  ? `${presentStaffCount * 7}/${totalStaffCount * 7} Shifts` 
                  : `${presentStaffCount * 30}/${totalStaffCount * 30} Shifts`
                }
              </h3>
              <span className="text-xs font-bold text-purple-600">{staffAttendanceRate}% Roster</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
              <span>Avg Sales/Staff: <strong className="text-slate-800">₹{avgSalesPerStaff.toLocaleString()}</strong></span>
              <span className="text-purple-600 font-bold">Quota ₹{(currentPeriodStaffQuota/1000).toFixed(0)}k</span>
            </div>
          </div>
        </div>

        {/* Card 5: Marketing & ROI */}
        <div
          id="kpi-card-marketing"
          onClick={() => onNavigateToTab('marketing')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-pink-500 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl group-hover:scale-110 transition-transform">
              <Megaphone className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 bg-pink-50 text-pink-800 text-[10px] font-bold rounded-md font-mono flex items-center gap-1">
              Marketing <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Campaign Spend & ROI</p>
              <span className="px-1.5 py-0.5 bg-pink-100 text-pink-700 text-[9px] font-extrabold rounded">
                {timePeriodLabel}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900">{blendedRoi}x Return</h3>
              <span className="text-xs font-bold text-pink-600">₹{(currentPeriodAttributedRevenue / 1000).toFixed(0)}k Rev</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
              <span>Spend: <strong className="text-slate-800">₹{(currentPeriodCampaignSpend / 1000).toFixed(0)}k</strong></span>
              <span>Redemptions: <strong className="text-pink-600">{currentPeriodRedemptions.toLocaleString()}</strong></span>
            </div>
          </div>
        </div>

        {/* Card 6: Audits & Compliance */}
        <div
          id="kpi-card-audits"
          onClick={() => onNavigateToTab('audits')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-md font-mono flex items-center gap-1">
              Audits <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quality Pass Rate</p>
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-extrabold rounded">
                {timePeriodLabel}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900">{auditPassRate}% Passed</h3>
              <span className="text-xs font-bold text-emerald-600">Avg {avgAuditScore}%</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
              <span>Audits Completed: <strong className="text-slate-800">{periodAuditCount}</strong></span>
              <span>Pass Standard: <strong className="text-emerald-700">{auditPassThreshold}%</strong></span>
            </div>
          </div>
        </div>

        {/* Card 7: Alerts & SLA */}
        <div
          id="kpi-card-alerts"
          onClick={() => onNavigateToTab('alerts')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-rose-500 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
              <BellRing className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 bg-rose-50 text-rose-800 text-[10px] font-bold rounded-md font-mono flex items-center gap-1">
              Alerts <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Incidents & SLA</p>
              <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-extrabold rounded">
                {timePeriodLabel}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900">
                {timeWindow === 'today' ? `${activeAlerts.length} Open` : `${activeAlerts.length} Active SLA`}
              </h3>
              <span className={`text-xs font-bold ${criticalAlertsCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {criticalAlertsCount} Critical
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
              <span>Resolved ({timePeriodLabel}): <strong className="text-emerald-600">{periodResolvedAlerts}</strong></span>
              <span>SLA Target: <strong className="text-slate-800">&lt;30m</strong></span>
            </div>
          </div>
        </div>

        {/* Card 8: Intelligence & Profit Recovery */}
        <div
          id="kpi-card-intelligence"
          onClick={() => onNavigateToTab('intelligence')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[10px] font-bold rounded-md font-mono flex items-center gap-1">
              AI Profit <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Preventable Margin Leakage</p>
              <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-extrabold rounded">
                {timePeriodLabel}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900">₹{(currentPeriodPreventableLeakage / 1000).toLocaleString()}k</h3>
              <span className="text-xs font-bold text-indigo-600">AI Protected</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
              <span>AI Accuracy: <strong className="text-emerald-600">{timeWindow === 'today' ? '96.4%' : timeWindow === 'week' ? '97.2%' : '98.6%'}</strong></span>
              <span className="text-indigo-600 font-bold">{timeWindow === 'today' ? '8 Playbooks' : timeWindow === 'week' ? '14 Triggers' : '99.2% Fixed'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ACTIVE CHART FILTER BAR & ISOLATION TOGGLE */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 mr-1">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Interactive Chart Filter:</span>
          </div>

          {hasAnyActiveFilter ? (
            <>
              {focusedStore && (
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold rounded-lg flex items-center gap-1.5 shadow-2xs">
                  <Store className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Store: <strong>{focusedStore}</strong></span>
                  <button
                    onClick={() => setFocusedStore(null)}
                    className="hover:text-emerald-700 p-0.5 rounded-full hover:bg-emerald-200 cursor-pointer"
                    title="Remove store filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {focusedResource && (
                <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold rounded-lg flex items-center gap-1.5 shadow-2xs">
                  <Layers className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Resource: <strong>{focusedResource}</strong></span>
                  <button
                    onClick={() => setFocusedResource(null)}
                    className="hover:text-indigo-700 p-0.5 rounded-full hover:bg-indigo-200 cursor-pointer"
                    title="Remove resource filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {focusedHealthModule && (
                <span className="px-2.5 py-1 bg-purple-100 text-purple-900 border border-purple-300 font-bold rounded-lg flex items-center gap-1.5 shadow-2xs">
                  <Activity className="w-3.5 h-3.5 text-purple-700" />
                  <span>Dimension: <strong>{focusedHealthModule}</strong></span>
                  <button
                    onClick={() => setFocusedHealthModule(null)}
                    className="hover:text-purple-700 p-0.5 rounded-full hover:bg-purple-200 cursor-pointer"
                    title="Remove dimension filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {focusedChannel && (
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-lg flex items-center gap-1.5 shadow-2xs">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
                  <span>Channel: <strong>{focusedChannel}</strong></span>
                  <button
                    onClick={() => setFocusedChannel(null)}
                    className="hover:text-amber-700 p-0.5 rounded-full hover:bg-amber-200 cursor-pointer"
                    title="Remove channel filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                id="clear-all-chart-filters-btn"
                onClick={() => {
                  setFocusedStore(null);
                  setFocusedResource(null);
                  setFocusedHealthModule(null);
                  setFocusedChannel(null);
                  showToast('Reset all active chart block filters');
                }}
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Chart Filters</span>
              </button>
            </>
          ) : (
            <span className="text-slate-500 font-medium italic">
              Click any bar or pie chart slice to isolate and focus that block
            </span>
          )}
        </div>

        {/* Isolation Mode Toggle Switch */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-600">
            {isIsolationMode ? '🔍 Isolate Block Only' : '✨ Highlight in Full Chart'}
          </span>
          <button
            onClick={() => setIsIsolationMode(!isIsolationMode)}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold cursor-pointer transition-all border ${
              isIsolationMode
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {isIsolationMode ? 'Isolation: ON' : 'Isolation: OFF'}
          </button>
        </div>
      </div>

      {/* COMPREHENSIVE INTERACTIVE CHARTS SUITE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART 1: Cross-Franchise Performance vs Target Quotas */}
        <div className={`bg-white p-6 rounded-3xl border shadow-xs space-y-4 lg:col-span-2 transition-all ${
          focusedStore ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Store Sales vs {timePeriodName} Quota Target (₹ Thousands)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {focusedStore 
                  ? `Showing isolated focus for ${focusedStore} (${timePeriodLabel}). Click bar again or reset to view all stores.` 
                  : `Click any store bar to isolate and open instant store performance spotlight for ${timePeriodLabel.toLowerCase()}.`
                }
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {focusedStore && (
                <button
                  onClick={() => setFocusedStore(null)}
                  className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded-md flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" /> Show All Stores
                </button>
              )}
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold rounded-lg">
                {timePeriodLabel} Sales Pacing
              </span>
            </div>
          </div>

          <div className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={storeComparisonData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length) {
                    const item = e.activePayload[0].payload;
                    const targetName = item.fullName || item.name;
                    setFocusedStore(focusedStore === targetName ? null : targetName);
                    showToast(`Focused on ${targetName}`);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `₹${v}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-xl">
                          <p className="font-black text-emerald-400">{d.fullName}</p>
                          <p className="text-slate-300">Sales Generated: <strong className="text-white">₹{(d.sales * 1000).toLocaleString()}</strong></p>
                          <p className="text-slate-300">Quota Target: <strong className="text-amber-400">₹{(d.target * 1000).toLocaleString()}</strong></p>
                          <p className="text-slate-300">Audit Score: <strong className="text-cyan-400">{d.auditScore}%</strong></p>
                          <p className="text-slate-300">Completed Orders: <strong className="text-white">{d.orders}</strong></p>
                          <p className="text-[10px] text-emerald-300 pt-1 border-t border-slate-800 font-semibold">
                            💡 Click to {focusedStore === d.fullName ? 'unfocus' : 'isolate this store'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="sales"
                  name="Actual Sales (₹k)"
                  radius={[4, 4, 0, 0]}
                  className="cursor-pointer"
                  onClick={(data) => {
                    const targetName = data.fullName || data.name;
                    setFocusedStore(focusedStore === targetName ? null : targetName);
                    showToast(`Focused on ${targetName}`);
                  }}
                >
                  {storeComparisonData.map((entry, index) => {
                    const isSelected = focusedStore && (entry.fullName.toLowerCase() === focusedStore.toLowerCase() || entry.name.toLowerCase() === focusedStore.toLowerCase());
                    const fill = isSelected ? '#059669' : focusedStore && !isIsolationMode ? '#a7f3d0' : '#10b981';
                    return <Cell key={`store-bar-${index}`} fill={fill} />;
                  })}
                </Bar>
                <Line type="monotone" dataKey="target" name="Quota Target (₹k)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* ACTIVE STORE SPOTLIGHT ACCORDION / DRILLDOWN PANEL */}
          {focusedOutletObj && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-600 text-white rounded-lg font-bold font-mono text-[10px]">
                    {focusedOutletObj.code}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-emerald-950 text-sm">{focusedOutletObj.name}</h4>
                    <p className="text-[11px] text-emerald-800">
                      Manager: <strong>{focusedOutletObj.manager}</strong> • {focusedOutletObj.city} ({focusedOutletObj.region})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                    focusedOutletObj.isUnderperforming ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {focusedOutletObj.isUnderperforming ? 'Flagged / Attention' : 'Optimal Health'}
                  </span>
                  <button
                    onClick={() => setFocusedStore(null)}
                    className="p-1 text-emerald-800 hover:text-emerald-950 cursor-pointer"
                    title="Close spotlight"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">{timePeriodLabel} Sales</span>
                  <span className="text-base font-black text-slate-900">
                    ₹{(
                      timeWindow === 'today' 
                        ? (focusedOutletObj.todaySales || 0) 
                        : timeWindow === 'week' 
                        ? (focusedOutletObj.todaySales || 0) * 7 
                        : (focusedOutletObj.monthlyRevenue || 0)
                    ).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    {(() => {
                      const salesVal = timeWindow === 'today' ? (focusedOutletObj.todaySales || 0) : timeWindow === 'week' ? (focusedOutletObj.todaySales || 0) * 7 : (focusedOutletObj.monthlyRevenue || 0);
                      const targetVal = timeWindow === 'today' ? dailySalesTargetPerOutlet : timeWindow === 'week' ? dailySalesTargetPerOutlet * 7 : (focusedOutletObj.monthlyTarget || 1);
                      return targetVal > 0 ? Math.round((salesVal / targetVal) * 100) : 0;
                    })()}% of quota
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Orders & AOV</span>
                  <span className="text-base font-black text-slate-900">
                    {(focusedOutletObj.todayOrders || 0) * timeMultiplier} Orders
                  </span>
                  <span className="text-[10px] text-indigo-600 font-semibold block">
                    ₹{focusedOutletObj.todayOrders && focusedOutletObj.todayOrders > 0 ? Math.round((focusedOutletObj.todaySales || 0) / focusedOutletObj.todayOrders) : 0} AOV
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Hygiene & Audit</span>
                  <span className="text-base font-black text-slate-900">{focusedOutletObj.auditScore || 88}%</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Score Grade A</span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Customer Rating</span>
                  <span className="text-base font-black text-slate-900">★ {focusedOutletObj.customerRating || 4.5} / 5</span>
                  <span className="text-[10px] text-slate-500 font-semibold block">{focusedOutletObj.fulfillmentTimeMin || 12}m ticket speed</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onUpdateOutlets((prev) =>
                        prev.map((o) =>
                          o.id === focusedOutletObj.id
                            ? { ...o, todaySales: o.todaySales + 1500, todayOrders: o.todayOrders + 1 }
                            : o
                        )
                      );
                      showToast(`Injected +₹1,500 order to ${focusedOutletObj.name}!`);
                    }}
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3 h-3" /> +₹1,500 Quick Order
                  </button>

                  <button
                    onClick={() => {
                      onUpdateOutlets((prev) =>
                        prev.map((o) =>
                          o.id === focusedOutletObj.id
                            ? { ...o, isUnderperforming: !o.isUnderperforming }
                            : o
                        )
                      );
                      showToast(`Toggled status for ${focusedOutletObj.name}`);
                    }}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-lg cursor-pointer"
                  >
                    {focusedOutletObj.isUnderperforming ? 'Mark as Healthy' : 'Flag Attention'}
                  </button>
                </div>

                <button
                  onClick={() => onNavigateToTab('outlets')}
                  className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 cursor-pointer underline underline-offset-2"
                >
                  <span>Open Single Store Drilldown</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {timePeriodLabel} Store Sales</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-500" /> {timePeriodName} Target Quota (₹{((dailySalesTargetPerOutlet * timeMultiplier)/1000).toFixed(0)}k/store)</span>
            <span className="font-bold text-slate-700">Network Run-Rate: ₹{(monthlyRevenueRunRate / 100000).toFixed(1)}L / mo</span>
          </div>
        </div>

        {/* CHART 2: Enterprise Resource Allocation & Expense Mix */}
        <div className={`bg-white p-6 rounded-3xl border shadow-xs space-y-4 flex flex-col justify-between transition-all ${
          focusedResource ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-black text-slate-900">
                    Cross-Module Resource Mix
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {focusedResource 
                    ? `Isolated slice: ${focusedResource}. Click to reset.` 
                    : `Click any pie block to isolate and inspect capital breakdown.`
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {focusedResource && (
                  <button
                    onClick={() => setFocusedResource(null)}
                    className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded-md flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Reset
                  </button>
                )}
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[10px] font-mono font-bold rounded">
                  Capital Mix
                </span>
              </div>
            </div>

            <div className="h-[200px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resourceAllocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={focusedResource && isIsolationMode ? 35 : 48}
                    outerRadius={focusedResource && isIsolationMode ? 78 : 72}
                    paddingAngle={4}
                    dataKey="value"
                    className="cursor-pointer"
                    onClick={(entry) => {
                      setFocusedResource(focusedResource === entry.name ? null : entry.name);
                      showToast(`Focused on ${entry.name}`);
                    }}
                  >
                    {resourceAllocationData.map((entry, index) => {
                      const isSelected = focusedResource === entry.name;
                      const fill = isSelected ? '#4338ca' : entry.color || COLORS[index % COLORS.length];
                      return <Cell key={`resource-cell-${index}`} fill={fill} className="cursor-pointer hover:opacity-80 transition-opacity" />;
                    })}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`₹${val.toLocaleString()}k`, 'Allocated Value']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* RESOURCE SPOTLIGHT CARD */}
            {focusedResourceObj && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-indigo-50/90 rounded-2xl border border-indigo-200 text-xs space-y-2 mt-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-indigo-950">{focusedResourceObj.name}</span>
                  <span className="font-black text-indigo-700 text-sm">₹{focusedResourceObj.value.toLocaleString()}k</span>
                </div>
                <p className="text-[11px] text-indigo-800">{focusedResourceObj.desc}</p>
                <div className="flex items-center justify-between pt-1 border-t border-indigo-200/60">
                  <span className="text-[10px] text-indigo-600 font-bold">100% Capital Verified</span>
                  <button
                    onClick={() => {
                      if (focusedResource.includes('Inventory')) onNavigateToTab('inventory');
                      else if (focusedResource.includes('Staff')) onNavigateToTab('staff');
                      else if (focusedResource.includes('Marketing')) onNavigateToTab('marketing');
                      else onNavigateToTab('intelligence');
                    }}
                    className="text-[11px] font-bold text-indigo-800 hover:text-indigo-950 underline"
                  >
                    Open Dedicated Tab →
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
            <span>Inventory + Labor + Ad Spend</span>
            <span className="font-bold text-indigo-600">Healthy Buffer</span>
          </div>
        </div>

      </div>

      {/* SECOND CHARTS ROW: Operational Radar & Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART 3: Operational Health Index by Module */}
        <div className={`bg-white p-6 rounded-3xl border shadow-xs space-y-4 lg:col-span-2 transition-all ${
          focusedHealthModule ? 'border-purple-400 ring-2 ring-purple-100' : 'border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Enterprise Operational Health Index (0 - 100%)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {focusedHealthModule 
                  ? `Isolated dimension: ${focusedHealthModule}. Click bar or reset to view all dimensions.` 
                  : `Click any module bar to isolate and diagnose operational gaps.`
                }
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {focusedHealthModule && (
                <button
                  onClick={() => setFocusedHealthModule(null)}
                  className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded-md flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" /> Show All Dimensions
                </button>
              )}
              <span className="px-2.5 py-1 bg-purple-50 text-purple-800 text-[10px] font-mono font-bold rounded-lg">
                Health Index
              </span>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={moduleHealthIndexData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length) {
                    const item = e.activePayload[0].payload;
                    setFocusedHealthModule(focusedHealthModule === item.module ? null : item.module);
                    showToast(`Focused on ${item.module}`);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="module" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-xl">
                          <p className="font-black text-purple-400">{d.module}</p>
                          <p className="text-slate-300">Achieved Score: <strong className="text-emerald-400">{d.score}%</strong></p>
                          <p className="text-slate-300">Target Standard: <strong className="text-slate-300">{d.benchmark}%</strong></p>
                          <p className="text-[10px] text-purple-300 pt-1 border-t border-slate-800 font-semibold">
                            💡 Click to {focusedHealthModule === d.module ? 'unfocus' : 'isolate dimension'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="score"
                  name="Current Score %"
                  radius={[4, 4, 0, 0]}
                  className="cursor-pointer"
                  onClick={(data) => {
                    setFocusedHealthModule(focusedHealthModule === data.module ? null : data.module);
                    showToast(`Focused on ${data.module}`);
                  }}
                >
                  {moduleHealthIndexData.map((entry, index) => {
                    const isSelected = focusedHealthModule === entry.module;
                    const fill = isSelected ? '#4338ca' : entry.color || '#6366f1';
                    return <Cell key={`health-bar-${index}`} fill={fill} />;
                  })}
                </Bar>
                <Bar dataKey="benchmark" name="Target Benchmark %" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* HEALTH MODULE DIAGNOSTIC CARD */}
          {focusedHealthObj && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 bg-purple-50/90 rounded-2xl border border-purple-200 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-purple-950">{focusedHealthObj.module} Diagnostic</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    focusedHealthObj.score >= focusedHealthObj.benchmark ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {focusedHealthObj.status}
                  </span>
                </div>
                <span className="font-mono font-black text-purple-900">
                  {focusedHealthObj.score}% Achieved (Target {focusedHealthObj.benchmark}%)
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-purple-800 text-[11px]">
                  Gap to Target Standard: <strong>{Math.max(0, focusedHealthObj.benchmark - focusedHealthObj.score)}%</strong>
                </span>
                <button
                  onClick={() => {
                    if (focusedHealthObj.module.includes('Sales')) handleInjectQuickSale(2000, 'Takeaway');
                    else if (focusedHealthObj.module.includes('Inventory')) handleRestockAllInventory();
                    else if (focusedHealthObj.module.includes('Staff')) handleMaximizeStaffAttendance();
                    else if (focusedHealthObj.module.includes('Alert')) handleResolveAllAlerts();
                    else if (focusedHealthObj.module.includes('Audit')) onNavigateToTab('audits');
                    else onNavigateToTab('marketing');
                  }}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[11px] cursor-pointer shadow-2xs"
                >
                  ⚡ Optimize: {focusedHealthObj.action}
                </button>
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Current Score</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Benchmark Threshold</span>
            <span className="font-bold text-emerald-600">Enterprise Index: 92.4%</span>
          </div>
        </div>

        {/* CHART 4: Channel Order Composition */}
        <div className={`bg-white p-6 rounded-3xl border shadow-xs space-y-4 flex flex-col justify-between transition-all ${
          focusedChannel ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-black text-slate-900">
                    Sales Channel Fulfillment
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {focusedChannel 
                    ? `Filtered to ${focusedChannel}. Click slice to reset.` 
                    : `Click any channel block to isolate fulfillment & filter orders.`
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {focusedChannel && (
                  <button
                    onClick={() => setFocusedChannel(null)}
                    className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded-md flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Reset
                  </button>
                )}
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold rounded">
                  Channels
                </span>
              </div>
            </div>

            <div className="h-[200px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelRevenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={focusedChannel && isIsolationMode ? 35 : 45}
                    outerRadius={focusedChannel && isIsolationMode ? 78 : 72}
                    paddingAngle={4}
                    dataKey="value"
                    className="cursor-pointer"
                    onClick={(entry) => {
                      setFocusedChannel(focusedChannel === entry.name ? null : entry.name);
                      showToast(`Filtered orders by ${entry.name}`);
                    }}
                  >
                    {channelRevenueData.map((entry, index) => {
                      const isSelected = focusedChannel && focusedChannel.toLowerCase() === entry.name.toLowerCase();
                      const fill = isSelected ? '#059669' : entry.color || ['#10b981', '#6366f1', '#f59e0b', '#ec4899'][index % 4];
                      return <Cell key={`chan-cell-${index}`} fill={fill} className="cursor-pointer hover:opacity-80 transition-opacity" />;
                    })}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val}% Share`, 'Volume Share']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* CHANNEL SPOTLIGHT CARD */}
            {focusedChannelObj && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-amber-50/90 rounded-2xl border border-amber-200 text-xs space-y-2 mt-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-950">{focusedChannelObj.name} Channel</span>
                  <span className="font-black text-amber-800">{focusedChannelObj.value}% Share</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-amber-900">
                  <span>Est. Revenue: <strong>₹{focusedChannelObj.revenue?.toLocaleString()}</strong></span>
                  <span>Orders: <strong>{focusedChannelObj.orders}</strong></span>
                </div>
                <div className="pt-1 border-t border-amber-200/60">
                  <button
                    onClick={() => handleInjectQuickSale(850, focusedChannelObj.name.includes('Dine') ? 'Dine-In' : focusedChannelObj.name.includes('Takeaway') ? 'Takeaway' : 'Delivery')}
                    className="w-full py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                  >
                    + Add {focusedChannelObj.name} POS Order
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
            <span>Leading: Dine-In (38%)</span>
            <span className="font-bold text-slate-800">{currentPeriodOrders} Total Orders ({timePeriodLabel})</span>
          </div>
        </div>

      </div>

      {/* FILTERED RECENT POS TRANSACTIONS ADAPTIVE FEED */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900">
                Live POS Orders & Transactions Feed
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {focusedStore || focusedChannel ? (
                <span className="text-emerald-700 font-bold">
                  ⚡ Filtered dynamically by active chart selection: {focusedStore ? `[Store: ${focusedStore}] ` : ''}{focusedChannel ? `[Channel: ${focusedChannel}]` : ''}
                </span>
              ) : (
                'Real-time transaction stream synchronized with network POS terminals'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(focusedStore || focusedChannel) && (
              <button
                onClick={() => {
                  setFocusedStore(null);
                  setFocusedChannel(null);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg cursor-pointer"
              >
                Clear Feed Filters
              </button>
            )}
            <button
              onClick={() => onNavigateToTab('sales')}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg cursor-pointer"
            >
              View Full POS Ledger →
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Store Location</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentFilteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{sale.orderNumber}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{sale.outletName}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{sale.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                      {sale.channel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{sale.paymentMethod}</td>
                  <td className="py-2.5 px-3 text-right font-black text-slate-900">₹{sale.amount.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK JUMP DIRECT DRILLDOWN MATRIX */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Module Quick-Action & Deep Drilldown Directory
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Instantly jump into any dedicated operational module with pre-filtered context
            </p>
          </div>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
            8 Modules
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'intelligence' as NavTab, label: 'Franchise Intelligence', icon: BrainCircuit, color: 'text-indigo-600 bg-indigo-50 hover:border-indigo-300' },
            { id: 'outlets' as NavTab, label: 'Outlet Performance', icon: Store, color: 'text-emerald-600 bg-emerald-50 hover:border-emerald-300' },
            { id: 'sales' as NavTab, label: 'Sales & POS Feed', icon: IndianRupee, color: 'text-blue-600 bg-blue-50 hover:border-blue-300' },
            { id: 'inventory' as NavTab, label: 'Inventory & Reorders', icon: Package, color: 'text-amber-600 bg-amber-50 hover:border-amber-300' },
            { id: 'staff' as NavTab, label: 'Staff & Shift Quotas', icon: Users, color: 'text-purple-600 bg-purple-50 hover:border-purple-300' },
            { id: 'marketing' as NavTab, label: 'Marketing Campaigns', icon: Megaphone, color: 'text-pink-600 bg-pink-50 hover:border-pink-300' },
            { id: 'audits' as NavTab, label: 'Quality & Compliance', icon: ClipboardCheck, color: 'text-teal-600 bg-teal-50 hover:border-teal-300' },
            { id: 'alerts' as NavTab, label: 'Alerts & Incidents', icon: BellRing, color: 'text-rose-600 bg-rose-50 hover:border-rose-300' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`quick-jump-${item.id}`}
                onClick={() => onNavigateToTab(item.id)}
                className={`p-3.5 rounded-2xl border border-slate-200 transition-all flex items-center justify-between text-left cursor-pointer group hover:shadow-xs ${item.color}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold text-slate-800 truncate">{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* TARGET TUNER MODAL */}
      <AnimatePresence>
        {isTargetsModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-black text-slate-900">Target Benchmark Tuner</h2>
                </div>
                <button
                  id="close-targets-modal-btn"
                  onClick={() => setIsTargetsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Adjust benchmark targets dynamically. All KPI scorecards, progress bars, and chart threshold lines across the entire dashboard will re-calculate instantly.
              </p>

              <div className="space-y-4">
                {/* 1. Daily Sales Target */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">Daily Sales Target Per Outlet:</span>
                    <span className="text-indigo-600 font-mono">₹{dailySalesTargetPerOutlet.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={15000}
                    max={60000}
                    step={2500}
                    value={dailySalesTargetPerOutlet}
                    onChange={(e) => setDailySalesTargetPerOutlet(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>₹15k (Conservative)</span>
                    <span>₹60k (Aggressive)</span>
                  </div>
                </div>

                {/* 2. Audit Pass Standard */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">Audit Compliance Standard:</span>
                    <span className="text-emerald-600 font-mono">{auditPassThreshold}% Pass Score</span>
                  </div>
                  <input
                    type="range"
                    min={70}
                    max={95}
                    step={1}
                    value={auditPassThreshold}
                    onChange={(e) => setAuditPassThreshold(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>70% Minimum</span>
                    <span>95% Gold Standard</span>
                  </div>
                </div>

                {/* 3. Staff Daily Quota */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">Staff Sales Quota Benchmark:</span>
                    <span className="text-purple-600 font-mono">₹{staffDailyQuota.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={8000}
                    max={30000}
                    step={1000}
                    value={staffDailyQuota}
                    onChange={(e) => setStaffDailyQuota(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>₹8k Baseline</span>
                    <span>₹30k Star Seller</span>
                  </div>
                </div>

                {/* 4. Marketing Target ROI */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">Target Marketing ROI Multiplier:</span>
                    <span className="text-pink-600 font-mono">{targetRoiMultiplier}x Return</span>
                  </div>
                  <input
                    type="range"
                    min={1.5}
                    max={6.0}
                    step={0.1}
                    value={targetRoiMultiplier}
                    onChange={(e) => setTargetRoiMultiplier(Number(e.target.value))}
                    className="w-full accent-pink-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>1.5x Baseline</span>
                    <span>6.0x High Growth</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  id="reset-targets-btn"
                  onClick={() => {
                    setDailySalesTargetPerOutlet(30000);
                    setAuditPassThreshold(85);
                    setStaffDailyQuota(15000);
                    setTargetRoiMultiplier(3.5);
                  }}
                  className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Reset Defaults
                </button>
                <button
                  id="apply-targets-btn"
                  onClick={() => {
                    setIsTargetsModalOpen(false);
                    showToast('Target benchmarks applied to all executive dashboards!');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Apply Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPREHENSIVE DATA MODIFIER & SIMULATION DRAWER / MODAL */}
      <AnimatePresence>
        {isDataModifierOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h2 className="text-base font-black text-slate-900">
                    Live Data Mutator & Enterprise Simulator
                  </h2>
                </div>
                <button
                  id="close-modifier-modal-btn"
                  onClick={() => setIsDataModifierOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Execute live operational events to mutate state directly. Observe how the KPIs and charts reactively recalculate instantly across the Executive Dashboard!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Action 1: Inject Sales Spurt */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                    <span>POS Order Generator</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Inject a simulated customer order into the active sales ledger.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleInjectQuickSale(750, 'Takeaway')}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                    >
                      +₹750 Takeaway
                    </button>
                    <button
                      onClick={() => handleInjectQuickSale(2800, 'Dine-In')}
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                    >
                      +₹2,800 Dine-In
                    </button>
                  </div>
                </div>

                {/* Action 2: Stock Replenishment */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Package className="w-4 h-4 text-amber-600" />
                    <span>Inventory Restock</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Restock all low buffer SKUs back to safe buffer levels.
                  </p>
                  <button
                    onClick={handleRestockAllInventory}
                    className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                  >
                    Restock All SKUs Now
                  </button>
                </div>

                {/* Action 3: Staff Presence Maximizer */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Staff Roster Check-In</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Check in all shift crew members to reach 100% roster presence.
                  </p>
                  <button
                    onClick={handleMaximizeStaffAttendance}
                    className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                  >
                    Set 100% Staff Active
                  </button>
                </div>

                {/* Action 4: Resolve Active Incident Alerts */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <BellRing className="w-4 h-4 text-rose-600" />
                    <span>Alert Resolution Dispatch</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Resolve all active operational alerts and mark SLA satisfied.
                  </p>
                  <button
                    onClick={handleResolveAllAlerts}
                    className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                  >
                    Resolve All Active Alerts
                  </button>
                </div>

                {/* Action 5: AI Turnaround Outlets */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 sm:col-span-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <BrainCircuit className="w-4 h-4 text-emerald-600" />
                    <span>AI Autonomous Turnaround Playbook</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Execute automated turnaround on all flagged underperforming outlets, boosting sales past daily quota.
                  </p>
                  <button
                    onClick={handleOptimizeUnderperformingOutlets}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-sm"
                  >
                    Execute Autonomous Turnaround across All Outlets
                  </button>
                </div>

              </div>

              <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                <button
                  id="close-modifier-done-btn"
                  onClick={() => setIsDataModifierOpen(false)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
