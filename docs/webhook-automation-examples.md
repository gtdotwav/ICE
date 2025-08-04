# Exemplos de Webhooks para Automação IA - HIAS FLOW

## Endpoint Configurado

**URL do Webhook n8n:**
```
https://duduquadrado.app.n8n.cloud/webhook-test/b488f551-9141-422f-9a7e-10347ef87506
```

## Estrutura dos Payloads

### 1. COPYWRITER IA

**Evento:** Solicitação de geração de texto

```json
{
  "request_id": "req_1642680000123_abc123",
  "type": "copywriter",
  "prompt": "Crie um headline persuasivo para um curso de marketing digital para iniciantes",
  "context": {
    "copy_type": "headline",
    "target_audience": "empreendedores iniciantes",
    "tone": "persuasive",
    "product_name": "Curso de Marketing Digital",
    "length": "medium"
  },
  "user_id": "user_123",
  "timestamp": "2024-01-20T10:30:00Z",
  "callback_url": "https://app.hiasflow.com/api/webhooks/ai-automation/callback"
}
```

**Opções de Context:**
- `copy_type`: "headline", "landing_page", "ad_copy", "email_subject", "product_description"
- `target_audience`: string (descrição do público-alvo)
- `tone`: "professional", "casual", "urgent", "persuasive", "friendly"
- `product_name`: string (nome do produto/serviço)
- `length`: "short", "medium", "long"

### 2. GERADOR DE IMAGENS

**Evento:** Solicitação de geração de imagem

```json
{
  "request_id": "req_1642680000124_def456",
  "type": "images",
  "prompt": "Banner promocional para Black Friday com cores vibrantes e call-to-action",
  "context": {
    "style": "professional",
    "dimensions": "1200x630",
    "format": "png",
    "quantity": 1,
    "color_scheme": "vibrant",
    "include_text": true
  },
  "user_id": "user_123",
  "timestamp": "2024-01-20T10:35:00Z",
  "callback_url": "https://app.hiasflow.com/api/webhooks/ai-automation/callback"
}
```

**Opções de Context:**
- `style`: "professional", "creative", "minimalist", "modern", "vintage"
- `dimensions`: "1024x1024", "1200x630", "800x600", "1920x1080"
- `format`: "png", "jpg", "webp"
- `quantity`: number (1-5)
- `color_scheme`: "vibrant", "pastel", "monochrome", "brand_colors"
- `include_text`: boolean

### 3. CRIADOR DE VÍDEOS

**Evento:** Solicitação de geração de vídeo

```json
{
  "request_id": "req_1642680000125_ghi789",
  "type": "videos",
  "prompt": "Vídeo promocional de 30 segundos para lançamento de produto",
  "context": {
    "duration": 30,
    "style": "promotional",
    "voice_type": "professional",
    "include_music": true,
    "aspect_ratio": "16:9",
    "quality": "hd"
  },
  "user_id": "user_123",
  "timestamp": "2024-01-20T10:40:00Z",
  "callback_url": "https://app.hiasflow.com/api/webhooks/ai-automation/callback"
}
```

**Opções de Context:**
- `duration`: number (15-300 segundos)
- `style`: "promotional", "educational", "testimonial", "explainer"
- `voice_type`: "professional", "casual", "energetic", "calm"
- `include_music`: boolean
- `aspect_ratio`: "16:9", "9:16", "1:1", "4:3"
- `quality`: "hd", "4k", "standard"

### 4. OTIMIZADOR DE EMAIL

**Evento:** Solicitação de otimização de email

```json
{
  "request_id": "req_1642680000126_jkl012",
  "type": "email",
  "prompt": "Subject line para newsletter semanal sobre dicas de vendas",
  "context": {
    "email_type": "newsletter",
    "target_audience": "vendedores B2B",
    "tone": "professional",
    "call_to_action": "Leia o artigo completo",
    "personalization": true,
    "urgency_level": "medium"
  },
  "user_id": "user_123",
  "timestamp": "2024-01-20T10:45:00Z",
  "callback_url": "https://app.hiasflow.com/api/webhooks/ai-automation/callback"
}
```

**Opções de Context:**
- `email_type`: "marketing", "transactional", "newsletter", "welcome", "abandoned_cart"
- `target_audience`: string (descrição do público-alvo)
- `tone`: "professional", "casual", "urgent", "friendly"
- `call_to_action`: string (ação desejada)
- `personalization`: boolean
- `urgency_level`: "low", "medium", "high"

