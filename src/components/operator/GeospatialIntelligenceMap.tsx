import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RegionalRiskMetric, AgentLiquidityNode } from '../../types';
import {
  Globe,
  MapPin,
  ShieldAlert,
  Wind,
  CloudRain,
  Radio,
  Layers,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  AlertTriangle,
  Send,
  Sliders,
  Activity,
  CheckCircle,
  TrendingUp,
  Crosshair,
  Compass,
} from 'lucide-react';

interface GeospatialIntelligenceMapProps {
  regionalMetrics: RegionalRiskMetric[];
  agents: AgentLiquidityNode[];
  onActivateMonitoring: (division: string) => void;
  onDispatchLiquidity: (agentId: string, agentName: string, amount: number) => void;
  lang: 'EN' | 'BN';
}

// Accurate GeoJSON specifications for the 8 Divisions of Bangladesh
const BANGLADESH_DIVISIONS_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Rangpur', id: 'DIV-RANG' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [88.35, 25.40],
            [88.20, 26.15],
            [88.55, 26.35],
            [89.05, 26.60],
            [89.45, 26.30],
            [89.70, 25.85],
            [89.60, 25.25],
            [89.15, 25.10],
            [88.55, 25.15],
            [88.35, 25.40],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Rajshahi', id: 'DIV-RAJ' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [88.10, 24.65],
            [88.35, 25.20],
            [88.95, 25.15],
            [89.50, 25.20],
            [89.75, 24.85],
            [89.60, 24.20],
            [89.25, 23.90],
            [88.60, 24.10],
            [88.10, 24.65],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Mymensingh', id: 'DIV-MYM' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [89.60, 25.25],
            [89.85, 25.30],
            [90.45, 25.25],
            [90.80, 25.15],
            [90.95, 24.70],
            [90.70, 24.25],
            [90.20, 24.20],
            [89.70, 24.65],
            [89.60, 25.25],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Sylhet', id: 'DIV-SYL' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [90.95, 25.15],
            [91.60, 25.25],
            [92.40, 25.10],
            [92.50, 24.75],
            [92.20, 24.15],
            [91.65, 23.95],
            [91.20, 24.20],
            [90.95, 24.70],
            [90.95, 25.15],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Dhaka', id: 'DIV-DHA' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [89.60, 24.20],
            [90.20, 24.20],
            [90.70, 24.25],
            [90.95, 24.10],
            [90.80, 23.50],
            [90.45, 23.20],
            [89.90, 23.25],
            [89.50, 23.70],
            [89.60, 24.20],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Khulna', id: 'DIV-KHU' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [88.65, 23.90],
            [89.20, 23.85],
            [89.50, 23.50],
            [89.85, 23.00],
            [89.85, 21.80],
            [89.25, 21.65],
            [88.95, 22.00],
            [88.60, 22.75],
            [88.65, 23.90],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Barishal', id: 'DIV-BAR' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [89.85, 23.00],
            [90.45, 23.10],
            [90.85, 22.85],
            [90.80, 21.85],
            [90.35, 21.80],
            [89.85, 21.80],
            [89.85, 23.00],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Chittagong', id: 'DIV-CTG' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [90.80, 23.80],
            [91.35, 23.90],
            [91.95, 23.75],
            [92.35, 23.50],
            [92.65, 22.40],
            [92.35, 21.20],
            [92.15, 20.60],
            [91.75, 21.60],
            [91.25, 22.50],
            [90.65, 22.80],
            [90.80, 23.80],
          ],
        ],
      },
    },
  ],
};

