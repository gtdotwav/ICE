"use client"

import useSWR from "swr"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const fetcher = (u: string) => fetch(u).then((r) => r.json())

export function ProductsGrid({ onEditProduct }: { onEditProduct: (p: any) => void }) {
  const { data } = useSWR("/api/products", fetcher)
  const items = data?.items || []
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((p: any) => (
        <Card key={p.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {p.name}
              <span className="text-xs capitalize text-muted-foreground">{p.status}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative w-full aspect-video overflow-hidden rounded-md border">
              <Image
                src={p.imageUrl || "/placeholder.svg?height=240&width=320&query=product-image"}
                alt={p.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="font-semibold">R$ {p.price}</div>
              <Button size="sm" onClick={() => onEditProduct(p)}>
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
