"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserEmail } from "@/lib/auth"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, FileText, Download, Eye, Star } from "lucide-react"

const templates = [
  {
    id: 1,
    name: "Contrato de Prestação de Serviços - Tech",
    category: "Prestação de Serviços",
    description: "Template completo para contratos de serviços de TI e software",
    clauses: 18,
    pages: 12,
    downloads: 342,
    rating: 4.8,
    lastUpdated: "20/01/2025",
    featured: true,
  },
  {
    id: 2,
    name: "Contrato de Locação Comercial",
    category: "Locação",
    description: "Modelo padrão para locação de imóveis comerciais",
    clauses: 22,
    pages: 15,
    downloads: 289,
    rating: 4.6,
    lastUpdated: "18/01/2025",
    featured: true,
  },
  {
    id: 3,
    name: "Acordo de Confidencialidade (NDA)",
    category: "Confidencialidade",
    description: "NDA bilateral para proteção de informações sensíveis",
    clauses: 8,
    pages: 5,
    downloads: 567,
    rating: 4.9,
    lastUpdated: "15/01/2025",
    featured: false,
  },
  {
    id: 4,
    name: "Contrato de Fornecimento",
    category: "Fornecimento",
    description: "Template para contratos de fornecimento de produtos",
    clauses: 20,
    pages: 14,
    downloads: 198,
    rating: 4.5,
    lastUpdated: "12/01/2025",
    featured: false,
  },
  {
    id: 5,
    name: "Termo de Parceria Estratégica",
    category: "Parceria",
    description: "Acordo de parceria comercial e estratégica entre empresas",
    clauses: 16,
    pages: 10,
    downloads: 156,
    rating: 4.7,
    lastUpdated: "10/01/2025",
    featured: false,
  },
  {
    id: 6,
    name: "Contrato de Investimento - Seed",
    category: "Investimento",
    description: "Template para rodadas de investimento inicial",
    clauses: 25,
    pages: 18,
    downloads: 124,
    rating: 4.8,
    lastUpdated: "08/01/2025",
    featured: true,
  },
]

export function PlaybookTemplates() {
  const [searchTerm, setSearchTerm] = useState("")
  const logAction = async (action: string, resource: string) => {
    const email = getUserEmail() || ""
    if (!email) return
    try {
      await fetch("/api/audit/logs/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, resource, status: "success" }),
      })
    } catch {}
  }

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const featuredTemplates = filteredTemplates.filter((t) => t.featured)
  const regularTemplates = filteredTemplates.filter((t) => !t.featured)

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Templates */}
      {featuredTemplates.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <h2 className="text-xl font-semibold">Templates em Destaque</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Cláusulas</p>
                      <p className="text-lg font-semibold">{template.clauses}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Páginas</p>
                      <p className="text-lg font-semibold">{template.pages}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Downloads</p>
                      <p className="text-lg font-semibold">{template.downloads}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span>{template.rating}</span>
                    </div>
                    <span>Atualizado {template.lastUpdated}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => logAction("view", template.name)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Visualizar
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => logAction("download", template.name)}>
                      <Download className="h-3 w-3 mr-1" />
                      Usar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Templates */}
      {regularTemplates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Todos os Templates</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Cláusulas</p>
                      <p className="text-lg font-semibold">{template.clauses}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Páginas</p>
                      <p className="text-lg font-semibold">{template.pages}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Downloads</p>
                      <p className="text-lg font-semibold">{template.downloads}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span>{template.rating}</span>
                    </div>
                    <span>Atualizado {template.lastUpdated}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => logAction("view", template.name)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Visualizar
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => logAction("download", template.name)}>
                      <Download className="h-3 w-3 mr-1" />
                      Usar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