## Headers de Segurança

Todos os webhooks incluem os seguintes headers:

```http
Content-Type: application/json
X-Webhook-Source: hiasflow
X-Request-ID: req_1642680000123_abc123
X-Automation-Type: copywriter
```

## Resposta Esperada do n8n

O sistema n8n deve processar a solicitação e retornar uma resposta para o callback URL:

```json
{
  "success": true,
  "request_id": "req_1642680000123_abc123",
  "automation_type": "copywriter",
  "result": {
    "content": "Conteúdo gerado pela IA",
    "metadata": {
      "confidence_score": 0.95,
      "processing_time": 45,
      "model_used": "gpt-4"
    }
  },
  "files": [], // URLs de arquivos gerados (para imagens/vídeos)
  "timestamp": "2024-01-20T10:31:00Z"
}
```

## Configuração no n8n

### 1. Webhook Trigger
- **URL**: `https://duduquadrado.app.n8n.cloud/webhook-test/b488f551-9141-422f-9a7e-10347ef87506`
- **Method**: POST
- **Authentication**: None (usar headers para validação)

### 2. Processamento por Tipo

#### Para Copywriter:
```javascript
// Node de processamento no n8n
const { type, prompt, context } = $json;

if (type === 'copywriter') {
  // Processar com IA de texto
  const result = await processTextGeneration(prompt, context);
  return {
    success: true,
    request_id: $json.request_id,
    automation_type: 'copywriter',
    result: {
      content: result.text,
      metadata: {
        confidence_score: result.confidence,
        processing_time: result.duration
      }
    }
  };
}
```

#### Para Imagens:
```javascript
if (type === 'images') {
  // Processar com IA de imagem
  const result = await processImageGeneration(prompt, context);
  return {
    success: true,
    request_id: $json.request_id,
    automation_type: 'images',
    result: {
      content: result.description,
      metadata: {
        dimensions: context.dimensions,
        format: context.format
      }
    },
    files: result.image_urls
  };
}
```

### 3. Callback Response
O n8n deve enviar a resposta para:
```
POST https://app.hiasflow.com/api/webhooks/ai-automation/callback
```

## Exemplos de Uso

### Exemplo 1: Headline para Landing Page
```json
{
  "type": "copywriter",
  "prompt": "Crie um headline para uma landing page de um curso de programação Python",
  "context": {
    "copy_type": "headline",
    "target_audience": "iniciantes em programação",
    "tone": "motivational",
    "product_name": "Python do Zero ao Pro",
    "length": "medium"
  }
}
```

### Exemplo 2: Banner para Redes Sociais
```json
{
  "type": "images",
  "prompt": "Banner para Instagram promovendo curso online de marketing",
  "context": {
    "style": "modern",
    "dimensions": "1080x1080",
    "format": "png",
    "quantity": 3,
    "color_scheme": "brand_colors",
    "include_text": true
  }
}
```

### Exemplo 3: Vídeo Explicativo
```json
{
  "type": "videos",
  "prompt": "Vídeo explicativo sobre os benefícios do produto",
  "context": {
    "duration": 60,
    "style": "explainer",
    "voice_type": "professional",
    "include_music": true,
    "aspect_ratio": "16:9",
    "quality": "hd"
  }
}
```

### Exemplo 4: Subject Line de Email
```json
{
  "type": "email",
  "prompt": "Subject line para email de carrinho abandonado",
  "context": {
    "email_type": "abandoned_cart",
    "target_audience": "clientes que abandonaram carrinho",
    "tone": "urgent",
    "call_to_action": "Finalizar compra",
    "personalization": true,
    "urgency_level": "high"
  }
}
```

## Monitoramento

Para monitorar as automações, você pode:

1. **Verificar logs** em `/api/webhooks/logs`
2. **Acompanhar status** em `/api/webhooks/ai-automation/status/[requestId]`
3. **Ver histórico** no dashboard IA

## Tratamento de Erros

Se o n8n não conseguir processar a solicitação, deve retornar:

```json
{
  "success": false,
  "request_id": "req_1642680000123_abc123",
  "automation_type": "copywriter",
  "error": {
    "code": "PROCESSING_FAILED",
    "message": "Não foi possível gerar o conteúdo",
    "details": "Prompt muito vago ou contexto insuficiente"
  },
  "timestamp": "2024-01-20T10:31:00Z"
}
```