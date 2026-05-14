# Catatan Perubahan - 2026-04-18

## Ringkasan
Hari ini fokus utama ada di perapihan tampilan ProductView, penambahan Footer, filter kategori, dan pagination berbasis API agar produk bisa diakses lintas halaman.

## Detail Perubahan

### 1) ProductView diperluas jadi halaman katalog lengkap
- Menambahkan komponen carousel di atas daftar produk.
- Menambahkan tombol filter kategori.
- Menambahkan empty state saat kategori tidak punya produk.
- Menambahkan kontrol pagination (Sebelumnya/Selanjutnya + indikator halaman).
- Menambahkan footer di bagian bawah halaman.

Lokasi:
- src/views/ProductView.vue

### 2) Store produk ditingkatkan untuk filter + pagination
- Menambah state: `selectedCategory`, `currentPage`, `totalPages`, `perPage`, `totalProducts`.
- Menambah getter: `categories`, `filteredProducts`, `canGoPrev`, `canGoNext`.
- Menambah action: `setCategory`, `goToPage`, `goToPrevPage`, `goToNextPage`.
- Memperbarui `fetchProducts` agar membaca page aktif.

Lokasi:
- src/stores/productStore.ts

### 3) Service produk mendukung metadata pagination Laravel
- Request `/products` sekarang mengirim query `page` dan `per_page`.
- Parsing metadata pagination dari response (`current_page`, `last_page`, `per_page`, `total`, termasuk varian `meta`).
- Return service diubah menjadi objek berisi `items` dan `pagination`.

Lokasi:
- src/services/productService.ts

### 4) Footer baru ditambahkan dan disesuaikan style
- Membuat komponen footer baru sesuai desain hijau.
- Menyesuaikan warna link navigasi agar tidak ketimpa style global.
- Menyetel teks navigasi ke ukuran extra small (`text-xs`).

Lokasi:
- src/components/layouts/Footer.vue

### 5) Perbaikan CSS global agar tidak mengganggu warna link komponen
- Rule global link yang sebelumnya mengenai semua `<a>` dibatasi ke `.green` saja.
- Menambah utility class warna custom seperti `text-solid-white` dan `text-solid-black`.

Lokasi:
- src/assets/main.css

### 6) Penyesuaian style pendukung
- Navbar diperbarui agar selaras tema hijau + logo.
- Font global disesuaikan (body dan heading).
- Card produk dan spacing beberapa view dirapikan.

Lokasi:
- src/components/layouts/NavBar.vue
- src/assets/base.css
- src/components/products/ProductCard.vue
- src/views/HomeView.vue

## Catatan Teknis
- Pagination saat ini sudah berjalan per halaman API.
- Filter kategori saat ini masih bekerja pada data halaman aktif.
- Jika ingin filter kategori lintas seluruh data, backend perlu menerima parameter kategori lalu mem-paginate hasil filter tersebut.
