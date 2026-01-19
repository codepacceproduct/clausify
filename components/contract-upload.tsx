"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, X, ArrowRight, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ContractUploadProps {
  onAnalysisStart?: (contractId: string, content: string, filename: string) => void
}

export function ContractUpload({ onAnalysisStart }: ContractUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [clientName, setClientName] = useState("")
  const [notes, setNotes] = useState("")
  const [contractType, setContractType] = useState("service")
  const [useStandardRules, setUseStandardRules] = useState(true)
  const [useCustomRules, setUseCustomRules] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    
    setUploading(true)
    
    try {
        const formData = new FormData()
        formData.append("file", files[0])
        formData.append("type", contractType)
        formData.append("clientName", clientName)
        formData.append("notes", notes)
        formData.append("useStandardRules", String(useStandardRules))
        formData.append("useCustomRules", String(useCustomRules))

        const response = await fetch("/api/contracts/upload", {
            method: "POST",
            body: formData
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || "Upload failed")
        }
        
        // Log action
        await fetch(`/api/audit/logs/record`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "upload", resource: "Upload de Contrato", status: "success" }),
        })

        onAnalysisStart?.(data.contract.id, data.contract.content, files[0].name)
        toast.success("Upload concluído com sucesso!")
        
    } catch (error: any) {
        console.error("Upload error:", error)
        toast.error(error.message || "Falha no upload do contrato")
    } finally {
        setUploading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Upload Section - 2 Columns */}
      <div className="lg:col-span-2 space-y-6">
        {/* ... (Drag area remains same) ... */}
        <Card className="border-dashed border-2 hover:border-emerald-500/50 transition-colors">
            <CardContent 
                className={cn(
                    "flex flex-col items-center justify-center py-12 px-4 transition-colors rounded-lg",
                    isDragging ? "bg-emerald-50/50 border-emerald-500" : ""
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="bg-emerald-100 p-4 rounded-full mb-4">
                    <Upload className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Arraste seu contrato aqui</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-sm">
                    Suportamos .DOCX e TXT. O arquivo será processado pela nossa IA Jurídica com total confidencialidade.
                </p>
                
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".doc,.docx,.txt"
                    onChange={handleFileChange}
                />
                <Button asChild variant="outline" className="cursor-pointer">
                    <label htmlFor="file-upload">Selecionar Arquivo</label>
                </Button>
            </CardContent>
        </Card>

        {files.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Arquivos Selecionados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-background rounded border">
                                    <FileText className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )}
      </div>

      {/* Metadata Section - 1 Column */}
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Detalhes do Contrato</CardTitle>
                <CardDescription>Informações para auxiliar a análise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Tipo de Documento</Label>
                    <Select value={contractType} onValueChange={setContractType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="service">Prestação de Serviços</SelectItem>
                            <SelectItem value="nda">NDA / Confidencialidade</SelectItem>
                            <SelectItem value="lease">Locação</SelectItem>
                            <SelectItem value="employment">Trabalho</SelectItem>
                            <SelectItem value="other">Outros</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Parte Contrária</Label>
                    <Input 
                        placeholder="Ex: Empresa X Ltda" 
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <Label>Validar contra quais regras?</Label>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="standard-rules" 
                                checked={useStandardRules}
                                onCheckedChange={(checked) => setUseStandardRules(checked as boolean)}
                            />
                            <Label htmlFor="standard-rules" className="font-normal cursor-pointer">Padrão Clausify</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="custom-rules" 
                                checked={useCustomRules}
                                onCheckedChange={(checked) => setUseCustomRules(checked as boolean)}
                            />
                            <Label htmlFor="custom-rules" className="font-normal cursor-pointer">Minhas Regras Personalizadas</Label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea 
                        placeholder="Pontos de atenção..." 
                        className="resize-none" 
                        rows={4} 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
                    size="lg"
                    onClick={handleUpload}
                    disabled={files.length === 0 || uploading}
                >
                    {uploading ? (
                        <>Processando...</>
                    ) : (
                        <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Iniciar Análise Inteligente
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
