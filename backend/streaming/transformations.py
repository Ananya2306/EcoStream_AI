def calculate_stress(aqi: float, temperature: float):
    return round(0.6 * aqi + 0.4 * temperature, 2)