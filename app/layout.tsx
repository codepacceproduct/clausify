import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clausify - Análise Jurídica Inteligente",
  description:
    "Plataforma de análise de contratos com IA para advogados corporativos e imobiliários. Identifique riscos, gerencie seu portfólio e tome decisões estratégicas.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/images/clausify-logo.png",
        type: "image/png",
      },
    ],
    apple: "/images/clausify-logo.png",
  },
}

import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${_inter.className} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
