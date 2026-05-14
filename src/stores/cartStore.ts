import { defineStore } from 'pinia'

export type CartProduct = {
  id: string | number
  name: string
  price: number
  stock: number
  images?: string[]
  image_url?: string
  image?: string
  category?: any
}

export type CartItem = {
  product: CartProduct
  quantity: number
  selected: boolean
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart_items') || '[]') as CartItem[],
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((total, item) => total + item.quantity, 0),

    selectedItems: (state) =>
      state.items.filter((item) => item.selected),

    totalPrice: (state) =>
      state.items
        .filter((item) => item.selected)
        .reduce((total, item) => total + item.product.price * item.quantity, 0),
  },

  actions: {
    saveCart() {
      localStorage.setItem('cart_items', JSON.stringify(this.items))
    },

    addToCart(product: CartProduct, quantity = 1) {
      if (quantity <= 0) {
        return { success: false, message: 'Jumlah produk harus lebih dari 0' }
      }

      if (product.stock <= 0) {
        return { success: false, message: 'Stok produk habis' }
      }

      const existingItem = this.items.find(
        (item) => String(item.product.id) === String(product.id),
      )

      if (existingItem) {
        const newQty = existingItem.quantity + quantity

        if (newQty > product.stock) {
          return { success: false, message: 'Jumlah melebihi stok produk' }
        }

        existingItem.quantity = newQty
        existingItem.selected = true
      } else {
        if (quantity > product.stock) {
          return { success: false, message: 'Jumlah melebihi stok produk' }
        }

        this.items.push({
          product,
          quantity,
          selected: true,
        })
      }

      this.saveCart()

      return { success: true, message: 'Produk berhasil ditambahkan ke keranjang' }
    },

    increaseQty(productId: string | number) {
      const item = this.items.find(
        (item) => String(item.product.id) === String(productId),
      )

      if (!item) return

      if (item.quantity >= item.product.stock) return

      item.quantity++
      this.saveCart()
    },

    decreaseQty(productId: string | number) {
      const item = this.items.find(
        (item) => String(item.product.id) === String(productId),
      )

      if (!item) return

      if (item.quantity > 1) {
        item.quantity--
      }

      this.saveCart()
    },

    removeItem(productId: string | number) {
      this.items = this.items.filter(
        (item) => String(item.product.id) !== String(productId),
      )

      this.saveCart()
    },

    toggleSelected(productId: string | number) {
      const item = this.items.find(
        (item) => String(item.product.id) === String(productId),
      )

      if (!item) return

      item.selected = !item.selected
      this.saveCart()
    },

    clearSelectedItems() {
      this.items = this.items.filter((item) => !item.selected)
      this.saveCart()
    },

    clearCart() {
      this.items = []
      this.saveCart()
    },
  },
})
