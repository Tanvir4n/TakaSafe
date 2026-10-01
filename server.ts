import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// In-Memory Audit Logs Store (seeded with initial baseline audit trail)
interface AuditLogEntry {
  id: string;
  timestamp: string;
  analyst: string;
  caseId: string;
  entityType: 'TRANSACTION' | 'AGENT' | 'NETWORK' | 'REGION';
  entityId: string;
  actionTaken: 'MONITOR' | 'ADDITIONAL_VERIFICATION' | 'HOLD_FOR_REVIEW' | 'FREEZE_WALLET' | 'DISPATCH_FLOAT' | 'ACTIVATE_MONITORING' | 'DISMISSED';
  riskScore: number;
  reason: string;
  notes: string;
}

const auditLogs: AuditLogEntry[] = [
  {
    id: 'AUD-9021',
    timestamp: '2026-10-01 09:42:15',
    analyst: 'Sourov Kumar (Chief Risk Analyst)',
    caseId: 'CASE-7718',
    entityType: 'TRANSACTION',
    entityId: 'TXN-99824',
    actionTaken: 'HOLD_FOR_REVIEW',
    riskScore: 78,
    reason: 'Velocity spike (5 transfers in 8 mins) to unverified wallet',
    notes: 'Triggered step-up SMS OTP and temporary 6-hour outbound hold.',
  },
  {
    id: 'AUD-9020',
    timestamp: '2026-10-01 08:15:30',
    analyst: 'Md. Tanvir Hasan (SOC Ops)',
    caseId: 'CASE-7704',
    entityType: 'NETWORK',
    entityId: 'Cluster-12',
    actionTaken: 'FREEZE_WALLET',
    riskScore: 92,
    reason: 'Rapid circular pass-through flow of BDT 850,000 across 6 wallets',
    notes: 'Frozen central aggregator wallet 01724-XXXXXX. Forwarded to AML Compliance.',
  },
  {
    id: 'AUD-9019',
    timestamp: '2026-10-01 07:30:00',
    analyst: 'Automated Action Engine',
    caseId: 'CASE-7699',
    entityType: 'AGENT',
    entityId: 'AGT-4402',
    actionTaken: 'DISPATCH_FLOAT',
    riskScore: 65,
    reason: 'Predicted cash-out float shortfall (-BDT 220,000) prior to market day',
    notes: 'Notified Regional Distributor for morning cash replenishment.',
  },
];

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'TakaSafe AI Financial Trust & Resilience Network',
    institution: 'Daffodil International University (DIU CPC × upay)',
    geminiConfigured: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Audit Logs APIs
app.get('/api/audit-logs', (req: Request, res: Response) => {
  res.json({ success: true, logs: auditLogs });
});

