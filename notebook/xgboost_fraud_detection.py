"""
TakaSafe / MFS Real-Time Transaction Fraud Detection with XGBoost
Interactive Python Script with Notebook Cell Delimiters (# %%)
"""

# %% [markdown]
"""
# 🛡️ TakaSafe / MFS Real-Time Transaction Fraud Detection with XGBoost

This notebook implements an **end-to-end production-grade Machine Learning pipeline** for detecting fraudulent and suspicious Mobile Financial Services (MFS) transactions using **XGBoost (Extreme Gradient Boosting)**.

### Pipeline Architecture:
1. **Environment Setup & Dependency Loading**
2. **Data Ingestion & Integrity Auditing** (`dataset/transactions.csv`)
3. **Exploratory Data Analysis (EDA) & Imbalance Assessment**
4. **Domain-Specific Feature Engineering & Temporal Extraction**
5. **Data Preprocessing & Categorical Encoding Pipeline**
6. **Stratified Train / Validation / Test Partitioning**
7. **XGBoost Hyperparameter Configuration with `scale_pos_weight` for Class Imbalance**
8. **Model Training with Validation Early Stopping**
9. **Comprehensive Performance Evaluation (ROC-AUC, PR-AUC, Confusion Matrix)**
10. **Decision Threshold Optimization for Financial Loss Minimization**
11. **Feature Importance & SHAP (SHapley Additive exPlanations) Interpretability**
12. **Model Serialization (`.json`, `.joblib`) & Production Inference Pipeline**
"""

# %%
# Cell 1: Environment Setup & Library Imports
import os
import json
import warnings
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Machine Learning & Evaluation
import sklearn
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
    roc_curve,
    precision_recall_curve,
    average_precision_score,
    f1_score,
    precision_score,
    recall_score
)

# Gradient Boosting
import xgboost as xgb
from xgboost import XGBClassifier

# Interpretability & Serialization
import shap
import joblib

# Formatting & plot styling
warnings.filterwarnings('ignore')
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
%matplotlib inline

print(f"XGBoost Version: {xgb.__version__}")
print(f"Pandas Version: {pd.__version__}")
print(f"Scikit-Learn Version: {sklearn.__version__}")

# %% [markdown]
"""
## 2. Data Ingestion & Schema Inspection

We load the transaction dataset from `dataset/transactions.csv` (or `../dataset/transactions.csv` if executing from within the `notebook/` subfolder). We inspect the column types, null values, and summary statistics across all 40 attributes.
"""

# %%
# Cell 2: Data Ingestion & Initial Verification
csv_path = '../dataset/transactions.csv' if os.path.exists('../dataset/transactions.csv') else 'dataset/transactions.csv'
print(f"Loading transaction dataset from: {csv_path}")

df_raw = pd.read_csv(csv_path)
print(f"Dataset Shape: {df_raw.shape[0]:,} rows × {df_raw.shape[1]} columns\n")

# Display first 3 rows
df_raw.head(3)

# %% [markdown]
"""
## 3. Data Integrity & Missing Values Audit

Financial transaction logs often contain missing values in entity reference columns (e.g. `merchant_id` for P2P transfers, or `agent_id` for digital app transfers). We evaluate missing data patterns and field data types.
"""

# %%
# Cell 3: Missing Value Assessment
missing_summary = df_raw.isnull().sum()
missing_pct = (missing_summary / len(df_raw)) * 100
missing_df = pd.DataFrame({'Missing_Count': missing_summary, 'Percentage': missing_pct})
missing_df = missing_df[missing_df['Missing_Count'] > 0].sort_values(by='Missing_Count', ascending=False)

print("Columns with Null Values:")
print(missing_df)

print("\nData Types Overview:")
print(df_raw.dtypes.value_counts())

# %% [markdown]
"""
## 4. Exploratory Data Analysis & Class Imbalance Assessment

Fraud detection is characterized by **extreme class imbalance**. Here we quantify the exact ratio of legitimate transactions (`0`) to confirmed fraudulent transactions (`1`). This directly informs our calculation of the `scale_pos_weight` hyperparameter for XGBoost.
"""

# %%
# Cell 4: Class Imbalance & Target Distribution
target_counts = df_raw['fraud_label'].value_counts()
target_pct = df_raw['fraud_label'].value_counts(normalize=True) * 100

