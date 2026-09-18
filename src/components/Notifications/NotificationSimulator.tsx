import React, { useState } from 'react';
import {
  NotificationItem,
  NotificationPriority,
} from '../../types';
import {
  Smartphone,
  Mail,
  MessageSquare,
  Bell,
  Volume2,
  CheckCircle2,
  Radio,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface NotificationSimulatorProps {
  notifications: NotificationItem[];
  onNavigateToTab?: (tab: 'dashboard' | 'send' | 'rules' | 'history' | 'simulator') => void;
}

export const NotificationSimulator: React.FC<NotificationSimulatorProps> = ({
  notifications,
  onNavigateToTab,
}) => {
  const [selectedNotificationId, setSelectedNotificationId] = useState<string>(
    notifications[0]?.id || ''
  );
  const [activeDeviceView, setActiveDeviceView] = useState<'mobile' | 'sms' | 'email'>('mobile');
  const [isAlertRinging, setIsAlertRinging] = useState(false);
  const [notificationAcknowledged, setNotificationAcknowledged] = useState(false);

  const activeNotification =
    notifications.find((n) => n.id === selectedNotificationId) || notifications[0];

  const handleSimulateRing = () => {
    setIsAlertRinging(true);
    setNotificationAcknowledged(false);
    setTimeout(() => {
      setIsAlertRinging(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                End-User Device Test Bench
              </span>
              <span className="text-xs text-slate-400">Interactive Simulation Environment</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Mobile, SMS & Email Live Simulator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Experience notifications from the viewpoint of Store Managers, Kitchen Leads, and Regional Executives.
            </p>
          </div>

          {/* Alert Trigger Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSimulateRing}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer animate-pulse"
            >
              <Volume2 className="w-4 h-4" />
              <span>Simulate Incoming Alarm</span>
            </button>
          </div>
        </div>

        {/* Notification Selector Row */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Simulate Alert:</span>
            <select
              value={selectedNotificationId}
              onChange={(e) => {
                setSelectedNotificationId(e.target.value);
                setNotificationAcknowledged(false);
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-md truncate"
            >
              {notifications.map((n) => (
                <option key={n.id} value={n.id}>
                  [{n.priority.split(' - ')[0]}] {n.title} ({n.outletName || 'Network'})
                </option>
              ))}
            </select>
          </div>

          {/* Device Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveDeviceView('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeDeviceView === 'mobile'
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone</span>
            </button>
            <button
              onClick={() => setActiveDeviceView('sms')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeDeviceView === 'sms'
                  ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>SMS App</span>
            </button>
            <button
              onClick={() => setActiveDeviceView('email')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeDeviceView === 'email'
                  ? 'bg-white text-blue-700 font-bold shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Webmail Client</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Frame Stage */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-center min-h-[500px]">
        {/* Ringing Sound Indicator */}
        {isAlertRinging && (
          <div className="mb-6 px-4 py-2 bg-rose-500/20 border border-rose-500/40 rounded-full text-xs font-extrabold text-rose-300 flex items-center gap-2 animate-bounce">
            <Radio className="w-4 h-4 animate-ping text-rose-400" />
            <span>Sound Profile Triggered: {activeNotification?.mobileDetails?.sound || 'Urgent Siren (110dB)'}</span>
          </div>
        )}

        {/* View 1: Smartphone Lock Screen & Banner */}
        {activeDeviceView === 'mobile' && (
          <div className="w-full max-w-[340px] bg-slate-950 border-4 border-slate-700 rounded-[44px] p-4 shadow-2xl relative overflow-hidden">
            {/* Phone Top Notch */}
            <div className="w-28 h-4 bg-slate-900 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
            </div>

            {/* Lockscreen Time */}
            <div className="text-center mb-6">
              <p className="text-xs text-slate-400 font-medium">Sunday, September 6</p>
              <h3 className="text-3xl font-black text-white tracking-tight">09:41</h3>
            </div>

            {/* Simulated Push Notification Banner */}
            <div
              className={`rounded-2xl p-3.5 border transition-all ${
                activeNotification.priority === 'P1 - Critical'
                  ? 'bg-rose-950/80 border-rose-600/60 shadow-lg shadow-rose-950/50'
                  : activeNotification.priority === 'P2 - High'
                  ? 'bg-amber-950/80 border-amber-600/60'
                  : 'bg-slate-800/90 border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                    F
                  </div>
                  <span className="text-xs font-bold text-white">FranAI Command</span>
                  <span className="text-[10px] text-slate-400">• now</span>
                </div>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-white/10 text-white">
                  {activeNotification.priority.split(' - ')[0]}
                </span>
              </div>

              <h4 className="font-bold text-xs text-white leading-tight">
                {activeNotification.mobileDetails?.pushTitle || activeNotification.title}
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {activeNotification.mobileDetails?.pushBody || activeNotification.message}
              </p>

              {/* Action Buttons */}
              <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center gap-2">
                <button
                  onClick={() => setNotificationAcknowledged(true)}
                  className={`flex-1 py-1.5 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                    notificationAcknowledged
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {notificationAcknowledged ? '✓ Acknowledged' : 'Acknowledge'}
                </button>
                <button
                  onClick={() => alert(`Navigating store team to deep-link: ${activeNotification.mobileDetails?.deepLinkUrl || '/outlets'}`)}
                  className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-center text-xs font-bold text-slate-200 transition-all cursor-pointer"
                >
                  View Outlet
                </button>
              </div>
            </div>

            {/* Bottom Torch & Camera */}
            <div className="mt-12 flex items-center justify-between px-4 pb-2">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 text-xs">
                🔦
              </div>
              <div className="w-20 h-1 bg-slate-600 rounded-full"></div>
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 text-xs">
                📷
              </div>
            </div>
          </div>
        )}

        {/* View 2: SMS Inbox Thread Mockup */}
        {activeDeviceView === 'sms' && (
          <div className="w-full max-w-[360px] bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                  SMS
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">
                    {activeNotification.smsDetails?.senderId || 'VK-FRANAI'}
                  </h4>
                  <p className="text-[10px] text-slate-400">Carrier: Bharti Airtel DLT Verified</p>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                Fast-Track Route
              </span>
            </div>

            {/* Conversation Thread */}
            <div className="space-y-3 py-2">
              <div className="text-center text-[10px] text-slate-500">Today 09:41 AM</div>
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl rounded-tl-xs p-3.5 text-xs text-slate-100 font-mono leading-relaxed space-y-2">
                <p>
                  {activeNotification.smsDetails?.text || activeNotification.message}
                </p>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-700/60 flex items-center justify-between">
                  <span>Telco Status: <strong>DELIVRD_ACK_200</strong></span>
                  <span>100% Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Quick SMS Reply Box */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                disabled
                placeholder="Reply 'ACK' to clear alert..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400"
              />
              <button
                onClick={() => alert("Acknowledged by SMS reply!")}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* View 3: Webmail Client Mockup */}
        {activeDeviceView === 'email' && (
          <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            {/* Email Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-white">
                  {activeNotification.emailDetails?.subject || activeNotification.title}
                </h4>
                <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                  <span>From: <strong>FranAI Central Dispatch &lt;ops@franai-network.com&gt;</strong></span>
                  <span>•</span>
                  <span>To: <strong>{activeNotification.recipientSummary}</strong></span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400">09:41 AM (0 mins ago)</span>
            </div>

            {/* Email Content Body */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs leading-relaxed">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    FA
                  </div>
                  <span className="font-bold text-white">FranAI Franchise Automation Network</span>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    activeNotification.priority === 'P1 - Critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-indigo-500/20 text-indigo-300'
                  }`}
                >
                  {activeNotification.priority}
                </span>
              </div>

              <p className="text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                {activeNotification.emailDetails?.bodyHtml?.replace(/<br\/>/g, '\n') || activeNotification.message}
              </p>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 text-[11px] text-slate-400">
                <div><strong>Outlet:</strong> {activeNotification.outletName || 'All Network Outlets'}</div>
                <div><strong>Delivery Gateway:</strong> Amazon SES SMTP with SPF, DKIM, and DMARC 100% Pass</div>
                <div><strong>Security Classification:</strong> Confidential Operational Dispatch</div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => alert("Simulated email acknowledgment registered.")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Confirm Receipt & Acknowledge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
