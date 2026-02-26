# rolling windows, joins
from ingestion.aqi_stream import generate_aqi
from ingestion.weather_stream import generate_temperature
from streaming.risk_engine import compute_stress
from streaming.alerts import check_alert
from streaming.state_manager import update_state

def process_stream_cycle():
    """
    Simulates one streaming cycle:
    - Ingest AQI
    - Ingest temperature
    - Compute stress
    - Evaluate alert
    - Update state
    """

    aqi = generate_aqi()
    temperature = generate_temperature()

    stress = compute_stress(aqi, temperature)
    alert = check_alert(aqi, stress)

    update_state(aqi, temperature, stress, alert)

    return aqi, temperature, stress, alert