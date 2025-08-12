# train_pet_diet_recommender.py
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder

np.random.seed(42)

breeds = [
    "labrador", "bulldog", "golden_retriever", "german_shepherd",
    "persian_cat", "siamese_cat", "maine_coon", "ragdoll"
]
activity_levels = [1, 2, 3, 4, 5]  # 1=low, 5=very high
food_types = {
    "labrador": "dry_kibble",
    "bulldog": "mixed",
    "golden_retriever": "dry_kibble",
    "german_shepherd": "dry_kibble",
    "persian_cat": "wet_food",
    "siamese_cat": "dry_kibble",
    "maine_coon": "wet_food",
    "ragdoll": "mixed"
}

n_samples = 5000

rows = []
for _ in range(n_samples):
    breed = np.random.choice(breeds)
    weight = np.random.uniform(2.5, 45)  # kg
    activity = np.random.choice(activity_levels)

    # More realistic portion size formula
    # base_portion + weight*factor + activity*modifier + breed bias
    breed_factor = {
        "labrador": 5.5, "bulldog": 5, "golden_retriever": 5.5,
        "german_shepherd": 6, "persian_cat": 4, "siamese_cat": 4.5,
        "maine_coon": 4.8, "ragdoll": 4.7
    }
    base_portion = 20  # grams
    portion = base_portion + (weight * breed_factor[breed]) + (activity * 3)

    rows.append([breed, weight, activity, portion])

df = pd.DataFrame(
    rows, columns=["breed", "weight", "activity", "portion_size"])

# Encode breed
enc = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
X_cat = enc.fit_transform(df[["breed"]])
X_num = df[["weight", "activity"]].values
X = np.hstack([X_cat, X_num])
y = df["portion_size"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

reg = RandomForestRegressor(n_estimators=200, max_depth=15, random_state=42)
reg.fit(X_train, y_train)

print(f"Train R²: {reg.score(X_train, y_train):.3f}")
print(f"Test R²: {reg.score(X_test, y_test):.3f}")

joblib.dump({"model": reg, "encoder": enc,
            "food_map": food_types}, "pet_diet_model.pkl")
print("✅ Saved pet_diet_model.pkl with large dataset")
