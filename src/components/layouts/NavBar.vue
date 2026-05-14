<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()

const cartStore = useCartStore()
const authStore = useAuthStore()

const isMenuOpen = ref(false)
const isProfileOpen = ref(false)

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const closeMenu = () => {
  isMenuOpen.value = false
  isProfileOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  closeMenu()
  router.push('/login')
}
</script>

<template>
  <header
    class="fixed left-0 top-0 z-50 w-full border-b border-white/10 text-white shadow-lg"
    style="background: linear-gradient(90deg, #0d3a2a 0%, #0a3023 55%, #08281d 100%);"
  >
    <div class="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-5 lg:px-10">
      <!-- LOGO -->
      <RouterLink
        to="/"
        class="font-heading text-3xl font-black tracking-tight md:text-4xl"
        @click="closeMenu"
      >
        <span class="text-[#E3EED4]">Hydro</span><span class="text-white">Plant</span>
      </RouterLink>

      <!-- DESKTOP NAV -->
      <nav class="hidden items-center gap-8 text-sm font-semibold md:flex">
        <RouterLink
          to="/"
          class="border-b-2 pb-1 transition"
          :class="isActive('/') ? 'border-white text-white' : 'border-transparent text-zinc-200 hover:text-white'"
        >
          Beranda
        </RouterLink>

        <RouterLink
          to="/products"
          class="border-b-2 pb-1 transition"
          :class="isActive('/products') ? 'border-white text-white' : 'border-transparent text-zinc-200 hover:text-white'"
        >
          Belanja
        </RouterLink>

        <RouterLink
          to="/about"
          class="border-b-2 pb-1 transition"
          :class="isActive('/about') ? 'border-white text-white' : 'border-transparent text-zinc-200 hover:text-white'"
        >
          Kontak
        </RouterLink>
      </nav>

      <!-- RIGHT ACTION -->
      <div class="flex items-center gap-4">
        <!-- SEARCH -->
        <button
          type="button"
          aria-label="Cari"
          class="hidden rounded-full p-2 text-zinc-100 transition hover:bg-white/10 hover:text-white md:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="h-5 w-5">
            <path
              fill-rule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 105.18 11.08l4.245 4.245a.75.75 0 101.06-1.06l-4.244-4.246A6.75 6.75 0 0010.5 3.75zM5.25 10.5a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <!-- CART -->
        <RouterLink
          to="/cart"
          class="relative rounded-full p-2 transition hover:bg-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="h-5 w-5">
            <path d="M2.25 3a.75.75 0 000 1.5h1.387c.17 0 .316.114.36.278l1.547 5.805a2.25 2.25 0 002.174 1.672h8.405a2.25 2.25 0 002.174-1.672l1.2-4.5A.75.75 0 0018.77 5H6.234l-.236-.886A1.875 1.875 0 004.196 3H2.25z" />
            <path d="M7.5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM18 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          </svg>

          <span
            v-if="cartStore.totalItems > 0"
            class="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white"
          >
            {{ cartStore.totalItems }}
          </span>
        </RouterLink>

        <!-- BELUM LOGIN -->
        <RouterLink
          v-if="!authStore.isLoggedIn"
          to="/login"
          class="hidden rounded-full bg-[#E3EED4] px-5 py-2 text-sm font-bold text-[#0F2A1D] transition hover:bg-white md:inline-flex"
        >
          Login
        </RouterLink>

        <!-- SUDAH LOGIN -->
        <div v-else class="relative hidden md:block">
          <button
            type="button"
            @click="isProfileOpen = !isProfileOpen"
            class="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 transition hover:bg-white/15"
          >
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#E3EED4] text-sm font-bold text-[#0F2A1D]">
              {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
            </div>

            <span class="max-w-[110px] truncate text-sm font-semibold">
              {{ authStore.user?.name || 'User' }}
            </span>

            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 15.5L6 9.5h12l-6 6z" />
            </svg>
          </button>

          <!-- DROPDOWN PROFILE -->
          <div
            v-if="isProfileOpen"
            class="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl bg-white text-sm text-[#0F2A1D] shadow-xl"
          >
            <RouterLink
              to="/profile"
              class="block px-5 py-3 font-semibold hover:bg-[#E3EED4]"
              @click="closeMenu"
            >
              Profile
            </RouterLink>

            <button
              type="button"
              class="block w-full px-5 py-3 text-left font-semibold text-red-600 hover:bg-red-50"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </div>

        <!-- MOBILE BUTTON -->
        <button
          type="button"
          class="rounded-lg p-2 transition hover:bg-white/10 md:hidden"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg
            v-if="!isMenuOpen"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="h-6 w-6"
            viewBox="0 0 24 24"
          >
            <path d="M4 6.75h16v1.5H4v-1.5zM4 11.25h16v1.5H4v-1.5zM4 15.75h16v1.5H4v-1.5z" />
          </svg>

          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="h-6 w-6"
            viewBox="0 0 24 24"
          >
            <path d="M6.225 4.811L4.811 6.225 10.586 12l-5.775 5.775 1.414 1.414L12 13.414l5.775 5.775 1.414-1.414L13.414 12l5.775-5.775-1.414-1.414L12 10.586 6.225 4.811z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- MOBILE MENU -->
    <div
      v-if="isMenuOpen"
      class="border-t border-white/10 bg-[#0a3023] px-5 py-4 md:hidden"
    >
      <nav class="flex flex-col gap-3 text-sm font-semibold">
        <RouterLink to="/" class="rounded-lg px-4 py-3 hover:bg-white/10" @click="closeMenu">
          Beranda
        </RouterLink>

        <RouterLink to="/products" class="rounded-lg px-4 py-3 hover:bg-white/10" @click="closeMenu">
          Belanja
        </RouterLink>

        <RouterLink to="/about" class="rounded-lg px-4 py-3 hover:bg-white/10" @click="closeMenu">
          Kontak
        </RouterLink>

        <RouterLink to="/cart" class="rounded-lg px-4 py-3 hover:bg-white/10" @click="closeMenu">
          Keranjang
        </RouterLink>

        <template v-if="authStore.isLoggedIn">
          <RouterLink to="/profile" class="rounded-lg px-4 py-3 hover:bg-white/10" @click="closeMenu">
            Profile
          </RouterLink>

          <RouterLink to="/checkout" class="rounded-lg px-4 py-3 hover:bg-white/10" @click="closeMenu">
            Checkout
          </RouterLink>

          <button
            type="button"
            class="rounded-lg px-4 py-3 text-left font-semibold text-red-300 hover:bg-white/10"
            @click="handleLogout"
          >
            Logout
          </button>
        </template>

        <RouterLink
          v-else
          to="/login"
          class="mt-2 rounded-full bg-[#E3EED4] px-5 py-3 text-center font-bold text-[#0F2A1D]"
          @click="closeMenu"
        >
          Login
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
