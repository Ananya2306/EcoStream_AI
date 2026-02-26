from datetime import datetime

state = {
    "location": "Noida",
    "aqi": 0,
    "temperature": 0,
    "stress": 0,
    "alert": False,
    "timestamp": None,
    "news": []
}

def update_state(aqi, temperature, stress, alert):
    state.update({
        "aqi": aqi,
        "temperature": temperature,
        "stress": stress,
        "alert": alert,
        "timestamp": datetime.utcnow()
    })

def update_news(news):
    state["news"] = news

def get_state():
    return state