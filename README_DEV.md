# ICE – Setup n8n Proxy + Studio de IA

## 1) Variáveis (.env)
Copie `.env.example` para `.env.local` e preencha:
- `N8N_BASE_URL` (ex.: https://gtzen.app.n8n.cloud)
- `N8N_WEBHOOK_PREFIX` = `webhook` (prod) ou `webhook-test` (dev)
- `INTERNAL_API_KEY` e `N8N_HMAC_SECRET` (segredos fortes)

## 2) Proxy /api → n8n
- `lib/n8nClient.ts`: assina HMAC e envia `x-internal-api-key`.
- `app/api/[...n8n]/route.ts`: same-origin guard + allowlist.

## 3) Studio de IA
- Página em `/studio` para gerar preview e criar funis via `/api/ai/page-generate` e `/api/funnels/create` (que são repassados ao n8n).

## 4) n8n
- Importe os workflows:
  - `n8n_icesaas_all_in_one_secure.json`
  - `n8n_icesaas_funnel_ai_orchestrator.json`
- Em **Settings → Variables** crie `INTERNAL_API_KEY` e (opcional) `N8N_HMAC_SECRET` com os mesmos valores do .env.

## 5) Teste rápido
- Em dev, `N8N_WEBHOOK_PREFIX=webhook-test` e clique **Execute** no n8n antes de chamar.
- `POST /api/funnels/create` e veja a aba `/studio` renderizar o HTML no iframe.

## 6) CI
- O workflow `CI` usa secrets do repositório para buildar.
