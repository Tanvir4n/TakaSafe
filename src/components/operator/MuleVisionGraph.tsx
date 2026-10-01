import React, { useState } from 'react';
import { MuleCluster, MuleNode } from '../../types';
import { Network, AlertTriangle, ShieldAlert, CheckCircle, RefreshCw, ZoomIn, ZoomOut, Lock } from 'lucide-react';

interface MuleVisionGraphProps {
  cluster: MuleCluster;
  onFreezeWallet: (walletId: string, label: string) => void;
}

export const MuleVisionGraph: React.FC<MuleVisionGraphProps> = ({ cluster, onFreezeWallet }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('W302');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const selectedNode = cluster.nodes.find((n) => n.id === selectedNodeId) || cluster.nodes[0];

  const getNodeColor = (role: MuleNode['role'], status: MuleNode['status']) => {
    if (status === 'FROZEN') return '#475569';
    switch (role) {
      case 'AGGREGATOR':
        return '#DC2626'; // Red
      case 'MULE_LAYER_1':
        return '#D97706'; // Amber
      case 'MULE_LAYER_2':
        return '#9333EA'; // Purple
      case 'CASH_OUT_AGENT':
        return '#0284C7'; // Sky/Blue
      case 'VICTIM':
        return '#16A34A'; // Green
      default:
        return '#64748B';
    }
  };

  const filteredNodes = cluster.nodes.filter((node) => {
    if (filterRole === 'ALL') return true;
    return node.role === filterRole;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header and Controls */}
      <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              MuleVision: Transaction-Graph Analysis
            </h3>
            <span className="text-xs bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded-full">
              {cluster.name} (Critical Risk {cluster.riskScore}/100)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Uncovering connected money-mule rings, circular wash flows, and aggregator hubs across MFS nodes.
          </p>
        </div>

        {/* Filter & Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 text-xs">
            {['ALL', 'AGGREGATOR', 'MULE_LAYER_1', 'CASH_OUT_AGENT', 'VICTIM'].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  filterRole === role
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {role === 'ALL' ? 'All Roles' : role.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[460px]">
        {/* Interactive SVG Graph Area */}
        <div className="lg:col-span-3 p-4 bg-slate-950 relative overflow-hidden flex items-center justify-center">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <svg
            viewBox="0 0 740 460"
            className="w-full h-full max-h-[500px] transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="18"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#94A3B8" />
              </marker>
              <marker
                id="arrowhead-circular"
                markerWidth="8"
                markerHeight="6"
                refX="18"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#F43F5E" />
              </marker>
            </defs>

            {/* Edges (Transaction flows) */}
            {cluster.edges.map((edge) => {
              const src = cluster.nodes.find((n) => n.id === edge.source);
              const tgt = cluster.nodes.find((n) => n.id === edge.target);
              if (!src || !tgt) return null;

              const isConnectedToSelected =
                src.id === selectedNodeId || tgt.id === selectedNodeId;

              return (
                <g key={edge.id} className="transition-opacity">
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={
                      edge.isCircular
                        ? '#F43F5E'
                        : isConnectedToSelected
                        ? '#38BDF8'
                        : '#475569'
                    }
                    strokeWidth={edge.isCircular ? 2.5 : isConnectedToSelected ? 2 : 1.2}
                    strokeDasharray={edge.isCircular ? '4,4' : undefined}
                    markerEnd={edge.isCircular ? 'url(#arrowhead-circular)' : 'url(#arrowhead)'}
                    opacity={isConnectedToSelected || edge.isCircular ? 0.95 : 0.4}
                  />
                  {/* Edge amount label on hover or if circular */}
                  {(edge.isCircular || isConnectedToSelected) && (
                    <text
                      x={(src.x + tgt.x) / 2}
                      y={(src.y + tgt.y) / 2 - 6}
                      fill={edge.isCircular ? '#FDA4AF' : '#E2E8F0'}
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      textAnchor="middle"
                      className="select-none pointer-events-none"
                    >
                      ৳{(edge.amount / 1000).toFixed(0)}k ({edge.velocityMinutes}m)
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isAggregator = node.role === 'AGGREGATOR';
              const color = getNodeColor(node.role, node.status);

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer transition-transform duration-150 hover:scale-110"
                >
                  {/* Pulsing ring for high risk central aggregator */}
                  {isAggregator && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="26"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Selected halo */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="24"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Node Body */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isAggregator ? 18 : 13}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="shadow-lg"
                  />

                  {/* Node Label Text */}
                  <text
                    x={node.x}
                    y={node.y + 24}
                    fill={isSelected ? '#38BDF8' : '#CBD5E1'}
                    fontSize="10"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                    className="select-none pointer-events-none drop-shadow"
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Graph Legend Overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm border border-slate-800 p-2.5 rounded-xl text-[10px] text-slate-300 space-y-1">
            <div className="font-bold text-white mb-1">Node Legend</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span>Central Aggregator (W302)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Layer 1 Mule</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <span>Circular Relay Mule</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              <span>Cash-Out Agent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Unwitting Victim</span>
            </div>
          </div>
        </div>

        {/* Node Detail & Case Inspector Panel */}
        <div className="p-5 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Entity Inspector
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedNode.status === 'FROZEN'
                    ? 'bg-slate-200 text-slate-700'
                    : selectedNode.riskScore > 80
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {selectedNode.status}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-base font-bold text-slate-900">{selectedNode.label}</h4>
              <p className="text-xs text-slate-500">
                Network Role: <span className="font-semibold text-slate-800">{selectedNode.role.replace(/_/g, ' ')}</span>
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                <span className="text-[10px] text-slate-500 block">Risk Score</span>
                <span className="text-lg font-bold font-mono text-rose-600">
                  {selectedNode.riskScore}/100
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                <span className="text-[10px] text-slate-500 block">Current Float</span>
                <span className="text-sm font-bold font-mono text-slate-800">
                  ৳{selectedNode.balance.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                <span className="text-[10px] text-slate-500 block">Graph Degree</span>
                <span className="text-sm font-bold font-mono text-slate-800">
                  {selectedNode.degree} Edges
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                <span className="text-[10px] text-slate-500 block">Cluster ID</span>
                <span className="text-xs font-bold text-slate-800">Net #17</span>
              </div>
            </div>

            {/* Graph Indicators */}
            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-700 block mb-2">
                Network Signatures:
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                {cluster.indicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500 shrink-0 mt-0.5 font-bold">•</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            {selectedNode.status === 'FROZEN' ? (
              <div className="flex items-center justify-center gap-2 p-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold">
                <Lock className="w-4 h-4" />
                <span>Wallet Flow Frozen by Operator</span>
              </div>
            ) : (
              <button
                onClick={() => onFreezeWallet(selectedNode.id, selectedNode.label)}
                className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Freeze {selectedNode.id} & Quarantine Ring</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
