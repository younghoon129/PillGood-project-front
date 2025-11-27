<template>
  <header class="bg-white shadow-md p-4 sticky top-0 z-10">
    <div class="container mx-auto flex justify-between items-center">
      <router-link to="/" class="text-2xl font-bold text-indigo-600"> 💊 PillGood </router-link>

      <button @click="toggleMenu" class="md:hidden p-2 rounded-lg hover:bg-gray-100">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            v-if="!isMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>

      <nav
        :class="{ hidden: !isMenuOpen, flex: isMenuOpen }"
        class="md:flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 absolute md:static top-16 left-0 right-0 bg-white md:bg-transparent shadow-lg md:shadow-none p-4 md:p-0"
      >
        <router-link
          to="/search"
          class="text-gray-600 hover:text-indigo-500 font-medium"
          @click="closeMenu"
        >
          검색
        </router-link>
        <router-link
          to="/mypage"
          class="text-gray-600 hover:text-indigo-500 font-medium"
          @click="closeMenu"
        >
          마이페이지
        </router-link>
        <router-link
          to="/login"
          class="text-white bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded-lg transition duration-300"
          @click="closeMenu"
        >
          로그인
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
const closeMenu = () => {
  isMenuOpen.value = false
}
</script>
