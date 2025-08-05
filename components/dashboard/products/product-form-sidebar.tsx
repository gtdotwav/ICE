"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createProduct } from "@/lib/actions/product-actions"
import { PRODUCT_CATEGORIES } from "@/lib/constants"
import { productSchema, type ProductFormData } from "@/lib/schemas/product-schema"
import type { Product } from "@/lib/types"
import { ImageUpload } from "./image-upload"
import * as React from "react"

interface ProductFormSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

export function ProductFormSidebar({ open, onOpenChange, product }: ProductFormSidebarProps) {
  const { toast } = useToast()
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price: 0,
      promoPrice: undefined,
      status: "draft",
    },
  })

  const { isSubmitting } = form.formState

  React.useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        category: product.category,
        description: product.description || "",
        price: product.price,
        promoPrice: product.promoPrice || undefined,
        status: product.status,
      })
    } else {
      form.reset({
        name: "",
        category: "",
        description: "",
        price: 0,
        promoPrice: undefined,
        status: "draft",
      })
    }
  }, [product, form])

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    const result = await createProduct(data)
    if (result.success) {
      toast({
        title: "Sucesso!",
        description: result.message,
      })
      onOpenChange(false)
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro. Por favor, verifique os campos.",
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{product ? "Editar Produto" : "Novo Produto"}</SheetTitle>
          <SheetDescription>
            {product
              ? "Atualize as informações do seu produto."
              : "Preencha os detalhes para cadastrar um novo produto."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto">
            <Accordion type="multiple" defaultValue={["basic", "pricing"]} className="w-full">
              <AccordionItem value="basic">
                <AccordionTrigger>Informações Básicas</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Produto</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Curso de Marketing Digital" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PRODUCT_CATEGORIES.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição Curta</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Uma breve descrição para os cards de produto (até 200 caracteres)."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="pricing">
                <AccordionTrigger>Precificação</AccordionTrigger>
                <AccordionContent className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (BRL)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 297.00"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="promoPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço Promocional</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Opcional"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="media">
                <AccordionTrigger>Mídia</AccordionTrigger>
                <AccordionContent>
                  <ImageUpload width={450} height={200} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </form>
        </Form>
        <SheetFooter className="mt-auto pt-4">
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </SheetClose>
          <Button type="submit" disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? "Salvar Alterações" : "Criar Produto"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
