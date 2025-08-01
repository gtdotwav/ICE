import { WebhookService } from './webhook-service'

const webhookService = new WebhookService()

/**
 * Triggers automáticos para eventos do sistema
 */
export class WebhookTriggers {
  
  /**
   * Dispara quando formulário é submetido
   */
  static async onFormSubmitted(formData: any, userId: string): Promise<void> {
    await webhookService.triggerWebhook('form.submitted', {
      formId: formData.formId,
      fields: formData.fields,
      submittedAt: new Date().toISOString(),
      userAgent: formData.userAgent,
      ipAddress: formData.ipAddress,
      source: formData.source
    }, userId)
  }

  /**
   * Dispara quando há conversão no funil
   */
  static async onFunnelConversion(conversionData: any, userId: string): Promise<void> {
    await webhookService.triggerWebhook('funnel.conversion', {
      funnelId: conversionData.funnelId,
      stepId: conversionData.stepId,
      leadId: conversionData.leadId,
      value: conversionData.value,
      convertedAt: new Date().toISOString(),
      previousSteps: conversionData.previousSteps
    }, userId)
  }

  /**
   * Dispara quando usuário se registra
   */
  static async onUserRegistered(userData: any, userId: string): Promise<void> {
    await webhookService.triggerWebhook('user.registered', {
      userId: userData.id,
      email: userData.email,
      name: userData.name,
      registeredAt: new Date().toISOString(),
      source: userData.source,
      plan: userData.plan
    }, userId)
  }

  /**
   * Dispara quando pagamento é completado
   */
  static async onPaymentCompleted(paymentData: any, userId: string): Promise<void> {
    await webhookService.triggerWebhook('payment.completed', {
      paymentId: paymentData.id,
      amount: paymentData.amount,
      currency: paymentData.currency,
      customerId: paymentData.customerId,
      productId: paymentData.productId,
      completedAt: new Date().toISOString(),
      paymentMethod: paymentData.paymentMethod
    }, userId)
  }

  /**
   * Dispara quando lead é qualificado
   */
  static async onLeadQualified(leadData: any, userId: string): Promise<void> {
    await webhookService.triggerWebhook('lead.qualified', {
      leadId: leadData.id,
      score: leadData.score,
      qualificationCriteria: leadData.criteria,
      qualifiedAt: new Date().toISOString(),
      source: leadData.source,
      tags: leadData.tags
    }, userId)
  }

  /**
   * Dispara quando automação é acionada
   */
  static async onAutomationTriggered(automationData: any, userId: string): Promise<void> {
    await webhookService.triggerWebhook('automation.triggered', {
      automationId: automationData.id,
      triggerType: automationData.triggerType,
      targetId: automationData.targetId,
      triggeredAt: new Date().toISOString(),
      conditions: automationData.conditions
    }, userId)
  }

  /**
   * Dispara quando campanha é iniciada
   */
  static async onCampaignStarted(campaignData: any, userId: string): Promise<void> {
    await webhookService.triggerWebhook('campaign.started', {
      campaignId: campaignData.id,
      name: campaignData.name,
      type: campaignData.type,
      startedAt: new Date().toISOString(),
      targetAudience: campaignData.targetAudience,
      budget: campaignData.budget
    }, userId)
  }

  /**
   * Dispara quando email é aberto
   */
  static async onEmailOpened(emailData: any, userId: string): Promise<void> {
    await webhookService.triggerWebhook('email.opened', {
      emailId: emailData.id,
      campaignId: emailData.campaignId,
      recipientId: emailData.recipientId,
      openedAt: new Date().toISOString(),
      userAgent: emailData.userAgent,
      ipAddress: emailData.ipAddress
    }, userId)
  }

  /**
   * Dispara quando link no email é clicado
   */
  static async onEmailClicked(clickData: any, userId: string): Promise<void> {
    await webhookService.triggerWebhook('email.clicked', {
      emailId: clickData.emailId,
      campaignId: clickData.campaignId,
      recipientId: clickData.recipientId,
      linkUrl: clickData.linkUrl,
      clickedAt: new Date().toISOString(),
      userAgent: clickData.userAgent,
      ipAddress: clickData.ipAddress
    }, userId)
  }
}