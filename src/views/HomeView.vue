<script setup lang="ts">
import HomeAbout from '@/components/home/homeAbout.vue'
import Footer from '@/components/layouts/Footer.vue'
import featuredProducts from '@/components/home/featuredProducts.vue'

const categories = [
  {
    title: 'Benih dan Bibit Tanaman Budidaya',
    image:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Peralatan Hidroponik',
    image:
      'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Paket Usaha Hidroponik',
    image:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=500&q=80',
  },
]
</script>

<template>
  <main class="min-h-screen bg-accent pt-8  mx-20 text-[#e7efdc]">
    <!-- Hero -->
    <section
      class="relative mx-auto flex  min-h-[68svh] w-full max-w-[1400px] items-center bg-cover bg-center bg-no-repeat px-6 pb-8 pt-8 md:min-h-[72svh] md:px-10 lg:min-h-[76svh] lg:px-16"
      style="background-image: linear-gradient(rgba(10, 48, 35, 0.72), rgba(10, 48, 35, 0.72)), url('/images/bg.webp');"
    >

      <!-- teks -->
      <div class="max-w-[620px] space-y-8">
        <h1 class="font-heading text-3xl font-extrabold leading-[1.35] md:text-2xl lg:text-2xl">
          Menumbuhkan Alam,<br />
          Mendekatkan Kehidupan
        </h1>

        <p class="pb-4 pt-4 text-base leading-relaxed text-[#b9c6b2] md:text-lg">
          Kami menyediakan segala yang Anda butuhkan untuk memulai berkebun. Hijaukan
          lingkungan, dekatkan diri dengan kehidupan yang lebih alami.
        </p>

        <!--
        <router-link
          to="/products"
          class="inline-flex rounded-xl bg-[#3d6a3f] px-8 py-1  text-lg font-semibold text-white transition hover:bg-[#4b7f4f]"
        >
          Belanja Sekarang
        </router-link>
        -->
      </div>
      <!-- Categories -->
      <div
        class="absolute bottom-0 left-0 right-0 z-10 mx-auto flex w-full translate-y-[30%] flex-wrap justify-center gap-8 px-6 md:translate-y-[35%] md:px-10 lg:justify-between lg:px-16 pt-16"
      >
        <router-link
          v-for="category in categories"
          :key="category.title"
          to="/products"
          class="group flex h-[180px] w-[320px] items-center justify-between rounded-[2rem] bg-[#d6e2ca] px-8 py-7 text-[#183326] shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition hover:-translate-y-1"
        >
          <h6 class="max-w-[180px] text-2xl font-bold leading-snug md:text-xl">
            {{ category.title }}
          </h6>

          <img
            :src="category.image"
            :alt="category.title"
            class="h-24 w-24 rounded-xl object-cover shadow-sm"
            loading="lazy"
          />
        </router-link>
      </div>
    </section>

    <section class="pt-32">
      <HomeAbout />
    </section>
    <section>
      <featuredProducts />
    </section>

  </main>

  <Footer />

</template>
