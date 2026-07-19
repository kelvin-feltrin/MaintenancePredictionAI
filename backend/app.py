from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas import PredictionRequest
from model import predict

app = FastAPI(
    title="Maintenance Prediction AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://maintenance-prediction-ai-eight.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "status": "online",
        "model": "Random Forest"
    }

@app.post("/predict")
def prediction(request: PredictionRequest):
    return predict(request)