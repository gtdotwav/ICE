"use client"

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function ProductFormSidebar({
  open,
  onOpenChange,
  product,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  product: any | null
}) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState<number | string>("")
  const [status, setStatus] = useState<"active" | "draft" | "archived">("draft")

  useEffect(() => {
    setName(product?.name || "")
    setPrice(product?.price ?? "")
    setStatus(product?.status || "draft")
  }, [product])

  const save = async () => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price), status }),
    })
    if (res.ok) onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{product ? "Editar Produto" : "Novo Produto"}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(["draft", "active", "archived"] as const).map((s) => (
              <Button key={s} variant={status === s ? "default" : "outline"} onClick={() => setStatus(s)}>
                {s}
              </Button>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>Salvar</Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
