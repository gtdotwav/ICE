export type FunnelType = "lp" | "checkout" | "lp_vsl_checkout"

export const RAW_PROMPT = `Você é um gerador de páginas que produz um documento HTML completo (com <html>, <head>, <body>), CSS inline minimalista, sem bibliotecas externas e sem comentários. O resultado deve estar em {{language}} e pronto para preview.
Objetivo
Criar a página do funil "{{funnelName}}" no formato "{{funnelType}}" usando o contexto abaixo e o tom {{tone}} com estilo {{style}}. A página deve seguir princípios de UX claros, alta legibilidade e conversão.
Contexto
Produto:
nome: {{product.name}}
preço: {{product.price}}
categoria: {{product.category}}
benefícios (bullets): {{product.benefits}}
diferenciais (bullets): {{product.uniques}}
Público:
quem: {{audience.who}}
dores: {{audience.pains}}
objeções: {{audience.objections}}
Oferta:
promessa: {{offer.promise}}
bônus (bullets): {{offer.bonuses}}
garantia: {{offer.guarantee}}
Marca/Diretrizes:
tom: {{tone}}
estilo: {{style}}
guidelines: {{brand.guidelines}}
Estrutura por tipo de funil
Escolha os blocos exatamente nesta ordem conforme {{funnelType}}:
lp → hero, benefits, social_proof, features, faq, cta
checkout → summary, price_table, guarantee, checkout_form, security_badges
lp_vsl_checkout → hero_vsl, vsl_player, problem_agitate_solve, offer_stack, bonuses, testimonials, price_table, checkout_form, faq
Regras de UI/UX
Container central máx 960px, padding ≥ 24px.
Tipografia legível (system-ui/seguintes), alto contraste.
CTA principal acima da dobra com texto claro de ação.
VSL: usar <iframe> responsivo com poster (sem terceiros).
Checkout: simular formulário (inputs rotulados + botão), sem integrações reais.
Prova social: depoimentos curtos ou logos.
FAQ: 5 perguntas com respostas objetivas.
Footer com links “Políticas” e “Contato”.
Acessibilidade & SEO
Semântica: usar <header>, <main>, <section>, <nav>, <footer>.
Labels nos inputs; alt em imagens; foco visível; contraste adequado.
<title> descritivo (use produto+promessa). <meta name="description"> concisa.
Apenas CSS no <style>. Não usar JS ou bibliotecas externas.
Telemetria leve (somente atributos)
Adicione data-analytics nos elementos de ação, por exemplo:
CTA principal: data-analytics="cta_primary"
Envio do checkout: data-analytics="checkout_submit"
Saída (OBRIGATÓRIO)
Retorne apenas um HTML completo (sem comentários).
Inclua um <style> no <head> com CSS inline minimalista.
No final do <body>, inclua exatamente:
<script type="application/json" id="page_meta"> {   "funnelName": "{{funnelName}}",   "funnelType": "{{funnelType}}",   "blocks": {{blocksJson}},   "language": "{{language}}" } </script>
Onde {{blocksJson}} é um array JSON refletindo os blocos usados na página, na ordem gerada (ex.: ["hero","benefits","social_proof","features","faq","cta"]).
Tom e estilo do texto
Tom: {{tone}}. Estilo: {{style}}.
Linguagem clara, sem jargão; frases curtas; foco em benefícios e resultado.
Ajustar copy conforme dores e objeções informadas.
Gere agora o HTML final seguindo tudo acima.`

export function computeBlocks(funnelType: FunnelType): string[] {
  switch (funnelType) {
    case "lp":
      return ["hero", "benefits", "social_proof", "features", "faq", "cta"]
    case "checkout":
      return ["summary", "price_table", "guarantee", "checkout_form", "security_badges"]
    case "lp_vsl_checkout":
      return [
        "hero_vsl",
        "vsl_player",
        "problem_agitate_solve",
        "offer_stack",
        "bonuses",
        "testimonials",
        "price_table",
        "checkout_form",
        "faq",
      ]
    default:
      return []
  }
}

type AnyRecord = Record<string, any>

function getByPath(obj: AnyRecord, path: string) {
  return path.split(".").reduce((acc: any, key) => (acc == null ? acc : acc[key]), obj)
}

export function fillPrompt(raw: string, vars: AnyRecord) {
  // Generic {{path.to.value}} replacement
  return raw.replace(/\{\{([^}]+)\}\}/g, (_, p1: string) => {
    const v = getByPath(vars, p1.trim())
    if (p1.trim() === "blocksJson" && Array.isArray(vars.blocksJson)) {
      return JSON.stringify(vars.blocksJson)
    }
    return v != null ? String(v) : `{{${p1}}}`
  })
}

export type PromptVars = {
  language: string
  funnelName: string
  funnelType: FunnelType
  tone: string
  style: string
  product: { name: string; price: string; category: string; benefits: string; uniques: string }
  audience: { who: string; pains: string; objections: string }
  offer: { promise: string; bonuses: string; guarantee: string }
  brand: { guidelines: string }
  blocksJson: string[] // computed
}

export function buildFilledPrompt(vars: Omit<PromptVars, "blocksJson">): string {
  const blocks = computeBlocks(vars.funnelType)
  const fullVars: PromptVars = { ...vars, blocksJson: blocks }
  return fillPrompt(RAW_PROMPT, fullVars as any)
}
