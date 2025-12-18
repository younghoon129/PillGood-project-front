<script setup>
import { RouterLink, RouterView } from 'vue-router'
import AppNavBar from '@/components/common/AppNavBar.vue'
</script>

<template>
  <header>
    <AppNavBar />
    <!-- <nav>
      <RouterLink :to="{ name: 'pills_index' }">영양제 목록</RouterLink> |
      <RouterLink :to="{ name: 'login' }">로그인</RouterLink> |
      <RouterLink :to="{ name: 'signup' }">회원가입</RouterLink> 
    </nav> -->
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
