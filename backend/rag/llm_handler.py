from rag.document_store import get_documents
def generate_response(question, context):

    docs = get_documents()

    location = context.get("location")
    aqi = context.get("aqi")
    stress = context.get("stress_score", 0)

    knowledge = docs[0]["content"]

    answer = f"""
Air quality in {location} is currently {aqi} AQI.

Environmental stress score is {stress}.

According to environmental guidelines:
{knowledge}
"""

    return {
        "answer": answer.strip(),
        "citedStressScore": stress,
        "citedNewsSnippet": f"Real-time environmental monitoring data for {location}.",
        "citedGuidelineSnippet": knowledge
    }