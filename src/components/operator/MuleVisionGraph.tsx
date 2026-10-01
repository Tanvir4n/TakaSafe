import React, { useState } from 'react';
import { MuleCluster, MuleNode } from '../../types';
import {
  Network,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Lock,
  Zap,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sliders,
  DollarSign,
  Maximize2,
  Info,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface MuleVisionGraphProps {
  cluster: MuleCluster;
  onFreezeWallet: (walletId: string, label: string) => void;
}

export const MuleVisionGraph: React.FC<MuleVisionGraphProps> = ({ cluster, onFreezeWallet }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('W302');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'OVERVIEW' | 'FLOWS' | 'SIGNATURES'>('OVERVIEW');
  const [animateParticles, setAnimateParticles] = useState<boolean>(true);
  const [highlightCircular, setHighlightCircular] = useState<boolean>(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Fallback safe selected node
  const selectedNode = cluster.nodes.find((n) => n.id === selectedNodeId) || cluster.nodes[0];

  const getNodeCoordinates = (node: MuleNode) => {
    switch (node.id) {
      case 'W101': return { x: 80, y: 85 };
      case 'W102': return { x: 75, y: 225 };
      case 'W103': return { x: 80, y: 365 };
      case 'W201': return { x: 215, y: 135 };
      case 'W202': return { x: 215, y: 315 };
      case 'W302': return { x: 370, y: 225 }; // Central Hub
      case 'W204': return { x: 485, y: 105 }; // Circular Relay Upper
      case 'W108': return { x: 485, y: 345 }; // Circular Relay Lower
      case 'AGT-881': return { x: 650, y: 155 }; // Cash Out Agent 1
      case 'AGT-882': return { x: 650, y: 295 }; // Cash Out Agent 2
      case 'W401': return { x: 615, y: 45 };  // Exit Wallet 1
      case 'W402': return { x: 615, y: 405 }; // Exit Wallet 2
      default: return { x: node.x, y: node.y };
    }
  };

  const getNodeColor = (role: MuleNode['role'], status: MuleNode['status']) => {
    if (status === 'FROZEN') {
      return { fill: '#334155', stroke: '#94A3B8', glow: 'rgba(148, 163, 184, 0.4)' };
    }
    switch (role) {
      case 'AGGREGATOR':
        return { fill: '#EF4444', stroke: '#FCA5A5', glow: 'rgba(239, 68, 68, 0.7)' };
      case 'MULE_LAYER_1':
        return { fill: '#F59E0B', stroke: '#FDE68A', glow: 'rgba(245, 158, 11, 0.6)' };
      case 'MULE_LAYER_2':
        return { fill: '#A855F7', stroke: '#E9D5FF', glow: 'rgba(168, 85, 247, 0.6)' };
      case 'CASH_OUT_AGENT':
        return { fill: '#0EA5E9', stroke: '#BAE6FD', glow: 'rgba(14, 165, 233, 0.6)' };
      case 'VICTIM':
        return { fill: '#10B981', stroke: '#A7F3D0', glow: 'rgba(16, 185, 129, 0.6)' };
      default:
        return { fill: '#64748B', stroke: '#CBD5E1', glow: 'rgba(100, 116, 139, 0.4)' };
    }
  };

  const filteredNodes = cluster.nodes.filter((node) => {
    if (filterRole === 'ALL') return true;
    return node.role === filterRole;
  });

  // Calculate in-degree & out-degree
  const inEdges = cluster.edges.filter((e) => e.target === selectedNode.id);
  const outEdges = cluster.edges.filter((e) => e.source === selectedNode.id);
  const totalInflow = inEdges.reduce((acc, curr) => acc + curr.amount, 0);
  const totalOutflow = outEdges.reduce((acc, curr) => acc + curr.amount, 0);

  // Connected node IDs for high-tech dimming/focusing
  const activeFocusId = hoveredNodeId || selectedNodeId;
  const connectedNodeIds = new Set<string>([activeFocusId]);
  cluster.edges.forEach((edge) => {
    if (edge.source === activeFocusId) connectedNodeIds.add(edge.target);
    if (edge.target === activeFocusId) connectedNodeIds.add(edge.source);
  });

  return (
    <div className="bg-[#090D16] text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden font-sans">
      {/* Top Cyber Defense Command Bar */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-gradient-to-r from-[#0C1222] via-[#090D16] to-[#0A0E1A] flex flex-wrap items-center justify-between gap-3">
        {/* Title & Live Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Network className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>MuleVision™ Graph Attention Engine</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  GAT v2.4
                </span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                <span>{cluster.name} (Risk {cluster.riskScore}/100)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              12 Nodes · 12 Flow Vectors · BDT 1.28M Laundering Ring
            </p>
          </div>
        </div>

        {/* Node Quick Switcher Toolbar */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline mr-1">
            Focus:
          </span>
          {cluster.nodes.slice(0, 7).map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedNodeId(n.id)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                selectedNodeId === n.id
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-white/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {n.id}
            </button>
          ))}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {/* Velocity Pulse Toggle */}
          <button
            onClick={() => setAnimateParticles(!animateParticles)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
              animateParticles
                ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
            title="Toggle Fund Stream Particles"
          >
            <Zap className={`w-3 h-3 ${animateParticles ? 'text-amber-400 fill-amber-400' : ''}`} />
            <span className="hidden md:inline">Flow Pulse</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1 text-slate-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Reset"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[490px]">
        {/* Graph Canvas Visualizer (8 cols) */}
        <div className="lg:col-span-8 p-3 bg-[#060911] relative overflow-hidden flex flex-col justify-between">
          {/* Subtle Coordinate Grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #38BDF8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

          {/* Telemetry HUD Badge at Top Left */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">STATUS:</span>
              <span className="text-white font-bold">CIRCULAR SMURFING IDENTIFIED</span>
            </div>
          </div>

          {/* SVG Graph Component */}
          <div className="w-full h-full flex items-center justify-center min-h-[420px]">
            <svg
              viewBox="0 0 740 450"
              className="w-full h-full max-h-[480px] transition-transform duration-200 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                <marker
                  id="arrow-cyber"
                  markerWidth="8"
                  markerHeight="6"
                  refX="20"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0.5, 7 3, 0 5.5" fill="#38BDF8" />
                </marker>

                <marker
                  id="arrow-circular"
                  markerWidth="8"
                  markerHeight="6"
                  refX="20"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0.5, 7 3, 0 5.5" fill="#F43F5E" />
                </marker>

                <marker
                  id="arrow-dim"
                  markerWidth="7"
                  markerHeight="5"
                  refX="18"
                  refY="2.5"
                  orient="auto"
                >
                  <polygon points="0 0.5, 6 2.5, 0 4.5" fill="#334155" opacity="0.4" />
                </marker>

                <filter id="glow-agg" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Circular Laundering Triangle Hull */}
              {highlightCircular && (
                <path
                  d="M 370 225 L 485 105 L 485 345 Z"
                  fill="rgba(244, 63, 94, 0.08)"
                  stroke="rgba(244, 63, 94, 0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                  className="animate-pulse pointer-events-none"
                />
              )}

              {/* Edge Vectors */}
              {cluster.edges.map((edge) => {
                const srcNode = cluster.nodes.find((n) => n.id === edge.source);
                const tgtNode = cluster.nodes.find((n) => n.id === edge.target);
                if (!srcNode || !tgtNode) return null;

                const src = getNodeCoordinates(srcNode);
                const tgt = getNodeCoordinates(tgtNode);

                const isConnected =
                  activeFocusId === edge.source || activeFocusId === edge.target;

                const strokeColor = edge.isCircular
                  ? '#F43F5E'
                  : isConnected
                  ? '#38BDF8'
                  : '#1E293B';

                const strokeWidth = edge.isCircular ? 2.5 : isConnected ? 2.2 : 1.2;

                // Curved path for W108 -> W302 to prevent collision
                const isCurved = edge.source === 'W108' && edge.target === 'W302';
                const pathD = isCurved
                  ? `M ${src.x} ${src.y} Q 410 320 ${tgt.x} ${tgt.y}`
                  : `M ${src.x} ${src.y} L ${tgt.x} ${tgt.y}`;

                const labelX = isCurved ? 430 : (src.x + tgt.x) / 2;
                const labelY = isCurved ? 285 : (src.y + tgt.y) / 2;

                return (
                  <g key={edge.id} className="transition-opacity duration-200">
                    {/* Background glow stroke if active */}
                    {(edge.isCircular || isConnected) && (
                      <path
                        d={pathD}
                        fill="none"
                        stroke={edge.isCircular ? 'rgba(244, 63, 94, 0.25)' : 'rgba(56, 189, 248, 0.25)'}
                        strokeWidth={strokeWidth + 4}
                        strokeLinecap="round"
                        className="pointer-events-none"
                      />
                    )}

                    {/* Edge Main Line */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={edge.isCircular ? '4 3' : undefined}
                      markerEnd={
                        edge.isCircular
                          ? 'url(#arrow-circular)'
                          : isConnected
                          ? 'url(#arrow-cyber)'
                          : 'url(#arrow-dim)'
                      }
                      opacity={isConnected || edge.isCircular ? 1 : 0.35}
                      className="pointer-events-none"
                    />

                    {/* Animated Flow Particles */}
                    {animateParticles && (edge.isCircular || isConnected) && (
                      <circle
                        r="3"
                        fill={edge.isCircular ? '#FB7185' : '#38BDF8'}
                        className="pointer-events-none filter drop-shadow"
                      >
                        <animateMotion
                          path={pathD}
                          dur={edge.isCircular ? '1.8s' : '2.2s'}
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Edge Amount Badge */}
                    <g transform={`translate(${labelX}, ${labelY})`} className="pointer-events-none">
                      <rect
                        x="-28"
                        y="-8"
                        width="56"
                        height="16"
                        rx="8"
                        fill="#0A0E17"
                        stroke={edge.isCircular ? '#F43F5E' : isConnected ? '#38BDF8' : '#334155'}
                        strokeWidth="1"
                        opacity="0.95"
                      />
                      <text
                        x="0"
                        y="3.5"
                        fill={edge.isCircular ? '#FDA4AF' : isConnected ? '#BAE6FD' : '#94A3B8'}
                        fontSize="8.5"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        ৳{(edge.amount / 1000).toFixed(0)}k ({edge.velocityMinutes}m)
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Node Groups */}
              {filteredNodes.map((node) => {
                const pos = getNodeCoordinates(node);
                const isSelected = node.id === selectedNodeId;
                const isAggregator = node.role === 'AGGREGATOR';
                const isHovered = node.id === hoveredNodeId;
                const isFocused = connectedNodeIds.has(node.id);
                const color = getNodeColor(node.role, node.status);

                return (
                  <g
                    key={node.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNodeId(node.id);
                    }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className="cursor-pointer"
                    style={{ opacity: isFocused ? 1 : 0.35 }}
                  >
                    {/* Large Invisible Hit Target for Flawless Clickability */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="35"
                      fill="transparent"
                      className="cursor-pointer"
                    />

                    {/* Aggregator Threat Radar Pulse */}
                    {isAggregator && (
                      <>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="32"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="1.5"
                          opacity="0.3"
                          className="animate-ping pointer-events-none"
                        />
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="26"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="1.2"
                          strokeDasharray="4 3"
                          opacity="0.7"
                          className="pointer-events-none"
                        />
                      </>
                    )}

                    {/* Selected Node Ring Halo */}
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isAggregator ? 25 : 19}
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="2.5"
                        className="pointer-events-none"
                      />
                    )}

                    {/* Node Core Body */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isAggregator ? 19 : 14}
                      fill={color.fill}
                      stroke={isSelected ? '#FFFFFF' : isHovered ? '#38BDF8' : color.stroke}
                      strokeWidth={isSelected ? 3 : 1.8}
                      filter={isAggregator ? 'url(#glow-agg)' : undefined}
                      className="transition-transform duration-150"
                    />

                    {/* Inner Role Icon */}
                    {isAggregator ? (
                      <text
                        x={pos.x}
                        y={pos.y + 4}
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="black"
                        textAnchor="middle"
                        className="select-none pointer-events-none"
                      >
                        ⚡
                      </text>
                    ) : node.role === 'CASH_OUT_AGENT' ? (
                      <text
                        x={pos.x}
                        y={pos.y + 3.5}
                        fill="#FFFFFF"
                        fontSize="8.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="select-none pointer-events-none font-mono"
                      >
                        ATM
                      </text>
                    ) : null}

                    {/* Node Identifier Label (Clickable Pill) */}
                    <g transform={`translate(${pos.x}, ${pos.y + (isAggregator ? 28 : 23)})`}>
                      <rect
                        x="-24"
                        y="-7.5"
                        width="48"
                        height="15"
                        rx="7.5"
                        fill="#030712"
                        stroke={isSelected ? '#38BDF8' : '#1E293B'}
                        strokeWidth="1"
                        opacity="0.95"
                      />
                      <text
                        x="0"
                        y="3"
                        fill={isSelected ? '#38BDF8' : '#CBD5E1'}
                        fontSize="9.5"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        textAnchor="middle"
                        className="select-none pointer-events-none"
                      >
                        {node.id}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Floating Legend HUD */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl">
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-300">
              <span className="font-bold uppercase text-[9px] tracking-wider text-slate-400">
                Nodes:
              </span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Central Aggregator (W302)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Layer 1 Mule</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>Circular Relay</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span>Cash-Out Agent</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Inflow Source</span>
              </div>
            </div>

            <button
              onClick={() => setHighlightCircular(!highlightCircular)}
              className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                highlightCircular
                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Wash Cycle {highlightCircular ? 'Active' : 'Off'}
            </button>
          </div>
        </div>

        {/* Entity Intelligence Dossier & Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 p-4 bg-[#0D1322] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Dossier Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400">
                  ENTITY DOSSIER: #{selectedNode.id}
                </span>
              </div>
              <span
                className={`text-[9.5px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                  selectedNode.status === 'FROZEN'
                    ? 'bg-slate-800 text-slate-300 border-slate-700'
                    : selectedNode.riskScore >= 80
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {selectedNode.status === 'FROZEN' ? 'QUARANTINED' : 'FLAGGED THREAT'}
              </span>
            </div>

            {/* Suspect Title & Identification */}
            <div>
              <div className="flex items-baseline justify-between">
                <h4 className="text-base font-black text-white tracking-tight">{selectedNode.label}</h4>
                <span className="text-[11px] font-mono text-slate-400">{selectedNode.degree} Edges</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {selectedNode.role.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Cluster: Net #17</span>
              </div>
            </div>

            {/* Dossier Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-1">
              {[
                { id: 'OVERVIEW', label: 'Threat Metrics' },
                { id: 'FLOWS', label: 'In / Outflow' },
                { id: 'SIGNATURES', label: 'Signatures' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveInspectorTab(tab.id as any)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    activeInspectorTab === tab.id
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Threat Metrics */}
            {activeInspectorTab === 'OVERVIEW' && (
              <div className="space-y-2.5 animate-in fade-in">
                {/* Composite Risk Gauge Card */}
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                      Neural Graph Risk Score
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black font-mono text-rose-500">
                        {selectedNode.riskScore}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">/ 100</span>
                    </div>
                    <span className="text-[10px] text-rose-400 font-semibold block mt-0.5">
                      GAT Attention: {(selectedNode.riskScore / 100).toFixed(2)}
                    </span>
                  </div>

                  {/* Circular visual progress */}
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-12 h-12 -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="#1E293B"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="#EF4444"
                        strokeWidth="4"
                        strokeDasharray="125"
                        strokeDashoffset={125 - (125 * selectedNode.riskScore) / 100}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-mono font-bold text-white">
                      {selectedNode.riskScore}%
                    </span>
                  </div>
                </div>

                {/* Metric Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Current Float</span>
                    <span className="text-sm font-bold font-mono text-white mt-0.5 block">
                      ৳{selectedNode.balance.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-amber-400">Smurf Wallet</span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Dispersion Velocity</span>
                    <span className="text-sm font-bold font-mono text-white mt-0.5 block">
                      {selectedNode.id === 'W302' ? '12 min avg' : '4-5 mins'}
                    </span>
                    <span className="text-[9px] text-rose-400">High Speed Fan-out</span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Network Cluster</span>
                    <span className="text-sm font-bold font-mono text-indigo-400 mt-0.5 block">
                      Net #17
                    </span>
                    <span className="text-[9px] text-slate-500">Patuakhali Coastal</span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Degree Centrality</span>
                    <span className="text-sm font-bold font-mono text-rose-400 mt-0.5 block">
                      {selectedNode.degree} Edges
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {selectedNode.degree > 4 ? 'Central Hub' : 'Relay Hop'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Flow Ledger */}
            {activeInspectorTab === 'FLOWS' && (
              <div className="space-y-2 animate-in fade-in">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg">
                    <span className="text-[9px] text-emerald-400 block font-bold">TOTAL INFLOW</span>
                    <span className="text-xs font-mono font-bold text-white mt-0.5 block">
                      ৳{totalInflow > 0 ? totalInflow.toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-rose-950/20 border border-rose-500/30 rounded-lg">
                    <span className="text-[9px] text-rose-400 block font-bold">TOTAL OUTFLOW</span>
                    <span className="text-xs font-mono font-bold text-white mt-0.5 block">
                      ৳{totalOutflow > 0 ? totalOutflow.toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {inEdges.map((e) => (
                    <div
                      key={e.id}
                      className="p-1.5 bg-slate-900 rounded border border-slate-800 text-[10px] flex justify-between items-center"
                    >
                      <div>
                        <span className="text-emerald-400 font-bold">IN:</span> {e.source} → {selectedNode.id}
                      </div>
                      <span className="font-mono font-bold text-white">৳{e.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  {outEdges.map((e) => (
                    <div
                      key={e.id}
                      className="p-1.5 bg-slate-900 rounded border border-slate-800 text-[10px] flex justify-between items-center"
                    >
                      <div>
                        <span className="text-rose-400 font-bold">OUT:</span> {selectedNode.id} → {e.target}
                      </div>
                      <span className="font-mono font-bold text-white">৳{e.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  {inEdges.length === 0 && outEdges.length === 0 && (
                    <div className="p-3 text-center text-slate-500 text-xs">
                      No direct flows connected for this node in current batch.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Signatures */}
            {activeInspectorTab === 'SIGNATURES' && (
              <div className="space-y-1.5 max-h-48 overflow-y-auto animate-in fade-in">
                {cluster.indicators.map((ind, i) => (
                  <div
                    key={i}
                    className="p-2 bg-slate-900/90 rounded-lg border border-slate-800 text-[10px] text-slate-300 flex items-start gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1"></span>
                    <span className="leading-snug">{ind}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Button at Bottom */}
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
            {selectedNode.status === 'FROZEN' ? (
              <div className="flex items-center justify-center gap-2 p-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Wallet Flow Quarantined & Locked</span>
              </div>
            ) : (
              <button
                onClick={() => onFreezeWallet(selectedNode.id, selectedNode.label)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-rose-500/50"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Freeze {selectedNode.id} & Quarantine Ring</span>
              </button>
            )}

            <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 font-mono">
              <span>BFIU Dossier: #STR-2026-904</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Audit Sealed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
