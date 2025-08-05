# Documentação da API de Webhooks - IceFunnel

## Visão Geral

O sistema de webhooks do IceFunnel permite integração bidirecional com sistemas externos, enviando notificações em tempo real sobre eventos importantes e recebendo dados de automações externas.

## Autenticação

Todos os webhooks são assinados usando HMAC-SHA256 para garantir autenticidade e integridade.

### Verificação de Assinatura

\`\`\`javascript
const crypto = require('crypto')

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')
  
  return signature === `sha256=${expectedSignature}`
}
\`\`\`

## Webhooks de Saída

### Eventos Disponíveis

| Evento | Descrição | Quando é Disparado |
|--------|-----------|-------------------|
| `form.submitted` | Formulário submetido | Quando qualquer formulário é preenchido |
| `funnel.conversion` | Conversão no funil | Quando lead avança para etapa de conversão |
| `user.registered` | Usuário registrado | Quando novo usuário se cadastra |
| `payment.completed` | Pagamento completado | Quando pagamento é processado com sucesso |
| `lead.qualified` | Lead qualificado | Quando lead atinge score de qualificação |
| `automation.triggered` | Automação acionada | Quando regra de automação é executada |
| `campaign.started` | Campanha iniciada | Quando nova campanha é lançada |
| `email.opened` | Email aberto | Quando email de campanha é aberto |
| `email.clicked` | Email clicado | Quando link no email é clicado |

### Estrutura do Payload

\`\`\`json
{
  "id": "wh_1234567890",
  "event": "form.submitted",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    // Dados específicos do evento
  },
  "source": "icefunnel",
  "version": "1.0"
}
\`\`\`

### Headers de Segurança

\`\`\`
Content-Type: application/json
X-Webhook-Signature: sha256=a1b2c3d4e5f6...
X-Webhook-Event: form.submitted
X-Webhook-ID: wh_1234567890
X-Webhook-Timestamp: 2024-01-20T10:30:00Z
User-Agent: IceFunnel-Webhooks/1.0
\`\`\`

### Configuração de Retry

- **Tentativas máximas**: 1-10 (configurável)
- **Backoff exponencial**: 2x por tentativa
- **Delay inicial**: 5-300 segundos
- **Timeout**: 30 segundos por request

## Webhooks de Entrada

### Endpoint Base

\`\`\`
POST https://app.icefunnel.com/api/webhooks/incoming/[endpoint]
\`\`\`

### Exemplo de Configuração

\`\`\`javascript
// Configurar webhook de entrada
const incomingWebhook = {
  name: 'Zapier Integration',
  endpoint: 'zapier-leads',
  secret: 'your-secret-key',
  allowedSources: ['zapier.com'],
  eventMapping: {
    'lead_created': 'lead.qualified',
    'contact_updated': 'user.updated'
  }
}
\`\`\`

### Exemplo de Payload Recebido

\`\`\`json
{
  "event": "lead_created",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    "email": "joao@exemplo.com",
    "name": "João Silva",
    "source": "facebook_ads",
    "tags": ["hot_lead", "enterprise"]
  }
}
\`\`\`

## APIs de Gerenciamento

### Criar Webhook

\`\`\`http
POST /api/webhooks/config
Content-Type: application/json

{
  "name": "Zapier Integration",
  "url": "https://hooks.zapier.com/hooks/catch/123456/abcdef/",
  "events": ["form.submitted", "funnel.conversion"],
  "maxAttempts": 3,
  "initialDelay": 5,
  "headers": {
    "Authorization": "Bearer token"
  }
}
\`\`\`

### Listar Webhooks

\`\`\`http
GET /api/webhooks/config?userId=user_123
\`\`\`

### Testar Webhook

\`\`\`http
POST /api/webhooks/test
Content-Type: application/json

{
  "webhookId": "wh_123",
  "testPayload": {
    "message": "Teste personalizado"
  }
}
\`\`\`

## Monitoramento e Logs

### Métricas Disponíveis

- Total de entregas
- Taxa de sucesso
- Tempo médio de resposta
- Erros por tipo
- Histórico de tentativas

### Códigos de Status

| Status | Descrição |
|--------|-----------|
| `pending` | Aguardando processamento |
| `delivered` | Entregue com sucesso |
| `failed` | Falha após todas as tentativas |
| `retrying` | Aguardando nova tentativa |

## Segurança

### Validações Implementadas

1. **HTTPS obrigatório** em produção
2. **Bloqueio de IPs privados** em produção
3. **Rate limiting** por fonte
4. **Assinatura HMAC** obrigatória
5. **Timeout de 30 segundos** por request
6. **Sanitização de logs** (dados sensíveis removidos)

### Boas Práticas

1. **Sempre valide a assinatura** do webhook
2. **Implemente idempotência** no seu endpoint
3. **Responda rapidamente** (< 5 segundos)
4. **Use HTTPS** sempre
5. **Monitore os logs** regularmente
6. **Configure alertas** para falhas

## Exemplos de Integração

### Zapier

\`\`\`javascript
// Webhook para Zapier
const zapierWebhook = {
  name: 'Zapier - Novos Leads',
  url: 'https://hooks.zapier.com/hooks/catch/123456/abcdef/',
  events: ['form.submitted', 'lead.qualified'],
  headers: {
    'X-Zapier-Source': 'icefunnel'
  }
}
\`\`\`

### Make (Integromat)

\`\`\`javascript
// Webhook para Make
const makeWebhook = {
  name: 'Make - Automações',
  url: 'https://hook.integromat.com/abc123def456',
  events: ['funnel.conversion', 'payment.completed'],
  maxAttempts: 5
}
\`\`\`

### CRM Personalizado

\`\`\`javascript
// Webhook para CRM próprio
const crmWebhook = {
  name: 'CRM Interno',
  url: 'https://api.meucrm.com/webhooks/icefunnel',
  events: ['lead.qualified', 'user.registered'],
  headers: {
    'Authorization': 'Bearer seu-token-aqui',
    'X-API-Version': 'v2'
  }
}
\`\`\`

## Troubleshooting

### Problemas Comuns

1. **Webhook não está sendo entregue**
   - Verifique se a URL está acessível
   - Confirme se o webhook está ativo
   - Verifique os logs de erro

2. **Assinatura inválida**
   - Confirme se o secret está correto
   - Verifique se está usando HMAC-SHA256
   - Certifique-se de usar o payload exato

3. **Timeouts frequentes**
   - Otimize o processamento no seu endpoint
   - Considere processamento assíncrono
   - Aumente o timeout se necessário

### Códigos de Erro HTTP

| Código | Significado |
|--------|-------------|
| 200-299 | Sucesso |
| 400 | Bad Request - Payload inválido |
| 401 | Unauthorized - Assinatura inválida |
| 404 | Not Found - Endpoint não encontrado |
| 429 | Too Many Requests - Rate limit excedido |
| 500+ | Server Error - Erro no servidor de destino |

## Suporte

Para suporte técnico ou dúvidas sobre webhooks:
- Email: dev@icefunnel.com
- Documentação: https://docs.icefunnel.com/webhooks
- Status: https://status.icefunnel.com
