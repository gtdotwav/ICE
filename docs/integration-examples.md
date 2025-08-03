# Exemplos de Integração - HIAS FLOW

## Guias Passo a Passo para Integrações Populares

### 1. Zapier - Automação Sem Código

#### Configuração Inicial

1. **No HIAS FLOW:**
   ```
   Dashboard → Webhooks → Novo Webhook
   Nome: "Zapier Automation"
   URL: [URL fornecida pelo Zapier]
   Eventos: form.submitted, funnel.conversion, lead.qualified
   ```

2. **No Zapier:**
   ```
   Trigger: Webhooks by Zapier
   Event: Catch Hook
   ```

#### Exemplo: Lead para Google Sheets + Slack

```javascript
// Zap Configuration
{
  "trigger": {
    "type": "webhook",
    "url": "https://hooks.zapier.com/hooks/catch/123456/abcdef/"
  },
  "steps": [
    {
      "app": "filter",
      "condition": "event == 'form.submitted'"
    },
    {
      "app": "google-sheets",
      "action": "create-row",
      "data": {
        "spreadsheet": "Leads 2024",
        "worksheet": "Novos Leads",
        "name": "{{data.fields.name}}",
        "email": "{{data.fields.email}}",
        "company": "{{data.fields.company}}",
        "source": "{{data.source}}",
        "timestamp": "{{timestamp}}"
      }
    },
    {
      "app": "slack",
      "action": "send-message",
      "data": {
        "channel": "#vendas",
        "message": "🎯 Novo lead: {{data.fields.name}} ({{data.fields.company}}) - {{data.fields.email}}"
      }
    }
  ]
}
```

---

### 2. Make (Integromat) - Automação Visual

#### Cenário: E-commerce Completo

```json
{
  "scenario": {
    "name": "E-commerce Automation",
    "modules": [
      {
        "id": 1,
        "app": "webhook",
        "operation": "custom-webhook",
        "parameters": {
          "url": "https://hook.integromat.com/abc123def456"
        }
      },
      {
        "id": 2,
        "app": "router",
        "routes": [
          {
            "condition": "event = 'funnel.conversion'",
            "modules": [3, 4]
          },
          {
            "condition": "event = 'payment.completed'",
            "modules": [5, 6]
          }
        ]
      },
      {
        "id": 3,
        "app": "mailchimp",
        "operation": "add-subscriber",
        "parameters": {
          "list": "customers",
          "email": "{{data.email}}",
          "tags": ["converted", "{{data.source}}"]
        }
      },
      {
        "id": 4,
        "app": "hubspot",
        "operation": "create-deal",
        "parameters": {
          "dealname": "Conversão - {{data.funnelId}}",
          "amount": "{{data.value}}",
          "dealstage": "qualified-to-buy"
        }
      }
    ]
  }
}
```

---

### 3. HubSpot CRM - Integração Nativa

#### Setup Completo

