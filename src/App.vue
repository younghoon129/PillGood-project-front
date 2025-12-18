<script setup>
import { RouterLink, RouterView } from "vue-router";
import AppNavBar from "@/components/common/AppNavBar.vue";
</script>

<template>
  <header>
    <AppNavBar />
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
nav {
  padding: 20px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

nav a.router-link-active {
  color: #42b983;
}
</style>
