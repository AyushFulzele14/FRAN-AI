import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Zap,
  Bot,
  Activity,
  ArrowRight,
  RefreshCw,
  Clock,
  Wrench,
  Sliders,
  Send,
  Layers,
  Search,
  Filter,
  Check,
  ChevronDown,
  BarChart3,
  PieChart as PieIcon,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IntelligenceDashboard } from '../Intelligence/IntelligenceDashboard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { Outlet, IntelligenceProblemCase, AIRootCauseDiagnosis } from '../../types';
import {
  mockIntelligenceProblems,
  mockPredictiveForecasts,
  mockAutonomousAgents,
  mockEnterpriseSynergies,
} from '../../data/intelligenceData';

interface IntelligencePageProps {
  outlets: Outlet[];
  onNavigateToOutlets?: () => void;
}

export const IntelligencePage: React.FC<IntelligencePageProps> = ({
  outlets,
}) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'operations'>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<
    'problems' | 'radar' | 'agents' | 'synergy' | 'simulator'
  >('problems');

  // Problem Solver State
  const [problems, setProblems] = useState<IntelligenceProblemCase[]>(mockIntelligenceProblems);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Custom Issue Query Input
  const [customQuery, setCustomQuery] = useState<string>('');
  const [customOutletId, setCustomOutletId] = useState<string>(outlets[0]?.id || 'all');
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  
  // Deep-dive Diagnosis Modal
  const [activeDiagnosis, setActiveDiagnosis] = useState<AIRootCauseDiagnosis | null>(null);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState<boolean>(false);
  const [executedActions, setExecutedActions] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Network Diagnostic Scanner Animation State
  const [isScanningNetwork, setIsScanningNetwork] = useState<boolean>(false);

  // "What-If" Scenario Simulator States
  const [supplyCostChange, setSupplyCostChange] = useState<number>(0);
  const [deliverySurge, setDeliverySurge] = useState<number>(15);
  const [laborOvertimeWage, setLaborOvertimeWage] = useState<number>(5);
  const [expansionUnits, setExpansionUnits] = useState<number>(2);

  // Trigger Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Run AI Network Scan
  const handleRunNetworkScan = () => {
    setIsScanningNetwork(true);
    setTimeout(() => {
      setIsScanningNetwork(false);
      showToast('Network-wide AI telemetry scan completed. 6 key operational vectors analyzed.');
    }, 1200);
  };

  // Trigger Deep AI Diagnosis for a Problem Case
  const handleOpenProblemDiagnosis = async (problem: IntelligenceProblemCase) => {
    setIsDiagnosing(true);
    setIsDiagnosisModalOpen(true);
    setActiveDiagnosis(null);

    const targetOutlet = outlets.find((o) => problem.affectedOutlets.some(ao => ao.includes(o.code) || ao.includes(o.city))) || outlets[0];

    try {
      const res = await fetch('/api/ai/solve-franchise-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem.title,
          category: problem.category,
          outletName: targetOutlet ? `${targetOutlet.name} (${targetOutlet.city})` : 'All Outlets',
          severity: problem.severity,
          customDetails: problem.description,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveDiagnosis(data);
      } else {
        throw new Error('Fallback trigger');
      }
    } catch {
      // Offline / fallback structure
      setActiveDiagnosis({
        problemTitle: problem.title,
        analyzedOutletName: targetOutlet ? `${targetOutlet.name} (${targetOutlet.city})` : 'Multi-Store Network',
        severity: problem.severity,
        confidenceScore: 95,
        primaryRootCause: problem.rootCauseSummary,
        contributingFactors: [
          'High order concurrency exceeding standard assembly station capacity during rush windows.',
          'Slight discrepancy between supplier delivery lead-time and real-time inventory par levels.',
          'Staff station rotation not synchronized with real-time daypart order velocity.',
        ],
        immediateRemedy24H: [
          'Enforce dynamic prep batching protocol at primary assembly station.',
          'Assign designated courier handoff coordinator to reduce dwell time.',
          'Lock automated inventory safety buffers for top 5 fast-moving SKUs.',
        ],
        systemicPlan30D: [
          {
            phase: 'Phase 1 (Days 1-7)',
            action: 'Audit operational cadence and update shift manager digital checklist.',
            expectedMetricImpact: '30% reduction in peak delay',
          },
          {
            phase: 'Phase 2 (Days 8-20)',
            action: 'Implement cross-station agility training and speed-of-service incentive pool.',
            expectedMetricImpact: 'Order accuracy reaches 99.2%',
          },
          {
            phase: 'Phase 3 (Days 21-30)',
            action: 'Automate weekly AI staff rostering and predictive prep algorithms.',
            expectedMetricImpact: `+₹${(problem.estimatedLossRupees * 0.85).toLocaleString()} monthly profit recovery`,
          },
        ],
        projectedFinancialRecoveryRupees: Math.round(problem.estimatedLossRupees * 0.85),
        automatedPolicyActions: [
          {
            id: `act-${problem.id}-1`,
            label: 'Deploy Automated KDS Queuing',
            description: 'Dynamically reorders kitchen tickets based on real-time driver delivery telemetry.',
            targetModule: 'Operations',
          },
          {
            id: `act-${problem.id}-2`,
            label: 'Trigger AI Flex-Shift Rebalance',
            description: 'Adds flexible surge coverage for upcoming high-traffic weekend windows.',
            targetModule: 'Staff Roster',
          },
          {
            id: `act-${problem.id}-3`,
            label: 'Update Inventory Safety Trigger',
            description: 'Recalculates reorder threshold on perishable goods to eliminate stockout risk.',
            targetModule: 'Inventory',
          },
        ],
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Handle Custom User Problem Submission
  const handleSolveCustomProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    setIsDiagnosing(true);
    setIsDiagnosisModalOpen(true);
    setActiveDiagnosis(null);

    const targetOutlet = outlets.find((o) => o.id === customOutletId) || outlets[0];

    try {
      const res = await fetch('/api/ai/solve-franchise-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: customQuery,
          category: 'Custom Operations Dilemma',
          outletName: targetOutlet ? `${targetOutlet.name} (${targetOutlet.city})` : 'Target Franchise Outlet',
          severity: 'High',
          customDetails: customQuery,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveDiagnosis(data);
      } else {
        throw new Error('Fallback trigger');
      }
    } catch {
      setActiveDiagnosis({
        problemTitle: customQuery,
        analyzedOutletName: targetOutlet ? `${targetOutlet.name} (${targetOutlet.city})` : 'Target Location',
        severity: 'High',
        confidenceScore: 92,
        primaryRootCause: `Cognitive pattern analysis reveals workflow synchronization gaps and demand-supply misalignment for "${customQuery}".`,
        contributingFactors: [
          'Unscheduled peak demand surge creating order execution friction.',
          'Resource allocation not calibrated with real-time footfall patterns.',
          'Standard operating procedure (SOP) deviation during high-volume periods.',
        ],
        immediateRemedy24H: [
          'Trigger immediate station re-allocation for on-duty shift supervisor.',
          'Deploy automated customer messaging update to protect CSAT rating.',
          'Calibrate par stock reorders to avoid cascading inventory bottlenecks.',
        ],
        systemicPlan30D: [
          {
            phase: 'Immediate Turnaround',
            action: 'Implement standardized corrective protocol and supervisor checklist.',
            expectedMetricImpact: 'Immediate 40% friction reduction',
          },
          {
            phase: 'Systemic Alignment',
            action: 'Configure automated IoT sensors and predictive alert triggers.',
            expectedMetricImpact: 'Zero recurring failure incidents',
          },
          {
            phase: 'Long-term Optimization',
            action: 'Integrate machine-learning demand forecasting into weekly procurement cycles.',
            expectedMetricImpact: '+₹140,000 monthly margin protection',
          },
        ],
        projectedFinancialRecoveryRupees: 140000,
        automatedPolicyActions: [
          {
            id: 'custom-act-1',
            label: 'Activate Smart Flow Remediation',
            description: 'Applies automated workload distribution to reduce turnaround latency.',
            targetModule: 'Operations',
          },
          {
            id: 'custom-act-2',
            label: 'Lock Predictive Stock Guardrails',
            description: 'Recalculates replenishment cycles for high-consumption items.',
            targetModule: 'Inventory',
          },
        ],
      });
    } finally {
      setIsDiagnosing(false);
      setCustomQuery('');
    }
  };

  // Execute an Automated AI Policy Action
  const handleExecutePolicyAction = (actionId: string, actionLabel: string) => {
    setExecutedActions((prev) => ({ ...prev, [actionId]: true }));
    showToast(`AI Policy Applied: "${actionLabel}" has been deployed across the fleet.`);
  };

  // Filter problems by category & search
  const filteredProblems = problems.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate Total Network Leakage Preventable
  const totalPreventableLeakage = problems.reduce((acc, curr) => acc + curr.estimatedLossRupees, 0);

  // Scenario Simulator Calculations
  const baseMonthlyNetRevenue = 2850000; // Base network revenue in INR
  const simulatedNetRevenue = Math.round(
    baseMonthlyNetRevenue * (1 + deliverySurge * 0.008) * (1 + expansionUnits * 0.14)
  );
  const simulatedMarginDelta = Math.round(
    (deliverySurge * 14000 + expansionUnits * 120000) - (supplyCostChange * 22000 + laborOvertimeWage * 16000)
  );

  return (
    <div id="franchise-intelligence-page" className="space-y-6 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center gap-3 text-sm"
          >
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INTELLIGENCE MODULE VIEW SWITCHER BAR */}
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
            <span>Intelligence Dashboard</span>
          </button>

          <button
            onClick={() => {
              setViewMode('operations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === 'operations'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Wrench className="w-4 h-4 text-indigo-400" />
            <span>Root-Cause Diagnostic & Solvers</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleRunNetworkScan}
            disabled={isScanningNetwork}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanningNetwork ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{isScanningNetwork ? 'Scanning...' : 'Run Network AI Scan'}</span>
          </button>
        </div>
      </div>

      {viewMode === 'dashboard' ? (
        <IntelligenceDashboard
          outlets={outlets}
          onNavigateSubTab={(tab) => {
            setActiveSubTab(tab);
            setViewMode('operations');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <>
      {/* Header & Fleet Intelligence Command Center */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" />
                Gemini 3.7 Cognitive Engine
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Fleet Diagnostics Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Franchise Intelligence & Autonomous Problem Solvers
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-3xl leading-relaxed">
              Real-time AI root-cause analysis, 1-click operational remediation, predictive risk modeling, and multi-unit SOP transfer engine for your entire franchise network.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunNetworkScan}
              disabled={isScanningNetwork}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border border-slate-200"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanningNetwork ? 'animate-spin text-emerald-600' : ''}`} />
              <span>{isScanningNetwork ? 'Scanning Fleet...' : 'Run Network AI Scan'}</span>
            </button>
          </div>
        </div>

        {/* Executive KPI Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Network Resiliency</span>
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">94.8%</p>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +3.2% vs last quarter
            </p>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Monthly Margin Recovered</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
              ₹{(totalPreventableLeakage / 100000).toFixed(2)} Lakhs
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Across {problems.length} detected friction points
            </p>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Active Autonomous Agents</span>
              <Bot className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">5 Agents</p>
            <p className="text-[11px] text-indigo-600 font-bold mt-0.5">
              85 automated interventions today
            </p>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Average Problem Fix Time</span>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">&lt; 2.4 Hours</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              88% faster than manual audits
            </p>
          </div>
        </div>

        {/* INTELLIGENCE KPI ANALYTICAL CHARTS DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-100">
          {/* Chart 1: Financial Leakage Preventable vs Target Pacing */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-3 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-black text-slate-900">
                    Estimated Operational Leakage by Domain (₹ Thousands)
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Financial loss preventable through automated AI action playbooks
                </p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded">
                Profit Guard
              </span>
            </div>

            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={problems.map((p) => ({
                    name: p.category.split(' ')[0],
                    fullName: p.title,
                    loss: Math.round(p.estimatedLossRupees / 1000),
                    confidence: p.confidenceScore,
                    severity: p.severity,
                  }))}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `₹${v}k`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-xl">
                            <p className="font-black text-emerald-400">{d.fullName}</p>
                            <p className="text-slate-300">Preventable Loss: <strong className="text-rose-400">₹{d.loss}k / mo</strong></p>
                            <p className="text-slate-300">AI Confidence: <strong className="text-emerald-400">{d.confidence}%</strong></p>
                            <p className="text-slate-300">Severity: <strong className="text-amber-400">{d.severity}</strong></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="loss" name="Preventable Loss (₹k)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Preventable Margin Risk</span>
              <span className="font-bold text-slate-800">Total: ₹{(totalPreventableLeakage / 1000).toLocaleString()}k Recoverable</span>
            </div>
          </div>

          {/* Chart 2: Autonomous Agent Workload Share */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-black text-slate-900">
                    Agent Action Distribution
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Interventions dispatched by agent role
                </p>
              </div>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold rounded">
                Live Agents
              </span>
            </div>

            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Shift & Roster Agent', value: 35 },
                      { name: 'Cold Chain IoT Agent', value: 25 },
                      { name: 'Stock Replenish Agent', value: 20 },
                      { name: 'Revenue Pacing Agent', value: 12 },
                      { name: 'Audit Compliance Agent', value: 8 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4'].map((c, i) => (
                      <Cell key={`agent-cell-${i}`} fill={c} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val}% of Interventions`, 'Share']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              <span>Leading: Shift Roster (35%)</span>
              <span className="font-bold text-indigo-600">85 Daily Tasks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 custom-scrollbar">
        <button
          onClick={() => setActiveSubTab('problems')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'problems'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4 text-emerald-400" />
          <span>AI Problem & Resolution Solver</span>
          <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-full font-black">
            {problems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('radar')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'radar'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Predictive Anomaly & Risk Radar</span>
        </button>

        <button
          onClick={() => setActiveSubTab('agents')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'agents'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bot className="w-4 h-4 text-indigo-400" />
          <span>Autonomous AI Operations Agents</span>
          <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] rounded-full font-black">
            5 Active
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('synergy')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'synergy'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Multi-Store Benchmark & SOP Transfer</span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'simulator'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4 text-pink-400" />
          <span>"What-If" Enterprise Simulator</span>
        </button>
      </div>

      {/* TAB 1: AI PROBLEM & RESOLUTION SOLVER */}
      {activeSubTab === 'problems' && (
        <div className="space-y-6">
          {/* Custom Dilemma AI Query Bar */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-md border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Direct AI Diagnostic Solver
              </span>
            </div>
            <h3 className="text-lg font-black text-white">
              Describe Any Custom Store Dilemma or Operational Bottleneck
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              The AI will parse your franchise telemetry, pinpoint root causes, and output a 24-hour remedy + 30-day turnaround plan.
            </p>

            <form onSubmit={handleSolveCustomProblem} className="mt-4 flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-60">
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Target Outlet</label>
                <div className="relative">
                  <select
                    value={customOutletId}
                    onChange={(e) => setCustomOutletId(e.target.value)}
                    className="w-full bg-slate-800/90 text-white text-xs font-bold rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-hidden focus:border-emerald-500 appearance-none pr-8 cursor-pointer"
                  >
                    <option value="all">Network-Wide Fleet</option>
                    {outlets.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.city})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="flex-1 w-full">
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Operational Problem Description</label>
                <div className="relative">
                  <input
                    type="text"
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="e.g. Bandra drive-thru fryer bottleneck causes 8-minute delivery courier delay..."
                    className="w-full bg-slate-800/90 text-white placeholder:text-slate-500 text-xs sm:text-sm rounded-xl px-4 py-2.5 border border-slate-700 focus:outline-hidden focus:border-emerald-500 pr-10"
                  />
                  <Send className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isDiagnosing || !customQuery.trim()}
                className="w-full sm:w-auto mt-2 sm:mt-5 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md whitespace-nowrap"
              >
                <BrainCircuit className="w-4 h-4 text-slate-950" />
                <span>{isDiagnosing ? 'Diagnosing...' : 'Generate AI Solution'}</span>
              </button>
            </form>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 custom-scrollbar">
              <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              {['All', 'Operations', 'Inventory & Cost', 'Staffing & Labor', 'Customer Experience', 'Pricing & Margin', 'Expansion'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Problem Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProblems.map((problem) => {
              const isCritical = problem.severity === 'Critical';
              const isHigh = problem.severity === 'High';

              return (
                <div
                  key={problem.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 transition-all group"
                >
                  <div>
                    {/* Severity Badge & Category */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {problem.category}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800'
                            : isHigh
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {problem.severity}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                      {problem.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {problem.description}
                    </p>

                    {/* Affected Outlets */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {problem.affectedOutlets.map((out, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                          📍 {out}
                        </span>
                      ))}
                    </div>

                    {/* AI Root-Cause Highlight Box */}
                    <div className="mt-3.5 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-800 mb-1">
                        <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" />
                        <span>AI Root-Cause Diagnosis</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-normal">
                        {problem.rootCauseSummary}
                      </p>
                    </div>

                    {/* Potential Loss & Projected ROI */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Estimated Impact</span>
                        <span className="font-black text-rose-700">₹{(problem.estimatedLossRupees / 1000).toFixed(0)}k / mo</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">AI Recovery ROI</span>
                        <span className="font-bold text-emerald-700">{problem.roiProjection.split(';')[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trigger Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenProblemDiagnosis(problem)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Solve with AI & View SOP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PREDICTIVE ANOMALY & RISK RADAR */}
      {activeSubTab === 'radar' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  14-30 Day Multi-Store Predictive Anomaly Radar
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proactive forecasting across 4 critical risk dimensions: Stockout Probability, Labor Fatigue, CSAT Erosion, and Margin Squeeze.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-rose-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High/Critical Risk (&gt;60%)
                </span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Safe (&lt;30%)
                </span>
              </div>
            </div>

            {/* Risk Chart Overview */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockPredictiveForecasts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="outletName" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => val.split(' ')[0] + ' ' + val.split(' ')[1]} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                    formatter={(val: any, name: any) => [`${val}% Risk`, name]}
                  />
                  <Bar dataKey="stockoutRisk" name="Stockout Risk" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="laborFatigueIndex" name="Labor Fatigue" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="csatDropProbability" name="CSAT Risk" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="marginErosionRisk" name="Margin Risk" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Multi-Store Risk Breakdown Table */}
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-slate-400">
                    <th className="pb-3">Outlet Store</th>
                    <th className="pb-3 text-center">Stockout Risk</th>
                    <th className="pb-3 text-center">Labor Fatigue</th>
                    <th className="pb-3 text-center">CSAT Risk</th>
                    <th className="pb-3 text-center">Margin Risk</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">AI Preventive Prescription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockPredictiveForecasts.map((f) => (
                    <tr key={f.outletId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 font-bold text-slate-900">
                        {f.outletName}
                        <span className="block text-[10px] text-slate-400 font-normal">{f.city}</span>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className={`font-bold ${f.stockoutRisk > 50 ? 'text-rose-600' : 'text-slate-700'}`}>
                          {f.stockoutRisk}%
                        </span>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className={`font-bold ${f.laborFatigueIndex > 65 ? 'text-rose-600 font-black' : 'text-slate-700'}`}>
                          {f.laborFatigueIndex}%
                        </span>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className={`font-bold ${f.csatDropProbability > 50 ? 'text-amber-600' : 'text-slate-700'}`}>
                          {f.csatDropProbability}%
                        </span>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className={`font-bold ${f.marginErosionRisk > 45 ? 'text-rose-600' : 'text-slate-700'}`}>
                          {f.marginErosionRisk}%
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                            f.overallRiskLevel === 'Critical'
                              ? 'bg-rose-100 text-rose-800'
                              : f.overallRiskLevel === 'Elevated'
                              ? 'bg-amber-100 text-amber-800'
                              : f.overallRiskLevel === 'Medium'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {f.overallRiskLevel}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-700 font-medium max-w-xs">
                        <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-100 text-[11px]">
                          <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{f.topPreventiveAction}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUTONOMOUS AI OPERATIONS AGENTS */}
      {activeSubTab === 'agents' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-600" />
                  Fleet Autonomous AI Agents Running 24/7
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Self-governing operational copilots optimizing labor shifts, kitchen display queues, cold storage, and procurement continuously.
                </p>
              </div>

              <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All 5 Autonomous Agents Synchronized</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {mockAutonomousAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                        {agent.domain}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {agent.status}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900">{agent.name}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{agent.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/80 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">24H Actions</span>
                        <p className="font-black text-slate-900 mt-0.5">{agent.decisionsLast24H} decisions</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Monthly Savings</span>
                        <p className="font-black text-emerald-700 mt-0.5">₹{(agent.monthlyRupeesSaved / 1000).toFixed(0)}k</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Confidence</span>
                        <p className="font-black text-indigo-700 mt-0.5">{agent.accuracyRate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Last Action Log */}
                  <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Latest Autonomous Event:</span>
                      <span className="font-semibold">{agent.lastAction}</span>
                    </div>
                    <button
                      onClick={() => showToast(`Triggered instant manual calibration for ${agent.name}.`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] cursor-pointer"
                    >
                      Calibrate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MULTI-STORE BENCHMARK & SOP TRANSFER */}
      {activeSubTab === 'synergy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                Cross-Store Benchmark & Automated SOP Transfer
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                The AI analyzes high-margin, top-performing stores and automatically generates standardized operating protocols for underperforming units.
              </p>
            </div>

            <div className="space-y-4">
              {mockEnterpriseSynergies.map((syn, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        {syn.benchmarkTitle}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/70">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase block">Top Performer Benchmark</span>
                        <strong className="text-emerald-950 font-black">{syn.topPerformer}</strong>
                      </div>

                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70">
                        <span className="text-[10px] font-bold text-amber-800 uppercase block">Target Outlet for Uplift</span>
                        <strong className="text-amber-950 font-black">{syn.laggingPerformer}</strong>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                      <p className="text-slate-800 font-medium">
                        <strong className="text-indigo-700 font-bold">AI Operational Synthesis: </strong>
                        {syn.aiInsight}
                      </p>
                      <p className="text-slate-800 font-medium">
                        <strong className="text-emerald-700 font-bold">Transferable SOP Protocol: </strong>
                        {syn.transferableSOP}
                      </p>
                    </div>
                  </div>

                  <div className="lg:w-64 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-6 pt-4 lg:pt-0">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Expected Network Uplift</span>
                      <p className="text-sm font-black text-emerald-700 mt-0.5">{syn.expectedGains}</p>
                    </div>

                    <button
                      onClick={() => showToast(`SOP Training Module dispatched to ${syn.laggingPerformer}.`)}
                      className="mt-4 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Deploy SOP to Store</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WHAT-IF ENTERPRISE SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-pink-500" />
                "What-If" Enterprise Scenario Simulator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate macro shocks, inflation variances, volume surges, and new outlet openings to test franchise resilience.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Simulator Sliders */}
              <div className="space-y-5 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                    <span>Ingredient / Supply Wholesale Shock:</span>
                    <span className="font-black text-rose-600">{supplyCostChange > 0 ? `+${supplyCostChange}%` : `${supplyCostChange}%`}</span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="30"
                    value={supplyCostChange}
                    onChange={(e) => setSupplyCostChange(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">Simulates sudden dairy, poultry, or oil commodity price spikes.</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                    <span>Peak Evening Digital Delivery Surge:</span>
                    <span className="font-black text-indigo-600">+{deliverySurge}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={deliverySurge}
                    onChange={(e) => setDeliverySurge(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">Simulates aggregator campaigns and adverse weather delivery volume.</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                    <span>Labor Wage / Overtime Rate Adjustment:</span>
                    <span className="font-black text-amber-600">+{laborOvertimeWage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={laborOvertimeWage}
                    onChange={(e) => setLaborOvertimeWage(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">Simulates minimum wage statutory increments or overtime bonuses.</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                    <span>New Outlet Openings (Tier-2 Cities):</span>
                    <span className="font-black text-emerald-600">+{expansionUnits} Outlets</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={expansionUnits}
                    onChange={(e) => setExpansionUnits(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">Simulates immediate revenue & scale impact of opening planned units in Pune/Ahmedabad.</span>
                </div>
              </div>

              {/* Real-time AI Projected Impact */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Real-Time Simulation Projection</span>
                  </div>

                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                      <span className="text-xs text-slate-300">Simulated Monthly Net Revenue</span>
                      <span className="text-lg font-black text-white">₹{(simulatedNetRevenue / 100000).toFixed(2)} Lakhs</span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                      <span className="text-xs text-slate-300">Net Operating Margin Impact</span>
                      <span className={`text-lg font-black ${simulatedMarginDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {simulatedMarginDelta >= 0 ? `+₹${(simulatedMarginDelta / 1000).toFixed(0)}k` : `-₹${(Math.abs(simulatedMarginDelta) / 1000).toFixed(0)}k`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                      <span className="text-xs text-slate-300">Fleet Kitchen Capacity Utilization</span>
                      <span className="text-base font-bold text-indigo-300">{Math.min(98, 72 + Math.round(deliverySurge * 0.4))}%</span>
                    </div>
                  </div>

                  {/* AI Strategic Recommendation */}
                  <div className="mt-5 p-3.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                      AI Prescriptive Hedging Strategy
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {supplyCostChange > 10
                        ? 'Trigger dynamic menu engineering: promote high-margin beverage bundles and renegotiate bulk distributor contracts for 60 days.'
                        : 'Current capacity handles the projected delivery surge seamlessly. Recommend activating part-time shift flex buffers on Friday.'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSupplyCostChange(0);
                      setDeliverySurge(15);
                      setLaborOvertimeWage(5);
                      setExpansionUnits(2);
                      showToast('Simulator parameters reset to default baseline.');
                    }}
                    className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
                  >
                    Reset Baseline
                  </button>

                  <button
                    onClick={() => showToast('Scenario model exported to Executive Board Pack.')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Save Scenario Pack
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {/* DEEP-DIVE AI DIAGNOSIS & REMEDIATION MODAL */}
      <AnimatePresence>
        {isDiagnosisModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsDiagnosisModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>

              {isDiagnosing ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <h3 className="text-xl font-black text-slate-900">
                    Conducting Multi-Vector AI Diagnostic Scan...
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Analyzing POS timestamps, kitchen KDS velocity, sensor telemetries, and staff scheduling logs with Gemini 3.7.
                  </p>
                </div>
              ) : activeDiagnosis ? (
                <div className="space-y-6">
                  {/* Modal Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        AI Diagnosis Report ({activeDiagnosis.confidenceScore}% Confidence)
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        Target: {activeDiagnosis.analyzedOutletName}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {activeDiagnosis.problemTitle}
                    </h2>
                  </div>

                  {/* Primary Root Cause Section */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider mb-1.5">
                      <BrainCircuit className="w-4 h-4" />
                      <span>Primary Root-Cause Decomposition</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {activeDiagnosis.primaryRootCause}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Contributing Friction Factors:</span>
                      {activeDiagnosis.contributingFactors?.map((f, i) => (
                        <p key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span> {f}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Immediate 24-Hour Remedy vs 30-Day Recovery Roadmap */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 24-Hour Immediate Fixes */}
                    <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl">
                      <div className="flex items-center gap-2 text-emerald-900 text-xs font-black uppercase tracking-wider mb-2">
                        <Zap className="w-4 h-4 text-emerald-600" />
                        <span>Immediate 24-Hour Fixes</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-800">
                        {activeDiagnosis.immediateRemedy24H?.map((r, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Financial Recovery ROI */}
                    <div className="p-4 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-indigo-900 text-xs font-black uppercase tracking-wider mb-1">
                          <TrendingUp className="w-4 h-4 text-indigo-600" />
                          <span>Projected Financial Recovery</span>
                        </div>
                        <p className="text-2xl font-black text-indigo-900 mt-1">
                          ₹{activeDiagnosis.projectedFinancialRecoveryRupees?.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ month</span>
                        </p>
                        <p className="text-xs text-slate-600 mt-1 leading-normal">
                          Calculated from reduced food spoilage, recovered order volume, and optimized labor hours.
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-indigo-200/60 text-[11px] text-indigo-700 font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> Payback Period: Immediate (&lt; 7 Days)
                      </div>
                    </div>
                  </div>

                  {/* 30-Day Turnaround Roadmap */}
                  {activeDiagnosis.systemicPlan30D && activeDiagnosis.systemicPlan30D.length > 0 && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-3">
                        30-Day Turnaround Milestones & SOP Evolution
                      </span>
                      <div className="space-y-2.5">
                        {activeDiagnosis.systemicPlan30D.map((step, idx) => (
                          <div key={idx} className="flex items-start justify-between gap-3 text-xs bg-white p-2.5 rounded-xl border border-slate-200/80">
                            <div>
                              <span className="font-black text-slate-900 block">{step.phase}</span>
                              <span className="text-slate-600">{step.action}</span>
                            </div>
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] whitespace-nowrap shrink-0">
                              {step.expectedMetricImpact}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Automated Policy Action Triggers */}
                  {activeDiagnosis.automatedPolicyActions && activeDiagnosis.automatedPolicyActions.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2.5">
                        1-Click Autonomous Deployments
                      </span>
                      <div className="space-y-2">
                        {activeDiagnosis.automatedPolicyActions.map((action) => {
                          const isDone = executedActions[action.id];

                          return (
                            <div
                              key={action.id}
                              className="flex items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs"
                            >
                              <div>
                                <span className="text-xs font-black text-slate-900 flex items-center gap-2">
                                  {action.label}
                                  <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                                    {action.targetModule}
                                  </span>
                                </span>
                                <p className="text-[11px] text-slate-500 mt-0.5">{action.description}</p>
                              </div>

                              <button
                                onClick={() => handleExecutePolicyAction(action.id, action.label)}
                                disabled={isDone}
                                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                                  isDone
                                    ? 'bg-emerald-100 text-emerald-800 cursor-default'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                }`}
                              >
                                {isDone ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                                    <span>Applied</span>
                                  </>
                                ) : (
                                  <>
                                    <Zap className="w-3.5 h-3.5" />
                                    <span>Deploy Action</span>
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Modal Footer */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <button
                      onClick={() => setIsDiagnosisModalOpen(false)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Close Diagnostics
                    </button>

                    <button
                      onClick={() => {
                        showToast(`Full AI Remediation Plan exported for ${activeDiagnosis.analyzedOutletName}`);
                        setIsDiagnosisModalOpen(false);
                      }}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>Export SOP Playbook</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