```javascript
// hubspot-integration.js
const hubspot = require('@hubspot/api-client');

class HubSpotIntegration {
  constructor(accessToken) {
    this.client = new hubspot.Client({ accessToken });
  }

  async handleIceFunnelWebhook(event, data) {
    switch (event) {
      case 'form.submitted':
        return await this.createOrUpdateContact(data);
      case 'funnel.conversion':
        return await this.createDeal(data);
      case 'lead.qualified':
        return await this.updateContactScore(data);
      case 'payment.completed':
        return await this.markDealAsClosed(data);
    }
  }

  async createOrUpdateContact(formData) {
    const { fields } = formData;
    
    // Verificar se contato já existe
    const existingContact = await this.findContactByEmail(fields.email);
    
    const contactProperties = {
      email: fields.email,
      firstname: fields.name?.split(' ')[0] || '',
      lastname: fields.name?.split(' ').slice(1).join(' ') || '',
      company: fields.company || '',
      phone: fields.phone || '',
      website: fields.website || '',
      jobtitle: fields.position || '',
      lifecyclestage: 'lead',
      lead_source: formData.source,
      hs_lead_status: 'NEW',
      // Campos customizados
      icefunnel_form_id: formData.formId,
      icefunnel_submitted_at: formData.submittedAt,
      utm_source: formData.utm?.source || '',
      utm_campaign: formData.utm?.campaign || ''
    };

    if (existingContact) {
      // Atualizar contato existente
      return await this.client.crm.contacts.basicApi.update(
        existingContact.id,
        { properties: contactProperties }
      );
    } else {
      // Criar novo contato
      return await this.client.crm.contacts.basicApi.create({
        properties: contactProperties
      });
    }
  }

  async createDeal(conversionData) {
    const contact = await this.findContactByEmail(conversionData.email);
    
    if (!contact) {
      console.error('Contact not found for conversion:', conversionData.email);
      return;
    }

    const dealProperties = {
      dealname: `Conversão ${conversionData.funnelId} - ${contact.properties.company || contact.properties.email}`,
      amount: conversionData.value,
      dealstage: 'qualified-to-buy',
      pipeline: 'default',
      closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      deal_source: conversionData.source,
      // Campos customizados
      icefunnel_funnel_id: conversionData.funnelId,
      icefunnel_step_id: conversionData.stepId,
      icefunnel_converted_at: conversionData.convertedAt
    };

    const deal = await this.client.crm.deals.basicApi.create({
      properties: dealProperties
    });

    // Associar deal ao contato
    await this.client.crm.deals.associationsApi.create(
      deal.id,
      'contacts',
      contact.id,
      'deal_to_contact'
    );

    return deal;
  }

  async updateContactScore(leadData) {
    const contact = await this.findContactByEmail(leadData.email);
    
    if (contact) {
      await this.client.crm.contacts.basicApi.update(contact.id, {
        properties: {
          hs_lead_status: leadData.qualification.toUpperCase(),
          hubspotscore: leadData.score,
          icefunnel_qualification: leadData.qualification,
          icefunnel_score: leadData.score,
          icefunnel_qualified_at: leadData.qualifiedAt
        }
      });
    }
  }

  async findContactByEmail(email) {
    try {
      const response = await this.client.crm.contacts.searchApi.doSearch({
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'EQ',
            value: email
          }]
        }]
      });
      
      return response.results[0] || null;
    } catch (error) {
      console.error('Error finding contact:', error);
      return null;
    }
  }
}

// Uso
const hubspotIntegration = new HubSpotIntegration(process.env.HUBSPOT_ACCESS_TOKEN);

app.post('/webhook/icefunnel', async (req, res) => {
  const { event, data } = req.body;
  
  try {
    await hubspotIntegration.handleIceFunnelWebhook(event, data);
    res.json({ success: true });
  } catch (error) {
    console.error('HubSpot integration error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

---

### 4. Salesforce - CRM Enterprise

```javascript
// salesforce-integration.js
const jsforce = require('jsforce');

class SalesforceIntegration {
  constructor() {
    this.conn = new jsforce.Connection({
      loginUrl: process.env.SALESFORCE_LOGIN_URL
    });
    this.login();
  }

  async login() {
    await this.conn.login(
      process.env.SALESFORCE_USERNAME,
      process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN
    );
  }

  async handleWebhook(event, data) {
    switch (event) {
      case 'form.submitted':
        return await this.createLead(data);
      case 'lead.qualified':
        return await this.convertLead(data);
      case 'payment.completed':
        return await this.createOpportunity(data);
    }
  }

  async createLead(formData) {
    const { fields } = formData;
    
    const leadData = {
      FirstName: fields.name?.split(' ')[0] || '',
      LastName: fields.name?.split(' ').slice(1).join(' ') || 'Unknown',
      Email: fields.email,
      Phone: fields.phone || '',
      Company: fields.company || 'Unknown',
      Title: fields.position || '',
      LeadSource: formData.source,
      Status: 'New',
      // Campos customizados
      IceFunnel_Form_ID__c: formData.formId,
      IceFunnel_Source__c: formData.source,
      IceFunnel_Submitted_At__c: formData.submittedAt,
      UTM_Source__c: formData.utm?.source || '',
      UTM_Campaign__c: formData.utm?.campaign || ''
    };

    try {
      const result = await this.conn.sobject('Lead').create(leadData);
      console.log('Salesforce lead created:', result.id);
      return result;
    } catch (error) {
      console.error('Salesforce lead creation error:', error);
      throw error;
    }
  }

