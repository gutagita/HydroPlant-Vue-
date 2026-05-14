<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import api from '@/services/api'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'

type RegionOption = {
  id: string
  name: string
}

type VillageOption = {
  id: string
  name: string
  postal_code: string
}

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const phone = ref('')
const email = ref('')
const fullName = ref('')
const province = ref('')
const city = ref('')
const district = ref('')
const village = ref('')
const postalCode = ref('')
const street = ref('')
const detail = ref('')
const paymentMethod = ref('xendit')
const sellerNote = ref('')

const provinces = ref<RegionOption[]>([])
const cities = ref<RegionOption[]>([])
const districts = ref<RegionOption[]>([])
const villages = ref<VillageOption[]>([])

const provinceId = ref('')
const cityId = ref('')
const districtId = ref('')

// input refs to manage focus
const cityInput = ref<HTMLInputElement | null>(null)
const districtInput = ref<HTMLInputElement | null>(null)
const villageInput = ref<HTMLInputElement | null>(null)

const loading = ref(false)

// Dropdown state
const openDropdown = ref<'province' | 'city' | 'district' | 'village' | null>(null)
const closeDropdown = () => {
  window.setTimeout(() => {
    openDropdown.value = null
  }, 150)
}

const filteredProvinces = computed(() =>
  province.value.trim() === ''
    ? provinces.value
    : provinces.value.filter((p) =>
        p.name.toLowerCase().includes(province.value.toLowerCase()),
      ),
)

const filteredCities = computed(() =>
  city.value.trim() === ''
    ? cities.value
    : cities.value.filter((c) =>
        c.name.toLowerCase().includes(city.value.toLowerCase()),
      ),
)

const filteredDistricts = computed(() =>
  district.value.trim() === ''
    ? districts.value
    : districts.value.filter((d) =>
        d.name.toLowerCase().includes(district.value.toLowerCase()),
      ),
)

const filteredVillages = computed(() =>
  village.value.trim() === ''
    ? villages.value
    : villages.value.filter((v) =>
        v.name.toLowerCase().includes(village.value.toLowerCase()),
      ),
)

const selectedItems = computed(() => cartStore.selectedItems)


const subtotal = computed(() =>
  selectedItems.value.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity
  }, 0),
)

const shippingCost = computed(() => 10000)
const totalPayment = computed(() => subtotal.value + shippingCost.value)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

const getProductImage = (product: any) => {
  if (product.image_url) return product.image_url

  if (product.images && product.images.length > 0) {
    const image = product.images[0]

    if (image.startsWith('http')) return image

    return `http://127.0.0.1:8000/storage/${image}`
  }

  if (product.image) return product.image

  return 'https://placehold.co/300x300?text=No+Image'
}

const normalizeCityName = (name: string) => {
  return name.replace(/^(Kabupaten|Kota)\s+/i, '')
}

const loadProvinces = async () => {
  const response = await axios.get<RegionOption[]>(
    'https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json',
  )

  provinces.value = response.data.map((item) => ({
    ...item,
    name: item.name.charAt(0) + item.name.slice(1).toLowerCase(),
  }))
}

const loadCities = async (selectedProvinceId: string) => {
  const response = await axios.get<RegionOption[]>(
    `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvinceId}.json`,
  )

  cities.value = response.data.map((item) => {
    const normalized = normalizeCityName(item.name)
    return {
      ...item,
      name: normalized.charAt(0) + normalized.slice(1).toLowerCase(),
    }
  })
}

const loadDistricts = async (selectedCityId: string) => {
  const response = await axios.get<RegionOption[]>(
    `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedCityId}.json`,
  )

  districts.value = response.data.map((item) => ({
    ...item,
    name: item.name.charAt(0) + item.name.slice(1).toLowerCase(),
  }))
}

const loadVillages = async (selectedDistrictId: string) => {
  const response = await axios.get<VillageOption[]>(
    `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrictId}.json`,
  )

  villages.value = response.data.map((item) => ({
    ...item,
    name: item.name.charAt(0) + item.name.slice(1).toLowerCase(),
  }))
}

