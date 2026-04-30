<script setup lang="ts">
import brandLogo from '@/assets/logo hydroplant.png'
</script>

<template>
  <header class="fixed top-0 left-0 z-50 w-full bg-white text-primary border-b shadow">
    <div class="container mx-auto flex justify-between items-center p-4">

      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 text-2xl font-black text-green-1000">
        <img
          :src="brandLogo"
          alt="HydroPlant"
          class="h-11 w-11 rounded-full border border-emerald-200 object-cover p-0.5 shadow-sm"
        />
        <span class="flex items-baseline gap-0">
          <span class="text-accent">Hydro</span><span class="text-primary">Plant</span>
        </span>
      </router-link>

      <!-- Menu -->
      <nav class="flex items-center gap-6 text-gray-800">
        <router-link to="/" class="px-3 py-1 rounded text-gray-700 hover:text-primary hover:bg-stone-300 transition">
          Home
        </router-link>

        <router-link to="/products" class="px-3 py-1 rounded text-gray-700 hover:text-primary hover:bg-stone-100 transition">
          Products
        </router-link>

        <router-link to="/" class="px-3 py-1 rounded text-gray-700 hover:text-primary hover:bg-stone-100 transition">
          Login
        </router-link>

        <router-link to="/" class="px-3 py-1 rounded text-gray-700 hover:text-primary hover:bg-stone-100 transition">
          Register
        </router-link>
      </nav>

    </div>
  </header>
</template>
