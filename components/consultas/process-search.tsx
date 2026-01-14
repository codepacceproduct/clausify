"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

interface ProcessSearchProps {
  onSearch: (term: string, type: "process" | "cpf") => void
}

export function ProcessSearch({ onSearch }: ProcessSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")

  const handleSearch = () => {
    const raw = searchTerm.replace(/\D/g, "")

    if (!raw) {
      setError("Informe o número do processo.")
      return
    }

    if (raw.length !== 20) {
      setError("Número do processo deve ter 20 dígitos.")
      return
    }

    setError("")
    onSearch(searchTerm, "process")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setError("")
    setSearchTerm(formatCNJ(value))
  }

  const formatCNJ = (v: string) => {
    return v.replace(/\D/g, "")
      .replace(/(\d{7})(\d)/, "$1-$2")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{4})(\d)/, "$1.$2")
      .replace(/(\d{1})(\d)/, "$1.$2")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .slice(0, 25)
  }

  return (
    <div className="w-full flex justify-center">
      <Card className="w-full max-w-xl border-slate-200 dark:border-slate-800 bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            Acompanhe seu processo
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Informe o número único do processo (CNJ) para consultar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">
              Número do processo
            </Label>
            <Input
              id="identifier"
              placeholder="0000000-00.0000.0.00.0000"
              className={`bg-white text-slate-900 placeholder:text-slate-400 border focus-visible:ring-emerald-500 focus-visible:border-emerald-500 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 ${
                error
                  ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                  : "border-slate-200 dark:border-slate-700"
              }`}
              value={searchTerm}
              onChange={handleChange}
            />
            {error && (
              <p className="text-xs text-red-500">
              {error}
              </p>
            )}
          </div>

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4 mr-2" />
            Consultar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
