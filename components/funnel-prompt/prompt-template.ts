export type FunnelType = "lp" | "checkout" | "lp_vsl_checkout"

export const BLOCK_ORDER: Record<FunnelType, string[]> = {
  lp: ["hero", "benefits", "social_proof", "features", "faq", "cta"],
  checkout: ["summary", "price_table", "guarantee", "checkout_form", "security_badges"],
  lp_vsl_checkout: [
    "hero_vsl",
    "vsl_player",
    "problem_agitate_solve",
    "offer_stack",
    "bonuses",
    "testimonials",
    "price_table",
    "checkout_form",
    "faq",
  ],
}

export interface PromptVars {
  language: string
  funnelName: string
  funnelType: FunnelType
  tone: string
  style: string
  product: {
    name: string
    price: string
    category: string
    benefits: string[] | string
    uniques: string[] | string
  }
  audience: {
    who: string
    pains: string[] | string
    objections: string[] | string
  }
  offer: {
    promise: string
    bonuses: string[] | string
    guarantee: string
  }
  brand: {
    guidelines: string
  }
  applyDidaticaV2?: boolean
}

const PROMPT_PT = `Você é um gerador de páginas que produz um documento HTML completo (com <html>, <head>, <body>), CSS inline minimalista, sem bibliotecas externas e sem comentários. O resultado deve estar em {{language}} e pronto para preview.
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
<script type="application/json" id="page_meta">
{
  "funnelName": "{{funnelName}}",
  "funnelType": "{{funnelType}}",
  "blocks": {{blocksJson}},
  "language": "{{language}}"
}
</script>
Onde {{blocksJson}} é um array JSON refletindo os blocos usados na página, na ordem gerada (ex.: ["hero","benefits","social_proof","features","faq","cta"]).
Tom e estilo do texto
Tom: {{tone}}. Estilo: {{style}}.
Linguagem clara, sem jargão; frases curtas; foco em benefícios e resultado.
Ajustar copy conforme dores e objeções informadas.
Gere agora o HTML final seguindo tudo acima.`

function normalizeList(list: string[] | string): string[] {
  if (Array.isArray(list)) {
    return list.map((s) => s.trim()).filter(Boolean)
  }
  return list
    .split("\n")
    .map((s) => s.replace(/^\s*[-•]\s?/, "").trim())
    .filter(Boolean)
}

function bulletsToInline(list: string[]): string {
  // Mantém formato simples para colar no prompt
  return list.map((item) => `- ${item}`).join("\n")
}

function replaceAllPlaceholders(input: string, map: Record<string, string>): string {
  let out = input
  for (const [k, v] of Object.entries(map)) {
    const re = new RegExp(`\\{\\{${k.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\}\\}`, "g")
    out = out.replace(re, v)
  }
  return out
}

function didaticaLPv2Guidelines(): string {
  return [
    "Didática LP v2:",
    "- Hero com headline de valor claro, subtítulo de reforço e CTA principal acima da dobra.",
    "- Benefícios em bullets com linguagem orientada a resultado (1 linha cada).",
    "- Prova social com 3 depoimentos curtos ou logos para reduzir risco percebido.",
    "- Seção de features com microcopy explicando o “como funciona” em passos simples.",
    "- FAQ com 5 perguntas frequentes atacando objeções mapeadas.",
    "- CTA de suporte (secundária) ao fim de cada seção longa.",
    "- Layout focado em leitura: largura 60–75 caracteres, espaçamento 1.5, contraste AA.",
  ].join(" ")
}

/**
 * Gera o prompt para usar no v0.dev
 * mode = 'template' mantém {{variáveis}}
 * mode = 'filled' substitui variáveis e calcula blocksJson
 */
export function buildPrompt(vars: PromptVars, mode: "template" | "filled" = "filled"): string {
  if (mode === "template") return PROMPT_PT

  const benefits = normalizeList(vars.product.benefits)
  const uniques = normalizeList(vars.product.uniques)
  const pains = normalizeList(vars.audience.pains)
  const objections = normalizeList(vars.audience.objections)
  const bonuses = normalizeList(vars.offer.bonuses)

  const blocksJson = JSON.stringify(BLOCK_ORDER[vars.funnelType])

  const guidelines = [
    vars.brand.guidelines?.trim() || "",
    vars.applyDidaticaV2 && vars.funnelType === "lp" ? didaticaLPv2Guidelines() : "",
  ]
    .filter(Boolean)
    .join("\n")

  const map: Record<string, string> = {
    language: vars.language,
    funnelName: vars.funnelName,
    funnelType: vars.funnelType,
    tone: vars.tone,
    style: vars.style,
    "product.name": vars.product.name,
    "product.price": vars.product.price,
    "product.category": vars.product.category,
    "product.benefits": bulletsToInline(benefits),
    "product.uniques": bulletsToInline(uniques),
    "audience.who": vars.audience.who,
    "audience.pains": bulletsToInline(pains),
    "audience.objections": bulletsToInline(objections),
    "offer.promise": vars.offer.promise,
    "offer.bonuses": bulletsToInline(bonuses),
    "offer.guarantee": vars.offer.guarantee,
    "brand.guidelines": guidelines,
    blocksJson,
  }

  return replaceAllPlaceholders(PROMPT_PT, map)
}
