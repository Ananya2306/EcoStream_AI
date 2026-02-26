import asyncio
from streaming.transformations import process_stream_cycle
from ingestion.rss_stream import rss_stream_loop
from streaming.state_manager import update_news


# ----------------------------------------
# 1️⃣ Metrics Streaming Loop
# ----------------------------------------
async def metrics_stream_loop():
    """
    Continuously:
    - Generate AQI
    - Generate temperature
    - Compute stress
    - Evaluate alert
    - Update state
    """

    while True:
        aqi, temp, stress, alert = process_stream_cycle()

        print(
            f"[STREAM] AQI={aqi} | Temp={temp} | Stress={stress} | Alert={alert}"
        )

        await asyncio.sleep(3)


# ----------------------------------------
# 2️⃣ RSS Streaming Loop
# ----------------------------------------
async def news_stream_loop():
    """
    Continuously fetch RSS news and update state.
    """
    await rss_stream_loop(update_news)


# ----------------------------------------
# 3️⃣ Orchestrator
# ----------------------------------------
async def start_streams():
    """
    Start both streaming loops in parallel.
    """
    await asyncio.gather(
        metrics_stream_loop(),
        news_stream_loop()
    )