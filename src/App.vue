<script setup>
import { RouterView } from 'vue-router'
import TheHeader from './components/Header.vue'
</script>

<template>
  <TheHeader />
  <main class="container mx-auto p-4">
    <RouterView />
  </main>
</template>

<style scoped>
/* App.vue에는 CSS가 필요 없습니다. */
</style>
