import React, { useState, useMemo } from 'react';
import { AlertItem, AlertRule, Outlet } from '../../types';
import { mockAlertRules } from '../../data/mockData';
import { AlertsDashboard } from '../Alerts/AlertsDashboard';
import {
  BellRing,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  Zap,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Thermometer,
  Package,
  Users,
  Settings2,
  Wrench,
  Flame,
  Radio,
  FileCheck,
  Send,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  X,
  RefreshCw,
  BarChart3,
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

interface AlertsPageProps {
  alerts: AlertItem[];
  onSelectOutletForRecovery?: (outletId: string) => void;
  onUpdateAlerts?: (alerts: AlertItem[]) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts: initialAlerts,
  onSelectOutletForRecovery,
  onUpdateAlerts
}) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'incident-center'>('dashboard');
  // Local state for interactive resolution, acknowledging, and testing
  const [localAlerts, setLocalAlerts] = useState<AlertItem[]>(initialAlerts);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(mockAlertRules);

  // Tabs
  const [activeTab, setActiveTab] = useState<'active' | 'rules' | 'resolved' | 'diagnostics'>('active');

  // Filters
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedIncidentForResolve, setSelectedIncidentForResolve] = useState<AlertItem | null>(null);
  const [resolveNotes, setResolveNotes] = useState<string>('');
  const [resolveActionTaken, setResolveActionTaken] = useState<string>('Corrective Action Executed');

  const [showCreateRuleModal, setShowCreateRuleModal] = useState<boolean>(false);
  const [newRuleName, setNewRuleName] = useState<string>('');
  const [newRuleMetric, setNewRuleMetric] = useState<string>('Drive-Thru Wait Time');
  const [newRuleCondition, setNewRuleCondition] = useState<AlertRule['condition']>('Exceeds Threshold');
  const [newRuleThreshold, setNewRuleThreshold] = useState<string>('> 5.0 mins / car');
  const [newRuleSeverity, setNewRuleSeverity] = useState<AlertRule['severity']>('high');
  const [newRuleCategory, setNewRuleCategory] = useState<string>('Staff & Operations');

  const [showSimulateModal, setShowSimulateModal] = useState<boolean>(false);
  const [simOutletName, setSimOutletName] = useState<string>("McDonald's Indiranagar Drive-Thru");
  const [simType, setSimType] = useState<string>('Equipment Malfunction');
  const [simSeverity, setSimSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('critical');
  const [simMessage, setSimMessage] = useState<string>('Deep fryer oil temperature sensor overheating (198°C). Automatic safety shutoff engaged.');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync prop changes
  React.useEffect(() => {
    setLocalAlerts(initialAlerts);
  }, [initialAlerts]);

  // Filtering for Active vs Resolved
  const activeAlerts = useMemo(() => {
    return localAlerts.filter((a) => !a.isResolved);
  }, [localAlerts]);

  const resolvedAlerts = useMemo(() => {
    return localAlerts.filter((a) => a.isResolved);
  }, [localAlerts]);

  const filteredActiveAlerts = useMemo(() => {
    return activeAlerts.filter((a) => {
      if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
      if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchStore = a.outletName.toLowerCase().includes(query);
        const matchType = a.type.toLowerCase().includes(query);
        const matchMsg = a.message.toLowerCase().includes(query);
        if (!matchStore && !matchType && !matchMsg) return false;
      }
      return true;
    });
  }, [activeAlerts, severityFilter, categoryFilter, statusFilter, searchQuery]);

  // Metrics
  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;
  const highCount = activeAlerts.filter((a) => a.severity === 'high').length;
  const mediumCount = activeAlerts.filter((a) => a.severity === 'medium').length;

  // Handle Quick Acknowledge
  const handleAcknowledgeAlert = (alertId: string) => {
    setLocalAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'In Progress' as const } : a))
    );
    showToast('Incident acknowledged and assigned to on-duty response team.');
  };

  // Handle Resolve
  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncidentForResolve) return;

    const updated = localAlerts.map((a) => {
      if (a.id === selectedIncidentForResolve.id) {
        return {
          ...a,
          isResolved: true,
          status: 'Resolved' as const,
          resolvedAt: 'Just now',
          resolvedBy: 'Operations Manager',
          actionTaken: resolveActionTaken + (resolveNotes ? ` - ${resolveNotes}` : ''),
        };
      }
      return a;
    });

    setLocalAlerts(updated);
    if (onUpdateAlerts) onUpdateAlerts(updated);

    showToast(`Incident #${selectedIncidentForResolve.id} marked as RESOLVED.`);
    setSelectedIncidentForResolve(null);
    setResolveNotes('');
  };

  // Handle Create Rule
  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) {
      showToast('Please enter an alert rule name.');
      return;
    }

    const newRule: AlertRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      metric: newRuleMetric,
      condition: newRuleCondition,
      thresholdValue: newRuleThreshold,
      severity: newRuleSeverity,
      category: newRuleCategory,
      isEnabled: true,
      notifyChannels: ['In-App', 'Email', 'Slack'],
    };

    setAlertRules((prev) => [newRule, ...prev]);
    setShowCreateRuleModal(false);
    setNewRuleName('');
    showToast(`Monitoring rule "${newRule.name}" created and active.`);
  };

  // Handle Simulate Anomaly
  const handleSimulateAnomaly = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: AlertItem = {
      id: `alt-sim-${Date.now()}`,
      type: simType,
      outletId: 'o-102',
      outletName: simOutletName,
      message: simMessage,
      timestamp: 'Just now',
      severity: simSeverity,
      isResolved: false,
      status: 'Active',
      category: 'Equipment & IoT',
      recommendedAction: 'Automated safety protocol triggered. Dispatch on-site technician.',
      impactScore: simSeverity === 'critical' ? 92 : simSeverity === 'high' ? 78 : 50,
      assignedTo: 'Shift Supervisor',
    };

    const updated = [newAlert, ...localAlerts];
    setLocalAlerts(updated);
    if (onUpdateAlerts) onUpdateAlerts(updated);

    setShowSimulateModal(false);
    showToast(`⚠️ Anomaly simulated: ${simType} generated for ${simOutletName}!`);
  };

  // Toggle Rule Status
  const toggleRuleStatus = (ruleId: string) => {
    setAlertRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isEnabled: !r.isEnabled } : r))
    );
    showToast('Alert rule status toggled.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ALERTS MODULE VIEW SWITCHER BAR */}
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
            <span>Alerts Dashboard</span>
          </button>

          <button
            onClick={() => {
              setViewMode('incident-center');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === 'incident-center'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Incident Command Center</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setShowSimulateModal(true)}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Simulate Anomaly</span>
          </button>
          <button
            onClick={() => setShowCreateRuleModal(true)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Rule</span>
          </button>
        </div>
      </div>

      {viewMode === 'dashboard' ? (
        <AlertsDashboard
          alerts={localAlerts}
          onAcknowledgeAlert={(id) => handleAcknowledgeAlert(id)}
          onResolveAlert={(alert) => setSelectedIncidentForResolve(alert)}
          onSimulateAlert={() => setShowSimulateModal(true)}
          onCreateRule={() => setShowCreateRuleModal(true)}
          onSelectOutletForRecovery={onSelectOutletForRecovery}
        />
      ) : (
        <>
      {/* Main Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
              Real-Time Incident Command Center
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {activeAlerts.length} Unresolved Flags
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1.5 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <span>Operational Alerts & Incident Diagnostics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated anomaly detection, cold chain telemetry, revenue drop warnings & resolution playbooks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowSimulateModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Flame className="w-4 h-4" />
            <span>Simulate Anomaly</span>
          </button>

          <button
            onClick={() => setShowCreateRuleModal(true)}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>New Alert Rule</span>
          </button>
        </div>
      </div>

      {/* KPI Severity & Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Critical Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-rose-700 text-[11px] font-extrabold uppercase tracking-wider">Critical Anomalies</span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-rose-950">{criticalCount}</span>
            <span className="text-rose-700 text-xs font-extrabold bg-rose-50 px-2 py-0.5 rounded-full">
              Requires Immediate Action
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Freezer breaches, revenue &gt;15% drops</p>
        </div>

        {/* Card 2: High & Medium Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-amber-700 text-[11px] font-extrabold uppercase tracking-wider">High / Medium Flags</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{highCount + mediumCount}</span>
            <span className="text-amber-800 text-xs font-extrabold bg-amber-50 px-2 py-0.5 rounded-full">
              {highCount} High • {mediumCount} Med
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Stock replenishment & shift rosters</p>
        </div>

        {/* Card 3: MTTR Metric */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[11px] font-extrabold uppercase tracking-wider">Avg MTTR (Resolution Time)</span>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">22.4m</span>
            <span className="text-emerald-700 text-xs font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full">
              -14% vs Target
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Target SLA benchmark: &lt; 30 minutes</p>
        </div>

        {/* Card 4: Network Diagnostic Health */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[11px] font-extrabold uppercase tracking-wider">Network Health Reliability</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-700">94.8%</span>
            <span className="text-emerald-800 text-xs font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full">
              Normal
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">5/6 franchise outlets fully operational</p>
        </div>
      </div>

      {/* ALERTS KPI ANALYTICAL CHARTS DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Outlets Incident Frequency vs Resolution SLA */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Incident Volume by Store vs Resolution SLA (Mins)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Distribution of operational flags benchmarked against 30-min SLA ceiling
              </p>
            </div>
            <span className="px-2 py-0.5 bg-rose-50 text-rose-800 text-[10px] font-mono font-bold rounded">
              SLA Pacing
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'MCD T Nagar', incidents: 3, avgResolution: 28, sla: 30 },
                  { name: 'KFC Bandra', incidents: 2, avgResolution: 22, sla: 30 },
                  { name: 'Domino CP', incidents: 1, avgResolution: 14, sla: 30 },
                  { name: 'MCD Indira', incidents: 1, avgResolution: 18, sla: 30 },
                  { name: 'DOM Hitec', incidents: 0, avgResolution: 8, sla: 30 },
                  { name: 'KFC Park St', incidents: 1, avgResolution: 24, sla: 30 },
                ]}
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
                          <p className="font-black text-rose-400">{d.name}</p>
                          <p className="text-slate-300">Active Incidents: <strong className="text-white">{d.incidents}</strong></p>
                          <p className="text-slate-300">Avg MTTR: <strong className="text-amber-400">{d.avgResolution} mins</strong></p>
                          <p className="text-slate-300">SLA Standard: <strong className="text-slate-300">{d.sla} mins</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avgResolution" name="Avg MTTR (Mins)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sla" name="SLA Ceiling (30m)" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Avg MTTR</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> SLA Standard (30m)</span>
            <span className="font-bold text-slate-700">All Stores within SLA</span>
          </div>
        </div>

        {/* Chart 2: Incident Root Cause Categories */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Incident Category Mix
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Root causes of triggered alerts
              </p>
            </div>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[10px] font-mono font-bold rounded">
              Root Causes
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'IoT Cold Chain', value: localAlerts.filter((a) => a.category?.includes('IoT') || a.type.includes('Freezer')).length || 2 },
                    { name: 'Stock & Inventory', value: localAlerts.filter((a) => a.category?.includes('Stock') || a.type.includes('Stock')).length || 2 },
                    { name: 'Revenue & Sales', value: localAlerts.filter((a) => a.category?.includes('Sales') || a.type.includes('Drop')).length || 1 },
                    { name: 'Staff Attendance', value: localAlerts.filter((a) => a.category?.includes('Staff') || a.type.includes('Shift')).length || 1 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {['#f43f5e', '#6366f1', '#f59e0b', '#10b981'].map((c, i) => (
                    <Cell key={`alt-cell-${i}`} fill={c} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val} Incidents`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Critical: {criticalCount} Alerts</span>
            <span className="font-bold text-rose-600">{activeAlerts.length} Active Total</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'active'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>1. Active Incidents ({activeAlerts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'rules'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>2. Monitoring Rules & Thresholds ({alertRules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'resolved'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>3. Resolution Log & Audit Trail ({resolvedAlerts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'diagnostics'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>4. Automated Remediation Playbooks</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE INCIDENTS */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search store, issue, or error code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">All Categories</option>
                <option value="Revenue & Sales">Revenue & Sales</option>
                <option value="Inventory & Supply">Inventory & Supply</option>
                <option value="Health & Hygiene">Health & Hygiene</option>
                <option value="Equipment & IoT">Equipment & IoT</option>
                <option value="Staff & Operations">Staff & Operations</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">All Status</option>
                <option value="Active">Active / New</option>
                <option value="In Progress">In Progress</option>
                <option value="Acknowledged">Acknowledged</option>
              </select>

              {(severityFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSeverityFilter('all');
                    setCategoryFilter('all');
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Alert Cards List */}
          <div className="space-y-3.5">
            {filteredActiveAlerts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-base font-black text-slate-900">All Operational Parameters Normal</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No active incidents matching the selected criteria. All store systems and telemetry feeds are in compliant state.
                </p>
              </div>
            ) : (
              filteredActiveAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`bg-white p-5 rounded-2xl border transition-all shadow-xs space-y-3.5 ${
                    alt.severity === 'critical'
                      ? 'border-rose-300 ring-1 ring-rose-100'
                      : alt.severity === 'high'
                      ? 'border-amber-300'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Top Bar of Alert Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        alt.severity === 'critical'
                          ? 'bg-rose-100 text-rose-900'
                          : alt.severity === 'high'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          alt.severity === 'critical' ? 'bg-rose-600 animate-ping' : 'bg-amber-500'
                        }`} />
                        {alt.severity} Severity
                      </span>

                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                        {alt.category || 'Operations'}
                      </span>

                      <span className="text-[11px] font-mono text-slate-400 font-bold">• {alt.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Status:</span>
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        alt.status === 'In Progress'
                          ? 'bg-indigo-50 text-indigo-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}>
                        {alt.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Main Body */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 text-sm sm:text-base">{alt.type}</h3>
                        <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {alt.outletName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{alt.message}</p>

                      {alt.recommendedAction && (
                        <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-900 font-bold block">Recommended Automated Playbook:</strong>
                            <span className="text-slate-600">{alt.recommendedAction}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Info / Assignee */}
                    <div className="w-full md:w-56 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 shrink-0 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] font-bold block uppercase">Assigned Responder</span>
                        <strong className="text-slate-800">{alt.assignedTo || 'On-Duty GM'}</strong>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] font-bold block uppercase">Impact Rating</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-500 rounded-full"
                              style={{ width: `${alt.impactScore || 70}%` }}
                            />
                          </div>
                          <span className="font-extrabold text-slate-800 text-[11px]">{alt.impactScore || 70}/100</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {alt.status !== 'In Progress' && (
                        <button
                          onClick={() => handleAcknowledgeAlert(alt.id)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          Acknowledge & Assign
                        </button>
                      )}

                      <button
                        onClick={() => onSelectOutletForRecovery?.(alt.outletId)}
                        className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Launch Store Recovery</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setSelectedIncidentForResolve(alt)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Execute Resolution</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MONITORING RULES & POLICIES */}
      {activeTab === 'rules' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-600" />
                <span>Automated Anomaly Rules & Threshold Guards</span>
              </h3>
              <p className="text-xs text-slate-500">Autonomous triggers continuously evaluating POS, cold chain, and inventory streams.</p>
            </div>
            <button
              onClick={() => setShowCreateRuleModal(true)}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add Custom Threshold</span>
            </button>
          </div>

          <div className="space-y-3">
            {alertRules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{rule.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      rule.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rule.severity}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-semibold rounded">
                      {rule.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Trigger condition: <strong className="text-slate-900">{rule.metric}</strong> {rule.condition} <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-emerald-800 font-bold">{rule.thresholdValue}</code>
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Channels:</span>
                    {rule.notifyChannels.map((ch) => (
                      <span key={ch} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => toggleRuleStatus(rule.id)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition-colors cursor-pointer ${
                      rule.isEnabled
                        ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {rule.isEnabled ? 'Active & Guarding' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RESOLVED AUDIT TRAIL */}
      {activeTab === 'resolved' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Incident Resolution Ledger & CAP Audit Trail</span>
            </h3>
            <p className="text-xs text-slate-500">Historical archive of resolved alerts with recorded root cause analysis.</p>
          </div>

          <div className="space-y-3">
            {resolvedAlerts.map((alt) => (
              <div key={alt.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Resolved
                    </span>
                    <strong className="text-xs font-black text-slate-900">{alt.type}</strong>
                    <span className="text-xs font-bold text-slate-600">• {alt.outletName}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Resolved: {alt.resolvedAt || 'Today'} by {alt.resolvedBy || 'Admin'}</span>
                </div>

                <p className="text-xs text-slate-600">{alt.message}</p>

                {alt.actionTaken && (
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
                    <strong className="font-bold">Remediation Action Log:</strong> {alt.actionTaken}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUTOMATED REMEDIATION PLAYBOOKS */}
      {activeTab === 'diagnostics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Revenue Pacing Deficit Playbook</h4>
                <p className="text-[11px] text-slate-500">Autonomous workflow when outlet sales fall &gt;10% below budget</p>
              </div>
            </div>
            <ul className="text-xs space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                <span>Evaluate local footfall vs average ticket size drop.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                <span>Auto-draft a 15% Combo Upsell campaign targeting nearby customer radius.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                <span>Alert District Manager to perform mid-shift staffing adjustment.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Cold Chain Telemetry Breach</h4>
                <p className="text-[11px] text-slate-500">Safety escalation when chiller sensor logs &gt;4°C</p>
              </div>
            </div>
            <ul className="text-xs space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                <span>Send SMS warning to on-duty Store Manager within 3 minutes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                <span>Auto-quarantine vulnerable perishable inventory batches in POS.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                <span>Dispatch HVAC maintenance technician with high priority ticket.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
      </>
      )}

      {/* RESOLVE INCIDENT MODAL */}
      {selectedIncidentForResolve && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-extrabold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                  Incident Remediation
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Resolve Incident: {selectedIncidentForResolve.type}</h3>
                <p className="text-xs text-slate-500">{selectedIncidentForResolve.outletName}</p>
              </div>
              <button
                onClick={() => setSelectedIncidentForResolve(null)}
                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmResolve} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Reported Problem</span>
                <p className="text-slate-800 font-medium mt-0.5">{selectedIncidentForResolve.message}</p>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Corrective Action Taken</label>
                <select
                  value={resolveActionTaken}
                  onChange={(e) => setResolveActionTaken(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  <option value="Emergency Restock PO Dispatched">Emergency Restock PO Dispatched</option>
                  <option value="Technician Dispatched & Thermostat Calibrated">Technician Dispatched & Thermostat Calibrated</option>
                  <option value="Shift Staffing Reallocated from Cluster Outlet">Shift Staffing Reallocated from Cluster Outlet</option>
                  <option value="Flash Promo Launched & Revenue Restored">Flash Promo Launched & Revenue Restored</option>
                  <option value="IoT Device Gateway Rebooted">IoT Device Gateway Rebooted</option>
                  <option value="Other Corrective Action">Other Corrective Action</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Root Cause & Resolution Notes (Optional)</label>
                <textarea
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                  placeholder="Explain why the anomaly occurred and preventative measures taken..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedIncidentForResolve(null)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Confirm Resolution</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ALERT RULE MODAL */}
      {showCreateRuleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-extrabold text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded-full">
                  Rule Engine Config
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Configure New Threshold Guard</h3>
              </div>
              <button
                onClick={() => setShowCreateRuleModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3.5 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Rule Name</label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g., Drive-Thru Speed SLA Breach"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Monitored Metric</label>
                  <select
                    value={newRuleMetric}
                    onChange={(e) => setNewRuleMetric(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Drive-Thru Wait Time">Drive-Thru Wait Time</option>
                    <option value="Walk-in Chiller Temp">Walk-in Chiller Temp</option>
                    <option value="Hourly Revenue Pace">Hourly Revenue Pace</option>
                    <option value="Stock Level SKU">Stock Level SKU</option>
                    <option value="Customer Rating (CSAT)">Customer Rating (CSAT)</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Condition</label>
                  <select
                    value={newRuleCondition}
                    onChange={(e) => setNewRuleCondition(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Exceeds Threshold">Exceeds Threshold</option>
                    <option value="Less Than">Less Than</option>
                    <option value="Greater Than">Greater Than</option>
                    <option value="Drops By %">Drops By %</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Threshold Value</label>
                  <input
                    type="text"
                    value={newRuleThreshold}
                    onChange={(e) => setNewRuleThreshold(e.target.value)}
                    placeholder="e.g. > 5.0 mins"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Severity Level</label>
                  <select
                    value={newRuleSeverity}
                    onChange={(e) => setNewRuleSeverity(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateRuleModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs"
                >
                  Save & Enable Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIMULATE ANOMALY MODAL */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-extrabold text-rose-700 uppercase bg-rose-50 px-2 py-0.5 rounded-full">
                  Test Diagnostic Anomaly
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Simulate Incident Trigger</h3>
              </div>
              <button
                onClick={() => setShowSimulateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulateAnomaly} className="space-y-3.5 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Target Outlet</label>
                <input
                  type="text"
                  value={simOutletName}
                  onChange={(e) => setSimOutletName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Incident Type</label>
                  <select
                    value={simType}
                    onChange={(e) => setSimType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Equipment Malfunction">Equipment Malfunction</option>
                    <option value="Critical Revenue Drop">Critical Revenue Drop</option>
                    <option value="Inventory Outage">Inventory Outage</option>
                    <option value="Low Health Score">Low Health Score</option>
                    <option value="Staff Shortage">Staff Shortage</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Severity</label>
                  <select
                    value={simSeverity}
                    onChange={(e) => setSimSeverity(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Diagnostic Alert Message</label>
                <textarea
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Flame className="w-4 h-4" />
                  <span>Trigger Incident</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
