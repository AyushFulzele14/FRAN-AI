import React, { useState } from 'react';
import { AuditRecord, PolicyViolation, OperationalCheck, CorrectiveTask, AIVisionInspection } from '../../types';
import { AuditSystemArchitecture } from './AuditSystemArchitecture';
import { AuditsDashboard } from '../Audits/AuditsDashboard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  ClipboardCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Award,
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  FileText,
  Printer,
  Sparkles,
  X,
  Building2,
  Check,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Eye,
  Camera,
  Upload,
  Activity,
  ChevronRight,
  BarChart3,
  ListOrdered,
  CheckSquare,
  DollarSign,
  ChevronDown,
  ChevronUp,
  MapPin,
  ListChecks,
  Download,
  RefreshCw,
  FileCheck,
  Sliders,
  Layers,
  Zap,
  RotateCcw,
  BadgeAlert,
  Maximize2,
  Users,
  Store,
  FileSpreadsheet,
  Cpu,
  Lock,
  Network,
  LayoutDashboard
} from 'lucide-react';

interface AuditsPageProps {
  audits: AuditRecord[];
}

export const AuditsPage: React.FC<AuditsPageProps> = ({ audits: initialAudits }) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'inspections'>('dashboard');
  const [auditList, setAuditList] = useState<AuditRecord[]>(initialAudits);
  
  // Chart Data Definitions
  const complianceTrendData = [
    { period: 'Week 1', score: 82, target: 90, violations: 12 },
    { period: 'Week 2', score: 86, target: 90, violations: 8 },
    { period: 'Week 3', score: 89, target: 90, violations: 6 },
    { period: 'Week 4', score: 94, target: 90, violations: 3 },
    { period: 'Week 5', score: 92, target: 90, violations: 4 },
    { period: 'Week 6', score: 97, target: 90, violations: 1 },
  ];

  const branchRankingChartData = [
    { name: "Domino's C.P.", score: 98, hygiene: 99, speed: 96, fill: '#10b981' },
    { name: "McDonald's Indiranagar", score: 95, hygiene: 96, speed: 94, fill: '#10b981' },
    { name: "Domino's Hitec", score: 91, hygiene: 92, speed: 90, fill: '#6366f1' },
    { name: 'KFC Bandra', score: 88, hygiene: 89, speed: 87, fill: '#6366f1' },
    { name: "McDonald's T Nagar", score: 66, hygiene: 70, speed: 62, fill: '#f43f5e' },
  ];

  const violationSeverityPieData = [
    { name: 'Critical', value: 2, color: '#f43f5e' },
    { name: 'High', value: 2, color: '#f97316' },
    { name: 'Medium', value: 1, color: '#eab308' },
    { name: 'Low', value: 1, color: '#10b981' },
  ];

  const categoryHealthChartData = [
    { category: 'Food Safety', score: 92.4, target: 90 },
    { category: 'Service Speed', score: 88.5, target: 85 },
    { category: 'Brand Uniform', score: 94.1, target: 90 },
    { category: 'Cash Reconcile', score: 86.0, target: 95 },
    { category: 'Complaint SLA', score: 91.2, target: 88 },
  ];

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'workflow' | 'operational' | 'violations' | 'reports' | 'tasks' | 'records' | 'newInspector' | 'architecture'
  >('operational');

  // Timeframe selector for Reports
  const [reportTimeframe, setReportTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. OPERATIONAL CHECKS STATE
  const [operationalChecks, setOperationalChecks] = useState<OperationalCheck[]>([
    {
      id: 'op-101',
      outletId: 'o-101',
      outletName: "Domino's Connaught Place Outlet",
      openingClosingTime: '09:00 AM - 11:00 PM',
      openingStatus: 'On Time',
      attendanceRate: 100,
      staffOnShift: '10 / 10 Staff Present',
      inventorySynced: true,
      cashRegisterClosing: 'Balanced',
      cleaningLogStatus: 'Completed',
      maintenanceStatus: 'All Equipment Operational',
      avgComplaintResponseMins: 4,
    },
    {
      id: 'op-102',
      outletId: 'o-105',
      outletName: "McDonald's T Nagar Express Store",
      openingClosingTime: '09:00 AM - 11:30 PM',
      openingStatus: 'Late Opening (25m)',
      attendanceRate: 75,
      staffOnShift: '6 / 8 Staff Present (-2 Shortage)',
      inventorySynced: false,
      cashRegisterClosing: 'Discrepancy ₹450',
      cleaningLogStatus: 'Pending Evening Check',
      maintenanceStatus: 'Fryer Servicing Due',
      avgComplaintResponseMins: 28,
    },
    {
      id: 'op-103',
      outletId: 'o-103',
      outletName: 'KFC Bandra Linking Road',
      openingClosingTime: '10:00 AM - 11:00 PM',
      openingStatus: 'On Time',
      attendanceRate: 90,
      staffOnShift: '9 / 10 Staff Present',
      inventorySynced: true,
      cashRegisterClosing: 'Balanced',
      cleaningLogStatus: 'Completed',
      maintenanceStatus: 'All Equipment Operational',
      avgComplaintResponseMins: 12,
    },
    {
      id: 'op-104',
      outletId: 'o-104',
      outletName: "Domino's Hitec City Outlet",
      openingClosingTime: '09:00 AM - 12:00 AM',
      openingStatus: 'On Time',
      attendanceRate: 100,
      staffOnShift: '12 / 12 Staff Present',
      inventorySynced: true,
      cashRegisterClosing: 'Balanced',
      cleaningLogStatus: 'Completed',
      maintenanceStatus: 'All Equipment Operational',
      avgComplaintResponseMins: 5,
    },
  ]);

  // 2. POLICY VIOLATIONS STATE
  const [violations, setViolations] = useState<PolicyViolation[]>([
    {
      id: 'vio-201',
      outletId: 'o-105',
      outletName: "McDonald's T Nagar Express Store",
      category: 'Late Opening',
      description: 'Store opened 25 minutes late without prior district manager notification.',
      severity: 'Medium',
      detectedAt: 'Today, 09:25 AM',
      status: 'Active',
    },
    {
      id: 'vio-202',
      outletId: 'o-105',
      outletName: "McDonald's T Nagar Express Store",
      category: 'Fake Attendance',
      description: 'Biometric manager override detected for 2 absent staff members during night shift.',
      severity: 'Critical',
      detectedAt: 'Yesterday, 10:15 PM',
      status: 'Active',
    },
    {
      id: 'vio-203',
      outletId: 'o-103',
      outletName: 'KFC Bandra Linking Road',
      category: 'Unauthorized Discount',
      description: 'Manual 35% discount override applied on bulk bill #ORD-8821 without manager authorization.',
      severity: 'High',
      detectedAt: '2 days ago',
      status: 'Under Review',
    },
    {
      id: 'vio-204',
      outletId: 'o-105',
      outletName: "McDonald's T Nagar Express Store",
      category: 'Expired Product',
      description: 'Chilled dairy mix crate found 1 day past printed expiration date in primary cooler.',
      severity: 'Critical',
      detectedAt: '2 days ago',
      status: 'Active',
    },
    {
      id: 'vio-205',
      outletId: 'o-106',
      outletName: 'KFC Park Street Store',
      category: 'Missing GST Invoice',
      description: '3 consecutive cash orders closed without generating GST tax receipt invoice.',
      severity: 'High',
      detectedAt: '3 days ago',
      status: 'Under Review',
    },
    {
      id: 'vio-206',
      outletId: 'o-101',
      outletName: "Domino's Connaught Place Outlet",
      category: 'Ignored Complaint',
      description: 'Customer ticket #884 regarding undercooked crust pending response past 45 mins.',
      severity: 'Low',
      detectedAt: '3 days ago',
      status: 'Resolved',
    },
  ]);

  // 3. CORRECTIVE TASKS STATE (Full Lifecycle: Pending -> In Progress -> Completed -> Verified -> Closed)
  const [correctiveTasks, setCorrectiveTasks] = useState<CorrectiveTask[]>([
    {
      id: 'task-301',
      title: 'Fix McFlurry Soft Serve Dispenser Cooling & Temperature Log',
      outletName: "McDonald's T Nagar Express Store",
      assignedTo: 'Store Mgr. Mohan Das',
      severity: 'Critical',
      status: 'In Progress',
      dueDate: '2026-08-15',
      createdAt: '2026-08-12',
      category: 'Equipment Maintenance',
      notes: 'Technician dispatched for chilling coil replacement.',
    },
    {
      id: 'task-302',
      title: 'Reconcile Register Cash Discrepancy of ₹450 with Manager Sign-Off',
      outletName: "McDonald's T Nagar Express Store",
      assignedTo: 'Head Cashier Sunita R.',
      severity: 'High',
      status: 'Pending',
      dueDate: '2026-08-14',
      createdAt: '2026-08-13',
      category: 'Cash Register Audit',
      notes: 'Submit signed register log copy to district manager.',
    },
    {
      id: 'task-303',
      title: 'Deep Fryer Oil Filtration Cycle & Log Sheet Audit',
      outletName: 'KFC Bandra Linking Road',
      assignedTo: 'Kitchen Chief Raju Verma',
      severity: 'Medium',
      status: 'Completed',
      dueDate: '2026-08-12',
      createdAt: '2026-08-10',
      category: 'Kitchen Safety',
      notes: 'Oil filter replaced. Filtration timestamp verified.',
    },
    {
      id: 'task-304',
      title: 'Staff Uniform & Cap Hygiene Retraining Session',
      outletName: "Domino's Hitec City Outlet",
      assignedTo: 'Shift Trainer Vikram K.',
      severity: 'Low',
      status: 'Verified',
      dueDate: '2026-08-10',
      createdAt: '2026-08-05',
      category: 'Brand SOP Standards',
      notes: 'All 12 staff attended refresher course and passed quiz.',
    },
    {
      id: 'task-305',
      title: 'Audit Biometric Override Logs for Night Handoff',
      outletName: "McDonald's T Nagar Express Store",
      assignedTo: 'HR Manager Anita Roy',
      severity: 'Critical',
      status: 'Closed',
      dueDate: '2026-08-08',
      createdAt: '2026-08-02',
      category: 'Policy Compliance',
      notes: 'Unauthorized biometric overrides revoked and warning issued.',
    },
  ]);

  // 4. AI VISION INSPECTIONS DATA
  const [aiInspections, setAiInspections] = useState<AIVisionInspection[]>([
    {
      id: 'ai-img-1',
      title: 'Main Kitchen Assembly & Oven Station',
      outletName: "Domino's Connaught Place Outlet",
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop',
      brandingScore: 98,
      uniformScore: 100,
      cleanlinessScore: 95,
      layoutScore: 96,
      detectedIssues: [
        '✅ Aprons & Hairnets worn by 100% of kitchen staff',
        '✅ Pizza oven temperature display calibrated correctly',
        '✅ Stainless steel counter sanitized & clear of clutter',
      ],
      analyzedAt: 'Today, 08:30 AM',
    },
    {
      id: 'ai-img-2',
      title: 'Front Order Counter & LED Signage',
      outletName: "McDonald's T Nagar Express Store",
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
      brandingScore: 82,
      uniformScore: 70,
      cleanlinessScore: 68,
      layoutScore: 85,
      detectedIssues: [
        '⚠️ Cashier #2 missing official brand cap',
        '⚠️ Minor sauce spill detected on tray counter edge',
        '✅ Brand logo illuminated at 100% brightness',
      ],
      analyzedAt: 'Today, 09:15 AM',
    },
    {
      id: 'ai-img-3',
      title: 'Dine-in Seating & Waste Management Area',
      outletName: 'KFC Bandra Linking Road',
      imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop',
      brandingScore: 94,
      uniformScore: 95,
      cleanlinessScore: 88,
      layoutScore: 92,
      detectedIssues: [
        '✅ Floor clean and clear of hazards',
        '⚠️ Waste disposal bin reaches 75% capacity - clearing advised',
        '✅ Brand promotional posters displayed per layout SOP',
      ],
      analyzedAt: 'Yesterday, 02:45 PM',
    },
  ]);

  const [selectedInspection, setSelectedInspection] = useState<AIVisionInspection>(aiInspections[0]);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);

  // Modal States
  const [selectedAuditForCertificate, setSelectedAuditForCertificate] = useState<AuditRecord | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // New Task Form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskOutlet, setNewTaskOutlet] = useState("McDonald's T Nagar Express Store");
  const [newTaskAssigned, setNewTaskAssigned] = useState('Store Manager Mohan Das');
  const [newTaskSeverity, setNewTaskSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [newTaskCategory, setNewTaskCategory] = useState('Operational Compliance');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-08-20');

  // Live Inspector Form State
  const [newOutletId, setNewOutletId] = useState('o-101');
  const [newOutletName, setNewOutletName] = useState("Domino's Connaught Place Outlet");
  const [newAuditorName, setNewAuditorName] = useState('District Manager Rahul Verma');
  const [newHygieneScore, setNewHygieneScore] = useState(92);
  const [newSpeedScore, setNewSpeedScore] = useState(88);
  const [newComplianceScore, setNewComplianceScore] = useState(90);
  const [newFacilityScore, setNewFacilityScore] = useState(94);
  const [newGpsVerified, setNewGpsVerified] = useState(true);
  const [newCriticalNotes, setNewCriticalNotes] = useState('Sanitization log verified. Dough temp controlled at 4°C.');
  const [digitalSignature, setDigitalSignature] = useState('R. Verma (District Audit Head)');
  const [inspectionPhotoUrl, setInspectionPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop'
  );

  // Inspection History Expand State
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);

  // Mandatory Inspection Checklist
  const [checklist, setChecklist] = useState([
    { id: 'chk-1', label: 'Chiller & Walk-in Cold Storage Temp Log verified (<= 4°C)', checked: true, category: 'Food Safety' },
    { id: 'chk-2', label: 'Kitchen Staff wearing 100% compliant aprons, hairnets & gloves', checked: true, category: 'SOP & Hygiene' },
    { id: 'chk-3', label: 'Fire Extinguisher & Hood Emergency Vent Certificate valid', checked: true, category: 'Safety & Exits' },
    { id: 'chk-4', label: 'POS Cash Drawer Closing reconciled with zero unapproved override', checked: true, category: 'Cash & Invoices' },
    { id: 'chk-5', label: 'Customer Washrooms, Dine-In Tables & Floor Sanitization clean', checked: false, category: 'Facility Maintenance' },
  ]);

  const availableOutlets = [
    { id: 'o-101', name: "Domino's Connaught Place Outlet" },
    { id: 'o-102', name: "McDonald's Indiranagar Drive-Thru" },
    { id: 'o-103', name: 'KFC Bandra Linking Road' },
    { id: 'o-104', name: "Domino's Hitec City Outlet" },
    { id: 'o-105', name: "McDonald's T Nagar Express Store" },
    { id: 'o-106', name: 'KFC Park Street Store' },
  ];

  // Key KPI stats
  const totalAudits = auditList.length;
  const passedAudits = auditList.filter((a) => a.status === 'Passed').length;
  const passRate = totalAudits > 0 ? Math.round((passedAudits / totalAudits) * 100) : 100;
  const activeViolationsCount = violations.filter((v) => v.status !== 'Resolved').length;
  const criticalViolationsCount = violations.filter((v) => v.severity === 'Critical' && v.status !== 'Resolved').length;
  const activeTasksCount = correctiveTasks.filter((t) => t.status !== 'Closed').length;

  // Handler: Advance Task Lifecycle
  const handleAdvanceTaskStatus = (taskId: string) => {
    setCorrectiveTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          let nextStatus: CorrectiveTask['status'] = 'Pending';
          if (t.status === 'Pending') nextStatus = 'In Progress';
          else if (t.status === 'In Progress') nextStatus = 'Completed';
          else if (t.status === 'Completed') nextStatus = 'Verified';
          else if (t.status === 'Verified') nextStatus = 'Closed';
          else nextStatus = 'Closed';

          showToast(`Task "${t.title.slice(0, 30)}..." updated to status: ${nextStatus.toUpperCase()}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  // Handler: Create Corrective Task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const newTask: CorrectiveTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      outletName: newTaskOutlet,
      assignedTo: newTaskAssigned,
      severity: newTaskSeverity,
      status: 'Pending',
      dueDate: newTaskDueDate,
      createdAt: new Date().toISOString().split('T')[0],
      category: newTaskCategory,
    };

    setCorrectiveTasks((prev) => [newTask, ...prev]);
    setIsAddTaskModalOpen(false);
    setNewTaskTitle('');
    showToast(`Corrective task assigned to ${newTaskAssigned}!`);
  };

  // Handler: Convert Violation into Task
  const handleConvertViolationToTask = (v: PolicyViolation) => {
    const newTask: CorrectiveTask = {
      id: `task-v-${Date.now()}`,
      title: `CAP: Resolve ${v.category} - ${v.description}`,
      outletName: v.outletName,
      assignedTo: 'Store Manager',
      severity: v.severity,
      status: 'In Progress',
      dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      category: v.category,
    };

    setCorrectiveTasks((prev) => [newTask, ...prev]);
    setViolations((prev) =>
      prev.map((item) => (item.id === v.id ? { ...item, status: 'Under Review' } : item))
    );
    setActiveTab('tasks');
    showToast(`Violation converted to Corrective Action Task!`);
  };

  // Handler: Run Simulated AI Photo Analysis
  const handleSimulateAiAnalysis = () => {
    setIsAnalyzingPhoto(true);
    setTimeout(() => {
      setIsAnalyzingPhoto(false);
      showToast('AI Vision Model successfully analyzed store photo! Scores & flags updated.');
    }, 1500);
  };

  // Handler: Submit Live Audit
  const handleSubmitAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const overall = Math.round((newHygieneScore + newSpeedScore + newComplianceScore + newFacilityScore) / 4);
    const statusVal: 'Passed' | 'Action Required' | 'Failed' =
      overall >= 80 ? 'Passed' : overall >= 60 ? 'Action Required' : 'Failed';

    const newAuditRecord: AuditRecord = {
      id: `aud-${Date.now()}`,
      outletId: newOutletId,
      outletName: newOutletName,
      auditorName: newAuditorName,
      auditDate: new Date().toISOString().split('T')[0],
      overallScore: overall,
      hygieneScore: Number(newHygieneScore),
      serviceSpeedScore: Number(newSpeedScore),
      complianceScore: Number(newComplianceScore),
      status: statusVal,
      criticalNotes: [
        ...newCriticalNotes.split('.').filter((n) => n.trim().length > 0),
        `Signed off by: ${digitalSignature}`,
        `Checklist items passed: ${checklist.filter((c) => c.checked).length}/${checklist.length}`,
      ],
    };

    setAuditList((prev) => [newAuditRecord, ...prev]);
    setActiveTab('records');
    showToast(`Live on-site inspection recorded for ${newOutletName}. Overall Score: ${overall}% (${statusVal})`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* AUDITS MODULE VIEW SWITCHER BAR */}
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
            <span>Audits Dashboard</span>
          </button>

          <button
            onClick={() => {
              setViewMode('inspections');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === 'inspections'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ClipboardCheck className="w-4 h-4 text-indigo-400" />
            <span>Inspection Logs & QA Operations</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-slate-200 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-slate-600" />
            <span>New Corrective Task</span>
          </button>
          <button
            onClick={() => {
              setViewMode('inspections');
              setActiveTab('live-audit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Audit</span>
          </button>
        </div>
      </div>

      {viewMode === 'dashboard' ? (
        <AuditsDashboard
          audits={auditList}
          onInspectAudit={() => {
            setViewMode('inspections');
            setActiveTab('records');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNewAudit={() => {
            setViewMode('inspections');
            setActiveTab('operational');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddTask={() => setIsAddTaskModalOpen(true)}
        />
      ) : (
        <>
      {/* HEADER BANNER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End Store Audit & Compliance Automation</span>
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
            Franchise Quality Assurance & Policy Governance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time operational monitoring, AI vision standards validation, policy violation detection & multi-step corrective task workflows.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center gap-2 border border-slate-200 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-600" />
            <span>New Corrective Task</span>
          </button>

          <button
            onClick={() => setActiveTab('newInspector')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Conduct Live Audit</span>
          </button>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Overall Pass Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{passRate}%</p>
          <p className="text-[11px] text-slate-500 font-medium">{passedAudits} of {totalAudits} Outlets Compliant</p>
        </div>

        <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-rose-900">
            <span className="text-xs font-bold">Active Policy Violations</span>
            <BadgeAlert className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-950">{activeViolationsCount} Issues</p>
          <p className="text-[11px] text-rose-800 font-medium">{criticalViolationsCount} Critical Severity Alerts</p>
        </div>

        <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-900">
            <span className="text-xs font-bold">CAP Tasks in Lifecycle</span>
            <CheckSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-950">{correctiveTasks.length} Tasks</p>
          <p className="text-[11px] text-indigo-700 font-medium">{activeTasksCount} Pending Resolution</p>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-900">
            <span className="text-xs font-bold">AI Vision Accuracy</span>
            <Camera className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-950">96.8% Score</p>
          <p className="text-[11px] text-amber-800 font-medium">Auto Uniform & Branding Check</p>
        </div>
      </div>

      {/* AUDITS & COMPLIANCE KPI ANALYTICAL CHARTS DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Store Compliance Score vs Benchmark (Area Ribbon / Bar) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Store Audit Compliance Scores vs Benchmark (85%)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Audit performance across store locations with 85% brand pass benchmark
              </p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold rounded">
              Quality Benchmark
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={auditList.slice(0, 7).map((a) => ({
                  name: a.outletName.replace("McDonald's ", 'MCD-').replace("Domino's ", 'DOM-').replace("KFC ", 'KFC-').slice(0, 12),
                  fullName: a.outletName,
                  score: a.overallScore || (a as any).score || (a as any).complianceScore || 88,
                  target: 85,
                  status: a.status || 'Passed',
                }))}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-xl">
                          <p className="font-black text-emerald-400">{d.fullName}</p>
                          <p className="text-slate-300">Audit Score: <strong className={d.score >= 85 ? 'text-emerald-400' : 'text-rose-400'}>{d.score}% ({d.status})</strong></p>
                          <p className="text-slate-300">Brand Pass Benchmark: <strong className="text-amber-400">{d.target}%</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="score" name="Audit Score %" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Pass Benchmark (85%)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Audit Score</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Pass Standard (85%)</span>
            <span className="font-bold text-emerald-600">{passRate}% Pass Rate</span>
          </div>
        </div>

        {/* Chart 2: Policy Violations Severity Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Violation Severity Mix
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Active operational policy infringements
              </p>
            </div>
            <span className="px-2 py-0.5 bg-rose-50 text-rose-800 text-[10px] font-mono font-bold rounded">
              Risk Mix
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Critical Severity', value: violations.filter((v) => v.severity === 'Critical').length },
                    { name: 'High Severity', value: violations.filter((v) => v.severity === 'High').length },
                    { name: 'Medium Severity', value: violations.filter((v) => v.severity === 'Medium').length },
                    { name: 'Low Severity', value: violations.filter((v) => v.severity === 'Low').length },
                  ].filter((c) => c.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {['#f43f5e', '#ea580c', '#f59e0b', '#10b981'].map((c, i) => (
                    <Cell key={`vio-cell-${i}`} fill={c} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val} Violations`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Critical: {criticalViolationsCount} Issues</span>
            <span className="font-bold text-rose-600">{activeViolationsCount} Total Open</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS BAR */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between overflow-x-auto custom-scrollbar gap-1">
        <div className="flex items-center gap-1 min-w-max">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'workflow'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Workflow Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('operational')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'operational'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>1. Operational Compliance</span>
          </button>

          <button
            onClick={() => setActiveTab('violations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'violations'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <BadgeAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>2. Policy Violations ({activeViolationsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>3. Audit Reports & Ranking</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>4. Corrective Action Plan (CAP) ({activeTasksCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'records'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>5. Inspection History</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>6. System Architecture</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS (Where relevant) */}
      {(activeTab === 'violations' || activeTab === 'tasks' || activeTab === 'records') && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search store name, task, or violation category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB 0: WORKFLOW OVERVIEW DASHBOARD */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Operational Monitor Preview */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">Real-time Operational Compliance</h3>
                </div>
                <button
                  onClick={() => setActiveTab('operational')}
                  className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <span>View All Stores</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {operationalChecks.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900">{item.outletName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          item.openingStatus === 'On Time'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 font-extrabold'
                        }`}
                      >
                        {item.openingStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Attendance</span>
                        <span className="font-bold text-slate-800">{item.staffOnShift}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Cash Closing</span>
                        <span
                          className={`font-bold ${
                            item.cashRegisterClosing === 'Balanced' ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {item.cashRegisterClosing}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Avg Response</span>
                        <span className="font-bold text-slate-800">{item.avgComplaintResponseMins} mins</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Policy Violations Preview */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BadgeAlert className="w-4 h-4 text-rose-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">Policy Violations & Severity Matrix</h3>
                </div>
                <button
                  onClick={() => setActiveTab('violations')}
                  className="text-xs text-rose-700 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Resolve Issues</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {violations.slice(0, 3).map((v) => (
                  <div key={v.id} className="p-3 bg-rose-50/50 rounded-xl border border-rose-200/70 text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900">{v.outletName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          v.severity === 'Critical'
                            ? 'bg-rose-600 text-white'
                            : v.severity === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {v.severity} Severity
                      </span>
                    </div>
                    <p className="font-semibold text-rose-950 text-xs">{v.category}: {v.description}</p>
                    <div className="flex justify-between items-center pt-1 text-[10px] text-slate-500">
                      <span>Detected: {v.detectedAt}</span>
                      <button
                        onClick={() => handleConvertViolationToTask(v)}
                        className="text-indigo-700 font-extrabold hover:underline"
                      >
                        + Create Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Architecture Quick Banner in Workflow View */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    System Architecture Layer
                  </span>
                </div>
                <h4 className="font-black text-sm text-white mt-1">
                  Edge Ingestion, Gemini 3.7 AI Vision & Zero-Trust Audit Ledger
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inspect the 5-layer technical stack, sensor ingestion protocols, and real-time event pipeline simulator.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('architecture')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Explore Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: OPERATIONAL COMPLIANCE MONITOR */}
      {activeTab === 'operational' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                Real-Time Store Telemetry
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-600" />
                <span>Store Operational Compliance & Daily Check Monitor</span>
              </h3>
              <p className="text-xs text-slate-500">
                Opening/closing timestamps, staff attendance, POS inventory sync, cash closing & complaint response SLAs.
              </p>
            </div>
          </div>

          {/* Operational Telemetry Analytics Chart */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Store Telemetry Overview: Staff Attendance Rate vs Complaint SLA Response (Mins)</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-500">Live POS Telemetry</span>
            </div>
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={operationalChecks.map(op => ({
                  shortName: op.outletName.replace("Outlet", "").replace("Express Store", "").replace("Store", ""),
                  attendanceRate: op.attendanceRate,
                  complaintSLA: op.avgComplaintResponseMins,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="shortName" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="attendanceRate" name="Staff Attendance Rate (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="complaintSLA" name="Avg Complaint SLA (Mins)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Franchise Outlet</th>
                  <th className="p-3.5">Opening / Closing Status</th>
                  <th className="p-3.5">Staff Attendance</th>
                  <th className="p-3.5">POS Inventory Sync</th>
                  <th className="p-3.5">Cash Register Closing</th>
                  <th className="p-3.5">Maintenance & Cleaning</th>
                  <th className="p-3.5 text-right">Avg Complaint SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {operationalChecks.map((check) => (
                  <tr key={check.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <p className="font-extrabold text-slate-900 text-xs">{check.outletName}</p>
                      <span className="text-[10px] text-slate-400">{check.openingClosingTime}</span>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-block ${
                          check.openingStatus === 'On Time'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900 animate-pulse'
                        }`}
                      >
                        {check.openingStatus}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block">{check.staffOnShift}</span>
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              check.attendanceRate >= 90 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${check.attendanceRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      {check.inventorySynced ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold text-[10px] inline-flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Synced</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded font-bold text-[10px] inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Sync Failed</span>
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 font-bold">
                      <span
                        className={
                          check.cashRegisterClosing === 'Balanced'
                            ? 'text-emerald-700'
                            : 'text-rose-700 font-extrabold'
                        }
                      >
                        {check.cashRegisterClosing}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <p className="text-slate-800 font-semibold">{check.cleaningLogStatus}</p>
                        <p className="text-[10px] text-slate-400">{check.maintenanceStatus}</p>
                      </div>
                    </td>

                    <td className="p-3.5 text-right font-black text-slate-900">
                      <span
                        className={`px-2 py-1 rounded-lg ${
                          check.avgComplaintResponseMins <= 10
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        ⏱️ {check.avgComplaintResponseMins} Mins
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}



      {/* TAB 3: POLICY VIOLATIONS DETECTOR */}
      {activeTab === 'violations' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-extrabold uppercase text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full">
              Automated Anomaly Detection
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
              <BadgeAlert className="w-5 h-5 text-rose-600" />
              <span>Policy Violations & Non-Compliance Log</span>
            </h3>
            <p className="text-xs text-slate-500">
              Late opening, fake attendance, unauthorized discounts, expired items, missing GST invoices, ignored complaints.
            </p>
          </div>

          {/* Violations Severity Distribution Chart */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="md:col-span-1 space-y-2 flex flex-col justify-center">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Severity Distribution</span>
              </h4>
              <p className="text-xs text-slate-600">
                Breakdown of active compliance violations by severity level across all stores.
              </p>
              <div className="pt-2 space-y-1 text-xs">
                {violationSeverityPieData.map((s) => (
                  <div key={s.name} className="flex justify-between items-center font-bold">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      {s.name} Severity
                    </span>
                    <span className="text-slate-900 font-extrabold">{s.value} Active</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={violationSeverityPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {violationSeverityPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {violations
              .filter(
                (v) =>
                  (severityFilter === 'All' || v.severity === severityFilter) &&
                  (v.outletName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.description.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((v) => (
                <div key={v.id} className="p-4 bg-rose-50/40 rounded-2xl border border-rose-200/80 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                        {v.id}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">{v.outletName}</h4>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        v.severity === 'Critical'
                          ? 'bg-rose-600 text-white'
                          : v.severity === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {v.severity} Severity
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-rose-100 text-xs space-y-1">
                    <span className="font-extrabold text-rose-900 block">{v.category} Violation</span>
                    <p className="text-slate-700 font-medium">{v.description}</p>
                    <p className="text-[10px] text-slate-400 pt-1">Detected: {v.detectedAt}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 font-bold">Status: {v.status}</span>
                    {v.status !== 'Resolved' && (
                      <button
                        onClick={() => handleConvertViolationToTask(v)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                      >
                        + Create Corrective Task
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT REPORTS & DASHBOARDS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <span>Franchise Audit Reports & Branch Ranking Dashboard</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Compliance %, overall audit score, and store performance benchmarks.
                </p>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-extrabold">
                <button
                  onClick={() => setReportTimeframe('daily')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    reportTimeframe === 'daily' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setReportTimeframe('weekly')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    reportTimeframe === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setReportTimeframe('monthly')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    reportTimeframe === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Visual Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Branch Audit Score Ranking */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Branch Audit Score Ranking ({reportTimeframe.toUpperCase()})</span>
                  </h4>
                  <span className="text-[10px] font-bold text-slate-500">Benchmark Target: 90%</span>
                </div>
                <div className="h-64 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={branchRankingChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fill: '#334155', fontWeight: 700 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                        formatter={(val: any) => [`${val}% Grade`, 'Audit Score']}
                      />
                      <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                        {branchRankingChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Category Health vs Targets */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    <span>Category Health vs Benchmark Target (%)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-slate-500">Franchise Avg</span>
                </div>
                <div className="h-64 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryHealthChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="category" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                      <Bar dataKey="score" name="Current Score (%)" fill="#6366f1" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="target" name="Target Benchmark (%)" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart 3: Weekly Compliance Progress Area Chart */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                    Audit Performance Timeline
                  </span>
                  <h4 className="font-extrabold text-white text-sm">
                    Franchise Network Overall Compliance Trend Over Weeks
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Current Pass Rate: 97%</span>
                </div>
              </div>

              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={complianceTrendData}>
                    <defs>
                      <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: '1px solid #334155' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      name="Compliance Pass Rate (%)"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorCompliance)"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      name="Target Line (90%)"
                      stroke="#f59e0b"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CORRECTIVE ACTION PLAN (CAP) FULL LIFECYCLE TASK TRACKER */}
      {activeTab === 'tasks' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full">
                Multi-Step Task State Machine
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                <span>Corrective Action Task Lifecycle Tracker</span>
              </h3>
              <p className="text-xs text-slate-500">
                Full Workflow: Pending → In Progress → Completed → Verified → Closed.
              </p>
            </div>

            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              + Create Corrective Task
            </button>
          </div>

          {/* Corrective Tasks State Distribution Donut Chart */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="md:col-span-1 space-y-2 flex flex-col justify-center">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span>Task Resolution Pipeline</span>
              </h4>
              <p className="text-xs text-slate-600">
                Current status of corrective actions assigned to store managers.
              </p>
              <div className="pt-2 space-y-1 text-xs">
                {[
                  { name: 'Pending', color: '#f43f5e' },
                  { name: 'In Progress', color: '#f59e0b' },
                  { name: 'Completed', color: '#3b82f6' },
                  { name: 'Verified', color: '#6366f1' },
                  { name: 'Closed', color: '#10b981' },
                ].map((st) => {
                  const count = correctiveTasks.filter(t => t.status === st.name).length;
                  return (
                    <div key={st.name} className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                        {st.name}
                      </span>
                      <span className="text-slate-900 font-extrabold">{count} Tasks</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2 h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Pending', value: correctiveTasks.filter(t => t.status === 'Pending').length, color: '#f43f5e' },
                      { name: 'In Progress', value: correctiveTasks.filter(t => t.status === 'In Progress').length, color: '#f59e0b' },
                      { name: 'Completed', value: correctiveTasks.filter(t => t.status === 'Completed').length, color: '#3b82f6' },
                      { name: 'Verified', value: correctiveTasks.filter(t => t.status === 'Verified').length, color: '#6366f1' },
                      { name: 'Closed', value: correctiveTasks.filter(t => t.status === 'Closed').length, color: '#10b981' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {[
                      { name: 'Pending', color: '#f43f5e' },
                      { name: 'In Progress', color: '#f59e0b' },
                      { name: 'Completed', color: '#3b82f6' },
                      { name: 'Verified', color: '#6366f1' },
                      { name: 'Closed', color: '#10b981' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-3">
            {correctiveTasks
              .filter(
                (t) =>
                  (severityFilter === 'All' || t.severity === severityFilter) &&
                  (t.outletName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                        {task.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          task.status === 'Closed'
                            ? 'bg-slate-200 text-slate-700'
                            : task.status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : task.status === 'Completed'
                            ? 'bg-indigo-100 text-indigo-800'
                            : task.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {task.status}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">Severity: {task.severity}</span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm">{task.title}</h4>
                    <p className="text-xs text-slate-600 font-medium">
                      Store: {task.outletName} • Assigned To: <strong className="text-slate-900">{task.assignedTo}</strong>
                    </p>
                    {task.notes && <p className="text-[11px] text-slate-500 italic">Notes: {task.notes}</p>}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAdvanceTaskStatus(task.id)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Advance Status</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 5: INSPECTION HISTORY RECORDS */}
      {activeTab === 'records' && (
        <div className="space-y-5">
          {/* Inspection History Overview Header Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Total Audits Logged</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900">{auditList.length}</span>
                <ClipboardCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Avg Overall Score</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-700">
                  {Math.round(auditList.reduce((acc, a) => acc + a.overallScore, 0) / (auditList.length || 1))}%
                </span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Pass Ratio</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-indigo-600">
                  {Math.round((auditList.filter((a) => a.status === 'Passed').length / (auditList.length || 1)) * 100)}%
                </span>
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Action Required</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-rose-600">
                  {auditList.filter((a) => a.status !== 'Passed').length}
                </span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by store or auditor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['All', 'Passed', 'Action Required', 'Failed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Inspection Records List & Expanded Cards */}
          <div className="space-y-3">
            {auditList
              .filter(
                (a) =>
                  (statusFilter === 'All' || a.status === statusFilter) &&
                  (a.outletName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    a.auditorName.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((a) => {
                const isExpanded = expandedAuditId === a.id;
                return (
                  <div
                    key={a.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {a.id}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {a.auditDate}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            GPS Verified
                          </span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base">{a.outletName}</h3>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          Lead Inspector: <strong className="text-slate-800">{a.auditorName}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black ${
                            a.status === 'Passed'
                              ? 'bg-emerald-100 text-emerald-900'
                              : a.status === 'Action Required'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-rose-100 text-rose-900'
                          }`}
                        >
                          {a.status} ({a.overallScore}%)
                        </span>

                        <button
                          onClick={() => setSelectedAuditForCertificate(a)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">Certificate</span>
                        </button>

                        <button
                          onClick={() => setExpandedAuditId(isExpanded ? null : a.id)}
                          className="p-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                          title="Toggle Detailed Inspection Breakdown"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Inspection Audit Breakdown */}
                    {isExpanded && (
                      <div className="bg-slate-50 p-5 border-t border-slate-200 space-y-4 animate-in fade-in duration-150">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span>Food Safety & Cold Chain</span>
                              <span className="text-emerald-700 font-black">{a.hygieneScore}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${a.hygieneScore}%` }} />
                            </div>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span>Service Speed & KDS</span>
                              <span className="text-indigo-700 font-black">{a.serviceSpeedScore}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${a.serviceSpeedScore}%` }} />
                            </div>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span>Policy & Cash Compliance</span>
                              <span className="text-emerald-700 font-black">{a.complianceScore}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${a.complianceScore}%` }} />
                            </div>
                          </div>
                        </div>

                        {/* Inspector Notes & Bullet Points */}
                        <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200 text-xs">
                          <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-emerald-600" />
                            Official Inspection Findings & Notes:
                          </span>
                          <div className="space-y-1 text-slate-600 font-medium pl-1">
                            {a.criticalNotes.map((note, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-500 font-bold">•</span>
                                <span>{note}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* System Architecture Node & Cryptographic Verification Field */}
                        <div className="p-3.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="font-mono font-bold text-[11px] text-emerald-300 uppercase">
                                System Architecture & Security Node Verification
                              </span>
                            </div>
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-black rounded border border-emerald-500/30">
                              Zero-Trust Validated
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                              <span className="text-slate-400 block text-[9px] uppercase">Ingestion Gateway</span>
                              <span className="font-bold text-white">Edge-Node-0{a.id.slice(-1) || '1'} (TLS 1.3)</span>
                            </div>
                            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                              <span className="text-slate-400 block text-[9px] uppercase">AI Vision Model</span>
                              <span className="font-bold text-emerald-400">Gemini 3.7 Vision v4</span>
                            </div>
                            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                              <span className="text-slate-400 block text-[9px] uppercase">Ledger Hash</span>
                              <span className="font-bold text-slate-300 truncate block">SHA256:{a.id.replace('-', '')}9a8b</span>
                            </div>
                            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                              <span className="text-slate-400 block text-[9px] uppercase">GNSS Geofence</span>
                              <span className="font-bold text-white">Verified (≤ 15m)</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Toolbar */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="text-[11px] font-mono font-bold text-slate-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Digital Audit Timestamp: {a.auditDate} 09:45 AM
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => showToast(`Audit PDF summary downloaded for ${a.outletName}.`)}
                              className="px-3 py-1.5 bg-slate-900 text-white font-extrabold text-xs rounded-xl hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Download PDF Brief</span>
                            </button>

                            <button
                              onClick={() => showToast(`Re-audit scheduled for ${a.outletName}. Inspector notified.`)}
                              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Trigger Re-Audit</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 6: LIVE STORE INSPECTOR TERMINAL */}
      {activeTab === 'newInspector' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          {/* Header Banner */}
          <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-extrabold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                  Live District Inspection Terminal v4.2
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                <span>Conduct Live On-Site Store Inspection</span>
              </h3>
              <p className="text-xs text-slate-500">
                Grade store hygiene, cold storage temps, POS cash closing, and staff uniform SOPs in real time.
              </p>
            </div>

            {/* Calculated Grade Badge */}
            <div className="p-3 bg-slate-900 text-white rounded-2xl border border-slate-800 text-right shrink-0">
              <span className="text-[10px] text-slate-400 block font-mono font-bold uppercase">Auto Calculated Score</span>
              <div className="flex items-baseline justify-end gap-1.5">
                <span className="text-xl font-black text-emerald-400">
                  {Math.round((newHygieneScore + newSpeedScore + newComplianceScore + newFacilityScore) / 4)}%
                </span>
                <span className="text-xs font-bold text-slate-300">
                  ({Math.round((newHygieneScore + newSpeedScore + newComplianceScore + newFacilityScore) / 4) >= 80 ? 'Grade A' : 'Grade B'})
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitAudit} className="space-y-6 text-xs">
            {/* Step 1: Store & Auditor Identity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="font-extrabold text-slate-800 block mb-1">Target Store Outlet *</label>
                <select
                  value={newOutletId}
                  onChange={(e) => {
                    const sel = availableOutlets.find((o) => o.id === e.target.value);
                    if (sel) {
                      setNewOutletId(sel.id);
                      setNewOutletName(sel.name);
                    }
                  }}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-slate-900"
                >
                  {availableOutlets.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-extrabold text-slate-800 block mb-1">Auditor Name & ID *</label>
                <input
                  type="text"
                  required
                  value={newAuditorName}
                  onChange={(e) => setNewAuditorName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-800 block mb-1">On-Site Verification</label>
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setNewGpsVerified(!newGpsVerified);
                      showToast(newGpsVerified ? 'GPS location tag cleared.' : 'Store GPS Location Stamp verified!');
                    }}
                    className={`w-full p-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      newGpsVerified ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{newGpsVerified ? 'GPS Tag Verified' : 'Verify GPS Tag'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Multi-Category Performance Sliders */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Audited Performance Metric Category Scores</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hygiene & Cold Storage */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center font-extrabold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Food Safety & Hygiene Score
                    </span>
                    <span className="text-emerald-700 font-black text-sm">{newHygieneScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newHygieneScore}
                    onChange={(e) => setNewHygieneScore(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500">Chiller temps (&le; 4°C), oil TPM, raw meat cross-contamination log</p>
                </div>

                {/* Speed & KDS */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center font-extrabold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      Service Speed & KDS Fulfillment
                    </span>
                    <span className="text-indigo-700 font-black text-sm">{newSpeedScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newSpeedScore}
                    onChange={(e) => setNewSpeedScore(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500">Order prep cycle &lt; 180s, drive-thru timer, counter dispatch speed</p>
                </div>

                {/* Policy & Invoices */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center font-extrabold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      Policy & Cash Register Compliance
                    </span>
                    <span className="text-emerald-700 font-black text-sm">{newComplianceScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newComplianceScore}
                    onChange={(e) => setNewComplianceScore(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500">GST tax invoices, discount overrides authorized, register closing zero delta</p>
                </div>

                {/* Facility & Safety */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center font-extrabold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      Facility Maintenance & Safety SOP
                    </span>
                    <span className="text-amber-700 font-black text-sm">{newFacilityScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newFacilityScore}
                    onChange={(e) => setNewFacilityScore(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500">Fire extinguishers pressure check, washroom cleaning log, LED signage</p>
                </div>
              </div>
            </div>

            {/* Step 3: Mandatory On-Site Compliance Checklist */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-indigo-600" />
                <span>Mandatory On-Site Inspection Verification Items</span>
              </h4>

              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      item.checked
                        ? 'bg-emerald-50/50 border-emerald-300 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => {
                          setChecklist((prev) =>
                            prev.map((c) => (c.id === item.id ? { ...c, checked: !c.checked } : c))
                          );
                        }}
                        className="w-4 h-4 accent-emerald-600 rounded"
                      />
                      <span className="font-bold text-xs">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                      {item.category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 4: Photo Evidence & Observations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-extrabold text-slate-800 block">Inspection Photo Evidence Attachment</label>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-44 flex flex-col justify-end p-3">
                  <img src={inspectionPhotoUrl} alt="Inspection Photo" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  <div className="relative z-10 flex items-center justify-between bg-slate-900/90 p-2 rounded-xl border border-slate-700 backdrop-blur-xs">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      Kitchen Station Inspection Photo Attached
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        showToast('New inspection photo evidence uploaded!');
                      }}
                      className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-[10px] rounded-lg cursor-pointer"
                    >
                      Re-Upload Photo
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-extrabold text-slate-800 block">Critical Inspector Findings & Action Notes</label>
                <textarea
                  rows={6}
                  value={newCriticalNotes}
                  onChange={(e) => setNewCriticalNotes(e.target.value)}
                  placeholder="Record specific observations, non-compliances, temperature readings..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Step 5: Digital Sign-off & Submit */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto space-y-1">
                <label className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">Inspector Digital Sign-off</label>
                <input
                  type="text"
                  value={digitalSignature}
                  onChange={(e) => setDigitalSignature(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white p-2 rounded-xl text-xs font-bold w-full sm:w-64"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>Submit Official On-Site Inspection Record</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 7: AUDIT SYSTEM ARCHITECTURE */}
      {activeTab === 'architecture' && <AuditSystemArchitecture />}
      </>
      )}

      {/* MODAL 1: CREATE NEW CORRECTIVE TASK */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm">Create Corrective Action Task</h3>
              <button onClick={() => setIsAddTaskModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit shift handoff biometric logbook"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assignee</label>
                <input
                  type="text"
                  value={newTaskAssigned}
                  onChange={(e) => setNewTaskAssigned(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Severity</label>
                  <select
                    value={newTaskSeverity}
                    onChange={(e) => setNewTaskSeverity(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-extrabold rounded-xl">
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CERTIFICATE PRINT */}
      {selectedAuditForCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-black text-slate-900 text-sm">Official Audit Certificate</h3>
              <button onClick={() => setSelectedAuditForCertificate(null)} className="p-1 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2">
              <p className="font-black text-slate-900 text-base">{selectedAuditForCertificate.outletName}</p>
              <p className="text-slate-500">
                Auditor: {selectedAuditForCertificate.auditorName} • Overall Score: {selectedAuditForCertificate.overallScore}%
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => window.print()} className="px-4 py-2 bg-slate-100 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1">
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button onClick={() => setSelectedAuditForCertificate(null)} className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
