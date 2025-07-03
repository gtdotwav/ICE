"use client"
import { useState } from "react"
import Image from "next/image"
import Header from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import type { UserData } from "@/lib/types"

type LoginStepProps = {
  onLoginSubmit: (userData: UserData) => void
}

export default function LoginStep({ onLoginSubmit }: LoginStepProps) {
  const [name, setName] = useState("")
  const [dob, setDob] = useState("")
  const [cpf, setCpf] = useState("")
  const [password, setPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({ cpf: "", dob: "" })

  const formatCpf = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "")
    if (onlyNumbers.length <= 11) {
      return onlyNumbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    }
    return onlyNumbers.slice(0, 11)
  }

  const formatDate = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "")
    if (onlyNumbers.length <= 8) {
      return onlyNumbers.replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2")
    }
    return onlyNumbers.slice(0, 8)
  }

  const validateCpf = (cpf: string): boolean => {
    const cleanCpf = cpf.replace(/\D/g, "")
    if (cleanCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanCpf)) return false
    let sum = 0
    let remainder
    for (let i = 1; i <= 9; i++) sum = sum + Number.parseInt(cleanCpf.substring(i - 1, i)) * (11 - i)
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cleanCpf.substring(9, 10))) return false
    sum = 0
    for (let i = 1; i <= 10; i++) sum = sum + Number.parseInt(cleanCpf.substring(i - 1, i)) * (12 - i)
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cleanCpf.substring(10, 11))) return false
    return true
  }

  const handleSubmit = async () => {
    let hasError = false
    const newErrors = { cpf: "", dob: "" }

    if (!validateCpf(cpf)) {
      newErrors.cpf = "CPF inválido. Verifique os números digitados."
      hasError = true
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
      newErrors.dob = "Data de nascimento inválida. Use o formato DD/MM/AAAA."
      hasError = true
    }

    setErrors(newErrors)

    if (hasError) {
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const userData: UserData = {
      nome: name,
      cpf: cpf,
      nascimento: dob,
      sexo: "Não informado",
      nome_mae: "Não informado",
    }

    setIsLoading(false)
    onLoginSubmit(userData)
  }

  const isFormValid = name.length > 2 && dob.length === 10 && cpf.length === 14 && password.length >= 6

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Image src="/images/id-card.png" alt="ID Card" width={24} height={24} className="mr-3" />
            <h2 className="text-lg font-semibold text-[#333333]">Crie ou acesse sua conta gov.br</h2>
          </div>
          <p className="text-gray-600 text-sm mb-6">
            Para iniciar sua inscrição na CNH Social, precisamos de alguns dados.
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="font-bold">
                Nome Completo
              </Label>
              <Input
                type="text"
                id="name"
                placeholder="Digite seu nome completo"
                className="mt-2 h-12 text-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dob" className="font-bold">
                Data de Nascimento
              </Label>
              <Input
                type="text"
                id="dob"
                placeholder="DD/MM/AAAA"
                className="mt-2 h-12 text-base"
                maxLength={10}
                value={dob}
                onChange={(e) => {
                  setDob(formatDate(e.target.value))
                  setErrors((prev) => ({ ...prev, dob: "" }))
                }}
              />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
            </div>
            <div>
              <Label htmlFor="cpf" className="font-bold">
                CPF
              </Label>
              <Input
                type="text"
                id="cpf"
                placeholder="Digite seu CPF"
                className="mt-2 h-12 text-base"
                maxLength={14}
                value={cpf}
                onChange={(e) => {
                  setCpf(formatCpf(e.target.value))
                  setErrors((prev) => ({ ...prev, cpf: "" }))
                }}
              />
              {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
            </div>
            <div>
              <Label htmlFor="password" className="font-bold">
                Senha
              </Label>
              <div className="relative mt-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Crie uma senha"
                  className="h-12 text-base pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-400 hover:text-gray-600 h-5 w-5" />
                  ) : (
                    <Eye className="text-gray-400 hover:text-gray-600 h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <Button
            className="w-full mt-6 h-12 text-base font-bold bg-[#1351B4] hover:bg-[#0c326f]"
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Continuar"}
          </Button>
        </div>
      </main>
    </div>
  )
}
