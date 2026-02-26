"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Brain, Newspaper, BookOpen, Activity } from "lucide-react"
import { useEnvironmentalStore } from "@/store/useEnvironmentalStore"
import { askRag } from "@/services/api"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  citedStressScore?: number
  citedNewsSnippet?: string
  citedGuidelineSnippet?: string
}

export function RagChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const ragLoading = useEnvironmentalStore((s) => s.ragLoading)
  const setRagLoading = useEnvironmentalStore((s) => s.setRagLoading)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || ragLoading) return

    const question = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: question }])
    setRagLoading(true)

    try {
      const response = await askRag(question)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.answer,
          citedStressScore: response.citedStressScore,
          citedNewsSnippet: response.citedNewsSnippet,
          citedGuidelineSnippet: response.citedGuidelineSnippet,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection to RAG engine interrupted. Retrying..." },
      ])
    } finally {
      setRagLoading(false)
    }
  }

  return (
    <motion.div
      className="glass-panel rounded-xl flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-gp-cyan" />
          <span className="text-xs font-mono uppercase tracking-wider text-foreground">
            Environmental Intelligence Engine
          </span>
        </div>
        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
          Live RAG powered by streaming context
        </p>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[400px]"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Brain className="h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-mono text-muted-foreground/50">
              Ask about environmental conditions
            </p>
            <p className="text-[10px] font-mono text-muted-foreground/30 mt-1">
              {"Try: \"What is the current air quality situation?\""}
            </p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-lg px-3 py-2 ${
                  msg.role === "user"
                    ? "bg-primary/10 border border-primary/20 text-foreground"
                    : "bg-secondary/50 border border-border/50 text-foreground"
                }`}
              >
                <p className="text-sm font-sans leading-relaxed">{msg.content}</p>

                {/* Citations */}
                {msg.role === "assistant" && msg.citedStressScore !== undefined && (
                  <div className="mt-2 pt-2 border-t border-border/30 space-y-1.5">
                    {/* Stress Score Citation */}
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-gp-neon/80">
                      <Activity className="h-3 w-3" />
                      <span>Live Stress Score: {msg.citedStressScore}</span>
                    </div>
                    {/* News Citation */}
                    {msg.citedNewsSnippet && (
                      <div className="flex items-start gap-1.5 text-[10px] font-mono text-muted-foreground">
                        <Newspaper className="h-3 w-3 shrink-0 mt-0.5" />
                        <span>{msg.citedNewsSnippet}</span>
                      </div>
                    )}
                    {/* Guideline Citation */}
                    {msg.citedGuidelineSnippet && (
                      <div className="flex items-start gap-1.5 text-[10px] font-mono text-muted-foreground">
                        <BookOpen className="h-3 w-3 shrink-0 mt-0.5" />
                        <span>{msg.citedGuidelineSnippet}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading */}
        {ragLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-secondary/50 border border-border/50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gp-cyan animate-pulse" />
                <span
                  className="h-1.5 w-1.5 rounded-full bg-gp-cyan animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="h-1.5 w-1.5 rounded-full bg-gp-cyan animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 border-t border-border/50"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the intelligence engine..."
            className="flex-1 bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-gp-cyan/50 focus:border-gp-cyan/30"
            disabled={ragLoading}
          />
          <button
            type="submit"
            disabled={ragLoading || !input.trim()}
            className="p-2 rounded-lg bg-gp-cyan/10 border border-gp-cyan/20 text-gp-cyan hover:bg-gp-cyan/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </motion.div>
  )
}
