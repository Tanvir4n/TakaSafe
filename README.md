# TakaSafe - AI Financial Trust & Resilience Network
> **Explainable AI-Powered Fraud Intelligence, Mule Syndicate Defense, Consumer ScamShield & Disaster-Aware Liquidity Resilience for Mobile Financial Services (MFS)**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![D3.js](https://img.shields.io/badge/D3.js-v7.9-F9A03C?logo=d3.js&logoColor=white)](https://d3js.org/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75C4?logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Compliance](https://img.shields.io/badge/BFIU-AML%2FCFT_Compliant-10B981)](#regulatory-compliance)
[![Hackathon](https://img.shields.io/badge/DIU_CPC_×_upay-Hackathon_2026-FAB915)](#team--credits)

---

## 📌 Executive Summary

In Bangladesh's hyper-dense Mobile Financial Services (MFS) ecosystem (transacting over ৳4,000+ Crore daily across bKash, upay, and Nagad), fraud operations have evolved far beyond simple PIN phishing. Modern threats feature **coordinated mule syndicates**, **algorithmic pass-through rings**, **coercive social engineering scams**, and **disaster-driven rural cash liquidity shocks**.

**TakaSafe** is a multi-modal Financial Trust & Resilience Platform engineered for MFS operators, compliance officers, and rural consumers. It bridges machine learning risk scoring with **Explainable AI (SHAP)**, **Graph Network Analytics (MuleVision)**, **Predictive Agent Float Management**, and **Bangladesh Bank BFIU-compliant automated action engines**.

---

## 🚀 Key Functional Modules

### 1. 🛡️ Transaction Guardian & Explainable AI (SHAP)
- **Multi-Modal Risk Scoring**: Fuses supervised XGBoost fraud probability with unsupervised Isolation Forest behavioral anomaly detection.
- **Explainable Feature Attribution**: Deconstructs every high-risk transaction into auditable SHAP contributions (e.g., Circadian Time Anomaly +12%, Velocity Spike +24%, Device Hardware Mismatch +17%).
- **Responsible Generative AI (Gemini 2.5 Flash)**: Rather than making black-box decisions, Gemini converts structured mathematical features into plain-language, auditable case investigation dossiers for human fraud analysts.

### 2. 🕸️ MuleVision Graph Intelligence (D3 Force-Directed Network)
- **Deep Network Centrality Analysis**: Visualizes complex multi-wallet syndicates, aggregator hubs, and pass-through mule rings in real-time.
- **Shortest-Path Proximity & Hop Tracking**: Detects circular layering where funds hop across 10+ accounts before rapid cash-out.
- **1-Click Quarantine**: Authorizes immediate isolation and freezing of suspicious nodes with cryptographic audit ledger recording.

### 3. 🌊 Disaster Resilience Mode & Predictive Float Dispatch
- **Climate & Weather Shock Forecasting**: Models cash-out surges in coastal and flood-prone divisions (e.g., Cyclone Remal scenarios in Barishal and Patuakhali).
- **Proactive Float Routing**: Forecasts agent cash liquidity shortfalls up to 48 hours in advance, triggering automated armored distributor float dispatch before liquidity collapses.
- **Humanitarian Emergency Relief Mode**: Dynamically lowers false-positive friction for emergency aid disbursements while maintaining vigilant device-level anti-takeover shields.

### 4. 📡 Early-Warning Radar & Geospatial Intelligence
- **Interactive Bangladesh Geospatial Risk Map**: Visualizes real-time divisional risk indexes across all 8 administrative divisions (Dhaka, Chittagong, Sylhet, Barishal, Khulna, Rajshahi, Rangpur, Mymensingh).
- **Division Risk Radar**: 360-degree situational awareness aggregating velocity spikes, account takeover spikes, network density, and agent float stress.

### 5. ⚖️ Policy Parameter Weights & Automated Action Engine
- **Tunable Mathematical Policy Weights ($R_{final} = \sum w_i \cdot s_i$)**:
  - Supervised Fraud Probability Engine ($w_{fraud} = 0.30$)
  - Behavioral Anomaly Baseline ($w_{anomaly} = 0.20$)
  - Transaction Velocity & Burst Frequency ($w_{velocity} = 0.15$)
  - Device Integrity & Hardware Fingerprint ($w_{device} = 0.15$)
  - Mule Syndicate Graph Centrality ($w_{network} = 0.10$)
  - Social Engineering & ScamShield Risk ($w_{scam} = 0.10$)
- **Operational Risk Presets**: 1-click policy switching between *Production Baseline*, *Nocturnal Cyber Guard*, *Anti-Mule Active*, and *Disaster Relief Tolerance*.
- **Deterministic Action Engine Matrix**: Directly maps risk thresholds (0–30 Low, 31–60 Medium, 61–80 High, 81–100 Critical) to mandatory regulatory procedures (Straight-Through Processing, Out-of-Band SMS OTP, Tier-2 Escrow Hold, Instant Wallet Block).

### 6. 📱 ScamShield Consumer Mobile Simulator
- **Interactive MFS Customer App**: Fully functional mobile simulator supporting Send Money, Cash Out, Make Payment, and QR scanning.
- **Cognitive Coercion Defense**: Intercepts nocturnal transactions to unverified accounts with empathetic, high-contrast ScamShield warnings and an optional 24-hour cooling-off delay.

### 7. 📑 BFIU Compliance & Regulatory Report Generator
- **Audit-Ready Suspicious Transaction Reports (STR)**: Generates formal printable compliance dossiers adhering to the Anti-Money Laundering Act, 2012 and Bangladesh Bank BFIU guidelines.
- **Electronic Sign-Off Ledger**: Formal digital authorization attributed to Authorized AML Officers.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | High-performance, type-safe reactive UI |
| **Build & Tooling** | Vite 8 + TSX | Instant HMR development and optimized production bundles |
| **Styling & Design** | Tailwind CSS v4 | Custom banking aesthetics, responsive grid, and dark mode support |
| **Data Visualization** | D3.js v7 + Recharts | Force-directed mule graphs, donut charts, and risk trend metrics |
| **Generative AI** | `@google/genai` (Gemini 2.5 Flash) | Server-side explainable case synthesis and SHAP narration |
| **Backend & APIs** | Node.js + Express | REST APIs for audit actions, logs, investigation briefs, and health checks |
| **Iconography** | Lucide React | Clean, domain-specific fintech iconography |

---

## 📐 Mathematical Formulation

TakaSafe enforces a deterministic composite risk function:

$$R_{\text{final}} = w_{\text{fraud}} \cdot s_{\text{fraud}} + w_{\text{anomaly}} \cdot s_{\text{anomaly}} + w_{\text{velocity}} \cdot s_{\text{velocity}} + w_{\text{device}} \cdot s_{\text{device}} + w_{\text{network}} \cdot s_{\text{network}} + w_{\text{scam}} \cdot s_{\text{scam}}$$

$$\text{subject to } \sum w_i = 1.00 \quad (100\%)$$

| Signal Engine | Default Weight ($w_i$) | Underpinning Algorithmic Model |
| :--- | :---: | :--- |
| **Supervised Fraud Probability** | $0.30$ | XGBoost Classifier v4.2 trained on MFS attack vectors |
| **Behavioral Anomaly Baseline** | $0.20$ | Isolation Forest benchmarking 90-day spending history |
| **Transaction Velocity Index** | $0.15$ | Rolling temporal sliding window (10m & 60m frequency) |
| **Device Hardware Integrity** | $0.15$ | IMEI change, SIM swap, IP mismatch & nocturnal timing |
| **Mule Graph Centrality** | $0.10$ | Graph Neural Network (GNN) shortest-path clustering |
| **Social Engineering Risk** | $0.10$ | Pre-payment cognitive duress & lottery scam heuristics |

---

## 📂 Project Directory Structure

```plaintext
takasafe/
├── server.ts                       # Express backend + Gemini 2.5 Flash proxy
├── vite.config.ts                  # Vite + React configuration
├── package.json                    # Project dependencies & scripts
├── metadata.json                   # AI Studio applet metadata & capabilities
├── src/
│   ├── main.tsx                    # React application entry point
│   ├── App.tsx                     # Core state coordinator & layout
│   ├── index.css                   # Global styles & MFS signature animations
│   ├── types/
│   │   └── index.ts                # Strict TypeScript domain interfaces
│   ├── data/
│   │   └── mockData.ts             # High-fidelity synthetic MFS datasets
│   └── components/
│       ├── common/
│       │   ├── UpayHeader.tsx      # Top navigation with animated MFS logo
│       │   ├── UpayFooter.tsx      # Corporate footer & brand links
│       │   └── UpayInfoModal.tsx   # Platform accreditation & team details
│       ├── auth/
│       │   └── LoginPage.tsx       # Role-based authentication (Admin / User)
│       ├── operator/
│       │   ├── OperatorDashboard.tsx            # Main operator surveillance hub
│       │   ├── PolicyWeightsActionEngine.tsx    # Policy tuner & action engine matrix
│       │   ├── MuleVisionGraph.tsx              # D3 force-directed syndicate graph
│       │   ├── DisasterResilienceSimulator.tsx  # Cyclone/flood cash shock engine
│       │   ├── EarlyWarningRadar.tsx            # Multi-modal risk radar
│       │   ├── GeospatialIntelligenceMap.tsx    # Division risk & agent liquidity map
│       │   ├── ComplianceReportModal.tsx        # Printable BFIU STR report modal
│       │   ├── LiveWebSocketTicker.tsx          # Real-time transaction stream
│       │   ├── TransactionRiskTrendChart.tsx    # 24-hour temporal risk charts
│       │   └── RiskDistributionDonutChart.tsx   # Severity distribution donut
│       ├── customer/
│       │   └── CustomerAppSimulator.tsx         # Mobile consumer MFS app
│       └── storyline/
│           └── StorylineWalkthrough.tsx         # Interactive evaluator tour
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` or `bun`
- **Google Gemini API Key** (optional, high-quality deterministic fallback is built-in): Obtainable from [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/takasafe.git
   cd takasafe
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key (optional):
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3000
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔒 Regulatory Compliance

TakaSafe is architected to satisfy Bangladesh regulatory and cybersecurity mandates:
- **Anti-Money Laundering Act, 2012 (Section 19)**: Mandatory Suspicious Transaction Reporting (STR) format.
- **BFIU Guidelines on AML/CFT for MFS Providers (2026)**: Explainable decision logging and anti-mule clustering.
- **Bangladesh Bank PSD Circular 12**: Out-of-band step-up authentication thresholds and escrow reviews.
- **Consumer Protection Directive**: Customer-empowered 24-hour delay window for suspected social engineering.

---

## 👥 Team & Credits

**Team 3AM Runtime** — Developed for the **DIU CPC × upay National Hackathon 2026**:

- **Md. Tanvir Hasan** — Chief Risk Analyst & Lead Architect
- **Sourov Kumar** — SOC Operations & Risk Governance
- **Md. Sadman Al Islam Shabab** — Model Architecture & Explainability Lead


*Special thanks to Daffodil International University (DIU CPC) and upay (UCB Fintech Company Limited) for supporting innovations in financial inclusion, fraud intelligence, and digital trust.*
