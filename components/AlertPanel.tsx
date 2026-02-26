"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Clock } from "lucide-react"
import { useEnvironmentalStore } from "@/store/useEnvironmentalStore"
import type { Alert } from "@/types/environmental"

function AlertItem({ alert }: { alert: Alert }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0"
    >
      <AlertTriangle className="h-4 w-4 text-gp-critical shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-mono text-foreground">{alert.message}</p>
        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
          {alert.triggerCondition}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(alert.timestamp).toLocaleTimeString()}
          </span>
          <span className="text-[10px] font-mono text-gp-critical">
            Stress: {alert.stressScoreAtTrigger}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export function AlertPanel() {
  const alerts = useEnvironmentalStore((s) => s.alerts)
  const alertHistory = useEnvironmentalStore((s) => s.alertHistory)
  const [showHistory, setShowHistory] = useState(false)
  const hasAlert = alerts.length > 0

  return (
    <motion.div
      className={`glass-panel rounded-xl p-4 relative overflow-hidden transition-colors duration-500 ${
        hasAlert ? "border-gp-critical/40" : "border-gp-safe/20"
      }`}
      style={
        hasAlert
          ? {
              borderColor: "var(--gp-critical)",
              boxShadow: "0 0 20px oklch(0.6 0.22 25 / 0.1), inset 0 0 20px oklch(0.6 0.22 25 / 0.05)",
            }
          : undefined
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Pulsing border for active alerts */}
      {hasAlert && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-gp-critical/50 pointer-events-none"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          {hasAlert ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gp-critical opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-gp-critical" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-gp-critical font-medium">
                Active Alert
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4 text-gp-safe" />
              <span className="text-xs font-mono uppercase tracking-wider text-gp-safe">
                All Clear
              </span>
            </>
          )}
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          Event Trigger Layer
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {hasAlert ? (
            <motion.div
              key="alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {alerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="safe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-3 text-center"
            >
              <p className="text-sm font-mono text-gp-safe/80">
                No Active Environmental Threat
              </p>
              <p className="text-[10px] font-mono text-muted-foreground mt-1">
                All parameters within acceptable ranges
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* History Drawer */}
      {alertHistory.length > 0 && (
        <div className="relative z-10 mt-3 pt-3 border-t border-border/50">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            {showHistory ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            Alert History ({alertHistory.length})
          </button>
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 max-h-40 overflow-y-auto">
                  {alertHistory.slice(0, 10).map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
