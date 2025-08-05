# Documentação Completa de Webhooks - HIAS FLOW

## Introdução aos Webhooks

Webhooks são notificações HTTP em tempo real que o HIAS FLOW envia para seus sistemas quando eventos importantes acontecem. Eles permitem que você automatize fluxos de trabalho, sincronize dados e mantenha seus sistemas sempre atualizados.

### Como Funcionam

1. **Evento ocorre** no HIAS FLOW (ex: formulário submetido)
2. **Webhook é disparado** automaticamente
3. **Payload é enviado** para sua URL configurada
4. **Seu sistema processa** os dados recebidos
5. **Automações são executadas** com base no evento

---

## Configuração de Webhooks

### 1. Criando um Webhook

#### Via Dashboard
1. Acesse **Dashboard → Webhooks**
2. Clique em **"Novo Webhook"**
3. Preencha as informações:
   - **Nome**: Identificação do webhook
   - **URL**: Endpoint que receberá os dados
   - **Eventos**: Selecione os eventos de interesse
   - **Configurações avançadas**: Retry, headers customizados

#### Via API
\`\`\`http
POST /api/webhooks/config
Content-Type: application/json
Authorization: Bearer sk_live_...

{
  "name": "Zapier Integration",
  "url": "https://hooks.zapier.com/hooks/catch/123456/abcdef/",
  "events": ["form.submitted", "funnel.conversion"],
  "maxAttempts": 3,
  "initialDelay": 5,
  "headers": {
    "Authorization": "Bearer zapier-token",
    "X-Source": "hiasflow"
  }
}
\`\`\`

**Resposta:**
\`\`\`json
{
  "success": true,
  "webhook": {
    "id": "wh_1642680000123",
    "name": "Zapier Integration",
    "url": "https://hooks.zapier.com/...",
    "secret": "wh_secret_abc123...",
    "isActive": true,
    "events": ["form.submitted", "funnel.conversion"],
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
\`\`\`

### 2. Validação de Segurança

Todos os webhooks incluem uma assinatura HMAC-SHA256 para validação:

\`\`\`javascript
const crypto = require('crypto');

function validateWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}

// Implementação em Express.js
app.post('/webhook/hiasflow', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const secret = process.env.HIASFLOW_WEBHOOK_SECRET;
  
  if (!validateWebhookSignature(req.body, signature, secret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const payload = JSON.parse(req.body);
  console.log('Webhook received:', payload);
  
  res.status(200).json({ received: true });
});
\`\`\`

---

## Eventos Disponíveis

### 1. form.submitted
Disparado quando qualquer formulário é submetido na plataforma.

**Payload:**
\`\`\`json
{
  "id": "wh_1642680000123",
  "event": "form.submitted",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    "formId": "contact_form",
    "fields": {
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "phone": "+55 11 99999-9999",
      "company": "Empresa XYZ",
      "message": "Gostaria de saber mais sobre o produto"
    },
    "submittedAt": "2024-01-20T10:30:00Z",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "ipAddress": "192.168.1.100",
    "source": "landing_page",
    "utm": {
      "source": "google",
      "medium": "cpc",
      "campaign": "brand_campaign"
    }
  },
  "source": "hiasflow",
  "version": "1.0"
}
\`\`\`

**Casos de Uso:**
- Adicionar lead ao CRM
- Enviar email de boas-vindas
- Notificar equipe de vendas
- Iniciar sequência de nutrição

### 2. funnel.conversion
Disparado quando um lead converte em qualquer etapa do funil.

**Payload:**
\`\`\`json
{
  "id": "wh_1642680000124",
  "event": "funnel.conversion",
  "timestamp": "2024-01-20T10:35:00Z",
  "data": {
    "funnelId": "main_sales_funnel",
    "stepId": "checkout_completed",
    "leadId": "lead_abc123",
    "value": 297.00,
    "currency": "BRL",
    "convertedAt": "2024-01-20T10:35:00Z",
    "previousSteps": [
      {
        "stepId": "landing_page",
        "timestamp": "2024-01-20T10:25:00Z"
      },
      {
        "stepId": "video_watched",
        "timestamp": "2024-01-20T10:28:00Z"
      },
      {
        "stepId": "form_submitted",
        "timestamp": "2024-01-20T10:30:00Z"
      }
    ],
    "conversionPath": "google_ads → landing → video → form → checkout",
    "timeToConvert": 600 // segundos
  },
  "source": "hiasflow",
  "version": "1.0"
}
\`\`\`

### 3. user.registered
Disparado quando um novo usuário se registra na plataforma.

**Payload:**
\`\`\`json
{
  "id": "wh_1642680000125",
  "event": "user.registered",
  "timestamp": "2024-01-20T10:40:00Z",
  "data": {
    "userId": "user_def456",
    "email": "novo@usuario.com",
    "name": "Novo Usuário",
    "plan": "free",
    "registeredAt": "2024-01-20T10:40:00Z",
    "source": "organic",
    "referrer": "https://blog.exemplo.com/artigo",
    "profile": {
      "company": "Startup ABC",
      "role": "Founder",
      "companySize": "1-10"
    }
  },
  "source": "hiasflow",
  "version": "1.0"
}
\`\`\`

### 4. payment.completed
Disparado quando um pagamento é processado com sucesso.

**Payload:**
\`\`\`json
{
  "id": "wh_1642680000126",
  "event": "payment.completed",
  "timestamp": "2024-01-20T10:45:00Z",
  "data": {
    "paymentId": "pay_ghi789",
    "amount": 297.00,
    "currency": "BRL",
    "customerId": "cust_jkl012",
    "productId": "prod_mno345",
    "completedAt": "2024-01-20T10:45:00Z",
    "paymentMethod": "credit_card",
    "card": {
      "brand": "visa",
      "last4": "4242",
      "country": "BR"
    },
    "billing": {
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "address": {
        "line1": "Rua das Flores, 123",
        "city": "São Paulo",
        "state": "SP",
        "postal_code": "01234-567",
        "country": "BR"
      }
    }
  },
  "source": "hiasflow",
  "version": "1.0"
}
\`\`\`

### 5. lead.qualified
Disparado quando um lead atinge critérios de qualificação.

**Payload:**
\`\`\`json
{
  "id": "wh_1642680000127",
  "event": "lead.qualified",
  "timestamp": "2024-01-20T10:50:00Z",
  "data": {
    "leadId": "lead_pqr678",
    "email": "lead@exemplo.com",
    "name": "Lead Qualificado",
    "score": 85,
    "qualification": "hot",
    "qualificationCriteria": [
      "form_submitted",
      "high_engagement",
      "enterprise_email",
      "decision_maker_title"
    ],
    "qualifiedAt": "2024-01-20T10:50:00Z",
    "source": "webinar",
    "tags": ["enterprise", "hot_lead", "q1_2024"],
    "profile": {
      "company": "Grande Empresa Ltda",
      "role": "CEO",
      "industry": "Technology",
      "employees": "51-200"
    },
    "behavior": {
      "pageViews": 15,
      "timeOnSite": 1200,
      "downloadsCount": 3,
      "emailOpens": 8
    }
  },
  "source": "hiasflow",
  "version": "1.0"
}
\`\`\`

### 6. automation.triggered
Disparado quando uma automação é acionada.

**Payload:**
\`\`\`json
{
  "id": "wh_1642680000128",
  "event": "automation.triggered",
  "timestamp": "2024-01-20T11:00:00Z",
  "data": {
    "automationId": "auto_stu901",
    "name": "Welcome Email Sequence",
    "triggerType": "form_submission",
    "targetId": "lead_abc123",
    "triggeredAt": "2024-01-20T11:00:00Z",
    "conditions": [
      {
        "field": "email",
        "operator": "contains",
        "value": "@empresa.com"
      },
      {
        "field": "source",
        "operator": "equals",
        "value": "landing_page"
      }
    ],
    "actions": [
      {
        "type": "send_email",
        "templateId": "welcome_template",
        "delay": 0
      },
      {
        "type": "add_to_sequence",
        "sequenceId": "nurture_sequence",
        "delay": 3600
      }
    ]
  },
  "source": "hiasflow",
  "version": "1.0"
}
\`\`\`

---

## Integrações Populares

### 1. Zapier

#### Configuração no Zapier
1. **Trigger**: Webhook by Zapier
2. **URL**: Copie da configuração do webhook no HIAS FLOW
3. **Secret**: Use o secret fornecido pelo HIAS FLOW

#### Exemplo de Zap
\`\`\`
Trigger: HIAS FLOW Webhook (form.submitted)
↓
Filter: Email contains "@empresa.com"
↓
Action: Add to Google Sheets
↓
Action: Send Slack notification
↓
Action: Create HubSpot contact
\`\`\`

### 2. Make (Integromat)

#### Configuração no Make
\`\`\`json
{
  "webhook": {
    "url": "https://hook.integromat.com/abc123def456",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "X-Make-Source": "hiasflow"
    }
  },
  "events": ["funnel.conversion", "payment.completed"],
  "filters": {
    "value": {
      "gte": 100
    }
  }
}
\`\`\`

### 3. HubSpot CRM

\`\`\`javascript
// Integração com HubSpot
const hubspot = require('@hubspot/api-client');

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN
});

app.post('/webhook/hiasflow', async (req, res) => {
  const { event, data } = req.body;

  switch (event) {
    case 'form.submitted':
      await createHubSpotContact(data);
      break;
    case 'funnel.conversion':
      await updateHubSpotDeal(data);
      break;
    case 'payment.completed':
      await createHubSpotDeal(data);
      break;
  }

  res.json({ received: true });
});

async function createHubSpotContact(formData) {
  const contactObj = {
    properties: {
      email: formData.fields.email,
      firstname: formData.fields.name?.split(' ')[0],
      lastname: formData.fields.name?.split(' ').slice(1).join(' '),
      company: formData.fields.company,
      phone: formData.fields.phone,
      lifecyclestage: 'lead',
      lead_source: formData.source
    }
  };

  try {
    const response = await hubspotClient.crm.contacts.basicApi.create(contactObj);
    console.log('HubSpot contact created:', response.id);
  } catch (error) {
    console.error('Error creating HubSpot contact:', error);
  }
}
\`\`\`

### 4. Mailchimp

\`\`\`javascript
// Integração com Mailchimp
const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX
});

app.post('/webhook/hiasflow', async (req, res) => {
  const { event, data } = req.body;

  if (event === 'form.submitted' && data.fields.email) {
    await addToMailchimpList(data.fields);
  }

  res.json({ received: true });
});

async function addToMailchimpList(fields) {
  try {
    const response = await mailchimp.lists.addListMember('list_id', {
      email_address: fields.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: fields.name?.split(' ')[0] || '',
        LNAME: fields.name?.split(' ').slice(1).join(' ') || '',
        COMPANY: fields.company || ''
      },
      tags: ['hiasflow', 'new_lead']
    });
    
    console.log('Added to Mailchimp:', response.id);
  } catch (error) {
    console.error('Mailchimp error:', error);
  }
}
\`\`\`

### 5. Slack

\`\`\`javascript
// Integração com Slack
const { WebClient } = require('@slack/web-api');

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

app.post('/webhook/hiasflow', async (req, res) => {
  const { event, data } = req.body;

  switch (event) {
    case 'funnel.conversion':
      await sendSlackNotification('sales', {
        text: `🎉 Nova conversão de R$ ${data.value}!`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Nova Conversão!*\n💰 Valor: R$ ${data.value}\n🎯 Funil: ${data.funnelId}\n⏰ ${new Date(data.convertedAt).toLocaleString('pt-BR')}`
            }
          }
        ]
      });
      break;
      
    case 'lead.qualified':
      if (data.qualification === 'hot') {
        await sendSlackNotification('sales', {
          text: `🔥 Lead quente qualificado: ${data.email}`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Lead Quente Detectado!*\n📧 Email: ${data.email}\n🏢 Empresa: ${data.profile?.company || 'N/A'}\n📊 Score: ${data.score}/100`
              }
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: { type: 'plain_text', text: 'Ver no CRM' },
                  url: `https://crm.empresa.com/leads/${data.leadId}`
                }
              ]
            }
          ]
        });
      }
      break;
  }

  res.json({ received: true });
});

