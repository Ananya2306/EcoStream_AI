from streaming.state_manager import get_latest_state

def get_alerts():
    data = get_latest_state()

    if "aqi" not in data:
        return []

    if data["aqi"] > 200: # type: ignore
        return [{
            "message": "High AQI Alert",
            "severity": "critical"
        }]

    return []