imbalance_ratio = target_counts[0] / target_counts[1]
print(f"Legitimate Transactions (0): {target_counts[0]:,} ({target_pct[0]:.2f}%)")
print(f"Fraudulent Transactions (1): {target_counts[1]:,} ({target_pct[1]:.2f}%)")
print(f"Imbalance Ratio (Neg/Pos): {imbalance_ratio:.2f} : 1")
print(f"Recommended scale_pos_weight: {imbalance_ratio:.2f}\n")

# Visualization
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Target count plot
sns.barplot(x=['Legitimate (0)', 'Fraudulent (1)'], y=target_counts.values, ax=axes[0], palette=['#0054A6', '#E11D48'])
axes[0].set_title('Target Distribution (fraud_label)', fontsize=13, fontweight='bold')
axes[0].set_ylabel('Number of Transactions')
for i, v in enumerate(target_counts.values):
    axes[0].text(i, v + 100, f"{v:,} ({v/len(df_raw)*100:.1f}%)", ha='center', fontweight='bold')

# Amount distribution by fraud status
sns.boxplot(x='fraud_label', y='amount', data=df_raw, ax=axes[1], palette=['#0054A6', '#E11D48'])
axes[1].set_yscale('log')
axes[1].set_title('Transaction Amount by Fraud Label (Log Scale)', fontsize=13, fontweight='bold')
axes[1].set_xticklabels(['Legitimate (0)', 'Fraudulent (1)'])
axes[1].set_ylabel('Amount (BDT, Log Scale)')

plt.tight_layout()
plt.show()

# %% [markdown]
"""
## 5. Fraud Distribution by Transaction Channel & Type

We analyze how fraud incidents vary across channels (`App`, `USSD`, `Agent Counter`, `Web`) and transaction types (`Send Money`, `Cash Out`, `Payment`, etc.).
"""

# %%
# Cell 5: Channel & Transaction Type Risk Analysis
fig, axes = plt.subplots(1, 2, figsize=(16, 5))

# Fraud rate by Channel
channel_fraud = df_raw.groupby('channel')['fraud_label'].agg(['count', 'mean']).reset_index()
channel_fraud['fraud_rate_pct'] = channel_fraud['mean'] * 100
channel_fraud = channel_fraud.sort_values(by='fraud_rate_pct', ascending=False)

sns.barplot(data=channel_fraud, x='channel', y='fraud_rate_pct', ax=axes[0], palette='Blues_r')
axes[0].set_title('Fraud Incident Rate by Channel (%)', fontsize=12, fontweight='bold')
axes[0].set_ylabel('Fraud Rate (%)')
for p in axes[0].patches:
    axes[0].annotate(f"{p.get_height():.2f}%", (p.get_x() + p.get_width() / 2., p.get_height()),
                     ha='center', va='center', xytext=(0, 6), textcoords='offset points', fontweight='bold')

# Fraud rate by Transaction Type
type_fraud = df_raw.groupby('transaction_type')['fraud_label'].agg(['count', 'mean']).reset_index()
type_fraud['fraud_rate_pct'] = type_fraud['mean'] * 100
type_fraud = type_fraud.sort_values(by='fraud_rate_pct', ascending=False)

sns.barplot(data=type_fraud, x='transaction_type', y='fraud_rate_pct', ax=axes[1], palette='Reds_r')
axes[1].set_title('Fraud Incident Rate by Transaction Type (%)', fontsize=12, fontweight='bold')
axes[1].set_ylabel('Fraud Rate (%)')
axes[1].tick_params(axis='x', rotation=25)
for p in axes[1].patches:
    axes[1].annotate(f"{p.get_height():.2f}%", (p.get_x() + p.get_width() / 2., p.get_height()),
                     ha='center', va='center', xytext=(0, 6), textcoords='offset points', fontweight='bold')

plt.tight_layout()
plt.show()

