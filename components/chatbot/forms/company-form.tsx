"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type CompanyFormData = {
  fullName: string
  role: string
  companyEmail: string
  companyName: string
}

type CompanyFormProps = {
  onSubmit: (data: CompanyFormData) => void
}

export function CompanyForm({ onSubmit }: CompanyFormProps) {
  const { register, handleSubmit } = useForm<CompanyFormData>()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Input
        {...register("fullName", { required: true })}
        placeholder="Nome completo"
        className="bg-petroleum-blue border-ice-blue/30 text-polar-white"
      />
      <Input
        {...register("role", { required: true })}
        placeholder="Seu cargo"
        className="bg-petroleum-blue border-ice-blue/30 text-polar-white"
      />
      <Input
        {...register("companyEmail", { required: true })}
        type="email"
        placeholder="Email corporativo"
        className="bg-petroleum-blue border-ice-blue/30 text-polar-white"
      />
      <Input
        {...register("companyName", { required: true })}
        placeholder="Nome da empresa"
        className="bg-petroleum-blue border-ice-blue/30 text-polar-white"
      />
      <Button type="submit" className="w-full bg-ice-blue text-petroleum-blue font-bold hover:bg-polar-white">
        Agendar Demo com IA
      </Button>
    </form>
  )
}
