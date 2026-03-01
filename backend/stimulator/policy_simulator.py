from streaming.state_manager import get_latest_state

def simulate_policy(reduction_percent):
    data = get_latest_state()

    if "aqi" not in data:
        return {"status": "no data"}

    projected_aqi = data["aqi"] * (1 - reduction_percent / 100 * 0.7)
    projected_stress = 0.6 * projected_aqi + 0.4 * data["temperature"] # type: ignore

    return {
        "currentAqi": data["aqi"],
        "projectedAqi": round(projected_aqi, 2),
        "projectedStressScore": round(projected_stress, 2)
    }