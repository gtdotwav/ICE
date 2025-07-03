"use client"
import { useState } from "react"
import Header from "@/components/layout/header"
import SubNav from "@/components/layout/sub-nav"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { CalendarIcon, CheckCircle, Clock, MapPin } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import type { UserData, AddressData, School } from "@/lib/types"

type ScheduleClassesProps = {
  selectedCategory: string
  selectedSchool: School
  categoryInfo: { name: string; price: string }
  addressData: AddressData | null
  userData: UserData | null
  onDateSelected: (date: Date) => void
}

export default function ScheduleClasses({
  selectedCategory,
  selectedSchool,
  categoryInfo,
  addressData,
  userData,
  onDateSelected,
}: ScheduleClassesProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)

  const courseDetails = ((category: string) => {
    const details = {
      A: { theoreticalHours: "45 horas", practicalHours: "15 horas", duration: "45 dias" },
      B: { theoreticalHours: "45 horas", practicalHours: "20 horas", duration: "60 dias" },
      AB: { theoreticalHours: "45 horas", practicalHours: "25 horas", duration: "90 dias" },
    }
    return details[category as keyof typeof details] || details.B
  })(selectedCategory)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showUserButton userData={userData} />
      <SubNav />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#333333]">Agendamento de Início das Aulas</h1>
            <p className="text-sm text-gray-600 mt-1">CNH Social 2025 - Escolha a data de início do seu curso</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Resumo da sua inscrição</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 font-medium">Categoria CNH:</p>
                <p className="text-blue-800 font-semibold">{categoryInfo.name}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Autoescola:</p>
                <p className="text-blue-800 font-semibold">{selectedSchool.name}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Valor:</p>
                <p className="text-green-600 font-bold text-lg">{categoryInfo.price}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <CalendarIcon className="w-6 h-6 text-[#1351B4] mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Escolha a data de início</h3>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                fromDate={new Date(new Date().setDate(new Date().getDate() + 7))}
                toDate={new Date(new Date().setDate(new Date().getDate() + 60))}
                disabled={(day) => day.getDay() === 0}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-6">
              {date && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-semibold text-green-800">Data selecionada</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-green-700">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span className="font-medium">
                        {date.toLocaleDateString("pt-BR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-green-700">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        Horário: {date.getDay() >= 1 && date.getDay() <= 5 ? "08:00 às 17:00" : "08:00 às 12:00"}
                      </span>
                    </div>
                    <div className="flex items-center text-green-700">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{selectedSchool.name}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do curso</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carga horária teórica:</span>
                    <span className="font-medium">{courseDetails.theoreticalHours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carga horária prática:</span>
                    <span className="font-medium">{courseDetails.practicalHours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duração estimada:</span>
                    <span className="font-medium">{courseDetails.duration}</span>
                  </div>
                </div>
              </div>
              <Button
                className="w-full py-4 h-auto text-lg"
                disabled={!date}
                onClick={() => date && onDateSelected(date)}
              >
                {date ? "Continuar para Verificação" : "Selecione uma data para continuar"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
