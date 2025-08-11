# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to specific domain in prod
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


class TextRequest(BaseModel):
    text: str


class PetComfortRequest(BaseModel):
    temperature: float
    humidity: float
    feeding_interval: int
    activity_level: int


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


@app.get("/")
def root():
    return {"message": "FastAPI service running for urgency & pet comfort predictions"}
