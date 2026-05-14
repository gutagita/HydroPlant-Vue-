<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import { useProductStore } from "@/stores/productStore"
import ProductCard from "@/components/products/ProductCard.vue";
import ProductCarousel from "@/components/products/ProductCarousel.vue";
import Footer from "@/components/layouts/Footer.vue";

const productStore = useProductStore()
const showScrollTop = ref(false)

// Ambil data produk saat halaman pertama kali dibuka.
onMounted(() => {
  productStore.fetchProducts()
  window.addEventListener("scroll", handleScroll)
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 200
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}
</script>

<template>
  <div class="min-h-screen bg-white background p-16 px-20 pt-32 ">
    <div v-if="productStore.loading" class="text-center">
      Loading...
    </div>

    <div
      v-else-if="productStore.error"
      class="rounded-lg bg-red-100 p-4 text-center text-red-700"
    >
      {{ productStore.error }}
    </div>

    <div v-else>
      <ProductCarousel />

      <!-- Tombol filter kategori produk -->
      <div class="mt-8 flex flex-wrap gap-3 pb-12">
        <button
          v-for="category in productStore.categories"
          :key="category"
          type="button"
          class="rounded-md px-6 py-4 text-md font-extrabold transition"
          :class="
            category === productStore.selectedCategory
              ? 'bg-primary text-white'
              : 'bg-background text-zinc-900 hover:bg-accent hover:text-white'
          "
          @click="productStore.setCategory(category)"
        >
          {{ category }}
        </button>
      </div>

      <!-- Hasil produk setelah filter kategori diterapkan -->
      <div
        v-if="productStore.filteredProducts.length === 0"
        class="mt-10 rounded-lg bg-zinc-100 p-6 text-center text-zinc-600"
      >
        Tidak ada produk pada kategori ini.
      </div>

      <div
        v-else
         class="mt-10  grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <!-- Daftar produk hasil filter kategori. -->
        <ProductCard
          v-for="product in productStore.filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Navigasi pagination agar semua produk bisa diakses per halaman -->
      <div
        v-if="productStore.totalPages > 1"
         class="mt-16 mb-16 flex flex-wrap items-center justify-between gap-4 rounded-md  px-6 py-8"
      >
        <button
          type="button"
          class="text-solid-black text-sm font-extrabold uppercase no-underline transition hover:text-solid-black hover:underline disabled:cursor-not-allowed disabled:text-zinc-400 disabled:no-underline"
          :disabled="!productStore.canGoPrev || productStore.loading"
          @click="productStore.goToPrevPage()"
        >
          Sebelumnya
        </button>

        <div class="flex items-center gap-3 text-sm font-bold text-zinc-900 ">
          <span>Halaman</span>
          <span
            class="inline-flex min-h-12 min-w-12 items-center justify-center border-2 border-zinc-900 bg-white px-4 py-2"
          >
            {{ productStore.currentPage }}
          </span>
          <span>dari {{ productStore.totalPages }}</span>
        </div>

        <button
          type="button"
          class="text-solid-black text-sm font-extrabold uppercase no-underline transition hover:text-solid-black hover:underline disabled:cursor-not-allowed disabled:text-zinc-400 disabled:no-underline"
          :disabled="!productStore.canGoNext || productStore.loading"
          @click="productStore.goToNextPage()"
        >
          Selanjutnya
        </button>
      </div>
    </div>

    <!-- Tombol scroll ke atas -->
    <button
      v-show="showScrollTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-white shadow-lg transition hover:bg-accent"
    >
      ↑
    </button>
  </div>

  <!-- Footer diletakkan di luar grid agar tampil penuh di bagian bawah halaman. -->
  <Footer />
</template>
