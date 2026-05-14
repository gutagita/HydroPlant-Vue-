<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Leaf,
  Phone,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const phone = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''

  if (
    !name.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value ||
    !phone.value
  ) {
    errorMessage.value = 'Semua field wajib diisi.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Konfirmasi password tidak cocok.'
    return
  }

  loading.value = true

  try {
    // Coba register ke backend
    await authStore.register(name.value, email.value, password.value, phone.value)
    loading.value = false
    // Jika berhasil, redirect ke home (user sudah ter-login)
    router.push('/')
  } catch (error: any) {
    loading.value = false
    console.error('Register error:', error)

    errorMessage.value =
      error?.response?.data?.message ||
      'Register gagal. Periksa koneksi atau coba lagi.'
  }
}
</script>

<template>
  <main class="animate-auth-card min-h-screen bg-[#E3EED4] flex items-center justify-center px-6 py-6">
    <div
      class="w-full max-w-[850px] overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(15,42,29,0.18)] grid grid-cols-1 lg:grid-cols-2"
    >
      <!-- Left -->
      <section
        class="hidden lg:flex relative bg-[#0F2A1D] min-h-[280px] p-7 flex-col justify-between"
      >
        <div class="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80"
            alt="Hydroponic"
            class="h-full w-full object-cover"
          />
        </div>

        <div class="relative z-10">
          <div class="flex items-center gap-3">
            <div
              class="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center"
            >
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
          <h2
            class="max-w-[450px] text-4xl font-bold leading-tight text-white"
          >
            Buat akun dan mulai perjalanan hidroponikmu.
          </h2>

          <p
            class="mt-5 max-w-[430px] text-base leading-7 text-[#E3EED4]"
          >
            Dapatkan akses ke berbagai produk hidroponik terbaik,
            pantau pesanan, dan nikmati pengalaman belanja yang modern.
          </p>
        </div>
      </section>

      <!-- Right -->
      <section
        class="flex items-center justify-center px-6 py-8 sm:px-8 lg:px-10"
      >
        <div class="w-full max-w-[390px]">
          <!-- Mobile Logo -->
          <div class="mb-8 flex justify-center lg:hidden">
            <div class="flex items-center gap-3">
              <div
                class="h-11 w-11 rounded-2xl bg-[#0F2A1D] flex items-center justify-center"
              >
                <Leaf class="h-6 w-6 text-white" />
              </div>

              <span class="text-2xl font-bold text-[#0F2A1D]">
                HydroPlant
              </span>
            </div>
          </div>

          <div class="text-center lg:text-left">
            <h2 class="text-3xl font-bold text-[#0F2A1D]">
              Buat Akun
            </h2>

            <p class="mt-2 text-sm text-gray-500">
              Daftar untuk mulai menggunakan HydroPlant.
            </p>
          </div>

          <form @submit.prevent="handleRegister" class="mt-6 space-y-3 py-3">
            <!-- Error -->
            <div
              v-if="errorMessage"
              class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {{ errorMessage }}
            </div>

            <!-- Name -->
            <div class="pb-3">
              <label
                class="mb-2 block text-sm font-semibold text-[#0F2A1D]"
              >
                Nama Lengkap
              </label>

              <div
                class="flex items-center gap-3 rounded-xl border border-[#AEC3B0] bg-white px-4 py-3 transition focus-within:border-[#0F2A1D] focus-within:ring-4 focus-within:ring-[#AEC3B0]/30"
              >
                <User class="h-5 w-5 text-[#6B9071]" />

                <input
                  v-model="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  class="w-full border-none bg-transparent text-sm text-[#0F2A1D] outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="pb-3">
              <label
                class="mb-2 block text-sm font-semibold text-[#0F2A1D]"
              >
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

              <!-- Phone -->
              <div class="pb-3">
                <label
                  class="mb-2 block text-sm font-semibold text-[#0F2A1D]"
                >
                  No. Telepon
                </label>

                <div
                  class="flex items-center gap-3 rounded-xl border border-[#AEC3B0] bg-white px-4 py-3 transition focus-within:border-[#0F2A1D] focus-within:ring-4 focus-within:ring-[#AEC3B0]/30"
                >
                  <Phone class="h-5 w-5 text-[#6B9071]" />

                  <input
                    v-model="phone"
                    type="tel"
                    placeholder="0812xxxxxxx"
                    class="w-full border-none bg-transparent text-sm text-[#0F2A1D] outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

            <!-- Password -->
            <div class="pb-4">
              <label
                class="mb-2 block text-sm font-semibold text-[#0F2A1D]"
              >
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
                  <EyeOff
                    v-if="showPassword"
                    class="h-5 w-5"
                  />

                  <Eye
                    v-else
                    class="h-5 w-5"
                  />
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="pb-4">
              <label
                class="mb-2 block text-sm font-semibold text-[#0F2A1D]"
              >
                Konfirmasi Password
              </label>

              <div
                class="flex items-center gap-3 rounded-xl border border-[#AEC3B0] bg-white px-4 py-3 transition focus-within:border-[#0F2A1D] focus-within:ring-4 focus-within:ring-[#AEC3B0]/30"
              >
                <Lock class="h-5 w-5 text-[#6B9071]" />

                <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Ulangi password"
                  class="w-full border-none bg-transparent text-sm text-[#0F2A1D] outline-none placeholder:text-gray-400"
                />

                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="text-[#6B9071] hover:text-[#0F2A1D]"
                >
                  <EyeOff
                    v-if="showConfirmPassword"
                    class="h-5 w-5"
                  />

                  <Eye
                    v-else
                    class="h-5 w-5"
                  />
                </button>
              </div>
            </div>

            <!-- Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full  rounded-xl bg-[#0F2A1D] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#375534] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {{ loading ? 'Memproses...' : 'Daftar' }}
            </button>


          </form>
          <p class="mt-8 text-center text-sm text-gray-500">
            Sudah punya akun?

            <RouterLink
              to="/login"
              class="font-bold text-[#0F2A1D] hover:underline"
            >
              Masuk
            </RouterLink>

          </p>
        </div>
      </section>
    </div>
  </main>
</template>
