<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NavBar from '@/components/layouts/NavBar.vue'
import { ProductAPI } from '@/services/api'
import type { Product } from '@/types/product'
import axios from 'axios'

const products = ref<Product[]>([])
const loading = ref(false)
const errorMessage = ref('')

const loadProducts = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await ProductAPI.getAll()
    products.value = Array.isArray(response.data) ? response.data : response.data.data
  } catch (error) {
    console.error(error)
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 'Tidak ada status'
      const url = error.config?.url ?? 'URL tidak diketahui'
      errorMessage.value = `Gagal mengambil data produk dari API Laravel. Status: ${status}, Endpoint: ${url}`
    } else {
      errorMessage.value = 'Gagal mengambil data produk dari API Laravel.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadProducts)
</script>

<template>
  <NavBar/>

  <main class="container mx-auto px-4 pt-24 pb-8">
    <h1 class="text-2xl font-bold text-primary mb-4">Product List</h1>

    <p v-if="loading" class="text-gray-600">Loading produk...</p>
    <p v-else-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>

  
  </main>
</template>
