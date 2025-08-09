"use client"

import { Button } from "@/components/ui/button"

export function ProductsHeader({ onNewProduct }: { onNewProduct: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div />
      <Button onClick={onNewProduct}>Novo Produto</Button>
    </div>
  )
}
