import requests # type: ignore
import os
import re

from streaming.state_manager import get_latest_state

WAQI_TOKEN = os.getenv("WAQI_TOKEN")


def extract_city(question: str):
    """
    Very simple city extractor
    """
    words = question.lower().split()

    skip_words = {
        "what", "is", "the", "aqi", "in", "of", "today",
        "air", "quality", "pollution", "how", "bad"
    }

    for word in words:
        if word not in skip_words and len(word) > 2:
            return word

    return None


def fetch_city_aqi(city):

    try:

        url = f"https://api.waqi.info/feed/{city}/?token={WAQI_TOKEN}"

        response = requests.get(url).json()

        if response["status"] != "ok":
            return None

        data = response["data"]

        return {
            "location": city.title(),
            "aqi": data["aqi"],
            "temperature": data.get("iaqi", {}).get("t", {}).get("v", 0),
            "stress_score": round(0.6 * data["aqi"], 2)
        }

    except Exception as e:
        print("City AQI fetch error:", e)
        return None


def retrieve_context(question: str):

    city = extract_city(question)

    if city:
        city_data = fetch_city_aqi(city)

        if city_data:
            return city_data

    # fallback → live engine
    return get_latest_state()