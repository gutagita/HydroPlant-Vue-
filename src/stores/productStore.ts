import { defineStore } from "pinia"
import { getProducts } from "@/services/productService"
import type { Product } from "@/types/product"


const getCategoryLabel = (product: Product) => {
  if (product.category_name?.trim()) return product.category_name.trim()

  if (typeof product.category === "string" && product.category.trim()) {
    return product.category.trim()
  }

  if (
    typeof product.category === "object" &&
    product.category?.name?.trim()
  ) {
    return product.category.name.trim()
  }

  return "Tanpa Kategori"
}

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: "",
    currentPage: 1,
    totalPages: 1,
    perPage: 20,
    totalProducts: 0,
    // State untuk filter kategori produk
    selectedCategory: "All",
  }),

  getters: {
    // Menyusun daftar kategori untuk tombol filter
    categories: (state): string[] => {
      const unique = new Set<string>()

      state.products.forEach((product) => {
        unique.add(getCategoryLabel(product))
      })

      return ["All", ...Array.from(unique)]
    },

    // Menghasilkan produk sesuai kategori filter aktif
    filteredProducts: (state): Product[] => {
      if (state.selectedCategory === "All") return state.products

      return state.products.filter(
        (product) => getCategoryLabel(product) === state.selectedCategory,
      )
    },
    //produk unggulan
     featuredProducts: (state): Product[] => {
      return state.products
      .filter((product) => product.is_featured)
      .slice(0, 8)
      },

      findProductById: (state) => {
        return (id: string | number) =>
          state.products.find((product) => String(product.id) === String(id))
      },

    canGoPrev: (state): boolean => state.currentPage > 1,
    canGoNext: (state): boolean => state.currentPage < state.totalPages,
  },

  actions: {
    // Mengubah kategori aktif pada filter
    setCategory(category: string) {
      this.selectedCategory = category
    },

    async fetchProducts(page?: number) {
      const targetPage = page ?? this.currentPage

      this.loading = true
      this.error = ""

      try {
        // debug: lihat request dan hasil dari service
        // eslint-disable-next-line no-console
        console.debug('[productStore] fetching products', { page: targetPage, perPage: this.perPage })
        const result = await getProducts({ page: targetPage, perPage: this.perPage })
        // eslint-disable-next-line no-console
        console.debug('[productStore] getProducts result', result)
        this.products = result.items
        this.currentPage = result.pagination.currentPage
        this.totalPages = result.pagination.lastPage
        this.perPage = result.pagination.perPage
        this.totalProducts = result.pagination.total
      } catch {
        // eslint-disable-next-line no-console
        console.error('[productStore] failed to fetch products')
        this.products = []
        this.currentPage = 1
        this.totalPages = 1
        this.totalProducts = 0
        this.error = "Gagal mengambil data produk dari API Laravel."
      } finally {
        this.loading = false
      }
    },

    async goToPage(page: number) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) return
      await this.fetchProducts(page)
    },

    async goToPrevPage() {
      if (!this.canGoPrev) return
      await this.fetchProducts(this.currentPage - 1)
    },

    async goToNextPage() {
      if (!this.canGoNext) return
      await this.fetchProducts(this.currentPage + 1)
    },
  }
})
