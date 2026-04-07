import { api } from "./api"
import type { Product } from "@/types/product"

export const getProducts = async () => {
  const res = await api.get<Product[] | { data: Product[] }>("/products")
  return Array.isArray(res.data) ? res.data : res.data.data
}
