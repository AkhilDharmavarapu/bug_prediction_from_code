"""
PHASE 1: Machine Learning Model Training

This script:
1. Loads the kc1_clean.csv dataset
2. Splits data into features (X) and target (y)
3. Performs 80-20 train-test split
4. Trains a Random Forest Classifier
5. Evaluates model performance
6. Saves the trained model to model/model.pkl
"""

import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# ============================================================================
# STEP 1: Load Dataset
# ============================================================================
print("=" * 80)
print("STEP 1: Loading Dataset")
print("=" * 80)

# Load the dataset
df = pd.read_csv('data/kc1_clean.csv')
print(f"Dataset shape: {df.shape}")
print(f"\nFirst 5 rows:")
print(df.head())
print(f"\nColumn names:")
print(df.columns.tolist())
print(f"\nData types:")
print(df.dtypes)
print(f"\nTarget variable distribution:")
print(df['defects'].value_counts())

# ============================================================================
# STEP 2: Prepare Features (X) and Target (y)
# ============================================================================
print("\n" + "=" * 80)
print("STEP 2: Preparing Features and Target")
print("=" * 80)

# Features: all columns except 'defects'
X = df.drop('defects', axis=1)
# Target: 'defects' column
y = df['defects']

print(f"Features shape: {X.shape}")
print(f"Target shape: {y.shape}")
print(f"Feature columns: {X.columns.tolist()}")

# ============================================================================
# STEP 3: Train-Test Split (80-20)
# ============================================================================
print("\n" + "=" * 80)
print("STEP 3: Train-Test Split (80-20)")
print("=" * 80)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2,  # 20% for testing
    random_state=42,
    stratify=y  # Maintain class distribution
)

print(f"Training set size: {X_train.shape[0]}")
print(f"Test set size: {X_test.shape[0]}")
print(f"Training set defects distribution:\n{y_train.value_counts()}")
print(f"Test set defects distribution:\n{y_test.value_counts()}")

# ============================================================================
# STEP 4: Train Random Forest Classifier
# ============================================================================
print("\n" + "=" * 80)
print("STEP 4: Training Random Forest Classifier")
print("=" * 80)

# Initialize and train the model
model = RandomForestClassifier(
    n_estimators=100,      # Number of trees
    max_depth=15,          # Maximum tree depth
    min_samples_split=5,   # Minimum samples to split a node
    min_samples_leaf=2,    # Minimum samples in leaf node
    random_state=42,
    n_jobs=-1              # Use all available cores
)

print("Training model...")
model.fit(X_train, y_train)
print("✓ Model training completed!")

# ============================================================================
# STEP 5: Make Predictions
# ============================================================================
print("\n" + "=" * 80)
print("STEP 5: Making Predictions")
print("=" * 80)

y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)

print(f"Predictions sample (first 10):")
print(y_pred[:10])

# ============================================================================
# STEP 6: Evaluate Model
# ============================================================================
print("\n" + "=" * 80)
print("STEP 6: Model Evaluation")
print("=" * 80)

# Accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"\nAccuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print(f"\nConfusion Matrix:")
print(cm)
tn, fp, fn, tp = cm.ravel()
print(f"  True Negatives: {tn}")
print(f"  False Positives: {fp}")
print(f"  False Negatives: {fn}")
print(f"  True Positives: {tp}")

# Classification Report
print(f"\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['No Defect', 'Defect']))

# Feature Importance
print(f"\nFeature Importance:")
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)
print(feature_importance)

# ============================================================================
# STEP 7: Save Model
# ============================================================================
print("\n" + "=" * 80)
print("STEP 7: Saving Trained Model")
print("=" * 80)

# Create model directory if it doesn't exist
os.makedirs('model', exist_ok=True)

# Save the model
model_path = 'model/model.pkl'
joblib.dump(model, model_path)
print(f"✓ Model saved to: {model_path}")

# Also save feature names for later use
joblib.dump(X.columns.tolist(), 'model/feature_names.pkl')
print(f"✓ Feature names saved to: model/feature_names.pkl")

print("\n" + "=" * 80)
print("PHASE 1 COMPLETED SUCCESSFULLY!")
print("=" * 80)
