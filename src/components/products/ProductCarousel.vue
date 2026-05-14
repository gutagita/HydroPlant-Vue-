<script setup lang="ts">
type ImageCard = {
  id: number
  image: string
  alt: string
}

const images: ImageCard[] = [
  {
    id: 1,
    image:
      'https://plus.unsplash.com/premium_photo-1667509303187-12a4db09f2c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGh5ZHJvcG9uaWN8ZW58MHx8MHx8fDA%3D',
    alt: 'Petani hidroponik memanen sayuran segar',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1592863690193-648fb871e554?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aHlkcm9wb25pY3xlbnwwfHwwfHx8MA%3D%3D',
    alt: 'Close-up tanaman hijau pada instalasi hidroponik',
  },
]
</script>

<template>
  <section class="grid grid-cols-1 gap-4 md:grid-cols-2 pb-12">
    <div
      v-for="image in images"
      :key="image.id"
      class="overflow-hidden  bg-white/60"
    >
      <img
        :src="image.image"
        :alt="image.alt"
        class="h-56 w-full object-cover sm:h-64"
        loading="lazy"
      />
    </div>
  </section>
</template>
