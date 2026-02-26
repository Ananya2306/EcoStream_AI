// GreenPulse AI – Environmental Intelligence Types

export interface LiveMetrics {
  aqi: number
  temperature: number
  stressScore: number
  riskLevel: "Low" | "Moderate" | "High" | "Severe"
  timestamp: string
}

export interface Alert {
  id: string
  message: string
  triggerCondition: string
  timestamp: string
  stressScoreAtTrigger: number
  severity: "warning" | "critical"
}

export interface RagResponse {
  answer: string
  citedStressScore: number
  citedNewsSnippet: string
  citedGuidelineSnippet: string
}

export interface SimulationResult {
  projectedAqi: number
  projectedStressScore: number
  riskReduction: number
  currentAqi: number
  currentStressScore: number
}

export interface StreamingStatus {
  pipeline: boolean
  rollingWindow: boolean
  joinEngine: boolean
  riskEngine: boolean
  ragIndex: boolean
}

export interface MetricHistory {
  aqi: number[]
  temperature: number[]
  stressScore: number[]
  timestamps: string[]
}
