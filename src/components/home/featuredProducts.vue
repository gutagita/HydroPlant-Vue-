<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import ProductCard from '@/components/products/ProductCard.vue'

const productStore = useProductStore()

onMounted(() => {
  productStore.fetchProducts()
})

const featuredProducts = computed(() => productStore.featuredProducts)
</script>

<template>
  <section class="bg-background py-16">
    <div class="max-w-[1400px] mx-auto px-6">

      <h2 class="text-center text-3xl font-bold text-[#0F2A1D] pb-8">
        Produk <span class="text-[#6B9071]">Unggulan Kami</span>
      </h2>

      <div
        v-if="featuredProducts.length"
        class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-16"
      >
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <div class="flex justify-center mt-10 pt-12">
        <RouterLink
          to="/products"
          class="bg-[#375534] text-white px-8 py-3 rounded-lg shadow hover:bg-[#0F2A1D]"
        >
          Lihat Semua Produk
        </RouterLink>
      </div>

    </div>
  </section>

</template>
