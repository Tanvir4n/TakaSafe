import React, { useState } from 'react';
import { AgentLiquidityNode } from '../../types';
import { CloudLightning, Waves, WifiOff, AlertOctagon, TrendingUp, TrendingDown, ShieldAlert, Truck, Check, RefreshCw } from 'lucide-react';

interface DisasterResilienceSimulatorProps {
  agents: AgentLiquidityNode[];
  onDispatchLiquidity: (agentId: string, agentName: string, amount: number) => void;
}

export const DisasterResilienceSimulator: React.FC<DisasterResilienceSimulatorProps> = ({
  agents,
  onDispatchLiquidity,
}) => {
  const [eventType, setEventType] = useState<'CYCLONE' | 'FLOOD' | 'NETWORK_OUTAGE'>('CYCLONE');
  const [region, setRegion] = useState<string>('Barishal');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CATASTROPHIC'>('HIGH');
  const [duration, setDuration] = useState<number>(48);
  const [dispatchedMap, setDispatchedMap] = useState<Record<string, boolean>>({});

  // Dynamic multipliers based on selections
  const getMultipliers = () => {
    let cashOutDelta = 42;
    let liquidityDrain = -31;
    let demandDelta = 18;
    let fraudVuln = 23;

    if (eventType === 'FLOOD') {
      cashOutDelta = 35;
      liquidityDrain = -28;
      demandDelta = 14;
      fraudVuln = 19;
    } else if (eventType === 'NETWORK_OUTAGE') {
      cashOutDelta = 25;
      liquidityDrain = -18;
      demandDelta = -30; // drop due to connectivity loss
      fraudVuln = 35; // surge due to offline fraud
    }

    if (severity === 'CATASTROPHIC') {
      cashOutDelta = Math.round(cashOutDelta * 1.35);
      liquidityDrain = Math.round(liquidityDrain * 1.3);
      fraudVuln = Math.round(fraudVuln * 1.3);
    } else if (severity === 'MEDIUM') {
      cashOutDelta = Math.round(cashOutDelta * 0.75);
      liquidityDrain = Math.round(liquidityDrain * 0.75);
    }

    return { cashOutDelta, liquidityDrain, demandDelta, fraudVuln };
  };

  const { cashOutDelta, liquidityDrain, demandDelta, fraudVuln } = getMultipliers();

  const handleDispatch = (agent: AgentLiquidityNode) => {
    onDispatchLiquidity(agent.id, agent.name, agent.shortfallAmount);
    setDispatchedMap((prev) => ({ ...prev, [agent.id]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Novel Differentiator Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md border border-blue-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Disaster Financial Resilience Mode</h2>
            </div>
            <p className="text-xs text-blue-200 mt-1 max-w-2xl">
              Simulating how floods, cyclones, and telecommunication disruptions impact transaction velocity, cash-out demand surges, and agent liquidity exhaustion before they cascade.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-200 font-medium">Scenario Status:</span>
            <span className="bg-rose-500 text-white font-bold text-xs px-3 py-1 rounded-full animate-pulse flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              ACTIVE SIMULATION
            </span>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-blue-800/80">
          {/* Event Selection */}
          <div>
            <label className="text-[11px] font-semibold text-blue-200 block mb-1">
              Disruption Event
            </label>
            <div className="grid grid-cols-3 gap-1 bg-blue-950/60 p-1 rounded-xl border border-blue-700/60">
              <button
                onClick={() => setEventType('CYCLONE')}
                className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors ${
                  eventType === 'CYCLONE' ? 'bg-amber-400 text-blue-950 font-bold' : 'text-blue-200 hover:text-white'
                }`}
              >
                <CloudLightning className="w-3.5 h-3.5" />
                <span>Cyclone</span>
              </button>
              <button
                onClick={() => setEventType('FLOOD')}
                className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors ${
                  eventType === 'FLOOD' ? 'bg-amber-400 text-blue-950 font-bold' : 'text-blue-200 hover:text-white'
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                <span>Flood</span>
              </button>
              <button
                onClick={() => setEventType('NETWORK_OUTAGE')}
                className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors ${
                  eventType === 'NETWORK_OUTAGE' ? 'bg-amber-400 text-blue-950 font-bold' : 'text-blue-200 hover:text-white'
                }`}
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>Outage</span>
              </button>
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="text-[11px] font-semibold text-blue-200 block mb-1">
              Impacted Division / Zone
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-blue-950/60 border border-blue-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="Barishal">Barishal Coastal Belt (Highest Exposure)</option>
              <option value="Sylhet">Sylhet Haor & Flash Flood Basin</option>
              <option value="Chittagong">Chittagong Coastal & Hill Tracts</option>
              <option value="Khulna">Khulna & Sundarbans Delta</option>
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="text-[11px] font-semibold text-blue-200 block mb-1">
              Event Severity
            </label>
            <div className="grid grid-cols-4 gap-1 bg-blue-950/60 p-1 rounded-xl border border-blue-700/60">
              {(['LOW', 'MEDIUM', 'HIGH', 'CATASTROPHIC'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`py-1.5 text-[10px] font-semibold rounded-lg transition-colors ${
                    severity === s ? 'bg-amber-400 text-blue-950 font-bold' : 'text-blue-200 hover:text-white'
                  }`}
                >
                  {s === 'CATASTROPHIC' ? 'CAT' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-[11px] font-semibold text-blue-200 block mb-1">
              Forecast Horizon: {duration} Hours
            </label>
            <input
              type="range"
              min="12"
              max="72"
              step="12"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-amber-400 h-2 bg-blue-950 rounded-lg cursor-pointer mt-2"
            />
          </div>
        </div>

        {/* Projected Impact Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <span className="text-[11px] text-blue-200 block">Txn Demand Forecast</span>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp className="w-5 h-5 text-emerald-300" />
              <span className="text-2xl font-bold font-mono text-white">
                {demandDelta > 0 ? `+${demandDelta}%` : `${demandDelta}%`}
              </span>
            </div>
            <span className="text-[10px] text-blue-300 mt-1 block">Surge in relief & family remittances</span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <span className="text-[11px] text-blue-200 block">Cash-Out Demand Surge</span>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp className="w-5 h-5 text-amber-300" />
              <span className="text-2xl font-bold font-mono text-amber-300">
                +{cashOutDelta}%
              </span>
            </div>
            <span className="text-[10px] text-blue-300 mt-1 block">Emergency cash hoarding for dry food/supplies</span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <span className="text-[11px] text-blue-200 block">Agent Liquidity Drain</span>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingDown className="w-5 h-5 text-rose-300" />
              <span className="text-2xl font-bold font-mono text-rose-300">
                {liquidityDrain}%
              </span>
            </div>
            <span className="text-[10px] text-blue-300 mt-1 block">Float exhaustion expected in ~2.8 hours</span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <span className="text-[11px] text-blue-200 block">Fraud Vulnerability Spike</span>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span className="text-2xl font-bold font-mono text-rose-300">
                +{fraudVuln}%
              </span>
            </div>
            <span className="text-[10px] text-blue-300 mt-1 block">Exploitation of network panic & relief scams</span>
          </div>
        </div>
      </div>

      {/* Agent Intelligence Shortfall & Replenishment Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Agent Intelligence: Prioritized Liquidity & Risk Ranks
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hourly cash-out forecast per agent to avoid service outage in vulnerable disaster corridors.
            </p>
          </div>
          <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded-full">
            {agents.filter((a) => a.riskStatus === 'CRITICAL_DEPLETION').length} Critical Shortfalls Identified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Agent Name & Location</th>
                <th className="py-3 px-4 text-right">Current Cash Float</th>
                <th className="py-3 px-4 text-right">Surge Need</th>
                <th className="py-3 px-4 text-right">Projected Shortfall</th>
                <th className="py-3 px-4 text-center">Runway</th>
                <th className="py-3 px-4">Severity Status</th>
                <th className="py-3 px-4 text-right">Intervention Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agents.map((agent) => {
                const isDispatched = dispatchedMap[agent.id];
                return (
                  <tr key={agent.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{agent.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {agent.district} · {agent.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                      ৳{agent.currentCashFloat.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600 font-medium">
                      +{agent.forecastedDemandSurge}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      {agent.shortfallAmount > 0 ? `-৳${agent.shortfallAmount.toLocaleString()}` : '৳ 0'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          agent.liquidityRunwayHours < 3
                            ? 'bg-rose-100 text-rose-800'
                            : agent.liquidityRunwayHours < 6
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {agent.liquidityRunwayHours}h
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                          agent.riskStatus === 'CRITICAL_DEPLETION'
                            ? 'bg-red-100 text-red-700'
                            : agent.riskStatus === 'AT_RISK'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {agent.riskStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isDispatched ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                          <Check className="w-3.5 h-3.5" />
                          <span>Dispatched</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDispatch(agent)}
                          className="inline-flex items-center gap-1.5 bg-[#0054A6] hover:bg-blue-800 text-white font-bold py-1 px-3 rounded-lg text-[11px] shadow-sm transition-all"
                        >
                          <Truck className="w-3 h-3 text-amber-300" />
                          <span>Dispatch Float</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
