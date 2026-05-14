<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-[color:var(--color-background)] px-4 py-8 pt-20 text-[color:var(--color-primary)] sm:px-6 sm:pt-24 lg:px-8">
    <div class="w-full max-w-3xl">
      <section class="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_rgba(15,42,29,0.12)] ring-1 ring-[rgba(15,42,29,0.06)]">
        <div class="flex flex-col items-center border-b border-[rgba(15,42,29,0.06)] bg-[linear-gradient(180deg,rgba(227,238,212,0.7),rgba(255,255,255,0))] px-6 py-10 sm:px-10 sm:py-12">
          <div class="flex h-24 w-24 items-center justify-center rounded-full bg-[color:var(--color-primary)] shadow-[0_18px_40px_rgba(15,42,29,0.22)] sm:h-28 sm:w-28">
            <svg viewBox="0 0 24 24" fill="none" class="h-12 w-12 text-white sm:h-14 sm:w-14">
              <path d="M4 12l6 6L20 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          <div class="mt-6 pt-8 text-center">
            <p class="text-sm font-semibold uppercase tracking-[0.32em] text-[color:var(--color-accent)]">
              Payment Success
            </p>
            <h1 class="mt-3 py-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Terima kasih!
            </h1>
            <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-[color:var(--color-secondary)] sm:text-base">
              Pembayaran berhasil dibuat. Pesanan Anda sedang diproses
            </p>
          </div>
        </div>

        <div class="px-6 py-8 text-center sm:px-10 sm:py-10">


          <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full bg-[color:var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--color-secondary)]"
              @click="router.push('/profile')"
            >
              Lihat Pesanan Saya
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-[rgba(15,42,29,0.14)] bg-white px-6 py-3 text-sm font-semibold text-[color:var(--color-primary)] transition hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-background)]"
              @click="router.push('/')"
            >
              Kembali ke Belanja
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
