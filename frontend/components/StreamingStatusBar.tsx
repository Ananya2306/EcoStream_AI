"use client"

import { motion } from "framer-motion"
import {
  Activity,
  Layers,
  Merge,
  ShieldAlert,
  BookOpen,
} from "lucide-react"
import { useEnvironmentalStore } from "@/store/useEnvironmentalStore"

const STATUS_ITEMS = [
  { key: "pipeline", label: "Pathway Pipeline", icon: Activity },
  { key: "rollingWindow", label: "Rolling Window", icon: Layers },
  { key: "joinEngine", label: "Join Engine", icon: Merge },
  { key: "riskEngine", label: "Risk Engine", icon: ShieldAlert },
  { key: "ragIndex", label: "RAG Index", icon: BookOpen },
] as const

export function StreamingStatusBar() {
  const streamingStatus = useEnvironmentalStore((s) => s.streamingStatus)

  return (
    <div className="glass-panel rounded-lg px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          System Status
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {STATUS_ITEMS.map((item) => {
          const isActive =
            streamingStatus[item.key as keyof typeof streamingStatus]
          const Icon = item.icon
          return (
            <motion.div
              key={item.key}
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Pulsing dot */}
              <span className="relative flex h-2.5 w-2.5">
                {isActive && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gp-safe opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    isActive ? "bg-gp-safe" : "bg-muted-foreground"
                  }`}
                />
              </span>
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-mono text-secondary-foreground">
                {item.label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