watch(province, async (value) => {
  const selectedProvince = provinces.value.find((item) => item.name === value)

  provinceId.value = selectedProvince?.id ?? ''
  city.value = ''
  district.value = ''
  village.value = ''
  postalCode.value = ''
  cityId.value = ''
  districtId.value = ''
  cities.value = []
  districts.value = []
  villages.value = []

  if (selectedProvince) {
    await loadCities(selectedProvince.id)
    await nextTick()
    openDropdown.value = 'city'
    cityInput.value?.focus()
  }
})

watch(city, async (value) => {
  const selectedCity = cities.value.find((item) => item.name === value)

  cityId.value = selectedCity?.id ?? ''
  district.value = ''
  village.value = ''
  postalCode.value = ''
  districtId.value = ''
  districts.value = []
  villages.value = []

  if (selectedCity) {
    await loadDistricts(selectedCity.id)
    await nextTick()
    openDropdown.value = 'district'
    districtInput.value?.focus()
  }
})

watch(district, async (value) => {
  const selectedDistrict = districts.value.find((item) => item.name === value)

  districtId.value = selectedDistrict?.id ?? ''
  village.value = ''
  postalCode.value = ''
  villages.value = []

  if (selectedDistrict) {
    await loadVillages(selectedDistrict.id)
    await nextTick()
    openDropdown.value = 'village'
    villageInput.value?.focus()
  }
})

watch(village, (value) => {
  const selectedVillage = villages.value.find((item) => item.name === value)

  postalCode.value = selectedVillage?.postal_code ?? ''
})

onMounted(async () => {
  try {
    await loadProvinces()
  } catch (error) {
    console.error('Gagal memuat data wilayah Indonesia:', error)
  }
})

