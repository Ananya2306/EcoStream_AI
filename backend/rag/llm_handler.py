def generate_response(question: str, context: dict):

    aqi = context.get("aqi")
    stress = context.get("stress_score")

    if aqi is None:
        return {
            "answer": "Environmental data currently unavailable.",
            "citedStressScore": None,
            "citedNewsSnippet": "Waiting for live environmental feed.",
            "citedGuidelineSnippet": "WHO guideline: AQI above 200 is hazardous for human health."
        }

    return {
        "answer": f"Current AQI in {context.get('location')} is {aqi}. Air quality is being monitored in real time.",
        "citedStressScore": stress,
        "citedNewsSnippet": "Real-time environmental monitoring data.",
        "citedGuidelineSnippet": "WHO guideline: AQI above 200 is hazardous for human health."
    }