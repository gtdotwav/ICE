"use client"
import { useState } from "react"
import Header from "@/components/layout/header"
import SubNav from "@/components/layout/sub-nav"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Loader2 } from "lucide-react"
import type { UserData, AddressData, School } from "@/lib/types"
import { mockSchools } from "@/lib/data"

type InscriptionDashboardProps = {
  userData: UserData | null
  addressData: AddressData | null
  onSelect: (category: string, school: School) => void
}

const CategoryCard = ({
  category,
  title,
  description,
  normalPrice,
  socialPrice,
  availableSlots,
  duration,
  isSelected,
  onSelect,
}: {
  category: string
  title: string
  description: string
  normalPrice: string
  socialPrice: string
  availableSlots: string
  duration: string
  isSelected: boolean
  onSelect: (category: string) => void
}) => (
  <Card className="hover:border-[#1351B4] transition-all duration-200">
    <CardContent className="p-4 sm:p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center mb-3 space-y-2 sm:space-y-0">
            <Badge className="mr-0 sm:mr-3 bg-[#1351B4] text-white border-[#1351B4] text-base sm:text-lg px-3 py-1 w-fit">
              {category}
            </Badge>
            <h3 className="text-lg sm:text-xl font-bold text-[#333333]">{title}</h3>
          </div>
          <p className="text-gray-700 mb-4 text-sm sm:text-base">{description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm mb-4">
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold text-gray-600">Preço Normal:</span>
              <div className="text-gray-500 line-through mt-1">{normalPrice}</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <span className="font-semibold text-green-600">Preço Social:</span>
              <div className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{socialPrice}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <span className="font-semibold text-gray-600">Vagas:</span>
              <div className="text-[#1351B4] font-bold mt-1">{availableSlots} disponíveis</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold text-gray-600">Prazo:</span>
              <div className="text-gray-700 mt-1">{duration}</div>
            </div>
          </div>
        </div>
        <Button
          className={`w-full h-12 text-lg ${isSelected ? "bg-green-600 hover:bg-green-700" : "bg-[#1351B4] hover:bg-[#0c326f]"}`}
          onClick={() => onSelect(category)}
        >
          {isSelected ? `CNH ${category} Selecionada ✓` : `Selecionar CNH ${category}`}
        </Button>
      </div>
    </CardContent>
  </Card>
)

const SchoolCard = ({
  school,
  isSelected,
  onSelect,
}: {
  school: School
  isSelected: boolean
  onSelect: (school: School) => void
}) => (
  <Card
    className={`cursor-pointer transition-all duration-200 ${isSelected ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-[#1351B4] hover:shadow-md"}`}
  >
    <CardContent className="p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#333333] mb-2 text-sm sm:text-base">{school.name}</h4>
          <p className="text-gray-600 text-xs sm:text-sm mb-3 leading-relaxed">{school.address}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <span className="text-gray-500 flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> {school.distance} de distância
            </span>
            <span className="text-yellow-600 flex items-center">
              <Star className="w-3 h-3 mr-1 fill-current" /> {school.rating}/{school.maxRating}
            </span>
            <Badge
              variant={school.type === "Credenciada" ? "default" : "secondary"}
              className={school.type === "Credenciada" ? "bg-green-100 text-green-700" : ""}
            >
              {school.type}
            </Badge>
          </div>
        </div>
        <div className="flex justify-center sm:justify-end sm:ml-4">
          <Button
            size="sm"
            className={isSelected ? "bg-green-600 hover:bg-green-700" : "bg-[#1351B4] hover:bg-[#0c326f]"}
            onClick={() => onSelect(school)}
          >
            {isSelected ? "Selecionada ✓" : "Selecionar"}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function InscriptionDashboard({ userData, addressData, onSelect }: InscriptionDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [schools, setSchools] = useState<School[]>([])
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [isLoadingSchools, setIsLoadingSchools] = useState(false)

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category)
    setSelectedSchool(null)
    setIsLoadingSchools(true)
    // Simulate fetching schools
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSchools(mockSchools.filter((s) => s.categories.includes(category)))
    setIsLoadingSchools(false)

    setTimeout(() => {
      const schoolSection = document.getElementById("autoescola-section")
      schoolSection?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Header showUserButton userData={userData} />
      <SubNav />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#333333] leading-tight">
            CNH Social - {addressData?.localidade || "Sua Cidade"}, {addressData?.uf || "UF"}
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Olá, {userData?.nome?.split(" ")[0] || "Cidadão"}! Autoescolas credenciadas em{" "}
            {addressData?.localidade || "sua cidade"} com vagas limitadas.
          </p>
        </div>

        <div className="space-y-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#333333] mb-4 sm:mb-6">Modalidades Disponíveis</h2>
          <CategoryCard
            category="B"
            title="CNH Categoria B - Automóvel"
            description="Habilitação para conduzir veículos de passeio, utilitários e pequenos caminhões"
            normalPrice="R$ 2.500,00"
            socialPrice="R$ 93,58"
            availableSlots="12"
            duration="60 dias"
            isSelected={selectedCategory === "B"}
            onSelect={handleCategorySelect}
          />
          <CategoryCard
            category="A"
            title="CNH Categoria A - Motocicleta"
            description="Habilitação para conduzir motocicletas, motonetas e triciclos"
            normalPrice="R$ 1.800,00"
            socialPrice="R$ 93,58"
            availableSlots="8"
            duration="45 dias"
            isSelected={selectedCategory === "A"}
            onSelect={handleCategorySelect}
          />
          <CategoryCard
            category="AB"
            title="CNH Categoria AB - Carro e Moto"
            description="Habilitação combinada para conduzir automóveis e motocicletas"
            normalPrice="R$ 3.200,00"
            socialPrice="R$ 93,58"
            availableSlots="5"
            duration="90 dias"
            isSelected={selectedCategory === "AB"}
            onSelect={handleCategorySelect}
          />
        </div>

        {selectedCategory && (
          <div id="autoescola-section" className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-2xl font-bold text-[#333333] mb-2">
                Autoescolas Credenciadas em {addressData?.localidade}
              </h3>
            </div>
            {isLoadingSchools ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <p className="text-lg font-medium text-gray-700">Buscando autoescolas próximas...</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {schools.length > 0 ? (
                  schools.map((school) => (
                    <SchoolCard
                      key={school.id}
                      school={school}
                      isSelected={selectedSchool?.id === school.id}
                      onSelect={handleSchoolSelect}
                    />
                  ))
                ) : (
                  <p>Nenhuma autoescola encontrada para esta categoria.</p>
                )}
              </div>
            )}
          </div>
        )}

        {selectedCategory && selectedSchool && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Resumo da Inscrição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded border">
                  <span className="font-semibold text-gray-700">CNH:</span>
                  <div className="text-gray-900 mt-1">CNH Categoria {selectedCategory}</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <span className="font-semibold text-gray-700">Autoescola:</span>
                  <div className="text-gray-900 mt-1">{selectedSchool.name}</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <span className="font-semibold text-gray-700">Valor:</span>
                  <div className="text-green-600 font-bold text-lg mt-1">R$ 93,58</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <span className="font-semibold text-gray-700">Próximo passo:</span>
                  <div className="text-blue-600 font-medium mt-1">Agendar início das aulas</div>
                </div>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-lg h-12"
                onClick={() => onSelect(selectedCategory, selectedSchool)}
              >
                Agendar Início das Aulas
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}