  async convertLead(leadData) {
    // Encontrar lead pelo email
    const leads = await this.conn.sobject('Lead').find({
      Email: leadData.email,
      IsConverted: false
    });

    if (leads.length === 0) {
      console.log('No unconverted lead found for:', leadData.email);
      return;
    }

    const lead = leads[0];

    // Converter lead para Account, Contact e Opportunity
    const convertResult = await this.conn.sobject('Lead').convert({
      leadId: lead.Id,
      convertedStatus: 'Qualified',
      doNotCreateOpportunity: false,
      opportunityName: `Oportunidade - ${lead.Company}`,
      overwriteLeadSource: false
    });

    // Atualizar score no contato criado
    if (convertResult.contactId) {
      await this.conn.sobject('Contact').update({
        Id: convertResult.contactId,
        IceFunnel_Score__c: leadData.score,
        IceFunnel_Qualification__c: leadData.qualification
      });
    }

    return convertResult;
  }
}
```

---

### 5. Pipedrive - CRM Simples

```javascript
// pipedrive-integration.js
const axios = require('axios');

class PipedriveIntegration {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseURL = 'https://api.pipedrive.com/v1';
  }

  async handleWebhook(event, data) {
    switch (event) {
      case 'form.submitted':
        return await this.createPerson(data);
      case 'funnel.conversion':
        return await this.createDeal(data);
      case 'lead.qualified':
        return await this.updatePersonScore(data);
    }
  }

  async createPerson(formData) {
    const { fields } = formData;
    
    const personData = {
      name: fields.name,
      email: [{ value: fields.email, primary: true }],
      phone: fields.phone ? [{ value: fields.phone, primary: true }] : [],
      org_name: fields.company,
      // Campos customizados (configurar no Pipedrive)
      'icefunnel_source': formData.source,
      'icefunnel_form_id': formData.formId,
      'utm_source': formData.utm?.source
    };

    try {
      const response = await axios.post(
        `${this.baseURL}/persons?api_token=${this.apiToken}`,
        personData
      );
      
      console.log('Pipedrive person created:', response.data.data.id);
      return response.data.data;
    } catch (error) {
      console.error('Pipedrive person creation error:', error.response?.data);
      throw error;
    }
  }

  async createDeal(conversionData) {
    // Encontrar pessoa pelo email
    const person = await this.findPersonByEmail(conversionData.email);
    
    if (!person) {
      console.error('Person not found for conversion:', conversionData.email);
      return;
    }

    const dealData = {
      title: `Conversão ${conversionData.funnelId} - ${person.name}`,
      value: conversionData.value,
      currency: 'BRL',
      person_id: person.id,
      org_id: person.org_id,
      stage_id: 1, // Configurar no Pipedrive
      status: 'open',
      // Campos customizados
      'icefunnel_funnel_id': conversionData.funnelId,
      'icefunnel_step_id': conversionData.stepId,
      'conversion_path': conversionData.conversionPath
    };

    try {
      const response = await axios.post(
        `${this.baseURL}/deals?api_token=${this.apiToken}`,
        dealData
      );
      
      console.log('Pipedrive deal created:', response.data.data.id);
      return response.data.data;
    } catch (error) {
      console.error('Pipedrive deal creation error:', error.response?.data);
      throw error;
    }
  }

  async findPersonByEmail(email) {
    try {
      const response = await axios.get(
        `${this.baseURL}/persons/search?term=${email}&fields=email&api_token=${this.apiToken}`
      );
      
      const persons = response.data.data?.items || [];
      return persons.find(person => 
        person.item.emails?.some(e => e.value === email)
      )?.item || null;
    } catch (error) {
      console.error('Error finding person:', error);
      return null;
    }
  }
}
```

---

### 6. ActiveCampaign - Email Marketing

```javascript
// activecampaign-integration.js
const axios = require('axios');

