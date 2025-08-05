# Documentação Completa da API - HIAS FLOW

## Visão Geral

A API do HIAS FLOW é uma solução RESTful completa que permite integração total com nossa plataforma de funis inteligentes. Nossa API foi projetada para ser simples, poderosa e escalável, oferecendo endpoints para todas as funcionalidades principais da plataforma.

### Base URL
\`\`\`
https://app.hiasflow.com/api
\`\`\`

### Autenticação

Todas as requisições à API devem incluir uma chave de API válida no header de autorização:

\`\`\`http
Authorization: Bearer sk_live_1234567890abcdef
\`\`\`

#### Tipos de Chaves API

| Tipo | Prefixo | Ambiente | Descrição |
|------|---------|----------|-----------|
| Live | `sk_live_` | Produção | Para uso em produção |
| Test | `sk_test_` | Desenvolvimento | Para testes e desenvolvimento |

### Rate Limiting

- **Limite padrão**: 1000 requisições por minuto
- **Limite Enterprise**: 10000 requisições por minuto
- **Headers de resposta**:
  - `X-RateLimit-Limit`: Limite total
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Timestamp do reset

### Códigos de Status HTTP

| Código | Significado | Descrição |
|--------|-------------|-----------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos na requisição |
| 401 | Unauthorized | Chave API inválida ou ausente |
| 403 | Forbidden | Acesso negado ao recurso |
| 404 | Not Found | Recurso não encontrado |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Erro interno do servidor |

---

## Endpoints da API

### 1. Formulários

#### Submeter Formulário
Registra a submissão de um formulário e dispara webhooks automaticamente.

\`\`\`http
POST /api/forms/submit
\`\`\`

**Parâmetros:**
\`\`\`json
{
  "formId": "contact_form",
  "fields": {
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "phone": "+55 11 99999-9999",
    "company": "Empresa XYZ"
  },
  "userId": "user_123",
  "source": "landing_page"
}
\`\`\`

**Resposta de Sucesso (201):**
\`\`\`json
{
  "success": true,
  "id": "form_1642680000123",
  "message": "Formulário enviado com sucesso",
  "webhookTriggered": true
}
\`\`\`

**Exemplo de Integração:**
\`\`\`javascript
// JavaScript/TypeScript
const response = await fetch('/api/forms/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk_live_...'
  },
  body: JSON.stringify({
    formId: 'newsletter_signup',
    fields: {
      email: 'usuario@exemplo.com',
      interests: ['marketing', 'vendas']
    },
    userId: 'user_456',
    source: 'blog_post'
  })
});

const result = await response.json();
console.log('Form submitted:', result);
\`\`\`

\`\`\`python
# Python
import requests

response = requests.post(
    'https://app.icefunnel.com/api/forms/submit',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk_live_...'
    },
    json={
        'formId': 'contact_form',
        'fields': {
            'name': 'Maria Santos',
            'email': 'maria@exemplo.com'
        },
        'userId': 'user_789',
        'source': 'website'
    }
)

result = response.json()
print(f"Form submitted: {result}")
\`\`\`

---

### 2. Conversões de Funil

#### Rastrear Conversão
Registra uma conversão no funil e calcula métricas automaticamente.

\`\`\`http
POST /api/funnels/conversion
\`\`\`

**Parâmetros:**
\`\`\`json
{
  "funnelId": "main_sales_funnel",
  "stepId": "checkout_completed",
  "leadId": "lead_abc123",
  "value": 297.00,
  "userId": "user_123",
  "previousSteps": ["landing", "video", "form"]
}
\`\`\`

**Resposta de Sucesso (201):**
\`\`\`json
{
  "success": true,
  "conversionId": "conv_1642680000456",
  "message": "Conversão registrada com sucesso",
  "metrics": {
    "conversionRate": 12.5,
    "totalRevenue": 15000.00,
    "averageValue": 285.50
  }
}
\`\`\`

**Exemplo de Integração:**
\`\`\`javascript
// Rastrear conversão em checkout
const trackConversion = async (orderId, amount) => {
  try {
    const response = await fetch('/api/funnels/conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk_live_...'
      },
      body: JSON.stringify({
        funnelId: 'ecommerce_funnel',
        stepId: 'purchase_completed',
        leadId: `lead_${orderId}`,
        value: amount,
        userId: getCurrentUserId(),
        metadata: {
          orderId,
          timestamp: new Date().toISOString()
        }
      })
    });

    const result = await response.json();
    console.log('Conversion tracked:', result);
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
};
\`\`\`

---

### 3. Qualificação de Leads

#### Qualificar Lead
Qualifica um lead com base em critérios definidos e dispara automações.

\`\`\`http
POST /api/leads/qualify
\`\`\`

**Parâmetros:**
\`\`\`json
{
  "email": "lead@exemplo.com",
  "name": "Lead Qualificado",
  "score": 85,
  "criteria": ["form_submitted", "high_engagement", "enterprise"],
  "source": "webinar",
  "tags": ["hot_lead", "enterprise", "q1_2024"],
  "userId": "user_123"
}
\`\`\`

**Resposta de Sucesso (201):**
\`\`\`json
{
  "success": true,
  "leadId": "lead_1642680000789",
  "score": 85,
  "qualification": "hot",
  "message": "Lead qualificado com sucesso",
  "automationsTriggered": ["welcome_sequence", "sales_notification"]
}
\`\`\`

**Sistema de Pontuação:**
| Score | Qualificação | Ações Automáticas |
|-------|--------------|-------------------|
| 90-100 | Hot Lead | Notificação imediata para vendas |
| 70-89 | Warm Lead | Sequência de nutrição acelerada |
| 50-69 | Cold Lead | Sequência de nutrição padrão |
| 0-49 | Unqualified | Sequência educativa |

---

### 4. Pagamentos

#### Registrar Pagamento
Registra um pagamento completado e atualiza métricas de receita.

\`\`\`http
POST /api/payments/complete
\`\`\`

**Parâmetros:**
\`\`\`json
{
  "amount": 297.00,
  "currency": "BRL",
  "customerId": "cust_abc123",
  "productId": "prod_xyz789",
  "paymentMethod": "credit_card",
  "userId": "user_123"
}
\`\`\`

**Resposta de Sucesso (201):**
\`\`\`json
{
  "success": true,
  "paymentId": "pay_1642680000012",
  "message": "Pagamento processado com sucesso",
  "receipt": {
    "amount": 297.00,
    "currency": "BRL",
    "timestamp": "2024-01-20T10:30:00Z"
  }
}
\`\`\`

---

### 5. Registro de Usuários

#### Registrar Usuário
Cria um novo usuário no sistema e inicia sequências de onboarding.

\`\`\`http
POST /api/users/register
\`\`\`

**Parâmetros:**
\`\`\`json
{
  "email": "novo@usuario.com",
  "name": "Novo Usuário",
  "source": "organic",
  "plan": "free"
}
\`\`\`

**Resposta de Sucesso (201):**
\`\`\`json
{
  "success": true,
  "userId": "user_1642680000345",
  "message": "Usuário registrado com sucesso",
  "onboardingStarted": true
}
\`\`\`

---

## SDKs e Bibliotecas

### JavaScript/TypeScript SDK

\`\`\`bash
npm install @icefunnel/sdk
\`\`\`

\`\`\`javascript
import { IceFunnel } from '@icefunnel/sdk';

const icefunnel = new IceFunnel({
  apiKey: 'sk_live_...',
  environment: 'production' // ou 'development'
});

// Submeter formulário
await icefunnel.forms.submit({
  formId: 'contact',
  fields: { email: 'user@example.com' }
});

// Rastrear conversão
await icefunnel.conversions.track({
  funnelId: 'main',
  value: 99.99
});

// Qualificar lead
await icefunnel.leads.qualify({
  email: 'lead@example.com',
  score: 85
});
\`\`\`

### Python SDK

\`\`\`bash
pip install icefunnel-python
\`\`\`

\`\`\`python
from icefunnel import IceFunnel

client = IceFunnel(api_key='sk_live_...')

# Submeter formulário
result = client.forms.submit(
    form_id='contact',
    fields={'email': 'user@example.com'},
    user_id='user_123'
)

# Rastrear conversão
conversion = client.conversions.track(
    funnel_id='main',
    step_id='checkout',
    value=99.99
)

# Qualificar lead
lead = client.leads.qualify(
    email='lead@example.com',
    score=85,
    tags=['enterprise', 'hot']
)
\`\`\`

### PHP SDK

\`\`\`bash
composer require icefunnel/php-sdk
\`\`\`

\`\`\`php
<?php
use IceFunnel\Client;

$client = new Client('sk_live_...');

// Submeter formulário
$result = $client->forms->submit([
    'formId' => 'contact',
    'fields' => [
        'email' => 'user@example.com',
        'name' => 'João Silva'
    ],
    'userId' => 'user_123'
]);

// Rastrear conversão
$conversion = $client->conversions->track([
    'funnelId' => 'main',
    'stepId' => 'purchase',
    'value' => 99.99
]);
\`\`\`

---

## Tratamento de Erros

### Estrutura de Erro Padrão

\`\`\`json
{
  "error": {
    "type": "validation_error",
    "message": "Dados inválidos fornecidos",
    "details": {
      "field": "email",
      "code": "invalid_format",
      "description": "Formato de email inválido"
    },
    "timestamp": "2024-01-20T10:30:00Z",
    "requestId": "req_1642680000123"
  }
}
\`\`\`

### Tipos de Erro Comuns

| Tipo | Código HTTP | Descrição | Solução |
|------|-------------|-----------|---------|
| `authentication_error` | 401 | Chave API inválida | Verificar chave API |
| `validation_error` | 400 | Dados inválidos | Corrigir formato dos dados |
| `rate_limit_error` | 429 | Muitas requisições | Implementar backoff |
| `not_found_error` | 404 | Recurso não encontrado | Verificar IDs |
| `server_error` | 500 | Erro interno | Tentar novamente |

### Implementação de Retry

\`\`\`javascript
const apiCall = async (endpoint, data, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk_live_...'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        return await response.json();
      }

      if (response.status === 429) {
        // Rate limit - aguardar antes de tentar novamente
        const delay = Math.pow(2, i) * 1000; // Backoff exponencial
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
\`\`\`

---

## Monitoramento e Analytics

### Métricas Disponíveis

#### Endpoint de Métricas
\`\`\`http
GET /api/analytics/metrics?period=30d&userId=user_123
\`\`\`

**Resposta:**
\`\`\`json
{
  "period": "30d",
  "metrics": {
    "totalForms": 1250,
    "totalConversions": 156,
    "conversionRate": 12.48,
    "totalRevenue": 46350.00,
    "averageOrderValue": 297.12,
    "topSources": [
      {"source": "google_ads", "conversions": 45},
      {"source": "facebook", "conversions": 32},
      {"source": "organic", "conversions": 28}
    ]
  }
}
\`\`\`

### Logs de API

#### Consultar Logs
\`\`\`http
GET /api/logs?limit=100&offset=0&userId=user_123
\`\`\`

**Resposta:**
\`\`\`json
{
  "logs": [
    {
      "id": "log_123",
      "endpoint": "/api/forms/submit",
      "method": "POST",
      "status": 201,
      "duration": 245,
      "timestamp": "2024-01-20T10:30:00Z",
      "userAgent": "Mozilla/5.0...",
      "ip": "192.168.1.100"
    }
  ],
  "pagination": {
    "total": 5000,
    "limit": 100,
    "offset": 0,
    "hasMore": true
  }
}
\`\`\`

---

## Integração com Frameworks Populares

### Next.js

\`\`\`javascript
// pages/api/icefunnel-webhook.js
import { IceFunnel } from '@icefunnel/sdk';

const icefunnel = new IceFunnel({
  apiKey: process.env.ICEFUNNEL_API_KEY
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const result = await icefunnel.forms.submit({
        formId: 'contact',
        fields: req.body,
        userId: req.user?.id
      });
      
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
\`\`\`

### React Hook

\`\`\`javascript
// hooks/useIceFunnel.js
import { useState } from 'react';
import { IceFunnel } from '@icefunnel/sdk';

const icefunnel = new IceFunnel({
  apiKey: process.env.NEXT_PUBLIC_ICEFUNNEL_API_KEY
});

export function useIceFunnel() {
  const [loading, setLoading] = useState(false);

  const submitForm = async (formData) => {
    setLoading(true);
    try {
      const result = await icefunnel.forms.submit(formData);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const trackConversion = async (conversionData) => {
    return await icefunnel.conversions.track(conversionData);
  };

  return { submitForm, trackConversion, loading };
}
\`\`\`

### WordPress Plugin

\`\`\`php
<?php
// wp-content/plugins/icefunnel/icefunnel.php

class IceFunnelPlugin {
    private $apiKey;
    
    public function __construct() {
        $this->apiKey = get_option('icefunnel_api_key');
        add_action('wpcf7_mail_sent', [$this, 'handleFormSubmission']);
    }
    
    public function handleFormSubmission($contact_form) {
        $submission = WPCF7_Submission::get_instance();
        $posted_data = $submission->get_posted_data();
        
        $response = wp_remote_post('https://app.icefunnel.com/api/forms/submit', [
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $this->apiKey
            ],
            'body' => json_encode([
                'formId' => $contact_form->id(),
                'fields' => $posted_data,
                'source' => 'wordpress'
            ])
        ]);
    }
}

new IceFunnelPlugin();
?>
\`\`\`

---

## Casos de Uso Avançados

### 1. E-commerce Integration

\`\`\`javascript
// Integração completa com e-commerce
class EcommerceIntegration {
  constructor(apiKey) {
    this.icefunnel = new IceFunnel({ apiKey });
  }

  async trackCustomerJourney(customerId, events) {
    for (const event of events) {
      switch (event.type) {
        case 'product_view':
          await this.icefunnel.events.track({
            event: 'product.viewed',
            customerId,
            data: event.data
          });
          break;
          
        case 'add_to_cart':
          await this.icefunnel.conversions.track({
            funnelId: 'ecommerce',
            stepId: 'add_to_cart',
            value: event.data.value
          });
          break;
          
        case 'purchase':
          await this.icefunnel.payments.complete({
            amount: event.data.amount,
            customerId,
            productId: event.data.productId
          });
          break;
      }
    }
  }
}
\`\`\`

### 2. SaaS Onboarding

\`\`\`javascript
// Automação de onboarding para SaaS
class SaaSOnboarding {
  constructor(apiKey) {
    this.icefunnel = new IceFunnel({ apiKey });
  }

  async trackOnboardingStep(userId, step, completed = true) {
    await this.icefunnel.conversions.track({
      funnelId: 'onboarding',
      stepId: step,
      leadId: userId,
      value: completed ? 1 : 0,
      metadata: {
        completed,
        timestamp: new Date().toISOString()
      }
    });

    if (completed) {
      await this.icefunnel.leads.qualify({
        userId,
        score: this.calculateOnboardingScore(step),
        criteria: [`onboarding_${step}_completed`]
      });
    }
  }

  calculateOnboardingScore(step) {
    const stepScores = {
      'account_created': 20,
      'profile_completed': 40,
      'first_project': 70,
      'team_invited': 85,
      'integration_setup': 95
    };
    return stepScores[step] || 0;
  }
}
\`\`\`

### 3. Lead Scoring Avançado

\`\`\`javascript
// Sistema de lead scoring inteligente
class AdvancedLeadScoring {
  constructor(apiKey) {
    this.icefunnel = new IceFunnel({ apiKey });
  }

  async calculateLeadScore(leadData) {
    let score = 0;
    const factors = [];

    // Dados demográficos
    if (leadData.company) {
      score += 20;
      factors.push('has_company');
    }

    if (leadData.jobTitle?.includes('CEO') || leadData.jobTitle?.includes('Founder')) {
      score += 30;
      factors.push('decision_maker');
    }

    // Comportamento
    if (leadData.pageViews > 5) {
      score += 25;
      factors.push('high_engagement');
    }

    if (leadData.timeOnSite > 300) { // 5 minutos
      score += 15;
      factors.push('engaged_visitor');
    }

    // Qualificar lead
    await this.icefunnel.leads.qualify({
      email: leadData.email,
      name: leadData.name,
      score,
      criteria: factors,
      source: leadData.source,
      metadata: leadData
    });

    return { score, factors };
  }
}
\`\`\`

---

## Segurança

### Validação de Assinatura

\`\`\`javascript
const crypto = require('crypto');

function validateWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}

// Uso em endpoint
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const isValid = validateWebhookSignature(req.body, signature, process.env.WEBHOOK_SECRET);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Processar webhook...
  res.json({ received: true });
});
\`\`\`

### Criptografia de Dados Sensíveis

\`\`\`javascript
const crypto = require('crypto');

class DataEncryption {
  constructor(encryptionKey) {
    this.algorithm = 'aes-256-gcm';
    this.key = Buffer.from(encryptionKey, 'hex');
  }

  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encryptedData) {
    const decipher = crypto.createDecipher(
      this.algorithm, 
      this.key, 
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
\`\`\`

---

## Performance e Otimização

### Batch Processing

\`\`\`javascript
// Processar múltiplas operações em lote
const batchOperations = async (operations) => {
  const batches = [];
  const batchSize = 100;

  for (let i = 0; i < operations.length; i += batchSize) {
    batches.push(operations.slice(i, i + batchSize));
  }

  const results = [];
  for (const batch of batches) {
    const batchPromises = batch.map(op => 
      icefunnel[op.type][op.method](op.data)
    );
    
    const batchResults = await Promise.allSettled(batchPromises);
    results.push(...batchResults);
  }

  return results;
};
\`\`\`

### Caching Inteligente

\`\`\`javascript
class APICache {
  constructor(ttl = 300000) { // 5 minutos
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  async getOrFetch(key, fetchFn) {
    let value = this.get(key);
    if (value === null) {
      value = await fetchFn();
      this.set(key, value);
    }
    return value;
  }
}

const cache = new APICache();

// Uso com cache
const getMetrics = async (userId) => {
  return await cache.getOrFetch(`metrics_${userId}`, async () => {
    const response = await fetch(`/api/analytics/metrics?userId=${userId}`);
    return response.json();
  });
};
\`\`\`

---

## Testes e Debugging

### Ambiente de Teste

\`\`\`javascript
// Configuração para testes
const testConfig = {
  apiKey: 'sk_test_1234567890abcdef',
  baseUrl: 'https://api-test.icefunnel.com',
  debug: true
};

const icefunnel = new IceFunnel(testConfig);

// Dados de teste
const testData = {
  forms: {
    valid: {
      formId: 'test_form',
      fields: { email: 'test@example.com' },
      userId: 'test_user'
    },
    invalid: {
      formId: '',
      fields: { email: 'invalid-email' }
    }
  }
};
\`\`\`

### Testes Unitários

\`\`\`javascript
// Jest tests
describe('IceFunnel API', () => {
  test('should submit form successfully', async () => {
    const result = await icefunnel.forms.submit(testData.forms.valid);
    
    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
  });

  test('should handle validation errors', async () => {
    await expect(
      icefunnel.forms.submit(testData.forms.invalid)
    ).rejects.toThrow('validation_error');
  });

  test('should track conversion with metrics', async () => {
    const result = await icefunnel.conversions.track({
      funnelId: 'test_funnel',
      stepId: 'test_step',
      value: 100
    });

    expect(result.success).toBe(true);
    expect(result.metrics).toBeDefined();
  });
});
\`\`\`

---

## Migração e Backup

### Exportar Dados

\`\`\`http
GET /api/export/data?userId=user_123&format=json
\`\`\`

**Resposta:**
\`\`\`json
{
  "export": {
    "id": "export_123",
    "status": "completed",
    "downloadUrl": "https://exports.icefunnel.com/user_123_20240120.zip",
    "expiresAt": "2024-01-27T10:30:00Z",
    "size": "2.5MB",
    "records": {
      "forms": 1250,
      "conversions": 156,
      "leads": 890,
      "payments": 78
    }
  }
}
\`\`\`

### Importar Dados

\`\`\`http
POST /api/import/data
Content-Type: multipart/form-data

{
  "file": [arquivo_backup.zip],
  "userId": "user_123",
  "overwrite": false
}
\`\`\`

---

## Suporte e Recursos

### Documentação Adicional
- **Guia de Início Rápido**: https://docs.icefunnel.com/quickstart
- **Referência Completa**: https://docs.icefunnel.com/api
- **Exemplos de Código**: https://github.com/icefunnel/examples
- **Postman Collection**: https://docs.icefunnel.com/postman

### Suporte Técnico
- **Email**: dev@icefunnel.com
- **Discord**: https://discord.gg/icefunnel
- **Status da API**: https://status.icefunnel.com
- **Changelog**: https://docs.icefunnel.com/changelog

### Limites e Quotas

| Plano | Requisições/min | Webhooks | Armazenamento | Suporte |
|-------|----------------|----------|---------------|---------|
| Starter | 100 | 5 | 1GB | Email |
| Pro | 1000 | 25 | 10GB | Prioritário |
| Enterprise | 10000 | Ilimitado | 100GB | Dedicado |

---

*Esta documentação é atualizada automaticamente. Última atualização: Janeiro 2024*
