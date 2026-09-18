import React, { useState, useMemo } from 'react';
import { StaffMember } from '../../types';
import { StaffDashboard } from '../Staff/StaffDashboard';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  IndianRupee,
  Search,
  Filter,
  UserCheck,
  UserX,
  TrendingUp,
  Sparkles,
  Edit3,
  Eye,
  Building2,
  LayoutGrid,
  List,
  MessageSquareQuote,
  Award,
  ChevronRight,
  X,
  Sliders,
  BarChart3,
  PieChart as PieIcon,
  ShieldCheck,
  ArrowUpRight,
  Flame,
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

interface StaffPageProps {
  staff: StaffMember[];
}

export const StaffPage: React.FC<StaffPageProps> = ({ staff: initialStaff }) => {
  const [pageViewMode, setPageViewMode] = useState<'dashboard' | 'roster'>('dashboard');
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-31');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [outletFilter, setOutletFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal states
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null);

  // Quick edit form state
  const [editStatus, setEditStatus] = useState<'Present' | 'On Shift' | 'Absent' | 'On Leave'>('Present');
  const [editLogin, setEditLogin] = useState<string>('09:00 AM');
  const [editLogout, setEditLogout] = useState<string>('06:00 PM');
  const [editSales, setEditSales] = useState<number>(15000);
  const [editRating, setEditRating] = useState<number>(4.8);
  const [editFeedback, setEditFeedback] = useState<string>('');

  // Extract unique outlets
  const uniqueOutlets = Array.from(new Set(staffList.map((s) => s.outletName)));

  // Filtered staff list
  const filteredStaff = staffList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.outletName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Present'
        ? s.status === 'Present' || s.status === 'On Shift'
        : statusFilter === 'Absent'
        ? s.status === 'Absent'
        : s.status === statusFilter;

    const matchesOutlet = outletFilter === 'All' || s.outletName === outletFilter;

    return matchesSearch && matchesStatus && matchesOutlet;
  });

  // Calculate summary metrics
  const totalStaffCount = staffList.length;
  const totalPresents = staffList.filter((s) => s.status === 'Present' || s.status === 'On Shift').length;
  const totalAbsents = staffList.filter((s) => s.status === 'Absent').length;
  const totalOnLeave = staffList.filter((s) => s.status === 'On Leave').length;
  const totalDailySales = staffList.reduce((sum, s) => sum + (s.dailySales || 0), 0);
  const avgRating = (
    staffList.reduce((sum, s) => sum + (s.customerRating || 4.5), 0) / (staffList.length || 1)
  ).toFixed(1);

  // Handle edit submission
  const handleOpenEdit = (s: StaffMember) => {
    setEditingStaff(s);
    setEditStatus(s.status);
    setEditLogin(s.loginTime || '09:00 AM');
    setEditLogout(s.logoutTime || '06:00 PM');
    setEditSales(s.dailySales || 0);
    setEditRating(s.customerRating || 4.5);
    setEditFeedback(s.recentFeedback || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === editingStaff.id) {
          const wasPresent = s.status === 'Present' || s.status === 'On Shift';
          const isNowPresent = editStatus === 'Present' || editStatus === 'On Shift';
          let presentsDelta = 0;
          let absentsDelta = 0;

          if (!wasPresent && isNowPresent) {
            presentsDelta = 1;
            if (s.status === 'Absent') absentsDelta = -1;
          } else if (wasPresent && editStatus === 'Absent') {
            presentsDelta = -1;
            absentsDelta = 1;
          }

          return {
            ...s,
            status: editStatus,
            loginTime: editStatus === 'Absent' ? '-' : editLogin,
            logoutTime: editStatus === 'Absent' ? '-' : editLogout,
            dailySales: editStatus === 'Absent' ? 0 : editSales,
            customerRating: editRating,
            recentFeedback: editFeedback,
            totalPresents: Math.max(0, s.totalPresents + presentsDelta),
            totalAbsents: Math.max(0, s.totalAbsents + absentsDelta),
            date: selectedDate,
          };
        }
        return s;
      })
    );

    setEditingStaff(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* STAFF MODULE VIEW SWITCHER BAR */}
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
            <span>Staff Dashboard</span>
          </button>

          <button
            onClick={() => {
              setPageViewMode('roster');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              pageViewMode === 'roster'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Staff Roster & Shift Logs</span>
          </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs shrink-0 self-end sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-bold text-slate-700">Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="font-extrabold text-slate-900 bg-white border border-slate-300 rounded-lg px-2 py-0.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      {pageViewMode === 'dashboard' ? (
        <StaffDashboard
          staff={staffList}
          onOpenEdit={(member) => handleOpenEdit(member)}
          onViewStaff={(member) => setViewingStaff(member)}
        />
      ) : (
        <>
      {/* HEADER TITLE BANNER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
            <Users className="w-3 h-3 text-emerald-600" />
            <span>Store Workforce & Daily Attendance Tracker</span>
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
            Staff Operations & Shift Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track daily staff attendance, login/logout timestamps, sales generated, customer ratings & monthly presence.
          </p>
        </div>

        {/* DATE SELECTOR */}
        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 shrink-0">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-700">Attendance Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-extrabold text-slate-900 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* SUMMARY STATS METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Staff */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Total Staff</span>
            <Users className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalStaffCount}</p>
          <p className="text-[11px] text-slate-500">Across {uniqueOutlets.length} Outlets</p>
        </div>

        {/* Total Presents */}
        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold">Presents Today</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-950">{totalPresents}</p>
          <p className="text-[11px] text-emerald-700 font-medium">
            {Math.round((totalPresents / (totalStaffCount || 1)) * 100)}% Attendance Rate
          </p>
        </div>

        {/* Total Absents */}
        <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-xs font-bold">Absents Today</span>
            <UserX className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-950">{totalAbsents}</p>
          <p className="text-[11px] text-rose-700 font-medium">
            {totalOnLeave > 0 ? `${totalOnLeave} on scheduled leave` : 'No leave requests'}
          </p>
        </div>

        {/* Total Staff Daily Sales */}
        <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-800">
            <span className="text-xs font-bold">Daily Sales Handled</span>
            <IndianRupee className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-950">
            ₹{totalDailySales.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-indigo-700 font-medium">By active shift staff</p>
        </div>

        {/* Average Customer Rating */}
        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 shadow-xs space-y-1 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-amber-900">
            <span className="text-xs font-bold">Avg Staff Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-black text-amber-950">{avgRating}</p>
            <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
              / 5.0 ★
            </span>
          </div>
          <p className="text-[11px] text-amber-800 font-medium">Customer Review Score</p>
        </div>
      </div>

      {/* ANALYTICAL KPI CHARTS DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Store-wise Staff Sales vs Target Quotas */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Staff Sales Contribution vs Daily Quota (₹)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Staff member sales productivity benchmarked against daily ₹15,000 target
              </p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold rounded">
              Performance
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={staffList.slice(0, 8).map((s) => ({
                  name: s.name.split(' ')[0],
                  sales: s.dailySales,
                  target: 15000,
                  rating: s.customerRating,
                }))}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-xl">
                          <p className="font-black text-emerald-400">{d.name}</p>
                          <p className="text-slate-300">Sales Generated: <strong className="text-white">₹{d.sales.toLocaleString()}</strong></p>
                          <p className="text-slate-300">Target Standard: <strong className="text-white">₹{d.target.toLocaleString()}</strong></p>
                          <p className="text-slate-300">CSAT Score: <strong className="text-amber-400">{d.rating} ★</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="sales" name="Daily Sales (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Quota Target (₹)" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Actual Sales</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Standard Target (₹15k)</span>
            <span className="font-bold text-slate-700">Top: ₹{Math.max(...staffList.map((s) => s.dailySales)).toLocaleString()}</span>
          </div>
        </div>

        {/* Chart 2: Staff Role Distribution Mix */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Workforce Role Mix
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Headcount distribution across store roles
              </p>
            </div>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[10px] font-mono font-bold rounded">
              Mix
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Store Managers', value: Math.max(1, staffList.filter((s) => s.role.includes('Manager')).length) },
                    { name: 'Shift Leads', value: Math.max(1, staffList.filter((s) => s.role.includes('Lead') || s.role.includes('Supervisor')).length) },
                    { name: 'Kitchen & Crew', value: Math.max(1, staffList.filter((s) => s.role.includes('Crew') || s.role.includes('Kitchen') || s.role.includes('Chief')).length) },
                    { name: 'Cashiers & Baristas', value: Math.max(1, staffList.filter((s) => s.role.includes('Cashier') || s.role.includes('Service') || s.role.includes('Barista')).length) },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {['#10b981', '#6366f1', '#f59e0b', '#ec4899'].map((c, i) => (
                    <Cell key={`role-cell-${i}`} fill={c} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val} Staff Members`, 'Headcount']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Presence: {Math.round((totalPresents / (totalStaffCount || 1)) * 100)}%</span>
            <span className="font-bold text-indigo-600">{totalStaffCount} Active Profiles</span>
          </div>
        </div>
      </div>

      {/* FILTER, SEARCH, & VIEW CONTROLS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff name (Ravi, Keerthi, Raju...), role, outlet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present / On Shift</option>
              <option value="Absent">Absent</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          {/* Outlet Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Outlet:</span>
            <select
              value={outletFilter}
              onChange={(e) => setOutletFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              <option value="All">All Outlets</option>
              {uniqueOutlets.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold">
                  <th className="p-3.5">Staff Member</th>
                  <th className="p-3.5">Outlet & Role</th>
                  <th className="p-3.5">Attendance</th>
                  <th className="p-3.5">Login / Logout</th>
                  <th className="p-3.5 text-center">Presents / Absents</th>
                  <th className="p-3.5">Daily Sales</th>
                  <th className="p-3.5">Performance</th>
                  <th className="p-3.5">Customer Rating</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Staff Name */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 border border-slate-700 shadow-xs">
                          {s.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{s.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{selectedDate}</p>
                        </div>
                      </div>
                    </td>

                    {/* Outlet & Role */}
                    <td className="p-3.5">
                      <p className="font-bold text-slate-800">{s.outletName}</p>
                      <p className="text-[11px] font-semibold text-emerald-700">{s.role}</p>
                    </td>

                    {/* Attendance Status */}
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1.5 ${
                          s.status === 'On Shift'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : s.status === 'Present'
                            ? 'bg-teal-100 text-teal-900 border border-teal-300'
                            : s.status === 'Absent'
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {s.status === 'On Shift' || s.status === 'Present' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : s.status === 'Absent' ? (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{s.status}</span>
                      </span>
                    </td>

                    {/* Login / Logout */}
                    <td className="p-3.5">
                      {s.status === 'Absent' || s.status === 'On Leave' ? (
                        <span className="text-slate-400 font-mono text-[11px]">-</span>
                      ) : (
                        <div className="space-y-0.5 font-mono text-[11px]">
                          <p className="text-slate-700 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            <span>In: {s.loginTime}</span>
                          </p>
                          <p className="text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Out: {s.logoutTime}</span>
                          </p>
                        </div>
                      )}
                    </td>

                    {/* Presents / Absents */}
                    <td className="p-3.5 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                        <span className="font-bold text-emerald-700 text-xs" title="Monthly Presents">
                          {s.totalPresents}P
                        </span>
                        <span className="text-slate-300">/</span>
                        <span className="font-bold text-rose-600 text-xs" title="Monthly Absents">
                          {s.totalAbsents}A
                        </span>
                      </div>
                    </td>

                    {/* Daily Sales */}
                    <td className="p-3.5 font-black text-slate-900">
                      {s.dailySales > 0 ? (
                        <span className="text-indigo-900 font-extrabold">
                          ₹{s.dailySales.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">₹0</span>
                      )}
                    </td>

                    {/* Performance */}
                    <td className="p-3.5">
                      <div className="w-24 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-600">Score</span>
                          <span className="text-slate-900 font-black">{s.performanceScore}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              s.performanceScore >= 90
                                ? 'bg-emerald-500'
                                : s.performanceScore >= 80
                                ? 'bg-teal-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${s.performanceScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Customer Rating */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                        <span className="font-black text-slate-900">{(s.customerRating ?? 4.5).toFixed(1)}</span>
                      </div>
                      {s.recentFeedback && (
                        <p className="text-[10px] text-slate-500 truncate max-w-[140px]" title={s.recentFeedback}>
                          "{s.recentFeedback}"
                        </p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setViewingStaff(s)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-colors"
                        title="View Profile Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold text-[11px] transition-colors"
                        title="Mark Attendance & Log Shift"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredStaff.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-500">
                      No staff members match the selected criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 hover:border-emerald-300 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {s.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{s.name}</h3>
                    <p className="text-xs font-semibold text-emerald-700">{s.role}</p>
                    <p className="text-[11px] text-slate-500">{s.outletName}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                    s.status === 'On Shift'
                      ? 'bg-emerald-100 text-emerald-800'
                      : s.status === 'Present'
                      ? 'bg-teal-100 text-teal-800'
                      : s.status === 'Absent'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {s.status}
                </span>
              </div>

              {/* Login/Logout & Attendance Grid */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Login / Logout</p>
                  <p className="font-mono font-bold text-slate-800 mt-0.5">
                    {s.status === 'Absent' ? '-' : `${s.loginTime} - ${s.logoutTime}`}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Monthly Attendance</p>
                  <p className="font-bold text-slate-800 mt-0.5">
                    <span className="text-emerald-700">{s.totalPresents} Presents</span> ·{' '}
                    <span className="text-rose-600">{s.totalAbsents} Absents</span>
                  </p>
                </div>
              </div>

              {/* Sales & Rating */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Today's Sales</span>
                  <p className="text-sm font-black text-indigo-950">
                    ₹{s.dailySales.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                    <span className="text-sm font-black text-slate-900">
                      {(s.customerRating ?? 4.5).toFixed(1)} / 5.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Feedback Quote */}
              {s.recentFeedback && (
                <div className="p-2.5 bg-amber-50/80 border border-amber-200/70 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="italic">"{s.recentFeedback}"</p>
                </div>
              )}

              {/* Performance Score & Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Score: </span>
                  <span className="font-extrabold text-slate-900 text-xs">{s.performanceScore}/100</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewingStaff(s)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Log</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </>
      )}

      {/* QUICK MARK ATTENDANCE & SHIFT EDIT MODAL */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Mark Attendance & Log Shift
                </h3>
                <p className="text-xs text-slate-500">{editingStaff.name} ({editingStaff.role})</p>
              </div>
              <button
                onClick={() => setEditingStaff(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Status Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Attendance Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Present', 'On Shift', 'Absent', 'On Leave'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        editStatus === st
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Login & Logout Times */}
              {editStatus !== 'Absent' && editStatus !== 'On Leave' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Login Time
                    </label>
                    <input
                      type="text"
                      value={editLogin}
                      onChange={(e) => setEditLogin(e.target.value)}
                      placeholder="e.g. 08:30 AM"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Logout Time
                    </label>
                    <input
                      type="text"
                      value={editLogout}
                      onChange={(e) => setEditLogout(e.target.value)}
                      placeholder="e.g. 06:00 PM or Active"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Daily Sales */}
              {editStatus !== 'Absent' && editStatus !== 'On Leave' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Daily Sales Handled (₹)
                  </label>
                  <input
                    type="number"
                    value={editSales}
                    onChange={(e) => setEditSales(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Customer Rating */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Customer Rating (1.0 to 5.0)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="flex-1 accent-emerald-600"
                  />
                  <span className="font-extrabold text-slate-900 text-xs w-10">
                    {editRating.toFixed(1)} ★
                  </span>
                </div>
              </div>

              {/* Recent Feedback */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Customer Feedback / Review
                </label>
                <textarea
                  rows={2}
                  value={editFeedback}
                  onChange={(e) => setEditFeedback(e.target.value)}
                  placeholder="Enter customer quote or staff performance feedback..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILED STAFF PROFILE MODAL */}
      {viewingStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-black text-base flex items-center justify-center">
                  {viewingStaff.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">{viewingStaff.name}</h3>
                  <p className="text-xs font-semibold text-emerald-700">
                    {viewingStaff.role} · {viewingStaff.outletName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingStaff(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status & Date */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Log Date</span>
                  <p className="font-extrabold text-slate-900 text-xs">{selectedDate}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                  <p className="font-extrabold text-emerald-700 text-xs">{viewingStaff.status}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Login / Logout</span>
                  <p className="font-mono font-bold text-slate-800 text-xs">
                    {viewingStaff.status === 'Absent'
                      ? '-'
                      : `${viewingStaff.loginTime} - ${viewingStaff.logoutTime}`}
                  </p>
                </div>
              </div>

              {/* Monthly Attendance Record */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/80">
                  <span className="text-xs font-bold text-emerald-900">Monthly Presents</span>
                  <p className="text-2xl font-black text-emerald-950 mt-1">
                    {viewingStaff.totalPresents} Days
                  </p>
                  <p className="text-[10px] text-emerald-700 mt-0.5">Verified on-time attendance</p>
                </div>

                <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200/80">
                  <span className="text-xs font-bold text-rose-900">Monthly Absents</span>
                  <p className="text-2xl font-black text-rose-950 mt-1">
                    {viewingStaff.totalAbsents} Days
                  </p>
                  <p className="text-[10px] text-rose-700 mt-0.5">Includes unexcused leave</p>
                </div>
              </div>

              {/* Performance & Sales */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700">Daily Sales Generated</span>
                  <p className="text-xl font-black text-slate-900 mt-1">
                    ₹{viewingStaff.dailySales.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
                  <span className="text-xs font-bold text-amber-900">Customer Rating</span>
                  <p className="text-xl font-black text-amber-950 mt-1">
                    {(viewingStaff.customerRating ?? 4.5).toFixed(1)} / 5.0 ★
                  </p>
                </div>
              </div>

              {/* Customer Feedback */}
              {viewingStaff.recentFeedback && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Customer Feedback
                  </span>
                  <p className="text-xs text-slate-800 italic">"{viewingStaff.recentFeedback}"</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingStaff(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
