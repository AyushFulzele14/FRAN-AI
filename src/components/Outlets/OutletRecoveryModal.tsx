import React, { useState, useEffect } from 'react';
import { Outlet, AIRecoveryPlan } from '../../types';
import { X, AlertOctagon, Sparkles, Calendar, CheckCircle, TrendingUp, ShieldAlert } from 'lucide-react';

interface OutletRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  outlet: Outlet | null;
}

export const OutletRecoveryModal: React.FC<OutletRecoveryModalProps> = ({
  isOpen,
  onClose,
  outlet,
}) => {
  const [recoveryPlan, setRecoveryPlan] = useState<AIRecoveryPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && outlet) {
      fetchRecoveryPlan(outlet);
    }
  }, [isOpen, outlet]);

  const fetchRecoveryPlan = async (targetOutlet: Outlet) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/store-recovery-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outlet: targetOutlet }),
      });
      const data = await res.json();
      setRecoveryPlan(data);
    } catch (err) {
      console.error('Error fetching recovery plan:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !outlet) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Underperforming Store Recovery Plan
              </h3>
              <p className="text-xs text-slate-500">
                Location: <strong className="text-slate-800">{outlet.name}</strong> ({outlet.city}, {outlet.state})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Metrics Snapshot */}
        <div className="grid grid-cols-3 gap-3 my-4 p-3 bg-rose-50/50 border border-rose-100 rounded-xl text-center">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Revenue Gap</span>
            <p className="text-sm font-extrabold text-rose-700 mt-0.5">
              ${outlet.monthlyRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ ${outlet.monthlyTarget.toLocaleString()}</span>
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Health Score</span>
            <p className="text-sm font-extrabold text-rose-700 mt-0.5">
              {outlet.healthScore} / 100 ({outlet.healthGrade})
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Growth Rate</span>
            <p className="text-sm font-extrabold text-rose-700 mt-0.5">
              {outlet.revenueGrowth}%
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-700">Analyzing operational bottleneck & synthesizing turnaround strategy...</p>
          </div>
        ) : recoveryPlan ? (
          <div className="space-y-4">
            {/* Root Cause Diagnosis */}
            <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>AI Root Cause Diagnosis</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {recoveryPlan.rootCause}
              </p>
            </div>

            {/* Milestones Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Turnaround Execution Milestones</span>
              </h4>

              <div className="space-y-2">
                {recoveryPlan.milestones.map((ms, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md shrink-0">
                      {ms.week}
                    </span>
                    <p className="text-xs text-slate-700 font-medium">
                      {ms.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Impact */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Projected Financial Impact</span>
                <p className="text-xs font-bold text-emerald-950 mt-0.5">{recoveryPlan.expectedImpact}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => fetchRecoveryPlan(outlet)}
            disabled={loading}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Re-run AI Analysis</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
          >
            Acknowledge & Save Roadmap
          </button>
        </div>

      </div>
    </div>
  );
};