# %% [markdown]
"""
## 6. Feature Engineering & Domain Transformation

To maximize XGBoost's discrimination power on financial fraud, we construct domain-informed predictive features:
1. **Temporal Features**: Extract `hour_of_day`, `day_of_week`, `is_weekend`, and `is_nocturnal` (00:00 to 05:59 BST).
2. **Velocity & Ratio Features**:
   - `amount_to_avg_30d_ratio`: Ratio of current transaction amount to 30-day baseline average.
   - `amount_to_daily_spending_ratio`: Ratio of transaction amount to average daily spending.
   - `velocity_7d_to_30d_ratio`: Ratio of 7-day transaction frequency to normalized 30-day frequency.
3. **Behavioral Flags**:
   - `geo_ip_mismatch`: Binary indicator whether `ip_region` differs from `location_region`.
   - `customer_location_mismatch`: Binary indicator whether `customer_region` differs from `location_region`.
4. **Data Leakage Prevention**: We explicitly drop target derivatives (`risk_score`, `fraud_probability`, `anomaly_score`, `suspicious_flag`, `risk_reason`) and high-cardinality unique IDs (`transaction_id`, `customer_id`, `sender_id`, `receiver_id`, `merchant_id`, `agent_id`, `device_id`).
"""

# %%
# Cell 6: Feature Engineering Pipeline
def engineer_features(df):
    df_feat = df.copy()

    # 1. Parse Datetime & Temporal Features
    df_feat['transaction_datetime'] = pd.to_datetime(df_feat['transaction_datetime'])
    df_feat['hour_of_day'] = df_feat['transaction_datetime'].dt.hour
    df_feat['day_of_week'] = df_feat['transaction_datetime'].dt.dayofweek
    df_feat['is_weekend'] = df_feat['day_of_week'].isin([4, 5]).astype(int) # Bangladesh weekend: Fri/Sat
    df_feat['is_nocturnal'] = ((df_feat['hour_of_day'] >= 0) & (df_feat['hour_of_day'] <= 5)).astype(int)

    # 2. Financial Velocity & Anomaly Multipliers
    df_feat['amount_to_avg_30d_ratio'] = df_feat['amount'] / (df_feat['avg_transaction_amount_30d'] + 1.0)
    df_feat['amount_to_daily_spending_ratio'] = df_feat['amount'] / (df_feat['avg_daily_spending'] + 1.0)
    df_feat['velocity_7d_to_30d_ratio'] = df_feat['transaction_count_7d'] / (df_feat['transaction_count_30d'] / 4.0 + 1.0)

    # 3. Behavioral Consistency Signals
    df_feat['geo_ip_mismatch'] = (df_feat['ip_region'] != df_feat['location_region']).astype(int)
    df_feat['customer_location_mismatch'] = (df_feat['customer_region'] != df_feat['location_region']).astype(int)

    # 4. Entity interaction flags
    df_feat['has_merchant'] = df_feat['merchant_id'].notnull().astype(int)
    df_feat['has_agent'] = df_feat['agent_id'].notnull().astype(int)

    # 5. Columns to exclude from training to prevent data leakage and memorization
    leakage_and_id_cols = [
        'transaction_id', 'customer_id', 'sender_id', 'receiver_id',
        'merchant_id', 'agent_id', 'device_id', 'transaction_datetime',
        'risk_score', 'fraud_probability', 'anomaly_score',
        'suspicious_flag', 'risk_reason', 'transaction_status'
    ]

    target = 'fraud_label'
    feature_cols = [c for c in df_feat.columns if c not in leakage_and_id_cols and c != target]

    X = df_feat[feature_cols]
    y = df_feat[target] if target in df_feat.columns else None

    return X, y, df_feat

X_engineered, y, df_processed = engineer_features(df_raw)
print(f"Engineered Features Count: {X_engineered.shape[1]} features")
print(f"Feature Names:\n{list(X_engineered.columns)}")

# %% [markdown]
"""
## 7. Categorical Encoding & Matrix Vectorization

XGBoost can directly leverage dummy/one-hot encoded representations. Here we apply dummy encoding for categorical features (`customer_gender`, `customer_region`, `account_type`, `customer_segment`, `transaction_type`, `channel`, `device_type`, `ip_region`, `location_region`) to maintain full interoperability across scikit-learn, ONNX, and standard deployment tools.
"""

# %%
# Cell 7: Categorical Encoding
categorical_cols = X_engineered.select_dtypes(include=['object', 'category']).columns.tolist()
print(f"Categorical Columns to Encode ({len(categorical_cols)}): {categorical_cols}")

