"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, X, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ContractUploadProps {
  onAnalysisStart?: () => void
}

export function ContractUpload({ onAnalysisStart }: ContractUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    setUploading(true)
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setUploading(false)
    onAnalysisStart?.()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload de Contrato</CardTitle>
          <CardDescription>Faça upload de documentos PDF, DOCX ou TXT</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contract-type">Tipo de Contrato</Label>
            <Select>
              <SelectTrigger id="contract-type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service">Prestação de Serviços</SelectItem>
                <SelectItem value="construction">Contrato de Obra</SelectItem>
                <SelectItem value="lease">Locação</SelectItem>
                <SelectItem value="supply">Fornecimento</SelectItem>
                <SelectItem value="investment">Investimento</SelectItem>
                <SelectItem value="partnership">Parceria</SelectItem>
                <SelectItem value="employment">Trabalho</SelectItem>
                <SelectItem value="other">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-name">Nome do Cliente/Parte</Label>
            <Input id="client-name" placeholder="Ex: Empresa Alpha Tech" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contract-value">Valor do Contrato (opcional)</Label>
            <Input id="contract-value" type="text" placeholder="R$ 0,00" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione notas sobre pontos específicos que deseja analisar..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Arquivo do Contrato</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                multiple
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-foreground font-medium">Clique para fazer upload</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX ou TXT (máx. 10MB)</p>
              </label>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Arquivos Selecionados</Label>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button className="w-full gap-2" onClick={handleUpload} disabled={files.length === 0 || uploading}>
            {uploading ? (
              "Processando..."
            ) : (
              <>
                Iniciar Análise
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Options */}
      <Card>
        <CardHeader>
          <CardTitle>Opções de Análise</CardTitle>
          <CardDescription>Personalize a profundidade da análise jurídica</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <input type="checkbox" id="risk-analysis" defaultChecked className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="risk-analysis" className="font-medium cursor-pointer">
                  Análise de Risco
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Identifica cláusulas com alto risco jurídico e financeiro
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <input type="checkbox" id="compliance" defaultChecked className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="compliance" className="font-medium cursor-pointer">
                  Conformidade Legal
                </Label>
                <p className="text-xs text-muted-foreground mt-1">Verifica adequação às normas e legislação vigente</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <input type="checkbox" id="clauses" defaultChecked className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="clauses" className="font-medium cursor-pointer">
                  Análise de Cláusulas
                </Label>
                <p className="text-xs text-muted-foreground mt-1">Avalia cada cláusula e sugere melhorias</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <input type="checkbox" id="comparison" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="comparison" className="font-medium cursor-pointer">
                  Comparação com Playbook
                </Label>
                <p className="text-xs text-muted-foreground mt-1">Compara com modelos e padrões da empresa</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <input type="checkbox" id="financial" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="financial" className="font-medium cursor-pointer">
                  Análise Financeira
                </Label>
                <p className="text-xs text-muted-foreground mt-1">Avalia valores, prazos e condições financeiras</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <input type="checkbox" id="obligations" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="obligations" className="font-medium cursor-pointer">
                  Mapeamento de Obrigações
                </Label>
                <p className="text-xs text-muted-foreground mt-1">Lista todas as obrigações e responsabilidades</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Nível de Análise</Label>
            </div>
            <Select defaultValue="detailed">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quick">Rápida (5-10 min)</SelectItem>
                <SelectItem value="standard">Padrão (15-20 min)</SelectItem>
                <SelectItem value="detailed">Detalhada (30-45 min)</SelectItem>
                <SelectItem value="comprehensive">Completa (1-2 horas)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
