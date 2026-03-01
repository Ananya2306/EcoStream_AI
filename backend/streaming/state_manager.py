import pandas as pd # type: ignore

def get_latest_state():
    try:
        df = pd.read_csv("output.csv")

        if df.empty:
            return {"status": "no data yet"}

        latest = df.iloc[-1]

        return {
            "location": latest["location"],
            "aqi": float(latest["aqi"]),
            "temperature": float(latest["temperature"]),
            "stress_score": float(latest["stress_score"]),
            "timestamp": latest["timestamp"]
        }

    except Exception as e:
        return {"error": str(e)}