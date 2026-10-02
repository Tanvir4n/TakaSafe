import React, { useState } from 'react';
import {
  Sliders,
  ShieldAlert,
  Brain,
  Zap,
  Smartphone,
  Network,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Info,
  Sparkles,
  Lock,
  Send,
  SlidersHorizontal,
  Flame,
  Check,
} from 'lucide-react';

export interface PolicyWeights {
  fraud: number;
  anomaly: number;
  velocity: number;
  device: number;
  network: number;
  scam: number;
}

interface PolicyWeightsActionEngineProps {
  weights: PolicyWeights;
  onWeightsChange: (newWeights: PolicyWeights) => void;
  lang?: 'EN' | 'BN';
}

interface PolicyPreset {
  id: string;
  name: string;
  description: string;
  weights: PolicyWeights;
  badge: string;
  recommendedFor: string;
}

const PRESET_POLICIES: PolicyPreset[] = [
  {
    id: 'BALANCED',
    name: 'Standard MFS Production Baseline',
    description: 'BFIU-compliant multi-modal risk weighting balanced across fraud, behavioral deviance, and velocity.',
    badge: 'Standard Baseline',
    recommendedFor: 'Normal 24/7 National Grid Operations',
    weights: {
      fraud: 0.30,
      anomaly: 0.20,
      velocity: 0.15,
      device: 0.15,
      network: 0.10,
      scam: 0.10,
    },
  },
  {
    id: 'NOCTURNAL',
    name: 'Nocturnal Velocity & Account Takeover Defense',
    description: 'Elevates device fingerprinting and rapid-drain velocity checks for 12:00 AM – 06:00 AM threat windows.',
    badge: 'Night Shift Guard',
    recommendedFor: 'Off-Peak Hours (00:00 – 06:00 BST)',
    weights: {
      fraud: 0.20,
      anomaly: 0.15,
      velocity: 0.25,
      device: 0.25,
      network: 0.10,
      scam: 0.05,
    },
  },
  {
    id: 'SYNDICATE_SWEEP',
    name: 'Mule Syndicate & Pass-Through Ring Strike',
    description: 'Heavily weights Graph Neural Network centrality and rapid multi-wallet circular hops.',
    badge: 'Anti-Mule Active',
    recommendedFor: 'Coordinated Syndicate Attack Waves',
    weights: {
      fraud: 0.25,
      anomaly: 0.15,
      velocity: 0.15,
      device: 0.10,
      network: 0.25,
      scam: 0.10,
    },
  },
  {
    id: 'SCAM_ALERT',
    name: 'Consumer Social Engineering & ScamShield Shield',
    description: 'Boosts pre-payment psychological duress detection, lottery fraud signals, and first-time recipient scrutiny.',
    badge: 'Consumer Protection',
    recommendedFor: 'Active Phishing / Impersonation Campaigns',
    weights: {
      fraud: 0.20,
      anomaly: 0.15,
      velocity: 0.15,
      device: 0.10,
      network: 0.15,
      scam: 0.25,
    },
  },
];

interface ActionRule {
  id: string;
  domain: 'TRANSACTION' | 'AGENT' | 'REGIONAL' | 'SCAM';
  domainLabel: string;
  scoreRange: string;
  scoreBand: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mandatoryAction: string;
  enforcementMechanism: string;
  sla: string;
  regulatoryRef: string;
}

