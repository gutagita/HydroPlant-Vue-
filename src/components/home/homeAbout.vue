<script setup lang="ts">
const leftPoints = [
	{
		title: 'Budidaya sendiri',
		text: 'Mulai tanam dari rumah dengan panduan sederhana, cocok untuk pemula sampai yang sudah terbiasa berkebun.',
	},
	{
		title: '100+ Jenis Tanaman',
		text: 'Pilih berbagai jenis sayuran, buah, dan tanaman herbal yang sesuai kebutuhan harian keluarga.',
	},
]

const rightPoints = [
	{
		title: 'Organik',
		text: 'Budidaya lebih bersih dan sehat dengan kontrol nutrisi yang baik untuk hasil panen berkualitas.',
	},
	{
		title: 'Kualitas Terbaik',
		text: 'Peralatan terpilih dan benih unggul membantu menjaga pertumbuhan tanaman tetap stabil.',
	},
]
</script>

<template>
	<section class="w-full bg-white py-16 md:py-20">
		<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-16">
			<h2 class="text-center text-3xl font-extrabold justify item-center text-[#2d4a38] md:text-4xl pb-12">
				Kenapa <span class="text-[#5f8766]">HydroPlant </span>?
			</h2>

			<div class="mt-24 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_300px_1fr] lg:gap-12">
				<div class="space-y-16 text-center lg:text-right">
					<article v-for="point in leftPoints" :key="point.title" class="space-y-8 pb-8">
						<h3 class="text-3xl font-bold text-[#0f1f17] md:text-2xl">
							{{ point.title }}
						</h3>
						<p class="text-sm leading-relaxed text-[#5d6f60] md:text-base">
							{{ point.text }}
						</p>
					</article>
				</div>

				<div class="mx-auto w-full max-w-[280px]">
					<img
						src="/images/hidroponic-tower.webp"
						alt="Menara hidroponik"
						class="h-auto w-full object-contain"
						loading="lazy"
					/>
				</div>

				<div class="space-y-16 text-center lg:text-left">
					<article v-for="point in rightPoints" :key="point.title" class="space-y-8 pb-8">
						<h3 class="text-xl font-bold text-[#0f1f17] md:text-2xl">
							{{ point.title }}
						</h3>
						<p class="text-sm leading-relaxed text-[#5d6f60] md:text-base">
							{{ point.text }}
						</p>
					</article>
				</div>
			</div>
		</div>
	</section>
</template>
