/**
 * Integração automática de webhooks com eventos do sistema
 * Este arquivo conecta automaticamente os eventos do SaaS com os webhooks
 */

import { API } from '@/lib/api-client'

// Intercepta submissões de formulários automaticamente
export function setupFormWebhooks() {
  if (typeof window === 'undefined') return

  // Intercepta todos os formulários da página
  document.addEventListener('submit', async (event) => {
    const form = event.target as HTMLFormElement
    
    // Verifica se é um formulário que deve disparar webhook
    if (form.dataset.webhookEnabled !== 'false') {
      const formData = new FormData(form)
      const fields = Object.fromEntries(formData.entries())
      
      try {
        await API.submitForm({
          formId: form.id || form.className || 'unknown',
          fields,
          userId: getCurrentUserId(),
          source: window.location.pathname
        })
      } catch (error) {
        console.error('Erro ao enviar webhook de formulário:', error)
      }
    }
  })
}

// Rastreia cliques em botões de conversão
export function setupConversionTracking() {
  if (typeof window === 'undefined') return

  document.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement
    
    // Verifica se é um botão de conversão
    if (target.dataset.trackConversion === 'true') {
      try {
        await API.trackConversion({
          funnelId: target.dataset.funnelId || 'main',
          stepId: target.dataset.stepId || 'button_click',
          value: parseFloat(target.dataset.value || '0'),
          userId: getCurrentUserId()
        })
      } catch (error) {
        console.error('Erro ao rastrear conversão:', error)
      }
    }
  })
}

// Rastreia visualizações de página
export function setupPageTracking() {
  if (typeof window === 'undefined') return

  // Rastreia mudanças de rota
  let currentPath = window.location.pathname
  
  const trackPageView = async (path: string) => {
    try {
      await API.triggerWebhook('page.viewed', {
        path,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      }, getCurrentUserId())
    } catch (error) {
      console.error('Erro ao rastrear visualização:', error)
    }
  }

  // Rastreia primeira visualização
  trackPageView(currentPath)

  // Rastreia mudanças de rota (SPA)
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname
      trackPageView(currentPath)
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

// Função auxiliar para obter ID do usuário atual
function getCurrentUserId(): string {
  // Em produção, obter do contexto de autenticação
  // Por enquanto, usar um ID fixo para desenvolvimento
  return 'user_demo_123'
}

// Inicializa todas as integrações automáticas
export function initializeWebhookIntegrations() {
  setupFormWebhooks()
  setupConversionTracking()
  setupPageTracking()
  
  console.log('🔗 Webhook integrations initialized')
}

// Auto-inicialização quando o módulo é carregado
if (typeof window !== 'undefined') {
  // Aguarda o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebhookIntegrations)
  } else {
    initializeWebhookIntegrations()
  }
}