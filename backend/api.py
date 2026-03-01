from fastapi import APIRouter
from streaming.state_manager import get_latest_state
from streaming.alerts import get_alerts
from stimulator.policy_simulator import simulate_policy
from rag.retriever import retrieve_context
from rag.llm_handler import generate_response

router = APIRouter()

@router.get("/live-metrics")
def live_metrics():
    return get_latest_state()

@router.get("/alerts")
def alerts():
    return get_alerts()

from pydantic import BaseModel

class SimulationInput(BaseModel):
    aqi: int
    temperature: float

@router.post("/simulate")
def simulate(data: SimulationInput):
    current_aqi = data.aqi
    current_temp = data.temperature

    # Example projection logic (you can tune later)
    projected_aqi = current_aqi * 0.9

    current_stress = current_aqi * 0.6
    projected_stress = projected_aqi * 0.6

    risk_reduction = (
        (current_stress - projected_stress) / current_stress * 100
        if current_stress != 0 else 0
    )

    return {
        "currentAqi": current_aqi,
        "projectedAqi": round(projected_aqi, 2),
        "currentStressScore": round(current_stress, 2),
        "projectedStressScore": round(projected_stress, 2),
        "riskReduction": round(risk_reduction, 2),
    }

from pydantic import BaseModel

class AskInput(BaseModel):
    question: str


@router.post("/ask")
def ask(data: AskInput):

    question = data.question

    context = retrieve_context(question)

    return generate_response(question, context)