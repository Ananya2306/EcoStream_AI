const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

// ================= LIVE METRICS =================
export async function fetchLiveMetrics() {
  const res = await fetch(`${API_BASE}/live-metrics`)
  if (!res.ok) throw new Error("Failed to fetch metrics")
  return res.json()
}

// ================= ALERTS =================
export async function fetchAlerts() {
  const res = await fetch(`${API_BASE}/alerts`)
  if (!res.ok) return []
  return res.json()
}

// ================= RAG =================
export async function askRag(question: string) {
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  })

  if (!res.ok) throw new Error("RAG failed")

  return res.json()
}

// ================= POLICY SIMULATION =================
export async function simulatePolicy(aqi: number, temperature: number) {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      aqi: Number(aqi),
      temperature: Number(temperature),
    }),
  })

  if (!res.ok) throw new Error("Simulation failed")

  return res.json()
}

export async function fetchLocationAQI(lat:number, lon:number) {

  const res = await fetch(
    `https://your-backend-url/aqi-location?lat=${lat}&lon=${lon}`
  )

  return res.json()
}