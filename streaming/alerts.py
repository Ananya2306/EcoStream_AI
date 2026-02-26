from config import AQI_ALERT_THRESHOLD, STRESS_ALERT_THRESHOLD

def check_alert(aqi, stress):
    return aqi > AQI_ALERT_THRESHOLD or stress > STRESS_ALERT_THRESHOLD