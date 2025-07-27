from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import os
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:5173"] for stricter setup
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Safe path resolution
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "model", "stampede_model.pkl")

# Load model
model = joblib.load(model_path)

# Root route (optional but helpful)
@app.get("/")
def root():
    return {"message": "Stampede prediction API is running."}

# Define input schema
class InputData(BaseModel):
    timestamp: str
    num_people: int
    area_sq_meters: float
    density_people_per_sq_meter: float
    average_speed_mps: float
    crowd_noise_db: float
    gate_congestion_level: str  # Will be mapped to int
    latitude: float
    longitude: float

# Prediction endpoint
@app.post("/predict")
def predict(data: InputData):
    # Mapping gate_congestion_level string to int
    level_map = {
        "low": 0,
        "medium": 1,
        "high": 2
    }

    level = level_map.get(data.gate_congestion_level.lower())
    if level is None:
        return {"error": "Invalid gate_congestion_level. Choose from: low, medium, high."}

    # Ensure the input matches the model's expected input order
    input_array = np.array([[  
        data.num_people,
        data.area_sq_meters,
        data.density_people_per_sq_meter,
        data.average_speed_mps,
        data.crowd_noise_db,
        level,
        data.latitude,
        data.longitude
    ]])

    # Make prediction
    prediction = model.predict(input_array)
    return {"is_stampede": bool(prediction[0])}
