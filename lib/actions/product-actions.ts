"use server"

import { revalidatePath } from "next/cache"
import { productSchema, type ProductFormData } from "../schemas/product-schema"

export async function createProduct(formData: ProductFormData) {
  const result = productSchema.safeParse(formData)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  // Simula a criação de um produto no banco de dados
  console.log("Creating product:", result.data)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  revalidatePath("/dashboard/products")

  return {
    success: true,
    message: "Produto criado com sucesso!",
  }
}
