export type RiskBand = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AnomalyFeature {
  name: string;
  contribution: number; // percentage, e.g. 31
  direction: 'RISK_INCREASING' | 'RISK_DECREASING';
  description: string;
  actualValue: string;
  expectedValue: string;
}

export interface Transaction {
  id: string;
  timestamp: string;
  senderWallet: string;
  senderName: string;
  senderLocation: string;
  senderDevice: string;
  receiverWallet: string;
  receiverName: string;
  receiverLocation: string;
  amount: number;
  fee: number;
  channel: 'TakaSafe App' | 'upay App' | 'USSD *268#' | 'Agent Cash-Out' | 'Merchant QR';
  status: 'PENDING' | 'APPROVED' | 'HELD' | 'BLOCKED';
  fusedRiskScore: number; // 0 - 100
  riskBand: RiskBand;
  fraudProb: number; // 0 - 1
  anomalyProb: number; // 0 - 1
  networkRisk: number; // 0 - 1
  velocityRisk: number; // 0 - 1
  deviceRisk: number; // 0 - 1
  isMuleConnected: boolean;
  muleClusterId?: string;
  shapFeatures: AnomalyFeature[];
}

export interface CustomerBaseline {
  wallet: string;
  name: string;
  nationalIdMasked: string;
  balance: number;
  avgDailyTxns: number;
  avgAmount: number;
  maxAmountTypical: number;
  usualHours: string;
  homeDistrict: string;
  knownDevices: string[];
  frequentRecipients: string[];
  financialResilienceScore: number; // 0 - 100
  resilienceComponents: {
    incomeStability: number;
    spendingDiscipline: number;
    emergencyBufferDays: number;
    cashOutDependency: number;
  };
}

export interface MuleNode {
  id: string;
  label: string;
  role: 'VICTIM' | 'MULE_LAYER_1' | 'MULE_LAYER_2' | 'AGGREGATOR' | 'CASH_OUT_AGENT';
  balance: number;
  degree: number;
  riskScore: number;
  status: 'ACTIVE' | 'FLAGGED' | 'FROZEN';
  x: number;
  y: number;
}

export interface MuleEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
  timestamp: string;
  isCircular: boolean;
  velocityMinutes: number;
}

export interface MuleCluster {
  id: string;
  name: string;
  centralNode: string;
  totalNodes: number;
  totalEdges: number;
  totalFlowBDT: number;
  riskScore: number;
  indicators: string[];
  nodes: MuleNode[];
  edges: MuleEdge[];
}

export interface AgentLiquidityNode {
  id: string;
  name: string;
  phone: string;
  district: string;
  division: string;
  lat: number;
  lng: number;
  currentCashFloat: number;
  currentDigitalFloat: number;
  normalDailyCashOut: number;
  forecastedDemandSurge: number; // percentage
  forecastedCashOut: number;
  shortfallAmount: number;
  liquidityRunwayHours: number;
  riskStatus: 'ADEQUATE' | 'AT_RISK' | 'CRITICAL_DEPLETION';
  recommendedIntervention: 'MONITOR' | 'PRIORITY_MONITORING' | 'LIQUIDITY_FLOAT_DISPATCH' | 'ENHANCED_FRAUD_MONITORING';
}

export interface RegionalRiskMetric {
  division: string;
  riskScore: number; // 0 - 100
  fraudSignalDelta: number; // percentage, e.g. +31%
  scamSignalDelta: number; // +24%
  liquidityDrainDelta: number; // -22%
  networkAnomalyDelta: number; // +17%
  cashOutSurgeDelta: number; // +28%
  activeDisruption: 'NONE' | 'CYCLONE' | 'FLASH_FLOOD' | 'TELECOM_OUTAGE';
  vulnerableAgentsCount: number;
  status: 'STABLE' | 'ELEVATED' | 'EMERGING_RISK' | 'CRITICAL_EMERGENCY';
}

export interface StorylineStep {
  time: string;
  title: string;
  event: string;
  takaSafeResponse: string;
  moduleHighlight: 'OVERVIEW' | 'SCAMSHIELD' | 'MULEVISION' | 'RADAR' | 'RESILIENCE' | 'INVESTIGATION';
  activeScenarioData?: any;
}
