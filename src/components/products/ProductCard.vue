<script setup lang="ts">
import { api } from '@/services/api'
import type { Product } from '@/types/product'

const props = defineProps<{
  product: Product
}>()

const fallbackImage =
  'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=800&q=60'

const formatCurrency = (value: number | string | null | undefined) => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return 'Rp0'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

const getImageUrl = (image?: string | null) => {
  if (!image) return fallbackImage

  const raw = image.trim()
  if (!raw) return fallbackImage
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw

  const normalized = raw.replace(/^\/+/, '')
  const baseUrl = api.defaults.baseURL || 'http://localhost:8000/api'
  const origin = baseUrl.replace(/\/api\/?$/, '')

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

const getCategoryLabel = (product: Product) => {
  const withCategory = product as Product & {
    category_name?: string
    category?: { name?: string | null } | string | null
  }

  if (withCategory.category_name?.trim()) return withCategory.category_name

  if (typeof withCategory.category === 'string' && withCategory.category.trim()) {
    return withCategory.category
  }

  if (
    typeof withCategory.category === 'object' &&
    withCategory.category?.name?.trim()
  ) {
    return withCategory.category.name
  }

  return 'Tanpa Kategori'
}
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-white-300 bg-zinc-100 p-2.5 shadow-sm transition-colors duration-200 hover:border-emerald-600">
    <div class="overflow-hidden rounded-xl bg-white">
      <img
        :src="getImageUrl((props.product.image as unknown as string) || '')"
        :alt="props.product.name"
        class="h-44 w-full object-cover"
        loading="lazy"
        @error="onImageError"
      />

      <div class="space-y-1.5 border-t border-zinc-300 p-3">
        <p class="text-xs text-zinc-500">
        {{ getCategoryLabel(props.product) }}
        </p>

        <h2 class="line-clamp-1 text-xl font-extrabold leading-tight text-zinc-900 sm:text-xl">
          {{ props.product.name }}
        </h2>

        <p class="text-xs text-zinc-700">
          {{ props.product.stock > 0 ? `${props.product.stock} buah` : 'Habis' }}
        </p>

        <div class="mt-2 grid gap-3">
          <div class="flex items-center justify-between gap-2">
            <p class="text-lg font-semibold text-zinc-900 sm:text-lg">
              {{ formatCurrency(props.product.price) }}
            </p>

            <button
              type="button"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lime-100 p-0 leading-none text-lime-900 transition hover:bg-lime-200"
              aria-label="Tambah ke keranjang"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-4.5 w-4.5"
              >
                <path d="M2.25 3a.75.75 0 000 1.5h1.386c.17 0 .317.114.36.278l1.547 5.806a2.25 2.25 0 002.174 1.672h8.405a2.25 2.25 0 002.174-1.672l1.2-4.5A.75.75 0 0018.77 5H6.235l-.236-.886A1.875 1.875 0 004.196 3H2.25z" />
                <path d="M7.5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM18 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            class="w-full rounded-lg bg-emerald-950 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
            :disabled="props.product.stock === 0"
          >
            Beli
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
