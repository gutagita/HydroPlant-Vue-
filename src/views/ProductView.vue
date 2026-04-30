<script setup lang="ts">
import { onMounted } from "vue"
import { useProductStore } from "@/stores/productStore"
import ProductCard from "@/components/products/ProductCard.vue";
import NavBar from "@/components/layouts/NavBar.vue";

const productStore = useProductStore()

onMounted(() => {
  productStore.fetchProducts()
})
</script>

<template>
  <NavBar />

  <div class="p-8 pt-24">
    <div v-if="productStore.loading" class="text-center">
      Loading...
    </div>

    <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <ProductCard
        v-for="product in productStore.products"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>
