-- Tabela de Processos
CREATE TABLE IF NOT EXISTS judicial_processes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cnj_number VARCHAR(25) NOT NULL UNIQUE, -- 20 dígitos + formatação opcional
    court_alias VARCHAR(50) NOT NULL,
    justice_branch VARCHAR(100),
    class_name VARCHAR(255),
    subject VARCHAR(255),
    last_movement_date TIMESTAMP WITH TIME ZONE,
    last_movement_hash VARCHAR(64),
    status VARCHAR(50) DEFAULT 'active', -- active, archived, error
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Movimentações
CREATE TABLE IF NOT EXISTS judicial_movements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    process_id UUID REFERENCES judicial_processes(id) ON DELETE CASCADE,
    movement_date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT NOT NULL,
    code INTEGER,
    hash VARCHAR(64) NOT NULL, -- Para verificação de duplicidade/integridade
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Monitoramentos (Jobs)
CREATE TABLE IF NOT EXISTS monitoring_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    finished_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'running', -- running, success, error
    processes_checked INTEGER DEFAULT 0,
    new_movements_found INTEGER DEFAULT 0,
    error_log TEXT
);

-- Tabela de Logs de Consulta
CREATE TABLE IF NOT EXISTS query_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cnj_number VARCHAR(25) NOT NULL,
    endpoint VARCHAR(255),
    status_code INTEGER,
    response_time_ms INTEGER,
    success BOOLEAN,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_processes_cnj ON judicial_processes(cnj_number);
CREATE INDEX IF NOT EXISTS idx_movements_process_date ON judicial_movements(process_id, movement_date DESC);
CREATE INDEX IF NOT EXISTS idx_movements_hash ON judicial_movements(hash);

-- RLS (Row Level Security) - Opcional, dependendo se os dados são públicos ou por usuário
-- Assumindo sistema interno por enquanto, mas habilitando para boas práticas
ALTER TABLE judicial_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE judicial_movements ENABLE ROW LEVEL SECURITY;

-- Política simples: permitir tudo para autenticados (ajustar conforme necessidade real)
CREATE POLICY "Enable all access for authenticated users" ON judicial_processes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON judicial_movements FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS process_public_previews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    token VARCHAR(64) NOT NULL UNIQUE,
    cnj_number VARCHAR(25) NOT NULL,
    payload JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE process_public_previews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for authenticated users on process_public_previews" ON process_public_previews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow select on process_public_previews" ON process_public_previews FOR SELECT USING (true);
CREATE POLICY "Allow delete for authenticated users on process_public_previews" ON process_public_previews FOR DELETE USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS process_consult_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    term TEXT NOT NULL,
    type VARCHAR(10) NOT NULL,
    cnj_number VARCHAR(25),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE process_consult_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select own consult history" ON process_consult_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow insert own consult history" ON process_consult_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);
