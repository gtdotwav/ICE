"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type FreelancerFormData = {
  name: string
  email: string
  whatsapp: string
}

type FreelancerFormProps = {
  onSubmit: (data: FreelancerFormData) => void
}

export function FreelancerForm({ onSubmit }: FreelancerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FreelancerFormData>()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Input
        {...register("name", { required: true })}
        placeholder="Nome"
        className="bg-petroleum-blue border-ice-blue/30 text-polar-white"
      />
      <Input
        {...register("email", { required: true })}
        type="email"
        placeholder="Email"
        className="bg-petroleum-blue border-ice-blue/30 text-polar-white"
      />
      <Input
        {...register("whatsapp")}
        placeholder="WhatsApp (Opcional)"
        className="bg-petroleum-blue border-ice-blue/30 text-polar-white"
      />
      <Button type="submit" className="w-full bg-ice-blue text-petroleum-blue font-bold hover:bg-polar-white">
        Liberar meu Acesso
      </Button>
    </form>
  )
}
