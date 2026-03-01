from utils.helpers import normalize
from config import AQI_WEIGHT, TEMP_WEIGHT

def compute_stress(aqi, temperature):
    norm_aqi = normalize(aqi, 500)
    norm_temp = normalize(temperature, 50)

    stress_score = (AQI_WEIGHT * norm_aqi) + (TEMP_WEIGHT * norm_temp)

    return round(stress_score * 100, 2)