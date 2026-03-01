import requests
import time
import os
import random
from datetime import datetime

WAQI_TOKEN = os.getenv("WAQI_TOKEN")
CITY = "noida"

latest_state = {
    "location": "Noida",
    "aqi": 0,
    "temperature": 0,
    "stress_score": 0,
    "timestamp": None
}

def start_engine():
    global latest_state

    if not WAQI_TOKEN:
        print("❌ WAQI_TOKEN not set")
        return

    while True:
        try:
            url = f"https://api.waqi.info/feed/{CITY}/?token={WAQI_TOKEN}"
            response = requests.get(url).json()

            if response.get("status") != "ok":
                print("WAQI error:", response)
                time.sleep(15)
                continue

            data = response["data"]

            base_aqi = int(data["aqi"])
            aqi_value = base_aqi + random.randint(-2, 2)
            aqi_value = max(0, min(500, aqi_value))

            temperature_value = float(
                data.get("iaqi", {}).get("t", {}).get("v", 25)
            )

            stress = round(0.6 * aqi_value + 0.4 * temperature_value, 2)

            latest_state.update({
                "location": "Noida",
                "aqi": aqi_value,
                "temperature": temperature_value,
                "stress_score": stress,
                "timestamp": datetime.utcnow().isoformat()
            })

            print("Updated:", latest_state)

        except Exception as e:
            print("Engine error:", e)

        time.sleep(5)