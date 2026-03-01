import pathway as pw

# =========================
# Schema
# =========================
class InputSchema(pw.Schema): # type: ignore
    location: str
    aqi: int
    temperature: float
    timestamp: str


# =========================
# Streaming CSV Source
# =========================
source = pw.io.csv.read(
    "input.csv",
    schema=InputSchema,
    mode="streaming"
)

# =========================
# Stress Calculation
# =========================
result = source.select(
    location=source.location,
    aqi=source.aqi,
    temperature=source.temperature,
    stress_score=(0.6 * source.aqi + 0.4 * source.temperature),
    timestamp=source.timestamp
)

# =========================
# Write Output
# =========================
pw.io.csv.write(
    result,
    "output.csv"
)

pw.run()