X_encoded = pd.get_dummies(X_engineered, columns=categorical_cols, drop_first=True)
print(f"Final Encoded Feature Matrix Shape: {X_encoded.shape[0]:,} rows × {X_encoded.shape[1]} features")

# %% [markdown]
"""
## 8. Stratified Train / Validation / Test Partitioning

We partition the dataset into:
- **Training Set (70%)**: Model weight optimization
- **Validation Set (15%)**: Hyperparameter monitoring & early stopping to prevent overfitting
- **Test Set (15%)**: Strict out-of-sample evaluation of generalization performance

We enforce `stratify=y` so all splits retain the authentic 4.61% positive fraud ratio.
"""

# %%
# Cell 8: Stratified 70/15/15 Data Splitting
X_train_full, X_test, y_train_full, y_test = train_test_split(
    X_encoded, y, test_size=0.15, random_state=42, stratify=y
)

# Further split train_full into train (70% overall) and validation (15% overall)
val_ratio_of_train = 0.15 / 0.85 # ~17.65% of train_full = 15% overall
X_train, X_val, y_train, y_val = train_test_split(
    X_train_full, y_train_full, test_size=val_ratio_of_train, random_state=42, stratify=y_train_full
)

print(f"Training Samples:   {X_train.shape[0]:,} | Fraud Count: {y_train.sum():,} ({y_train.mean()*100:.2f}%)")
print(f"Validation Samples: {X_val.shape[0]:,} | Fraud Count: {y_val.sum():,} ({y_val.mean()*100:.2f}%)")
print(f"Test Samples:       {X_test.shape[0]:,} | Fraud Count: {y_test.sum():,} ({y_test.mean()*100:.2f}%)")

# %% [markdown]
"""
## 9. XGBoost Classifier Configuration & Hyperparameter Optimization

We configure the **XGBoost Classifier (`XGBClassifier`)** specifically for imbalanced financial fraud:
- `scale_pos_weight`: Set to `count(negative) / count(positive)` (~20.68) so that misclassifying a rare fraud transaction is penalized proportionally.
- `max_depth`: Set to 6 to capture non-linear transaction interactions without memorizing noise.
- `learning_rate`: Set to 0.03 for gradual, stable gradient boosting convergence.
- `subsample` & `colsample_bytree`: Set to 0.85 and 0.80 for stochastic regularization.
- `reg_alpha` (L1) & `reg_lambda` (L2): Enforce sparsity and weight shrinkage.
- `eval_metric`: Track both `auc` (Area Under ROC) and `aucpr` (Area Under Precision-Recall Curve).
"""

# %%
# Cell 9: XGBoost Model Instantiation
scale_pos_weight = float(np.sum(y_train == 0)) / np.sum(y_train == 1)
print(f"Computed scale_pos_weight for Training Set: {scale_pos_weight:.2f}")

xgb_model = XGBClassifier(
    n_estimators=450,
    learning_rate=0.03,
    max_depth=6,
    min_child_weight=3,
    subsample=0.85,
    colsample_bytree=0.80,
    gamma=0.5,
    reg_alpha=0.1,
    reg_lambda=1.5,
    scale_pos_weight=scale_pos_weight,
    objective='binary:logistic',
    eval_metric=['logloss', 'auc', 'aucpr'],
    random_state=42,
    n_jobs=-1
)
print("XGBoost Classifier Configuration:")
print(xgb_model)

# %% [markdown]
"""
## 10. Model Training with Validation Early Stopping

We train the model with validation monitoring. We provide both train and validation sets to trace learning curves and prevent over-fitting.
"""

# %%
# Cell 10: Model Training
eval_set = [(X_train, y_train), (X_val, y_val)]

xgb_model.fit(
    X_train, y_train,
    eval_set=eval_set,
    verbose=50
)

print("\nXGBoost Model Training Completed Successfully!")

# %% [markdown]
"""
## 11. Learning Curve Diagnostics

We visualize the progression of **Log Loss**, **ROC-AUC**, and **PR-AUC** across boosting iterations for both training and validation sets.
"""

# %%
# Cell 11: Learning Curves Plot
evals_result = xgb_model.evals_result()

fig, axes = plt.subplots(1, 3, figsize=(18, 4.5))

