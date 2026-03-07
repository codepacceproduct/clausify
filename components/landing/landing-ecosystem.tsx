"use client"

import { motion } from "framer-motion"
import Image from "next/image"

// Define positions for the hub-and-spoke layout (Desktop)
// Coordinate system: 1200x800
const center = { x: 600, y: 400 }

const items = [
  // Left Inner
  { text: "Workflow Jurídico", x: 400, y: 200, align: "right", type: "inner" },
  { text: "IA & Assistente Virtual", x: 350, y: 330, align: "right", type: "inner" },
  { text: "Financeiro avançado", x: 350, y: 470, align: "right", type: "inner" },
  { text: "Business Intelligence", x: 400, y: 600, align: "right", type: "inner" },

  // Right Inner
  { text: "CRM Nativo", x: 800, y: 200, align: "left", type: "inner" },
  { text: "Hub de Integrações", x: 850, y: 330, align: "left", type: "inner" },
  { text: "Controladoria Jurídica", x: 850, y: 470, align: "left", type: "inner" },
  { text: "Sistema Taskscore", x: 800, y: 600, align: "left", type: "inner" },

  // Left Outer
  { text: "Controle de Parcerias", x: 150, y: 200, align: "right", type: "outer", parentIndex: 0 },
  { text: "Treinamento Personalizado", x: 100, y: 400, align: "right", type: "outer", parentIndex: 1 }, // Connects to somewhere? Visual implies standalone or connected to inner
  { text: "Migração assistida", x: 150, y: 600, align: "right", type: "outer", parentIndex: 3 },

  // Right Outer
  { text: "Relatórios avançados", x: 1050, y: 200, align: "left", type: "outer", parentIndex: 4 },
  { text: "Kanban de atividades", x: 1100, y: 400, align: "left", type: "outer", parentIndex: 5 },
  { text: "Editor de Documentos", x: 1050, y: 600, align: "left", type: "outer", parentIndex: 7 },
]

export function LandingEcosystem() {
  return (
    <section id="ecosystem" className="py-24 bg-[#050505] relative overflow-hidden min-h-[1000px] flex flex-col items-center justify-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 w-full max-w-[1200px]">
        <div className="text-center mb-12">
          <p className="text-emerald-400 font-medium mb-4">Integração Total</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
            O sistema operacional do seu <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
              escritório moderno
            </span>
          </h2>
        </div>

        {/* Desktop View (Absolute Positioning) */}
        <div className="hidden lg:block relative w-[1200px] h-[800px] mx-auto">
          {/* SVG Layer for Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Lines from Center to Inner Items */}
            {items.filter(i => i.type === "inner").map((item, index) => (
              <motion.path
                key={`line-center-${index}`}
                d={`M ${center.x} ${center.y} C ${center.x} ${item.y}, ${(center.x + item.x) / 2} ${item.y}, ${item.x + (item.align === 'right' ? -32 : 32)} ${item.y}`}
                fill="none"
                stroke="url(#line-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
              />
            ))}

            {/* Lines from Inner to Outer Items (Optional connections based on visual flow) */}
            {/* For this specific layout, let's connect center to outer too, passing through inner visually */}
             {items.filter(i => i.type === "outer").map((item, index) => (
               <motion.path
                key={`line-outer-${index}`}
                d={`M ${center.x} ${center.y} C ${center.x} ${item.y}, ${(center.x + item.x) / 2} ${item.y}, ${item.x + (item.align === 'right' ? -32 : 32)} ${item.y}`}
                fill="none"
                stroke="url(#line-gradient)"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.3 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              />
            ))}
          </svg>

          {/* Center Logo */}
          <motion.div
            style={{ left: center.x, top: center.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
             <div className="relative w-40 h-40 bg-black rounded-full border border-emerald-500/50 shadow-[0_0_60px_-10px_rgba(16,185,129,0.4)] flex items-center justify-center p-6 group">
              <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-pulse" />
              <Image
                src="/images/clausify-logo.png"
                alt="Clausify Logo"
                width={100}
                height={100}
                className="object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              />
              {/* Rings */}
              <div className="absolute inset-0 rounded-full border border-emerald-500/10 animate-[ping_3s_linear_infinite]" />
              <div className="absolute inset-[-20px] rounded-full border border-emerald-500/5 animate-[ping_4s_linear_infinite_1s]" />
            </div>
          </motion.div>

          {/* Items */}
          {items.map((item, index) => (
            <motion.div
              key={index}
              style={{ left: item.x, top: item.y }}
              className={`absolute -translate-y-1/2 z-10 ${item.align === 'right' ? '-translate-x-full pr-4' : 'translate-x-0 pl-4'}`}
              initial={{ opacity: 0, x: item.align === 'right' ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
            >
              <div className={`
                relative bg-[#0a0a0a] border border-white/10 py-4 rounded-xl 
                ${item.align === 'right' ? 'pl-6 pr-12 text-right' : 'pl-12 pr-6 text-left'}
                hover:border-emerald-500/50 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] 
                transition-all duration-300 group min-w-[200px]
                ${item.type === 'inner' ? 'scale-110' : 'scale-100 opacity-80 hover:opacity-100'}
              `}>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative text-gray-200 font-medium group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                  {item.text}
                </span>
                
                {/* Connector Dot */}
                <div className={`
                  absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,1)] z-20
                  ${item.align === 'right' ? 'right-4' : 'left-4'}
                `}>
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View (Grid) */}
        <div className="lg:hidden relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />

          <div className="grid grid-cols-1 gap-4 pl-8">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-[#0a0a0a] border border-white/10 p-4 rounded-xl hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-4">
                  {/* Connector Dot */}
                  <div className="relative w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,1)] flex-shrink-0">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
                  </div>
                  
                  <span className="text-gray-200 font-medium group-hover:text-emerald-400 transition-colors">
                    {item.text}
                  </span>
                </div>

                {/* Connecting Line to Main Spine */}
                <div className="absolute top-1/2 -left-8 w-8 h-[1px] bg-gradient-to-r from-emerald-500/50 to-transparent" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
