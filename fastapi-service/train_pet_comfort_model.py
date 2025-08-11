# train_pet_comfort_model.py
import random
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import numpy as np

# ---------------------------
# STEP 1: Generate Synthetic Dataset
# ---------------------------


def generate_synthetic_data(n_samples=2000):
    data = []
    for _ in range(n_samples):
        temperature = round(random.uniform(10, 35), 1)  # Celsius
        humidity = round(random.uniform(20, 90), 1)     # %
        feeding_interval = random.randint(
            2, 12)        # hours since last feeding
        activity_level = random.randint(1, 10)          # scale 1–10

        # Comfort label based on some fuzzy rules
        if 18 <= temperature <= 25 and 40 <= humidity <= 60 and feeding_interval <= 5 and 4 <= activity_level <= 8:
            comfort = "comfortable"
        elif temperature < 15 or temperature > 30 or feeding_interval > 8 or activity_level < 3:
            comfort = "uncomfortable"
        else:
            comfort = "neutral"

        data.append([temperature, humidity, feeding_interval,
                    activity_level, comfort])

    return pd.DataFrame(data, columns=["temperature", "humidity", "feeding_interval", "activity_level", "comfort"])


# ---------------------------
# STEP 2: Train Model
# ---------------------------
df = generate_synthetic_data(2000)
print("Sample data:\n", df.head())

X = df[["temperature", "humidity", "feeding_interval", "activity_level"]]
y = df["comfort"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=150, random_state=42)
model.fit(X_train, y_train)

acc = model.score(X_test, y_test)
print(f"Model Accuracy: {acc:.2f}")

# ---------------------------
# STEP 3: Save Model
# ---------------------------
joblib.dump(model, "pet_comfort_model.pkl")
print("Model saved to pet_comfort_model.pkl")
