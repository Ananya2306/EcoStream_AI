"use client"

import { useEffect, useCallback } from "react"
import {
  Wind,
  Thermometer,
  Globe,
} from "lucide-react"
import { useEnvironmentalStore } from "@/store/useEnvironmentalStore"
import { fetchLiveMetrics, fetchAlerts } from "@/services/api"
import { StreamingStatusBar } from "@/components/StreamingStatusBar"
import { LiveMetricCard } from "@/components/LiveMetricCard"
import { StressGauge } from "@/components/StressGauge"
import { AlertPanel } from "@/components/AlertPanel"
import { LiveCharts } from "@/components/LiveCharts"
import { RagChat } from "@/components/RagChat"
import { PolicySimulator } from "@/components/PolicySimulator"
import { LastUpdated } from "@/components/LastUpdated"

const REFRESH_INTERVAL = 3000

function getAqiColor(aqi: number): string {
  if (aqi > 200) return "var(--gp-critical)"
  if (aqi > 100) return "var(--gp-high)"
  if (aqi > 50) return "var(--gp-moderate)"
  return "var(--gp-safe)"
}

export default function Dashboard() {
  const liveMetrics = useEnvironmentalStore((s) => s.liveMetrics)
  const previousMetrics = useEnvironmentalStore((s) => s.previousMetrics)
  const setLiveMetrics = useEnvironmentalStore((s) => s.setLiveMetrics)
  const setAlerts = useEnvironmentalStore((s) => s.setAlerts)
  const metricHistory = useEnvironmentalStore((s) => s.metricHistory)

  const fetchData = useCallback(async () => {
    try {
      const [metrics, alerts] = await Promise.all([
        fetchLiveMetrics(),
        fetchAlerts(),
      ])
      setLiveMetrics(metrics)
      setAlerts(alerts)
    } catch {
      // Silently handle - streaming system will retry
    }
  }, [setLiveMetrics, setAlerts])

  // Auto-refresh every 3 seconds
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(var(--gp-neon) 1px, transparent 1px), linear-gradient(90deg, var(--gp-neon) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 py-4 lg:px-6 lg:py-6">
        {/* Header */}
        <header className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gp-safe/10 border border-gp-safe/20">
              <Globe className="h-5 w-5 text-gp-safe" />
            </div>
            <div>
              <h1 className="text-xl font-mono font-bold text-foreground tracking-tight">
                GreenPulse AI
              </h1>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                Real-Time Environmental Intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LastUpdated />
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-gp-safe">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gp-safe opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gp-safe" />
              </span>
              LIVE
            </div>
          </div>
        </header>

        {/* Section A: System Status Bar */}
        <section className="mb-6" aria-label="System Status">
          <StreamingStatusBar />
        </section>

        {/* Section B: Live Metrics Grid */}
        <section className="mb-6" aria-label="Live Metrics">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <LiveMetricCard
              label="Live AQI"
              sublabel="5-min Rolling Avg"
              value={liveMetrics?.aqi ?? 0}
              previousValue={previousMetrics?.aqi}
              unit="AQI"
              color={liveMetrics ? getAqiColor(liveMetrics.aqi) : "var(--gp-safe)"}
              sparklineData={metricHistory.aqi}
              icon={<Wind className="h-4 w-4" style={{ color: liveMetrics ? getAqiColor(liveMetrics.aqi) : "var(--gp-safe)" }} />}
            />
            <LiveMetricCard
              label="Temperature"
              sublabel="Rolling Average"
              value={liveMetrics?.temperature ?? 0}
              previousValue={previousMetrics?.temperature}
              unit={"\u00B0C"}
              color="var(--gp-high)"
              sparklineData={metricHistory.temperature}
              icon={<Thermometer className="h-4 w-4" style={{ color: "var(--gp-high)" }} />}
            />
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                <StressGauge
                  score={liveMetrics?.stressScore ?? 0}
                  riskLevel={liveMetrics?.riskLevel ?? "Low"}
                />
                <AlertPanel />
              </div>
            </div>
          </div>
        </section>

        {/* Section C: Streaming Visualization */}
        <section className="mb-6" aria-label="Streaming Charts">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border/50" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Streaming Visualization
            </span>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <LiveCharts />
        </section>

        {/* Section E & F: RAG Chat + Policy Simulator */}
        <section aria-label="Intelligence and Simulation">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border/50" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Intelligence Layer
            </span>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <RagChat />
            </div>
            <PolicySimulator />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-border/30 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[9px] font-mono text-muted-foreground/40">
            Powered by Pathway Streaming Engine
          </p>
          <p className="text-[9px] font-mono text-muted-foreground/40">
            Incremental computation pipeline refreshing every 3s
          </p>
        </footer>
      </div>
    </div>
  )
}
