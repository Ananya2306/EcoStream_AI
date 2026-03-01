from streaming.transformations import calculate_stress

def process_data(location, aqi, temperature, timestamp):
    stress = calculate_stress(aqi, temperature)

    return {
        "location": location,
        "aqi": aqi,
        "temperature": temperature,
        "stress_score": stress,
        "timestamp": timestamp
    }