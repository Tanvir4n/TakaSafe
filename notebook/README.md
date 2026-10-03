# 🛡️ TakaSafe / MFS Real-Time Transaction Fraud Detection with XGBoost

This folder contains the complete, production-grade **XGBoost Machine Learning pipeline** for detecting fraudulent and suspicious Mobile Financial Services (MFS) transactions.

---

## 📁 Folder Contents

- **`xgboost_fraud_detection.ipynb`**: The full Jupyter Notebook containing **34 alternating markdown and code cells**.
  - Every code cell is preceded by an explanatory markdown cell outlining business logic, mathematical intuition, and technical design.
- **`xgboost_fraud_detection.py`**: An interactive Python script with `# %% [markdown]` and `# %%` cell delimiters, fully compatible with VS Code Interactive Window, PyCharm, Spyder, and JupyterLab.
- **`requirements.txt`**: Python dependencies required to run the pipeline.

---

## 📊 Dataset Overview (`dataset/transactions.csv`)

- **Total Transactions**: 8,000 transaction records
- **Total Columns**: 40 attributes spanning financial amounts, temporal timestamps, customer demographics, channel types, device fingerprints, and baseline statistics.
- **Target Variable**: `fraud_label`
  - Legitimate Transactions (`0`): **7,631** (95.39%)
  - Confirmed Fraudulent Transactions (`1`): **369** (4.61%)
  - **Imbalance Ratio**: `20.68 : 1` (handled via `scale_pos_weight=20.68` in XGBoost)

---

## 🔬 Pipeline Step-by-Step Architecture

| Step # | Stage | Description |
|---|---|---|
| **01** | **Environment Setup** | Imports `xgboost`, `pandas`, `scikit-learn`, `shap`, `matplotlib`, `seaborn`, `joblib`. |
| **02** | **Data Ingestion** | Ingests `dataset/transactions.csv` and audits data types & shape. |
| **03** | **Missing Values Audit** | Checks null patterns across channel-specific entity IDs (`merchant_id`, `agent_id`). |
| **04** | **Class Imbalance EDA** | Quantifies the 4.61% fraud distribution and logs amount distributions. |
| **05** | **Channel & Type Analysis** | Inspects fraud rates across App, USSD, Agent Counter, and Send Money / Cash Out. |
| **06** | **Feature Engineering** | Constructs domain-specific multipliers:<br>• `amount_to_avg_30d_ratio`<br>• `amount_to_daily_spending_ratio`<br>• `velocity_7d_to_30d_ratio`<br>• `is_nocturnal` (00:00 - 05:59 BST)<br>• `geo_ip_mismatch` (`ip_region != location_region`) |
| **07** | **Data Leakage Removal** | Eliminates target derivatives (`risk_score`, `fraud_probability`, `anomaly_score`, `suspicious_flag`, `risk_reason`) and raw ID columns to ensure true generalization. |
| **08** | **Categorical Encoding** | Converts multi-class categories into model-ready numerical dummy features. |
| **09** | **Stratified Partitioning** | 70% Train / 15% Validation / 15% Test with `stratify=y` to preserve exact fraud ratios. |
| **10** | **XGBoost Configuration** | Configures `scale_pos_weight=20.68`, `learning_rate=0.03`, `max_depth=6`, `subsample=0.85`, `colsample_bytree=0.80`, `reg_alpha=0.1`, `reg_lambda=1.5`. |
| **11** | **Early Stopping Training** | Monitors LogLoss, ROC-AUC, and PR-AUC on the validation set to prevent overfitting. |
| **12** | **Test Set Evaluation** | Evaluates out-of-sample ROC-AUC, PR-AUC (Average Precision), and Confusion Matrix. |
| **13** | **Threshold Optimization** | Sweeps decision thresholds $0.10 \to 0.90$ to maximize F1-Score and balance false alarms vs missed frauds. |
| **14** | **Feature Importance (Gain)**| Ranks top features by average split gain. |
| **15** | **SHAP Interpretability** | Generates TreeExplainer summary beeswarm plot and individual waterfall breakdown for BFIU regulatory compliance. |
| **16** | **Model Serialization** | Exports model to native portable `xgboost_mfs_fraud_detector.json` and pipeline metadata. |
| **17** | **Real-Time Scoring API** | Python inference function accepting live transaction payloads and returning fraud probability, risk tier (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), and recommended action. |

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
pip install -r notebook/requirements.txt
```

### 2. Launch Jupyter Notebook
```bash
jupyter notebook notebook/xgboost_fraud_detection.ipynb
```
Or open in VS Code / Google Colab and run the cells sequentially.
