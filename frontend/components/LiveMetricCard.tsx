"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts"

interface LiveMetricCardProps {
  label: string
  sublabel?: string
  value: number
  previousValue?: number
  unit: string
  color: string
  sparklineData: number[]
  icon: React.ReactNode
}

// Animated counter component
function AnimatedNumber({
  value,
  decimals = 1,
}: {
  value: number
  decimals?: number
}) {
  const [display, setDisplay] = useState(value)
  const animRef = useRef<number | null>(null)
  const startRef = useRef(display)

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    startRef.current = display
    const start = performance.now()
    const duration = 600

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      const current =
        startRef.current + (value - startRef.current) * eased
      setDisplay(current)
      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick)
      }
    }

    animRef.current = requestAnimationFrame(tick)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <span className="font-mono tabular-nums">
      {display.toFixed(decimals)}
    </span>
  )
}

export function LiveMetricCard({
  label,
  sublabel,
  value,
  previousValue,
  unit,
  color,
  sparklineData,
  icon,
}: LiveMetricCardProps) {
  const delta = previousValue !== undefined ? value - previousValue : 0
  const deltaUp = delta > 0
  const chartData = sparklineData.map((v, i) => ({ value: v, index: i }))

  // Determine if value just changed significantly
  const isFlashing = Math.abs(delta) > 5

  return (
    <motion.div
      className="glass-panel rounded-xl p-4 relative overflow-hidden group"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect on significant change */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              boxShadow: `inset 0 0 30px ${color}20, 0 0 20px ${color}10`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Scanner line effect */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        <div
          className="absolute top-0 left-0 w-1/2 h-full animate-scanner opacity-[0.03]"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-md"
              style={{ backgroundColor: `${color}15` }}
            >
              {icon}
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              {sublabel && (
                <p className="text-[10px] font-mono text-muted-foreground/60">
                  {sublabel}
                </p>
              )}
            </div>
          </div>
          {/* Delta indicator */}
          {previousValue !== undefined && (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: deltaUp ? 5 : -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                deltaUp
                  ? "text-gp-critical bg-gp-critical/10"
                  : "text-gp-safe bg-gp-safe/10"
              }`}
            >
              {deltaUp ? "+" : ""}
              {delta.toFixed(1)}
            </motion.div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1.5 mb-3">
          <span
            className="text-3xl font-mono font-bold tracking-tight"
            style={{ color }}
          >
            <AnimatedNumber value={value} />
          </span>
          <span className="text-sm font-mono text-muted-foreground">
            {unit}
          </span>
        </div>

        {/* Sparkline */}
        {chartData.length > 2 && (
          <div className="h-12 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <YAxis domain={["auto", "auto"]} hide />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  )
}