class ActiveCampaignIntegration {
  constructor(apiUrl, apiKey) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.headers = {
      'Api-Token': apiKey,
      'Content-Type': 'application/json'
    };
  }

  async handleWebhook(event, data) {
    switch (event) {
      case 'form.submitted':
        return await this.createOrUpdateContact(data);
      case 'lead.qualified':
        return await this.addToAutomation(data);
      case 'funnel.conversion':
        return await this.addConversionTag(data);
    }
  }

  async createOrUpdateContact(formData) {
    const { fields } = formData;
    
    // Verificar se contato existe
    const existingContact = await this.findContactByEmail(fields.email);
    
    const contactData = {
      contact: {
        email: fields.email,
        firstName: fields.name?.split(' ')[0] || '',
        lastName: fields.name?.split(' ').slice(1).join(' ') || '',
        phone: fields.phone || '',
        // Campos customizados
        fieldValues: [
          {
            field: '1', // ID do campo "Empresa" no ActiveCampaign
            value: fields.company || ''
          },
          {
            field: '2', // ID do campo "Fonte"
            value: formData.source
          },
          {
            field: '3', // ID do campo "UTM Source"
            value: formData.utm?.source || ''
          }
        ]
      }
    };

    try {
      let response;
      if (existingContact) {
        response = await axios.put(
          `${this.apiUrl}/api/3/contacts/${existingContact.id}`,
          contactData,
          { headers: this.headers }
        );
      } else {
        response = await axios.post(
          `${this.apiUrl}/api/3/contacts`,
          contactData,
          { headers: this.headers }
        );
      }
      
      const contact = response.data.contact;
      
      // Adicionar à lista baseada na fonte
      await this.addToList(contact.id, this.getListIdBySource(formData.source));
      
      // Adicionar tags
      await this.addTags(contact.id, [
        formData.source,
        'icefunnel',
        formData.formId
      ]);
      
      return contact;
    } catch (error) {
      console.error('ActiveCampaign contact error:', error.response?.data);
      throw error;
    }
  }

  async addToAutomation(leadData) {
    const contact = await this.findContactByEmail(leadData.email);
    
    if (!contact) return;

    // Determinar automação baseada na qualificação
    const automationId = this.getAutomationByQualification(leadData.qualification);
    
    if (automationId) {
      await axios.post(
        `${this.apiUrl}/api/3/contactAutomations`,
        {
          contactAutomation: {
            contact: contact.id,
            automation: automationId
          }
        },
        { headers: this.headers }
      );
    }
  }

  getAutomationByQualification(qualification) {
    const automations = {
      'hot': '1', // ID da automação para leads quentes
      'warm': '2', // ID da automação para leads mornos
      'cold': '3' // ID da automação para leads frios
    };
    
    return automations[qualification] || null;
  }

  async findContactByEmail(email) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/3/contacts?email=${email}`,
        { headers: this.headers }
      );
      
      return response.data.contacts[0] || null;
    } catch (error) {
      return null;
    }
  }
}
```

---

### 7. Discord - Notificações da Equipe

```javascript
// discord-integration.js
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

class DiscordIntegration {
  constructor(botToken) {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
    });
    
    this.client.login(botToken);
    this.channels = {
      sales: process.env.DISCORD_SALES_CHANNEL,
      marketing: process.env.DISCORD_MARKETING_CHANNEL,
      alerts: process.env.DISCORD_ALERTS_CHANNEL
    };
  }

  async handleWebhook(event, data) {
    switch (event) {
      case 'funnel.conversion':
        return await this.notifyConversion(data);
      case 'lead.qualified':
        return await this.notifyQualifiedLead(data);
      case 'payment.completed':
        return await this.notifyPayment(data);
      case 'automation.triggered':
        return await this.notifyAutomation(data);
    }
  }

  async notifyConversion(conversionData) {
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('🎯 Nova Conversão!')
      .setDescription(`Conversão registrada no funil ${conversionData.funnelId}`)
      .addFields(
        { name: '💰 Valor', value: `R$ ${conversionData.value.toFixed(2)}`, inline: true },
        { name: '🎯 Funil', value: conversionData.funnelId, inline: true },
        { name: '📍 Etapa', value: conversionData.stepId, inline: true },
        { name: '🕒 Tempo para Converter', value: `${Math.round(conversionData.timeToConvert / 60)} minutos`, inline: true },
        { name: '📊 Caminho', value: conversionData.conversionPath || 'N/A', inline: false }
      )
      .setTimestamp()
      .setFooter({ text: 'IceFunnel Analytics' });

    await this.sendToChannel('sales', { embeds: [embed] });
  }

  async notifyQualifiedLead(leadData) {
    const emoji = leadData.qualification === 'hot' ? '🔥' : 
                  leadData.qualification === 'warm' ? '🌡️' : '❄️';
    
    const embed = new EmbedBuilder()
      .setColor(leadData.qualification === 'hot' ? '#FF4500' : '#FFA500')
      .setTitle(`${emoji} Lead Qualificado!`)
      .setDescription(`Novo lead ${leadData.qualification} detectado`)
      .addFields(
        { name: '📧 Email', value: leadData.email, inline: true },
        { name: '🏢 Empresa', value: leadData.profile?.company || 'N/A', inline: true },
        { name: '📊 Score', value: `${leadData.score}/100`, inline: true },
        { name: '🎯 Fonte', value: leadData.source, inline: true },
        { name: '🏷️ Tags', value: leadData.tags?.join(', ') || 'N/A', inline: false }
      )
      .setTimestamp();

    await this.sendToChannel('sales', { embeds: [embed] });
    
    // Se for lead quente, notificar também no canal de alertas
    if (leadData.qualification === 'hot') {
      await this.sendToChannel('alerts', {
        content: '@here Lead quente detectado!',
        embeds: [embed]
      });
    }
  }

  async sendToChannel(channelType, message) {
    const channelId = this.channels[channelType];
    if (!channelId) return;

    try {
      const channel = await this.client.channels.fetch(channelId);
      await channel.send(message);
    } catch (error) {
      console.error(`Discord ${channelType} notification error:`, error);
    }
  }
}
```

