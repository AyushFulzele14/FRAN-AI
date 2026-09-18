import React, { useState } from 'react';
import {
  NotificationItem,
  NotificationPriority,
  NotificationChannel,
} from '../../types';
import {
  Search,
  Filter,
  Download,
  Mail,
  MessageSquare,
  Smartphone,
  ShieldAlert,
  Bell,
  CheckCircle2,
  Clock,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  Copy,
  Radio,
} from 'lucide-react';

interface NotificationHistoryViewProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onResendNotification: (item: NotificationItem) => void;
  selectedNotificationId?: string | null;
}

export const NotificationHistoryView: React.FC<NotificationHistoryViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onResendNotification,
  selectedNotificationId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(selectedNotificationId || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy raw notification payload
  const handleCopyText = (item: NotificationItem) => {
    const text = `[${item.priority}] ${item.title}\nChannels: ${item.channels.join(', ')}\nRecipient: ${item.recipientSummary}\nMessage: ${item.message}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Priority', 'Title', 'Channels', 'Recipient', 'Outlet', 'Timestamp', 'Status'];
    const rows = notifications.map((n) => [
      n.id,
      n.priority,
      `"${n.title.replace(/"/g, '""')}"`,
      n.channels.join('+'),
      `"${n.recipientSummary.replace(/"/g, '""')}"`,
      `"${(n.outletName || 'All Outlets').replace(/"/g, '""')}"`,
      n.timestamp,
      n.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `franai_notifications_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Notifications
  const filteredList = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.outletName && n.outletName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      n.recipientSummary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChannel = channelFilter === 'all' || n.channels.includes(channelFilter as NotificationChannel);
    const matchesPriority = priorityFilter === 'all' || n.priority === priorityFilter;
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'unread'
        ? !n.read
        : statusFilter === 'read'
        ? n.read
        : n.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesChannel && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Export Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-800">
                Auditable Dispatch Logs
              </span>
              <span className="text-xs text-slate-400">Total {notifications.length} Historical Broadcasts</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Notification History & Carrier Receipts
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review full email message contents, SMS carrier delivery acknowledgments, and mobile push open rates.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onMarkAllAsRead}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Mark All Read
            </button>

            <button
              id="export-notifications-csv-btn"
              onClick={handleExportCSV}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, store, recipient, or text..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-7 flex flex-wrap items-center gap-2 justify-start sm:justify-end">
            {/* Channel filter */}
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Channels</option>
              <option value="email">Email Only</option>
              <option value="sms">SMS Only</option>
              <option value="mobile">Mobile Push Only</option>
            </select>

            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="P1 - Critical">P1 - Critical</option>
              <option value="P2 - High">P2 - High</option>
              <option value="P3 - Medium">P3 - Medium</option>
              <option value="P4 - Low">P4 - Low</option>
            </select>

            {/* Read status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
              <option value="delivered">Delivered Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">No notifications found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting your filter parameters or search terms.</p>
          </div>
        ) : (
          filteredList.map((item) => {
            const isExpanded = expandedId === item.id;
            const isCritical = item.priority === 'P1 - Critical';
            const isHigh = item.priority === 'P2 - High';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                  !item.read ? 'ring-2 ring-indigo-500/20 shadow-xs' : 'shadow-2xs'
                } ${
                  isCritical
                    ? 'border-rose-200'
                    : isHigh
                    ? 'border-amber-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Main Clickable Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`p-2.5 rounded-2xl shrink-0 ${
                        isCritical
                          ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                          : isHigh
                          ? 'bg-amber-500 text-white'
                          : item.priority === 'P3 - Medium'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-white'
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

                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>

                        {item.outletName && (
                          <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                            {item.outletName}
                          </span>
                        )}

                        <span className="text-xs text-slate-400">{item.timestamp}</span>

                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" title="Unread"></span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{item.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">{item.message}</p>
                    </div>
                  </div>

                  {/* Right summary badges & toggle */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <div className="flex items-center gap-1.5">
                      {item.channels.includes('email') && (
                        <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200" title="Email">
                          <Mail className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {item.channels.includes('sms') && (
                        <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200" title="SMS">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {item.channels.includes('mobile') && (
                        <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200" title="Push">
                          <Smartphone className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 block">{item.recipientCount} Inboxes</span>
                      <span className="text-[10px] text-emerald-600 font-bold block">100% Delivered</span>
                    </div>

                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Breakdown Box */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-5 animate-in fade-in duration-150">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                      <div className="text-xs">
                        <span className="text-slate-500">Target Recipient Breakdown: </span>
                        <strong className="text-slate-900">{item.recipientSummary}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyText(item)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === item.id ? 'Copied' : 'Copy Payload'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onResendNotification(item)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Resend Broadcast</span>
                        </button>

                        {!item.read && (
                          <button
                            type="button"
                            onClick={() => onMarkAsRead(item.id)}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Mark Read</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Specific Channel Deliverable Boxes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Email Card */}
                      {item.emailDetails ? (
                        <div className="p-4 bg-white rounded-2xl border border-blue-200/80 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-blue-900 border-b border-blue-100 pb-2">
                            <span className="flex items-center gap-1.5">
                              <Mail className="w-4 h-4 text-blue-600" /> Email Deliverable
                            </span>
                            <span className="text-[10px] font-bold text-blue-700">SES Delivered</span>
                          </div>
                          <p className="text-xs font-extrabold text-slate-900 leading-tight">
                            {item.emailDetails.subject}
                          </p>
                          <p className="text-[11px] text-slate-600 whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto">
                            {item.message}
                          </p>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                            <span>Open Rate: {item.emailDetails.openRate || 85}%</span>
                            <span>Latency: 720ms</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-white/50 rounded-2xl border border-slate-200 flex items-center justify-center text-xs text-slate-400">
                          Email channel not selected
                        </div>
                      )}

                      {/* SMS Card */}
                      {item.smsDetails ? (
                        <div className="p-4 bg-white rounded-2xl border border-emerald-200/80 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 border-b border-emerald-100 pb-2">
                            <span className="flex items-center gap-1.5">
                              <MessageSquare className="w-4 h-4 text-emerald-600" /> SMS Alert ({item.smsDetails.senderId})
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700">Airtel DLT Ack</span>
                          </div>
                          <div className="p-2.5 bg-emerald-50 rounded-xl text-xs font-mono text-emerald-900 leading-relaxed">
                            {item.smsDetails.text}
                          </div>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                            <span>{item.smsDetails.charCount} chars • {item.smsDetails.smsSegments} segment</span>
                            <span>Latency: 380ms</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-white/50 rounded-2xl border border-slate-200 flex items-center justify-center text-xs text-slate-400">
                          SMS channel not selected
                        </div>
                      )}

                      {/* Mobile Push Card */}
                      {item.mobileDetails ? (
                        <div className="p-4 bg-white rounded-2xl border border-purple-200/80 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-purple-900 border-b border-purple-100 pb-2">
                            <span className="flex items-center gap-1.5">
                              <Smartphone className="w-4 h-4 text-purple-600" /> Mobile Push Alert
                            </span>
                            <span className="text-[10px] font-bold text-purple-700">APNS/FCM Socket</span>
                          </div>
                          <p className="text-xs font-extrabold text-slate-900 leading-tight">
                            {item.mobileDetails.pushTitle}
                          </p>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {item.mobileDetails.pushBody}
                          </p>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                            <span>Sound: {item.mobileDetails.sound}</span>
                            <span>Deep Link: {item.mobileDetails.deepLinkUrl}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-white/50 rounded-2xl border border-slate-200 flex items-center justify-center text-xs text-slate-400">
                          Mobile push not selected
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
