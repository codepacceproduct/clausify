# Clausify 2 - Sistema de Inteligência Jurídica

Plataforma avançada para automação, cálculo e monitoramento jurídico.

## 🏛️ Módulo DataJud (Integração CNJ)

Este módulo realiza a consulta e monitoramento automático de processos judiciais utilizando a API Pública do DataJud.

### Funcionalidades
- **Consulta Unificada**: Busca por número do processo (CNJ) com resolução automática de tribunal.
- **Monitoramento Automático**: Job (Cron) para verificação periódica de novas movimentações.
- **Armazenamento Local**: Histórico de processos e movimentações salvo em banco de dados.
- **Integridade**: Verificação de hash (SHA256) para detectar alterações em movimentações.

### Configuração

1. **Variáveis de Ambiente**:
   Certifique-se de que o arquivo `.env.local` contém as credenciais do Supabase.
   A API Key do DataJud já está configurada internamente no cliente (`lib/datajud/client.ts`).

2. **Banco de Dados**:
   As tabelas necessárias são criadas automaticamente via migração. Caso precise rodar manualmente, execute o script:
   `scripts/004-datajud-schema.sql`

### Como Rodar

#### Desenvolvimento
```bash
npm install
npm run dev
```

#### API Endpoints

- **Consultar/Cadastrar Processo**:
  `POST /api/processes`
  ```json
  { "cnj": "0001234-56.2022.8.25.0001" }
  ```

- **Detalhes do Processo**:
  `GET /api/processes?cnj=0001234-56.2022.8.25.0001`

- **Executar Monitoramento (Cron)**:
  `GET /api/cron/monitor`
  *Recomendado configurar este endpoint em um agendador (ex: Vercel Cron, GitHub Actions) para rodar a cada 6 ou 12 horas.*

### Estrutura do Código

- `lib/datajud/client.ts`: Cliente HTTP isolado e tipado para a API DataJud.
- `lib/datajud/db.ts`: Camada de serviço para persistência (Supabase/PostgreSQL).
- `actions/datajud-consult.ts`: Server Action para integração com o Frontend.
- `app/api/cron/monitor/route.ts`: Endpoint idempotente para atualização em massa.

### Decisões de Arquitetura

1. **Resolução de Alias**: O sistema extrai os campos `J.TR` do número CNJ para determinar automaticamente qual endpoint do tribunal consultar (ex: TRF1, TJSP, TST), evitando erros de "Index Not Found".
2. **Hash de Integridade**: Cada movimentação gera um hash único baseado em data, descrição e complementos. O monitoramento só alerta se houver divergência de hash.
3. **Payload Limpo**: A API DataJud exige o número do processo apenas com dígitos (sem pontos/traços). O cliente trata isso automaticamente.