const ACTION_RULES: ActionRule[] = [
  {
    id: 'RULE-TX-01',
    domain: 'TRANSACTION',
    domainLabel: 'Transaction Risk',
    scoreRange: 'Score 0 – 30 (Low)',
    scoreBand: 'LOW',
    mandatoryAction: 'Straight-Through Processing & Passive Telemetry',
    enforcementMechanism: 'Automated Real-Time Pass (< 80ms)',
    sla: '< 100ms instant settlement',
    regulatoryRef: 'BFIU MFS Guideline 4.1.a',
  },
  {
    id: 'RULE-TX-02',
    domain: 'TRANSACTION',
    domainLabel: 'Transaction Risk',
    scoreRange: 'Score 31 – 60 (Medium)',
    scoreBand: 'MEDIUM',
    mandatoryAction: 'Step-Up Verification via Out-of-Band SMS OTP',
    enforcementMechanism: 'Dynamic Biometric / 2FA Challenge',
    sla: 'Within 60s user response window',
    regulatoryRef: 'Bangladesh Bank Circular PSD-12',
  },
  {
    id: 'RULE-TX-03',
    domain: 'TRANSACTION',
    domainLabel: 'Transaction Risk',
    scoreRange: 'Score 61 – 80 (High)',
    scoreBand: 'HIGH',
    mandatoryAction: 'Outbound Escrow Hold & Tier-2 Human Analyst Review',
    enforcementMechanism: 'Queued to Fraud SOC Desk with Explainable SHAP',
    sla: '15-minute analyst turnaround',
    regulatoryRef: 'BFIU Suspicious Transaction Standard',
  },
  {
    id: 'RULE-TX-04',
    domain: 'TRANSACTION',
    domainLabel: 'Transaction Risk',
    scoreRange: 'Score 81 – 100 (Critical)',
    scoreBand: 'CRITICAL',
    mandatoryAction: 'Automated Hard Freeze, Step-Up KYC & Mule Chain Block',
    enforcementMechanism: 'Instant API Wallet Lock & BFIU STR Dispatch',
    sla: 'Immediate (< 250ms intercept)',
    regulatoryRef: 'Anti-Terrorism Act & AML Rule 19',
  },
  {
    id: 'RULE-AGT-01',
    domain: 'AGENT',
    domainLabel: 'Agent Liquidity Risk',
    scoreRange: 'Projected Float Shortfall > ৳100,000',
    scoreBand: 'HIGH',
    mandatoryAction: 'Prioritize Regional Distributor Float Injection & Armored Dispatch',
    enforcementMechanism: 'Action Engine Automated Distributor Dispatch Route',
    sla: '< 2 hours to replenishment',
    regulatoryRef: 'MFS Agent Cash Liquidity Rule 8',
  },
  {
    id: 'RULE-REG-01',
    domain: 'REGIONAL',
    domainLabel: 'Regional Risk',
    scoreRange: 'Elevated Division Risk Score (> 75)',
    scoreBand: 'CRITICAL',
    mandatoryAction: 'Activate Level-3 Proactive Geofence Surveillance & Float Shield',
    enforcementMechanism: 'Regional Disaster Resilience Protocol (Cyclone/Flooding)',
    sla: 'Active 24-hr monitoring cycle',
    regulatoryRef: 'National Financial Inclusion Contingency Plan',
  },
  {
    id: 'RULE-SCAM-01',
    domain: 'SCAM',
    domainLabel: 'ScamShield Risk',
    scoreRange: 'Nocturnal Coercive Payment / Social Engineering Match',
    scoreBand: 'HIGH',
    mandatoryAction: 'Trigger ScamShield In-App Intervention & 24h Cooling-Off Choice',
    enforcementMechanism: 'Customer-Empowered Delay & Recipient Verification Screen',
    sla: 'Pre-flight blocking before PIN entry',
    regulatoryRef: 'Consumer Protection Directive 2026',
  },
];

