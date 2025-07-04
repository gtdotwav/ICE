import { z } from "zod"

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter no mínimo 3 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),
  category: z.string().min(1, "A categoria é obrigatória."),
  description: z.string().max(200, "A descrição curta não pode exceder 200 caracteres.").optional(),
  price: z.coerce.number().min(0, "O preço não pode ser negativo."),
  promoPrice: z.coerce.number().min(0, "O preço promocional não pode ser negativo.").optional(),
  status: z.enum(["active", "draft", "archived"]).default("draft"),
  // Campos para upload de imagem seriam adicionados aqui
})

export type ProductFormData = z.infer<typeof productSchema>