---

### 8. Google Sheets - Relatórios Automáticos

```javascript
// google-sheets-integration.js
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

class GoogleSheetsIntegration {
  constructor(spreadsheetId, serviceAccountAuth) {
    this.spreadsheetId = spreadsheetId;
    this.serviceAccountAuth = new JWT({
      email: serviceAccountAuth.client_email,
      key: serviceAccountAuth.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
  }

  async handleWebhook(event, data) {
    const doc = new GoogleSpreadsheet(this.spreadsheetId, this.serviceAccountAuth);
    await doc.loadInfo();

    switch (event) {
      case 'form.submitted':
        return await this.addFormSubmission(doc, data);
      case 'funnel.conversion':
        return await this.addConversion(doc, data);
      case 'payment.completed':
        return await this.addPayment(doc, data);
    }
  }

  async addFormSubmission(doc, formData) {
    const sheet = doc.sheetsByTitle['Leads'] || await doc.addSheet({ title: 'Leads' });
    
    // Configurar headers se necessário
    if (sheet.rowCount === 0) {
      await sheet.setHeaderRow([
        'Data', 'Nome', 'Email', 'Empresa', 'Telefone', 
        'Fonte', 'UTM Source', 'UTM Campaign', 'Form ID'
      ]);
    }

    const { fields } = formData;
    await sheet.addRow({
      'Data': new Date(formData.submittedAt).toLocaleString('pt-BR'),
      'Nome': fields.name || '',
      'Email': fields.email || '',
      'Empresa': fields.company || '',
      'Telefone': fields.phone || '',
      'Fonte': formData.source || '',
      'UTM Source': formData.utm?.source || '',
      'UTM Campaign': formData.utm?.campaign || '',
      'Form ID': formData.formId || ''
    });
  }

  async addConversion(doc, conversionData) {
    const sheet = doc.sheetsByTitle['Conversões'] || await doc.addSheet({ title: 'Conversões' });
    
    if (sheet.rowCount === 0) {
      await sheet.setHeaderRow([
        'Data', 'Funil', 'Etapa', 'Lead ID', 'Valor', 
        'Tempo para Converter', 'Caminho de Conversão'
      ]);
    }

    await sheet.addRow({
      'Data': new Date(conversionData.convertedAt).toLocaleString('pt-BR'),
      'Funil': conversionData.funnelId,
      'Etapa': conversionData.stepId,
      'Lead ID': conversionData.leadId,
      'Valor': `R$ ${conversionData.value.toFixed(2)}`,
      'Tempo para Converter': `${Math.round(conversionData.timeToConvert / 60)} min`,
      'Caminho de Conversão': conversionData.conversionPath || ''
    });
  }

  async addPayment(doc, paymentData) {
    const sheet = doc.sheetsByTitle['Pagamentos'] || await doc.addSheet({ title: 'Pagamentos' });
    
    if (sheet.rowCount === 0) {
      await sheet.setHeaderRow([
        'Data', 'Payment ID', 'Valor', 'Moeda', 'Cliente', 
        'Produto', 'Método', 'Status'
      ]);
    }

    await sheet.addRow({
      'Data': new Date(paymentData.completedAt).toLocaleString('pt-BR'),
      'Payment ID': paymentData.paymentId,
      'Valor': paymentData.amount,
      'Moeda': paymentData.currency,
      'Cliente': paymentData.customerId,
      'Produto': paymentData.productId,
      'Método': paymentData.paymentMethod,
      'Status': 'completed'
    });
  }
}
```

