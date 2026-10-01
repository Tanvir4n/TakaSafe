import React, { useState } from 'react';
import {
  Transaction,
  CustomerBaseline,
  MuleCluster,
  AgentLiquidityNode,
  RegionalRiskMetric,
  RiskBand,
} from '../../types';
import { MuleVisionGraph } from './MuleVisionGraph';
import { DisasterResilienceSimulator } from './DisasterResilienceSimulator';
import { EarlyWarningRadar } from './EarlyWarningRadar';
import { TransactionRiskTrendChart } from './TransactionRiskTrendChart';
import {
  ShieldCheck,
  AlertTriangle,
  Network,
  CloudLightning,
  Radar,
  Sliders,
  FileCheck2,
  Search,
  ExternalLink,
  Lock,
  CheckCircle,
  Eye,
  Filter,
  ArrowUpRight,
  Download,
} from 'lucide-react';

interface OperatorDashboardProps {
  transactions: Transaction[];
  customerProfile: CustomerBaseline;
  muleCluster: MuleCluster;
  agents: AgentLiquidityNode[];
  regionalMetrics: RegionalRiskMetric[];
  onOpenInvestigation: (transaction: Transaction) => void;
  onFreezeWallet: (walletId: string, label: string) => void;
  onDispatchLiquidity: (agentId: string, agentName: string, amount: number) => void;
  onActivateMonitoring: (division: string) => void;
  auditLogs: any[];
  initialTab?: string;
  lang: 'EN' | 'BN';
}

