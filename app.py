import asyncio
from fastapi import FastAPI
from engine.runner import start_streams
from streaming.state_manager import get_state

app = FastAPI(title="EcoStream AI - Streaming Backend")

# ----------------------------
# Startup Event
# ----------------------------
@app.on_event("startup")
async def startup_event():
    print("🚀 Startup event triggered")
    asyncio.create_task(start_streams())

# ----------------------------
# API Endpoints
# ----------------------------
@app.get("/")
def health_check():
    return {"status": "EcoStream AI backend running"}

@app.get("/live-metrics")
def live_metrics():
    return get_state()