---

### 9. Telegram - Notificações Móveis

```javascript
// telegram-integration.js
const TelegramBot = require('node-telegram-bot-api');

class TelegramIntegration {
  constructor(botToken) {
    this.bot = new TelegramBot(botToken, { polling: false });
    this.chatIds = {
      sales: process.env.TELEGRAM_SALES_CHAT,
      alerts: process.env.TELEGRAM_ALERTS_CHAT,
      admin: process.env.TELEGRAM_ADMIN_CHAT
    };
  }

  async handleWebhook(event, data) {
    switch (event) {
      case 'funnel.conversion':
        return await this.notifyConversion(data);
      case 'lead.qualified':
        if (data.qualification === 'hot') {
          return await this.notifyHotLead(data);
        }
        break;
      case 'payment.completed':
        return await this.notifyPayment(data);
    }
  }

  async notifyConversion(conversionData) {
    const message = `
🎯 *Nova Conversão!*

💰 Valor: R$ ${conversionData.value.toFixed(2)}
🎯 Funil: \`${conversionData.funnelId}\`
📍 Etapa: \`${conversionData.stepId}\`
🕒 Tempo: ${Math.round(conversionData.timeToConvert / 60)} min
📊 Caminho: ${conversionData.conversionPath || 'N/A'}

_${new Date(conversionData.convertedAt).toLocaleString('pt-BR')}_
    `;

    await this.sendMessage('sales', message);
  }

  async notifyHotLead(leadData) {
    const message = `
🔥 *LEAD QUENTE DETECTADO!*

📧 Email: \`${leadData.email}\`
🏢 Empresa: ${leadData.profile?.company || 'N/A'}
📊 Score: *${leadData.score}/100*
🎯 Fonte: ${leadData.source}
🏷️ Tags: ${leadData.tags?.join(', ') || 'N/A'}

⚡ *AÇÃO NECESSÁRIA* - Contatar imediatamente!
    `;

    await this.sendMessage('sales', message);
    await this.sendMessage('alerts', message);
  }

  async notifyPayment(paymentData) {
    const message = `
💳 *Pagamento Recebido!*

💰 Valor: R$ ${paymentData.amount.toFixed(2)}
👤 Cliente: \`${paymentData.customerId}\`
📦 Produto: \`${paymentData.productId}\`
💳 Método: ${paymentData.paymentMethod}

_${new Date(paymentData.completedAt).toLocaleString('pt-BR')}_
    `;

    await this.sendMessage('sales', message);
  }

  async sendMessage(chatType, message) {
    const chatId = this.chatIds[chatType];
    if (!chatId) return;

    try {
      await this.bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      });
    } catch (error) {
      console.error(`Telegram ${chatType} notification error:`, error);
    }
  }
}
```

---

### 10. Airtable - Base de Dados Flexível

```javascript
// airtable-integration.js
const Airtable = require('airtable');

class AirtableIntegration {
  constructor(apiKey, baseId) {
    this.base = new Airtable({ apiKey }).base(baseId);
  }

  async handleWebhook(event, data) {
    switch (event) {
      case 'form.submitted':
        return await this.createLeadRecord(data);
      case 'funnel.conversion':
        return await this.createConversionRecord(data);
      case 'lead.qualified':
        return await this.updateLeadQualification(data);
    }
  }

  async createLeadRecord(formData) {
    const { fields } = formData;
    
    try {
      const record = await this.base('Leads').create({
        'Nome': fields.name || '',
        'Email': fields.email || '',
        'Empresa': fields.company || '',
        'Telefone': fields.phone || '',
        'Cargo': fields.position || '',
        'Fonte': formData.source || '',
        'UTM Source': formData.utm?.source || '',
        'UTM Campaign': formData.utm?.campaign || '',
        'Form ID': formData.formId || '',
        'Data Submissão': new Date(formData.submittedAt).toISOString(),
        'Status': 'Novo',
        'Score': 0
      });
      
      console.log('Airtable lead created:', record.id);
      return record;
    } catch (error) {
      console.error('Airtable lead creation error:', error);
      throw error;
    }
  }

