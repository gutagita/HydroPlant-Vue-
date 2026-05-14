<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import NavBar from '@/components/layouts/NavBar.vue'

const route = useRoute()
const hideNavBar = () => route.name === 'login' || route.name === 'register'
</script>

<template>
  <NavBar v-if="!hideNavBar()" />
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="in-out">
      <div :key="route.fullPath">
        <component :is="Component" />
      </div>
    </Transition>
  </RouterView>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from {
  opacity: 0;
}

.page-leave-to {
  opacity: 0;
}
</style>
