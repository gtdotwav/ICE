"use client"

import { Pencil, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
}

export function ProductCard({ product, onEdit }: ProductCardProps) {
  // Fallback para o caso do objeto `product` ser nulo ou indefinido
  if (!product) {
    return (
      <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed bg-white/90 p-4 shadow transition dark:bg-background/70">
        <p className="text-sm text-muted-foreground">Produto indisponível</p>
      </div>
    )
  }

  const {
    name = "Produto sem nome",
    category = "Sem categoria",
    price = 0,
    imageUrl = "/placeholder.svg",
    status = "draft",
  } = product

  const formatPrice = (value: number) => {
    if (typeof value !== "number") {
      return "R$ 0,00"
    }
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl bg-white/90 shadow
                 transition hover:shadow-lg dark:bg-background/70"
    >
      <img
        src={imageUrl || "/placeholder.svg"}
        alt={name}
        onError={(e) => {
          const target = e.currentTarget
          if (target.dataset.errored !== "true") {
            target.dataset.errored = "true"
            target.src = "/fallback-mechanism.png"
          }
        }}
        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-semibold">{name}</h3>
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status === "active" ? "Ativo" : "Rascunho"}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">{category}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold">{formatPrice(price)}</span>

          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => onEdit(product)} aria-label="Editar produto">
              <Pencil className="size-4" />
            </Button>

            <Button size="icon" variant="outline" aria-label="Adicionar ao carrinho">
              <ShoppingCart className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