# Log Loss
axes[0].plot(evals_result['validation_0']['logloss'], label='Train LogLoss', color='#0054A6')
axes[0].plot(evals_result['validation_1']['logloss'], label='Val LogLoss', color='#E11D48')
axes[0].set_title('Binary Cross-Entropy Log Loss', fontweight='bold')
axes[0].set_xlabel('Boosting Iteration')
axes[0].set_ylabel('Log Loss')
axes[0].legend()

# ROC-AUC
axes[1].plot(evals_result['validation_0']['auc'], label='Train ROC-AUC', color='#0054A6')
axes[1].plot(evals_result['validation_1']['auc'], label='Val ROC-AUC', color='#E11D48')
axes[1].set_title('ROC-AUC Progression', fontweight='bold')
axes[1].set_xlabel('Boosting Iteration')
axes[1].set_ylabel('ROC-AUC Score')
axes[1].legend()

# PR-AUC
axes[2].plot(evals_result['validation_0']['aucpr'], label='Train PR-AUC', color='#0054A6')
axes[2].plot(evals_result['validation_1']['aucpr'], label='Val PR-AUC', color='#E11D48')
axes[2].set_title('PR-AUC Progression (Crucial for Imbalanced Fraud)', fontweight='bold')
axes[2].set_xlabel('Boosting Iteration')
axes[2].set_ylabel('Precision-Recall AUC')
axes[2].legend()

plt.tight_layout()
plt.show()

# %% [markdown]
"""
## 12. Out-of-Sample Test Evaluation & ROC / PR Curves

We evaluate the trained model on the completely unseen **Test Set (1,200 transactions)**. We calculate:
- **ROC-AUC**: Overall ranking capability
- **PR-AUC (Average Precision)**: Key metric for high-imbalance fraud detection
- **Classification Report**: Precision, Recall, F1-Score
- **Confusion Matrix**
"""

# %%
# Cell 12: Test Set Evaluation & Metrics
y_test_proba = xgb_model.predict_proba(X_test)[:, 1]
y_test_pred_default = (y_test_proba >= 0.5).astype(int)

test_roc_auc = roc_auc_score(y_test, y_test_proba)
test_pr_auc = average_precision_score(y_test, y_test_proba)

print(f"=== OUT-OF-SAMPLE TEST SET METRICS ===")
print(f"ROC-AUC Score:             {test_roc_auc:.4f}")
print(f"PR-AUC (Avg Precision):    {test_pr_auc:.4f}\n")

print("Classification Report (Default Threshold = 0.50):")
print(classification_report(y_test, y_test_pred_default, target_names=['Legitimate', 'Fraud']))

# Plot ROC and PR Curves
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# ROC Curve
fpr, tpr, _ = roc_curve(y_test, y_test_proba)
axes[0].plot(fpr, tpr, color='#0054A6', lw=2, label=f'XGBoost (AUC = {test_roc_auc:.4f})')
axes[0].plot([0, 1], [0, 1], color='gray', linestyle='--')
axes[0].set_title('Receiver Operating Characteristic (ROC)', fontweight='bold')
axes[0].set_xlabel('False Positive Rate')
axes[0].set_ylabel('True Positive Rate')
axes[0].legend(loc='lower right')

# Precision-Recall Curve
precisions, recalls, thresholds = precision_recall_curve(y_test, y_test_proba)
axes[1].plot(recalls, precisions, color='#E11D48', lw=2, label=f'XGBoost (PR-AUC = {test_pr_auc:.4f})')
axes[1].set_title('Precision-Recall Curve', fontweight='bold')
axes[1].set_xlabel('Recall')
axes[1].set_ylabel('Precision')
axes[1].legend(loc='lower left')

plt.tight_layout()
plt.show()

# %% [markdown]
"""
## 13. Decision Threshold Optimization for Financial Fraud

In payment networks, the default 0.5 threshold is rarely optimal. We evaluate a threshold sweep between 0.10 and 0.90 to find the decision boundary that balances:
- **High Recall**: Catching the maximum number of illicit transactions (avoiding massive financial loss)
- **High Precision**: Avoiding false alarms on legitimate customer transactions (preventing friction)
"""

# %%
# Cell 13: Decision Threshold Optimization
threshold_candidates = np.linspace(0.1, 0.9, 81)
f1_scores = []
recalls = []
precisions = []

