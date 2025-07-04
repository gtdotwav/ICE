"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProductsToolbar() {
  return (
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <div className="relative w-full md:flex-grow">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome..." className="w-full pl-10" />
      </div>
      <div className="flex w-full gap-4 md:w-auto">
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="archived">Arquivado</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais Recentes</SelectItem>
            <SelectItem value="oldest">Mais Antigos</SelectItem>
            <SelectItem value="price-asc">Preço (Menor)</SelectItem>
            <SelectItem value="price-desc">Preço (Maior)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
