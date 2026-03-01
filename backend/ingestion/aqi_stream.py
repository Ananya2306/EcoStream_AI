from streaming.state_manager import get_latest_state
from streaming.alerts import get_alerts

def get_stream_payload():
    """
    Combines live metrics + alerts
    into a single stream-ready response.
    """

    state = get_latest_state()
    alerts = get_alerts()

    return {
        "metrics": state,
        "alerts": alerts
    }