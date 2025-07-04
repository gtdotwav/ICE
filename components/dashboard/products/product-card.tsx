"use client"

import { Archive, Copy, MoreVertical, Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Product, ProductStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
}

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  active: { label: "Ativo", className: "bg-status-active hover:bg-status-active" },
  draft: { label: "Rascunho", className: "bg-status-draft hover:bg-status-draft" },
  archived: { label: "Arquivado", className: "bg-status-archived hover:bg-status-archived text-white" },
}

export function ProductCard({ product, onEdit }: ProductCardProps) {
  const { name, price, status, imageUrl } = product
  const currentStatus = statusConfig[status]

  return (
    <Card>
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={imageUrl || "/placeholder.svg?width=400&height=225&query=Product"}
            alt={name}
            width={400}
            height={225}
            className="aspect-video w-full rounded-t-lg object-cover"
          />
          <Badge className={`absolute right-2 top-2 ${currentStatus.className}`}>{currentStatus.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold leading-tight">{name}</CardTitle>
        <CardDescription className="mt-2 text-2xl font-bold text-foreground">
          R$ {price.toFixed(2).replace(".", ",")}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
          <Pencil className="mr-2 size-4" />
          Editar
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="size-4" />
              <span className="sr-only">Mais ações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Copy className="mr-2 size-4" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="mr-2 size-4" />
              Arquivar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
