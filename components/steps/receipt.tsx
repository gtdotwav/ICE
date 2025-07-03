"use client"
import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"

import Header from "@/components/layout/header"
import SubNav from "@/components/layout/sub-nav"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Lock } from "lucide-react"
import Image from "next/image"
import type { UserData, AddressData, School } from "@/lib/types"

type ReceiptProps = {
  selectedCategory: string
  selectedSchool: School
  categoryInfo: { name: string; price: string }
  addressData: AddressData | null
  cpf: string
  userData: UserData | null
  selectedStartDate: Date
}

export default function Receipt({
  selectedCategory,
  selectedSchool,
  categoryInfo,
  addressData,
  cpf,
  userData,
  selectedStartDate,
}: ReceiptProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const protocol = `${addressData?.localidade?.toUpperCase() || "BR"}-${Math.floor(100000 + Math.random() * 900000)}`
  const qrData = encodeURIComponent(
    `COMPROVANTE CNH SOCIAL\nNome: ${userData?.nome}\nCPF: ${cpf}\nCategoria: ${categoryInfo.name}\nAutoescola: ${selectedSchool.name}\nInício: ${selectedStartDate.toLocaleDateString("pt-BR")}\nProtocolo: ${protocol}`,
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showUserButton userData={userData} />
      <SubNav />
      <main className="flex-grow container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
              DENATRAN
            </Badge>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Comprovante de Matrícula CNH</h1>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              CNH Social 2025 - Comprovante oficial de matrícula
            </p>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Comprovante de Matrícula CNH</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Protocolo: {protocol}</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Ativo</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-[#555] mb-4">Dados do Candidato</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nome Completo:</p>
                    <p className="text-[#555] font-medium">{userData?.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">CPF:</p>
                    <p className="text-[#555] font-medium">{cpf}</p>
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <h3 className="text-base font-medium text-[#555] mb-4">Dados da Habilitação CNH</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Categoria CNH:</p>
                    <p className="text-[#555] font-medium">{categoryInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Autoescola:</p>
                    <p className="text-[#555] font-medium">{selectedSchool.name}</p>
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <h3 className="text-base font-medium text-[#555] mb-4">Informações do Curso</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Local do Curso:</p>
                      <p className="text-[#555] font-medium">{selectedSchool.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Data de Início:</p>
                      <p className="text-[#d63638] font-medium text-lg">
                        {selectedStartDate.toLocaleDateString("pt-BR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        às 08:00
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Image
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`}
                      alt="QR Code"
                      width={96}
                      height={96}
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">QR Code para validação</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Finalizar Inscrição CNH Social</h3>
                <p className="text-gray-600">
                  Sua matrícula foi processada. Clique abaixo para finalizar sua inscrição.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">Valor da Inscrição: {categoryInfo.price}</span>
                </div>
                <p className="text-green-700 text-sm">Taxa única que cobre todos os custos do processo.</p>
              </div>
              <Button
                size="lg"
                className="w-full max-w-md mx-auto bg-[#1451B4] hover:bg-[#0c326f] text-lg h-14"
                onClick={() =>
                  window.open("https://pay.pagtransacao.com/checkout/8b640046-9753-4151-abc3-d40b032d4d1f"
                  
                  
                  , "_blank")
                }
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Finalizar Inscrição - {categoryInfo.price}
              </Button>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 max-w-md mx-auto">
                <div className="flex items-start space-x-2">
                  <Lock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-gray-500 space-y-1 text-left">
                    <p className="font-medium text-gray-600">Pagamento Seguro</p>
                    <p>Processamento seguro via plataforma certificada. Seus dados estão protegidos.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
