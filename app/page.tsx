"use client"

import { useState } from "react"
import LandingPage from "@/components/steps/landing-page"
import LoginStep from "@/components/steps/login-step"
import TermsAndCep from "@/components/steps/terms-and-cep"
import InscriptionDashboard from "@/components/steps/inscription-dashboard"
import ScheduleClasses from "@/components/steps/schedule-classes"
import Verification from "@/components/steps/verification"
import Receipt from "@/components/steps/receipt"
import LoadingScreen from "@/components/steps/loading-screen"
import type { School, UserData, AddressData } from "@/lib/types"

export default function Home() {
  const [step, setStep] = useState("landing")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [addressData, setAddressData] = useState<AddressData | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleStart = () => setStep("login")

  const handleLoginSubmit = (data: UserData) => {
    setUserData(data)
    setStep("terms-and-cep")
  }

  const handleCepSubmit = (address: AddressData) => {
    setAddressData(address)
    setStep("loading")
    setTimeout(() => setStep("dashboard"), 3000)
  }
  const handleCategoryAndSchoolSelect = (category: string, school: School) => {
    setSelectedCategory(category)
    setSelectedSchool(school)
    setStep("schedule")
  }
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setStep("verification")
  }
  const handleVerificationComplete = () => setStep("receipt")

  const renderStep = () => {
    switch (step) {
      case "landing":
        return <LandingPage onStartInscription={handleStart} />
      case "login":
        return <LoginStep onLoginSubmit={handleLoginSubmit} />
      case "terms-and-cep":
        return <TermsAndCep userData={userData} onCepSubmit={handleCepSubmit} />
      case "loading":
        return <LoadingScreen />
      case "dashboard":
        return (
          <InscriptionDashboard
            userData={userData}
            addressData={addressData}
            onSelect={handleCategoryAndSchoolSelect}
          />
        )
      case "schedule":
        return (
          <ScheduleClasses
            selectedCategory={selectedCategory!}
            selectedSchool={selectedSchool!}
            categoryInfo={{ name: `CNH Categoria ${selectedCategory}`, price: "R$ 93,58" }}
            addressData={addressData}
            userData={userData}
            onDateSelected={handleDateSelect}
          />
        )
      case "verification":
        return (
          <Verification
            selectedCategory={selectedCategory!}
            selectedSchool={selectedSchool!}
            categoryInfo={{ name: `CNH Categoria ${selectedCategory}`, price: "R$ 93,58" }}
            addressData={addressData}
            cpf={userData?.cpf || ""}
            userData={userData}
            onProceedToReceipt={handleVerificationComplete}
          />
        )
      case "receipt":
        return (
          <Receipt
            selectedCategory={selectedCategory!}
            selectedSchool={selectedSchool!}
            categoryInfo={{ name: `CNH Categoria ${selectedCategory}`, price: "R$ 93,58" }}
            addressData={addressData}
            cpf={userData?.cpf || ""}
            userData={userData}
            selectedStartDate={selectedDate!}
          />
        )
      default:
        return <LandingPage onStartInscription={handleStart} />
    }
  }

  return <div className="bg-white">{renderStep()}</div>
}