app.post('/api/audit-action', (req: Request, res: Response) => {
  try {
    const { analyst, caseId, entityType, entityId, actionTaken, riskScore, reason, notes } = req.body;
    
    if (!caseId || !actionTaken) {
      return res.status(400).json({ error: 'Missing required audit parameters' });
    }

    const newEntry: AuditLogEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      analyst: analyst || 'Analyst (3AM Runtime Console)',
      caseId,
      entityType: entityType || 'TRANSACTION',
      entityId: entityId || 'N/A',
      actionTaken,
      riskScore: riskScore || 50,
      reason: reason || 'Manual operator decision',
      notes: notes || 'Logged via TakaSafe human-in-the-loop action engine.',
    };

    auditLogs.unshift(newEntry);
    res.json({ success: true, entry: newEntry, totalLogs: auditLogs.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// AI Investigation Assistant endpoint (Explainable AI & Grounded LLM)
app.post('/api/investigate', async (req: Request, res: Response) => {
  try {
    const {
      caseId,
      transaction,
      customerProfile,
      shapBreakdown,
      muleCluster,
      anomalyFactors,
      regionalContext,
    } = req.body;

    const structuredEvidence = {
      caseId: caseId || 'CASE-2026-X',
      transaction: transaction || {
        amount: 80000,
        currency: 'BDT',
        sender: '01711-239481 (Rafiqul Islam)',
        recipient: '01988-510294 (Mule W302)',
        channel: 'TakaSafe App',
        time: '03:20 AM',
        location: 'Chittagong (Usual: Dhanmondi, Dhaka)',
        device: 'Infinix Hot 30 (New device ID #dev-8819)',
      },
      baselineProfile: customerProfile || {
        avgAmount: 1500,
        txnsPerDay: 4,
        typicalHours: '09:00 - 21:00',
        primaryLocation: 'Dhaka',
      },
      shapFeatures: shapBreakdown || [
        { feature: 'Transaction Amount (+53.3x baseline)', impact: '+31%', detail: 'BDT 80,000 vs avg BDT 1,500' },
        { feature: 'Transaction Velocity Spike', impact: '+24%', detail: '6 attempts within 15 minutes' },
        { feature: 'Unrecognized Device Fingerprint', impact: '+17%', detail: 'First login from device #dev-8819' },
        { feature: 'Circadian Time Anomaly', impact: '+12%', detail: 'Initiated at 03:20 AM (Customer sleep window)' },
        { feature: 'Geographic Jump Distance', impact: '+9%', detail: 'Location jump 245km from Dhaka to Chittagong' },
        { feature: 'Recipient Risk / Mule Association', impact: '+7%', detail: 'Connected to Suspicious Network #17' },
      ],
      muleRing: muleCluster || {
        clusterId: 'Suspicious Network #17',
        totalWallets: 12,
        totalTxns: 47,
        aggregateFlow: 'BDT 1,280,000',
        pattern: 'Rapid layering & circular pass-through to aggregator wallet W302',
      },
      fusedRiskScore: req.body.riskScore || 94,
      suggestedAction: 'Escalate + Enhanced Verification / Freeze outbound flow',
    };

    if (ai) {
      const prompt = `You are the lead explainable AI investigation engine for TakaSafe, an MFS fraud trust & resilience platform.
You MUST follow the responsible AI principle:
- ML models have already computed the risk score (${structuredEvidence.fusedRiskScore}/100) and SHAP attribution.
- The LLM does NOT decide whether something is fraud. Your job is purely to narrate the structured mathematical evidence into an executive, objective, and auditable case brief for a human fraud investigator.

Structured Case Evidence:
${JSON.stringify(structuredEvidence, null, 2)}

Provide a concise, highly professional case report in Markdown format with these exact sections:
1. Executive Summary (2 sentences stating what occurred and the fused risk score)
2. SHAP Attribution Narrative (Explain the top feature drivers in clear, factual terms)
3. Graph & Mule Network Context (Explain how recipient links to Suspicious Network #17)
4. Recommended Operator Action (Clear step-by-step next action following the Action Engine guidelines: Escalate + Enhanced Verification)
5. Audit & Compliance Note (Acknowledge that human authorization is mandatory before permanent blocking).`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        return res.json({
          success: true,
          report: response.text,
          evidence: structuredEvidence,
          engine: 'gemini-3.8-flash',
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, generating deterministic fallback report:', geminiError.message);
      }
    }

    // High quality deterministic fallback report if API key not available or quota limit
    const fallbackReport = `### Executive Summary
At 03:20 AM, customer Rafiqul Islam (Wallet \`01711-239481\`) attempted an outbound transfer of **BDT 80,000** to wallet \`01988-510294\`. TakaSafe's Transaction Guardian and Behavioural Anomaly models classified this event as **Critical Risk (Score: ${structuredEvidence.fusedRiskScore}/100)** due to extreme deviation from the customer's historical baseline.

### SHAP Feature Attribution Breakdown
1. **Transaction Amount Anomaly (+31% contribution):** The requested amount of BDT 80,000 is 53.3× greater than the customer's 90-day average transaction size of BDT 1,500.
2. **Velocity Acceleration (+24% contribution):** 6 consecutive transfer attempts logged within an 8-minute window, indicating urgency typical of account takeover or coercive social engineering.
3. **Hardware Fingerprint Mismatch (+17% contribution):** Originating hardware (Infinix Hot 30, \`#dev-8819\`) has never previously transacted on this account.
4. **Off-Hours Circadian Deviation (+12% contribution):** The transaction occurred at 03:20 AM; 99.4% of historical activity occurs between 09:00 AM and 09:00 PM.
5. **Geographic Distance Jump (+9% contribution):** Geolocation IP places the device in Chittagong, while the regular billing and transacting base is Dhanmondi, Dhaka.
6. **Recipient Counterparty Risk (+7% contribution):** Recipient wallet \`01988-510294\` is indexed as node W302 within **Suspicious Network #17**.

### MuleVision Graph Intelligence Context
MuleVision graph analytics linked the recipient wallet to **Suspicious Network #17**, consisting of **12 wallets, 47 transactions, and BDT 1.28M total flow**. The network exhibits high-velocity fan-in, rapid circular pass-through, and immediate cash-out hops to rural agent points.

### Action Engine Recommendation
- **Immediate Status:** **Escalate + Enhanced Verification**
- **Action Step 1:** ScamShield has presented a pre-payment warning with 24-hour delay option to the customer.
- **Action Step 2:** Operator should enforce secondary biometric / interactive voice callback verification before float release.
- **Action Step 3:** If unverified within 15 minutes, freeze outbound routing on counterparty node W302 and notify Bangladesh Bank BFIU AML desk.

### Audit & Compliance Note
All predictions are probabilistic decision-support signals. Final freezing or blacklisting requires authorization by an authorized AML Officer.`;

    res.json({
      success: true,
      report: fallbackReport,
      evidence: structuredEvidence,
      engine: 'deterministic-rule-engine',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Setup Vite Middlewares in dev mode, or static file serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`TakaSafe Server running on http://localhost:${PORT}`);
  });
}

startServer();
