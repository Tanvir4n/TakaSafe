/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UpayHeader } from './components/common/UpayHeader';
import { UpayHeroServices } from './components/common/UpayHeroServices';
import { UpayFooter } from './components/common/UpayFooter';
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { CustomerAppView } from './components/customer/CustomerAppView';
import { StorylineRunner } from './components/storyline/StorylineRunner';
import { InvestigationModal } from './components/investigation/InvestigationModal';
import {
  MOCK_TRANSACTIONS,
  CURRENT_CUSTOMER,
  MULE_NETWORK_17,
  MOCK_AGENTS_BARISHAL,
  REGIONAL_RADAR_METRICS,
} from './data/mockData';
import { Transaction, MuleCluster, AgentLiquidityNode, RegionalRiskMetric, StorylineStep } from './types';
import { ShieldCheck, Info } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'OPERATOR' | 'CUSTOMER' | 'STORYLINE'>('OPERATOR');
  const [operatorTab, setOperatorTab] = useState<string>('OVERVIEW');
  const [lang, setLang] = useState<'EN' | 'BN'>('EN');

  // Application Data States
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [muleCluster, setMuleCluster] = useState<MuleCluster>(MULE_NETWORK_17);
  const [agents, setAgents] = useState<AgentLiquidityNode[]>(MOCK_AGENTS_BARISHAL);
  const [regionalMetrics, setRegionalMetrics] = useState<RegionalRiskMetric[]>(REGIONAL_RADAR_METRICS);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [selectedTxnForInvestigation, setSelectedTxnForInvestigation] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch initial audit logs from server
  useEffect(() => {
    fetch('/api/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.logs) setAuditLogs(data.logs);
      })
      .catch((err) => console.log('Could not fetch audit logs from backend:', err));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Action: Freeze Wallet
  const handleFreezeWallet = async (walletId: string, label: string) => {
    setMuleCluster((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === walletId ? { ...n, status: 'FROZEN' as const } : n)),
    }));

    try {
      const res = await fetch('/api/audit-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analyst: 'Sourov Kumar (Chief Risk Analyst)',
          caseId: 'CASE-NET-17',
          entityType: 'NETWORK',
          entityId: walletId,
          actionTaken: 'FREEZE_WALLET',
          riskScore: 92,
          reason: `Quarantined ${label} connected to Suspicious Network #17`,
          notes: `Freezing enforced on aggregator node ${walletId}. Outbound settlement suspended.`,
        }),
      });
      const data = await res.json();
      if (data.entry) {
        setAuditLogs((prev) => [data.entry, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }

    showToast(`Quarantined and froze wallet ${walletId} in Network #17.`);
  };

  // Action: Dispatch Liquidity to Agent
  const handleDispatchLiquidity = async (agentId: string, agentName: string, amount: number) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? {
              ...a,
              currentCashFloat: a.currentCashFloat + amount,
              shortfallAmount: 0,
              riskStatus: 'ADEQUATE' as const,
            }
          : a
      )
    );

    try {
      const res = await fetch('/api/audit-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analyst: 'Md. Tanvir Hasan (SOC Ops)',
          caseId: 'CASE-BAR-DISASTER',
          entityType: 'AGENT',
          entityId: agentId,
          actionTaken: 'DISPATCH_FLOAT',
          riskScore: 78,
          reason: `Emergency float replenishment for ${agentName}`,
          notes: `Dispatched BDT ${amount.toLocaleString()} physical cash float via UCB Taqwa regional distributor.`,
        }),
      });
      const data = await res.json();
      if (data.entry) {
        setAuditLogs((prev) => [data.entry, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }

    showToast(`Dispatched BDT ${amount.toLocaleString()} liquidity float to ${agentName}.`);
  };

  // Action: Activate Monitoring
  const handleActivateMonitoring = async (division: string) => {
    setRegionalMetrics((prev) =>
      prev.map((m) => (m.division === division ? { ...m, status: 'EMERGING_RISK' as const } : m))
    );

    try {
      const res = await fetch('/api/audit-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analyst: 'Md. Sadman Al Islam Shabab (Model Architecture Lead)',
          caseId: `RADAR-${division.toUpperCase()}`,
          entityType: 'REGION',
          entityId: division,
          actionTaken: 'ACTIVATE_MONITORING',
          riskScore: 87,
          reason: `Elevated Early-Warning Risk Score in ${division}`,
          notes: `Activated Level-3 proactive surveillance. Threshold for ScamShield lowered.`,
        }),
      });
      const data = await res.json();
      if (data.entry) {
        setAuditLogs((prev) => [data.entry, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }

    showToast(`Activated Level-3 proactive monitoring for ${division} division.`);
  };

  // Storyline navigation helper
  const handleNavigateFromStoryline = (module: StorylineStep['moduleHighlight']) => {
    if (module === 'SCAMSHIELD') {
      setActiveView('CUSTOMER');
    } else if (module === 'INVESTIGATION') {
      setActiveView('OPERATOR');
      setOperatorTab('OVERVIEW');
      setSelectedTxnForInvestigation(transactions[0]);
    } else {
      setActiveView('OPERATOR');
      if (module === 'MULEVISION') setOperatorTab('MULEVISION');
      else if (module === 'RESILIENCE') setOperatorTab('RESILIENCE');
      else if (module === 'RADAR') setOperatorTab('RADAR');
      else setOperatorTab('OVERVIEW');
    }
  };

  // Handle Action taken from Investigation Modal
  const handleTakeInvestigationAction = async (
    action: 'MONITOR' | 'ADDITIONAL_VERIFICATION' | 'HOLD_FOR_REVIEW' | 'FREEZE_WALLET',
    notes: string
  ) => {
    if (!selectedTxnForInvestigation) return;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === selectedTxnForInvestigation.id
          ? {
              ...t,
              status:
                action === 'FREEZE_WALLET'
                  ? 'BLOCKED'
                  : action === 'HOLD_FOR_REVIEW'
                  ? 'HELD'
                  : 'APPROVED',
            }
          : t
      )
    );

    try {
      const res = await fetch('/api/audit-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analyst: 'Sourov Kumar (Chief Risk Analyst)',
          caseId: `CASE-${selectedTxnForInvestigation.id}`,
          entityType: 'TRANSACTION',
          entityId: selectedTxnForInvestigation.id,
          actionTaken: action,
          riskScore: selectedTxnForInvestigation.fusedRiskScore,
          reason: `Decision taken on ${selectedTxnForInvestigation.id}`,
          notes,
        }),
      });
      const data = await res.json();
      if (data.entry) {
        setAuditLogs((prev) => [data.entry, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }

    showToast(`Action recorded: ${action.replace(/_/g, ' ')} for Case #${selectedTxnForInvestigation.id}`);
  };

  const criticalCount = transactions.filter((t) => t.riskBand === 'CRITICAL' || t.riskBand === 'HIGH').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Upay Header with Logo, Navigation, Mode Switcher & Accreditation */}
      <UpayHeader
        activeView={activeView}
        setActiveView={setActiveView}
        lang={lang}
        setLang={setLang}
        criticalAlertCount={criticalCount}
      />

      {/* Upay Hero & Official Services Grid (Matching user wireframe photos 3, 4) */}
      <UpayHeroServices
        onServiceSelect={(svc) => {
          if (svc === 'Send Money') {
            setActiveView('CUSTOMER');
          } else {
            setActiveView('OPERATOR');
          }
        }}
        lang={lang}
      />

      {/* Main Interactive Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'OPERATOR' && (
          <OperatorDashboard
            transactions={transactions}
            customerProfile={CURRENT_CUSTOMER}
            muleCluster={muleCluster}
            agents={agents}
            regionalMetrics={regionalMetrics}
            onOpenInvestigation={(txn) => setSelectedTxnForInvestigation(txn)}
            onFreezeWallet={handleFreezeWallet}
            onDispatchLiquidity={handleDispatchLiquidity}
            onActivateMonitoring={handleActivateMonitoring}
            auditLogs={auditLogs}
            initialTab={operatorTab}
            lang={lang}
          />
        )}

        {activeView === 'CUSTOMER' && (
          <CustomerAppView
            customer={CURRENT_CUSTOMER}
            onSimulateRiskyPayment={() => {
              // Ensure critical transaction is visible in operator queue
            }}
            lang={lang}
          />
        )}

        {activeView === 'STORYLINE' && (
          <StorylineRunner
            onNavigateToModule={handleNavigateFromStoryline}
            lang={lang}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Full Explainable AI SHAP Investigation Modal */}
      {selectedTxnForInvestigation && (
        <InvestigationModal
          transaction={selectedTxnForInvestigation}
          customerProfile={CURRENT_CUSTOMER}
          isOpen={!!selectedTxnForInvestigation}
          onClose={() => setSelectedTxnForInvestigation(null)}
          onTakeAction={handleTakeInvestigationAction}
        />
      )}

      {/* Upay Official Footer (Matching user wireframe photo 5) */}
      <UpayFooter />
    </div>
  );
}
