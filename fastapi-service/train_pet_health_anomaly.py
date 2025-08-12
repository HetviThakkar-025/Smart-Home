# train_pet_health_anomaly.py
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder

# ---------------------------
# Generate Larger Synthetic Dataset
# ---------------------------
np.random.seed(42)

symptoms_list = [
    "none", "lethargy", "vomiting", "loss_of_appetite",
    "excessive_thirst", "diarrhea", "coughing", "sneezing"
]
food_types = ["dry_kibble", "wet_food", "mixed", "raw_diet"]

n_samples = 5000  # large dataset

rows = []
for _ in range(n_samples):
    symptom = np.random.choice(
        symptoms_list, p=[0.4, 0.1, 0.05, 0.05, 0.15, 0.05, 0.1, 0.1])
    food_type = np.random.choice(food_types, p=[0.5, 0.25, 0.2, 0.05])
    food_amount = np.random.randint(15, 200)  # grams
    activity = np.random.randint(0, 180)  # minutes

    # More nuanced logic for labeling
    if symptom == "excessive_thirst" and activity < 20 and food_amount < 60:
        label = "possible_dehydration"
    elif food_amount > 150 and activity < 60:
        label = "possible_overfeeding"
    elif symptom in ["vomiting", "loss_of_appetite", "diarrhea", "lethargy"] and activity < 40:
        label = "possible_illness"
    else:
        label = "normal"

    rows.append([symptom, food_type, food_amount, activity, label])

df = pd.DataFrame(
    rows, columns=["symptom", "food_type", "food_amount", "activity", "label"])

# ---------------------------
# Encode and Train
# ---------------------------
enc = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
X_cat = enc.fit_transform(df[["symptom", "food_type"]])
X_num = df[["food_amount", "activity"]].values
X = np.hstack([X_cat, X_num])
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

clf = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42)
clf.fit(X_train, y_train)

print(f"Train Accuracy: {clf.score(X_train, y_train):.3f}")
print(f"Test Accuracy: {clf.score(X_test, y_test):.3f}")

joblib.dump({"model": clf, "encoder": enc}, "pet_health_model.pkl")
print("✅ Saved pet_health_model.pkl with large dataset")
