import React, { useState } from 'react';
import {
  NotificationRule,
  NotificationPriority,
  NotificationChannel,
  NotificationRecipientGroup,
  NotificationItem,
} from '../../types';
import {
  SlidersHorizontal,
  Plus,
  Zap,
  Mail,
  MessageSquare,
  Smartphone,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  Filter,
  Search,
  RotateCcw,
  Volume2,
} from 'lucide-react';

interface NotificationRulesManagerProps {
  rules: NotificationRule[];
  onUpdateRules: (updatedRules: NotificationRule[]) => void;
  onTriggerTestRule: (ruleId: string) => void;
}

export const NotificationRulesManager: React.FC<NotificationRulesManagerProps> = ({
  rules,
  onUpdateRules,
  onTriggerTestRule,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Create rule modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDescription, setNewRuleDescription] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<NotificationRule['category']>('Emergency & IoT');
  const [newRuleMetric, setNewRuleMetric] = useState('Deep Fryer Oil Temp > 195°C');
  const [newRuleThreshold, setNewRuleThreshold] = useState('> 195 °C for > 10 mins');
  const [newRulePriority, setNewRulePriority] = useState<NotificationPriority>('P1 - Critical');
  const [newRuleChannels, setNewRuleChannels] = useState<{ email: boolean; sms: boolean; mobile: boolean }>({
    email: true,
    sms: true,
    mobile: true,
  });
  const [newRuleAudience, setNewRuleAudience] = useState<NotificationRecipientGroup>('All Store Managers');
  const [newRuleAutoEscalate, setNewRuleAutoEscalate] = useState(true);
  const [newRuleEscalateMins, setNewRuleEscalateMins] = useState(15);

  // Toggle rule enable/disable
  const handleToggleRule = (ruleId: string) => {
    const updated = rules.map((r) => {
      if (r.id === ruleId) {
        return { ...r, isEnabled: !r.isEnabled };
      }
      return r;
    });
    onUpdateRules(updated);
  };

  // Create new rule
  const handleSaveNewRule = () => {
    if (!newRuleName.trim()) {
      alert('Please provide a rule name.');
      return;
    }

    const selectedChannelsList: NotificationChannel[] = [];
    if (newRuleChannels.email) selectedChannelsList.push('email');
    if (newRuleChannels.sms) selectedChannelsList.push('sms');
    if (newRuleChannels.mobile) selectedChannelsList.push('mobile');

    if (selectedChannelsList.length === 0) {
      alert('Please select at least one notification channel.');
      return;
    }

    const createdRule: NotificationRule = {
      id: `notif-rule-${Date.now()}`,
      name: newRuleName,
      description: newRuleDescription || `Automated trigger rule for ${newRuleMetric}`,
      category: newRuleCategory,
      triggerCondition: newRuleMetric,
      threshold: newRuleThreshold,
      priority: newRulePriority,
      channels: selectedChannelsList,
      targetAudience: newRuleAudience,
      autoEscalate: newRuleAutoEscalate,
      escalationAfterMinutes: newRuleEscalateMins,
      isEnabled: true,
      lastTriggered: 'Never',
      triggerCount: 0,
    };

    onUpdateRules([createdRule, ...rules]);
    setIsCreateModalOpen(false);

    // Reset form
    setNewRuleName('');
    setNewRuleDescription('');
  };

  // Filter rules
  const filteredRules = rules.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.triggerCondition.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || r.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header with Search & Create Action */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-800">
                Rule Automation Engine
              </span>
              <span className="text-xs text-slate-400">Continuous 24/7 Threshold Monitor</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Notification Rules & Escalation Policies
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Define automated triggers across POS revenue telemetry, IoT chiller sensors, food hygiene audits, and shift rosters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="create-new-rule-btn"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Notification Rule</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search automated rules by keyword or metric..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Emergency & IoT">Emergency & IoT</option>
              <option value="Inventory & Supply">Inventory & Supply</option>
              <option value="Food Safety & QA">Food Safety & QA</option>
              <option value="Revenue & Sales">Revenue & Sales</option>
              <option value="Staffing & Shifts">Staffing & Shifts</option>
              <option value="Customer & Operations">Customer & Operations</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="P1 - Critical">P1 - Critical</option>
              <option value="P2 - High">P2 - High</option>
              <option value="P3 - Medium">P3 - Medium</option>
              <option value="P4 - Low">P4 - Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rules List Cards */}
      <div className="space-y-3">
        {filteredRules.map((rule) => {
          const isCritical = rule.priority === 'P1 - Critical';
          const isHigh = rule.priority === 'P2 - High';

          return (
            <div
              key={rule.id}
              className={`p-5 rounded-3xl border transition-all ${
                !rule.isEnabled
                  ? 'bg-slate-50/60 border-slate-200 opacity-60'
                  : isCritical
                  ? 'bg-white border-rose-200 shadow-2xs hover:border-rose-300'
                  : isHigh
                  ? 'bg-white border-amber-200 shadow-2xs hover:border-amber-300'
                  : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left info */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800'
                          : rule.priority === 'P3 - Medium'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {rule.priority}
                    </span>

                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {rule.category}
                    </span>

                    {rule.autoEscalate && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Auto-Escalates ({rule.escalationAfterMinutes || 15}m)
                      </span>
                    )}

                    <span className="text-xs text-slate-400 font-medium">
                      Triggered {rule.triggerCount} times (Last: {rule.lastTriggered || 'Never'})
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">{rule.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{rule.description}</p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <span className="font-semibold text-slate-700">
                      Trigger Condition: <strong className="text-slate-900 font-mono">{rule.triggerCondition}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-slate-700">
                      Audience: <strong className="text-slate-900">{rule.targetAudience}</strong>
                    </span>
                  </div>
                </div>

                {/* Right controls: Channels, Test Button & Enable Switch */}
                <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                  {/* Channels active */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 p-1.5 rounded-xl">
                    {rule.channels.includes('email') && (
                      <span className="p-1 rounded-lg bg-blue-100 text-blue-800" title="Email Dispatch Enabled">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {rule.channels.includes('sms') && (
                      <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800" title="SMS Alert Enabled">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {rule.channels.includes('mobile') && (
                      <span className="p-1 rounded-lg bg-purple-100 text-purple-800" title="Mobile Push Enabled">
                        <Smartphone className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Test Rule Button */}
                  <button
                    type="button"
                    onClick={() => onTriggerTestRule(rule.id)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Simulate rule trigger right now"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Test Rule</span>
                  </button>

                  {/* Enable / Disable Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleRule(rule.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      rule.isEnabled
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${rule.isEnabled ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                    <span>{rule.isEnabled ? 'Active' : 'Disabled'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Rule Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Define New Automated Notification Rule</h3>
                <p className="text-xs text-slate-500">Configure trigger conditions, priority, and multi-channel dispatch policy</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Rule Name</label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. Deep Fryer Thermal Degradation or Drive-thru Queue Spillover"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newRuleCategory}
                    onChange={(e) => setNewRuleCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Emergency & IoT">Emergency & IoT</option>
                    <option value="Food Safety & QA">Food Safety & QA</option>
                    <option value="Inventory & Supply">Inventory & Supply</option>
                    <option value="Revenue & Sales">Revenue & Sales</option>
                    <option value="Staffing & Shifts">Staffing & Shifts</option>
                    <option value="Customer & Operations">Customer & Operations</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority Classification</label>
                  <select
                    value={newRulePriority}
                    onChange={(e) => setNewRulePriority(e.target.value as NotificationPriority)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="P1 - Critical">P1 - Critical (Siren sound & immediate SMS failover)</option>
                    <option value="P2 - High">P2 - High (High-priority alert banner)</option>
                    <option value="P3 - Medium">P3 - Medium (Operational log entry)</option>
                    <option value="P4 - Low">P4 - Low (Informational / Digest)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Trigger Metric & Sensor</label>
                  <input
                    type="text"
                    value={newRuleMetric}
                    onChange={(e) => setNewRuleMetric(e.target.value)}
                    placeholder="e.g. POS Order KTT > 8.0 mins"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Threshold Value</label>
                  <input
                    type="text"
                    value={newRuleThreshold}
                    onChange={(e) => setNewRuleThreshold(e.target.value)}
                    placeholder="e.g. > 8 mins for 3 consecutive orders"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Channels checkboxes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Dispatch Channels</label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRuleChannels.email}
                      onChange={(e) => setNewRuleChannels({ ...newRuleChannels, email: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">Email</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRuleChannels.sms}
                      onChange={(e) => setNewRuleChannels({ ...newRuleChannels, sms: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">SMS Alert</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRuleChannels.mobile}
                      onChange={(e) => setNewRuleChannels({ ...newRuleChannels, mobile: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">Mobile Push</span>
                  </label>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                <select
                  value={newRuleAudience}
                  onChange={(e) => setNewRuleAudience(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="All Store Managers">All Store Managers (100% Outlets)</option>
                  <option value="Franchise Owners">Franchise Owners & Board Members</option>
                  <option value="Regional Operations Leads">Regional Operations Leads & Coaches</option>
                  <option value="Kitchen & Shift Leads">Kitchen & Shift Leads</option>
                  <option value="Emergency Response Team">Emergency Response Team & Facilities</option>
                </select>
              </div>

              {/* Escalation Policy */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center justify-between">
                <div>
                  <label className="font-bold text-indigo-900 block">Auto-Escalation Protocol</label>
                  <p className="text-[11px] text-indigo-700">If unacknowledged, escalate to Regional VP via direct SMS</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={newRuleEscalateMins}
                    onChange={(e) => setNewRuleEscalateMins(Number(e.target.value))}
                    className="w-16 bg-white border border-indigo-300 rounded-lg px-2 py-1 text-center font-bold text-indigo-900"
                  />
                  <span className="text-xs font-bold text-indigo-800">mins</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewRule}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save & Deploy Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
