<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <footer
    class="bg-primary px-6 py-12 text-background sm:px-10 lg:px-16"
  >
    <div class="mx-auto w-full max-w-[1400px]">
      <div class="flex justify-center md:justify-end">
        <nav class="font-heading flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.16em] md:gap-x-8">
          <router-link
            to="/"
            class="transition"
            :class="isActive('/') ? 'text-background' : 'text-accent hover:text-background'"
          >
            Beranda
          </router-link>
          <router-link
            to="/products"
            class="transition"
            :class="isActive('/products') ? 'text-background' : 'text-accent hover:text-background'"
          >
            Belanja
          </router-link>
          <router-link
            to="/about"
            class="transition"
            :class="isActive('/about') ? 'text-background' : 'text-accent hover:text-background'"
          >
            Kontak
          </router-link>
        </nav>
      </div>

      <div class="mt-9 border-t border-accent/40 pt-8">
        <div class="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p class="font-heading text-sm font-bold tracking-wide text-background">HydroPlant</p>
            <p class="mt-1 text-xs leading-relaxed text-accent">
              Menumbuhkan alam, mendekatkan kehidupan.
            </p>
          </div>

          <div class="flex flex-col items-start gap-2 md:items-end">
            <div class="flex items-center gap-3 text-accent">
              <a href="#" aria-label="Instagram" class="transition hover:text-background">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                  <path
                    d="M7.5 2.25h9A5.25 5.25 0 0121.75 7.5v9a5.25 5.25 0 01-5.25 5.25h-9A5.25 5.25 0 012.25 16.5v-9A5.25 5.25 0 017.5 2.25zm4.5 5.25a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5zm0 1.875a3.375 3.375 0 110 6.75 3.375 3.375 0 010-6.75zm5.438-.938a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                  />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" class="transition hover:text-background">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                  <path
                    d="M13.5 9H15a.75.75 0 000-1.5h-1.5A3.75 3.75 0 009.75 11.25V13.5H8.25a.75.75 0 000 1.5h1.5V21a.75.75 0 001.5 0v-6h1.875a.75.75 0 000-1.5H11.25v-2.25A2.25 2.25 0 0113.5 9z"
                  />
                  <path
                    d="M12 2.25C6.615 2.25 2.25 6.615 2.25 12S6.615 21.75 12 21.75 21.75 17.385 21.75 12 17.385 2.25 12 2.25zm0 18A8.25 8.25 0 113.75 12 8.25 8.25 0 0112 20.25z"
                  />
                </svg>
              </a>
              <a href="#" aria-label="X" class="transition hover:text-background">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                  <path
                    d="M13.751 10.622 20.85 2.25h-1.683l-6.164 7.27-4.924-7.27H2.4l7.442 10.987L2.4 21.75h1.683l6.506-7.675 5.2 7.675h5.68l-7.718-11.128zm-2.308 2.724-.755-1.07L4.69 3.784h2.585l4.84 6.86.755 1.07 6.29 8.91h-2.585l-5.132-7.278z"
                  />
                </svg>
              </a>
            </div>

            <p class="text-xs text-accent md:text-sm">
              Kasongan, Bantul, Yogyakarta
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
