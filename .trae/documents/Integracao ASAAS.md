# Integração com ASAAS — Guia Técnico

## Visão Geral
- Objetivo: migrar ou integrar o sistema de pagamentos para o ASAAS mantendo o fluxo atual de confirmação por webhook e contratos do frontend.
- Fluxo recomendado: Checkout hospedado (redirect) ou cobrança PIX → Webhook “PAYMENT_RECEIVED”/“PAYMENT_CONFIRMED” → atualização de pagamento e ativação de plano.
- Compatibilidade: preservar endpoints atuais e formato das respostas, adaptando a camada de provider.

## Recursos do ASAAS
- Cobranças: boleto, cartão, PIX, links de pagamento (Payment Link) e assinaturas.
- Webhooks: eventos detalhados para ciclo da cobrança (PAYMENT_CREATED, PAYMENT_CONFIRMED, PAYMENT_RECEIVED, etc.). Referência: https://docs.asaas.com/docs/webhook-para-cobrancas
- PIX: criação de cobrança com billingType=PIX e obtenção de QR Code dinâmico. Referência: https://docs.asaas.com/docs/pix-overview
- Assinaturas: criação e ciclo mensal, com eventos de cobrança via webhook. Referência: https://docs.asaas.com/docs/creating-a-subscription

## Arquitetura de Integração
- Camada Provider: implementar um adapter “AsaasProvider” com operações: createCharge, getCheckoutLink, getPayment, mapStatus, verifyWebhook.
- Endpoints manter contratos:
  - Criação/Checkout: /api/checkout
  - Status de pagamento: /api/payments/status
  - Webhook: /api/webhook/asaas
- Persistência: reutilizar tabela payments, adicionando opcionalmente “provider = 'asaas'”.

## Endpoints
- **POST /api/checkout**: Cria cobrança avulsa (deprecated/híbrido).
- **POST /api/subscription/create**: Cria assinatura recorrente.
    - Body: `{ "plan": "office", "billingType": "PIX" | "CREDIT_CARD", "cycle": "MONTHLY" }`
    - Retorno: `{ success: true, paymentLink: "..." }`
- **POST /api/webhook/asaas**: Recebe notificações de pagamento e assinatura.
- **GET /api/test-asaas**: Teste de integração (Cria cobrança e assinatura no Sandbox).

## Fluxo de Assinatura
1. Frontend chama `/api/subscription/create`.
2. Backend cria Customer e Subscription no Asaas.
3. Backend retorna link de pagamento da primeira cobrança gerada.
4. Usuário paga no Asaas.
5. Webhook recebe `PAYMENT_CONFIRMED` e ativa a assinatura no banco (`subscriptions.status = 'active'`).
6. Webhook recebe `PAYMENT_OVERDUE` e bloqueia (`subscriptions.status = 'past_due'`).

## Controle de Acesso
Utilize `checkApiAccess()` de `lib/billing.ts` para verificar se o usuário/organização possui assinatura ativa antes de liberar recursos.

