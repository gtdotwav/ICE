"use client"
import { useState, useRef, useEffect } from "react"
import Header from "@/components/layout/header"
import SubNav from "@/components/layout/sub-nav"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, MapPin, Eye, Camera, Loader2 } from "lucide-react"
import type { UserData, AddressData, School } from "@/lib/types"

type VerificationProps = {
  selectedCategory: string
  selectedSchool: School
  categoryInfo: { name: string; price: string }
  addressData: AddressData | null
  cpf: string
  userData: UserData | null
  onProceedToReceipt: () => void
}

export default function Verification({
  selectedCategory,
  selectedSchool,
  categoryInfo,
  addressData,
  cpf,
  userData,
  onProceedToReceipt,
}: VerificationProps) {
  const [showCamera, setShowCamera] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (showCamera && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 640, height: 480, facingMode: "user" } })
        .then((stream) => {
          setStream(stream)
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          console.error("Error accessing camera: ", err)
          alert("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.")
          setShowCamera(false)
        })
    } else {
      stream?.getTracks().forEach((track) => track.stop())
    }
    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [showCamera])

  const handleCapture = () => {
    setShowCamera(false)
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showUserButton userData={userData} />
      <SubNav />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#333333]">Verificação de Dados e Identidade</h1>
            <p className="text-sm text-gray-600 mt-1">CNH Social 2025 - Processo de Habilitação Gratuita</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <CheckCircle className="w-5 h-5 mr-2" /> Dados Pessoais Verificados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 font-medium">Nome Completo:</p>
                  <p className="text-green-800 font-semibold">{userData?.nome}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">CPF:</p>
                  <p className="text-green-800 font-semibold">{cpf}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Data de Nascimento:</p>
                  <p className="text-green-800 font-semibold">{userData?.nascimento}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <MapPin className="w-5 h-5 mr-2" /> Localização Verificada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 font-medium">Endereço:</p>
                  <p className="text-blue-800 font-semibold">
                    {addressData?.logradouro}, {addressData?.bairro}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Cidade/UF:</p>
                  <p className="text-blue-800 font-semibold">
                    {addressData?.localidade} - {addressData?.uf}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">CEP:</p>
                  <p className="text-blue-800 font-semibold">{addressData?.cep}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 border-2 border-[#1351B4]">
            <CardHeader>
              <CardTitle className="text-[#1351B4]">Dados da Inscrição CNH Social</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-gray-600 font-medium">Categoria CNH:</p>
                <p className="text-[#333] font-semibold">{categoryInfo.name}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Autoescola:</p>
                <p className="text-[#333] font-semibold">{selectedSchool.name}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Preço:</p>
                <p className="text-green-600 font-semibold">{categoryInfo.price}</p>
              </div>
            </CardContent>
          </Card>

          {!isVerified ? (
            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <Eye className="w-5 h-5 mr-2" /> Verificação Facial Obrigatória
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showCamera && !isVerifying && (
                  <div className="text-center space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
                      <p className="text-sm font-medium text-gray-700 mb-2">Instruções:</p>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Esteja em um local bem iluminado.</li>
                        <li>Remova óculos escuros ou chapéu.</li>
                        <li>Posicione o rosto no centro da câmera.</li>
                      </ul>
                    </div>
                    <Button onClick={() => setShowCamera(true)}>
                      <Camera className="w-5 h-5 mr-2" /> Iniciar Verificação Facial
                    </Button>
                  </div>
                )}
                {showCamera && (
                  <div className="text-center space-y-4">
                    <div className="relative inline-block">
                      <video
                        ref={videoRef}
                        className="w-80 h-60 bg-gray-200 rounded-lg object-cover"
                        autoPlay
                        playsInline
                        muted
                        style={{ transform: "scaleX(-1)" }}
                      />
                      <div className="absolute inset-0 border-4 border-dashed border-blue-500 rounded-lg" />
                    </div>
                    <div className="flex space-x-3 justify-center">
                      <Button variant="secondary" onClick={() => setShowCamera(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCapture}>Capturar Foto</Button>
                    </div>
                  </div>
                )}
                {isVerifying && (
                  <div className="flex flex-col items-center space-y-4 p-6">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                    <p className="text-lg font-medium text-gray-700">Verificando identidade...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <CheckCircle className="w-5 h-5 mr-2" /> Verificação Concluída
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-green-700">Sua identidade foi confirmada com sucesso!</p>
                <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={onProceedToReceipt}>
                  Gerar Comprovante de Matrícula
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
