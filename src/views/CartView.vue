<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()

const formatCurrency = (value: number | string) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

const getImage = (item: any) => {
  const product = item.product

  if (product.images?.length) return product.images[0]
  if (product.image_url) return product.image_url
  if (product.image) return product.image

  return '/images/fallback.png'
}

const getCategoryName = (item: any) => {
  const category = item.product.category

  if (typeof category === 'object' && category?.name) return category.name
  if (typeof category === 'string') return category

  return 'Tanpa Kategori'
}

const checkout = () => {
  if (cartStore.selectedItems.length === 0) {
    console.warn('Pilih produk yang ingin dipesan')
    return
  }

  console.info('Pesanan diproses. Backend checkout dibuat nanti.')
}

const goToCheckout = () => {
  if (cartStore.selectedItems.length === 0) {
    alert('Pilih produk terlebih dahulu.')
    return
  }

  router.push('/checkout')
}

</script>

<template>
  <main class="min-h-screen bg-white pt-16">
    <!-- HEADER -->
    <header class="sticky top-0 z-20 border-b bg-white shadow-sm">
      <div class="mx-auto flex h-20 px-28 items-center gap-10 px-6">
        <button
          type="button"
          @click="router.back()"
          class="text-4xl text-[#0F2A1D]"
        >
          ←
        </button>

        <h1 class="text-2xl font-extrabold text-black">
          Keranjang Saya
        </h1>
      </div>
    </header>

    <!-- EMPTY -->
    <section
      v-if="cartStore.items.length === 0"
      class="mx-auto flex min-h-[400px]  flex-col items-center justify-center px-8 text-center"
     >
      <p class="mb-4 text-lg font-semibold text-black">
        Keranjang masih kosong
      </p>

      <RouterLink
        to="/products"
        class="rounded-full bg-[#0F2A1D] px-8 py-3 text-sm font-bold text-white"
      >
        Belanja Sekarang
      </RouterLink>
    </section>

    <!-- CART LIST -->
    <section v-else class="mx-auto px-32  py-10 pb-28">
      <div
        v-for="item in cartStore.items"
        :key="item.product.id"
        class="grid grid-cols-[40px_140px_1fr_160px] items-center gap-6 border-b border-[#AEC3B0] py-6"
      >
        <!-- CHECKBOX -->
        <input
          type="checkbox"
          :checked="item.selected"
          @change="cartStore.toggleSelected(item.product.id)"
          class="h-4 w-4 accent-[#0F2A1D]"
        />

        <!-- IMAGE -->
        <div class="relative flex h-32 w-32 items-center justify-center rounded border bg-white">
          <img
            :src="getImage(item)"
            :alt="item.product.name"
            class="h-full w-full object-contain p-3"
          />
        </div>

        <!-- INFO -->
        <div>
          <p class="mb-1 text-xs text-[#375534]">
            {{ getCategoryName(item) }}
          </p>

          <h2 class="mb-2 text-xl font-extrabold text-black">
            {{ item.product.name }}
          </h2>

          <p class="mb-3 pb-2 text-sm font-bold text-black">
            {{ formatCurrency(item.product.price) }}
          </p>

          <div
            class="flex h-7 w-24 items-center justify-between rounded-full bg-zinc-200 px-4 text-xs text-black"
          >
            <button
              type="button"
              @click="cartStore.decreaseQty(item.product.id)"
            >
              −
            </button>

            <span>{{ item.quantity }}</span>

            <button
              type="button"
              @click="cartStore.increaseQty(item.product.id)"
            >
              +
            </button>
          </div>
        </div>

        <!-- PRICE + DELETE -->
        <div class="flex flex-col items-center gap-8">
          <p class="text-lg font-extrabold text-black">
            {{ formatCurrency(item.product.price * item.quantity) }}
          </p>

          <button
            type="button"
            @click="cartStore.removeItem(item.product.id)"
            class="h-7 w-24 rounded-full bg-[#0F2A1D] text-xs text-white"
          >
            Hapus
          </button>
        </div>
      </div>

      <!-- CHECKOUT -->
      <div class="mt-8  py-4 flex items-center justify-between sticky bottom-0 bg-white z-40 border-t border-[#AEC3B0] shadow-sm">
        <div>
          <p class="text-sm text-zinc-600">
            Total produk dipilih:
            <span class="font-bold text-black">
              {{ cartStore.selectedItems.length }}
            </span>
          </p>

          <p class="text-xl font-extraboldbold text-black">
            {{ formatCurrency(cartStore.totalPrice) }}
          </p>
        </div>

       <button
          type="button"
          @click="goToCheckout"
          class="rounded-lg bg-[#0F2A1D] px-10 py-4 text-sm font-bold text-white disabled:opacity-50"
          :disabled="cartStore.selectedItems.length === 0"
          >
          Pesan Sekarang ({{ cartStore.selectedItems.length }})
        </button>
      </div>
  </section>
  </main>
</template>