## Autenticação
- ASAAS usa API Key no header (Authorization: Bearer {token}) ou header específico. Armazene em variáveis:
  - ASAAS_API_KEY
  - ASAAS_BASE_URL (ex.: https://sandbox.asaas.com/api ou https://api.asaas.com/v3)
- Não commitar segredos; usar mecanismo de configuração seguro (env/secret manager).

## Fluxos de Cobrança
- Hosted Checkout (Payment Link):
  - Criar/obter link e redirecionar o cliente (mantendo “mode: 'redirect'” no retorno).
  - Parametrizar utm ou externalReference para vincular organização e email.
- PIX (fallback/primário):
  - Criar cobrança com billingType=PIX, retornar QR Code e “copy and paste” no JSON.
  - Armazenar external_id (id da cobrança ASAAS) e metadata com QR.

## Webhooks
- Configurar URL de webhook em ASAAS (Sandbox e Produção) para eventos de cobrança. Referência: https://docs.asaas.com/docs/receive-asaas-events-at-your-webhook-endpoint
- Eventos principais:
  - PAYMENT_CREATED: cobrança criada
  - PAYMENT_CONFIRMED: pagamento confirmado (saldo ainda não disponível)
  - PAYMENT_RECEIVED: cobrança recebida (considerar “paid”)
- Estrutura: { "event":"PAYMENT_RECEIVED", "payment": { ... dados completos ... } }
- Segurança:
  - Validar token (asaas-access-token) ou IPs oficiais
  - Processar rapidamente e retornar 200 OK para não interromper fila de sincronização

## Mapeamento de Status (ASAAS → Interno)
- paid: PAYMENT_RECEIVED, PAYMENT_CONFIRMED
- pending: PAYMENT_CREATED, PAYMENT_UPDATED, PAYMENT_OVERDUE
- failed: PAYMENT_CREDIT_CARD_CAPTURE_REFUSED, PAYMENT_REPROVED_BY_RISK_ANALYSIS, PAYMENT_CHARGEBACK_REQUESTED (se política interna tratar como falha)
- canceled: PAYMENT_DELETED, PAYMENT_REFUNDED (após liquidação), OVERDUE (expirado conforme política)
- Referência dos eventos: https://docs.asaas.com/docs/webhook-para-cobrancas

## Assinaturas (Opcional)
- Criar assinatura: POST /v3/subscriptions com cycle e billingType.
- Cobrança mensal gerada automaticamente; confirmar pagamento via webhook.
- Referência: https://docs.asaas.com/docs/creating-a-subscription

## Migração CAKTO → ASAAS
- Dual-run:
  - Novas cobranças: ASAAS
  - Webhook CAKTO permanece até concluir cobranças antigas
- Adaptações:
  - Substituir chamadas em /api/checkout por ASAAS (mantendo resposta)
  - Tornar /api/payments/status provider-agnóstico (consultar ASAAS quando necessário)
  - Criar /api/webhook/asaas com mapeamento e idempotência por external_id
- Não alterar contratos do frontend; UI continua igual.

## Variáveis de Ambiente
- ASAAS_API_KEY
- ASAAS_BASE_URL
- ASAAS_WALLET_ID (ID da carteira/subconta, se aplicável)
- ASAAS_WEBHOOK_TOKEN (se usar validação por token)
- PIX_KEY (se usar funcionalidades de chave PIX via API)

## Segurança e Conformidade
- LGPD: não armazenar dados sensíveis de cartão; usar tokens do ASAAS.
- Proteção de webhooks: verificação de token/IP, idempotência, logs mínimos.
- Auditoria: persistir “raw_response” na tabela payments para rastreabilidade.

## Testes e Sandbox
- Usar Sandbox para configurar webhook e criar cobranças de teste.
- Ferramentas: ngrok ou Cloudflare Tunnel para expor localhost.
- Consultar Webhook Logs no painel ASAAS para depuração.

## Tratamento de Erros
- Falhas de rede/api: retries exponenciais para leitura de status (não para duplicar criação).
- Idempotência: evitar duplicidade no webhook e na criação de cobranças.
- Alertas: logar e monitorar eventos falhos; enviar notificações internas quando necessário.

## Próximos Passos
- Implementar adapter lib/asaas.ts
- Criar /api/webhook/asaas com validação e mapeamento de status
- Adaptar /api/checkout para redirect (Payment Link) e fallback PIX em ASAAS
- Tornar /api/payments/status agnóstico ao provider

## Referências
- Webhooks de cobranças (pt-BR): https://docs.asaas.com/docs/webhook-para-cobrancas
- Payment events (en): https://docs.asaas.com/docs/payment-events
- Recebimentos PIX: https://docs.asaas.com/docs/pix-overview
- Assinaturas: https://docs.asaas.com/docs/creating-a-subscription
