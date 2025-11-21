from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import init_db, get_db, Reading
from mqtt_service import start_mqtt
from typing import List
from pydantic import BaseModel
from sqlalchemy import func
from datetime import datetime, timedelta
import os

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Init DB and MQTT
@app.on_event("startup")
def startup_event():
    init_db()
    start_mqtt()

# Pydantic models
class ReadingSchema(BaseModel):
    id: int
    timestamp: datetime
    topic: str
    value: float

    class Config:
        from_attributes = True

@app.get("/api/current", response_model=List[ReadingSchema])
def get_current_readings(db: Session = Depends(get_db)):
    # Get latest reading for each topic
    # This is a simple implementation, might need optimization for large datasets
    # For now, we just grab the last few readings
    
    # Distinct topics approach or just latest 10
    readings = db.query(Reading).order_by(Reading.timestamp.desc()).limit(10).all()
    return readings

@app.get("/api/history/{sensor_type}", response_model=List[ReadingSchema])
def get_history(sensor_type: str, db: Session = Depends(get_db)):
    # sensor_type e.g. "temperature" or "humidity"
    # Assuming topic format "home/sensor/temperature"
    topic = f"home/sensor/{sensor_type}"
    since = datetime.now() - timedelta(hours=8)
    readings = db.query(Reading).filter(Reading.topic == topic, Reading.timestamp >= since).order_by(Reading.timestamp.asc()).all()
    return readings

class StatsSchema(BaseModel):
    avg: float | None
    min: float | None
    max: float | None

@app.get("/api/stats/{sensor_type}", response_model=StatsSchema)
def get_stats(sensor_type: str, db: Session = Depends(get_db)):
    topic = f"home/sensor/{sensor_type}"
    since = datetime.now() - timedelta(hours=24)
    
    result = db.query(
        func.avg(Reading.value).label("avg"),
        func.min(Reading.value).label("min"),
        func.max(Reading.value).label("max")
    ).filter(Reading.topic == topic, Reading.timestamp >= since).first()
    
    return {
        "avg": result.avg,
        "min": result.min,
        "max": result.max
    }

# Serve Frontend (We will build this later, but setting up the mount)
# We need to check if the directory exists to avoid errors during dev
# Serve Frontend
# In Docker, we copy dist to ./static. Locally, it might be in ../frontend/dist
if os.path.exists("./static"):
    app.mount("/", StaticFiles(directory="./static", html=True), name="static")
elif os.path.exists("../frontend/dist"):
    app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")
else:
    print("Frontend build not found. API only mode.")

