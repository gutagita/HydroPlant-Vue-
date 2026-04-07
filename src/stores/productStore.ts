import { defineStore } from "pinia"
import { getProducts } from "@/services/productService"
import type { Product } from "@/types/product"

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: ""
  }),

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = ""

      try {
        this.products = await getProducts()
      } catch {
        this.products = []
        this.error = "Gagal mengambil data produk dari API Laravel."
      } finally {
        this.loading = false
      }
    }
  }
})
