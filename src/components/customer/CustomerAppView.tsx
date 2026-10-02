import React, { useState } from 'react';
import { CustomerBaseline, Transaction } from '../../types';
import {
  Send,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  Receipt,
  PhoneCall,
  Lock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface CustomerAppViewProps {
  customer: CustomerBaseline;
  onSimulateRiskyPayment: () => void;
  lang: 'EN' | 'BN';
}

export const CustomerAppView: React.FC<CustomerAppViewProps> = ({
  customer,
  onSimulateRiskyPayment,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'WALLET' | 'RESILIENCE'>('WALLET');
  const [recipient, setRecipient] = useState<string>('01988-510294');
  const [amount, setAmount] = useState<string>('80000');
  const [note, setNote] = useState<string>('Urgent emergency medical fee');
  const [showScamModal, setShowScamModal] = useState<boolean>(false);
  const [scamDecision, setScamDecision] = useState<string | null>(null);
  const [normalSuccess, setNormalSuccess] = useState<boolean>(false);

  const handleSendPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);

    // If amount is high (>20000) or suspicious recipient, trigger ScamShield
    if (num >= 20000 || recipient.includes('510294')) {
      setShowScamModal(true);
      onSimulateRiskyPayment();
    } else {
      setNormalSuccess(true);
      setTimeout(() => setNormalSuccess(false), 4000);
    }
  };

  const handlePreFill = (type: 'NORMAL' | 'RISKY') => {
    if (type === 'NORMAL') {
      setRecipient('01819-440129');
      setAmount('1500');
      setNote('Monthly grocery expense');
    } else {
      setRecipient('01988-510294');
      setAmount('80000');
      setNote('Lottery prize processing fee');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Customer Mode Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'BN' ? 'গ্রাহক মোড' : 'Active TakaSafe Customer Persona'}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            {customer.name} ({customer.wallet})
          </h2>
          <p className="text-xs text-slate-500">
            Registered Base: {customer.homeDistrict} · Verified NID · Primary Device: {customer.knownDevices[0]}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('WALLET')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'WALLET'
                ? 'bg-[#0054A6] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'BN' ? 'টাকা সেফ ওয়ালেট' : 'TakaSafe Wallet & Transfers'}
          </button>
          <button
            onClick={() => setActiveTab('RESILIENCE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'RESILIENCE'
                ? 'bg-[#0054A6] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'BN' ? 'আর্থিক সুরক্ষা সূচক' : 'Financial Resilience Score'}
          </button>
        </div>
      </div>

      <div key={activeTab} className="page-enter">
        {activeTab === 'WALLET' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-grid">
          {/* Balance & Card Details */}
          <div className="md:col-span-1 space-y-4">
            {/* Digital Wallet Card */}
            <div className="bg-gradient-to-br from-[#0054A6] via-[#004080] to-[#002B57] text-white p-6 rounded-3xl shadow-xl border border-blue-400/20 relative overflow-hidden card-hover-lift">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-200 font-medium">TakaSafe Digital Account</span>
                <span className="text-[10px] bg-amber-400 text-blue-950 font-black px-2 py-0.5 rounded-full">
                  SCAMSHIELD 24/7
                </span>
              </div>

              <div className="mt-6">
                <span className="text-xs text-blue-200 block">Available Balance</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-sm font-bold text-amber-300">৳</span>
                  <span className="text-3xl font-black font-mono tracking-tight">
                    {customer.balance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-200">
                <span>A/C: {customer.wallet}</span>
                <span className="text-emerald-300 font-semibold">Tier 2 Verified</span>
              </div>
            </div>

            {/* Quick Demo Pre-fills */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                ⚡ Quick Demonstration Scenarios:
              </span>
              <button
                type="button"
                onClick={() => handlePreFill('NORMAL')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-xs"
              >
                <div className="font-bold text-slate-800">1. Normal Transfer (৳ 1,500)</div>
                <div className="text-[11px] text-slate-500">To: Mother · Regular contact · 0 Risk</div>
              </button>
              <button
                type="button"
                onClick={() => handlePreFill('RISKY')}
                className="w-full text-left p-2.5 rounded-xl border-2 border-rose-200 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-400 transition-all text-xs"
              >
                <div className="font-bold text-rose-800 flex items-center justify-between">
                  <span>2. Risky Transfer (৳ 80,000)</span>
                  <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded">TRIGGERS SHIELD</span>
                </div>
                <div className="text-[11px] text-slate-500">To: New nocturnal account · Mule W302 link</div>
              </button>
            </div>
          </div>

          {/* Transfer Form */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#0054A6]" />
                <h3 className="font-bold text-slate-900 text-base">
                  {lang === 'BN' ? 'সেন্ড মানি করুন' : 'Send Money'}
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">
                Protected by ScamShield Real-Time Guardian
              </span>
            </div>

            {normalSuccess && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">Payment Completed Successfully!</div>
                  <div>Sent ৳1,500 to {customer.frequentRecipients[0]}. Transaction fee: ৳0.</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSendPayment} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {lang === 'BN' ? 'প্রাপকের টাকা সেফ নম্বর' : 'Recipient TakaSafe Wallet / Phone'}
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0054A6]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {lang === 'BN' ? 'টাকার পরিমাণ (৳)' : 'Amount (BDT ৳)'}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-slate-400 font-bold">৳</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-4 py-2.5 text-base font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0054A6]"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Your regular 90-day transfer average is <strong>৳1,500</strong>.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Reference Note (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Family support, emergency, bill"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0054A6]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#FAB915] hover:bg-[#e5a80f] text-slate-950 font-black py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'BN' ? 'টাকা পাঠান' : 'Proceed to Send Money'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Customer Financial Resilience Tab */
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-lg">
                  Customer Financial Resilience & Health Index
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Empowering MFS users with explainable insights on spending stability, cash-out dependency, and emergency buffers.
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Personal Resilience Score</span>
              <span className="text-3xl font-black font-mono text-emerald-600">
                {customer.financialResilienceScore}/100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Income Regularity</span>
              <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">
                {customer.resilienceComponents.incomeStability}%
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                Predictable bi-monthly inflow
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Spending Volatility</span>
              <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">
                {customer.resilienceComponents.spendingDiscipline}%
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Low discretionary spikes
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Emergency Buffer</span>
              <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">
                {customer.resilienceComponents.emergencyBufferDays} Days
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                Above national 30-day baseline
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Cash-Out Dependency</span>
              <span className="text-2xl font-bold font-mono text-amber-600 mt-1 block">
                {customer.resilienceComponents.cashOutDependency}%
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Moderate cash withdrawal habit
              </span>
            </div>
          </div>

          {/* Tailored Coaching Tips */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Smart Financial Coaching (AI Recommendations)
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Reduce Cash-Out Fees:</strong> You withdrew ৳12,000 in physical cash last month. Paying utility bills (DESCO, Titas) and groceries directly with TakaSafe QR saves approximately ৳216 in agent cash-out commissions.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Emergency Buffer Goal:</strong> Your current wallet reserve covers 45 days. Maintaining a ৳10,000 minimum balance safeguards against unexpected monsoon health emergencies without borrowing.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* ScamShield Pre-Payment Modal (Human-Choice Protection) */}
      {showScamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-rose-300 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] bg-rose-600 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ScamShield Pre-Payment Warning
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  High Risk Transaction (Score: 94/100)
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Hold on, <strong>{customer.name}</strong>! This payment differs significantly from your usual activity. We detected patterns commonly seen in coercive social engineering and fraudulent lottery scams.
            </p>

            {/* Plain Language Reasons */}
            <div className="bg-rose-50/80 rounded-2xl p-4 border border-rose-200 space-y-2.5 text-xs">
              <span className="font-bold text-rose-950 block">Why this was flagged:</span>
              <ul className="space-y-1.5 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>New Recipient:</strong> You have never transacted with wallet <code>{recipient}</code> before.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>Unusual Amount:</strong> ৳{Number(amount).toLocaleString()} is <strong>53x higher</strong> than your regular transfers (৳1,500).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>Time Anomaly:</strong> Initiated during late night/early morning hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>Suspicious Network:</strong> Recipient is connected to an active money-mule syndicate under review.</span>
                </li>
              </ul>
            </div>

            {scamDecision ? (
              <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-700 font-medium">
                {scamDecision}
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <div className="text-[11px] text-slate-500 font-medium text-center">
                  You have full control. Choose how you would like to proceed:
                </div>

                {/* Option 1: Verify */}
                <button
                  onClick={() => setScamDecision('Recipient verification requested. Please call the recipient directly to verify identity before re-attempting.')}
                  className="w-full flex items-center justify-center gap-2 bg-[#0054A6] hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition-all"
                >
                  <UserCheck className="w-4 h-4 text-amber-300" />
                  <span>Verify Recipient Identity</span>
                </button>

                {/* Option 2: Delay 24h */}
                <button
                  onClick={() => {
                    setScamDecision('Payment placed in 24-Hour Cooling-Off Hold. You can cancel anytime without moving funds.');
                    setTimeout(() => setShowScamModal(false), 2500);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition-all"
                >
                  <Clock className="w-4 h-4" />
                  <span>Delay Payment (24-Hour Cooling-Off Window)</span>
                </button>

                {/* Option 3: Continue at Own Risk */}
                <button
                  onClick={() => {
                    setScamDecision('Customer chose to proceed at own risk. Action logged for compliance review.');
                    setTimeout(() => setShowScamModal(false), 2000);
                  }}
                  className="w-full text-center text-slate-500 hover:text-slate-800 text-xs font-medium py-1.5 transition-colors"
                >
                  Continue Anyway at My Own Risk
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
