from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import threading
from pydantic import BaseModel
from engine.runner import start_engine, latest_state

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🚀 THIS PART IS CRITICAL
@app.on_event("startup")
def launch_engine():
    threading.Thread(target=start_engine, daemon=True).start()


@app.get("/live-metrics")
def live_metrics():
    return latest_state


@app.get("/alerts")
def alerts():
    return []



class SimulationInput(BaseModel):
    aqi: int
    temperature: float


@app.post("/simulate")
def simulate(data: SimulationInput):
    current_aqi = data.aqi
    current_temp = data.temperature

    # Example projection logic (10% AQI reduction)
    projected_aqi = round(current_aqi * 0.9, 2)

    current_stress = round(0.6 * current_aqi + 0.4 * current_temp, 2)
    projected_stress = round(0.6 * projected_aqi + 0.4 * current_temp, 2)

    risk_reduction = round(
        ((current_stress - projected_stress) / current_stress) * 100,
        2
    ) if current_stress != 0 else 0

    return {
        "currentAqi": current_aqi,
        "projectedAqi": projected_aqi,
        "currentStressScore": current_stress,
        "projectedStressScore": projected_stress,
        "riskReduction": risk_reduction,
    }
    
from rag.retriever import retrieve_context
from rag.llm_handler import generate_response


class AskRequest(BaseModel):
    question: str


@app.post("/ask")
def ask(data: AskRequest):

    context = retrieve_context(data.question)
    response = generate_response(data.question, context)

    return response

