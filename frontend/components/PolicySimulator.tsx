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
  }, [value])

  return <>{display ? display.toFixed(1) : "0.0"}</>
}

function ComparisonCard({
  current,
  projected,
  unit,
  improved,
}: {
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
        <p className="text-lg font-mono font-bold tabular-nums">
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

  const liveMetrics = useEnvironmentalStore((s) => s.liveMetrics)

  // 🔥 THIS WAS MISSING / WRONG BEFORE
  const handleSimulate = useCallback(
    async (value: number) => {
      if (!liveMetrics) return

      if (value === 0) {
        setSimulationResult(null)
        return
      }

      setLoading(true)
      try {
        const result = await simulatePolicy(
          liveMetrics.aqi,
          liveMetrics.temperature
        )

        setSimulationResult(result)
      } catch (err) {
        console.error("Simulation error:", err)
      } finally {
        setLoading(false)
      }
    },
    [liveMetrics, setSimulationResult]
  )
  useEffect(() => {
  if (!liveMetrics) return
  if (trafficReduction === 0) return

  handleSimulate(trafficReduction)
}, [liveMetrics, trafficReduction, handleSimulate])
  // Debounce
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSliderChange(value: number[]) {
    const val = value[0]
    setTrafficReduction(val)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      handleSimulate(val)
    }, 300)
  }

  return (
    <motion.div
      className="glass-panel rounded-xl p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute top-3 right-3">
        <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-gp-cyan/10 text-gp-cyan border border-gp-cyan/20">
          Simulation Mode
        </span>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <FlaskConical className="h-4 w-4 text-gp-cyan" />
        <span className="text-xs font-mono uppercase tracking-wider">
          Policy Simulator
        </span>
      </div>

      <p className="text-[10px] font-mono text-muted-foreground mb-4">
        Not affecting live stream
      </p>

      {/* Slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono">Traffic Reduction</span>
          <motion.span
            key={trafficReduction}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-sm font-mono font-bold text-gp-cyan"
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
        />
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-6 text-xs font-mono text-muted-foreground">
          Computing projection...
        </div>
      )}

      {!loading && simulationResult && (
        <div className="space-y-4">
          <ComparisonCard
            current={simulationResult.currentAqi}
            projected={simulationResult.projectedAqi}
            unit="AQI"
            improved={
              simulationResult.projectedAqi <
              simulationResult.currentAqi
            }
          />

          <ComparisonCard
            current={simulationResult.currentStressScore}
            projected={simulationResult.projectedStressScore}
            unit="Score"
            improved={
              simulationResult.projectedStressScore <
              simulationResult.currentStressScore
            }
          />

          <div className="text-center text-gp-safe font-mono font-bold">
            <AnimatedSimNumber value={simulationResult.riskReduction} />%
            Risk Reduction
          </div>
        </div>
      )}
    </motion.div>
  )
}