const createOrder = async () => {
  if (!authStore.isLoggedIn) {
    alert('Silakan login terlebih dahulu sebelum checkout.')
    router.push('/login')
    return
  }

  if (selectedItems.value.length === 0) {
    alert('Belum ada produk yang dipilih.')
    router.push('/cart')
    return
  }

  if (
    !phone.value ||
    !email.value ||
    !fullName.value ||
    !province.value ||
    !city.value ||
    !district.value ||
    !village.value ||
    !street.value
  ) {
    alert('Lengkapi data checkout terlebih dahulu.')
    return
  }

  const address = [
    street.value,
    detail.value,
    village.value,
    district.value,
    city.value,
    province.value,
    postalCode.value,
  ]
    .filter(Boolean)
    .join(', ')

  const payload = {
    customer_name: fullName.value,
    customer_email: email.value,
    customer_phone: phone.value,
    address: address,
    payment_method: paymentMethod.value,
    seller_note: sellerNote.value,
    shipping_cost: shippingCost.value,
    items: selectedItems.value.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    })),
  }

  try {
    loading.value = true

    const response = await api.post('/checkout', payload)

    const checkoutUrl = response.data?.data?.checkout_url
  const orderId = response.data?.data?.order_id
  const externalId = response.data?.data?.external_id

  if (!checkoutUrl) {
      alert('Checkout URL tidak ditemukan dari backend.')
      console.log('Response checkout:', response.data)
          // Simpan order data ke localStorage sebelum redirect
          const orderData = {
            order_id: orderId || '-',
            external_id: externalId || '-',
            total_price: totalPayment.value.toString(),
            timestamp: new Date().toISOString(),
          }
          localStorage.setItem('lastOrderData', JSON.stringify(orderData))

      return
    }

    cartStore.clearSelectedItems()

    window.location.href = checkoutUrl
  } catch (error: any) {
    console.error('Checkout error:', error)

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Checkout gagal. Periksa backend atau payload.'

    alert(message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-white pt-16">

    <main class="border-t border-[#AEC3B0] pt-24">
      <div class="mx-16 grid grid-cols-1 gap-8 px-8 pb-8 lg:grid-cols-2 lg:items-start">
        <!-- LEFT FORM -->
        <section class="mx-8 rounded-lg bg-white px-6 py-16 shadow-lg lg:sticky lg:top-28 lg:self-start lg:px-10">
          <div class="max-w-[520px]">
            <!-- Kontak -->
            <div class="mb-7 pb-4">
              <h2 class="mb-4 text-xl font-bold text-black">Kontak</h2>

              <div class="space-y-4">
                <div class="py-2.5">
                  <label class="mb-2 block text-xs font-semibold text-gray-700">Nama Lengkap</label>
                  <input
                    v-model="fullName"
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    class="w-full rounded-lg border border-[#6B9071] px-5 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-[#AEC3B0]"
                  />
                </div>
                <div class="py-2.5">
                  <label class="mb-2 block text-xs font-semibold text-gray-700">No Telepon</label>
                  <input
                    v-model="phone"
                    type="text"
                    placeholder="Contoh: 0812345678"
                    class="w-full rounded-lg border border-[#6B9071] px-5 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-[#AEC3B0]"
                  />
                </div>

                <div class="py-2.5">
                  <label class="mb-2 block text-xs font-semibold text-gray-700">Email</label>
                  <input
                    v-model="email"
                    type="email"
                    placeholder="Contoh: user@gmail.com"
                    class="w-full rounded-lg border border-[#6B9071] px-5 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-[#AEC3B0]"
                  />
                </div>
              </div>
            </div>

            <!-- Alamat -->
            <div class="mb-10">
              <h2 class="mb-4 text-xl font-bold text-black">Alamat</h2>

              <div class="space-y-4 pb-4">


                <div class="relative py-2">
                  <label class="mb-2 block text-xs font-semibold text-gray-700">Provinsi</label>
                  <input
                    v-model="province"
                    type="text"
                    placeholder="Cari atau ketik provinsi..."
                    class="w-full rounded-lg border border-[#6B9071] px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-[#AEC3B0]"
                    @focus="openDropdown = 'province'"
                    @blur="closeDropdown"
                  />
                  <div
                    v-if="openDropdown === 'province' && filteredProvinces.length > 0"
                    class="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-[#6B9071] bg-white shadow-lg"
                  >
                    <button
                      v-for="item in filteredProvinces"
                      :key="item.id"
                      type="button"
                      class="w-full px-4 py-2 text-left text-sm text-black hover:bg-[#AEC3B0]"
                      @mousedown.prevent="province = item.name; openDropdown = null"
                    >
                      {{ item.name }}
                    </button>
                  </div>
                </div>

                <div class="relative py-2">
                  <label class="mb-2 block text-xs font-semibold text-gray-700">Kota / Kabupaten</label>
                  <input
                    ref="cityInput"
                    v-model="city"
                    type="text"
                    placeholder="Cari atau ketik kota..."
                    class="w-full rounded-lg border border-[#6B9071] px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-[#AEC3B0] disabled:bg-gray-100"
                    :disabled="!provinceId"
                    @focus="openDropdown = 'city'"
                   @blur="closeDropdown"
                  />
                  <div
                    v-if="openDropdown === 'city' && filteredCities.length > 0"
                    class="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-[#6B9071] bg-white shadow-lg"
                  >
                    <button
                      v-for="item in filteredCities"
                      :key="item.id"
                      type="button"
                      class="w-full px-4 py-2 text-left text-sm text-black hover:bg-[#AEC3B0]"
                      @mousedown.prevent="city = item.name; openDropdown = null"
                    >
                      {{ item.name }}
                    </button>
                  </div>
                </div>

                <div class="relative py-2">
                  <label class="mb-2 block text-xs font-semibold text-gray-700">Kecamatan</label>
                  <input
                    ref="districtInput"
                    v-model="district"
                    type="text"
                    placeholder="Cari atau ketik kecamatan..."
                    class="w-full rounded-lg border border-[#6B9071] px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-[#AEC3B0] disabled:bg-gray-100"
                    :disabled="!cityId"
                    @focus="openDropdown = 'district'"
                    @blur="closeDropdown"
                  />
                  <div
                    v-if="openDropdown === 'district' && filteredDistricts.length > 0"
                    class="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-[#6B9071] bg-white shadow-lg"
                  >
                    <button
                      v-for="item in filteredDistricts"
                      :key="item.id"
                      type="button"
                      class="w-full px-4 py-2 text-left text-sm text-black hover:bg-[#AEC3B0]"
                      @mousedown.prevent="district = item.name; openDropdown = null"
                    >
                      {{ item.name }}
                    </button>
                  </div>
                </div>

                <div class="relative py-2">
                  <label class="mb-2 block text-xs font-semibold text-gray-700">Kelurahan / Desa</label>
                  <input
                    ref="villageInput"
                    v-model="village"
                    type="text"
                    placeholder="Cari atau ketik kelurahan..."
                    class="w-full rounded-lg border border-[#6B9071] px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-[#AEC3B0] disabled:bg-gray-100"
                    :disabled="!districtId"
                    @focus="openDropdown = 'village'"
                    @blur="closeDropdown"
                  />
                  <div
                    v-if="openDropdown === 'village' && filteredVillages.length > 0"
                    class="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-[#6B9071] bg-white shadow-lg"
                  >
                    <button
                      v-for="item in filteredVillages"
                      :key="item.id"
                      type="button"
                      class="w-full px-4 py-2 text-left text-sm text-black hover:bg-[#AEC3B0]"
                      @mousedown.prevent="village = item.name; openDropdown = null"
                    >
                      {{ item.name }}
                    </button>
                  </div>
                </div>

                <div class="py-2">
                  <label class="mb-2 block text-xs font-semibold text-gray-700">Nama Jalan</label>
                  <input
                    v-model="street"
                    type="text"
                    placeholder="Contoh: Jalan Sudirman no 123"
                    class="w-full rounded-lg border border-[#6B9071] px-5 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-[#AEC3B0]"
                  />
                </div>

                <div class="py-2">
                  <label class="mb-2 block text-xs font-semibold text-gray-700">Detail Lainnya (Opsional)</label>
                  <input
                    v-model="detail"
                    type="text"
                    placeholder="Contoh: Depan rumah sakit, dekat warung kopi"
                    class="w-full rounded-lg border border-[#6B9071] px-5 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-[#AEC3B0]"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              @click="createOrder"
              :disabled="loading"
              class="w-full rounded-lg bg-[#0F2A1D] py-4 text-sm font-bold text-white transition hover:bg-[#375534] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ loading ? 'Memproses...' : 'Buat Pesanan' }}
            </button>
          </div>
        </section>

        <!-- RIGHT SUMMARY -->
        <section class="bg-[#E3EED4] rounded-lg self-start shadow-lg mx-8 px-6 py-16 lg:min-w-0 lg:self-start lg:px-10">
          <div class="max-w-[520px]">
            <h2 class="mb-16 text-xl font-bold text-black">Ringkasan Pesanan</h2>

            <div v-if="selectedItems.length === 0" class="text-sm text-gray-600">
              Belum ada produk yang dipilih.
            </div>

            <div v-else>
              <div
                v-for="item in selectedItems"
                :key="item.product.id"
                class="mb-5 grid grid-cols-[90px_1fr_auto_auto] items-center gap-5 py-2"
              >
                <img
                  :src="getProductImage(item.product)"
                  :alt="item.product.name"
                  class="h-[90px] w-[90px] rounded-2xl bg-white object-cover"
                />

                <p class="text-sm text-[#0F2A1D]">
                  {{ item.product.name }}
                </p>

                <p class="text-sm text-[#0F2A1D]">x{{ item.quantity }}</p>

                <p class="text-sm text-[#0F2A1D]">
                  {{ formatPrice(Number(item.product.price)) }}
                </p>
              </div>

              <div class="pb-4">
                <label class="mb-2 block text-xs font-semibold text-gray-700">Catatan untuk Penjual (Opsional)</label>
                <div class="flex gap-4">
                  <input
                    v-model="sellerNote"
                    type="text"
                    placeholder="Contoh: Tolong bungkus dengan rapi"
                    class="flex-1 rounded-lg border border-[#6B9071] bg-white px-5 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-[#AEC3B0]"
                  />

                  <button
                    type="button"
                    class="rounded-lg bg-[#0F2A1D] px-4 text-sm text-white transition hover:bg-[#375534]"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              <div class="space-y-4 text-sm text-[#0F2A1D]">
                <div class="flex justify-between">
                  <span>Subtotal</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>

                <div class="flex justify-between">
                  <span>Pengantaran</span>
                  <span>{{ formatPrice(shippingCost) }}</span>
                </div>

                <div class="flex justify-between pt-2 text-2xl font-extrabold text-black">
                  <span>Total</span>
                  <span>{{ formatPrice(totalPayment) }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