export const GeospatialIntelligenceMap: React.FC<GeospatialIntelligenceMapProps> = ({
  regionalMetrics,
  agents,
  onActivateMonitoring,
  onDispatchLiquidity,
  lang,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedDivision, setSelectedDivision] = useState<string>('Barishal');
  const [selectedAgent, setSelectedAgent] = useState<AgentLiquidityNode | null>(agents[0] || null);
  const [layerChoropleth, setLayerChoropleth] = useState<boolean>(true);
  const [layerHeatBlobs, setLayerHeatBlobs] = useState<boolean>(true);
  const [layerAgents, setLayerAgents] = useState<boolean>(true);
  const [layerDisruption, setLayerDisruption] = useState<boolean>(true);
  const [hoveredEntity, setHoveredEntity] = useState<{ name: string; score: number; type: string } | null>(null);

  const selectedMetric = regionalMetrics.find((m) => m.division === selectedDivision) || regionalMetrics[0];

  // D3 Color Interpolation Scale for Risk (0 = Safe Emerald, 50 = Warning Amber, 100 = Crimson Threat)
  const getRiskColor = (score: number) => {
    const interpolator = d3.scaleLinear<string>()
      .domain([0, 25, 50, 75, 100])
      .range(['#10B981', '#0EA5E9', '#F59E0B', '#EF4444', '#991B1B']);
    return interpolator(score);
  };

  // Setup D3 Projection
  const width = 640;
  const height = 620;

  const projection = d3
    .geoMercator()
    .center([90.45, 23.75])
    .scale(4200)
    .translate([width / 2 - 10, height / 2 + 10]);

  const pathGenerator = d3.geoPath().projection(projection);

  // D3 interactive rendering effect
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 3.5])
      .on('zoom', (event) => {
        svg.select('.map-zoom-group').attr('transform', event.transform);
      });

    svg.call(zoom);
  }, []);

  return (
    <div className="bg-[#090D16] text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden font-sans">
      {/* Top Header Command Bar */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-gradient-to-r from-[#0C1222] via-[#090D16] to-[#0A0E1A] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Globe className="w-5 h-5 animate-spin" style={{ animationDuration: '30s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>D3 Geospatial Heatmap & Vulnerability Radar</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  D3.js v7 Core
                </span>
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                <span>Barishal Surge Detected (87/100)</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              National division risk density contours, coastal cyclone liquidity stress, and real-time agent float depletion
            </p>
          </div>
        </div>

        {/* Layer Visibility Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLayerHeatBlobs(!layerHeatBlobs)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              layerHeatBlobs
                ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Heat Blobs</span>
          </button>

          <button
            onClick={() => setLayerAgents(!layerAgents)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              layerAgents
                ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Agent Nodes</span>
          </button>

          <button
            onClick={() => setLayerDisruption(!layerDisruption)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              layerDisruption
                ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Climate Vector</span>
          </button>
        </div>
      </div>

      {/* Main Grid: D3 Map (7 cols) + Regional Dossier (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Side: Interactive D3 Geographic Heatmap */}
        <div className="lg:col-span-7 p-4 bg-[#050811] relative overflow-hidden flex items-center justify-center select-none">
          {/* Subtle Grid Backdrop */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #38BDF8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Compass Rose */}
          <div className="absolute top-4 right-4 z-10 p-2 bg-slate-900/80 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 flex flex-col items-center">
            <Compass className="w-5 h-5 text-indigo-400 mb-0.5" />
            <span>N</span>
          </div>

          {/* Hover Tooltip Overlay */}
          {hoveredEntity && (
            <div className="absolute bottom-4 left-4 z-20 bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700 shadow-2xl text-xs pointer-events-none">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">{hoveredEntity.type}</span>
              <div className="flex items-center justify-between gap-3 mt-0.5">
                <span className="font-bold text-white">{hoveredEntity.name}</span>
                <span className="font-mono font-bold text-rose-400">Risk {hoveredEntity.score}/100</span>
              </div>
            </div>
          )}

          {/* D3 SVG Canvas */}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[580px] transition-transform duration-150 cursor-grab active:cursor-grabbing"
          >
            <defs>
              {/* Radial Heat Gradient for Barishal Cyclone Zone */}
              <radialGradient id="heat-barishal" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
              </radialGradient>

              {/* Radial Heat Gradient for Sylhet Flood Zone */}
              <radialGradient id="heat-sylhet" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#0EA5E9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
              </radialGradient>

              {/* Pulse Marker Filter */}
              <filter id="glow-marker" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* D3 Map Zoom Group */}
            <g className="map-zoom-group">
              {/* 1. Regional Division Choropleth Polygons */}
              {BANGLADESH_DIVISIONS_GEOJSON.features.map((feature: any) => {
                const divName = feature.properties.name;
                const metric = regionalMetrics.find((m) => m.division === divName) || {
                  riskScore: 20,
                  status: 'STABLE',
                };
                const isSelected = selectedDivision === divName;
                const fillColor = getRiskColor(metric.riskScore);
                const pathD = pathGenerator(feature as any) || '';

                return (
                  <path
                    key={feature.properties.id}
                    d={pathD}
                    fill={layerChoropleth ? fillColor : '#1E293B'}
                    fillOpacity={isSelected ? 0.85 : 0.45}
                    stroke={isSelected ? '#FFFFFF' : '#334155'}
                    strokeWidth={isSelected ? 2.5 : 1.2}
                    className="transition-all duration-200 cursor-pointer hover:fill-opacity-95"
                    onClick={() => {
                      setSelectedDivision(divName);
                    }}
                    onMouseEnter={() =>
                      setHoveredEntity({ name: `${divName} Division`, score: metric.riskScore, type: 'MFS Administrative Region' })
                    }
                    onMouseLeave={() => setHoveredEntity(null)}
                  />
                );
              })}

              {/* 2. D3 Radial Heatmap Blobs Overlay */}
              {layerHeatBlobs && (
                <g className="pointer-events-none">
                  {/* Barishal Cyclone High-Risk Thermal Contours */}
                  {(() => {
                    const coords = projection([90.35, 22.45]);
                    if (!coords) return null;
                    return (
                      <>
                        <circle
                          cx={coords[0]}
                          cy={coords[1]}
                          r="85"
                          fill="url(#heat-barishal)"
                          className="animate-pulse"
                        />
                        <circle
                          cx={coords[0]}
                          cy={coords[1]}
                          r="55"
                          fill="rgba(239, 68, 68, 0.4)"
                          filter="url(#glow-marker)"
                        />
                      </>
                    );
                  })()}

                  {/* Sylhet Flood Risk Thermal Contours */}
                  {(() => {
                    const coords = projection([91.85, 24.6]);
                    if (!coords) return null;
                    return (
                      <circle
                        cx={coords[0]}
                        cy={coords[1]}
                        r="60"
                        fill="url(#heat-sylhet)"
                      />
                    );
                  })()}
                </g>
              )}

              {/* 3. Climate Disruption Vector Arrows (Cyclone Wind Flow) */}
              {layerDisruption && (
                <g className="pointer-events-none">
                  {/* Curved Cyclone Arc from Bay of Bengal into Barishal */}
                  <path
                    d="M 320 580 Q 300 480 330 420"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                  <path
                    d="M 370 590 Q 350 490 355 435"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />
                  <text
                    x="240"
                    y="520"
                    fill="#FDE68A"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="select-none"
                  >
                    CYCLONE SURGE VECTOR (45 km/h)
                  </text>
                </g>
              )}

              {/* 4. Division Text Labels */}
              {BANGLADESH_DIVISIONS_GEOJSON.features.map((feature: any) => {
                const divName = feature.properties.name;
                const metric = regionalMetrics.find((m) => m.division === divName);
                const bounds = pathGenerator.bounds(feature as any);
                const x = (bounds[0][0] + bounds[1][0]) / 2;
                const y = (bounds[0][1] + bounds[1][1]) / 2;

                return (
                  <g key={`lbl-${divName}`} transform={`translate(${x}, ${y})`} className="pointer-events-none">
                    <text
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="bold"
                      className="drop-shadow"
                    >
                      {divName}
                    </text>
                    {metric && (
                      <text
                        y="11"
                        textAnchor="middle"
                        fill={metric.riskScore > 60 ? '#FCA5A5' : '#CBD5E1'}
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight="semibold"
                      >
                        {metric.riskScore}/100
                      </text>
                    )}
                  </g>
                );
              })}

              {/* 5. Agent Liquidity Nodes Plotted by Coordinates */}
              {layerAgents &&
                agents.map((agent) => {
                  const coords = projection([agent.lng, agent.lat]);
                  if (!coords) return null;
                  const [cx, cy] = coords;
                  const isSelected = selectedAgent?.id === agent.id;
                  const isDepleted = agent.riskStatus === 'CRITICAL_DEPLETION';

                  return (
                    <g
                      key={agent.id}
                      transform={`translate(${cx}, ${cy})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAgent(agent);
                        setSelectedDivision(agent.division);
                      }}
                      onMouseEnter={() =>
                        setHoveredEntity({ name: agent.name, score: agent.riskStatus === 'CRITICAL_DEPLETION' ? 88 : 45, type: 'Agent Liquidity Node' })
                      }
                      onMouseLeave={() => setHoveredEntity(null)}
                      className="cursor-pointer"
                    >
                      {/* Pulse ring for critical depletion */}
                      {isDepleted && (
                        <circle
                          r="12"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="1.5"
                          opacity="0.6"
                          className="animate-ping"
                        />
                      )}

                      <circle
                        r={isSelected ? 7 : 5}
                        fill={isDepleted ? '#EF4444' : agent.riskStatus === 'AT_RISK' ? '#F59E0B' : '#10B981'}
                        stroke="#FFFFFF"
                        strokeWidth={isSelected ? 2.5 : 1.2}
                        filter="url(#glow-marker)"
                      />
                    </g>
                  );
                })}
            </g>
          </svg>

          {/* Map Color Legend */}
          <div className="absolute bottom-3 right-3 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[10px] text-slate-300">
            <span className="font-bold text-white block mb-1">Risk Intensity</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-slate-400">0 Safe</span>
              <div className="w-24 h-2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600" />
              <span className="text-[9px] text-rose-400">100 High</span>
            </div>
          </div>
        </div>

        {/* Right Side: Regional Dossier & Agent Dispatch Cockpit (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-[#0D1322] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Division Header Dossier */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                  GEOSPATIAL SECTOR: {selectedDivision.toUpperCase()}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                  selectedMetric.status === 'EMERGING_RISK' || selectedMetric.status === 'CRITICAL_EMERGENCY'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : selectedMetric.status === 'ELEVATED'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {selectedMetric.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Division Metric Overview */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Regional Risk Index
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black font-mono text-rose-500">
                    {selectedMetric.riskScore}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">/ 100</span>
                </div>
                <span className="text-[11px] text-amber-300 font-semibold block mt-1 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-amber-400" />
                  <span>Climate Event: {selectedMetric.activeDisruption}</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">DEPLETED AGENTS</span>
                <span className="text-2xl font-black font-mono text-white mt-0.5 block">
                  {selectedMetric.vulnerableAgentsCount} Nodes
                </span>
                <span className="text-[10px] text-rose-400 font-bold block mt-0.5">
                  Surge +{selectedMetric.cashOutSurgeDelta}%
                </span>
              </div>
            </div>

            {/* Delinquency & Threat Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Fraud Signal Delta</span>
                <span className="text-sm font-bold font-mono text-rose-400 mt-0.5 block">
                  +{selectedMetric.fraudSignalDelta}%
                </span>
                <span className="text-[10px] text-slate-500">Above 30-day baseline</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Liquidity Drain Delta</span>
                <span className="text-sm font-bold font-mono text-amber-400 mt-0.5 block">
                  {selectedMetric.liquidityDrainDelta}%
                </span>
                <span className="text-[10px] text-slate-500">High Outflow Drain</span>
              </div>
            </div>

            {/* Focused Agent Dossier */}
            {selectedAgent && (
              <div className="p-3 bg-slate-900/90 rounded-2xl border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-white text-xs">{selectedAgent.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {selectedAgent.riskStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[9px] text-slate-400 block">Current Cash</span>
                    <span className="font-mono font-bold text-white text-xs">
                      ৳{(selectedAgent.currentCashFloat / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Demand Surge</span>
                    <span className="font-mono font-bold text-amber-400 text-xs">
                      +{selectedAgent.forecastedDemandSurge}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Runway</span>
                    <span className="font-mono font-bold text-rose-400 text-xs">
                      {selectedAgent.liquidityRunwayHours}h
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onDispatchLiquidity(selectedAgent.id, selectedAgent.name, selectedAgent.shortfallAmount || 200000)
                  }
                  className="w-full mt-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch BDT {(selectedAgent.shortfallAmount || 200000).toLocaleString()} Emergency Float</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Zone at Bottom */}
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => onActivateMonitoring(selectedDivision)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-lg transition-all cursor-pointer border border-rose-500/50"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Activate Level-3 Proactive Surveillance in {selectedDivision}</span>
            </button>

            <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 font-mono">
              <span>BFIU Geofence Protocol: Active</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Live GPS Ingestion
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
