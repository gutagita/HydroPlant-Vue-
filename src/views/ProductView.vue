<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { api } from '@/services/api'
import NavBar from '@/components/layouts/NavBar.vue'

const productStore = useProductStore()

const fallbackImage =
  'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=800&q=60'

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

const getImageUrl = (image?: string | null) => {
  if (!image) return fallbackImage

  const raw = image.trim()
  if (!raw) return fallbackImage
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw

  const normalized = raw.replace(/^\/+/, '')
  const baseUrl = api.defaults.baseURL || 'http://localhost:8000/api'
  const origin = baseUrl.replace(/\/api\/?$/, '')

  // Laravel often stores file paths as "products/foo.jpg" or "public/products/foo.jpg".
  // Normalize these into public URLs under "/storage".
  let publicPath = normalized
  if (normalized.startsWith('public/')) {
    publicPath = `storage/${normalized.slice('public/'.length)}`
  } else if (!normalized.startsWith('storage/') && !normalized.startsWith('uploads/')) {
    publicPath = `storage/${normalized}`
  }

  return `${origin}/${publicPath}`
}

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target.src === fallbackImage) return
  target.src = fallbackImage
}

onMounted(async() => {
  await productStore.fetchProducts()
  console.log(productStore.products) //
})
</script>

<template>
  <NavBar />

  <section class="w-full px-4 pb-6 pt-24 sm:px-6 lg:px-8">
    <div class="w-full">
      <!-- HEADER -->
      <div class="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Produk Unggulan
          </h1>
          <p class="mt-1 text-sm text-slate-700">
            Pilih produk terbaik untuk kebutuhan rumah dan proyek Anda.
          </p>
        </div>
      </div>

      <!-- LOADING -->
      <div
        v-if="productStore.loading"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <div
          v-for="item in 8"
          :key="item"
          class="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div class="h-44 bg-slate-200"></div>
          <div class="space-y-3 p-4">
            <div class="h-4 w-3/4 rounded bg-slate-200"></div>
            <div class="h-3 w-full rounded bg-slate-100"></div>
            <div class="h-3 w-1/2 rounded bg-slate-100"></div>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div
        v-else-if="!productStore.products.length"
        class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-700"
      >
        Belum ada produk tersedia.
      </div>

      <div
        v-if="productStore.error"
        class="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-800"
      >
        {{ productStore.error }}
      </div>

      <!-- PRODUCT LIST -->
      <ul
        v-else
        class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <li
          v-for="p in productStore.products"
          :key="p.id"
          class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <!-- IMAGE -->
          <div class="relative h-44 overflow-hidden bg-slate-100">
            <img
              :src="getImageUrl(p.image)"
              :alt="p.name"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
              @error="onImageError"
            />

            <!-- STOCK BADGE -->
            <span
              class="absolute right-3 top-3 rounded-full px-2 py-1 text-xs font-semibold"
              :class="
                p.stock > 0
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
              "
            >
              {{ p.stock > 0 ? `Stok ${p.stock}` : 'Habis' }}
            </span>
          </div>

          <!-- CONTENT -->
          <div class="p-4">
            <h2 class="line-clamp-1 text-base font-bold text-slate-950">
              {{ p.name }}
            </h2>






            <p class="mt-1 min-h-10 text-sm leading-6 text-slate-700">
              {{ p.description || 'Deskripsi produk belum tersedia.' }}
            </p>

            <div class="mt-4 flex items-center justify-between">
              <p class="text-lg font-extrabold text-emerald-900">
                {{ formatCurrency(p.price) }}
              </p>

              <button
                type="button"
                class="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
