# ingestion/weather_stream.py

import pathway as pw
import random
import time
from datetime import datetime

def generate_weather():
    """Simulates live temperature stream"""
    while True:
        yield {
            "location": "Noida",
            "temperature": round(random.uniform(20, 45), 2),
            "timestamp": datetime.utcnow()
        }
        time.sleep(5)

def weather_stream():
    schema = pw.Schema.from_columns(
        location=str,
        temperature=float,
        timestamp=pw.DateTimeUtc
    )

    return pw.io.python.read(
        generate_weather,
        schema=schema,
        autocommit_duration_ms=1000
    )