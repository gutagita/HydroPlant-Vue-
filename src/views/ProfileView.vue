<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import NavBar from '@/components/layouts/NavBar.vue'
import Footer from '@/components/layouts/Footer.vue'
import { getMyOrders, getProfile, updateProfile } from '@/services/profileService'

type Tab = 'profile' | 'orders'

const activeTab = ref<Tab>('profile')
const loading = ref(false)
const saving = ref(false)
const editing = ref(false)
const authStore = useAuthStore()

const user = ref({
  id: null as number | null,
  name: authStore.user?.name ?? '',
  email: authStore.user?.email ?? '',
  phone: authStore.user?.phone ?? '',
})

const initialUser = ref({
  id: null as number | null,
  name: '',
  email: '',
  phone: '',
})

const isDirty = computed(() => {
  return (
    user.value.name !== initialUser.value.name ||
    user.value.email !== initialUser.value.email ||
    user.value.phone !== initialUser.value.phone
  )
})

const orders = ref<any[]>([])

const pageTitle = computed(() =>
  activeTab.value === 'profile' ? 'Profil Saya' : 'Pesanan Saya',
)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const getPaymentLabel = (status: string) => {
  if (status === 'paid') return 'Sudah Dibayar'
  if (status === 'pending') return 'Menunggu Bayar'
  if (status === 'expired') return 'Kedaluwarsa'
  return status
}

const getOrderLabel = (status: string) => {
  if (status === 'pending') return 'Diproses'
  if (status === 'completed') return 'Selesai'
  if (status === 'cancelled') return 'Dibatalkan'
  return status
}

const normalizeProfileData = (payload: any) => {
  const profile = payload?.user ?? payload

  return {
    id: profile?.id ?? null,
    name: profile?.name ?? '',
    email: profile?.email ?? '',
    phone: profile?.phone ?? '',
  }
}

