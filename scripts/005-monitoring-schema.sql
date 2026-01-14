-- Tabela de Processos Monitorados por Usuário
CREATE TABLE IF NOT EXISTS monitored_processes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- Link to auth.users (Supabase) or just a string if using custom auth
    process_id UUID REFERENCES judicial_processes(id) ON DELETE CASCADE,
    nickname VARCHAR(255),
    frequency VARCHAR(20) NOT NULL DEFAULT 'daily', -- 'daily', '6h', '1h'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'suspended', 'archived'
    last_check_at TIMESTAMP WITH TIME ZONE,
    next_check_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, process_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_monitored_next_check ON monitored_processes(next_check_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_monitored_user ON monitored_processes(user_id);

-- RLS
ALTER TABLE monitored_processes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own monitored processes" 
    ON monitored_processes FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monitored processes" 
    ON monitored_processes FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monitored processes" 
    ON monitored_processes FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own monitored processes" 
    ON monitored_processes FOR DELETE 
    USING (auth.uid() = user_id);
