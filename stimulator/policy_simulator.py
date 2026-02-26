from streaming.state_manager import get_state
from config import TRAFFIC_AQI_CONTRIBUTION
from utils.helpers import percentage_change
from streaming.risk_engine import compute_stress

def simulate_traffic_reduction(reduction_percent: float):
    """
    Simulate AQI change if traffic reduces by X%.
    """

    state = get_state()

    current_aqi = state["aqi"]

    reduction_factor = TRAFFIC_AQI_CONTRIBUTION * (reduction_percent / 100)

    new_aqi = current_aqi - (current_aqi * reduction_factor)

    new_stress = compute_stress(new_aqi, state["temperature"])

    improvement = percentage_change(current_aqi, new_aqi)

    return {
        "current_aqi": current_aqi,
        "projected_aqi": round(new_aqi, 2),
        "projected_stress": new_stress,
        "improvement_percent": improvement
    }