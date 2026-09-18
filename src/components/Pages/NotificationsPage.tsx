import React, { useState } from 'react';
import {
  NotificationItem,
  NotificationRule,
  Outlet,
  FranchiseGroup,
} from '../../types';
import { NotificationsDashboard } from '../Notifications/NotificationsDashboard';
import { SendBroadcastHub } from '../Notifications/SendBroadcastHub';
import { NotificationRulesManager } from '../Notifications/NotificationRulesManager';
import { NotificationHistoryView } from '../Notifications/NotificationHistoryView';
import { NotificationSimulator } from '../Notifications/NotificationSimulator';
import {
  Bell,
  Send,
  SlidersHorizontal,
  Clock,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  X,
  Radio,
  Sparkles,
} from 'lucide-react';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onUpdateNotifications: (notifications: NotificationItem[]) => void;
  rules: NotificationRule[];
  onUpdateRules: (rules: NotificationRule[]) => void;
  outlets: Outlet[];
  franchises: FranchiseGroup[];
  onNavigateToTab?: (tab: string) => void;
}

type SubTab = 'dashboard' | 'send' | 'rules' | 'history' | 'simulator';

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onUpdateNotifications,
  rules,
  onUpdateRules,
  outlets,
  franchises,
  onNavigateToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('dashboard');
  const [inspectedNotificationId, setInspectedNotificationId] = useState<string | null>(null);

  // Live Toast state when an action completes
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'alert' } | null>(
    null
  );

  const showToast = (title: string, desc: string, type: 'success' | 'alert' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Dispatch new broadcast
  const handleDispatchNotification = (newNotification: NotificationItem) => {
    onUpdateNotifications([newNotification, ...notifications]);
    showToast(
      'Broadcast Dispatched!',
      `Sent to ${newNotification.recipientCount} recipients across ${newNotification.channels.join(', ')}.`
    );
  };

  // Test trigger rule
  const handleTriggerTestRule = (ruleId: string) => {
    const targetRule = rules.find((r) => r.id === ruleId);
    if (!targetRule) return;

    // Increment trigger count
    const updatedRules = rules.map((r) => {
      if (r.id === ruleId) {
        return {
          ...r,
          triggerCount: r.triggerCount + 1,
          lastTriggered: 'Just now',
        };
      }
      return r;
    });
    onUpdateRules(updatedRules);

    // Create simulated notification
    const testNotification: NotificationItem = {
      id: `notif-test-${Date.now()}`,
      title: `[RULE TRIGGER] ${targetRule.name}`,
      message: `Automated condition triggered: ${targetRule.triggerCondition} (Threshold: ${targetRule.threshold}). Auto-dispatched to ${targetRule.targetAudience}.`,
      priority: targetRule.priority,
      channels: targetRule.channels,
      recipientType: targetRule.targetAudience,
      recipientCount: targetRule.targetAudience === 'All Store Managers' ? outlets.length : 6,
      recipientSummary: `${targetRule.targetAudience} via ${targetRule.channels.join(', ')}`,
      timestamp: 'Just now',
      status: 'Delivered',
      read: false,
      source: 'Automated Rule',
      ruleId: targetRule.id,
      category: targetRule.category,
      emailDetails: targetRule.channels.includes('email')
        ? {
            subject: `[AUTOMATED ALARM] ${targetRule.name}`,
            toAddresses: ['ops@franai-network.com', 'regional-mgr@franai.in'],
            deliveredCount: 6,
            openRate: 0,
          }
        : undefined,
      smsDetails: targetRule.channels.includes('sms')
        ? {
            senderId: 'VK-FRANAI',
            text: `RULE ALARM: ${targetRule.name}. Condition ${targetRule.threshold} breached. Ack: https://fran.ai/t/test`,
            charCount: 120,
            smsSegments: 1,
            phoneNumbers: ['+91 98765 43210'],
            deliveredCount: 6,
            operatorAck: 'DELIVRD_AIRTEL_100%',
          }
        : undefined,
      mobileDetails: targetRule.channels.includes('mobile')
        ? {
            pushTitle: `🚨 Rule Triggered: ${targetRule.name}`,
            pushBody: `Condition ${targetRule.threshold} exceeded. Tap to acknowledge.`,
            deepLinkUrl: '/outlets',
            sound: targetRule.priority === 'P1 - Critical' ? 'Urgent Siren' : 'Store Chime',
            badgeIncrement: 1,
            deliveredDevices: 6,
          }
        : undefined,
    };

    // If email channel is configured on rule, dispatch real email to user
    if (targetRule.channels.includes('email')) {
      fetch('/api/notifications/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'saranyanagamalli1208@gmail.com',
          subject: `[FranAI Real Rule Alert] ${targetRule.name}`,
          text: `Automated Rule Triggered: ${targetRule.name}\nCondition: ${targetRule.triggerCondition} (Threshold: ${targetRule.threshold})\nPriority: ${targetRule.priority}\nTarget: ${targetRule.targetAudience}\nDispatched at: ${new Date().toLocaleString()}`,
          priority: targetRule.priority,
          category: targetRule.category,
          outletName: 'Network Outlets',
        }),
      }).catch((e) => console.error('Rule test email error:', e));
    }

    onUpdateNotifications([testNotification, ...notifications]);
    showToast(
      'Automated Rule Test Executed!',
      `Rule "${targetRule.name}" triggered & real email dispatched to saranyanagamalli1208@gmail.com!`,
      'alert'
    );
  };

  // Mark as read
  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) => {
      if (n.id === id) return { ...n, read: true };
      return n;
    });
    onUpdateNotifications(updated);
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    onUpdateNotifications(updated);
    showToast('All Read', 'All notifications marked as read.');
  };

  // Resend notification
  const handleResendNotification = (item: NotificationItem) => {
    const copy: NotificationItem = {
      ...item,
      id: `notif-resend-${Date.now()}`,
      timestamp: 'Just now',
      status: 'Delivered',
      read: false,
    };
    onUpdateNotifications([copy, ...notifications]);
    showToast('Broadcast Resent', `Successfully re-broadcasted "${item.title}" to ${item.recipientSummary}.`);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Sub-Navigation Tabs Bar */}
      <div className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between overflow-x-auto gap-1">
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-max">
          {/* Dashboard Tab */}
          <button
            id="tab-notifications-dashboard"
            onClick={() => setActiveSubTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Interactive Dashboard</span>
          </button>

          {/* Send Broadcast Tab */}
          <button
            id="tab-notifications-send"
            onClick={() => setActiveSubTab('send')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'send'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Send Broadcast</span>
          </button>

          {/* Notification Rules Tab */}
          <button
            id="tab-notifications-rules"
            onClick={() => setActiveSubTab('rules')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'rules'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Notification Rules ({rules.filter((r) => r.isEnabled).length})</span>
          </button>

          {/* History & Logs Tab */}
          <button
            id="tab-notifications-history"
            onClick={() => setActiveSubTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'history'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Activity & Carrier Logs</span>
            {unreadCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  activeSubTab === 'history' ? 'bg-white text-indigo-900' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Device Simulator Tab */}
          <button
            id="tab-notifications-simulator"
            onClick={() => setActiveSubTab('simulator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'simulator'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <span>Device Simulator</span>
          </button>
        </div>

        {/* Live Socket Status Indicator */}
        <div className="hidden md:flex items-center gap-2 pr-3 text-xs text-slate-500 font-medium shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Gateway Active</span>
        </div>
      </div>

      {/* Main Tab Content View */}
      {activeSubTab === 'dashboard' && (
        <NotificationsDashboard
          notifications={notifications}
          rules={rules}
          onNavigateToTab={(tab) => setActiveSubTab(tab)}
          onSelectNotificationForInspection={(item) => {
            setInspectedNotificationId(item.id);
            setActiveSubTab('history');
          }}
          onTriggerTestRule={handleTriggerTestRule}
        />
      )}

      {activeSubTab === 'send' && (
        <SendBroadcastHub
          outlets={outlets}
          franchises={franchises}
          onDispatchNotification={handleDispatchNotification}
          onNavigateToTab={(tab) => setActiveSubTab(tab)}
        />
      )}

      {activeSubTab === 'rules' && (
        <NotificationRulesManager
          rules={rules}
          onUpdateRules={onUpdateRules}
          onTriggerTestRule={handleTriggerTestRule}
        />
      )}

      {activeSubTab === 'history' && (
        <NotificationHistoryView
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onResendNotification={handleResendNotification}
          selectedNotificationId={inspectedNotificationId}
        />
      )}

      {activeSubTab === 'simulator' && (
        <NotificationSimulator
          notifications={notifications}
          onNavigateToTab={(tab) => setActiveSubTab(tab)}
        />
      )}

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 max-w-md">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
              {toastMessage.type === 'alert' ? (
                <Radio className="w-4 h-4 animate-pulse text-amber-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <h5 className="font-extrabold text-xs text-white leading-tight">{toastMessage.title}</h5>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toastMessage.desc}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
