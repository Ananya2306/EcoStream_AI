"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Sliders, FlaskConical, TrendingDown, ArrowRight } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useEnvironmentalStore } from "@/store/useEnvironmentalStore"
import { simulatePolicy } from "@/services/api"

function AnimatedSimNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)
  const animRef = useRef<number | null>(null)
  const startRef = useRef(display)

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    startRef.current = display
    const start = performance.now()
    const duration = 500

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

function ComparisonCard({
  label,
  current,
  projected,
  unit,
  improved,
}: {
  label: string
  current: number
  projected: number
  unit: string
  improved: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 text-center">
        <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">
          Current
        </p>
        <p className="text-lg font-mono font-bold text-foreground tabular-nums">
          <AnimatedSimNumber value={current} />
        </p>
        <p className="text-[10px] font-mono text-muted-foreground">{unit}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 text-center">
        <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">
          Projected
        </p>
        <p
          className={`text-lg font-mono font-bold tabular-nums ${
            improved ? "text-gp-safe" : "text-gp-high"
          }`}
        >
          <AnimatedSimNumber value={projected} />
        </p>
        <p className="text-[10px] font-mono text-muted-foreground">{unit}</p>
      </div>
    </div>
  )
}

export function PolicySimulator() {
  const [trafficReduction, setTrafficReduction] = useState(0)
  const [loading, setLoading] = useState(false)
  const simulationResult = useEnvironmentalStore((s) => s.simulationResult)
  const setSimulationResult = useEnvironmentalStore(
    (s) => s.setSimulationResult
  )

  const handleSimulate = useCallback(async (value: number) => {
    if (value === 0) {
      setSimulationResult(null)
      return
    }
    setLoading(true)
    try {
      const result = await simulatePolicy(value)
      setSimulationResult(result)
    } catch {
      // handle error silently
    } finally {
      setLoading(false)
    }
  }, [setSimulationResult])

  // Debounce simulation calls
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSliderChange(value: number[]) {
    const val = value[0]
    setTrafficReduction(val)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => handleSimulate(val), 300)
  }

  return (
    <motion.div
      className="glass-panel rounded-xl p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Simulation mode badge */}
      <div className="absolute top-3 right-3">
        <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-gp-cyan/10 text-gp-cyan border border-gp-cyan/20">
          Simulation Mode
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <FlaskConical className="h-4 w-4 text-gp-cyan" />
        <span className="text-xs font-mono uppercase tracking-wider text-foreground">
          Policy Simulator
        </span>
      </div>
      <p className="text-[10px] font-mono text-muted-foreground mb-4">
        Not affecting live stream
      </p>

      {/* Slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-mono text-secondary-foreground">
              Traffic Reduction
            </span>
          </div>
          <motion.span
            key={trafficReduction}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-sm font-mono font-bold text-gp-cyan tabular-nums"
          >
            {trafficReduction}%
          </motion.span>
        </div>
        <Slider
          value={[trafficReduction]}
          onValueChange={handleSliderChange}
          max={50}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[9px] font-mono text-muted-foreground">
            0%
          </span>
          <span className="text-[9px] font-mono text-muted-foreground">
            50%
          </span>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-gp-cyan animate-pulse" />
            Computing projection...
          </div>
        </div>
      )}

      {!loading && simulationResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Comparison Cards */}
          <div className="space-y-3">
            <ComparisonCard
              label="AQI"
              current={simulationResult.currentAqi}
              projected={simulationResult.projectedAqi}
              unit="AQI"
              improved={simulationResult.projectedAqi < simulationResult.currentAqi}
            />
            <div className="h-px bg-border/50" />
            <ComparisonCard
              label="Stress"
              current={simulationResult.currentStressScore}
              projected={simulationResult.projectedStressScore}
              unit="Score"
              improved={
                simulationResult.projectedStressScore <
                simulationResult.currentStressScore
              }
            />
          </div>

          {/* Risk Reduction */}
          <div className="flex items-center justify-center gap-2 py-2 rounded-lg bg-gp-safe/5 border border-gp-safe/10">
            <TrendingDown className="h-4 w-4 text-gp-safe" />
            <span className="text-sm font-mono font-bold text-gp-safe tabular-nums">
              <AnimatedSimNumber value={simulationResult.riskReduction} />%
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Risk Reduction
            </span>
          </div>
        </motion.div>
      )}

      {!loading && !simulationResult && trafficReduction === 0 && (
        <div className="text-center py-6">
          <p className="text-xs font-mono text-muted-foreground/50">
            Adjust the slider to simulate traffic policy impact
          </p>
        </div>
      )}
    </motion.div>
  )
}
