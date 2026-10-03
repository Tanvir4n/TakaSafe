import React from 'react';
import { AuthUser } from '../../types';
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface AccessRestrictedGateProps {
  currentUser: AuthUser | null;
  onElevateToAdmin: () => void;
  onGoToCustomerApp: () => void;
  onSwitchAccount: () => void;
  lang: 'EN' | 'BN';
}

export const AccessRestrictedGate: React.FC<AccessRestrictedGateProps> = ({
  currentUser,
  onElevateToAdmin,
  onGoToCustomerApp,
  onSwitchAccount,
  lang,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-sans animate-slide-up">
      {/* Back Button */}
      <button
        onClick={onGoToCustomerApp}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Customer App</span>
      </button>

      {/* Main Restricted Access Card */}
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-xl overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Banner Strip */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 px-6 py-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white uppercase tracking-wider mb-1">
                <Lock className="w-3 h-3" />
                <span>RBAC Privilege Restriction</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {lang === 'BN'
                  ? 'অ্যাক্সেস সংরক্ষিত: অ্যাডমিন প্রিভিলেজ প্রয়োজন'
                  : 'Access Restricted: Administrator Privileges Required'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-black/20 px-3 py-1.5 rounded-xl border border-white/20 text-xs font-mono">
            <span className="text-amber-300 font-bold">Current Role:</span>
            <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-md font-bold uppercase text-[10px]">
              {currentUser?.role || 'USER'} (Less Privileges)
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              You are currently signed in as{' '}
              <strong className="text-slate-900 dark:text-white font-semibold">
                {currentUser?.name || 'Rafiqul Islam'}
              </strong>{' '}
              with standard <strong className="text-emerald-600 dark:text-emerald-400">USER (Customer)</strong> privileges.
              The National MFS Fraud Intelligence Surveillance Cockpit, MuleVision network cluster analysis, wallet freezing,
              and BFIU AML audit tools are restricted to authorized <strong className="text-[#0054A6] dark:text-blue-400">ADMIN</strong> analysts.
            </p>
          </div>

          {/* Side-by-side Privilege Breakdown (Admin Wider vs User Scoped) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Privileges Card (Current) */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    USER
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      Customer Role (Your Account)
                    </h3>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Scoped Privileges</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Active
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Personal Upay Wallet Balance & Transactions</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Send Money with ScamShield Pre-Payment Alert</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Link External Bank Accounts & Merchant QR</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Personal Financial Resilience Score (74/100)</span>
                </div>
                <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="line-through">National Fraud Surveillance Cockpit</span>
                </div>
                <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="line-through">Network Wallet Freezing & Agent Float Dispatch</span>
                </div>
              </div>
            </div>

            {/* Admin Privileges Card (Required for Cockpit) */}
            <div className="bg-blue-50/60 dark:bg-blue-950/30 p-5 rounded-2xl border border-blue-200 dark:border-blue-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0054A6] text-white flex items-center justify-center font-bold text-xs">
                    ADMIN
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      Chief Risk Analyst & AML Supervisor
                    </h3>
                    <span className="text-[10px] text-[#0054A6] dark:text-blue-300 font-medium">Wider Privileges</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-700">
                  Required
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#0054A6] dark:text-blue-400 shrink-0" />
                  <span>7 Operator Cockpit Modules & Live Ticker</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#0054A6] dark:text-blue-400 shrink-0" />
                  <span>MuleVision Graph & Wallet Freezing Authority</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#0054A6] dark:text-blue-400 shrink-0" />
                  <span>Coastal Cyclone Emergency Float Dispatch</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#0054A6] dark:text-blue-400 shrink-0" />
                  <span>ML Policy Weights & Threshold Calibration</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#0054A6] dark:text-blue-400 shrink-0" />
                  <span>Bangladesh Bank BFIU AML Audit Export</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#0054A6] dark:text-blue-400 shrink-0" />
                  <span>Explainable AI Case Brief Dossier Generator</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onGoToCustomerApp}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Smartphone className="w-4 h-4" />
                <span>Return to Upay Customer App</span>
              </button>

              <button
                type="button"
                onClick={onSwitchAccount}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Sign In as Another User
              </button>
            </div>

            {/* 1-Click Elevate to Admin */}
            <button
              type="button"
              onClick={onElevateToAdmin}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0054A6] hover:bg-[#004080] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-amber-300" />
              <span>Switch to Admin (Unlock Wider Privileges)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