async function sendSlackNotification(channel, message) {
  try {
    await slack.chat.postMessage({
      channel: `#${channel}`,
      ...message
    });
  } catch (error) {
    console.error('Slack notification error:', error);
  }
}
\`\`\`

---

## Webhooks de Entrada (Incoming)

O HIAS FLOW também pode receber webhooks de sistemas externos para processar eventos em sua plataforma.

### Configuração

#### 1. Criar Endpoint de Entrada
\`\`\`http
POST /api/webhooks/incoming/config
\`\`\`

\`\`\`json
{
  "name": "Zapier Incoming",
  "endpoint": "zapier-leads",
  "secret": "incoming_secret_123",
  "allowedSources": ["zapier.com", "hooks.zapier.com"],
  "eventMapping": {
    "lead_created": "lead.qualified",
    "contact_updated": "user.updated",
    "payment_received": "payment.completed"
  }
}
\`\`\`

#### 2. URL Gerada
\`\`\`
https://app.hiasflow.com/api/webhooks/incoming/zapier-leads
\`\`\`

### Exemplo de Payload Recebido

\`\`\`json
{
  "event": "lead_created",
  "timestamp": "2024-01-20T11:00:00Z",
  "data": {
    "email": "lead@exemplo.com",
    "name": "Lead Externo",
    "source": "facebook_ads",
    "score": 75,
    "tags": ["facebook", "cold_lead"],
    "custom_fields": {
      "budget": "10000-50000",
      "timeline": "3_months"
    }
  }
}
\`\`\`

### Processamento Automático

O HIAS FLOW processa automaticamente webhooks recebidos:

1. **Valida assinatura** usando o secret configurado
2. **Mapeia eventos** externos para eventos internos
3. **Processa dados** no sistema
4. **Dispara automações** baseadas no evento mapeado

---

## Configurações Avançadas

### 1. Retry Logic

\`\`\`json
{
  "retryConfig": {
    "maxAttempts": 5,
    "backoffMultiplier": 2.0,
    "initialDelay": 5,
    "maxDelay": 300
  }
}
\`\`\`

**Sequência de Retry:**
- Tentativa 1: Imediato
- Tentativa 2: 5 segundos
- Tentativa 3: 10 segundos
- Tentativa 4: 20 segundos
- Tentativa 5: 40 segundos

### 2. Headers Customizados

\`\`\`json
{
  "headers": {
    "Authorization": "Bearer custom-token",
    "X-API-Version": "v2",
    "X-Source": "hiasflow",
    "Content-Type": "application/json"
  }
}
\`\`\`

### 3. Filtros de Evento

\`\`\`json
{
  "filters": {
    "value": {
      "gte": 100
    },
    "source": {
      "in": ["google_ads", "facebook"]
    },
    "tags": {
      "contains": "enterprise"
    }
  }
}
\`\`\`

### 4. Transformação de Dados

\`\`\`javascript
// Middleware para transformar dados antes do envio
const transformWebhookData = (event, data) => {
  switch (event) {
    case 'form.submitted':
      return {
        ...data,
        fields: {
          ...data.fields,
          // Normalizar telefone
          phone: normalizePhone(data.fields.phone),
          // Adicionar timestamp
          processed_at: new Date().toISOString()
        }
      };
      
    case 'funnel.conversion':
      return {
        ...data,
        // Converter valor para centavos
        valueInCents: Math.round(data.value * 100),
        // Adicionar informações de funil
        funnelInfo: getFunnelInfo(data.funnelId)
      };
      
    default:
      return data;
  }
};
\`\`\`

---

## Monitoramento e Debugging

### 1. Logs de Webhook

#### Consultar Logs
\`\`\`http
GET /api/webhooks/logs?webhookId=wh_123&limit=100&status=error
\`\`\`

**Resposta:**
\`\`\`json
{
  "logs": [
    {
      "id": "log_1642680000123",
      "webhookId": "wh_123",
      "event": "form.submitted",
      "status": "error",
      "httpStatus": 500,
      "duration": 5000,
      "attempts": 3,
      "error": "Connection timeout",
      "timestamp": "2024-01-20T10:30:00Z",
      "payload": {
        "id": "wh_...",
        "event": "form.submitted"
      },
      "response": {
        "status": 500,
        "body": "Internal Server Error"
      }
    }
  ],
  "pagination": {
    "total": 250,
    "limit": 100,
    "offset": 0,
    "hasMore": true
  }
}
\`\`\`

### 2. Métricas de Performance

\`\`\`http
GET /api/webhooks/stats?webhookId=wh_123&period=7d
\`\`\`

**Resposta:**
\`\`\`json
{
  "stats": {
    "period": "7d",
    "totalDeliveries": 1250,
    "successfulDeliveries": 1225,
    "failedDeliveries": 25,
    "successRate": 98.0,
    "averageResponseTime": 245,
    "errorsByType": {
      "timeout": 15,
      "connection_error": 8,
      "http_error": 2
    },
    "deliveriesByDay": [
      {"date": "2024-01-14", "deliveries": 180, "errors": 2},
      {"date": "2024-01-15", "deliveries": 195, "errors": 1},
      {"date": "2024-01-16", "deliveries": 210, "errors": 5}
    ]
  }
}
\`\`\`

### 3. Alertas Automáticos

Configure alertas para monitorar a saúde dos webhooks:

\`\`\`json
{
  "alerts": {
    "successRateBelow": 95,
    "responseTimeAbove": 5000,
    "errorCountAbove": 10,
    "notifications": {
      "email": ["admin@empresa.com"],
      "slack": "#alerts",
      "webhook": "https://alerts.empresa.com/webhook"
    }
  }
}
\`\`\`

---

## Casos de Uso Práticos

### 1. E-commerce Completo

\`\`\`javascript
// Automação completa para e-commerce
class EcommerceAutomation {
  constructor() {
    this.setupWebhooks();
  }

  setupWebhooks() {
    // Webhook para carrinho abandonado
    app.post('/webhook/cart-abandoned', async (req, res) => {
      const { data } = req.body;
      
      // Aguardar 1 hora e enviar email de recuperação
      setTimeout(async () => {
        await this.sendAbandonedCartEmail(data.email, data.cartItems);
      }, 3600000);
      
      res.json({ received: true });
    });

    // Webhook para primeira compra
    app.post('/webhook/first-purchase', async (req, res) => {
      const { data } = req.body;
      
      await Promise.all([
        this.sendWelcomeEmail(data.customerId),
        this.addToVIPList(data.customerId),
        this.scheduleFollowUp(data.customerId, 7) // 7 dias
      ]);
      
      res.json({ received: true });
    });
  }

  async sendAbandonedCartEmail(email, items) {
    // Implementar envio de email
    console.log(`Sending abandoned cart email to ${email}`);
  }

  async addToVIPList(customerId) {
    // Adicionar à lista VIP
    console.log(`Adding ${customerId} to VIP list`);
  }
}
\`\`\`

### 2. SaaS Onboarding

\`\`\`javascript
// Automação de onboarding para SaaS
class SaaSOnboardingAutomation {
  constructor() {
    this.onboardingSteps = [
      'account_created',
      'profile_completed',
      'first_project',
      'team_invited',
      'integration_setup'
    ];
  }

  async handleUserRegistered(userData) {
    // Iniciar sequência de onboarding
    await this.scheduleOnboardingEmails(userData.userId);
    
    // Criar tarefas no sistema de CRM
    await this.createOnboardingTasks(userData);
    
    // Notificar equipe de sucesso do cliente
    await this.notifySuccessTeam(userData);
  }

  async handleOnboardingStep(stepData) {
    const stepIndex = this.onboardingSteps.indexOf(stepData.stepId);
    const progress = ((stepIndex + 1) / this.onboardingSteps.length) * 100;
    
    // Atualizar progresso no CRM
    await this.updateCRMProgress(stepData.userId, progress);
    
    // Se completou 50%, notificar vendas
    if (progress >= 50) {
      await this.notifySalesTeam(stepData.userId);
    }
    
    // Se completou 100%, enviar email de parabéns
    if (progress === 100) {
      await this.sendCompletionEmail(stepData.userId);
    }
  }
}
\`\`\`

### 3. Lead Scoring Dinâmico

\`\`\`javascript
// Sistema de lead scoring em tempo real
class DynamicLeadScoring {
  constructor() {
    this.scoringRules = {
      'form.submitted': 10,
      'email.opened': 5,
      'email.clicked': 15,
      'page.viewed': 2,
      'video.watched': 20,
      'demo.requested': 50
    };
  }

  async handleWebhookEvent(event, data) {
    const score = this.scoringRules[event] || 0;
    
    // Atualizar score do lead
    await this.updateLeadScore(data.leadId || data.email, score);
    
    // Verificar se atingiu threshold para qualificação
    const totalScore = await this.getTotalScore(data.leadId || data.email);
    
    if (totalScore >= 75) {
      await this.qualifyLead(data.leadId || data.email, totalScore);
    }
  }

  async updateLeadScore(leadId, additionalScore) {
    // Implementar atualização de score
    console.log(`Updating score for ${leadId}: +${additionalScore}`);
  }

  async qualifyLead(leadId, score) {
    // Qualificar lead automaticamente
    await fetch('/api/leads/qualify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HIASFLOW_API_KEY}`
      },
      body: JSON.stringify({
        leadId,
        score,
        criteria: ['dynamic_scoring'],
        source: 'automated_scoring'
      })
    });
  }
}
\`\`\`

---

## Segurança Avançada

### 1. Validação de IP

\`\`\`javascript
// Whitelist de IPs permitidos
const allowedIPs = [
  '52.89.214.238',  // HIAS FLOW
  '52.89.214.239',  // HIAS FLOW
  '54.187.174.169', // HIAS FLOW
  '54.187.205.235'  // HIAS FLOW
];

const validateIP = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (!allowedIPs.includes(clientIP)) {
    return res.status(403).json({ error: 'IP not allowed' });
  }
  
  next();
};

app.use('/webhook', validateIP);
\`\`\`

### 2. Rate Limiting por Webhook

\`\`\`javascript
const rateLimit = require('express-rate-limit');

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // máximo 100 requests por minuto
  message: 'Too many webhook requests',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit por webhook ID
    return req.headers['x-webhook-id'] || req.ip;
  }
});

app.use('/webhook', webhookLimiter);
\`\`\`

### 3. Criptografia de Payload

\`\`\`javascript
const crypto = require('crypto');

class WebhookEncryption {
  constructor(encryptionKey) {
    this.algorithm = 'aes-256-gcm';
    this.key = Buffer.from(encryptionKey, 'hex');
  }

  encryptPayload(payload) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decryptPayload(encryptedData) {
    const decipher = crypto.createDecipher(
      this.algorithm,
      this.key,
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }
}
\`\`\`

---

## Troubleshooting

### Problemas Comuns

#### 1. Webhook não está sendo entregue

**Possíveis causas:**
- URL inacessível ou inválida
- Webhook desativado
- Rate limit excedido
- Firewall bloqueando requisições

**Soluções:**
\`\`\`bash
# Testar conectividade
curl -X POST https://seu-endpoint.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Verificar logs
curl -X GET "https://app.hiasflow.com/api/webhooks/logs?webhookId=wh_123" \
  -H "Authorization: Bearer sk_live_..."
\`\`\`

#### 2. Assinatura inválida

**Verificação:**
\`\`\`javascript
// Debug da assinatura
const debugSignature = (payload, receivedSignature, secret) => {
  const calculatedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  console.log('Received:', receivedSignature);
  console.log('Calculated:', `sha256=${calculatedSignature}`);
  console.log('Match:', receivedSignature === `sha256=${calculatedSignature}`);
};
\`\`\`

#### 3. Timeouts frequentes

**Otimizações:**
\`\`\`javascript
// Processamento assíncrono
app.post('/webhook', async (req, res) => {
  // Responder imediatamente
  res.status(200).json({ received: true });
  
  // Processar em background
  setImmediate(async () => {
    try {
      await processWebhookData(req.body);
    } catch (error) {
      console.error('Background processing error:', error);
    }
  });
});

// Queue para processamento
const Queue = require('bull');
const webhookQueue = new Queue('webhook processing');

webhookQueue.process(async (job) => {
  const { event, data } = job.data;
  await processWebhookData(event, data);
});

app.post('/webhook', async (req, res) => {
  // Adicionar à queue
  await webhookQueue.add('process', req.body);
  res.status(200).json({ queued: true });
});
\`\`\`

---

## Ferramentas de Desenvolvimento

### 1. Webhook Tester

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>HIAS FLOW Webhook Tester</title>
</head>
<body>
    <h1>Webhook Tester</h1>
    <form id="webhookForm">
        <label>Webhook URL:</label>
        <input type="url" id="webhookUrl" required>
        
        <label>Event Type:</label>
        <select id="eventType">
            <option value="form.submitted">Form Submitted</option>
            <option value="funnel.conversion">Funnel Conversion</option>
            <option value="payment.completed">Payment Completed</option>
        </select>
        
        <label>Test Payload:</label>
        <textarea id="payload" rows="10"></textarea>
        
        <button type="submit">Send Test Webhook</button>
    </form>

    <div id="result"></div>

    <script>
        document.getElementById('webhookForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const url = document.getElementById('webhookUrl').value;
            const eventType = document.getElementById('eventType').value;
            const payload = JSON.parse(document.getElementById('payload').value);
            
            try {
                const response = await fetch('/api/webhooks/test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url,
                        event: eventType,
                        payload
                    })
                });
                
                const result = await response.json();
                document.getElementById('result').innerHTML = 
                    `<pre>${JSON.stringify(result, null, 2)}</pre>`;
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    `<div style="color: red;">Error: ${error.message}</div>`;
            }
        });
    </script>
</body>
</html>
\`\`\`

### 2. CLI Tool

\`\`\`bash
# Instalar CLI
npm install -g @hiasflow/cli

# Configurar
hiasflow config set api-key sk_live_...

# Listar webhooks
hiasflow webhooks list

# Testar webhook
hiasflow webhooks test wh_123 --event form.submitted

# Ver logs
hiasflow webhooks logs wh_123 --tail

# Criar webhook
hiasflow webhooks create \
  --name "My Webhook" \
  --url "https://my-app.com/webhook" \
  --events "form.submitted,funnel.conversion"
\`\`\`

### 3. Postman Collection

\`\`\`json
{
  "info": {
    "name": "HIAS FLOW Webhooks API",
    "description": "Collection completa para testar webhooks"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{api_key}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Create Webhook",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Test Webhook\",\n  \"url\": \"https://webhook.site/unique-id\",\n  \"events\": [\"form.submitted\"]\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{base_url}}/api/webhooks/config",
          "host": ["{{base_url}}"],
          "path": ["api", "webhooks", "config"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://app.hiasflow.com"
    },
    {
      "key": "api_key",
      "value": "sk_live_..."
    }
  ]
}
\`\`\`

---

## Compliance e Governança

### LGPD/GDPR

\`\`\`javascript
// Implementação de compliance
class ComplianceHandler {
  async handleDataRequest(type, userEmail) {
    switch (type) {
      case 'export':
        return await this.exportUserData(userEmail);
      case 'delete':
        return await this.deleteUserData(userEmail);
      case 'anonymize':
        return await this.anonymizeUserData(userEmail);
    }
  }

  async exportUserData(email) {
    const userData = await this.collectUserData(email);
    
    // Webhook para notificar exportação
    await fetch('/api/webhooks/trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HIASFLOW_API_KEY}`
      },
      body: JSON.stringify({
        event: 'data.exported',
        data: {
          email,
          exportId: userData.exportId,
          requestedAt: new Date().toISOString()
        }
      })
    });
    
    return userData;
  }
}
\`\`\`

### Auditoria

\`\`\`javascript
// Log de auditoria para webhooks
const auditLog = {
  async logWebhookEvent(webhookId, event, data, result) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      webhookId,
      event,
      dataHash: crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'),
      success: result.success,
      duration: result.duration,
      userAgent: result.userAgent,
      ipAddress: result.ipAddress
    };
    
    // Salvar no sistema de auditoria
    await this.saveAuditLog(logEntry);
  },

  async getAuditTrail(webhookId, startDate, endDate) {
    // Recuperar trilha de auditoria
    return await this.queryAuditLogs({
      webhookId,
      startDate,
      endDate
    });
  }
};
\`\`\`

---

## Migração e Versionamento

### Versionamento de API

\`\`\`http
# Versão específica
GET /api/v1/webhooks/config

# Versão mais recente (padrão)
GET /api/webhooks/config

# Header de versão
X-API-Version: 2024-01-20
\`\`\`

### Migração de Webhooks

\`\`\`javascript
// Script de migração
class WebhookMigration {
  async migrateFromV1ToV2(webhookId) {
    const v1Config = await this.getV1Config(webhookId);
    
    const v2Config = {
      ...v1Config,
      // Novos campos da v2
      retryConfig: {
        maxAttempts: v1Config.maxRetries || 3,
        backoffMultiplier: 2.0,
        initialDelay: 5
      },
      filters: this.convertV1Filters(v1Config.filters),
      headers: {
        ...v1Config.headers,
        'X-API-Version': '2.0'
      }
    };
    
    await this.createV2Webhook(v2Config);
    await this.deprecateV1Webhook(webhookId);
  }
}
\`\`\`

---

## Exemplos de Payload Completos

### Formulário de Contato Completo
\`\`\`json
{
  "id": "wh_1642680000123",
  "event": "form.submitted",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    "formId": "contact_form_v2",
    "formName": "Contato - Landing Page Principal",
    "fields": {
      "name": "João Silva Santos",
      "email": "joao.silva@empresaxyz.com.br",
      "phone": "+55 11 99999-9999",
      "company": "Empresa XYZ Tecnologia Ltda",
      "position": "CEO",
      "employees": "51-200",
      "industry": "Technology",
      "budget": "R$ 10.000 - R$ 50.000",
      "timeline": "3 meses",
      "message": "Gostaria de agendar uma demonstração do produto para avaliar a implementação em nossa empresa.",
      "newsletter": true,
      "terms": true
    },
    "submittedAt": "2024-01-20T10:30:00Z",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "ipAddress": "192.168.1.100",
    "location": {
      "country": "BR",
      "region": "SP",
      "city": "São Paulo",
      "timezone": "America/Sao_Paulo"
    },
    "source": "landing_page",
    "referrer": "https://google.com/search?q=funis+ia",
    "utm": {
      "source": "google",
      "medium": "cpc",
      "campaign": "brand_campaign_q1",
      "term": "funis+inteligencia+artificial",
      "content": "ad_variant_a"
    },
    "session": {
      "id": "sess_abc123",
      "duration": 420,
      "pageViews": 5,
      "isReturning": false,
      "device": "desktop",
      "browser": "Chrome",
      "os": "Windows"
    }
  },
  "source": "hiasflow",
  "version": "1.0"
}
\`\`\`

---

## Recursos Adicionais

### Documentação Interativa
- **Swagger UI**: https://api.hiasflow.com/docs
- **Redoc**: https://api.hiasflow.com/redoc
- **GraphQL Playground**: https://api.hiasflow.com/graphql

### Comunidade
- **GitHub**: https://github.com/hiasflow
- **Stack Overflow**: Tag `hiasflow`
- **Reddit**: r/hiasflow

### Changelog
- **v1.0**: Lançamento inicial
- **v1.1**: Adicionado suporte a filtros
- **v1.2**: Webhooks de entrada
- **v2.0**: Nova estrutura de payload e retry logic

---

*Esta documentação é mantida atualizada automaticamente. Para sugestões ou correções, entre em contato com nossa equipe de desenvolvimento.*
