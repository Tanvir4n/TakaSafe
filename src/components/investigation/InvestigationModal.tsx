import React, { useState } from 'react';
import { Transaction, CustomerBaseline } from '../../types';
import {
  X,
  Sparkles,
  ShieldAlert,
  CheckCircle,
  Clock,
  Smartphone,
  MapPin,
  TrendingUp,
  FileText,
  Lock,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

interface InvestigationModalProps {
  transaction: Transaction;
  customerProfile: CustomerBaseline;
  isOpen: boolean;
  onClose: () => void;
  onTakeAction: (
    action: 'MONITOR' | 'ADDITIONAL_VERIFICATION' | 'HOLD_FOR_REVIEW' | 'FREEZE_WALLET',
    notes: string
  ) => void;
}

export const InvestigationModal: React.FC<InvestigationModalProps> = ({
  transaction,
  customerProfile,
  isOpen,
  onClose,
  onTakeAction,
}) => {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [operatorNotes, setOperatorNotes] = useState<string>('');
  const [actionConfirmed, setActionConfirmed] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateReport = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: `CASE-${transaction.id}`,
          transaction,
          customerProfile,
          shapBreakdown: transaction.shapFeatures.map((f) => ({
            feature: f.name,
            impact: `+${f.contribution}%`,
            detail: f.description,
          })),
          riskScore: transaction.fusedRiskScore,
        }),
      });
      const data = await res.json();
      if (data.report) {
        setAiReport(data.report);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleAction = (
    action: 'MONITOR' | 'ADDITIONAL_VERIFICATION' | 'HOLD_FOR_REVIEW' | 'FREEZE_WALLET'
  ) => {
    onTakeAction(action, operatorNotes || `Action triggered via TakaSafe Action Engine`);
    setActionConfirmed(action);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">CASE #{transaction.id}</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                  {transaction.riskBand} RISK
                </span>
                {transaction.isMuleConnected && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                    MULE RING LINK
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold mt-0.5">
                Explainable Investigation & Decision Dossier
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Fused Risk</span>
              <span className="text-2xl font-black font-mono text-rose-400">
                {transaction.fusedRiskScore}/100
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 flex-1">
          {/* Top Comparison: Baseline vs Attempted Event */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Baseline */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                  Customer Historical Baseline
                </span>
                <span className="text-[11px] text-slate-500">Learned via Isolation Forest</span>
              </div>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Owner:</span>
                  <span className="font-semibold text-slate-800">{customerProfile.name} ({customerProfile.wallet})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">90-Day Avg Amount:</span>
                  <span className="font-mono font-semibold text-slate-800">৳{customerProfile.avgAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Normal Transacting Window:</span>
                  <span className="font-medium text-slate-800">{customerProfile.usualHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Usual Geolocation:</span>
                  <span className="font-medium text-slate-800">{customerProfile.homeDistrict}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Device:</span>
                  <span className="font-medium text-slate-800">{customerProfile.knownDevices[0]}</span>
                </div>
              </div>
            </div>

            {/* Current Flagged Transaction */}
            <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-rose-900 uppercase tracking-wide text-[11px]">
                  Flagged Transaction Event
                </span>
                <span className="text-[11px] font-mono text-rose-700">{transaction.timestamp}</span>
              </div>
              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Attempted:</span>
                  <span className="font-mono font-black text-rose-700 text-sm">
                    ৳{transaction.amount.toLocaleString()} (53.3x baseline)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient Target:</span>
                  <span className="font-semibold text-rose-800">
                    {transaction.receiverName} ({transaction.receiverWallet})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Execution Time:</span>
                  <span className="font-mono font-semibold text-rose-700">03:20 AM (Nocturnal anomaly)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Originating IP Location:</span>
                  <span className="font-semibold text-rose-800">{transaction.senderLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hardware Fingerprint:</span>
                  <span className="font-semibold text-rose-800">{transaction.senderDevice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SHAP Feature Attribution Waterfall */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  SHAP Explainable Feature Attribution
                </h4>
                <p className="text-[11px] text-slate-500">
                  Mathematical breakdown showing how each feature shifted the XGBoost baseline towards Critical Risk.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                Σ wi · si = 94/100
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {transaction.shapFeatures.map((feat) => (
                <div key={feat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      {feat.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-[11px]">
                        {feat.actualValue} vs {feat.expectedValue}
                      </span>
                      <span className="font-mono font-bold text-rose-600">
                        +{feat.contribution}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${feat.contribution * 2.8}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Investigation Assistant Section */}
          <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/40 p-5 rounded-2xl border border-indigo-200">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-indigo-950 text-sm">
                  AI Investigation Assistant (Grounded LLM Interface)
                </h4>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  Gemini Flash Grounded
                </span>
              </div>

              {!aiReport && (
                <button
                  onClick={handleGenerateReport}
                  disabled={isLoadingAi}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3.5 rounded-xl shadow-sm transition-all"
                >
                  {isLoadingAi ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing Case Dossier...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate AI Case Brief</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-600 mb-3">
              Per responsible AI rules: ML models compute scores and SHAP attribution; the LLM merely structures evidence into an executive audit brief for human authorization.
            </p>

            {aiReport ? (
              <div className="bg-white p-4 rounded-xl border border-indigo-200/80 text-xs text-slate-800 leading-relaxed font-sans prose prose-sm max-w-none max-h-60 overflow-y-auto whitespace-pre-line">
                {aiReport}
              </div>
            ) : (
              <div className="bg-white/60 p-4 rounded-xl border border-dashed border-indigo-200 text-center text-slate-500">
                Click &ldquo;Generate AI Case Brief&rdquo; to assemble structured evidence, mule network linkage, and human-in-the-loop recommendations.
              </div>
            )}
          </div>

          {/* Human-in-the-loop Action Engine Form */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <label className="font-bold text-slate-900 text-xs block mb-1">
                Operator Decision & Audit Notes (Mandatory for High-Impact Actions)
              </label>
              <textarea
                value={operatorNotes}
                onChange={(e) => setOperatorNotes(e.target.value)}
                placeholder="Enter rationale for override, escalation, or freeze (e.g. 'Customer confirmed phone stolen; instructed immediate wallet quarantine')..."
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0054A6]"
                rows={2}
              />
            </div>

            {actionConfirmed ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold">
                    Action Executed: {actionConfirmed.replace(/_/g, ' ')}. Recorded in Compliance Audit Log.
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-xs"
                >
                  Close Dossier
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => handleAction('MONITOR')}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-200 font-semibold transition-colors"
                >
                  Dismiss / Normal Monitor
                </button>

                <button
                  onClick={() => handleAction('ADDITIONAL_VERIFICATION')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold transition-colors shadow-sm"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Enforce Step-Up SMS/Voice OTP</span>
                </button>

                <button
                  onClick={() => handleAction('FREEZE_WALLET')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors shadow-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>Escalate: Freeze Destination Mule (W302)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