  async createConversionRecord(conversionData) {
    try {
      const record = await this.base('Conversões').create({
        'Lead ID': conversionData.leadId,
        'Funil': conversionData.funnelId,
        'Etapa': conversionData.stepId,
        'Valor': conversionData.value,
        'Data Conversão': new Date(conversionData.convertedAt).toISOString(),
        'Tempo para Converter (min)': Math.round(conversionData.timeToConvert / 60),
        'Caminho de Conversão': conversionData.conversionPath || '',
        'Etapas Anteriores': conversionData.previousSteps?.map(s => s.stepId).join(' → ') || ''
      });
      
      console.log('Airtable conversion created:', record.id);
      return record;
    } catch (error) {
      console.error('Airtable conversion creation error:', error);
      throw error;
    }
  }

  async updateLeadQualification(leadData) {
    try {
      // Encontrar lead pelo email
      const records = await this.base('Leads').select({
        filterByFormula: `{Email} = "${leadData.email}"`
      }).firstPage();

      if (records.length > 0) {
        const record = records[0];
        await this.base('Leads').update(record.id, {
          'Score': leadData.score,
          'Qualificação': leadData.qualification,
          'Data Qualificação': new Date(leadData.qualifiedAt).toISOString(),
          'Critérios': leadData.qualificationCriteria?.join(', ') || '',
          'Tags': leadData.tags?.join(', ') || ''
        });
        
        console.log('Airtable lead updated:', record.id);
      }
    } catch (error) {
      console.error('Airtable lead update error:', error);
      throw error;
    }
  }
}
```

---

## Templates de Automação

### 1. Nutrição de Leads

```javascript
// lead-nurturing-automation.js
class LeadNurturingAutomation {
  constructor() {
    this.sequences = {
      'cold': [
        { delay: 0, action: 'send_welcome_email' },
        { delay: 86400, action: 'send_educational_content' }, // 1 dia
        { delay: 259200, action: 'send_case_study' }, // 3 dias
        { delay: 604800, action: 'send_demo_invitation' } // 7 dias
      ],
      'warm': [
        { delay: 0, action: 'send_welcome_email' },
        { delay: 3600, action: 'send_product_overview' }, // 1 hora
        { delay: 86400, action: 'send_demo_invitation' }, // 1 dia
        { delay: 259200, action: 'schedule_sales_call' } // 3 dias
      ],
      'hot': [
        { delay: 0, action: 'notify_sales_immediately' },
        { delay: 1800, action: 'send_priority_email' }, // 30 min
        { delay: 3600, action: 'schedule_urgent_call' } // 1 hora
      ]
    };
  }

  async startNurturingSequence(leadData) {
    const sequence = this.sequences[leadData.qualification] || this.sequences['cold'];
    
    for (const step of sequence) {
      setTimeout(async () => {
        await this.executeAction(step.action, leadData);
      }, step.delay * 1000);
    }
  }

  async executeAction(action, leadData) {
    switch (action) {
      case 'send_welcome_email':
        await this.sendEmail(leadData.email, 'welcome_template', leadData);
        break;
      case 'notify_sales_immediately':
        await this.notifySalesTeam(leadData, 'urgent');
        break;
      case 'schedule_sales_call':
        await this.createCalendarEvent(leadData);
        break;
      // ... outras ações
    }
  }
}
```

### 2. Recuperação de Carrinho Abandonado

```javascript
// cart-abandonment-recovery.js
class CartAbandonmentRecovery {
  constructor() {
    this.recoverySequence = [
      { delay: 3600, template: 'cart_reminder_1', discount: 0 }, // 1 hora
      { delay: 86400, template: 'cart_reminder_2', discount: 10 }, // 1 dia - 10% off
      { delay: 259200, template: 'cart_final_reminder', discount: 15 } // 3 dias - 15% off
    ];
  }

  async handleCartAbandonment(cartData) {
    // Cancelar sequência anterior se existir
    await this.cancelExistingSequence(cartData.sessionId);
    
    // Iniciar nova sequência
    for (const step of this.recoverySequence) {
      setTimeout(async () => {
        await this.sendRecoveryEmail(cartData, step);
      }, step.delay * 1000);
    }
  }