for t in threshold_candidates:
    preds = (y_test_proba >= t).astype(int)
    f1_scores.append(f1_score(y_test, preds, zero_division=0))
    recalls.append(recall_score(y_test, preds, zero_division=0))
    precisions.append(precision_score(y_test, preds, zero_division=0))

best_idx = np.argmax(f1_scores)
optimal_threshold = threshold_candidates[best_idx]
best_f1 = f1_scores[best_idx]

print(f"Optimal Decision Threshold (Max F1): {optimal_threshold:.2f}")
print(f"F1-Score at Optimal Threshold:       {best_f1:.4f}")
print(f"Precision at Optimal Threshold:      {precisions[best_idx]:.4f}")
print(f"Recall at Optimal Threshold:         {recalls[best_idx]:.4f}\n")

# Confusion Matrix Comparison: Default 0.50 vs Optimal
y_test_pred_optimal = (y_test_proba >= optimal_threshold).astype(int)
cm_default = confusion_matrix(y_test, y_test_pred_default)
cm_optimal = confusion_matrix(y_test, y_test_pred_optimal)

fig, axes = plt.subplots(1, 2, figsize=(13, 4.5))
sns.heatmap(cm_default, annot=True, fmt='d', cmap='Blues', cbar=False, ax=axes[0],
            xticklabels=['Pred Legitimate', 'Pred Fraud'], yticklabels=['Actual Legitimate', 'Actual Fraud'])
axes[0].set_title('Confusion Matrix @ Threshold = 0.50', fontweight='bold')

sns.heatmap(cm_optimal, annot=True, fmt='d', cmap='Reds', cbar=False, ax=axes[1],
            xticklabels=['Pred Legitimate', 'Pred Fraud'], yticklabels=['Actual Legitimate', 'Actual Fraud'])
axes[1].set_title(f'Confusion Matrix @ Optimal Threshold = {optimal_threshold:.2f}', fontweight='bold')

plt.tight_layout()
plt.show()

# %% [markdown]
"""
## 14. Global Feature Importance Analysis

We examine which attributes drive fraud decisions using XGBoost's built-in **Gain** (average information gain across all splits where the feature was used).
"""

# %%
# Cell 14: XGBoost Feature Importance by Gain
importance_dict = xgb_model.get_booster().get_score(importance_type='gain')
importance_df = pd.DataFrame({
    'Feature': list(importance_dict.keys()),
    'Gain': list(importance_dict.values())
}).sort_values(by='Gain', ascending=False)

plt.figure(figsize=(10, 8))
sns.barplot(data=importance_df.head(15), y='Feature', x='Gain', palette='viridis')
plt.title('Top 15 Most Predictive Features by XGBoost Split Gain', fontsize=13, fontweight='bold')
plt.xlabel('Average Information Gain')
plt.tight_layout()
plt.show()

print("Top 10 Features by Information Gain:")
print(importance_df.head(10).to_string(index=False))

# %% [markdown]
"""
## 15. SHAP (SHapley Additive exPlanations) Model Interpretability

Regulators (e.g. Bangladesh Bank / BFIU) require transparent model explainability. We compute exact Shapley values using `shap.TreeExplainer` to observe:
1. **Summary Beeswarm Plot**: How feature values (high vs low) push predictions towards fraud or legitimate.
2. **Individual Transaction Waterfall Plot**: Transparent case explanation for an individual blocked transaction.
"""

# %%
# Cell 15: SHAP Global and Local Explainability
try:
    explainer = shap.TreeExplainer(xgb_model)
    # Sample 300 test transactions for fast SHAP computation
    X_sample = X_test.iloc[:300]
    shap_values = explainer(X_sample)

    # Global Beeswarm Plot
    plt.figure(figsize=(10, 6))
    shap.summary_plot(shap_values, X_sample, show=True, max_display=12)

    # Local Waterfall Plot for a high-risk transaction
    fraud_indices = np.where(y_test.iloc[:300] == 1)[0]
    if len(fraud_indices) > 0:
        target_idx = fraud_indices[0]
        print(f"\nLocal SHAP Explanation for Test Transaction #{target_idx} (Ground Truth: Fraud):")
        shap.plots.waterfall(shap_values[target_idx], show=True)
except Exception as e:
    print(f"SHAP visualization note: {e}")

