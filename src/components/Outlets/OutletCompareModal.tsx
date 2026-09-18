import React, { useState } from 'react';
import { Outlet, AIComparisonResult } from '../../types';
import { X, Sparkles, Trophy, Building } from 'lucide-react';

interface OutletCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  allOutlets: Outlet[];
  defaultSelectedOutlet: Outlet | null;
}

export const OutletCompareModal: React.FC<OutletCompareModalProps> = ({
  isOpen,
  onClose,
  allOutlets,
  defaultSelectedOutlet,
}) => {
  const [outlet1Id, setOutlet1Id] = useState<string>(
    defaultSelectedOutlet ? defaultSelectedOutlet.id : allOutlets[0]?.id || ''
  );
  const [outlet2Id, setOutlet2Id] = useState<string>(
    allOutlets.find(o => o.id !== (defaultSelectedOutlet?.id || allOutlets[0]?.id))?.id || allOutlets[1]?.id || ''
  );

  const [aiInsights, setAiInsights] = useState<AIComparisonResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!isOpen) return null;

  const store1 = allOutlets.find(o => o.id === outlet1Id) || allOutlets[0];
  const store2 = allOutlets.find(o => o.id === outlet2Id) || allOutlets[1];

  const handleRunAiComparison = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/compare-outlets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outlets: [store1, store2] }),
      });
      const data = await res.json();
      setAiInsights(data);
    } catch (err) {
      console.error('Error comparing outlets:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-600" />
              <span>Franchise Location Comparative Analytics</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side performance benchmarking & AI best-practice synthesis
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Outlet Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block mb-1">Select First Outlet Location</label>
            <select
              value={outlet1Id}
              onChange={(e) => setOutlet1Id(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {allOutlets.map(o => (
                <option key={o.id} value={o.id} disabled={o.id === outlet2Id}>
                  {o.name} ({o.city}, {o.state}) - ₹{o.monthlyRevenue.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block mb-1">Select Second Outlet Location</label>
            <select
              value={outlet2Id}
              onChange={(e) => setOutlet2Id(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {allOutlets.map(o => (
                <option key={o.id} value={o.id} disabled={o.id === outlet1Id}>
                  {o.name} ({o.city}, {o.state}) - ₹{o.monthlyRevenue.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-6 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 w-1/3">Metric Parameter</th>
                <th className="p-3 w-1/3 text-center bg-emerald-50/50 text-emerald-900 border-x border-slate-200">
                  {store1.name}
                </th>
                <th className="p-3 w-1/3 text-center bg-indigo-50/50 text-indigo-900">
                  {store2.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr>
                <td className="p-3 font-semibold text-slate-800">Monthly Revenue</td>
                <td className={`p-3 text-center font-bold border-x border-slate-100 ${
                  store1.monthlyRevenue >= store2.monthlyRevenue ? 'text-emerald-700 bg-emerald-50/20' : 'text-slate-700'
                }`}>
                  ₹{store1.monthlyRevenue.toLocaleString('en-IN')}
                  <span className="block text-[10px] text-slate-500 font-normal">Target: ₹{store1.monthlyTarget.toLocaleString('en-IN')}</span>
                </td>
                <td className={`p-3 text-center font-bold ${
                  store2.monthlyRevenue >= store1.monthlyRevenue ? 'text-indigo-700 bg-indigo-50/20' : 'text-slate-700'
                }`}>
                  ₹{store2.monthlyRevenue.toLocaleString('en-IN')}
                  <span className="block text-[10px] text-slate-500 font-normal">Target: ₹{store2.monthlyTarget.toLocaleString('en-IN')}</span>
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-800">Revenue Growth Rate</td>
                <td className={`p-3 text-center border-x border-slate-100 font-bold ${
                  store1.revenueGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {store1.revenueGrowth > 0 ? `+${store1.revenueGrowth}%` : `${store1.revenueGrowth}%`}
                </td>
                <td className={`p-3 text-center font-bold ${
                  store2.revenueGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {store2.revenueGrowth > 0 ? `+${store2.revenueGrowth}%` : `${store2.revenueGrowth}%`}
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-800">AI Store Health Score</td>
                <td className="p-3 text-center border-x border-slate-100">
                  <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-xs ${
                    store1.healthScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {store1.healthScore} / 100 ({store1.healthGrade})
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-xs ${
                    store2.healthScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {store2.healthScore} / 100 ({store2.healthGrade})
                  </span>
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-800">Quality & Hygiene Audit Score</td>
                <td className="p-3 text-center border-x border-slate-100 font-bold text-slate-800">
                  {store1.auditScore}%
                </td>
                <td className="p-3 text-center font-bold text-slate-800">
                  {store2.auditScore}%
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-800">Average Fulfillment Speed</td>
                <td className="p-3 text-center border-x border-slate-100 font-bold text-slate-800">
                  {store1.fulfillmentTimeMin} mins
                </td>
                <td className="p-3 text-center font-bold text-slate-800">
                  {store2.fulfillmentTimeMin} mins
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-800">Customer CSAT Rating</td>
                <td className="p-3 text-center border-x border-slate-100 font-bold text-amber-600">
                  ⭐ {store1.customerRating} / 5.0
                </td>
                <td className="p-3 text-center font-bold text-amber-600">
                  ⭐ {store2.customerRating} / 5.0
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-800">Staff Count & On-Shift Ratio</td>
                <td className="p-3 text-center border-x border-slate-100 text-slate-700">
                  {store1.staffCount} staff ({store1.activeStaffOnShift} on shift)
                </td>
                <td className="p-3 text-center text-slate-700">
                  {store2.staffCount} staff ({store2.activeStaffOnShift} on shift)
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-800">Store Status Flag</td>
                <td className="p-3 text-center border-x border-slate-100">
                  {store1.isUnderperforming ? (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px]">
                      Underperforming
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                      Optimal Target
                    </span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {store2.isUnderperforming ? (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px]">
                      Underperforming
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                      Optimal Target
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action button to generate AI Comparison synthesis */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Compare operational efficiency, product mix, and store staff utilization.
          </p>

          <button
            onClick={handleRunAiComparison}
            disabled={isAiLoading}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAiLoading ? 'Synthesizing AI Benchmarks...' : 'Generate AI Comparison Report'}</span>
          </button>
        </div>

        {/* AI Comparison Synthesis Result Box */}
        {aiInsights && (
          <div className="mt-5 p-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl border border-indigo-900/50 space-y-3">
            <div className="flex items-center justify-between border-b border-indigo-800/60 pb-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Trophy className="w-4 h-4" />
                <span>AI Benchmark Winner: {aiInsights.winner}</span>
              </div>
              <span className="text-[10px] bg-indigo-900/80 text-indigo-200 px-2 py-0.5 rounded border border-indigo-700">
                AI Cross-Store Synthesis
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              <strong className="text-emerald-300">Key Differentiator:</strong> {aiInsights.keyDifferentiator}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <h4 className="text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1">
                  Comparative Insights
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {aiInsights.comparativeInsights.map((ci, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-teal-400 font-bold">•</span>
                      <span>{ci}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                  Cross-Store Recommendations
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {aiInsights.crossStoreBestPractices.map((bp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
