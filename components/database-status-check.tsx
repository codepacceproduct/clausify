"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Copy, Check, Terminal } from "lucide-react"

export function DatabaseStatusCheck() {
    const [missingTables, setMissingTables] = useState<string[]>([])
    const [copied, setCopied] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        checkDB()
    }, [])

    const checkDB = async () => {
        try {
            const res = await fetch("/api/system/check-db")
            const data = await res.json()
            if (data.exists === false) {
                if (data.missingTables) {
                    setMissingTables(data.missingTables)
                } else {
                    // Fallback
                    setMissingTables(['contracts'])
                }
            }
        } catch (e) {
            console.error("Failed to check DB status", e)
        } finally {
            setChecking(false)
        }
    }

    const contractsSql = `CREATE TABLE IF NOT EXISTS contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  client_name TEXT,
  content TEXT,
  status TEXT DEFAULT 'uploaded',
  risk_level TEXT,
  score INTEGER,
  analysis JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contracts" 
ON contracts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contracts" 
ON contracts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contracts" 
ON contracts FOR UPDATE 
USING (auth.uid() = user_id);`

    const eventsSql = `CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  type TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own events" ON events;
CREATE POLICY "Users can view their own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own events" ON events;
CREATE POLICY "Users can insert their own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own events" ON events;
CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own events" ON events;
CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (auth.uid() = user_id);`

    const getSql = () => {
        let sql = ''
        if (missingTables.includes('contracts')) sql += contractsSql + '\n\n'
        if (missingTables.includes('events')) sql += eventsSql
        return sql.trim()
    }

    const sql = getSql()

    const copySql = () => {
        navigator.clipboard.writeText(sql)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (checking || missingTables.length === 0) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-background border rounded-lg shadow-lg max-w-2xl w-full p-6 animate-in zoom-in-95">
                <div className="flex items-center gap-3 mb-4 text-destructive">
                    <AlertTriangle className="h-6 w-6" />
                    <h2 className="text-xl font-semibold">Configuração de Banco de Dados Necessária</h2>
                </div>
                
                <p className="text-muted-foreground mb-4">
                    Detectamos que as seguintes tabelas ainda não existem no seu banco de dados Supabase: <strong>{missingTables.join(", ")}</strong>.
                    Isso é necessário para o funcionamento correto do sistema.
                </p>

                <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                                <Terminal className="h-3 w-3" /> SQL Editor
                            </span>
                            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={copySql}>
                                {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                                {copied ? "Copiado!" : "Copiar Código"}
                            </Button>
                        </div>
                        <pre className="text-xs font-mono overflow-auto max-h-[200px] whitespace-pre-wrap text-foreground">
                            {sql}
                        </pre>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md text-sm text-blue-800 dark:text-blue-300">
                        <strong>Instruções:</strong>
                        <ol className="list-decimal ml-4 mt-1 space-y-1">
                            <li>Copie o código SQL acima</li>
                            <li>Acesse o painel do Supabase do seu projeto</li>
                            <li>Vá para o <strong>SQL Editor</strong></li>
                            <li>Cole o código e clique em <strong>Run</strong></li>
                            <li>Recarregue esta página após criar as tabelas</li>
                        </ol>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                         <Button variant="outline" onClick={() => window.location.reload()}>
                            Recarregar Página
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
