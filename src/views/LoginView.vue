<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Leaf,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Email dan password wajib diisi.'
    return
  }

  loading.value = true

  try {
    await authStore.login(email.value, password.value)

    loading.value = false

    router.push('/')
  } catch (error: any) {
    loading.value = false

    console.error('Login error:', error)

    errorMessage.value =
      error?.response?.data?.message ||
      'Login gagal. Periksa email atau password.'
  }
}
</script>

<template>
  <main class="animate-auth-card min-h-screen bg-background flex items-center justify-center px-6 py-10">
    <div
      class="w-full max-w-[820px] overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(15,42,29,0.18)] grid grid-cols-1 lg:grid-cols-2"
    >
      <!-- Left Section -->
      <section class="hidden lg:flex relative bg-[#0F2A1D] min-h-[420px] p-10 flex-col justify-between">
        <div class="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=80"
            alt="Hydroponic plant"
            class="h-full w-full object-cover"
          />
        </div>

        <div class="relative z-10">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Leaf class="h-7 w-7 text-[#E3EED4]" />
            </div>

            <div>
              <h1 class="text-2xl font-bold text-white">
                HydroPlant
              </h1>
              <p class="text-sm text-[#AEC3B0]">
                Smart Hydroponic Marketplace
              </p>
            </div>
          </div>
        </div>

        <div class="relative z-10">
          <h2 class="max-w-[420px] text-4xl font-bold leading-tight text-white">
            Masuk dan mulai belanja kebutuhan hidroponikmu.
          </h2>

          <p class="mt-5 max-w-[420px] text-base leading-7 text-[#E3EED4]">
            Temukan bibit, nutrisi, alat hidroponik, dan paket usaha terbaik
            dalam satu platform.
          </p>
        </div>
      </section>

      <!-- Right Form -->
      <section class="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
        <div class="w-full max-w-[430px]">
          <!-- Mobile Logo -->
          <div class="mb-8 flex justify-center lg:hidden">
            <div class="flex items-center gap-3">
              <div class="h-11 w-11 rounded-2xl bg-[#0F2A1D] flex items-center justify-center">
                <Leaf class="h-6 w-6 text-white" />
              </div>
              <span class="text-2xl font-bold text-[#0F2A1D]">
                HydroPlant
              </span>
            </div>
          </div>

          <div class="text-center lg:text-left">
            <h2 class="text-3xl font-bold text-[#0F2A1D]">
              Selamat Datang
            </h2>

            <p class="mt-2 text-sm text-gray-500">
              Masukkan email dan password untuk mengakses akun.
            </p>
          </div>

          <form @submit.prevent="handleLogin" class="mt-9 space-y-5">
            <div v-if="errorMessage" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {{ errorMessage }}
            </div>

            <!-- Email -->
            <div class="py-4">
              <label class="mb-2 block text-sm font-semibold text-[#0F2A1D]">
                Email
              </label>

              <div
                class="flex items-center gap-3 rounded-xl border border-[#AEC3B0] bg-white px-4 py-3 transition focus-within:border-[#0F2A1D] focus-within:ring-4 focus-within:ring-[#AEC3B0]/30"
              >
                <Mail class="h-5 w-5 text-[#6B9071]" />

                <input
                  v-model="email"
                  type="email"
                  placeholder="example@gmail.com"
                  class="w-full border-none bg-transparent text-sm text-[#0F2A1D] outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="pb-4">
              <label class="mb-2 block text-sm font-semibold text-[#0F2A1D]">
                Password
              </label>

              <div
                class="flex items-center gap-3 rounded-xl border border-[#AEC3B0] bg-white px-4 py-3 transition focus-within:border-[#0F2A1D] focus-within:ring-4 focus-within:ring-[#AEC3B0]/30"
              >
                <Lock class="h-5 w-5 text-[#6B9071]" />

                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Masukkan password"
                  class="w-full border-none bg-transparent text-sm text-[#0F2A1D] outline-none placeholder:text-gray-400"
                />

                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="text-[#6B9071] hover:text-[#0F2A1D]"
                >
                  <EyeOff v-if="showPassword" class="h-5 w-5" />
                  <Eye v-else class="h-5 w-5" />
                </button>
              </div>

              <div class="mt-2 flex justify-end">
                <RouterLink
                  to="/forgot-password"
                  class="text-sm font-medium text-[#375534] hover:underline"
                >
                  Lupa password?
                </RouterLink>
              </div>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full rounded-xl bg-[#0F2A1D] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#375534] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {{ loading ? 'Memproses...' : 'Masuk' }}
            </button>
          </form>

          <p class="mt-8 pt-4 text-center text-sm text-gray-500">
            Belum punya akun?
           <RouterLink
              to="/register"
              class="font-bold text-[#0F2A1D] hover:underline"
            >
              Daftar
           </RouterLink>
          </p>
        </div>
      </section>
    </div>
  </main>
</template>