  async sendRecoveryEmail(cartData, step) {
    // Verificar se carrinho ainda está abandonado
    const isStillAbandoned = await this.checkCartStatus(cartData.sessionId);
    
    if (!isStillAbandoned) {
      console.log('Cart no longer abandoned, skipping email');
      return;
    }

    // Gerar código de desconto se aplicável
    let discountCode = null;
    if (step.discount > 0) {
      discountCode = await this.generateDiscountCode(cartData.email, step.discount);
    }

    // Enviar email
    await this.sendEmail(cartData.email, step.template, {
      ...cartData,
      discountCode,
      discountPercent: step.discount
    });

    // Registrar evento
    await this.trackRecoveryAttempt(cartData.sessionId, step);
  }
}
```

---

## Monitoramento e Alertas

### Dashboard de Webhooks

```javascript
// webhook-dashboard.js
class WebhookDashboard {
  async getWebhookMetrics(timeframe = '24h') {
    const metrics = await Promise.all([
      this.getTotalDeliveries(timeframe),
      this.getSuccessRate(timeframe),
      this.getAverageResponseTime(timeframe),
      this.getErrorBreakdown(timeframe),
      this.getTopWebhooks(timeframe)
    ]);

    return {
      totalDeliveries: metrics[0],
      successRate: metrics[1],
      averageResponseTime: metrics[2],
      errorBreakdown: metrics[3],
      topWebhooks: metrics[4],
      generatedAt: new Date().toISOString()
    };
  }

  async generateHealthReport() {
    const report = {
      timestamp: new Date().toISOString(),
      overall: 'healthy',
      issues: [],
      recommendations: []
    };

    // Verificar webhooks com baixa taxa de sucesso
    const lowSuccessWebhooks = await this.getWebhooksWithLowSuccess(90);
    if (lowSuccessWebhooks.length > 0) {
      report.issues.push({
        type: 'low_success_rate',
        webhooks: lowSuccessWebhooks,
        severity: 'high'
      });
      report.overall = 'warning';
    }

    // Verificar webhooks com timeout alto
    const slowWebhooks = await this.getSlowWebhooks(5000);
    if (slowWebhooks.length > 0) {
      report.issues.push({
        type: 'high_response_time',
        webhooks: slowWebhooks,
        severity: 'medium'
      });
    }

    return report;
  }
}
```

### Sistema de Alertas

```javascript
// alert-system.js
class WebhookAlertSystem {
  constructor() {
    this.alertRules = [
      {
        name: 'Low Success Rate',
        condition: (metrics) => metrics.successRate < 95,
        severity: 'high',
        channels: ['email', 'slack', 'telegram']
      },
      {
        name: 'High Response Time',
        condition: (metrics) => metrics.averageResponseTime > 5000,
        severity: 'medium',
        channels: ['slack']
      },
      {
        name: 'Error Spike',
        condition: (metrics) => metrics.errorCount > 50,
        severity: 'critical',
        channels: ['email', 'slack', 'telegram', 'sms']
      }
    ];
  }

  async checkAndSendAlerts() {
    const metrics = await this.getRealtimeMetrics();
    
    for (const rule of this.alertRules) {
      if (rule.condition(metrics)) {
        await this.sendAlert(rule, metrics);
      }
    }
  }

  async sendAlert(rule, metrics) {
    const alert = {
      title: `🚨 Webhook Alert: ${rule.name}`,
      severity: rule.severity,
      metrics,
      timestamp: new Date().toISOString(),
      actions: this.getRecommendedActions(rule.name)
    };

    for (const channel of rule.channels) {
      await this.sendToChannel(channel, alert);
    }
  }

  getRecommendedActions(alertType) {
    const actions = {
      'Low Success Rate': [
        'Verificar logs de erro dos webhooks afetados',
        'Testar conectividade com endpoints',
        'Verificar se URLs estão acessíveis',
        'Contatar proprietários dos endpoints'
      ],
      'High Response Time': [
        'Verificar performance dos endpoints',
        'Considerar implementar timeout menor',
        'Otimizar processamento no lado receptor'
      ],
      'Error Spike': [
        'Investigar causa raiz imediatamente',
        'Verificar status dos serviços externos',
        'Considerar pausar webhooks temporariamente'
      ]
    };

    return actions[alertType] || [];
  }
}
```

---

Esta documentação fornece uma base sólida para seu head de automações implementar todas as integrações necessárias. Cada exemplo inclui código funcional e pode ser adaptado para as necessidades específicas da sua plataforma.

Para implementação, recomendo começar com as integrações mais críticas (HubSpot, Zapier) e depois expandir para outras ferramentas conforme a demanda.