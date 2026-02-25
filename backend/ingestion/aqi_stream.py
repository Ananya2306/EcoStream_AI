# ingestion/aqi_stream.py

import pathway as pw
import random
import time
from datetime import datetime

def generate_aqi():
    """Simulates AQI values continuously"""
    while True:
        yield {
            "location": "Noida",
            "aqi": random.randint(80, 400),
            "timestamp": datetime.utcnow()
        }
        time.sleep(3)

def aqi_stream():
    schema = pw.Schema.from_columns(
        location=str,
        aqi=int,
        timestamp=pw.DateTimeUtc
    )

    return pw.io.python.read(
        generate_aqi,
        schema=schema,
        autocommit_duration_ms=1000
    )