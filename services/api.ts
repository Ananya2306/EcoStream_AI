// GreenPulse AI – API Service with Mock Data
// Replace mock responses with real API calls when backend is available

import type { LiveMetrics, Alert, RagResponse, SimulationResult } from "@/types/environmental"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ""

// --- Mock data generators for demo ---

let mockAqi = 145
let mockTemp = 32.5
let mockTick = 0

function generateMockMetrics(): LiveMetrics {
  mockTick++
  // Simulate realistic AQI fluctuations with occasional spikes
  const spike = mockTick % 40 === 0 ? Math.random() * 150 : 0
  mockAqi = Math.max(20, Math.min(400, mockAqi + (Math.random() - 0.48) * 15 + spike))
  mockTemp = Math.max(15, Math.min(48, mockTemp + (Math.random() - 0.5) * 1.2))

  const stressScore = 0.6 * (mockAqi / 500) * 100 + 0.3 * (mockTemp / 50) * 100 + 0.1 * (mockAqi > 200 ? 80 : 10)
  const clampedStress = Math.min(100, Math.max(0, stressScore))

  let riskLevel: LiveMetrics["riskLevel"] = "Low"
  if (clampedStress > 75) riskLevel = "Severe"
  else if (clampedStress > 50) riskLevel = "High"
  else if (clampedStress > 30) riskLevel = "Moderate"

  return {
    aqi: Math.round(mockAqi * 10) / 10,
    temperature: Math.round(mockTemp * 10) / 10,
    stressScore: Math.round(clampedStress * 10) / 10,
    riskLevel,
    timestamp: new Date().toISOString(),
  }
}

function generateMockAlerts(): Alert[] {
  if (mockAqi > 200) {
    return [
      {
        id: `alert-${Date.now()}`,
        message: "Critical AQI Spike Detected",
        triggerCondition: `AQI exceeded 200 threshold (current: ${Math.round(mockAqi)})`,
        timestamp: new Date().toISOString(),
        stressScoreAtTrigger: Math.round(mockAqi * 0.6 + mockTemp * 0.3),
        severity: mockAqi > 300 ? "critical" : "warning",
      },
    ]
  }
  return []
}

// --- API Functions ---

export async function fetchLiveMetrics(): Promise<LiveMetrics> {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/live-metrics`)
    return res.json()
  }
  // Mock response
  return generateMockMetrics()
}

export async function fetchAlerts(): Promise<Alert[]> {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/alerts`)
    return res.json()
  }
  return generateMockAlerts()
}

export async function askRag(question: string): Promise<RagResponse> {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    })
    return res.json()
  }
  // Mock RAG response
  const stress = Math.round(mockAqi * 0.6 + mockTemp * 0.3)
  return {
    answer: `Based on the current environmental data, the AQI is at ${Math.round(mockAqi)} with a temperature of ${mockTemp.toFixed(1)}°C. The computed environmental stress score is ${stress}. ${mockAqi > 150 ? "Air quality is degraded and outdoor activities should be limited. Vulnerable populations should remain indoors." : "Air quality is within acceptable ranges. Normal outdoor activities can continue with standard precautions."}`,
    citedStressScore: stress,
    citedNewsSnippet: mockAqi > 150
      ? "Recent reports indicate elevated particulate matter levels across the monitoring region due to industrial activity and weather patterns trapping pollutants."
      : "Environmental monitoring stations report stable air quality conditions with normal seasonal variations.",
    citedGuidelineSnippet: mockAqi > 150
      ? "WHO guideline: When AQI exceeds 150, sensitive groups should reduce prolonged outdoor exertion. AQI above 200 warrants public health advisories."
      : "WHO guideline: AQI levels below 100 are generally considered satisfactory. Routine outdoor activities are safe for most individuals.",
  }
}

export async function simulatePolicy(trafficReduction: number): Promise<SimulationResult> {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trafficReduction }),
    })
    return res.json()
  }
  // Mock simulation
  const reduction = trafficReduction / 100
  const projectedAqi = Math.max(10, mockAqi * (1 - reduction * 0.7))
  const projectedStress = 0.6 * (projectedAqi / 500) * 100 + 0.3 * (mockTemp / 50) * 100 + 0.1 * 10
  const currentStress = 0.6 * (mockAqi / 500) * 100 + 0.3 * (mockTemp / 50) * 100 + 0.1 * (mockAqi > 200 ? 80 : 10)

  return {
    projectedAqi: Math.round(projectedAqi * 10) / 10,
    projectedStressScore: Math.round(Math.min(100, projectedStress) * 10) / 10,
    riskReduction: Math.round(((currentStress - projectedStress) / currentStress) * 100 * 10) / 10,
    currentAqi: Math.round(mockAqi * 10) / 10,
    currentStressScore: Math.round(Math.min(100, currentStress) * 10) / 10,
  }
}