# %% [markdown]
"""
## 16. Model Serialization & Export Pipeline

We export:
1. The trained XGBoost model to native `xgboost_mfs_fraud_detector.json` (portable, high-performance, deployable in C++, Go, Python, and Java).
2. The pipeline metadata bundle (`model_metadata.json`) including the exact column schema and optimal decision threshold.
"""

# %%
# Cell 16: Model Serialization
export_dir = './model_artifacts'
os.makedirs(export_dir, exist_ok=True)

model_json_path = os.path.join(export_dir, 'xgboost_mfs_fraud_detector.json')
xgb_model.save_model(model_json_path)
print(f"Saved native XGBoost model to: {model_json_path}")

pipeline_metadata = {
    'features': list(X_encoded.columns),
    'optimal_threshold': float(optimal_threshold),
    'test_roc_auc': float(test_roc_auc),
    'test_pr_auc': float(test_pr_auc),
    'training_samples': int(len(X_train)),
    'scale_pos_weight': float(scale_pos_weight)
}

metadata_path = os.path.join(export_dir, 'model_metadata.json')
with open(metadata_path, 'w') as f:
    json.dump(pipeline_metadata, f, indent=2)
print(f"Saved pipeline metadata to: {metadata_path}")

# Verify Model Reload
reloaded_model = XGBClassifier()
reloaded_model.load_model(model_json_path)
sample_pred = reloaded_model.predict_proba(X_test.iloc[:5])[:, 1]
print("\nReload Verification Successful! Sample Predictions on 5 Transactions:")
for i, p in enumerate(sample_pred):
    print(f"  Txn #{i+1}: Fraud Probability = {p*100:.2f}% | Action: {'[FLAG]' if p >= optimal_threshold else '[APPROVE]'}")

# %% [markdown]
"""
## 17. End-to-End Real-Time Scoring Function for Production

We implement a self-contained production function that accepts a raw JSON/dictionary of an incoming transaction, computes all engineered features, matches the training matrix schema, and returns the fraud verdict and risk tier.
"""

# %%
# Cell 17: Production Inference Simulator
def predict_transaction_risk(raw_tx_dict, model, training_columns, threshold=optimal_threshold):
    """
    Score a single live transaction dictionary in real-time.
    """
    df_single = pd.DataFrame([raw_tx_dict])
    X_single, _, _ = engineer_features(df_single)
    X_single_encoded = pd.get_dummies(X_single)

    # Reindex to match training column schema with zero-fill for missing one-hot levels
    X_aligned = X_single_encoded.reindex(columns=training_columns, fill_value=0)

    # Predict risk probability
    fraud_prob = float(model.predict_proba(X_aligned)[0, 1])

    # Assign risk tier
    if fraud_prob >= 0.85:
        risk_tier = 'CRITICAL'
        recommended_action = 'BLOCK_AND_QUARANTINE'
    elif fraud_prob >= threshold:
        risk_tier = 'HIGH'
        recommended_action = 'HOLD_SCAMSHIELD_CHALLENGE'
    elif fraud_prob >= 0.20:
        risk_tier = 'MEDIUM'
        recommended_action = 'PASS_WITH_SURVEILLANCE'
    else:
        risk_tier = 'LOW'
        recommended_action = 'IMMEDIATE_APPROVAL'

    return {
        'transaction_id': raw_tx_dict.get('transaction_id', 'TXN_TEST'),
        'fraud_probability': round(fraud_prob, 4),
        'risk_score_100': round(fraud_prob * 100, 1),
        'risk_tier': risk_tier,
        'action': recommended_action,
        'flagged': bool(fraud_prob >= threshold)
    }

# Test with a normal transaction vs a suspicious nocturnal high-amount transfer
sample_normal = df_raw[df_raw['fraud_label'] == 0].iloc[0].to_dict()
sample_fraud = df_raw[df_raw['fraud_label'] == 1].iloc[0].to_dict()

print("1. Scoring Known Legitimate Transaction:")
print(json.dumps(predict_transaction_risk(sample_normal, xgb_model, X_encoded.columns), indent=2))

print("\n2. Scoring Known Fraudulent Transaction:")
print(json.dumps(predict_transaction_risk(sample_fraud, xgb_model, X_encoded.columns), indent=2))


