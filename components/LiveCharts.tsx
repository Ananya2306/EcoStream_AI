"use client"

import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import { useEnvironmentalStore } from "@/store/useEnvironmentalStore"

function ChartPanel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      className="glass-panel rounded-xl p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gp-safe opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gp-safe" />
        </span>
      </div>
      {children}
    </motion.div>
  )
}

const chartTooltipStyle = {
  backgroundColor: "oklch(0.14 0.012 240)",
  border: "1px solid oklch(0.3 0.02 240 / 0.5)",
  borderRadius: "8px",
  fontSize: "11px",
  fontFamily: "var(--font-mono)",
  color: "oklch(0.93 0.01 240)",
}

const gridStyle = { stroke: "oklch(0.24 0.02 240 / 0.4)" }

export function LiveCharts() {
  const history = useEnvironmentalStore((s) => s.metricHistory)

  // Prepare data - show last 60 points
  const dataLength = Math.min(history.timestamps.length, 60)
  const startIdx = Math.max(0, history.timestamps.length - dataLength)

  const timeseriesData = history.timestamps.slice(startIdx).map((ts, i) => ({
    time: ts,
    aqi: history.aqi[startIdx + i],
    temperature: history.temperature[startIdx + i],
    stress: history.stressScore[startIdx + i],
  }))

  const correlationData = history.aqi.slice(startIdx).map((aqi, i) => ({
    aqi,
    temperature: history.temperature[startIdx + i],
    stress: history.stressScore[startIdx + i],
  }))

  if (timeseriesData.length < 3) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {["AQI Time Series", "Temperature Time Series", "Stress Score Trend", "AQI vs Temperature"].map((title) => (
          <ChartPanel key={title} title={title}>
            <div className="h-48 flex items-center justify-center">
              <p className="text-xs font-mono text-muted-foreground animate-pulse">
                Collecting stream data...
              </p>
            </div>
          </ChartPanel>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* AQI Time Series */}
      <ChartPanel title="AQI Time Series">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeseriesData}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 9, fill: "oklch(0.6 0.01 240)" }}
                interval="preserveStartEnd"
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "oklch(0.6 0.01 240)" }}
                tickLine={false}
                width={35}
              />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line
                type="monotone"
                dataKey="aqi"
                stroke="var(--gp-cyan)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      {/* Temperature Time Series */}
      <ChartPanel title="Temperature Time Series">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeseriesData}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 9, fill: "oklch(0.6 0.01 240)" }}
                interval="preserveStartEnd"
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "oklch(0.6 0.01 240)" }}
                tickLine={false}
                width={35}
              />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="var(--gp-high)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      {/* Stress Score Trend */}
      <ChartPanel title="Stress Score Trend">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeseriesData}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 9, fill: "oklch(0.6 0.01 240)" }}
                interval="preserveStartEnd"
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "oklch(0.6 0.01 240)" }}
                tickLine={false}
                width={35}
                domain={[0, 100]}
              />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line
                type="monotone"
                dataKey="stress"
                stroke="var(--gp-neon)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      {/* Correlation Chart */}
      <ChartPanel title="AQI vs Temperature Correlation">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis
                type="number"
                dataKey="aqi"
                name="AQI"
                tick={{ fontSize: 9, fill: "oklch(0.6 0.01 240)" }}
                tickLine={false}
              />
              <YAxis
                type="number"
                dataKey="temperature"
                name="Temp"
                tick={{ fontSize: 9, fill: "oklch(0.6 0.01 240)" }}
                tickLine={false}
                width={35}
              />
              <ZAxis
                type="number"
                dataKey="stress"
                range={[20, 100]}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value: number, name: string) => [
                  value.toFixed(1),
                  name,
                ]}
              />
              <Scatter
                data={correlationData}
                fill="var(--gp-cyan)"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>
    </div>
  )
}
