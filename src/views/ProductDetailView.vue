<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import Footer from '@/components/layouts/Footer.vue'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()

const qty = ref(0)
const currentImage = ref(0)

// 🔥 TOAST
const showToast = ref(false)
const toastMessage = ref('')

const showToastMessage = (message: string) => {
  toastMessage.value = message
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// FETCH DATA
onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.fetchProducts()
  }
})

// PRODUCT
const product = computed(() =>
  productStore.findProductById(route.params.id as string),
)

// IMAGE
const images = computed(() =>
  product.value?.images?.length
    ? product.value.images
    : product.value?.image
      ? [product.value.image]
      : [],
)

// CATEGORY
const categoryName = computed(() => {
  const category = product.value?.category

  if (typeof category === 'object' && category?.name) return category.name
  if (typeof category === 'string') return category

  return 'Tanpa Kategori'
})

// FORMAT
const formatCurrency = (value: number | string) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

// IMAGE NAV
const prevImage = () => {
  if (images.value.length <= 1) return
  currentImage.value =
    currentImage.value === 0 ? images.value.length - 1 : currentImage.value - 1
}

const nextImage = () => {
  if (images.value.length <= 1) return
  currentImage.value =
    currentImage.value === images.value.length - 1 ? 0 : currentImage.value + 1
}

// QTY
const increaseQty = () => {
  if (!product.value) return

  if (qty.value < product.value.stock) {
    qty.value++
  } else {
    showToastMessage('Jumlah melebihi stok')
  }
}

const decreaseQty = () => {
  if (qty.value > 0) qty.value--
}

// 🔥 ADD TO CART (FINAL FIX)
const handleAddToCart = () => {
  if (!product.value) return

  const result = cartStore.addToCart(product.value, qty.value)

  showToastMessage(result.message)
}
</script>

<template>
  <main class="relative min-h-screen bg-white px-20 py-24 pt-20">
    <div class="mx-auto w-full max-w-[1400px] px-10">
      <div v-if="productStore.loading" class="text-center">
        Loading...
      </div>

      <div v-else-if="!product" class="text-center">
        <p class="mb-4 text-zinc-600">Produk tidak ditemukan.</p>

        <RouterLink to="/products" class="font-bold text-[#0F2A1D]">
          Kembali ke produk
        </RouterLink>
      </div>

      <div v-else>
        <section class="grid grid-cols-1 items-center gap-12 pb-12 md:grid-cols-2">
          <!-- IMAGE -->
          <div class="relative flex h-[460px] items-center justify-center rounded-md border bg-white shadow">
            <button
              v-if="images.length > 1"
              type="button"
              @click="prevImage"
              class="absolute -left-5 top-1/2 -translate-y-1/2 text-7xl font-bold text-[#375534]"
            >
              ‹
            </button>

            <img
              :src="images[currentImage]"
              :alt="product.name"
              class="h-full w-full object-contain p-8"
            />

            <button
              v-if="images.length > 1"
              type="button"
              @click="nextImage"
              class="absolute -right-5 top-1/2 -translate-y-1/2 text-7xl font-bold text-[#375534]"
            >
              ›
            </button>
          </div>

          <!-- DETAIL -->
          <div>
            <p class="mb-3 text-base text-secondary">
              {{ categoryName }}
            </p>

            <h1 class="mb-4 text-2xl font-extrabold text-black">
              {{ product.name }}
            </h1>

            <h2 class="mb-4 text-2xl font-extrabold text-secondary">
              {{ formatCurrency(product.price) }}
            </h2>

            <div class="pt-4">
              <!-- QTY -->
              <div class="mb-4  flex h-8 w-32 items-center justify-between rounded-full bg-zinc-200 px-5 py-4 text-black">
                <button @click="decreaseQty">−</button>
                <span>{{ qty }}</span>
                <button @click="increaseQty">+</button>
              </div>

              <div class="flex flex-wrap items-center  py-4 gap-4 sm:flex-nowrap">
                <!-- ADD CART -->
                <button
                  @click="handleAddToCart"
                  :disabled="product.stock <= 0"
                  class="inline-flex h-8 w-48 items-center justify-center rounded-full border-2 border-[#0F2A1D] bg-[#E3EED4] text-xs text-black disabled:opacity-50"
                >
                  Masukan Keranjang
                </button>

                <!-- BUY -->
                <button class="inline-flex h-8 w-48 items-center justify-center rounded-full bg-[#0F2A1D] text-xs text-white">
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- DESCRIPTION -->
        <section class="mt-12 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h3 class="mb-3 text-lg font-bold text-black">
            Deskripsi Produk
          </h3>

          <p class="text-base leading-relaxed text-zinc-700">
            {{ product.description }}
          </p>
        </section>
      </div>
    </div>

    <!-- 🔥 TOAST -->
    <div
      v-if="showToast"
      class="fixed bottom-6 right-6 z-50 rounded-xl bg-[#0F2A1D] px-6 py-3 text-sm font-semibold text-white shadow-lg"
    >
      {{ toastMessage }}
    </div>
  </main>

  <Footer />
</template>
