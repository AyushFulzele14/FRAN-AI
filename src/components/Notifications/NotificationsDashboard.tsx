import React, { useState, useMemo } from 'react';
import {
  NotificationItem,
  NotificationRule,
  NotificationPriority,
  NotificationChannel,
} from '../../types';
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
  Legend,
} from 'recharts';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  SlidersHorizontal,
  TrendingUp,
  ShieldAlert,
  Zap,
  Radio,
  Filter,
  Users,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

interface NotificationsDashboardProps {
  notifications: NotificationItem[];
  rules: NotificationRule[];
  onNavigateToTab: (tab: 'dashboard' | 'send' | 'rules' | 'history' | 'simulator') => void;
  onSelectNotificationForInspection?: (item: NotificationItem) => void;
  onTriggerTestRule?: (ruleId: string) => void;
}

export const NotificationsDashboard: React.FC<NotificationsDashboardProps> = ({
  notifications,
  rules,
  onNavigateToTab,
  onSelectNotificationForInspection,
  onTriggerTestRule,
}) => {
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  // Interactive selection state for chart drilldown
  const [drilldownPriority, setDrilldownPriority] = useState<string | null>(null);
  const [drilldownDay, setDrilldownDay] = useState<string | null>(null);

  // High-level KPI calculations
  const totalSent = notifications.length;
  const criticalCount = notifications.filter((n) => n.priority === 'P1 - Critical').length;
  const highCount = notifications.filter((n) => n.priority === 'P2 - High').length;
  const mediumCount = notifications.filter((n) => n.priority === 'P3 - Medium').length;
  const lowCount = notifications.filter((n) => n.priority === 'P4 - Low').length;

  const emailCount = notifications.filter((n) => n.channels.includes('email')).length;
  const smsCount = notifications.filter((n) => n.channels.includes('sms')).length;
  const mobileCount = notifications.filter((n) => n.channels.includes('mobile')).length;

  const activeRulesCount = rules.filter((r) => r.isEnabled).length;

  // Chart 1: 7-Day Multi-Channel Dispatch Volume
  const volumeTrendData = useMemo(() => [
    { day: 'Mon', email: 42, sms: 28, mobile: 56, total: 126, p1: 1, p2: 4 },
    { day: 'Tue', email: 38, sms: 19, mobile: 48, total: 105, p1: 0, p2: 2 },
    { day: 'Wed', email: 64, sms: 35, mobile: 72, total: 171, p1: 2, p2: 5 },
    { day: 'Thu', email: 51, sms: 24, mobile: 61, total: 136, p1: 1, p2: 3 },
    { day: 'Fri', email: 89, sms: 62, mobile: 110, total: 261, p1: 3, p2: 9 },
    { day: 'Sat', email: 95, sms: 78, mobile: 135, total: 308, p1: 4, p2: 12 },
    { day: 'Sun (Today)', email: 73, sms: 49, mobile: 94, total: 216, p1: 3, p2: 7 },
  ], []);

  // Chart 2: Priority Distribution
  const priorityDonutData = useMemo(() => [
    { name: 'P1 - Critical', value: criticalCount || 2, color: '#ef4444', desc: 'Siren, SMS failover & emergency override' },
    { name: 'P2 - High', value: highCount || 4, color: '#f59e0b', desc: 'Operational stockouts & target pacing' },
    { name: 'P3 - Medium', value: mediumCount || 5, color: '#6366f1', desc: 'Roster shifts & compliance reminders' },
    { name: 'P4 - Low', value: lowCount || 3, color: '#10b981', desc: 'Milestones & weekly digests' },
  ], [criticalCount, highCount, mediumCount, lowCount]);

  // Chart 3: Channel Delivery Success Rates
  const channelPerformanceData = [
    { channel: 'Email (SMTP/SES)', delivered: 99.4, openRate: 84.2, latency: '820ms', icon: Mail, color: '#3b82f6' },
    { channel: 'SMS Gateway (DLT)', delivered: 99.1, openRate: 98.6, latency: '390ms', icon: MessageSquare, color: '#10b981' },
    { channel: 'Mobile Push (FCM/APNS)', delivered: 98.7, openRate: 64.5, latency: '190ms', icon: Smartphone, color: '#8b5cf6' },
  ];

  // Filtered notifications list for quick review
  const recentAlerts = useMemo(() => {
    return notifications.filter((item) => {
      if (selectedChannelFilter !== 'all' && !item.channels.includes(selectedChannelFilter as any)) {
        return false;
      }
      if (selectedPriorityFilter !== 'all' && item.priority !== selectedPriorityFilter) {
        return false;
      }
      if (drilldownPriority && item.priority !== drilldownPriority) {
        return false;
      }
      return true;
    });
  }, [notifications, selectedChannelFilter, selectedPriorityFilter, drilldownPriority]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Header with Quick Dispatches */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Abstract background accents */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Live Multi-Channel Gateway
              </span>
              <span className="text-xs text-slate-400 font-medium">DLT-Approved & APNS Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Notifications & Dispatch Command
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Real-time multi-channel broadcast center for all franchise networks. Dispatches urgent SMS alerts, 
              templated emails, mobile push notifications, and automated threshold trigger rules with strict priority failovers.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="dash-send-broadcast-btn"
              onClick={() => onNavigateToTab('send')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send New Broadcast</span>
            </button>

            <button
              id="dash-manage-rules-btn"
              onClick={() => onNavigateToTab('rules')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-bold rounded-xl border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-indigo-300" />
              <span>Configure Rules ({activeRulesCount} Active)</span>
            </button>

            <button
              id="dash-open-simulator-btn"
              onClick={() => onNavigateToTab('simulator')}
              className="px-3 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Test incoming alert preview on mobile & email inbox"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Device Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Broadcasts */}
        <div 
          onClick={() => { setSelectedPriorityFilter('all'); setSelectedChannelFilter('all'); setDrilldownPriority(null); }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Broadcasts</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalSent}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +18% w/w
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across 3 communication channels</p>
        </div>

        {/* Email Dispatches */}
        <div 
          onClick={() => { setSelectedChannelFilter('email'); setSelectedPriorityFilter('all'); }}
          className={`bg-white p-5 rounded-2xl border shadow-2xs hover:shadow-xs transition-all cursor-pointer group ${
            selectedChannelFilter === 'email' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Inboxes</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{emailCount}</span>
            <span className="text-xs font-semibold text-blue-600">99.4% Delivery</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Avg Open Rate: 84.2%</p>
        </div>

        {/* SMS Alerts */}
        <div 
          onClick={() => { setSelectedChannelFilter('sms'); setSelectedPriorityFilter('all'); }}
          className={`bg-white p-5 rounded-2xl border shadow-2xs hover:shadow-xs transition-all cursor-pointer group ${
            selectedChannelFilter === 'sms' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SMS Alerts (DLT)</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{smsCount}</span>
            <span className="text-xs font-semibold text-emerald-600">99.1% Delivery</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Direct telco fast-track carrier routing</p>
        </div>

        {/* Mobile Push */}
        <div 
          onClick={() => { setSelectedChannelFilter('mobile'); setSelectedPriorityFilter('all'); }}
          className={`bg-white p-5 rounded-2xl border shadow-2xs hover:shadow-xs transition-all cursor-pointer group ${
            selectedChannelFilter === 'mobile' ? 'border-purple-500 ring-2 ring-purple-100' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Push</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{mobileCount}</span>
            <span className="text-xs font-semibold text-purple-600">190ms Latency</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">iOS APNS & Android FCM deep-links</p>
        </div>
      </div>

      {/* Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Multi-Channel Dispatch Velocity (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">Weekly Dispatch Velocity & Channel Mix</h3>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">Interactive</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Click any day bar to inspect channel split and priority incident counts</p>
            </div>

            {/* Quick Channel Highlight Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setSelectedChannelFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedChannelFilter === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                All Channels
              </button>
              <button
                onClick={() => setSelectedChannelFilter('email')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedChannelFilter === 'email' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setSelectedChannelFilter('sms')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedChannelFilter === 'sms' ? 'bg-white text-emerald-700 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                SMS
              </button>
              <button
                onClick={() => setSelectedChannelFilter('mobile')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedChannelFilter === 'mobile' ? 'bg-white text-purple-700 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Mobile Push
              </button>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={volumeTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    const dayItem = e.activePayload[0].payload;
                    setDrilldownDay(drilldownDay === dayItem.day ? null : dayItem.day);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                  }}
                  formatter={(val: any, name: any) => [`${val} dispatches`, name === 'email' ? 'Email' : name === 'sms' ? 'SMS' : 'Mobile Push']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                {(selectedChannelFilter === 'all' || selectedChannelFilter === 'email') && (
                  <Bar dataKey="email" name="Email" fill="#3b82f6" radius={[4, 4, 0, 0]} cursor="pointer" />
                )}
                {(selectedChannelFilter === 'all' || selectedChannelFilter === 'sms') && (
                  <Bar dataKey="sms" name="SMS Alert" fill="#10b981" radius={[4, 4, 0, 0]} cursor="pointer" />
                )}
                {(selectedChannelFilter === 'all' || selectedChannelFilter === 'mobile') && (
                  <Bar dataKey="mobile" name="Mobile Push" fill="#8b5cf6" radius={[4, 4, 0, 0]} cursor="pointer" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Drilldown Banner when a day is selected */}
          {drilldownDay && (
            <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                <span className="font-bold text-indigo-900">Drilldown for {drilldownDay}:</span>
                {(() => {
                  const dayObj = volumeTrendData.find((d) => d.day === drilldownDay);
                  if (!dayObj) return null;
                  return (
                    <span className="text-indigo-700">
                      Total: {dayObj.total} | Email: {dayObj.email} | SMS: {dayObj.sms} | Push: {dayObj.mobile} | {dayObj.p1} Critical (P1) alarms
                    </span>
                  );
                })()}
              </div>
              <button
                onClick={() => setDrilldownDay(null)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
              >
                Clear Drilldown
              </button>
            </div>
          )}
        </div>

        {/* Priority Breakdown (Interactive Donut Pie Chart) */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-extrabold text-slate-900 text-base">Priority Distribution</h3>
              <span className="text-xs font-bold text-slate-400">P1 to P4</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">Click any priority ring to filter the feed below</p>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityDonutData}
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                    cursor="pointer"
                    onClick={(entry) => {
                      setDrilldownPriority(drilldownPriority === entry.name ? null : entry.name);
                    }}
                  >
                    {priorityDonutData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={drilldownPriority === entry.name ? '#0f172a' : '#fff'}
                        strokeWidth={drilldownPriority === entry.name ? 3 : 1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Label in Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-slate-900 leading-none">
                  {criticalCount + highCount + mediumCount + lowCount}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alerts</span>
              </div>
            </div>

            {/* Priority Legend Cards */}
            <div className="space-y-1.5 mt-2">
              {priorityDonutData.map((item) => (
                <div
                  key={item.name}
                  onClick={() => setDrilldownPriority(drilldownPriority === item.name ? null : item.name)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer text-xs ${
                    drilldownPriority === item.name
                      ? 'bg-slate-900 text-white font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {drilldownPriority && (
            <button
              onClick={() => setDrilldownPriority(null)}
              className="mt-3 w-full py-1.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-all"
            >
              Reset Priority Filter
            </button>
          )}
        </div>
      </div>

      {/* Gateway Infrastructure Health & SLA Benchmarks */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Channel Gateway Health & Real-Time SLAs</h3>
            <p className="text-xs text-slate-500 mt-0.5">Automated health checks across Airtel/Jio SMS routes, AWS SES, and APNS/FCM sockets</p>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            All Gateways Healthy (99.2% Net Uptime)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {channelPerformanceData.map((channel) => {
            const Icon = channel.icon;
            return (
              <div key={channel.channel} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white shadow-2xs" style={{ color: channel.color }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">{channel.channel}</h4>
                      <p className="text-[10px] text-slate-500">Latency: {channel.latency}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    {channel.delivered}% Success
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                  <span>Engagement / Read:</span>
                  <span className="font-bold text-slate-900">{channel.openRate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Dispatches Feed with Interactive Inspector */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-base">Recent Multi-Channel Broadcast Log</h3>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {recentAlerts.length} Available
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Click any notification card to inspect raw email payload, SMS carrier receipt & mobile push layout</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTab('history')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View Full History ({notifications.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Notifications Card List */}
        <div className="space-y-3">
          {recentAlerts.slice(0, 5).map((item) => {
            const isCritical = item.priority === 'P1 - Critical';
            const isHigh = item.priority === 'P2 - High';

            return (
              <div
                key={item.id}
                onClick={() => onSelectNotificationForInspection && onSelectNotificationForInspection(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCritical
                    ? 'bg-rose-50/50 border-rose-200 hover:border-rose-400'
                    : isHigh
                    ? 'bg-amber-50/40 border-amber-200 hover:border-amber-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Left: Priority Badge, Icon & Title */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      isCritical
                        ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                        : isHigh
                        ? 'bg-amber-500 text-white'
                        : item.priority === 'P3 - Medium'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {isCritical ? <ShieldAlert className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800'
                            : isHigh
                            ? 'bg-amber-100 text-amber-800'
                            : item.priority === 'P3 - Medium'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {item.priority}
                      </span>

                      {item.outletName && (
                        <span className="text-xs font-semibold text-slate-700 bg-white/80 border border-slate-200 px-2 py-0.5 rounded-md truncate max-w-xs">
                          {item.outletName}
                        </span>
                      )}

                      <span className="text-xs text-slate-400 font-medium">{item.timestamp}</span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1">{item.message}</p>
                  </div>
                </div>

                {/* Right: Channels Used & Recipients */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="flex items-center gap-1.5">
                    {item.channels.includes('email') && (
                      <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/80" title="Sent via Email">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {item.channels.includes('sms') && (
                      <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80" title="Sent via SMS Alert">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {item.channels.includes('mobile') && (
                      <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/80" title="Sent via Mobile Push">
                        <Smartphone className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-700 block">{item.recipientCount} Recipients</span>
                    <span className="text-[10px] text-slate-400 block">{item.status}</span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
