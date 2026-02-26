import { create } from "zustand"
import type {
  LiveMetrics,
  Alert,
  RagResponse,
  SimulationResult,
  StreamingStatus,
  MetricHistory,
} from "@/types/environmental"

const MAX_HISTORY = 100

interface EnvironmentalState {
  liveMetrics: LiveMetrics | null
  previousMetrics: LiveMetrics | null
  alerts: Alert[]
  alertHistory: Alert[]
  ragResponse: RagResponse | null
  ragLoading: boolean
  simulationResult: SimulationResult | null
  lastUpdated: Date | null
  streamingStatus: StreamingStatus
  metricHistory: MetricHistory

  // Actions
  setLiveMetrics: (metrics: LiveMetrics) => void
  setAlerts: (alerts: Alert[]) => void
  setRagResponse: (response: RagResponse | null) => void
  setRagLoading: (loading: boolean) => void
  setSimulationResult: (result: SimulationResult | null) => void
}

export const useEnvironmentalStore = create<EnvironmentalState>((set, get) => ({
  liveMetrics: null,
  previousMetrics: null,
  alerts: [],
  alertHistory: [],
  ragResponse: null,
  ragLoading: false,
  simulationResult: null,
  lastUpdated: null,
  streamingStatus: {
    pipeline: true,
    rollingWindow: true,
    joinEngine: true,
    riskEngine: true,
    ragIndex: true,
  },
  metricHistory: {
    aqi: [],
    temperature: [],
    stressScore: [],
    timestamps: [],
  },

  setLiveMetrics: (metrics) => {
    const state = get()
    const history = state.metricHistory

    const now = new Date(metrics.timestamp).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

    set({
      previousMetrics: state.liveMetrics,
      liveMetrics: metrics,
      lastUpdated: new Date(),
      metricHistory: {
        aqi: [...history.aqi, metrics.aqi].slice(-MAX_HISTORY),
        temperature: [...history.temperature, metrics.temperature].slice(-MAX_HISTORY),
        stressScore: [...history.stressScore, metrics.stressScore].slice(-MAX_HISTORY),
        timestamps: [...history.timestamps, now].slice(-MAX_HISTORY),
      },
    })
  },

  setAlerts: (alerts) => {
    const state = get()
    const newAlerts = alerts.filter(
      (a) => !state.alertHistory.find((h) => h.id === a.id)
    )
    set({
      alerts,
      alertHistory: [...newAlerts, ...state.alertHistory].slice(0, 50),
    })
  },

  setRagResponse: (response) => set({ ragResponse: response }),
  setRagLoading: (loading) => set({ ragLoading: loading }),
  setSimulationResult: (result) => set({ simulationResult: result }),
}))