export const PolicyWeightsActionEngine: React.FC<PolicyWeightsActionEngineProps> = ({
  weights,
  onWeightsChange,
  lang,
}) => {
  const [activePreset, setActivePreset] = useState<string>('BALANCED');
  const [actionFilter, setActionFilter] = useState<'ALL' | 'TRANSACTION' | 'AGENT' | 'REGIONAL' | 'SCAM'>('ALL');
  const [deployedSuccess, setDeployedSuccess] = useState<boolean>(false);
  const [testedRuleId, setTestedRuleId] = useState<string | null>(null);

  // Calculate sum of weights
  const totalWeight = Math.round((weights.fraud + weights.anomaly + weights.velocity + weights.device + weights.network + weights.scam) * 100) / 100;
  const isBalanced = Math.abs(totalWeight - 1.0) < 0.001;

  // Handle single parameter change
  const handleWeightChange = (key: keyof PolicyWeights, val: number) => {
    setActivePreset('CUSTOM');
    onWeightsChange({
      ...weights,
      [key]: val,
    });
  };

  // Normalize weights automatically so their sum is exactly 1.00
  const handleAutoNormalize = () => {
    const sum = weights.fraud + weights.anomaly + weights.velocity + weights.device + weights.network + weights.scam;
    if (sum === 0) return;
    const factor = 1 / sum;
    const normalized: PolicyWeights = {
      fraud: Math.round(weights.fraud * factor * 100) / 100,
      anomaly: Math.round(weights.anomaly * factor * 100) / 100,
      velocity: Math.round(weights.velocity * factor * 100) / 100,
      device: Math.round(weights.device * factor * 100) / 100,
      network: Math.round(weights.network * factor * 100) / 100,
      scam: Math.round((1 - (
        Math.round(weights.fraud * factor * 100) / 100 +
        Math.round(weights.anomaly * factor * 100) / 100 +
        Math.round(weights.velocity * factor * 100) / 100 +
        Math.round(weights.device * factor * 100) / 100 +
        Math.round(weights.network * factor * 100) / 100
      )) * 100) / 100,
    };
    onWeightsChange(normalized);
  };

  const handleApplyPreset = (preset: PolicyPreset) => {
    setActivePreset(preset.id);
    onWeightsChange(preset.weights);
  };

  const handleDeployPolicy = () => {
    setDeployedSuccess(true);
    setTimeout(() => setDeployedSuccess(false), 3500);
  };

  const handleSimulateRule = (ruleId: string) => {
    setTestedRuleId(ruleId);
    setTimeout(() => setTestedRuleId(null), 2500);
  };

  const filteredRules = actionFilter === 'ALL'
    ? ACTION_RULES
    : ACTION_RULES.filter((r) => r.domain === actionFilter);

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Top Banner: Enterprise MFS Governance Header */}
      <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
              BFIU AML/CFT Risk Matrix Engine · Bangladesh MFS Standard
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
            <span>Policy Parameter Weights & Automated Action Engine</span>
            <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-950/80 text-[#0054A6] dark:text-blue-400 font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              v4.2 Production
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Fine-tune mathematical model coefficients for real-time transaction scoring (<span className="font-mono text-slate-700 dark:text-slate-300">Rfinal = Σ wi · si</span>) and inspect deterministic, auditable regulatory actions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Allocation Health Pill */}
          <div className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
            isBalanced
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isBalanced ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
            <span>Allocation: {(totalWeight * 100).toFixed(0)}%</span>
            {!isBalanced && (
              <button
                type="button"
                onClick={handleAutoNormalize}
                className="ml-1 text-[11px] underline font-extrabold hover:text-amber-950 dark:hover:text-amber-100 cursor-pointer"
              >
                Auto-Balance
              </button>
            )}
          </div>

          {/* Deploy Policy Button */}
          <button
            type="button"
            onClick={handleDeployPolicy}
            className="flex items-center gap-2 px-4 py-2 bg-[#0054A6] hover:bg-[#004284] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            {deployedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Send className="w-4 h-4 text-amber-300" />}
            <span>{deployedSuccess ? 'Policy Deployed Live!' : 'Deploy to AML Grid'}</span>
          </button>
        </div>
      </div>

      {/* Preset Policy Profiles Bar (Real Banking Configuration Switcher) */}
      <div className="bg-white dark:bg-[#0F172A] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#0054A6] dark:text-blue-400" />
            <span>Operational Risk Profiles (Quick-Switch Presets):</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Active: <strong className="text-[#0054A6] dark:text-blue-400">{activePreset}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {PRESET_POLICIES.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-[#0054A6] bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-[#0054A6]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-[#0054A6] text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {preset.badge}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#0054A6] dark:bg-blue-400" />}
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white mt-1.5 group-hover:text-[#0054A6] dark:group-hover:text-blue-400 transition-colors">
                  {preset.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {preset.recommendedFor}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Policy Parameter Weights (Left) & Action Engine Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Parameter Weights with Professional MFS Naming */}
        <div className="lg:col-span-6 xl:col-span-6 bg-white dark:bg-[#0F172A] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <span>Signal Model Weight Allocation</span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-normal">
                  (Σ wi = 1.00)
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Deterministic weight coefficients applied to each intelligence subsystem.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAutoNormalize}
              className="text-xs text-[#0054A6] dark:text-blue-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              title="Reset / Auto-Normalize weights"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Normalize</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* 1. Supervised Fraud Probability */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2 hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-black text-xs text-slate-900 dark:text-white">
                      Supervised Fraud Probability Engine
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      XGBoost Classifier v4.2 · Historical MFS fraud vector patterns
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400">
                    {Math.round(weights.fraud * 100)}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    (w={weights.fraud.toFixed(2)})
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <input
                  type="range"
                  min="0.05"
                  max="0.50"
                  step="0.05"
                  value={weights.fraud}
                  onChange={(e) => handleWeightChange('fraud', Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>5% (Permissive)</span>
                  <span>Default 30%</span>
                  <span>50% (Strict)</span>
                </div>
              </div>
            </div>

            {/* 2. Behavioral Anomaly Baseline */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-black text-xs text-slate-900 dark:text-white">
                      Behavioral Anomaly & Spending Baseline
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Isolation Forest Model · 90-Day customer spending distribution deviance
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-black text-indigo-600 dark:text-indigo-400">
                    {Math.round(weights.anomaly * 100)}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    (w={weights.anomaly.toFixed(2)})
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <input
                  type="range"
                  min="0.05"
                  max="0.40"
                  step="0.05"
                  value={weights.anomaly}
                  onChange={(e) => handleWeightChange('anomaly', Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>5% (Tolerant)</span>
                  <span>Default 20%</span>
                  <span>40% (Sensitive)</span>
                </div>
              </div>
            </div>

            {/* 3. Transaction Velocity & Burst Frequency */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2 hover:border-amber-300 dark:hover:border-amber-800 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-black text-xs text-slate-900 dark:text-white">
                      Transaction Velocity & Burst Frequency
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Sliding Window Engine · Rapid multi-outbound velocity acceleration
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-black text-amber-600 dark:text-amber-400">
                    {Math.round(weights.velocity * 100)}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    (w={weights.velocity.toFixed(2)})
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <input
                  type="range"
                  min="0.05"
                  max="0.35"
                  step="0.05"
                  value={weights.velocity}
                  onChange={(e) => handleWeightChange('velocity', Number(e.target.value))}
                  className="w-full accent-amber-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>5% (Low Spike)</span>
                  <span>Default 15%</span>
                  <span>35% (Anti-Rapid Drain)</span>
                </div>
              </div>
            </div>

            {/* 4. Device Integrity & Hardware Fingerprint */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2 hover:border-cyan-300 dark:hover:border-cyan-800 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-black text-xs text-slate-900 dark:text-white">
                      Device Integrity & Hardware Fingerprint
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      IMEI, SIM Swap & IP Telemetry · Unknown nocturnal devices & VPN proxies
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-black text-cyan-600 dark:text-cyan-400">
                    {Math.round(weights.device * 100)}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    (w={weights.device.toFixed(2)})
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.05"
                  value={weights.device}
                  onChange={(e) => handleWeightChange('device', Number(e.target.value))}
                  className="w-full accent-cyan-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>5% (Permissive)</span>
                  <span>Default 15%</span>
                  <span>30% (Zero Trust Device)</span>
                </div>
              </div>
            </div>

            {/* 5. Mule Syndicate Graph Centrality */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2 hover:border-purple-300 dark:hover:border-purple-800 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Network className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-black text-xs text-slate-900 dark:text-white">
                      Mule Syndicate Graph Centrality
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      MuleVision Graph Neural Network · Central aggregator & hop distance
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-black text-purple-600 dark:text-purple-400">
                    {Math.round(weights.network * 100)}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    (w={weights.network.toFixed(2)})
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.05"
                  value={weights.network}
                  onChange={(e) => handleWeightChange('network', Number(e.target.value))}
                  className="w-full accent-purple-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>5% (Isolated)</span>
                  <span>Default 10%</span>
                  <span>30% (Network Sweep)</span>
                </div>
              </div>
            </div>

            {/* 6. Social Engineering & ScamShield Risk */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2 hover:border-rose-300 dark:hover:border-rose-800 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-black text-xs text-slate-900 dark:text-white">
                      Social Engineering & ScamShield Risk
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Pre-Payment Cognitive Defense · Lottery scams, panic duress & caller spoofing
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-black text-rose-600 dark:text-rose-400">
                    {Math.round(weights.scam * 100)}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    (w={weights.scam.toFixed(2)})
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.05"
                  value={weights.scam}
                  onChange={(e) => handleWeightChange('scam', Number(e.target.value))}
                  className="w-full accent-rose-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>5% (Minimal)</span>
                  <span>Default 10%</span>
                  <span>30% (High Scam Shield)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Action Engine: Operational Decision Matrix */}
        <div className="lg:col-span-6 xl:col-span-6 bg-white dark:bg-[#0F172A] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <span>Action Engine: Operational Decision Mapping</span>
                <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  7 Active Rules
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Deterministic mapping from mathematical output scores to automated regulatory and operational actions.
              </p>
            </div>
          </div>

          {/* Domain Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Filter Domain:</span>
            {[
              { id: 'ALL', label: 'All Signals (7)' },
              { id: 'TRANSACTION', label: 'Transaction Risk (4)' },
              { id: 'AGENT', label: 'Agent Liquidity (1)' },
              { id: 'REGIONAL', label: 'Regional (1)' },
              { id: 'SCAM', label: 'ScamShield (1)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActionFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  actionFilter === f.id
                    ? 'bg-[#0054A6] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Action Rules Cards / Table */}
          <div className="space-y-3 pt-1 max-h-[640px] overflow-y-auto pr-1">
            {filteredRules.map((rule) => {
              const isTested = testedRuleId === rule.id;
              return (
                <div
                  key={rule.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isTested
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        rule.scoreBand === 'CRITICAL'
                          ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                          : rule.scoreBand === 'HIGH'
                          ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                          : rule.scoreBand === 'MEDIUM'
                          ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800'
                          : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      }`}>
                        {rule.domainLabel}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                        {rule.scoreRange}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{rule.sla}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSimulateRule(rule.id)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                          isTested
                            ? 'bg-emerald-600 text-white font-black'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#0054A6]'
                        }`}
                      >
                        {isTested ? 'Triggered!' : 'Test Rule'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className={
                        rule.scoreBand === 'CRITICAL' ? 'text-rose-600 dark:text-rose-400' :
                        rule.scoreBand === 'HIGH' ? 'text-amber-600 dark:text-amber-400' :
                        'text-[#0054A6] dark:text-blue-400'
                      }>•</span>
                      <span>{rule.mandatoryAction}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap items-center justify-between gap-1">
                      <span><strong>Enforcement:</strong> {rule.enforcementMechanism}</span>
                      <span className="text-[10px] font-mono text-slate-400">Ref: {rule.regulatoryRef}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Compliance Guarantee Strip */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>100% Auditable Ledger:</strong> All policy modifications are cryptographically logged in BFIU audit logs.
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline">
              ISO-27001 Certified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
