"use client"
import { useState, useMemo } from "react"

type GenResp = { html: string; page_schema: any; prompt_v0: string }

export default function StudioPage() {
  const [funnelType, setFunnelType] = useState<"lp" | "checkout" | "lp_vsl_checkout">("lp_vsl_checkout")
  const [funnelName, setFunnelName] = useState("LP VSL de Lançamento Pro")
  const [language, setLanguage] = useState("pt-BR")
  const [tone, setTone] = useState("inspirador")
  const [style, setStyle] = useState("direto")

  const [productName, setProductName] = useState("AutoLaunch Pro")
  const [price, setPrice] = useState(497)
  const [category, setCategory] = useState("SaaS")
  const [benefits, setBenefits] = useState("Automação de campanhas; Templates prontos; Analytics")
  const [uniques, setUniques] = useState("Editor visual de funis; IA integrada")

  const [audienceWho, setAudienceWho] = useState("Infoprodutores iniciantes e avançados")
  const [pains, setPains] = useState("Baixa conversão; Configuração demorada")
  const [objections, setObjections] = useState("Preço; Complexidade")

  const [promise, setPromise] = useState("Dobre sua taxa de conversão em 30 dias")
  const [bonuses, setBonuses] = useState("Checklist de lançamento; Suporte VIP 30 dias")
  const [guarantee, setGuarantee] = useState("Garantia incondicional de 7 dias")

  const [loading, setLoading] = useState(false)
  const [resp, setResp] = useState<GenResp | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function call(path: string, body: any) {
    setLoading(true)
    setErr(null)
    setResp(null)
    try {
      const r = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!r.ok) throw new Error(`Erro ${r.status}`)
      const json = await r.json()
      setResp(json.page ? json.page : json) // funnels/create embute page
    } catch (e: any) {
      setErr(e.message || "Falha")
    } finally {
      setLoading(false)
    }
  }

  function toArray(str: string) {
    return str
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
  }

  const payload = useMemo(
    () => ({
      funnelName,
      funnelType,
      language,
      tone,
      style,
      product: { name: productName, price, category, benefits: toArray(benefits), uniques: toArray(uniques) },
      audience: { who: audienceWho, pains: toArray(pains), objections: toArray(objections) },
      offer: { promise, bonuses: toArray(bonuses), guarantee },
      brand: { guidelines: "Minimalista, tipografia forte, CTA destacado" },
    }),
    [
      funnelName,
      funnelType,
      language,
      tone,
      style,
      productName,
      price,
      category,
      benefits,
      uniques,
      audienceWho,
      pains,
      objections,
      promise,
      bonuses,
      guarantee,
    ],
  )

  const srcDoc = useMemo(
    () =>
      resp?.html ||
      "<!doctype html><html><body style='font-family:system-ui;padding:2rem'>Pré-visualização aqui</body></html>",
    [resp],
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="p-6 space-y-4 border-r">
        <h2 className="text-xl font-semibold">Studio de IA</h2>

        <label className="block text-sm font-medium">Tipo do funil</label>
        <select
          className="border p-2 rounded"
          value={funnelType}
          onChange={(e) => setFunnelType(e.target.value as any)}
        >
          <option value="lp">LP</option>
          <option value="checkout">Checkout</option>
          <option value="lp_vsl_checkout">LP + VSL + Checkout</option>
        </select>

        <label className="block text-sm font-medium">Nome do funil</label>
        <input
          className="border p-2 rounded w-full"
          value={funnelName}
          onChange={(e) => setFunnelName(e.target.value)}
        />

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm">Idioma</label>
            <input
              className="border p-2 rounded w-full"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Tom</label>
            <input className="border p-2 rounded w-full" value={tone} onChange={(e) => setTone(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Estilo</label>
            <input className="border p-2 rounded w-full" value={style} onChange={(e) => setStyle(e.target.value)} />
          </div>
        </div>

        <h3 className="font-semibold mt-4">Produto</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Nome"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <input
            className="border p-2 rounded col-span-2"
            placeholder="Benefícios (; separados)"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
          />
          <input
            className="border p-2 rounded col-span-2"
            placeholder="Diferenciais (; separados)"
            value={uniques}
            onChange={(e) => setUniques(e.target.value)}
          />
        </div>

        <h3 className="font-semibold mt-4">Público & Oferta</h3>
        <input
          className="border p-2 rounded w-full"
          placeholder="Quem"
          value={audienceWho}
          onChange={(e) => setAudienceWho(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Dores (; separados)"
          value={pains}
          onChange={(e) => setPains(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Objeções (; separados)"
          value={objections}
          onChange={(e) => setObjections(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Promessa"
          value={promise}
          onChange={(e) => setPromise(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Bônus (; separados)"
          value={bonuses}
          onChange={(e) => setBonuses(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Garantia"
          value={guarantee}
          onChange={(e) => setGuarantee(e.target.value)}
        />

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => call("/api/ai/page-generate", payload)}
            disabled={loading}
            className="px-3 py-2 border rounded bg-black text-white disabled:opacity-50"
          >
            Gerar Preview
          </button>
          <button
            onClick={() => call("/api/funnels/create", payload)}
            disabled={loading}
            className="px-3 py-2 border rounded"
          >
            Criar Funil + Página
          </button>
        </div>

        {err && <p className="text-red-600 text-sm">{err}</p>}
      </div>
      <div className="p-0">
        <iframe title="Preview" className="w-full h-screen" sandbox="allow-same-origin allow-scripts" srcDoc={srcDoc} />
      </div>
    </div>
  )
}
