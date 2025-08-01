# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()

# Load model and embedder at startup
package = joblib.load('model.pkl')
clf = package['classifier']
embedder = package['embedder']


class TextRequest(BaseModel):
    text: str


@app.post('/predict_urgency')
def predict_urgency(req: TextRequest):
    text = req.text.lower()
    embedding = embedder.encode([text])
    prediction = clf.predict(embedding)[0]
    return {'urgency': prediction}
