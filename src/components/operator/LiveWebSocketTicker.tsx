import React, { useState, useEffect } from 'react';
import { Transaction } from '../../types';
import {
  Radio,
  Zap,
  ShieldAlert,
  Eye,
  AlertTriangle,
  Play,
  Pause,
  Download,
  FileCheck2,
  Activity,
  ArrowRight,
  Flame,
  CheckCircle,
} from 'lucide-react';

interface LiveWebSocketTickerProps {
  latestTransaction: Transaction | null;
  isFlashing: boolean;
  onOpenInvestigation: (transaction: Transaction) => void;
  onSimulateSpike: () => void;
  onOpenComplianceReport: () => void;
  onDownloadCSV: () => void;
  lang: 'EN' | 'BN';
}

export const LiveWebSocketTicker: React.FC<LiveWebSocketTickerProps> = ({
  latestTransaction,
  isFlashing,
  onOpenInvestigation,
  onSimulateSpike,
  onOpenComplianceReport,
  onDownloadCSV,
  lang,
}) => {
  const [latency, setLatency] = useState<number>(9);
  const [eventCount, setEventCount] = useState<number>(142);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Subtle real-time ping fluctuation for authentic WebSocket feel
  useEffect(() => {
    const timer = setInterval(() => {
      setLatency(Math.floor(7 + Math.random() * 6));
      if (!isPaused) {
        setEventCount((prev) => prev + 1);
      }
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const isHighRisk = latestTransaction && (latestTransaction.fusedRiskScore >= 75 || latestTransaction.riskBand === 'CRITICAL' || latestTransaction.riskBand === 'HIGH');

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isFlashing
          ? 'bg-gradient-to-r from-rose-950 via-[#0E1526] to-rose-950 border-rose-500 ring-2 ring-rose-500 shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-pulse'
          : 'bg-[#0B1120] border-slate-800 shadow-md'
      }`}
    >
      {/* Flashing Alert Banner when high-risk transaction is intercepted */}
      {isFlashing && (
        <div className="bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider py-1 px-4 flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>CRITICAL ALERT: High-Risk Transaction Intercepted by Transaction Guardian</span>
          </div>
          <span className="font-mono text-[10px] bg-black/30 px-2 py-0.5 rounded">
            Score: {latestTransaction?.fusedRiskScore}/100
          </span>
        </div>
      )}

      {/* Main Ticker Stream Bar */}
      <div className="p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200">
        {/* Left: WebSocket Connection Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isPaused ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
            </span>
            <span className="text-slate-400 font-bold">WS:</span>
            <span className="text-emerald-400 font-semibold">{isPaused ? 'PAUSED' : 'STREAMING'}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">{latency}ms</span>
          </div>

          <span className="text-[10px] font-mono text-slate-500 hidden xl:inline">
            wss://guardian.stream.takasafe.internal
          </span>
        </div>

        {/* Center: Live Transaction Ticker Item */}
        <div className="flex-1 min-w-[280px] max-w-2xl flex items-center gap-2.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 overflow-hidden">
          {latestTransaction ? (
            <>
              <span className="text-[10px] font-mono font-bold text-indigo-400 shrink-0">
                {latestTransaction.id}
              </span>

              <div className="flex items-center gap-1.5 text-xs truncate flex-1">
                <span className="font-bold text-white truncate max-w-[130px]" title={latestTransaction.senderName}>
                  {latestTransaction.senderName}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="text-slate-300 truncate max-w-[130px]" title={latestTransaction.receiverName}>
                  {latestTransaction.receiverName}
                </span>
              </div>

              <span className="font-mono font-bold text-white shrink-0">
                ৳{latestTransaction.amount.toLocaleString()}
              </span>

              <span
                className={`font-mono font-black text-[10px] px-2 py-0.5 rounded-md shrink-0 ${
                  latestTransaction.fusedRiskScore >= 75
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : latestTransaction.fusedRiskScore >= 50
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {latestTransaction.fusedRiskScore}/100
              </span>

              <button
                onClick={() => onOpenInvestigation(latestTransaction)}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-[#0054A6] hover:bg-blue-600 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
                title="Inspect in Explainable AI Guardian"
              >
                <Eye className="w-3 h-3 text-amber-300" />
                <span className="hidden sm:inline">Investigate</span>
              </button>
            </>
          ) : (
            <span className="text-slate-500 text-xs italic">Awaiting real-time stream packet...</span>
          )}
        </div>

        {/* Right: Actions (Simulate Spike & Compliance Export) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Pause / Resume Ticker */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isPaused ? 'Resume live WebSocket stream' : 'Pause live WebSocket stream'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Simulate High-Risk Attack Spike Button */}
          <button
            onClick={onSimulateSpike}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all transform active:scale-95 cursor-pointer border border-rose-400/40"
            title="Inject simulated high-risk transaction into the stream"
          >
            <Flame className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span>Simulate High-Risk Attack</span>
          </button>

          {/* Export Compliance Report Button */}
          <div className="flex items-center rounded-xl bg-[#0054A6] text-white p-0.5 shadow-sm border border-[#004080]">
            <button
              onClick={onOpenComplianceReport}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              title="Open Regulatory Compliance PDF Report"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Compliance Report (PDF)</span>
            </button>
            <div className="w-[1px] h-4 bg-blue-400/40 mx-0.5" />
            <button
              onClick={onDownloadCSV}
              className="p-1 text-blue-200 hover:text-white hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              title="Download Audit Logs CSV"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
