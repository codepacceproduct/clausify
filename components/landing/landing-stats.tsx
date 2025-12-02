"use client"

import { useEffect, useRef, useState } from "react"

const stats = [
  { value: 5200, suffix: "+", label: "Contratos analisados" },
  { value: 99.2, suffix: "%", label: "Taxa de precisão" },
  { value: 85, suffix: "%", label: "Redução de tempo" },
  { value: 150, suffix: "+", label: "Escritórios ativos" },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const duration = 2000
          const steps = 60
          const increment = value / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current * 10) / 10)
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, hasAnimated])

  return (
    <div ref={ref} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
      {count.toLocaleString("pt-BR")}
      {suffix}
    </div>
  )
}

export function LandingStats() {
  return (
    <section className="relative py-20 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-gray-400 text-sm sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
