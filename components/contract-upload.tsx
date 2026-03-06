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
import { createClient } from "@/lib/supabase/client"

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
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            toast.error("Sua sessão expirou. Por favor, faça login novamente para enviar contratos.")
            // Optionally redirect to login here if you have router access
            // window.location.href = "/login" 
            setUploading(false)
            return
        }

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
        <div className="flex flex-col space-y-1.5">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Novo Contrato</h3>
            <p className="text-sm text-muted-foreground">Faça upload para análise automática com IA</p>
        </div>
        
        <Card className={cn(
            "border-dashed border-2 transition-all duration-200 cursor-pointer overflow-hidden relative bg-card/50 hover:bg-card",
            isDragging ? "border-emerald-500 bg-emerald-500/5 ring-4 ring-emerald-500/10" : "border-border hover:border-emerald-500/50 hover:bg-muted/50"
        )}>
            <CardContent 
                className="flex flex-col items-center justify-center py-16 px-4"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
            >
                <div className={cn(
                    "p-4 rounded-full mb-6 transition-transform duration-200",
                    isDragging ? "bg-emerald-500/20 scale-110" : "bg-primary/10"
                )}>
                    <Upload className={cn(
                        "h-10 w-10", 
                        isDragging ? "text-emerald-500" : "text-primary"
                    )} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Arraste seu contrato aqui</h3>
                <p className="text-muted-foreground text-center mb-8 max-w-sm">
                    Suportamos .DOC, .DOCX e TXT. O arquivo será processado pela nossa IA Jurídica com total confidencialidade.
                </p>
                
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".doc,.docx,.txt"
                    onChange={handleFileChange}
                />
                <Button variant={isDragging ? "default" : "outline"} className="pointer-events-none">
                    Selecionar Arquivo
                </Button>
            </CardContent>
            
            {/* Background pattern or decoration could go here */}
        </Card>

        {files.length > 0 && (
            <Card className="border-l-4 border-l-emerald-500 animate-in fade-in slide-in-from-bottom-4">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Arquivo Pronto
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-transparent hover:border-border transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-background rounded-md border shadow-sm">
                                    <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="font-medium truncate max-w-[200px] sm:max-w-[300px]">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index);
                                }} 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
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
        <Card className="h-full bg-card border-border shadow-sm">
            <CardHeader>
                <CardTitle className="tracking-tight">Detalhes da Análise</CardTitle>
                <CardDescription>Configure como a IA deve processar o documento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                    <Label>Nome do Cliente / Parte</Label>
                    <Input 
                        placeholder="Ex: Empresa XYZ Ltda" 
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Observações Adicionais</Label>
                    <Textarea 
                        placeholder="Instruções específicas para a análise..." 
                        className="resize-none min-h-[100px]"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <div className="space-y-4 pt-2">
                    <div className="flex items-center space-x-2 border border-border p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <Checkbox 
                            id="standard" 
                            checked={useStandardRules}
                            onCheckedChange={(c) => setUseStandardRules(!!c)}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="standard"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Playbook Padrão
                            </label>
                            <p className="text-xs text-muted-foreground">
                                Usa regras jurídicas de mercado
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 border border-border p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <Checkbox 
                            id="custom" 
                            checked={useCustomRules}
                            onCheckedChange={(c) => setUseCustomRules(!!c)}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="custom"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Regras Personalizadas
                            </label>
                            <p className="text-xs text-muted-foreground">
                                Aplica regras da sua organização
                            </p>
                        </div>
                    </div>
                </div>

                <Button 
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white" 
                    size="lg" 
                    onClick={handleUpload}
                    disabled={files.length === 0 || uploading}
                >
                    {uploading ? (
                        <>Processando...</>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Iniciar Análise
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