const loadData = async () => {
  try {
    loading.value = true

    const [profileResult, ordersResult] = await Promise.allSettled([
      getProfile(),
      getMyOrders(),
    ])

    if (profileResult.status === 'fulfilled') {
      const profileData = normalizeProfileData(profileResult.value)

      user.value = {
        id: profileData.id ?? user.value.id,
        name: profileData.name || user.value.name,
        email: profileData.email || user.value.email,
        phone: profileData.phone || user.value.phone,
      }

      initialUser.value = { ...user.value }

      authStore.user = {
        id: user.value.id ?? profileData.id,
        name: user.value.name,
        email: user.value.email,
        phone: user.value.phone,
      }
      localStorage.setItem('user', JSON.stringify(authStore.user))
    } else {
      console.error('Gagal mengambil data profile:', profileResult.reason)
    }

    if (ordersResult.status === 'fulfilled') {
      orders.value = ordersResult.value
    } else {
      console.error('Gagal mengambil data pesanan:', ordersResult.reason)
    }
  } catch (error) {
    console.error('Gagal mengambil data profile:', error)
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  try {
    saving.value = true

    const updatedUser = await updateProfile({
      name: user.value.name,
      phone: user.value.phone,
    })

    user.value.name = updatedUser.name
    user.value.phone = updatedUser.phone ?? ''
    authStore.user = {
      id: user.value.id ?? authStore.user?.id ?? 0,
      name: user.value.name,
      email: user.value.email,
      phone: user.value.phone,
    }
    localStorage.setItem('user', JSON.stringify(authStore.user))
    initialUser.value = { ...user.value }
    editing.value = false

    alert('Profil berhasil diperbarui')
  } catch (error) {
    console.error('Gagal update profile:', error)
    alert('Gagal memperbarui profil')
  } finally {
    saving.value = false
  }
}

const startEditing = () => {
  editing.value = true
}

const stopEditing = () => {
  user.value = { ...initialUser.value }
  editing.value = false
}

onMounted(() => {
  if (authStore.user) {
    user.value = {
      id: authStore.user.id,
      name: authStore.user.name ?? '',
      email: authStore.user.email ?? '',
      phone: authStore.user.phone ?? '',
    }
    initialUser.value = { ...user.value }
  }

  loadData()
})
</script>

<template>
  <div class="min-h-screen my-8 bg-[#E3EED4]">
    <NavBar />

    <main class="mx-auto max-w-screen px-6 py-32">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <!-- SIDEBAR -->
        <aside class="rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5 lg:min-h-[640px]">
          <div class="mb-16">
            <h2 class="text-xl font-bold text-[#0F2A1D]">Akun Saya</h2>
            <p class="mt-1 text-sm text-gray-500">
              Kelola profil dan pesanan HydroPlant kamklu
            </p>
          </div>

          <div class="pt-4">
            <div class="mb-4 pb-4">
              <button
                type="button"
                @click="activeTab = 'profile'"
                class="flex w-full items-center gap-3 rounded-xl px-5 py-3 text-left text-sm font-semibold transition"
                :class="
                  activeTab === 'profile'
                    ? 'bg-[#0F2A1D] text-white shadow'
                    : 'text-gray-700 hover:bg-[#E3EED4] hover:text-[#0F2A1D]'
                "
              >
                <span>👤</span>
                Profil Saya
              </button>
            </div>

            <div class="mb-4">
              <button
                type="button"
                @click="activeTab = 'orders'"
                class="flex w-full items-center gap-3 rounded-xl px-5 py-3 text-left text-sm font-semibold transition"
                :class="
                  activeTab === 'orders'
                    ? 'bg-[#0F2A1D] text-white shadow'
                    : 'text-gray-700 hover:bg-[#E3EED4] hover:text-[#0F2A1D]'
                "
              >
                <span>📦</span>
                Pesanan Saya
              </button>
            </div>
          </div>
        </aside>

        <!-- CONTENT -->
        <section class="rounded-2xl bg-white p-8 shadow-md ring-1 ring-black/5">
          <div class="mb-8 border-b border-gray-100 pb-5">
            <h1 class="text-2xl font-bold text-[#0F2A1D]">
              {{ pageTitle }}
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              {{
                activeTab === 'profile'
                  ? 'Data profil diambil dari akun yang sedang login.'
                  : 'Riwayat pesanan diambil dari database berdasarkan user login.'
              }}
            </p>
          </div>

          <div v-if="loading" class="py-20 text-center text-gray-500">
            Mengambil data...
          </div>

          <template v-else>
            <!-- PROFILE -->
            <div v-if="activeTab === 'profile'">
              <div class="mb-10 flex flex-col items-center">
                <div class="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#E3EED4] bg-[#0F2A1D] text-4xl font-bold text-white shadow">
                  {{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}
                </div>

                <h2 class="mt-4 text-lg font-bold text-[#0F2A1D]">
                  {{ user.name }}
                </h2>

                <p class="text-sm text-gray-500">
                  {{ user.email }}
                </p>
              </div>

              <form class="mx-auto space-y-5" @submit.prevent="saveProfile">
                <div>
                  <label class="mb-2 block text-sm font-semibold text-gray-700">
                    Nama Lengkap
                  </label>
                  <input
                    v-model="user.name"
                    type="text"
                    :readonly="!editing"
                    :class="[
                      'w-full rounded-xl border px-5 py-3 text-sm outline-none transition text-black',
                      editing
                        ? 'border-gray-300 focus:border-[#6B9071] focus:ring-2 focus:ring-[#AEC3B0] bg-white'
                        : 'cursor-not-allowed border-gray-200 bg-gray-100',
                    ]"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    v-model="user.email"
                    type="email"
                    disabled
                    class="w-full rounded-xl border border-gray-200 bg-gray-100 px-5 py-3 text-sm text-gray-500 outline-none"
                  />
                  <p class="mt-1 text-xs text-gray-400">
                    Email tidak bisa diubah dari halaman ini.
                  </p>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-gray-700">
                    No Telepon
                  </label>
                  <input
                    v-model="user.phone"
                    type="text"
                    placeholder="Masukkan nomor telepon"
                    :readonly="!editing"
                    :class="[
                      'w-full rounded-xl border px-5 py-3 text-sm outline-none transition text-black',
                      editing
                        ? 'border-gray-300 focus:border-[#6B9071] focus:ring-2 focus:ring-[#AEC3B0] bg-white'
                        : 'cursor-not-allowed border-gray-200 bg-gray-100 placeholder:text-gray-400',
                    ]"
                  />
                </div>

                <div class="flex justify-center gap-3 pt-4">
                  <button
                    v-if="!editing"
                    type="button"
                    @click="startEditing"
                    class="rounded-xl bg-[#E3EED4] px-8 py-3 text-sm font-semibold text-[#0F2A1D] shadow transition hover:bg-[#d5e4c3]"
                  >
                    Edit
                  </button>

                  <template v-else>
                    <button
                      type="button"
                      @click="stopEditing"
                      class="rounded-xl bg-white px-8 py-3 text-sm font-semibold text-gray-700 shadow ring-1 ring-gray-200 transition hover:bg-gray-50"
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      :disabled="saving || !isDirty"
                      class="rounded-xl bg-[#0F2A1D] px-8 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#375534] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                    </button>
                  </template>
                </div>
              </form>
            </div>

            <!-- ORDERS -->
            <div v-else>
              <div v-if="orders.length > 0" class="space-y-5">
                <div
                  v-for="order in orders"
                  :key="order.id"
                  class="rounded-2xl border border-gray-100 bg-[#F8FBF4] p-5 shadow-sm"
                >
                  <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p class="text-sm text-gray-500">Nomor Pesanan</p>
                      <h3 class="text-lg font-bold text-[#0F2A1D]">
                        {{ order.external_id }}
                      </h3>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <span class="rounded-full bg-[#E3EED4] px-4 py-1 text-xs font-semibold text-[#0F2A1D]">
                        {{ getPaymentLabel(order.payment_status) }}
                      </span>

                      <span class="rounded-full bg-white px-4 py-1 text-xs font-semibold text-[#375534] ring-1 ring-[#AEC3B0]">
                        {{ getOrderLabel(order.order_status) }}
                      </span>
                    </div>
                  </div>

                  <div class="mt-5 grid gap-4 md:grid-cols-4">
                    <div>
                      <p class="text-sm text-gray-500">Tanggal</p>
                      <p class="font-semibold text-gray-800">
                        {{ formatDate(order.created_at) }}
                      </p>
                    </div>

                    <div>
                      <p class="text-sm text-gray-500">Metode Bayar</p>
                      <p class="font-semibold text-gray-800">
                        {{ order.payment_method ?? '-' }}
                      </p>
                    </div>

                    <div>
                      <p class="text-sm text-gray-500">Jumlah Produk</p>
                      <p class="font-semibold text-gray-800">
                        {{ order.items?.length ?? 0 }} item
                      </p>
                    </div>

                    <div>
                      <p class="text-sm text-gray-500">Total</p>
                      <p class="font-bold text-[#0F2A1D]">
                        {{ formatPrice(Number(order.total_price ?? 0)) }}
                      </p>
                    </div>
                  </div>

                  <div class="mt-5 rounded-xl bg-white p-4">
                    <p class="mb-3 text-sm font-bold text-[#0F2A1D]">
                      Produk Pesanan
                    </p>

                    <div
                      v-for="item in order.items"
                      :key="item.id"
                      class="flex items-center justify-between border-b border-gray-100 py-3 last:border-0"
                    >
                      <div>
                        <p class="text-sm font-semibold text-gray-800">
                          {{ item.product?.name ?? 'Produk' }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ item.quantity }} x {{ formatPrice(Number(item.price)) }}
                        </p>
                      </div>

                      <p class="text-sm font-bold text-[#0F2A1D]">
                        {{ formatPrice(Number(item.subtotal)) }}
                      </p>
                    </div>
                  </div>

                  <div v-if="order.checkout_url && order.payment_status === 'pending'" class="mt-5 flex justify-end">
                    <a
                      :href="order.checkout_url"
                      target="_blank"
                      class="rounded-xl bg-[#0F2A1D] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#375534]"
                    >
                      Lanjutkan Pembayaran
                    </a>
                  </div>
                </div>
              </div>

              <div v-else class="flex min-h-[360px] flex-col items-center justify-center text-center">
                <div class="text-5xl">🛒</div>
                <h3 class="mt-4 text-lg font-bold text-[#0F2A1D]">
                  Belum Ada Pesanan
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Pesanan kamu akan muncul di halaman ini setelah checkout.
                </p>
              </div>
            </div>
          </template>
        </section>
      </div>
    </main>

    <Footer />
  </div>
</template>
