"use client"
import { useState } from "react"
import Header from "@/components/layout/header"
import SubNav from "@/components/layout/sub-nav"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import type { AddressData, UserData } from "@/lib/types"

type TermsAndCepProps = {
  onCepSubmit: (address: AddressData) => void
  userData: UserData | null
}

export default function TermsAndCep({ onCepSubmit, userData }: TermsAndCepProps) {
  const [cep, setCep] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const formatCep = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 9)
  }

  const fetchAddress = async (cep: string): Promise<AddressData | null> => {
    const cleanCep = cep.replace(/\D/g, "")
    if (cleanCep.length !== 8) {
      setError("CEP inválido.")
      return null
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      if (!response.ok) {
        throw new Error("Erro ao buscar CEP.")
      }
      const data = await response.json()
      if (data.erro) {
        setError("CEP não encontrado.")
        return null
      }
      return data
    } catch (e) {
      setError("Não foi possível buscar o CEP. Tente novamente.")
      return null
    }
  }

  const handleSubmit = async () => {
    setError("")
    setIsLoading(true)
    const address = await fetchAddress(cep)
    setIsLoading(false)
    if (address) {
      onCepSubmit(address)
    }
  }

  const firstName = userData?.nome.split(" ")[0]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <SubNav />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Termos de Uso e Localização</h1>
          {firstName && (
            <p className="text-lg text-gray-600 mb-6">
              Olá, <span className="font-semibold">{firstName}</span>! Por favor, leia e aceite os termos para
              continuar.
            </p>
          )}

          <div className="border rounded-lg p-4 h-48 overflow-y-auto text-sm text-gray-600 bg-gray-50 mb-6">
            <h2 className="font-semibold text-base text-gray-700 mb-2">Termos e Condições do Programa CNH Social</h2>
            <p className="mb-2">
              Ao se inscrever no programa CNH Social, você declara estar ciente e de acordo com todos os requisitos e
              condições estabelecidos pelo DETRAN do seu estado. Você confirma que as informações fornecidas são
              verdadeiras e precisas, sob pena de exclusão do processo seletivo e outras sanções legais.
            </p>
            <p className="mb-2">
              O programa visa beneficiar cidadãos de baixa renda, e a seleção é baseada em critérios socioeconômicos. A
              inscrição não garante a aprovação. O candidato deve acompanhar todas as etapas do processo no site oficial
              do DETRAN.
            </p>
            <p>
              Os dados coletados serão utilizados exclusivamente para fins de seleção e comunicação sobre o programa, em
              conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-8">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(Boolean(checked))}
            />
            <label htmlFor="terms" className="text-sm font-medium text-gray-700">
              Li e aceito os termos de uso
            </label>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Confirmação de Endereço</h2>
            <p className="text-gray-600 mb-4">
              Para encontrarmos as autoescolas mais próximas, por favor, informe seu CEP.
            </p>
            <div className="max-w-xs">
              <Label htmlFor="cep" className="font-bold">
                CEP
              </Label>
              <Input
                type="text"
                id="cep"
                placeholder="00000-000"
                className="mt-2 h-12 text-base"
                value={cep}
                onChange={(e) => {
                  setCep(formatCep(e.target.value))
                  setError("")
                }}
                maxLength={9}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          </div>
        </div>
      </main>
      <div className="sticky bottom-0 bg-white border-t">
        <div className="container mx-auto px-4 py-4 max-w-4xl flex justify-end">
          <Button
            className="h-12 px-8 text-base font-bold bg-[#1351B4] hover:bg-[#0c326f]"
            onClick={handleSubmit}
            disabled={!termsAccepted || cep.length !== 9 || isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Buscar Autoescolas"}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
