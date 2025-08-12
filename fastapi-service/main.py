# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and embedder at startup
package = joblib.load('model.pkl')
clf = package['classifier']
embedder = package['embedder']
print("Loaded embedder")
# Pet comfort model
pet_comfort_model = joblib.load('pet_comfort_model.pkl')
print("Loaded Pet model")

pet_health_package = joblib.load("pet_health_model.pkl")
pet_health_model = pet_health_package["model"]
pet_health_encoder = pet_health_package["encoder"]
print("Loaded pet_health_model")

pet_diet_package = joblib.load("pet_diet_model.pkl")
pet_diet_model = pet_diet_package["model"]
pet_diet_encoder = pet_diet_package["encoder"]
pet_food_map = pet_diet_package["food_map"]
print("Loaded pet_diet_model")


class TextRequest(BaseModel):
    text: str


class PetComfortRequest(BaseModel):
    temperature: float
    humidity: float
    feeding_interval: int
    activity_level: int


class PetHealthRequest(BaseModel):
    symptoms: str
    recentFood: str
    recentActivity: str


class PetDietRequest(BaseModel):
    breed: str
    weight: float
    activity: int


@app.post('/predict_urgency')
def predict_urgency(req: TextRequest):
    text = req.text.lower()
    embedding = embedder.encode([text])
    prediction = clf.predict(embedding)[0]
    return {'urgency': prediction}


@app.post('/predict_pet_comfort')
def predict_pet_comfort(req: PetComfortRequest):
    features = [[
        req.temperature,
        req.humidity,
        req.feeding_interval,
        req.activity_level
    ]]
    prediction = pet_comfort_model.predict(features)[0]

    print('comfort_level', prediction)
    return {'comfort_level': prediction}


@app.post("/predict_pet_health")
def predict_pet_health(req: PetHealthRequest):
    # Match training order: ["symptom", "food_type"]
    X_cat = pet_health_encoder.transform([[req.symptoms, req.recentFood]])

    # Match training numerical features: ["food_amount", "activity"]
    # Here I assumed food_amount = len(symptoms.split()) just for placeholder
    X_num = [[len(req.symptoms.split()), int(req.recentActivity)]]

    X = np.hstack([X_cat, X_num])

    pred = pet_health_model.predict(X)[0]
    # pred = pred.upper()
    print("risk", pred)
    return {"risk": pred}


@app.post("/recommend_pet_diet")
def recommend_pet_diet(req: PetDietRequest):
    X_cat = pet_diet_encoder.transform([[req.breed]])
    X_num = [[req.weight, req.activity]]
    X = np.hstack([X_cat, X_num])
    portion = pet_diet_model.predict(X)[0]
    food_type = pet_food_map.get(req.breed, "dry_kibble")
    print("risk", portion)
    print("risk", food_type)
    return {
        "recommended_portion_g": round(portion, 1),
        "recommended_food_type": food_type
    }


@app.get("/")
def root():
    return {"message": "FastAPI service running for urgency & pet comfort predictions"}
