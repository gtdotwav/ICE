import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

export class WebhookSecurity {
  /**
   * Gera assinatura HMAC para o payload
   */
  signPayload(payload: any, secret: string): string {
    const payloadString = JSON.stringify(payload)
    const signature = createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex')
    
    return `sha256=${signature}`
  }

  /**
   * Verifica assinatura de webhook recebido
   */
  verifySignature(payload: any, signature: string, secret: string): boolean {
    const expectedSignature = this.signPayload(payload, secret)
    
    // Comparação segura para evitar timing attacks
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }

  /**
   * Gera secret seguro para webhook
   */
  generateSecret(): string {
    return randomBytes(32).toString('hex')
  }

  /**
   * Valida URL de webhook
   */
  validateWebhookUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url)
      
      // Só permite HTTPS em produção
      if (process.env.NODE_ENV === 'production' && parsedUrl.protocol !== 'https:') {
        return false
      }
      
      // Bloqueia IPs privados em produção
      if (process.env.NODE_ENV === 'production') {
        const hostname = parsedUrl.hostname
        if (this.isPrivateIP(hostname)) {
          return false
        }
      }
      
      return true
    } catch {
      return false
    }
  }

  /**
   * Verifica se é IP privado
   */
  private isPrivateIP(hostname: string): boolean {
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^localhost$/i
    ]
    
    return privateRanges.some(range => range.test(hostname))
  }

  /**
   * Rate limiting para webhooks recebidos
   */
  async checkRateLimit(source: string): Promise<boolean> {
    // Implementar rate limiting com Redis
    // Por exemplo: máximo 100 requests por minuto por source
    return true
  }
}
