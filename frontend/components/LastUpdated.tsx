"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { useEnvironmentalStore } from "@/store/useEnvironmentalStore"

export function LastUpdated() {
  const lastUpdated = useEnvironmentalStore((s) => s.lastUpdated)
  const [ago, setAgo] = useState("")

  useEffect(() => {
    function update() {
      if (!lastUpdated) {
        setAgo("Waiting for data...")
        return
      }
      const diff = Math.round((Date.now() - lastUpdated.getTime()) / 1000)
      if (diff < 2) setAgo("Just now")
      else if (diff < 60) setAgo(`${diff} seconds ago`)
      else setAgo(`${Math.floor(diff / 60)}m ${diff % 60}s ago`)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [lastUpdated])

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
      <Clock className="h-3 w-3" />
      <span>Updated {ago}</span>
    </div>
  )
}
