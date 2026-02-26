"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface StressGaugeProps {
  score: number
  riskLevel: string
}

function getRiskColor(level: string): string {
  switch (level) {
    case "Severe":
      return "var(--gp-critical)"
    case "High":
      return "var(--gp-high)"
    case "Moderate":
      return "var(--gp-moderate)"
    default:
      return "var(--gp-safe)"
  }
}

function getRiskBg(level: string): string {
  switch (level) {
    case "Severe":
      return "bg-gp-critical/15 text-gp-critical border-gp-critical/30"
    case "High":
      return "bg-gp-high/15 text-gp-high border-gp-high/30"
    case "Moderate":
      return "bg-gp-moderate/15 text-gp-moderate border-gp-moderate/30"
    default:
      return "bg-gp-safe/15 text-gp-safe border-gp-safe/30"
  }
}

function AnimatedGaugeNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)
  const animRef = useRef<number | null>(null)
  const startRef = useRef(display)

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    startRef.current = display
    const start = performance.now()
    const duration = 800

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(startRef.current + (value - startRef.current) * eased)
      if (progress < 1) animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <>{display.toFixed(1)}</>
}

export function StressGauge({ score, riskLevel }: StressGaugeProps) {
  const color = getRiskColor(riskLevel)
  const circumference = 2 * Math.PI * 52
  const progress = Math.min(score / 100, 1)
  const dashOffset = circumference * (1 - progress * 0.75) // 270-degree arc

  return (
    <motion.div
      className="glass-panel rounded-xl p-4 flex flex-col items-center relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Scanner effect */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        <div
          className="absolute top-0 left-0 w-1/2 h-full animate-scanner opacity-[0.03]"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }}
        />
      </div>

      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 relative z-10">
        Environmental Stress
      </p>

      {/* SVG Gauge */}
      <div className="relative w-32 h-32 z-10">
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full -rotate-[135deg]"
        >
          {/* Background arc */}
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
            className="text-muted/30"
          />
          {/* Value arc */}
          <motion.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-mono font-bold tabular-nums"
            style={{ color }}
          >
            <AnimatedGaugeNumber value={score} />
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            / 100
          </span>
        </div>
      </div>

      {/* Risk Level Badge */}
      <motion.div
        key={riskLevel}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`mt-3 px-3 py-1 rounded-full text-xs font-mono font-medium border ${getRiskBg(riskLevel)} z-10`}
      >
        {riskLevel} Risk
      </motion.div>

      {/* Formula */}
      <p className="text-[9px] font-mono text-muted-foreground/50 mt-2 text-center z-10">
        {"0.6 AQI + 0.3 Temp + 0.1 Alert"}
      </p>
    </motion.div>
  )
}