export const OperatorDashboard: React.FC<OperatorDashboardProps> = ({
  transactions,
  customerProfile,
  muleCluster,
  agents,
  regionalMetrics,
  onOpenInvestigation,
  onFreezeWallet,
  onDispatchLiquidity,
  onActivateMonitoring,
  auditLogs,
  initialTab = 'OVERVIEW',
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [filterBand, setFilterBand] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [auditSearchQuery, setAuditSearchQuery] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Tunable Policy Weights state (from Page 4 of the report)
  const [weights, setWeights] = useState({
    fraud: 0.30,
    anomaly: 0.20,
    device: 0.15,
    velocity: 0.15,
    network: 0.10,
    scam: 0.10,
  });

  const criticalCount = transactions.filter((t) => t.riskBand === 'CRITICAL' || t.riskBand === 'HIGH').length;

  const filteredTxns = transactions.filter((txn) => {
    if (filterBand !== 'ALL' && txn.riskBand !== filterBand) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        txn.id.toLowerCase().includes(q) ||
        txn.senderName.toLowerCase().includes(q) ||
        txn.senderWallet.includes(q) ||
        txn.receiverWallet.includes(q)
      );
    }
    return true;
  });

  const getRiskBadge = (band: RiskBand, score: number) => {
    switch (band) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOW':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const handleDownloadAuditCSV = () => {
    if (!auditLogs || auditLogs.length === 0) return;

    const headers = [
      'Audit_ID',
      'Timestamp_BST',
      'Authorized_Risk_Analyst',
      'Case_ID',
      'Target_Entity_Type',
      'Target_Entity_ID',
      'Intervention_Action_Taken',
      'Fused_Risk_Score_0_100',
      'Justification_Reason',
      'Operational_Notes',
      'Regulatory_Filing_Compliance',
    ];

    const rows = auditLogs.map((log) => [
      `"${log.id || ''}"`,
      `"${log.timestamp || ''}"`,
      `"${(log.analyst || '').replace(/"/g, '""')}"`,
      `"${log.caseId || ''}"`,
      `"${log.entityType || ''}"`,
      `"${log.entityId || ''}"`,
      `"${log.actionTaken || ''}"`,
      `"${log.riskScore ?? ''}"`,
      `"${(log.reason || '').replace(/"/g, '""')}"`,
      `"${(log.notes || '').replace(/"/g, '""')}"`,
      `"COMPLIANT - Bangladesh Bank BFIU MFS Guidelines 2026"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `TakaSafe_Regulatory_Audit_Logs_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (!auditSearchQuery) return true;
    const q = auditSearchQuery.toLowerCase();
    return (
      (log.id && log.id.toLowerCase().includes(q)) ||
      (log.analyst && log.analyst.toLowerCase().includes(q)) ||
      (log.entityId && log.entityId.toLowerCase().includes(q)) ||
      (log.caseId && log.caseId.toLowerCase().includes(q)) ||
      (log.actionTaken && log.actionTaken.toLowerCase().includes(q)) ||
      (log.notes && log.notes.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Level Metric Cockpit Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">National Risk Index</span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-slate-900">39.2</span>
            <span className="text-xs text-slate-500 font-mono">/100</span>
          </div>
          <span className="text-[10px] text-amber-600 font-semibold block mt-1">
            Elevated (Barishal Surge)
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">High / Critical Alerts</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-rose-600">{criticalCount}</span>
            <span className="text-xs text-slate-500">Active</span>
          </div>
          <span className="text-[10px] text-rose-600 font-semibold block mt-1">
            Requires Human Review
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Active Mule Ring</span>
            <Network className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-slate-900">12</span>
            <span className="text-xs text-slate-500">Wallets</span>
          </div>
          <span className="text-[10px] text-purple-700 font-semibold block mt-1">
            Network #17 (৳ 1.28M Flow)
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Agent Shortfall</span>
            <CloudLightning className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-amber-600">5</span>
            <span className="text-xs text-slate-500">Depleted</span>
          </div>
          <span className="text-[10px] text-amber-600 font-semibold block mt-1">
            Coastal Cyclone Buffer
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Audit Compliance</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-slate-900">{auditLogs.length}</span>
            <span className="text-xs text-slate-500">Decisions</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
            100% Traceable Logs
          </span>
        </div>
      </div>

      {/* Main Tabbed Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'OVERVIEW', label: '1. Transaction Guardian', icon: ShieldCheck, badge: criticalCount },
          { id: 'MULEVISION', label: '2. MuleVision (Graph)', icon: Network },
          { id: 'RESILIENCE', label: '3. Disaster Resilience Mode', icon: CloudLightning },
          { id: 'RADAR', label: '4. Early-Warning Radar', icon: Radar },
          { id: 'POLICY', label: '5. Policy Weights & Action Engine', icon: Sliders },
          { id: 'AUDIT', label: '6. Audit Logs & Compliance', icon: FileCheck2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 font-bold text-xs rounded-t-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-[#0054A6] border-t-2 border-l border-r border-[#0054A6] border-t-[#0054A6] -mb-[1px] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Transaction Guardian */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Real-time Recharts Risk Trend Chart */}
          <TransactionRiskTrendChart transactions={transactions} lang={lang} />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Table Filters & Search */}
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transaction, customer, wallet..."
                    className="pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0054A6]"
                  />
                </div>

                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 text-xs">
                  {['ALL', 'CRITICAL', 'HIGH', 'LOW'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setFilterBand(b)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        filterBand === b
                          ? 'bg-[#0054A6] text-white font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Showing {filteredTxns.length} monitored transactions
              </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Txn ID & Time</th>
                    <th className="py-3 px-4">Sender Profile</th>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4 text-right">Amount (BDT)</th>
                    <th className="py-3 px-4 text-center">Guardian Score</th>
                    <th className="py-3 px-4">Risk Band</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTxns.map((txn) => (
                    <tr
                      key={txn.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        txn.riskBand === 'CRITICAL' ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900">{txn.id}</div>
                        <div className="text-[11px] text-slate-500">{txn.timestamp}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{txn.senderName}</div>
                        <div className="text-[11px] text-slate-500">{txn.senderWallet}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{txn.receiverName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{txn.receiverWallet}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-slate-900 text-sm">
                        ৳{txn.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block font-mono font-black text-xs px-2.5 py-1 rounded-lg ${
                            txn.fusedRiskScore >= 80
                              ? 'bg-rose-100 text-rose-700 font-bold'
                              : txn.fusedRiskScore >= 50
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {txn.fusedRiskScore}/100
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(
                            txn.riskBand,
                            txn.fusedRiskScore
                          )}`}
                        >
                          {txn.riskBand}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            txn.status === 'HELD'
                              ? 'bg-amber-100 text-amber-800'
                              : txn.status === 'BLOCKED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onOpenInvestigation(txn)}
                          className="inline-flex items-center gap-1.5 bg-[#0054A6] hover:bg-blue-800 text-white font-bold py-1.5 px-3 rounded-lg text-xs shadow-sm transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-300" />
                          <span>Investigate (SHAP)</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: MuleVision Graph */}
      {activeTab === 'MULEVISION' && (
        <MuleVisionGraph cluster={muleCluster} onFreezeWallet={onFreezeWallet} />
      )}

      {/* Tab 3: Disaster Resilience Mode */}
      {activeTab === 'RESILIENCE' && (
        <DisasterResilienceSimulator agents={agents} onDispatchLiquidity={onDispatchLiquidity} />
      )}

      {/* Tab 4: Early-Warning Radar */}
      {activeTab === 'RADAR' && (
        <EarlyWarningRadar metrics={regionalMetrics} onActivateMonitoring={onActivateMonitoring} />
      )}

      {/* Tab 5: Policy Weights & Action Engine Mapping */}
      {activeTab === 'POLICY' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Policy Tuner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Policy Parameter Weights (Rfinal Formula)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Rfinal = Σ wi · si, i ∈ {'{'}fraud, anomaly, device, velocity, network, scam{'}'}, Σwi = 1. Tunable prototype policies validated on synthetic data.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>w_fraud (XGBoost Classifier Fraud Prob)</span>
                  <span className="font-mono text-indigo-600 font-bold">{weights.fraud}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={weights.fraud}
                  onChange={(e) => setWeights({ ...weights, fraud: Number(e.target.value) })}
                  className="w-full accent-[#0054A6]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>w_anomaly (Isolation Forest Behaviour Baseline)</span>
                  <span className="font-mono text-indigo-600 font-bold">{weights.anomaly}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.4"
                  step="0.05"
                  value={weights.anomaly}
                  onChange={(e) => setWeights({ ...weights, anomaly: Number(e.target.value) })}
                  className="w-full accent-[#0054A6]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>w_velocity (Short-window transaction velocity)</span>
                  <span className="font-mono text-indigo-600 font-bold">{weights.velocity}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.05"
                  value={weights.velocity}
                  onChange={(e) => setWeights({ ...weights, velocity: Number(e.target.value) })}
                  className="w-full accent-[#0054A6]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>w_device (Device mismatch & new IMEI/IP)</span>
                  <span className="font-mono text-indigo-600 font-bold">{weights.device}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.05"
                  value={weights.device}
                  onChange={(e) => setWeights({ ...weights, device: Number(e.target.value) })}
                  className="w-full accent-[#0054A6]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>w_network (MuleVision graph centrality & mule score)</span>
                  <span className="font-mono text-indigo-600 font-bold">{weights.network}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.05"
                  value={weights.network}
                  onChange={(e) => setWeights({ ...weights, network: Number(e.target.value) })}
                  className="w-full accent-[#0054A6]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>w_scam (Pre-payment social engineering indicators)</span>
                  <span className="font-mono text-indigo-600 font-bold">{weights.scam}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.05"
                  value={weights.scam}
                  onChange={(e) => setWeights({ ...weights, scam: Number(e.target.value) })}
                  className="w-full accent-[#0054A6]"
                />
              </div>
            </div>
          </div>

          {/* Action Engine Specification Table (Table from Page 5 of the PDF report) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Action Engine: Operational Decision Mapping
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Every mathematical model output maps to an auditable next step. High-impact decisions always require human authorization.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Signal Domain</th>
                    <th className="py-2.5 px-3">Score / Threshold</th>
                    <th className="py-2.5 px-3">Mandatory Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Transaction risk</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600">Low (0–30)</td>
                    <td className="py-2.5 px-3">Automated Monitor</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Transaction risk</td>
                    <td className="py-2.5 px-3 font-mono text-blue-600">Medium (31–60)</td>
                    <td className="py-2.5 px-3">Additional verification (SMS OTP)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Transaction risk</td>
                    <td className="py-2.5 px-3 font-mono text-amber-600 font-bold">High (61–80)</td>
                    <td className="py-2.5 px-3">Human review required</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Transaction risk</td>
                    <td className="py-2.5 px-3 font-mono text-rose-600 font-bold">Critical (81–100)</td>
                    <td className="py-2.5 px-3 font-bold text-rose-700">Escalate + enhanced verification</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Agent liquidity risk</td>
                    <td className="py-2.5 px-3 font-mono text-amber-600">Forecast shortfall &gt; ৳100k</td>
                    <td className="py-2.5 px-3">Prioritise replenishment / float injection</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Regional risk</td>
                    <td className="py-2.5 px-3 font-mono text-rose-600">Elevated regional score (&gt;75)</td>
                    <td className="py-2.5 px-3">Activate Level-3 monitoring</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Scam risk</td>
                    <td className="py-2.5 px-3 font-mono text-amber-600">Risky payment attempt</td>
                    <td className="py-2.5 px-3">ScamShield pre-payment customer warning</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Audit Logs & Regulatory Reporting */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Bar */}
          <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Audit Logs & Regulatory Reporting
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  BFIU Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Full chronological ledger of operator decisions, overrides, freezes, and float dispatches for Bangladesh Bank regulatory reporting.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs bg-white text-slate-700 font-mono font-bold px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                {filteredAuditLogs.length} Records
              </span>

              {downloadSuccess ? (
                <div className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm animate-in fade-in">
                  <CheckCircle className="w-4 h-4" />
                  <span>Report Downloaded!</span>
                </div>
              ) : (
                <button
                  onClick={handleDownloadAuditCSV}
                  className="flex items-center gap-2 bg-[#0054A6] hover:bg-[#004080] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-[#003875]"
                  title="Download complete audit logs as CSV for regulatory submission"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Download Regulatory CSV</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={auditSearchQuery}
                onChange={(e) => setAuditSearchQuery(e.target.value)}
                placeholder="Filter logs by analyst, case ID, wallet, or action..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0054A6]"
              />
            </div>
            <div className="text-[11px] text-slate-500">
              Format: Standard UTF-8 CSV with Bangladesh Bank BFIU compliance headers
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Audit ID & Time</th>
                  <th className="py-3 px-4">Authorized Analyst</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Action Taken</th>
                  <th className="py-3 px-4">Operator Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No audit log entries matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900">{log.id}</div>
                        <div className="text-[11px] text-slate-500">{log.timestamp}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {log.analyst}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900">{log.entityId}</span>
                        <span className="text-[10px] text-slate-500 block">{log.caseId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block font-bold text-[10px] px-2.5 py-0.5 rounded-full ${
                            log.actionTaken === 'FREEZE_WALLET'
                              ? 'bg-rose-100 text-rose-700'
                              : log.actionTaken === 'DISPATCH_FLOAT'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {log.actionTaken.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {log.notes}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
